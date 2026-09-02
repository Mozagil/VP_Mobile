import { Platform } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import type { TranslationKey } from '../i18n';

/** ISO 8601 dönem birimlerini gün sayısına çevirir (yaklaşık). */
const UNIT_DAYS: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };

/**
 * Ücretsiz deneme uzunluğu — gün cinsinden. Deneme teklifi store tarafında
 * tanımlanır; burada yalnızca okunur, uygulama tarafında uydurulmaz.
 * Kullanıcı bu ürünü daha önce denediyse store `introPrice` göndermez ve
 * null döner: bu durumda paywall doğru şekilde "denemesiz" metin gösterir.
 */
export function trialDays(pkg: PurchasesPackage): number | null {
  const intro = pkg.product.introPrice;
  if (!intro || intro.price > 0) return null;
  const days = (UNIT_DAYS[intro.periodUnit?.toUpperCase()] ?? 0) * intro.periodNumberOfUnits;
  return days > 0 ? days * Math.max(intro.cycles, 1) : null;
}

/** "P1M" → 'paywall.period.month' gibi bir çeviri anahtarı. */
export function periodKey(pkg: PurchasesPackage): TranslationKey {
  const match = /^P(\d+)([DWMY])$/.exec(pkg.product.subscriptionPeriod ?? '');
  switch (match?.[2]) {
    case 'W': return 'paywall.period.week';
    case 'Y': return 'paywall.period.year';
    case 'D': return 'paywall.period.day';
    default: return 'paywall.period.month';
  }
}

/** Kullanıcının ödeme yaptığı mağazanın adı — yasal metinde geçmesi gerekiyor. */
export const STORE_NAME = Platform.OS === 'ios' ? 'App Store' : 'Google Play';
