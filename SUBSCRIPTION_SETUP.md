# Abonelik Kurulumu (RevenueCat + App Store / Google Play)

7 gün ücretsiz deneme + aylık otomatik yenilenen abonelik. Ödeme ekranı Apple ve
Google'ın kendi ekranları; uygulama sadece satın almayı başlatır ve sonucu okur.

Uygulama tarafındaki kod hazır. Kalan işler bu dosyadaki panel ayarları ve backend
endpoint'i.

---

## 1. RevenueCat panel

1. [app.revenuecat.com](https://app.revenuecat.com) → yeni **Project**: `VoleyPro`
2. Project'e iki **App** ekle:
   - App Store → bundle ID `com.voleypro.mobile`
   - Play Store → package name `com.voleypro.mobile`
3. **Entitlement** identifier: `voleypro_premium`
   Bu değer kodda [src/purchases/config.ts](src/purchases/config.ts) içindeki `ENTITLEMENT_ID` ile birebir aynı olmalı.
4. **Products** → store'larda tanımladığın ürünleri içeri al (bölüm 2 ve 3'ten sonra), her birini `voleypro_premium` entitlement’ına bağla.
5. **Offerings** → `default` offering oluştur, `current` olarak işaretle, içine `$rc_monthly` package'ı ekle ve aylık ürünü bağla.
   Kod `offerings.current` okuyor; `current` işaretlenmezse paywall "seçenekler yüklenemedi" der.
6. **API Keys** → iOS ve Android **public** SDK anahtarlarını kopyala (`appl_…` / `goog_…`).
   Secret key'i uygulamaya koyma; o yalnızca backend içindir.

### Anahtarları projeye girme

`eas.json` içindeki `preview` ve `production` profillerinde duran
`REPLACE_WITH_REVENUECAT_IOS_PUBLIC_KEY` / `REPLACE_WITH_REVENUECAT_ANDROID_PUBLIC_KEY`
değerlerini gerçek anahtarlarla değiştir.

Yerel geliştirmede `.env` içindeki iki anahtar **boş bırakılabilir**: anahtar yoksa
abonelik katmanı tamamen devre dışı kalır ve uygulama paywall görmeden açılır.
Satın almayı yerelde test edeceksen anahtarları `.env`'e de gir.

### iOS için In-App Purchase Key (atlanırsa satın alma çalışmaz)

App Store Connect → Users and Access → Integrations → **In-App Purchase** → yeni key
oluştur, `.p8` dosyasını indir ve RevenueCat'te iOS app ayarlarına yükle. Ayrıca
**App-Specific Shared Secret**'i de gir.

### Android için Service Account

Google Cloud'da bir service account oluştur, JSON key indir, Play Console →
Users and permissions'ta bu hesaba **Financial data / View app information** yetkisi ver,
JSON'u RevenueCat'e yükle. Yetkinin aktif olması birkaç saat sürebilir.

---

## 2. App Store Connect

**Ön koşul:** Paid Apps sözleşmesi imzalanmış, banka ve vergi bilgileri girilmiş
olmalı. Bunlar tamamlanmadan ürünler `Missing Metadata` durumunda kalır ve cihazda
hiç görünmez.

1. Uygulama → **Subscriptions** → yeni **Subscription Group**: `VoleyPro Premium`
2. Gruba abonelik ekle:
   - Product ID: `com.voleypro.mobile.pro.monthly`
   - Duration: **1 Month**
   - Fiyat: Türkiye ve diğer pazarlar için belirle
3. Aynı ürünün altında **Introductory Offer** ekle:
   - Type: **Free Trial**
   - Duration: **1 Week**
   - Territories: satış yaptığın tüm ülkeler
4. Localization ekle (görünen ad + açıklama) — TR ve EN.
5. **Review Information**: ekran görüntüsü + inceleme notu.
6. **Sandbox tester** oluştur (Users and Access → Sandbox → Test Accounts).

> Deneme hakkı Apple Kimliği başına bir kezdir. Daha önce denemiş bir kullanıcıya
> store `introPrice` göndermez; paywall bunu algılayıp otomatik olarak denemesiz
> metne düşer ([src/purchases/format.ts](src/purchases/format.ts)).

---

## 3. Google Play Console

1. Monetize → **Subscriptions** → yeni abonelik
   - Product ID: `pro_monthly`
2. **Base plan** ekle:
   - ID: `monthly`
   - Type: **Auto-renewing**, Billing period: **1 month**
   - Fiyatları ayarla ve base plan'ı **aktive et**
3. Base plan'ın altına **Offer** ekle:
   - Offer type: **Free trial**, süre **7 gün**
   - Eligibility: *New customer acquisition → never had a subscription*
   - Offer'ı **aktive et**
4. Monetization setup → **Licensing** → test hesaplarını *License testers*'a ekle.
5. Uygulamayı en az bir kez **Internal testing** track'ine yükle.
   Play'de ürünler, uygulamanın yayınlanmış bir sürümü olmadan cihazda görünmez.

---

## 4. Backend (voleypro.com/api)

İstemcideki abonelik durumuna tek başına güvenilmez — kırılabilir. Sunucu tarafı
doğrulama RevenueCat webhook'u ile yapılır.

### 4.1 Webhook endpoint

RevenueCat panel → Project Settings → **Integrations → Webhooks**:

- URL: `https://voleypro.com/api/webhooks/revenuecat`
- Authorization header: rastgele bir gizli değer üret, backend'de birebir doğrula.

Gelen gövdedeki alanlar:

| Alan | Anlamı |
|---|---|
| `event.type` | `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`, `BILLING_ISSUE`, `PRODUCT_CHANGE`, `SUBSCRIPTION_PAUSED` |
| `event.app_user_id` | Uygulamadaki `user.id` — `Purchases.logIn(user.id)` ile bağlanıyor |
| `event.entitlement_ids` | `["voleypro_premium"]` |
| `event.expiration_at_ms` | Dönem bitişi |
| `event.period_type` | `TRIAL` \| `NORMAL` \| `INTRO` |

Yapılacak iş: `users` tablosuna `is_pro`, `subscription_period_type`,
`subscription_expires_at`, `subscription_store` alanlarını ekle ve her olayda güncelle.
`EXPIRATION` ve `BILLING_ISSUE` olaylarında `is_pro = false`.

Webhook'lar tekrar gönderilebilir; endpoint **idempotent** olmalı (`event.id` ile
tekrarları ele).

### 4.2 `/auth/me` yanıtı

Yanıta `is_pro` alanını ekle. İstemci bunu zaten okuyor
([src/auth/AuthContext.tsx](src/auth/AuthContext.tsx)) ve RevenueCat SDK'sının
durumuyla birlikte değerlendiriyor: satın alma anında webhook birkaç saniye
gecikse bile kullanıcı paywall'a geri düşmüyor.

### 4.3 Korumalı endpoint'ler

Premium içerik dönen endpoint'lerde `is_pro` kontrolü yap. Bu yapılmadığı sürece
paywall yalnızca arayüz seviyesinde bir engeldir.

---

## 5. Build ve test

Satın alma **Expo Go'da çalışmaz**, dev build gerekir:

```bash
npx expo prebuild --clean
```

```bash
npx expo run:ios
```

```bash
npx expo run:android
```

### iOS sandbox

Cihazda Settings → App Store → Sandbox Account ile test hesabına gir. Sandbox'ta
süreler kısaltılır: 1 haftalık deneme ~3 dakika, aylık yenileme ~5 dakika sürer —
yenileme ve iptal akışını böyle test edebilirsin.

### Android

License tester hesabıyla internal testing build'inden kur. Test satın almaları
ücretsizdir ve hızlandırılmış periyotlarla yenilenir.

### Kontrol listesi

- [ ] Paywall açılıyor, fiyat store'dan gelen para birimiyle görünüyor
- [ ] "7 Gün Ücretsiz Dene" → Apple/Google ödeme sayfası açılıyor
- [ ] Satın alma sonrası uygulama otomatik olarak açılıyor (yönlendirme gerekmiyor)
- [ ] Uygulamayı silip yeniden kurunca "Satın alımları geri yükle" çalışıyor
- [ ] Ayarlar → Abonelik bölümü doğru durumu ve tarihi gösteriyor
- [ ] "Aboneliği Yönet" store'un abonelik ekranını açıyor
- [ ] Store'dan iptal edilince dönem sonunda paywall geri geliyor
- [ ] Webhook backend'e düşüyor ve `is_pro` güncelleniyor

---

## 6. App Review'da reddedilmemek için

Apple'ın abonelikli uygulamalarda aradığı zorunlu maddeler — hepsi paywall'da hazır,
sadece içerikleri doğrula:

- [x] Fiyat, dönem uzunluğu ve deneme süresi paywall'da açıkça yazıyor
- [x] Otomatik yenileme ve iptal koşulları yazıyor
- [x] **Restore Purchases** butonu var (bu olmadan kesin red)
- [x] Kullanım Koşulları (EULA) ve Gizlilik Politikası linkleri var
- [x] Paywall arkasındaki kullanıcı da hesabını silebiliyor
- [ ] App Store Connect → App Information → **License Agreement** alanı dolduruldu
- [ ] App Store Connect → **Privacy Policy URL** girildi
- [ ] Kendi Kullanım Koşulların yayınlandıysa [src/purchases/config.ts](src/purchases/config.ts) içindeki `TERMS_URL` güncellendi
      (şu an Apple'ın standart EULA'sına bakıyor — bu kabul edilebilir bir varsayılan)

---

## Dosya haritası

| Dosya | İş |
|---|---|
| [src/purchases/config.ts](src/purchases/config.ts) | Anahtarlar, entitlement adı, store linkleri |
| [src/purchases/PurchasesContext.tsx](src/purchases/PurchasesContext.tsx) | SDK yaşam döngüsü, abonelik durumu, satın alma/geri yükleme |
| [src/purchases/format.ts](src/purchases/format.ts) | Deneme süresi ve dönem etiketi hesaplama |
| [src/screens/paywall/PaywallScreen.tsx](src/screens/paywall/PaywallScreen.tsx) | Paywall arayüzü |
| [src/navigation/PaywallStack.tsx](src/navigation/PaywallStack.tsx) | Paywall + yasal metinler + hesap silme |
| [src/navigation/RootNavigator.tsx](src/navigation/RootNavigator.tsx) | Giriş / paywall / uygulama yönlendirmesi |
| [src/screens/settings/SettingsScreen.tsx](src/screens/settings/SettingsScreen.tsx) | Abonelik durumu, yönetim ve geri yükleme |
