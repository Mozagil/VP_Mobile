import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import { useAuth } from '../auth/AuthContext';
import { setPaymentRequiredHandler } from '../api/client';
import { ENTITLEMENT_ID, PURCHASES_ENABLED, RC_API_KEY, STORE_SUBSCRIPTIONS_URL } from './config';

export type PurchaseOutcome =
  | { status: 'success' }
  | { status: 'cancelled' }
  | { status: 'nothing' }
  | { status: 'error'; message?: string };

type PurchasesContextValue = {
  /** RevenueCat anahtarları var mı — yoksa paywall tamamen atlanır. */
  enabled: boolean;
  /** İlk abonelik durumu okundu mu. Bu true olmadan paywall gösterilmemeli. */
  ready: boolean;
  isPro: boolean;
  /** Deneme süresi hâlâ devam ediyor mu (ilk ödeme henüz alınmadı). */
  isTrial: boolean;
  /** Aktif dönemin bitiş tarihi — ISO string. */
  expiresAt: string | null;
  /** Kullanıcı iptal etti mi (dönem sonunda yenilenmeyecek). */
  willRenew: boolean;
  offering: PurchasesOffering | null;
  packages: PurchasesPackage[];
  loadingOfferings: boolean;
  offeringsError: boolean;
  /** Store'un abonelik yönetim ekranı. */
  managementUrl: string;
  purchase: (pkg: PurchasesPackage) => Promise<PurchaseOutcome>;
  restore: () => Promise<PurchaseOutcome>;
  reloadOfferings: () => Promise<void>;
  refreshCustomerInfo: () => Promise<void>;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

function hasEntitlement(info: CustomerInfo | null): boolean {
  return !!info?.entitlements.active[ENTITLEMENT_ID];
}

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [infoReady, setInfoReady] = useState(!PURCHASES_ENABLED);
  // RevenueCat kimligi uygulama hesabiyla eslesene kadar abonelik durumu anonim
  // kullaniciya ait olur; bu bayrak olmadan abone kullanici acilista bir an
  // paywall goruyor.
  const [identityReady, setIdentityReady] = useState(!PURCHASES_ENABLED);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loadingOfferings, setLoadingOfferings] = useState(false);
  const [offeringsError, setOfferingsError] = useState(false);
  // logIn/logOut yalnızca kimlik gerçekten değiştiğinde çağrılsın: her render'da
  // çağırmak RevenueCat tarafında gereksiz ağ isteği ve alias üretir.
  const syncedUserId = useRef<string | null>(null);

  const reloadOfferings = useCallback(async () => {
    if (!PURCHASES_ENABLED) return;
    setLoadingOfferings(true);
    setOfferingsError(false);
    try {
      const offerings = await Purchases.getOfferings();
      setOffering(offerings.current ?? null);
      setOfferingsError(offerings.current == null);
    } catch {
      setOfferingsError(true);
    } finally {
      setLoadingOfferings(false);
    }
  }, []);

  const refreshCustomerInfo = useCallback(async () => {
    if (!PURCHASES_ENABLED) return;
    try {
      setCustomerInfo(await Purchases.getCustomerInfo());
    } catch {
      // Ağ yoksa SDK son bilinen durumu cache'ten sunmaya devam eder.
    }
  }, []);

  useEffect(() => {
    if (!PURCHASES_ENABLED) {
      if (__DEV__) {
        console.warn(
          '[purchases] EXPO_PUBLIC_RC_IOS_KEY / EXPO_PUBLIC_RC_ANDROID_KEY tanımlı değil — ' +
            'abonelik kontrolü devre dışı, uygulama kilitsiz açılıyor.',
        );
      }
      return;
    }

    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey: RC_API_KEY });

    // Yenileme, iptal ve store dışından gelen değişiklikler bu listener ile düşer.
    const listener = (info: CustomerInfo) => setCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(listener);

    Purchases.getCustomerInfo()
      .then(setCustomerInfo)
      .catch(() => {})
      .finally(() => setInfoReady(true));

    reloadOfferings();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [reloadOfferings]);

  // Satın alma kaydını uygulama hesabına bağla: kullanıcı cihaz değiştirdiğinde
  // aboneliği aynı hesapla geri gelsin.
  useEffect(() => {
    if (!PURCHASES_ENABLED) return;
    const id = user?.id ?? null;
    if (syncedUserId.current === id) {
      if (id === null) setIdentityReady(true);
      return;
    }
    syncedUserId.current = id;
    setIdentityReady(false);

    (async () => {
      try {
        if (id) {
          const { customerInfo: info } = await Purchases.logIn(id);
          setCustomerInfo(info);
        } else {
          setCustomerInfo(await Purchases.logOut());
        }
      } catch {
        // Zaten anonimken logOut çağrısı hata verir; kritik değil.
      } finally {
        setIdentityReady(true);
      }
      // Teklifler kullanıcıya göre hedeflenebildiği için kimlik değişiminde
      // yeniden çekiliyor; paywall'ı bekletmemesi için await edilmiyor.
      reloadOfferings();
    })();
  }, [user?.id, reloadOfferings]);

  // Sunucu 402 dondugunde abonelik durumu iki kaynaktan da yeniden okunuyor.
  // refreshUser her render'da yeni bir fonksiyon oldugu icin ref uzerinden
  // cagriliyor; aksi halde bu efekt surekli yeniden kurulurdu.
  const refreshUserRef = useRef(refreshUser);
  refreshUserRef.current = refreshUser;

  useEffect(() => {
    setPaymentRequiredHandler(async () => {
      await Promise.allSettled([refreshUserRef.current(), refreshCustomerInfo()]);
    });
    return () => setPaymentRequiredHandler(null);
  }, [refreshCustomerInfo]);

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<PurchaseOutcome> => {
    try {
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(info);
      return hasEntitlement(info) ? { status: 'success' } : { status: 'error' };
    } catch (e: any) {
      if (e?.userCancelled) return { status: 'cancelled' };
      return { status: 'error', message: e?.message };
    }
  }, []);

  const restore = useCallback(async (): Promise<PurchaseOutcome> => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return hasEntitlement(info) ? { status: 'success' } : { status: 'nothing' };
    } catch (e: any) {
      return { status: 'error', message: e?.message };
    }
  }, []);

  const value = useMemo<PurchasesContextValue>(() => {
    const entitlement = customerInfo?.entitlements.active[ENTITLEMENT_ID] ?? null;
    return {
      enabled: PURCHASES_ENABLED,
      ready: infoReady && identityReady,
      // Sunucu tarafı `is_pro` yedek kaynak: satın alma sonrası webhook gecikmesinde
      // veya SDK cache'i boşken kullanıcıyı yanlışlıkla paywall'a düşürmemek için.
      isPro: PURCHASES_ENABLED ? entitlement != null || user?.is_pro === true : true,
      isTrial: entitlement?.periodType === 'TRIAL',
      expiresAt: entitlement?.expirationDate ?? null,
      willRenew: entitlement?.willRenew ?? false,
      offering,
      packages: offering?.availablePackages ?? [],
      loadingOfferings,
      offeringsError,
      managementUrl: customerInfo?.managementURL ?? STORE_SUBSCRIPTIONS_URL,
      purchase,
      restore,
      reloadOfferings,
      refreshCustomerInfo,
    };
  }, [
    customerInfo, infoReady, identityReady, offering, loadingOfferings, offeringsError,
    user?.is_pro, purchase, restore, reloadOfferings, refreshCustomerInfo,
  ]);

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchases() {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error('usePurchases must be inside PurchasesProvider');
  return ctx;
}
