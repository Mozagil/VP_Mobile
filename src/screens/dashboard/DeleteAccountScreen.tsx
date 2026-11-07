import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api/client';
import Icon from '../../components/ui/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n, LOCALE } from '../../i18n';

type Props = { navigation: NativeStackNavigationProp<any> };

const DELETED_ITEMS = [
  'account.deleteItem.profile',
  'account.deleteItem.history',
  'account.deleteItem.stats',
  'account.deleteItem.goals',
  'account.deleteItem.settings',
] as const;

/** Sunucu tarihi saat dilimi isareti olmadan (UTC) gonderir; "Z" ekleyip yerel tarihe ceviriyoruz. */
export function formatPurgeDate(iso: string, locale: string): string {
  const d = new Date(/Z|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

function serverMessage(e: unknown): string | null {
  const detail = (e as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (detail && typeof detail === 'object' && 'message' in detail) return String((detail as { message: unknown }).message);
  return null;
}

// Hesap silme hemen gerceklesmez: 30 gunluk bekleme suresi baslar, hesap bu
// surede kullanilir kalir ve talep bu ekrandan iptal edilebilir. Sure dolunca
// sunucu hesabi kalici siler (backend: services/account_deletion.py).
export default function DeleteAccountScreen({ navigation }: Props) {
  const { user, refreshUser } = useAuth();
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [busy, setBusy] = useState(false);
  const pending = user?.deletion ?? null;

  const handleDelete = async () => {
    setBusy(true);
    try {
      const { data } = await apiClient.delete<{ purge_at: string }>('/auth/me');
      await refreshUser();
      Alert.alert(
        t('account.deleteRequestedTitle'),
        t('account.deleteRequestedBody', { date: formatPurgeDate(data.purge_at, LOCALE[lang]) }),
      );
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      // 409: uyeli bir takimin tek bas antrenoru; sunucu mesaji takimlari sayar.
      Alert.alert(status === 409 ? t('account.deleteBlockedTitle') : t('common.error'), serverMessage(e) ?? t('account.deleteError'));
    } finally {
      setBusy(false);
    }
  };

  const handleCancelDeletion = async () => {
    setBusy(true);
    try {
      await apiClient.post('/auth/me/cancel-deletion');
      await refreshUser();
      Alert.alert(t('common.ok'), t('account.deletionCancelled'));
    } catch {
      Alert.alert(t('common.error'), t('account.cancelDeletionError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} disabled={busy}>
          <Icon name="geri" size={20} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('account.deleteTitle')}</Text>
        <View style={{ width: 20 }} />
      </View>

      {pending ? (
        <>
          <View style={s.body}>
            <View style={[s.iconCircle, { backgroundColor: colors.warning }]}>
              <Icon name="uyari" size={40} />
            </View>
            <Text style={s.title}>{t('account.pendingTitle')}</Text>
            <Text style={s.subtitle}>{t('account.pendingBody', { date: formatPurgeDate(pending.purge_at, LOCALE[lang]) })}</Text>
          </View>
          <View style={s.footer}>
            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: colors.accent }, busy && { opacity: 0.7 }]}
              activeOpacity={0.85}
              disabled={busy}
              onPress={handleCancelDeletion}
            >
              {busy ? <ActivityIndicator color="#ffffff" /> : <Text style={s.primaryBtnTxt}>{t('account.cancelDeletion')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} disabled={busy} onPress={() => navigation.goBack()}>
              <Text style={s.cancelTxt}>{t('common.ok')}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={s.body}>
            <View style={s.iconCircle}>
              <Icon name="sil" size={40} />
            </View>

            <Text style={s.title}>{t('account.deleteConfirm')}</Text>
            <Text style={s.subtitle}>{t('account.deleteWarning')}</Text>

            <View style={s.card}>
              <Text style={s.cardTitle}>{t('account.deletedDataTitle')}</Text>
              {DELETED_ITEMS.map((item) => (
                <View key={item} style={s.bulletRow}>
                  <View style={s.bulletDot} />
                  <Text style={s.bulletTxt}>{t(item)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.footer}>
            <TouchableOpacity
              style={[s.primaryBtn, busy && { opacity: 0.7 }]}
              activeOpacity={0.85}
              disabled={busy}
              onPress={handleDelete}
            >
              {busy ? <ActivityIndicator color="#ffffff" /> : <Text style={s.primaryBtnTxt}>{t('account.deleteButton')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} disabled={busy} onPress={() => navigation.goBack()}>
              <Text style={s.cancelTxt}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },

  body: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 20 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  title: { color: colors.foreground, fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19, marginBottom: 24 },

  card: {
    width: '100%', backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  cardTitle: { color: colors.foreground, fontSize: 13, fontWeight: '800', marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.error },
  bulletTxt: { color: colors.muted, fontSize: 13 },

  footer: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  primaryBtn: {
    backgroundColor: colors.error, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnTxt: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', paddingVertical: 6 },
  cancelTxt: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  });
}
