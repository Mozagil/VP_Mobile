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
5. **Offerings** → `default` offering, **Current** işaretli. İki package:
   - `$rc_monthly` → aylık ürünler (Test Store + Play + App Store)
   - `$rc_annual` → yıllık ürünler
   Bir package mağaza başına bir ürün tutar; SDK hangi ortamdaysa doğru olanı seçer.
   Kod `offerings.current` okuyor; `current` işaretlenmezse paywall "seçenekler yüklenemedi" der.
   Package kimlikleri RevenueCat'in standart adları olmalı — `$rc_annual` yerine özel
   bir isim verilirse paywall paketi listeler ama yıllık olduğunu anlayamaz.
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

### Android için Service Account (kuruldu)

Google Cloud projesi `voleypro-505308`, servis hesabı
`revenuecat-service-account@voleypro-505308.iam.gserviceaccount.com`.

Kurulum Cloud Shell'de tek blokla yapıldı: 5 API etkinleştirildi
(`cloudresourcemanager`, `iam`, `androidpublisher`, `playdeveloperreporting`,
`pubsub`), servis hesabı oluşturuldu, `roles/pubsub.editor` ve
`roles/monitoring.viewer` verildi, JSON anahtar üretildi.

Play Console → Kullanıcılar ve izinler'de bu hesaba dört izin verildi:
uygulama bilgilerini görüntüleme, finansal verileri görüntüleme, siparişleri ve
abonelikleri yönetme, mağazadaki varlığı yönetme.

> Doğrulamanın üç kontrolünden ikisi (katalog okuma) anında geçer; üçüncüsü
> (satın alma doğrulama) finansal izinlerin yayılmasını bekler — 36 saati
> bulabiliyor. Products → **Import** çalışıyorsa kimlik bilgileri sağlamdır.

---

## 2. App Store Connect

**Ön koşul:** Paid Apps sözleşmesi imzalanmış, banka ve vergi bilgileri girilmiş
olmalı. Bunlar tamamlanmadan ürünler `Missing Metadata` durumunda kalır ve cihazda
hiç görünmez.

1. Uygulama → **Subscriptions** → yeni **Subscription Group**: `VoleyPro Premium`
2. Gruba **iki** abonelik ekle — App Store'da base plan kavramı yok, her süre ayrı ürün:

   | Product ID | Duration | Türkiye | Avrupa |
   |---|---|---|---|
   | `voleypro_membership_monthly` | 1 Month | ₺99 | €5,99 |
   | `voleypro_membership_annual` | 1 Year | ₺990 | €59,99 |

3. Her ürünün altında **Introductory Offer** ekle:
   - Type: **Free Trial**
   - Duration: **1 Week**
   - Territories: fiyat tanımladığın tüm ülkeler
4. Localization ekle (görünen ad + açıklama) — TR ve EN.
5. **Review Information**: ekran görüntüsü + inceleme notu.
6. **Sandbox tester** oluştur (Users and Access → Sandbox → Test Accounts).

> Deneme hakkı Apple Kimliği başına bir kezdir. Daha önce denemiş bir kullanıcıya
> store `introPrice` göndermez; paywall bunu algılayıp otomatik olarak denemesiz
> metne düşer ([src/purchases/format.ts](src/purchases/format.ts)).

---

## 3. Google Play Console

**Ön koşullar (sırayla, atlanamaz):**

1. **Google Payments satıcı hesabı** — bu olmadan abonelik ürünü oluşturulamaz.
2. **Play Billing kütüphanesi içeren bir sürüm yüklenmiş olmalı.** Play, abonelik
   oluşturma ekranını ancak öyle açıyor; aksi halde "Yeni bir APK yükleyin" der.
   Yani sıra: build al → dahili teste yükle → ürünü oluştur.

**Kurulan yapı:**

```
Ürün: voleypro_membership          (VoleyPro Premium)
  ├─ temel plan: monthly   1 ay    ₺99   / €5,99   + freetrial-monthly (7 gün)
  └─ temel plan: annual    1 yıl   ₺990  / €59,99  + freetrial-annual  (7 gün)
```

Ülkeler: Türkiye, Almanya, Avusturya, Hollanda. Fiyatı olmayan ülkede ürün satılmaz;
satış yapılmayacak ülkeleri *Ülke/bölge bazında kullanım durumunu yönet* ile kapat,
yoksa Play fiyatsız açık ülkeleri hata sayar.

**Kalıcı alanlar** — kaydedildikten sonra hiçbiri değiştirilemez:
ürün kimliği, temel plan kimliği, teklif kimliği, temel planın fatura dönemi.
Fatura dönemi menüsü varsayılan olarak **Aylık** gelir; yıllık plan eklerken
kaydetmeden önce "Yıllık, otomatik yenileme" yazdığını doğrula.

**Teklif uygunluğu:** *Yeni müşteri edinme → hiçbir abonelik edinmemiş* seçildi —
kullanıcı başına ömür boyu tek deneme. İleride Kulüp ürünü eklenirse aynı kişi
ikinci kez deneme alamaz.

Her temel planı ve her teklifi ayrı ayrı **etkinleştir**. Taslak durumdaki plan
veya teklif cihazda hiç görünmez.

**Test hesapları** (iki ayrı liste, ikisi de gerekli):
- Dahili test → **Test kullanıcıları** → uygulamayı indirebilmek için
- Ayarlar → **Lisans testi** → satın almaları ücretsiz ve hızlandırılmış yapmak için

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

**Erişim kuralı** — `EXPIRATION` ve `SUBSCRIPTION_PAUSED` erişimi kapatır. `CANCELLATION`
ve `BILLING_ISSUE` **kapatmaz**: iptal eden kullanıcı dönem sonuna kadar, ödemesi
başarısız olan kullanıcı ek süre boyunca (Play'de 7-14 gün) kullanmaya devam eder.
Her ikisinde de gerçek kapanış `EXPIRATION` olarak gelir. Diğer olaylarda
`expiration_at_ms` geleceyse erişim açıktır.

Webhook'lar tekrar gönderilebilir ve sıralı gelmeyebilir; `event_timestamp_ms`
saklanıp daha eski olaylar yok sayılmalı — aksi halde eski bir olay iptal edilmiş
bir aboneliği yeniden açabilir.

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

Gerçek satın alma **Expo Go'da çalışmaz** — StoreKit ve Play Billing native.
Ama SDK Expo Go'yu algılayıp **Browser Mode**'a düşüyor: RevenueCat **Test Store**
anahtarıyla (`test_…`) paywall arayüzü ve simüle satın alma akışı test edilebilir.
`appl_`/`goog_` anahtarları Expo Go'da açıkça reddedilir.

```bash
npx expo start --go --port 8082 --clear
```

Gerçek ödeme panelini görmek için store build'i gerekiyor:

```bash
npx eas build --profile production --platform android
```

Çıkan `.aab` Play Console → **Dahili test**'e yüklenir (kapalı teste değil —
ürünler bağlanana kadar paywall "seçenekler yüklenemedi" der ve test
kullanıcıları uygulamaya giremez).

> EAS ücretsiz kuyruğunda Android build'i saatlerce bekleyebiliyor; derlemenin
> kendisi 10-15 dakika. Yerel derleme için Android SDK'nın `build-tools` ve
> `platforms` bileşenleri gerekiyor (`platform-tools` tek başına yetmiyor) ve
> `eas build --local` Windows'ta desteklenmiyor.

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
