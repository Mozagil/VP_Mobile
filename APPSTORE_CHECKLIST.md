# App Store Yayına Alma Checklist'i

## Ön koşul (blocker)
- [ ] Backend production'da gerçek bir domain üzerinden **HTTPS** ile yayında (iOS App Transport Security, varsayılan olarak HTTP isteklerini engeller). `EXPO_PUBLIC_API_URL` production build'lerde bu HTTPS adresine ayarlanmalı.

## Kimlik / config
- [x] `app.json` → `ios.bundleIdentifier`: `com.voleypro.mobile` (değiştirilecekse Apple Developer hesabındaki App ID ile birebir eşleşmeli)
- [ ] Apple Developer Program üyeliği aktif ($99/yıl)
- [ ] App Store Connect'te uygulama kaydı oluşturuldu

## EAS Build
- [ ] `npx eas login`
- [ ] `npx eas build:configure` (proje EAS'e bağlanır, `app.json` → `extra.eas.projectId` otomatik eklenir)
- [ ] `npx eas build --profile development --platform ios` → dev client fiziksel iPhone'a kurulup manuel QA yapılır
- [ ] `npx eas build --profile preview --platform ios` → TestFlight iç test grubu
- [ ] `npx eas build --profile production --platform ios` → App Store submission

## Test
- [x] Jest birim testleri: `npm test` (auth/token storage, api client 401→refresh akışı, AuthContext login/logout)
- [ ] Manuel QA checklist (fiziksel cihazda): login/register, training plan CRUD, favoriler, bildirim izinleri, oturum süresi dolunca otomatik refresh
- [ ] TestFlight beta geri bildirimi toplanır

## App Store Connect materyalleri
- [ ] Gizlilik politikası URL'i
- [ ] App Privacy anketi (toplanan veriler: email, profil bilgisi — bkz. backend `Profile`/`User` modeli)
- [ ] Yaş derecelendirmesi
- [ ] Ekran görüntüleri (gerekli cihaz boyutları)
- [ ] Türkçe mağaza açıklaması ve anahtar kelimeler

## Notlar
- Push notification (APNs) şu an kullanılmıyor — yalnızca yerel zamanlanmış bildirimler var (`expo-notifications`). Sunucu taraflı push planlanırsa `eas credentials` ile APNs key/certificate kurulumu ayrı bir iş kalemi olarak ele alınmalı.
- Token'lar artık `expo-secure-store` (Keychain/Keystore) üzerinde tutuluyor — önceki `AsyncStorage` düz metin saklama kaldırıldı.
