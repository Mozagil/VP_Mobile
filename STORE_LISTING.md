# Mağaza Sayfası Metinleri (TR + EN)

Google Play Console ve App Store Connect'e yapıştırmaya hazır metinler. Karakter
sınırları her alanın başlığında; metinler sınırların içinde kalacak şekilde yazıldı
(`node scripts/check-store-listing.mjs` ile doğrulanır).

Uygulama ilk sürümde ücretsiz olduğu için metinlerde fiyat, deneme süresi ya da
abonelik sözü yok. Ücretli döneme geçince "Ücretsiz başla" ifadeleri güncellenmeli.

---

## Konsolda yapılacaklar

### Google Play Console

1. **Mağazada varlık → Ana mağaza girişi**: Varsayılan dil Türkçe (tr-TR) kalabilir.
   Aşağıdaki **TR** metinleri buraya.
2. Aynı sayfada **Çevirileri yönet → Çeviri ekle → English (United States) – en-US**
   ve **English (United Kingdom) – en-GB**. Aşağıdaki **EN** metinleri ikisine de.
   Çevirisi olmayan ülkelerde Play varsayılan dili gösterir; İngilizce eklenmezse
   yabancı kullanıcı Türkçe sayfa görür.
3. Her İngilizce çeviriye **İngilizce ekran görüntüleri** yüklenmeli (aşağıda).
   Yüklenmezse Türkçe görüntüler gösterilir.

### App Store Connect

1. **Uygulama Bilgileri → Yerelleştirilebilir Bilgiler**: dil menüsünden
   **English (U.S.)** ve **English (U.K.)** ekleyin; Ad ve Alt Başlık buraya.
2. **Sürüm sayfası (iOS uygulaması → sürüm)**: aynı dillerde Tanıtım Metni,
   Açıklama, Anahtar Kelimeler ve ekran görüntüleri.
3. Apple, cihaz diliyle eşleşen yerelleştirmeyi gösterir; eşleşme yoksa birincil
   dili. Birincil dil Türkçe ise İngilizce yerelleştirme eklemek zorunlu.
4. **Fiyatlandırma ve Kullanılabilirlik**: uygulama şu an ABD mağazasında açılmıyor
   (`apps.apple.com/us/...` 404). Tüm ülkelerin seçili olduğunu kontrol edin.

Ad ve alt başlık değişikliği yeni bir sürüm gönderimiyle yayına girer. Açıklama ve
tanıtım metni de sürüme bağlıdır; tanıtım metni ise sürüm göndermeden değiştirilebilir.

---

## Ekran görüntüleri

Uygulama artık cihaz diline göre açılıyor (dil seçilmemişse). İngilizce görüntüler için:

1. Test cihazının / simülatörün dilini **English** yapın, uygulamayı silip yeniden
   kurun (kayıtlı dil seçimi silinsin) ya da Profil → Dil → English seçin.
2. Mevcut Türkçe setle aynı ekranları aynı sırayla çekin:
   ana sayfa, dril kütüphanesi, dril detayı (video), hazır antrenmanlar, antrenman
   oynatıcı, takvim, voleybol sözlüğü.
3. Görüntülerin üstünde başlık yazısı varsa İngilizce başlıklar:

| Ekran | TR başlık | EN başlık |
| --- | --- | --- |
| Ana sayfa | Antrenmanını seç, filede iz bırak | Pick your session, own the net |
| Dril kütüphanesi | 50+ videolu voleybol drili | 50+ volleyball drills on video |
| Dril detayı | Her hareket adım adım | Every drill, step by step |
| Hazır antrenmanlar | 45 dakikalık hazır programlar | Ready-made 45-minute sessions |
| Antrenman oynatıcı | Süre ve sıra senin yerine takipte | Timer and order handled for you |
| Takvim | Haftanı planla, ilerlemeni gör | Plan your week, see your progress |
| Sözlük | A'dan Z'ye 100+ voleybol terimi | 100+ volleyball terms, A to Z |

Gereken boyutlar: Play için telefon (en az 2, önerilen 4-8) ve 7"/10" tablet;
App Store için 6.9" iPhone ve 13" iPad (Downloads'taki "App Goruntuleri" klasöründeki
Türkçe setle aynı klasör yapısı kullanılabilir).

---

## Google Play

### TR

**Uygulama adı** (30)

VoleyPro: Voleybol Antrenmanı

**Kısa açıklama** (80)

Videolu voleybol drilleri, kişisel antrenman planı ve takvim. Ücretsiz başla.

**Tam açıklama** (4000)

VoleyPro, voleybolda kendini geliştirmek isteyen oyuncular ve antrenörler için hazırlanmış bir antrenman uygulamasıdır. Seviyene, pozisyonuna ve hedeflerine uygun antrenmanı seç, videolu drillerle çalış, ilerlemeni takip et.

DRİL KÜTÜPHANESİ
• 50'den fazla videolu voleybol drili
• Servis, manşet, parmak pas, smaç, blok ve savunma çalışmaları
• Isınma ve soğuma hareketleri
• Kategori, zorluk seviyesi, oyuncu sayısı ve süreye göre filtreleme
• Her hareket için açıklama, süre ve uygulama ipuçları

KİŞİSEL ANTRENMAN PLANI
• Adım adım kendi antrenman planını oluştur, takvime ekle
• Hazır, yaklaşık 45 dakikalık antrenman programları
• Kütüphaneden istediğin drilleri kendi antrenmanına ekle
• Isınma, ana antrenman ve soğuma bölümleriyle dengeli yapı

ANTRENMAN OYNATICI
• Drilleri sırayla, videolu olarak takip et
• Süre sayacı her hareketi senin yerine takip eder
• Tamamladığın antrenmanlar geçmişine kaydedilir

TAKVİM VE İLERLEME
• Antrenmanlarını takvime planla, hatırlatıcı al
• Tamamlanan ve kaçırılan antrenmanları gör
• Antrenman geçmişini ve ilerlemeni takip et

VOLEYBOL SÖZLÜĞÜ
• A'dan Z'ye 100'den fazla voleybol terimi
• Türkçe ve İngilizce açıklamalar

TÜRKÇE VE İNGİLİZCE
Uygulama telefonunun diline göre açılır; dilediğin zaman profilinden değiştirebilirsin.

Hesabın web sitesiyle ortaktır: voleypro.com'da da aynı hesapla giriş yapıp antrenmanlarına devam edebilirsin.

### EN

**App name** (30)

VoleyPro: Volleyball Training

**Short description** (80)

Video volleyball drills, personal training plans and a calendar. Start for free.

**Full description** (4000)

VoleyPro is a training app for volleyball players and coaches who want to get better. Pick a session that fits your level, position and goals, train with video drills and track your progress.

DRILL LIBRARY
• 50+ volleyball drills on video
• Serving, passing, setting, attacking, blocking and defense
• Warm-up and cool-down exercises
• Filter by category, difficulty, number of players and duration
• Instructions, duration and coaching tips for every drill

PERSONAL TRAINING PLAN
• Build your own training plan step by step and add it to your calendar
• Ready-made sessions of about 45 minutes
• Add any drill from the library to your own session
• Balanced structure: warm-up, main session, cool-down

WORKOUT PLAYER
• Follow your drills in order, with video
• A timer keeps track of every exercise for you
• Finished sessions are saved to your history

CALENDAR AND PROGRESS
• Schedule your sessions and get reminders
• See completed and missed sessions
• Follow your training history and progress

VOLLEYBALL GLOSSARY
• 100+ volleyball terms from A to Z
• Explanations in English and Turkish

ENGLISH AND TURKISH
The app opens in your phone's language; you can switch it any time in your profile.

Your account works on the web too: sign in at voleypro.com and continue where you left off.

---

## App Store

### TR

**Ad** (30)

VoleyPro: Voleybol Antrenmanı

**Alt başlık** (30)

Dril, plan ve takvim tek yerde

**Tanıtım metni** (170)

Videolu drillerle voleybol antrenmanı: seviyene uygun planını oluştur, hazır 45 dakikalık programlarla çalış, ilerlemeni takvimden takip et. Ücretsiz başla.

**Anahtar kelimeler** (100, virgülle, boşluksuz)

voleybol,antrenman,dril,smaç,manşet,pas,servis,blok,antrenör,program,egzersiz,takım,kondisyon

**Açıklama** (4000)

Google Play TR tam açıklamasının aynısı.

### EN

**Name** (30)

VoleyPro: Volleyball Training

**Subtitle** (30)

Drills, plans and a calendar

**Promotional text** (170)

Volleyball training with video drills: build a plan for your level, train with ready-made 45-minute sessions and track your progress on the calendar. Start for free.

**Keywords** (100, comma separated, no spaces)

volleyball,drills,coach,spike,serve,setter,passing,workout,practice,team,skills,beach,libero

**Description** (4000)

Same as the Google Play EN full description.
