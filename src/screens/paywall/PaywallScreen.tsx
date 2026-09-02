import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PurchasesPackage } from 'react-native-purchases';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';
import { useAuth } from '../../auth/AuthContext';
import { usePurchases } from '../../purchases/PurchasesContext';
import { periodKey, trialDays, STORE_NAME } from '../../purchases/format';
import { TERMS_URL } from '../../purchases/config';

const BENEFITS = [
  'paywall.benefit.programs',
  'paywall.benefit.library',
  'paywall.benefit.ai',
  'paywall.benefit.tracking',
] as const;

type Props = { navigation: NativeStackNavigationProp<any> };

export default function PaywallScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { signOut } = useAuth();
  const { packages, offering, loadingOfferings, offeringsError, reloadOfferings, purchase, restore } = usePurchases();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [selected, setSelected] = useState<PurchasesPackage | null>(null);
  const [busy, setBusy] = useState(false);

  // Teklifler asenkron geldigi icin secim onlar yuklendikten sonra kuruluyor;
  // aylik paket varsa varsayilan o olsun.
  useEffect(() => {
    if (!selected && packages.length > 0) {
      setSelected(offering?.monthly ?? packages[0]);
    }
  }, [packages, offering, selected]);

  const days = selected ? trialDays(selected) : null;

  const onPurchase = async () => {
    if (!selected) return;
    setBusy(true);
    const result = await purchase(selected);
    setBusy(false);
    if (result.status === 'error') {
      Alert.alert(t('common.error'), result.message || t('paywall.purchaseFailed'));
    }
    // 'success' durumunda entitlement guncellenir ve RootNavigator otomatik olarak
    // uygulamaya gecer; ayrica bir yonlendirme yapmaya gerek yok.
  };

  const onRestore = async () => {
    setBusy(true);
    const result = await restore();
    setBusy(false);
    if (result.status === 'nothing') {
      Alert.alert(t('paywall.restoreTitle'), t('paywall.restoreNothing'));
    } else if (result.status === 'error') {
      Alert.alert(t('common.error'), result.message || t('paywall.restoreFailed'));
    }
  };

  const confirmSignOut = () => {
    Alert.alert(t('paywall.signOutTitle'), t('paywall.signOutBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('account.logoutTitle'), style: 'destructive', onPress: () => { signOut(); } },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.heroIcon}>
            <Icon name="voleybol-topu" size={36} />
          </View>
          <Text style={s.title}>{t('paywall.title')}</Text>
          <Text style={s.subtitle}>{t('paywall.subtitle')}</Text>
        </View>

        <View style={s.benefits}>
          {BENEFITS.map((key) => (
            <View key={key} style={s.benefitRow}>
              <Icon name="tamamlandi" size={18} />
              <Text style={s.benefitText}>{t(key)}</Text>
            </View>
          ))}
        </View>

        {loadingOfferings && packages.length === 0 ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 32 }} />
        ) : offeringsError || packages.length === 0 ? (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{t('paywall.loadError')}</Text>
            <Button title={t('paywall.retry')} variant="outline" onPress={reloadOfferings} />
          </View>
        ) : (
          <>
            {packages.map((pkg) => {
              const active = selected?.identifier === pkg.identifier;
              const pkgTrial = trialDays(pkg);
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[s.planCard, active && s.planCardActive]}
                  activeOpacity={0.85}
                  onPress={() => setSelected(pkg)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={s.planPeriod}>{t(periodKey(pkg))}</Text>
                    {/* Fiyat store'dan geldigi gibi gosteriliyor: para birimi ve
                        bicim kullanicinin store ulkesine gore degisir. */}
                    <Text style={s.planPrice}>{pkg.product.priceString}</Text>
                  </View>
                  {pkgTrial != null && (
                    <View style={s.trialBadge}>
                      <Text style={s.trialBadgeText}>{t('paywall.trialBadge', { n: pkgTrial })}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            <Button
              title={days != null ? t('paywall.ctaTrial', { n: days }) : t('paywall.ctaBuy')}
              onPress={onPurchase}
              loading={busy}
              style={{ marginTop: 18 }}
            />

            <Text style={s.fine}>
              {days != null
                ? t('paywall.fineTrial', { n: days, price: selected?.product.priceString ?? '', store: STORE_NAME })
                : t('paywall.fineNoTrial', { price: selected?.product.priceString ?? '', store: STORE_NAME })}
            </Text>
          </>
        )}

        <TouchableOpacity style={s.linkBtn} onPress={onRestore} disabled={busy}>
          <Text style={s.link}>{t('paywall.restore')}</Text>
        </TouchableOpacity>

        <View style={s.legalRow}>
          <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)}>
            <Text style={s.legalLink}>{t('paywall.terms')}</Text>
          </TouchableOpacity>
          <Text style={s.legalSep}>·</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Legal', { doc: 'privacy' })}>
            <Text style={s.legalLink}>{t('paywall.privacy')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.linkBtn} onPress={confirmSignOut}>
          <Text style={s.mutedLink}>{t('paywall.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20, paddingBottom: 32 },

    hero: { alignItems: 'center', marginTop: 12, marginBottom: 22 },
    heroIcon: {
      width: 68, height: 68, borderRadius: 34, backgroundColor: colors.cardAlt,
      alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    },
    title: { color: colors.foreground, fontSize: 22, fontWeight: '800', textAlign: 'center' },
    subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8 },

    benefits: {
      backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
      padding: 16, gap: 12, marginBottom: 22,
    },
    benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    benefitText: { color: colors.foreground, fontSize: 14, flex: 1, lineHeight: 20 },

    planCard: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
      paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10,
    },
    planCardActive: { borderColor: colors.accent, backgroundColor: colors.cardAlt },
    planPeriod: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
    planPrice: { color: colors.foreground, fontSize: 20, fontWeight: '800', marginTop: 2 },
    trialBadge: { backgroundColor: colors.accent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
    trialBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },

    errorBox: { gap: 12, marginVertical: 12 },
    errorText: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },

    fine: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 14, textAlign: 'center' },

    linkBtn: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 8 },
    link: { color: colors.accent, fontSize: 14, fontWeight: '700' },
    mutedLink: { color: colors.muted, fontSize: 13 },

    legalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    legalLink: { color: colors.muted, fontSize: 12, textDecorationLine: 'underline' },
    legalSep: { color: colors.muted, fontSize: 12 },
  });
}
