import { Platform } from 'react-native';

/**
 * RevenueCat yapılandırması.
 *
 * Anahtarlar RevenueCat panelinde Project Settings → API Keys altındaki
 * **public SDK key**'lerdir (`appl_…` / `goog_…`). Bunlar istemciye gömülmek
 * üzere tasarlanmıştır, gizli değildir — secret key'i ASLA buraya koyma.
 */
export const RC_API_KEY =
  Platform.select({
    ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
    android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
  }) ?? '';

/**
 * RevenueCat panelinde tanımlı entitlement kimliği (Product catalog →
 * Entitlements → Identifier sütunu). Panelde değiştirirsen burayı da güncelle:
 * eşleşmezse satın alma başarılı olur ama uygulama erişimi açmaz.
 */
export const ENTITLEMENT_ID = 'voleypro_premium';

/**
 * Anahtar yoksa (ör. anahtarlar girilmeden yapılan yerel geliştirme build'i)
 * satın alma katmanı tamamen devre dışı kalır ve paywall gösterilmez.
 * Production build'lerde anahtarların eas.json üzerinden geldiğinden emin ol —
 * aksi halde uygulama herkese ücretsiz açılır.
 */
export const PURCHASES_ENABLED = RC_API_KEY.length > 0;

/** Kullanıcının aboneliğini yönettiği store ekranı (managementURL yoksa yedek). */
export const STORE_SUBSCRIPTIONS_URL = Platform.select({
  ios: 'https://apps.apple.com/account/subscriptions',
  android: 'https://play.google.com/store/account/subscriptions',
}) as string;

/**
 * Kullanım Koşulları (EULA) bağlantısı. Apple, abonelik satan uygulamalarda
 * paywall üzerinde EULA linkini zorunlu tutuyor ve kendi metnin yoksa aşağıdaki
 * standart EULA'yı kabul ediyor. Kendi koşullarını yayınladığında bu adresi
 * değiştir ve App Store Connect'teki "License Agreement" alanını da güncelle.
 */
export const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
