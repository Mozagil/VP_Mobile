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
 * Ücretsiz dönem anahtarı. eas.json'da `EXPO_PUBLIC_PAYWALL_ENABLED: "false"`
 * iken RevenueCat SDK hiç başlatılmaz, paywall açılmaz ve Ayarlar'daki
 * Abonelik bölümü görünmez; anahtarlar yerinde kalır. Ücretliye dönerken bu
 * değişkeni eas.json'dan kaldırman (veya "true" yapman) yeterli.
 * Sunucudaki karşılığı: backend .env → PREMIUM_GATING_ENABLED.
 */
export const PAYWALL_ENABLED = process.env.EXPO_PUBLIC_PAYWALL_ENABLED !== 'false';

/**
 * Anahtar yoksa (ör. anahtarlar girilmeden yapılan yerel geliştirme build'i)
 * veya paywall bayrağı kapalıysa satın alma katmanı tamamen devre dışı kalır
 * ve paywall gösterilmez. Ücretli döneme dönerken anahtarların eas.json
 * üzerinden geldiğinden emin ol — aksi halde uygulama herkese ücretsiz açılır.
 */
export const PURCHASES_ENABLED = PAYWALL_ENABLED && RC_API_KEY.length > 0;

/** Kullanıcının aboneliğini yönettiği store ekranı (managementURL yoksa yedek). */
export const STORE_SUBSCRIPTIONS_URL = Platform.select({
  ios: 'https://apps.apple.com/account/subscriptions',
  android: 'https://play.google.com/store/account/subscriptions',
}) as string;

/*
 * Kullanım Koşulları artık uygulamanın içinde: src/data/legalTexts.ts içindeki
 * `terms` dokümanı, Legal ekranından gösteriliyor. Apple abonelik satan
 * uygulamalarda paywall üzerinde EULA bağlantısını zorunlu tutuyor; kendi
 * metnimiz olduğu için Apple'ın standart EULA adresine artık ihtiyaç yok.
 * App Store Connect'teki "License Agreement" alanı da bu metinle aynı olmalı.
 */
