import type { Lang } from '../i18n';

// KVKK Aydınlatma Metni ve Gizlilik Politikası içerikleri.
// Metinler uygulamanın gerçek veri akışına göre yazılmıştır: veriler
// voleypro.com altyapısında (Türkiye) tek origin üzerinden işlenir, üçüncü
// taraf analitik/reklam SDK'sı yoktur (RevenueCat yalnızca satın alma
// doğrulaması), bildirimler cihaz üzerinde yereldir. Sunucu, girişte cihaz
// türünü ve IP'den türetilen ülke/şehri kaydeder; şifreli yedekler e-postayla
// Hostinger'a gider (30 gün); hesap silme 30 gün bekleme süreli.
// İçerik değişirse LAST_UPDATED tarihini de güncelleyin.

export type LegalDocKey = 'kvkk' | 'privacy' | 'terms';
export type LegalSection = { heading: string; body: string };
export type LegalDoc = { title: string; updated: string; sections: LegalSection[] };

export const SUPPORT_EMAIL = 'info@voleypro.com';

const LAST_UPDATED_TR = 'Son güncelleme: 7 Kasım 2026';
const LAST_UPDATED_EN = 'Last updated: 7 November 2026';

const KVKK_TR: LegalDoc = {
  title: 'KVKK Aydınlatma Metni',
  updated: LAST_UPDATED_TR,
  sections: [
    {
      heading: '1. Veri Sorumlusu',
      body: `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") m.10 uyarınca, VoleyPro mobil uygulamasını kullanan ilgili kişileri bilgilendirmek amacıyla hazırlanmıştır.

Veri sorumlusu: VoleyPro
İletişim: ${SUPPORT_EMAIL}
Uygulama: VoleyPro mobil uygulaması (iOS ve Android)`,
    },
    {
      heading: '2. İşlediğimiz Kişisel Veriler',
      body: `• Kimlik bilgisi: ad, soyad
• İletişim bilgisi: e-posta adresi
• İşlem güvenliği bilgisi: şifrelenmiş (hash'lenmiş) parolanız, oturum anahtarları, hesap oluşturma ve giriş kayıtları
• Teknik kayıtlar: giriş yaptığınız cihazın türü (işletim sistemi, uygulama sürümü) ve IP adresinizden türetilen yaklaşık konum (ülke ve şehir); IP adresinin kendisi hesabınızla birlikte saklanmaz
• Sunucu erişim kayıtları: IP adresi, cihaz bilgisi (user-agent), istenen adres ile tarih ve saat (en fazla 14 gün)
• Spor profili bilgileri: seviye, mevki, antrenman hedefleri, haftalık antrenman sıklığı, tercih ettiğiniz günler, seans süresi ve yoğunluk tercihi
• Uygulama içi kullanım verileri: oluşturduğunuz antrenman programları, programlara eklediğiniz hareketler ve notlar, tamamladığınız hareket kayıtları, antrenman takvimi ve planladığınız seanslar

Uygulama doğum tarihi, T.C. kimlik numarası, cihaz konumu (GPS), rehber, fotoğraf galerisi, biyometrik veri veya KVKK m.6 anlamında özel nitelikli kişisel veri (sağlık verisi dâhil) toplamamaktadır.`,
    },
    {
      heading: '3. İşleme Amaçları',
      body: `Kişisel verileriniz aşağıdaki amaçlarla işlenir:

• Hesabınızın oluşturulması, kimliğinizin doğrulanması ve oturumunuzun sürdürülmesi
• Antrenman programlarınızın oluşturulması, saklanması ve ilerlemenizin takip edilmesi
• Seviyeniz ve hedefleriniz doğrultusunda size uygun drill ve program önerilmesi (uygulama içi antrenman sihirbazı)
• Planladığınız antrenmanlar için cihazınızda hatırlatıcı bildirim oluşturulması
• Destek taleplerinizin yanıtlanması
• Uygulamanın ve hesabınızın güvenliğinin sağlanması, kötüye kullanımın önlenmesi`,
    },
    {
      heading: '4. Hukuki Sebepler',
      body: `Verileriniz KVKK m.5 kapsamında şu hukuki sebeplere dayanılarak işlenir:

• m.5/2-c: Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (hesabınızın açılması ve hizmetin sunulması)
• m.5/2-ç: Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi
• m.5/2-f: İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri (hizmet güvenliği ve iyileştirilmesi)
• m.5/1: Açık rızanız (yalnızca isteğe bağlı özellikler için; örneğin bildirim izni)`,
    },
    {
      heading: '5. Toplama Yöntemi',
      body: 'Kişisel verileriniz tamamen elektronik ortamda toplanır: doğrudan sizden, uygulamaya kayıt olurken ve uygulamayı kullanırken doldurduğunuz formlar aracılığıyla; ayrıca uygulamanın sunucuyla iletişimi sırasında otomatik olarak oluşan teknik kayıtlar (cihaz türü, IP adresinden türetilen ülke/şehir, sunucu erişim kayıtları) aracılığıyla. Uygulamada üçüncü taraf analitik, reklam veya takip yazılımı (SDK) bulunmamaktadır; ücretli abonelik aktif olduğunda yalnızca satın alma doğrulaması için RevenueCat SDK\'sı kullanılır (bkz. 6).',
    },
    {
      heading: '6. Kişisel Verilerin Aktarılması',
      body: `Kişisel verileriniz pazarlama, reklam veya profilleme amacıyla üçüncü kişilere satılmaz, kiralanmaz ve aktarılmaz.

Uygulama, verilerinizi VoleyPro altyapısındaki sunucularda (İstanbul, Türkiye) işler; uygulama içindeki video ve içerikler de aynı altyapı üzerinden sunulur. Sunucu barındırma hizmetini veren veri merkezi, veri işleyen sıfatıyla yalnızca VoleyPro'nun talimatıyla hareket eder.

Yedekler: Verilerinizin şifreli yedeği her gece alınır. Yedeğin bir kopyası, yalnızca VoleyPro'nun erişebildiği e-posta hesabında (Hostinger) en fazla 30 gün saklanır. Yedekler, e-posta sağlayıcısının okuyamayacağı şekilde güçlü şifrelemeyle (AES-256) korunur; sağlayıcının sunucuları Avrupa Birliği'nde bulunabilir, bu nedenle şifreli yedek kopyası bakımından yurt dışına aktarım söz konusu olabilir.

Abonelik: Ücretli abonelik aktif olduğunda ödeme Apple App Store veya Google Play üzerinden alınır ve satın alma durumu RevenueCat (ABD) hizmetiyle doğrulanır. RevenueCat'e adınız veya e-posta adresiniz değil, yalnızca anonim bir hesap kimliği ve mağaza satın alma bilgileri iletilir; kart bilgileriniz VoleyPro'ya hiçbir zaman ulaşmaz.

Verileriniz yalnızca kanunen yetkili kamu kurum ve kuruluşlarının usulüne uygun talebi hâlinde, ilgili mevzuatın öngördüğü sınırlar içinde paylaşılabilir.`,
    },
    {
      heading: '7. Saklama Süreleri',
      body: `• Hesap ve profil verileriniz, hesabınız aktif olduğu sürece saklanır.
• Hesabınızı silmek istediğinizde 30 günlük bekleme süresi başlar; bu sürede hesabınızı kullanmaya devam edebilir ve talebi uygulama içinden iptal edebilirsiniz. Süre sonunda hesabınız ve ona bağlı kişisel verileriniz kalıcı olarak silinir; şifreli yedek kopyalarından da en geç 30 gün içinde düşer.
• Sunucu erişim kayıtları en fazla 14 gün saklanır.
• Mevzuat gereği belirli kayıtların daha uzun süre saklanması gerekiyorsa, yalnızca ilgili mevzuatın öngördüğü süre boyunca ve o amaçla sınırlı olarak saklanır.`,
    },
    {
      heading: '8. Veri Güvenliği',
      body: 'Parolalarınız geri döndürülemez şekilde şifrelenerek (hash) saklanır; uygulama ile sunucu arasındaki tüm trafik şifreli bağlantı üzerinden yürütülür; hesap verilerine yalnızca yetkilendirilmiş personel, görevi gereği ve sınırlı ölçüde erişebilir. KVKK m.12 kapsamında gerekli teknik ve idari tedbirler alınmakta ve düzenli olarak gözden geçirilmektedir.',
    },
    {
      heading: '9. 18 Yaş Altı Kullanıcılar',
      body: 'VoleyPro her yaştan sporcuya yönelik bir antrenman uygulamasıdır. 18 yaşından küçükseniz uygulamayı yalnızca veli veya vasinizin bilgisi ve izniyle kullanmalısınız. Velisi olduğunuz bir çocuğun verilerinin işlendiğini düşünüyor ve bu işlemenin sonlandırılmasını istiyorsanız, ' + SUPPORT_EMAIL + ' adresine yazmanız hâlinde ilgili hesap ve veriler silinir.',
    },
    {
      heading: '10. KVKK m.11 Kapsamındaki Haklarınız',
      body: `Veri sorumlusuna başvurarak;

• Kişisel verinizin işlenip işlenmediğini öğrenme,
• İşlenmişse buna ilişkin bilgi talep etme,
• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,
• Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme,
• Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,
• KVKK m.7'de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,
• Düzeltme, silme ve yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
• Münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
• Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme

haklarına sahipsiniz.`,
    },
    {
      heading: '11. Başvuru Yöntemi',
      body: `Haklarınızı kullanmak için taleplerinizi ${SUPPORT_EMAIL} adresine iletebilirsiniz. Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılır; işlemin ayrıca bir maliyet gerektirmesi hâlinde Kurul tarafından belirlenen tarifedeki ücret talep edilebilir.

Hesabınızı ve verilerinizi uygulama içinden de silebilirsiniz: Ana Sayfa > Profil ve Ayarlar > Hesabı Sil. Silme, 30 günlük bekleme süresinin ardından gerçekleşir; bu sürede aynı ekrandan iptal edebilirsiniz.`,
    },
    {
      heading: '12. Değişiklikler',
      body: 'Bu aydınlatma metni, mevzuattaki değişiklikler veya uygulamaya eklenen yeni özellikler nedeniyle güncellenebilir. Güncel metin her zaman uygulama içinden erişilebilir durumdadır; önemli değişikliklerde uygulama içinde bilgilendirme yapılır.',
    },
  ],
};

const PRIVACY_TR: LegalDoc = {
  title: 'Gizlilik Politikası',
  updated: LAST_UPDATED_TR,
  sections: [
    {
      heading: '1. Bu Politika Hakkında',
      body: `Bu Gizlilik Politikası, VoleyPro mobil uygulamasını kullandığınızda hangi bilgilerin toplandığını, bu bilgilerin nasıl kullanıldığını ve haklarınızın neler olduğunu açıklar.

Uygulamayı kullanarak bu politikayı okuduğunuzu kabul etmiş olursunuz. Kişisel verilerin işlenmesine ilişkin KVKK kapsamındaki detaylı bilgilendirme için KVKK Aydınlatma Metni'ni de inceleyebilirsiniz.`,
    },
    {
      heading: '2. Topladığımız Bilgiler',
      body: `Hesap bilgileri: ad, soyad, e-posta adresi ve şifreniz (şifreniz geri döndürülemez şekilde şifrelenerek saklanır).

Spor profili: seviyeniz, mevkiniz, antrenman hedefleriniz, haftalık antrenman sıklığınız, tercih ettiğiniz günler, seans süresi ve yoğunluk tercihiniz.

Antrenman verileri: oluşturduğunuz programlar, programlara eklediğiniz hareketler ve notlar, tamamladığınız hareketler ve antrenman takviminiz.

Teknik kayıtlar: giriş yaptığınız cihazın türü (işletim sistemi, uygulama sürümü) ve IP adresinizden türetilen yaklaşık konum (ülke ve şehir). IP adresinin kendisi hesabınızla saklanmaz. Sunucularımız ayrıca her isteğin erişim kaydını (IP adresi, cihaz bilgisi, istenen adres, tarih ve saat) güvenlik amacıyla en fazla 14 gün tutar.

Bunların dışındaki tüm bilgileri doğrudan siz girersiniz; arka planda sessizce toplanan başka bir veri yoktur.`,
    },
    {
      heading: '3. Toplamadığımız Bilgiler',
      body: `Uygulama şunları toplamaz:

• Cihazınızın konumu (GPS); yalnızca IP adresinden yaklaşık ülke ve şehir türetilir (bkz. 2)
• Rehber, çağrı kaydı veya mesajlar
• Fotoğraf galerisi veya kamera içeriği
• Biyometrik veri
• Sağlık verisi (nabız, kilo, sakatlık geçmişi vb.)
• Doğum tarihi
• Reklam kimliği (IDFA/GAID)

Uygulamada üçüncü taraf analitik, reklam ağı veya sosyal medya takip SDK'sı bulunmaz; davranışsal reklam amacıyla takip yapılmaz. Tek üçüncü taraf bileşen, ücretli abonelik aktif olduğunda satın almaları doğrulayan RevenueCat'tir (bkz. 7).`,
    },
    {
      heading: '4. Bilgileri Nasıl Kullanıyoruz',
      body: `• Hesabınızı oluşturmak ve güvenli giriş sağlamak
• Antrenman programlarınızı oluşturmak, saklamak ve ilerlemenizi göstermek
• Seviyenize ve hedeflerinize uygun drill ve program önermek
• Planladığınız antrenmanlar için hatırlatıcı göstermek
• Destek taleplerinizi yanıtlamak
• Hataları gidermek ve uygulamayı iyileştirmek

Verilerinizi reklam amacıyla kullanmayız ve üçüncü taraflara satmayız.`,
    },
    {
      heading: '5. Bildirimler',
      body: 'Antrenman hatırlatıcıları ve hedef bildirimleri cihazınızda yerel olarak planlanır ve gösterilir; bildirim içerikleri bu amaçla bir reklam veya pazarlama sunucusuna gönderilmez. Bildirimleri cihazınızın sistem ayarlarından dilediğiniz zaman kapatabilirsiniz; kapatmanız uygulamanın diğer özelliklerini etkilemez.',
    },
    {
      heading: '6. Cihazınızda Saklanan Veriler',
      body: `Uygulama, çalışabilmek için cihazınızın yerel deposunda şunları tutar:

• Oturum anahtarlarınız (tekrar tekrar giriş yapmanız gerekmesin diye)
• Dil ve tema (karanlık/aydınlık mod) tercihiniz
• Uygulama içi bildirim geçmişiniz

Bu veriler cihazınızda kalır. Uygulamayı sildiğinizde bunlar da cihazınızdan silinir.`,
    },
    {
      heading: '7. Veri Paylaşımı ve Barındırma',
      body: `Verileriniz VoleyPro altyapısındaki sunucularda (İstanbul, Türkiye) barındırılır. Uygulamanın kullandığı API ve video içerikleri aynı altyapıdan sunulur.

Yedekler: Verilerinizin şifreli yedeği her gece alınır; bir kopyası yalnızca VoleyPro'nun erişebildiği e-posta hesabında (Hostinger) en fazla 30 gün saklanır. Yedekler, sağlayıcının okuyamayacağı şekilde şifrelidir (AES-256); sağlayıcının sunucuları Avrupa Birliği'nde bulunabilir.

Abonelik: Ücretli abonelik aktif olduğunda ödeme Apple App Store veya Google Play üzerinden alınır; satın alma durumu RevenueCat hizmetiyle doğrulanır. RevenueCat'e adınız veya e-postanız değil, yalnızca anonim bir hesap kimliği ve mağaza satın alma bilgileri gider.

Bunların dışında verilerinizi üçüncü taraflarla paylaşmayız. Tek istisna, kanunen yetkili kamu kurumlarının usulüne uygun talepleridir.`,
    },
    {
      heading: '8. Saklama ve Silme',
      body: `Verileriniz hesabınız aktif olduğu sürece saklanır. Hesabınızı uygulama içinden silebilirsiniz: Ana Sayfa > Profil ve Ayarlar > Hesabı Sil.

Silme talebinizden sonra 30 günlük bekleme süresi başlar: bu sürede hesabınızı kullanmaya devam edebilir ve aynı ekrandan talebi iptal edebilirsiniz. Süre dolunca hesabınız ve kişisel verileriniz kalıcı olarak silinir; şifreli yedek kopyalarından da en geç 30 gün içinde düşer. Sunucu erişim kayıtları en fazla 14 gün tutulur.

Verilerinizin bir kopyasını talep etmek için ${SUPPORT_EMAIL} adresine yazabilirsiniz.`,
    },
    {
      heading: '9. Güvenlik',
      body: 'Uygulama ile sunucu arasındaki tüm iletişim şifreli bağlantı üzerinden yürütülür, parolalar geri döndürülemez şekilde saklanır ve hesap verilerine erişim yetki bazlı olarak sınırlandırılmıştır. Hiçbir sistem %100 güvenli olmamakla birlikte, verilerinizi korumak için makul teknik ve idari tedbirleri alır ve düzenli olarak gözden geçiririz.',
    },
    {
      heading: '10. Çocukların Gizliliği',
      body: 'VoleyPro her yaştan sporcuya yöneliktir. 18 yaşından küçükseniz uygulamayı veli veya vasinizin izniyle kullanmalısınız. Çocuğunuzun izniniz olmadan hesap oluşturduğunu düşünüyorsanız ' + SUPPORT_EMAIL + ' adresine yazın; hesabı ve ilgili verileri sileriz.',
    },
    {
      heading: '11. Avrupa Birliği / AEA Kullanıcıları',
      body: `Avrupa Birliği veya Avrupa Ekonomik Alanı'nda bulunuyorsanız, GDPR kapsamında verilerinize erişme, düzeltme, silme, işlemeyi kısıtlama, işlemeye itiraz etme ve verilerinizi taşınabilir bir formatta alma haklarına sahipsiniz.

Bu haklarınızı kullanmak için ${SUPPORT_EMAIL} adresine yazabilirsiniz; talebinize en geç bir ay içinde yanıt veririz. Ayrıca bulunduğunuz ülkenin veri koruma otoritesine şikâyette bulunma hakkınız saklıdır.

Verileriniz Türkiye'deki sunucularda işlendiği için, AB'den yapılan bir aktarımda uygun güvencelerin sağlanması gerekir; bu konudaki uygulamamız güncellendikçe bu politika da güncellenecektir.`,
    },
    {
      heading: '12. Değişiklikler ve İletişim',
      body: `Bu politika, uygulamaya yeni özellikler eklendikçe veya mevzuat değiştikçe güncellenebilir. Güncel sürüm her zaman uygulama içinden erişilebilir; önemli değişikliklerde uygulama içinde bilgilendirme yapılır.

Sorularınız için: ${SUPPORT_EMAIL}`,
    },
  ],
};

const KVKK_EN: LegalDoc = {
  title: 'Data Protection Notice (KVKK)',
  updated: LAST_UPDATED_EN,
  sections: [
    {
      heading: '1. Data Controller',
      body: `This notice is provided under Article 10 of Turkish Law No. 6698 on the Protection of Personal Data ("KVKK") to inform users of the VoleyPro mobile app.

Data controller: VoleyPro
Contact: ${SUPPORT_EMAIL}
Service: VoleyPro mobile app (iOS and Android)`,
    },
    {
      heading: '2. Personal Data We Process',
      body: `• Identity data: first name, last name
• Contact data: email address
• Security data: your hashed password, session tokens, sign-up and sign-in records
• Technical records: the type of device you sign in from (operating system, app version) and an approximate location (country and city) derived from your IP address; the IP address itself is not stored with your account
• Server access logs: IP address, device information (user agent), the address requested, and date and time (kept for at most 14 days)
• Sports profile: level, position, training goals, weekly training frequency, preferred days, preferred session length and intensity
• In-app usage data: training programs you create, drills and notes you add to them, drills you complete, and your training calendar

The app does not collect date of birth, national ID, device location (GPS), contacts, photo library, biometric data, or any special category of personal data (including health data) within the meaning of Article 6 of the KVKK.`,
    },
    {
      heading: '3. Purposes of Processing',
      body: `• Creating your account, authenticating you and maintaining your session
• Creating and storing your training programs and tracking your progress
• Suggesting drills and programs that match your level and goals (in-app training wizard)
• Scheduling reminder notifications on your device for planned sessions
• Responding to your support requests
• Keeping the app and your account secure and preventing misuse`,
    },
    {
      heading: '4. Legal Grounds',
      body: `Your data is processed under Article 5 of the KVKK on the following grounds:

• Art. 5/2-c: necessary for the conclusion or performance of a contract (opening your account and providing the service)
• Art. 5/2-ç: compliance with a legal obligation of the data controller
• Art. 5/2-f: legitimate interests of the data controller, provided your fundamental rights are not harmed (service security and improvement)
• Art. 5/1: your explicit consent, for optional features only (e.g. notification permission)`,
    },
    {
      heading: '5. Method of Collection',
      body: 'Your personal data is collected electronically: directly from you, through the forms you fill in when you register and while you use the app, and through technical records created automatically when the app talks to the server (device type, country/city derived from the IP address, server access logs). The app contains no third-party analytics, advertising or tracking SDKs; once paid subscriptions are active, the RevenueCat SDK is used solely to verify purchases (see 6).',
    },
    {
      heading: '6. Transfer of Personal Data',
      body: `Your personal data is never sold, rented or transferred to third parties for marketing, advertising or profiling purposes.

Your data is processed on VoleyPro infrastructure located in Istanbul, Türkiye, and in-app videos and content are served from the same infrastructure. The data centre hosting the servers acts as a data processor solely on VoleyPro's instructions.

Backups: An encrypted backup of your data is taken every night. One copy is kept for at most 30 days in an email account accessible only to VoleyPro (Hostinger). Backups are protected with strong encryption (AES-256) that the email provider cannot read; the provider's servers may be located in the European Union, so the encrypted backup copy may constitute a transfer abroad.

Subscriptions: Once paid subscriptions are active, payment is taken through the Apple App Store or Google Play and the purchase status is verified through RevenueCat (USA). RevenueCat receives only an anonymous account identifier and store purchase details, never your name or email address; your card details never reach VoleyPro.

Data may only be shared with public authorities that are legally competent, upon a duly made request and within the limits set by the applicable legislation.`,
    },
    {
      heading: '7. Retention Periods',
      body: `• Your account and profile data is kept for as long as your account is active.
• When you ask to delete your account, a 30-day waiting period starts; during it you can keep using your account and cancel the request from within the app. When the period ends, your account and the personal data linked to it are permanently erased, and they drop out of the encrypted backup copies within 30 days at the latest.
• Server access logs are kept for at most 14 days.
• Where legislation requires certain records to be kept longer, they are retained only for that period and only for that purpose.`,
    },
    {
      heading: '8. Data Security',
      body: 'Passwords are stored in an irreversibly hashed form, all traffic between the app and the server runs over an encrypted connection, and account data is accessible only to authorised personnel on a need-to-know basis. The technical and organisational measures required by Article 12 of the KVKK are in place and reviewed regularly.',
    },
    {
      heading: '9. Users Under 18',
      body: 'VoleyPro is a training app for athletes of all ages. If you are under 18, you should use the app only with the knowledge and permission of your parent or legal guardian. If you are a parent or guardian and want processing of your child’s data to stop, write to ' + SUPPORT_EMAIL + ' and the account and related data will be deleted.',
    },
    {
      heading: '10. Your Rights under Article 11',
      body: `By applying to the data controller, you have the right to:

• Learn whether your personal data is processed;
• Request information about it if it has been processed;
• Learn the purpose of processing and whether the data is used accordingly;
• Know the third parties to whom the data is transferred, in Türkiye or abroad;
• Request correction of incomplete or inaccurate data;
• Request erasure or destruction under the conditions of Article 7 of the KVKK;
• Request that corrections and erasures be notified to third parties to whom the data was transferred;
• Object to a result against you produced solely by automated analysis;
• Claim compensation if you suffer damage due to unlawful processing.`,
    },
    {
      heading: '11. How to Apply',
      body: `To exercise your rights, send your request to ${SUPPORT_EMAIL}. Requests are answered free of charge within 30 days at the latest; where the process incurs an additional cost, the fee set by the Board may apply.

You can also delete your account and data from within the app: Home > Profile and Settings > Delete Account. Deletion takes effect after a 30-day waiting period, during which you can cancel it on the same screen.`,
    },
    {
      heading: '12. Changes',
      body: 'This notice may be updated following changes in legislation or new features added to the app. The current version is always available in the app, and you will be informed in the app of any significant change.',
    },
  ],
};

const PRIVACY_EN: LegalDoc = {
  title: 'Privacy Policy',
  updated: LAST_UPDATED_EN,
  sections: [
    {
      heading: '1. About This Policy',
      body: `This Privacy Policy explains what information is collected when you use the VoleyPro mobile app, how it is used, and what rights you have.

By using the app you confirm that you have read this policy. For detailed information about processing under Turkish data protection law, please also read the Data Protection Notice (KVKK).`,
    },
    {
      heading: '2. Information We Collect',
      body: `Account information: first name, last name, email address and your password (stored in an irreversibly hashed form).

Sports profile: your level, position, training goals, weekly training frequency, preferred days, preferred session length and intensity.

Training data: the programs you create, the drills and notes you add to them, the drills you complete and your training calendar.

Technical records: the type of device you sign in from (operating system, app version) and an approximate location (country and city) derived from your IP address. The IP address itself is not stored with your account. Our servers also keep an access log of each request (IP address, device information, address requested, date and time) for security, for at most 14 days.

Everything else you enter yourself; nothing else is collected silently in the background.`,
    },
    {
      heading: '3. Information We Do Not Collect',
      body: `The app does not collect:

• Your device location (GPS); only an approximate country and city is derived from the IP address (see 2)
• Contacts, call logs or messages
• Photo library or camera content
• Biometric data
• Health data (heart rate, weight, injury history, etc.)
• Date of birth
• Advertising identifiers (IDFA/GAID)

The app contains no third-party analytics, ad network or social media tracking SDKs, and does not track you for behavioural advertising. The only third-party component is RevenueCat, which verifies purchases once paid subscriptions are active (see 7).`,
    },
    {
      heading: '4. How We Use the Information',
      body: `• To create your account and sign you in securely
• To create and store your training programs and show your progress
• To suggest drills and programs suited to your level and goals
• To show reminders for sessions you have planned
• To answer your support requests
• To fix problems and improve the app

We do not use your data for advertising and we do not sell it to third parties.`,
    },
    {
      heading: '5. Notifications',
      body: 'Training reminders and goal notifications are scheduled and displayed locally on your device; their content is not sent to any advertising or marketing server. You can turn notifications off at any time in your device settings without affecting other features of the app.',
    },
    {
      heading: '6. Data Stored on Your Device',
      body: `To work properly, the app stores the following in your device’s local storage:

• Your session tokens (so you do not have to sign in repeatedly)
• Your language and theme (dark/light mode) preference
• Your in-app notification history

This data stays on your device and is removed when you uninstall the app.`,
    },
    {
      heading: '7. Sharing and Hosting',
      body: `Your data is hosted on VoleyPro infrastructure located in Istanbul, Türkiye. The API and video content used by the app are served from the same infrastructure.

Backups: An encrypted backup of your data is taken every night; one copy is kept for at most 30 days in an email account accessible only to VoleyPro (Hostinger). Backups are encrypted (AES-256) so that the provider cannot read them; the provider's servers may be located in the European Union.

Subscriptions: Once paid subscriptions are active, payment is taken through the Apple App Store or Google Play and the purchase status is verified through RevenueCat. RevenueCat receives only an anonymous account identifier and store purchase details, never your name or email address.

Beyond this we do not share your data with third parties. The only exception is a duly made request from a legally competent public authority.`,
    },
    {
      heading: '8. Retention and Deletion',
      body: `Your data is kept for as long as your account is active. You can delete your account from within the app: Home > Profile and Settings > Delete Account.

After a deletion request, a 30-day waiting period starts: during it you can keep using your account and cancel the request on the same screen. When the period ends, your account and personal data are permanently erased and drop out of the encrypted backup copies within 30 days at the latest. Server access logs are kept for at most 14 days.

To request a copy of your data, write to ${SUPPORT_EMAIL}.`,
    },
    {
      heading: '9. Security',
      body: 'All communication between the app and the server runs over an encrypted connection, passwords are stored irreversibly, and access to account data is restricted by role. No system is 100% secure, but we take and regularly review reasonable technical and organisational measures to protect your data.',
    },
    {
      heading: '10. Children’s Privacy',
      body: 'VoleyPro is intended for athletes of all ages. If you are under 18, you should use the app with the permission of your parent or legal guardian. If you believe your child created an account without your permission, write to ' + SUPPORT_EMAIL + ' and we will delete the account and related data.',
    },
    {
      heading: '11. Users in the EU / EEA',
      body: `If you are located in the European Union or the European Economic Area, you have the right under the GDPR to access, rectify and erase your data, to restrict or object to processing, and to receive your data in a portable format.

To exercise these rights, write to ${SUPPORT_EMAIL}; we respond within one month at the latest. You also have the right to lodge a complaint with the data protection authority in your country.

Because your data is processed on servers in Türkiye, a transfer from the EU requires appropriate safeguards; this policy will be updated as our practice in this area develops.`,
    },
    {
      heading: '12. Changes and Contact',
      body: `This policy may be updated as new features are added or legislation changes. The current version is always available in the app, and you will be informed in the app of any significant change.

Questions: ${SUPPORT_EMAIL}`,
    },
  ],
};

// Kullanım Şartları. Fiyatlar bilerek yazılmadı: abonelik bedelleri mağaza
// tarafından belirlenip paywall'da gösteriliyor, metne gömülürse fiyat
// değiştiğinde şartlar yanlış hale gelir.
const TERMS_TR: LegalDoc = {
  title: 'Kullanım Şartları',
  updated: LAST_UPDATED_TR,
  sections: [
    {
      heading: '1. Taraflar ve Kapsam',
      body: `Bu Kullanım Şartları, VoleyPro mobil uygulamasını ("Uygulama") kullanan kişi ("Kullanıcı") ile Uygulamayı sunan VoleyPro arasındaki ilişkiyi düzenler.

Uygulamayı indirip hesap açtığınızda bu şartları kabul etmiş sayılırsınız. Kabul etmiyorsanız Uygulamayı kullanmayın.

İletişim: ${SUPPORT_EMAIL}`,
    },
    {
      heading: '2. Hizmetin Tanımı',
      body: `VoleyPro, voleybol antrenmanı planlamak ve uygulamak için tasarlanmış bir dijital antrenman platformudur. Hazır antrenman programları, video anlatımlı hareket kütüphanesi, kişiye özel plan oluşturma aracı, antrenman takvimi ve gelişim takibi sunar.

Uygulama bir spor eğitim aracıdır. Antrenör, fizyoterapist veya hekim yerine geçmez.`,
    },
    {
      heading: '3. Hesap ve Kullanıcı Sorumlulukları',
      body: `Hesap açarken doğru ve güncel bilgi vermeniz gerekir. Hesabınızın ve şifrenizin güvenliğinden siz sorumlusunuz; hesabınız üzerinden yapılan işlemler size ait sayılır.

Hesabınızın izinsiz kullanıldığını düşünüyorsanız ${SUPPORT_EMAIL} adresinden bize bildirin.

18 yaşından küçükseniz Uygulamayı ancak veli veya vasinizin bilgisi ve onayıyla kullanabilirsiniz.`,
    },
    {
      heading: '4. Abonelik ve Ücretlendirme',
      body: `Uygulamanın içeriğine erişim ücretli aboneliğe tabidir. Aylık ve yıllık seçenekler sunulur; güncel fiyatlar satın alma ekranında, kendi para biriminizde gösterilir.

Yeni kullanıcılar için ücretsiz deneme süresi tanımlanmıştır. Deneme süresi sonunda abonelik, seçtiğiniz plan üzerinden otomatik olarak başlar ve iptal edilmediği sürece her dönem sonunda kendiliğinden yenilenir.

Ödeme, uygulamayı indirdiğiniz mağaza (Apple App Store veya Google Play) üzerinden alınır. VoleyPro kart bilgilerinizi görmez ve saklamaz. Ücretlendirmeye ilişkin kayıtlar mağaza hesabınızda tutulur.`,
    },
    {
      heading: '5. İptal',
      body: `Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal, mağaza hesabınızın abonelik ayarlarından yapılır:

• iOS: Ayarlar → Apple Kimliği → Abonelikler
• Android: Google Play → Abonelikler

İptal, mevcut dönemin bitiminde geçerli olur; dönem sonuna kadar erişiminiz devam eder. Ücretsiz deneme süresinde iptal ederseniz ücret alınmaz; iptalin, deneme süresi bitiminden en az 24 saat önce yapılması gerekir.

İade talepleri VoleyPro tarafından değil, ödemeyi aldığı için doğrudan Apple veya Google tarafından değerlendirilir.`,
    },
    {
      heading: '6. Cayma Hakkı (AB / AEA)',
      body: `Avrupa Birliği veya Avrupa Ekonomik Alanı'nda ikamet eden tüketicilerin, dijital hizmet sözleşmelerinde 14 gün içinde cayma hakkı bulunur.

Dijital içeriğe hemen erişim sağlandığı için, satın alma sırasında hizmetin derhal ifasına onay vermeniz halinde bu hak sona erebilir. Cayma talepleriniz için ${SUPPORT_EMAIL} adresine yazabilir, ayrıca ödemeyi aldığı için doğrudan mağazaya başvurabilirsiniz.`,
    },
    {
      heading: '7. Sağlık ve Güvenlik Uyarısı',
      body: `Uygulamadaki antrenman programları, hareketler ve öneriler genel bilgi amaçlıdır; tıbbi tavsiye, teşhis veya tedavi değildir.

Fiziksel aktiviteye başlamadan önce, özellikle bilinen bir sağlık sorununuz, sakatlığınız veya şüpheniz varsa hekiminize danışın. Antrenman sırasında ağrı, baş dönmesi, nefes darlığı veya rahatsızlık hissederseniz derhal durun.

Hareketleri kendi fiziksel durumunuza uygun şekilde ve güvenli bir ortamda uygulamak sizin sorumluluğunuzdadır. VoleyPro, Uygulamadaki içeriğin uygulanması sırasında oluşabilecek sakatlanma veya sağlık sorunlarından sorumlu tutulamaz.`,
    },
    {
      heading: '8. Fikri Mülkiyet',
      body: `Uygulamadaki tüm içerik — antrenman programları, hareket açıklamaları, videolar, görseller, metinler, tasarım ve yazılım — VoleyPro'ya veya lisans verenlerine aittir.

Aboneliğiniz size bu içeriği yalnızca kişisel ve ticari olmayan amaçla kullanma hakkı verir. İçeriği kopyalayamaz, çoğaltamaz, dağıtamaz, yayınlayamaz, satamaz veya kendi hizmetinizin parçası haline getiremezsiniz.`,
    },
    {
      heading: '9. Kullanım Kuralları',
      body: `Uygulamayı kullanırken şunları yapamazsınız:

• Uygulamanın güvenlik önlemlerini aşmaya veya kaynak koduna erişmeye çalışmak
• Hesabınızı başkasıyla paylaşmak veya başkasının hesabına erişmeye çalışmak
• Otomatik araçlarla veri toplamak
• Uygulamayı yasa dışı bir amaçla veya üçüncü kişilerin haklarını ihlal edecek şekilde kullanmak

Bu kuralların ihlali halinde hesabınız askıya alınabilir veya kapatılabilir.`,
    },
    {
      heading: '10. Hizmette Değişiklik ve Sonlandırma',
      body: `VoleyPro, Uygulamanın özelliklerini geliştirmek, değiştirmek veya bazı özellikleri kaldırmak hakkını saklı tutar. Aboneliğinizi doğrudan etkileyecek önemli değişiklikler size Uygulama içinden duyurulur.

Hesabınızı istediğiniz zaman Uygulama içinden silebilirsiniz. Hesap silindiğinde verileriniz Gizlilik Politikası'nda açıklandığı şekilde silinir; aboneliğin iptali ayrıca mağaza üzerinden yapılmalıdır.`,
    },
    {
      heading: '11. Sorumluluğun Sınırlandırılması',
      body: `Uygulama "olduğu gibi" sunulur. Kesintisiz veya hatasız çalışacağı garanti edilmez.

VoleyPro, yürürlükteki mevzuatın izin verdiği ölçüde, dolaylı zararlardan, veri kaybından veya kâr kaybından sorumlu değildir. Tüketici mevzuatından doğan haklarınız bu maddeden etkilenmez.`,
    },
    {
      heading: '12. Uygulanacak Hukuk ve Değişiklikler',
      body: `Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Tüketici olarak, ikamet ettiğiniz ülkenin tüketici mevzuatının size tanıdığı zorunlu haklar saklıdır.

Şartlar zaman zaman güncellenebilir. Güncel sürüm her zaman Uygulama içinde bulunur; önemli bir değişiklik olduğunda Uygulama içinden bilgilendirilirsiniz.

Sorularınız için: ${SUPPORT_EMAIL}`,
    },
  ],
};

const TERMS_EN: LegalDoc = {
  title: 'Terms of Use',
  updated: LAST_UPDATED_EN,
  sections: [
    {
      heading: '1. Parties and Scope',
      body: `These Terms of Use govern the relationship between the person using the VoleyPro mobile application (the "App") and VoleyPro, which provides it.

By downloading the App and creating an account you accept these terms. If you do not accept them, please do not use the App.

Contact: ${SUPPORT_EMAIL}`,
    },
    {
      heading: '2. The Service',
      body: `VoleyPro is a digital training platform for planning and running volleyball practice. It offers ready-made training programmes, a drill library with instructional videos, a personalised plan builder, a training calendar and progress tracking.

The App is a sports training tool. It does not replace a coach, a physiotherapist or a physician.`,
    },
    {
      heading: '3. Your Account',
      body: `You must provide accurate and current information when creating an account. You are responsible for keeping your account and password secure; activity carried out through your account is treated as yours.

If you believe your account has been used without your permission, write to ${SUPPORT_EMAIL}.

If you are under 18, you may use the App only with the knowledge and consent of a parent or guardian.`,
    },
    {
      heading: '4. Subscription and Billing',
      body: `Access to the App's content requires a paid subscription. Monthly and annual options are offered; current prices are shown on the purchase screen in your own currency.

A free trial is offered to new users. At the end of the trial the subscription starts automatically on the plan you selected and renews at the end of each period unless cancelled.

Payment is taken by the store you downloaded the App from (Apple App Store or Google Play). VoleyPro never sees or stores your card details. Billing records are kept in your store account.`,
    },
    {
      heading: '5. Cancellation',
      body: `You can cancel your subscription at any time from the subscription settings of your store account:

• iOS: Settings → Apple Account → Subscriptions
• Android: Google Play → Subscriptions

Cancellation takes effect at the end of the current period; your access continues until then. If you cancel during the free trial you are not charged, provided you cancel at least 24 hours before the trial ends.

Refund requests are handled directly by Apple or Google, since they take the payment, not by VoleyPro.`,
    },
    {
      heading: '6. Right of Withdrawal (EU / EEA)',
      body: `Consumers resident in the European Union or the European Economic Area have a 14-day right of withdrawal for digital service contracts.

Because access to digital content is granted immediately, this right may lapse if you consent to immediate performance at the time of purchase. You may write to ${SUPPORT_EMAIL}, and you may also contact the store directly, as it processes the payment.`,
    },
    {
      heading: '7. Health and Safety Notice',
      body: `The training programmes, drills and suggestions in the App are for general information. They are not medical advice, diagnosis or treatment.

Consult your physician before starting physical activity, particularly if you have a known health condition, an injury or any doubt. Stop immediately if you feel pain, dizziness, shortness of breath or discomfort during training.

It is your responsibility to perform the drills in a way suited to your physical condition and in a safe environment. VoleyPro cannot be held responsible for injury or health problems arising while following content in the App.`,
    },
    {
      heading: '8. Intellectual Property',
      body: `All content in the App — training programmes, drill descriptions, videos, images, text, design and software — belongs to VoleyPro or its licensors.

Your subscription grants you the right to use this content for personal, non-commercial purposes only. You may not copy, reproduce, distribute, publish, sell or incorporate the content into a service of your own.`,
    },
    {
      heading: '9. Acceptable Use',
      body: `While using the App you may not:

• Attempt to circumvent security measures or access the source code
• Share your account with others or attempt to access someone else's account
• Collect data using automated tools
• Use the App for unlawful purposes or in a way that infringes the rights of others

Breaching these rules may result in your account being suspended or closed.`,
    },
    {
      heading: '10. Changes to the Service and Termination',
      body: `VoleyPro reserves the right to improve, change or remove features of the App. Significant changes that directly affect your subscription will be announced in the App.

You may delete your account at any time from within the App. When the account is deleted your data is erased as described in the Privacy Policy; the subscription must be cancelled separately through the store.`,
    },
    {
      heading: '11. Limitation of Liability',
      body: `The App is provided "as is". It is not guaranteed to operate without interruption or error.

To the extent permitted by applicable law, VoleyPro is not liable for indirect damage, loss of data or loss of profit. Your rights under consumer law are not affected by this clause.`,
    },
    {
      heading: '12. Governing Law and Changes',
      body: `These terms are governed by the laws of the Republic of Türkiye. As a consumer, the mandatory rights granted to you by the consumer legislation of your country of residence are reserved.

These terms may be updated from time to time. The current version is always available in the App, and you will be informed in the App of any significant change.

Questions: ${SUPPORT_EMAIL}`,
    },
  ],
};

const DOCS: Record<LegalDocKey, Record<Lang, LegalDoc>> = {
  kvkk: { tr: KVKK_TR, en: KVKK_EN },
  privacy: { tr: PRIVACY_TR, en: PRIVACY_EN },
  terms: { tr: TERMS_TR, en: TERMS_EN },
};

export function legalDoc(key: LegalDocKey, lang: Lang): LegalDoc {
  return DOCS[key][lang] ?? DOCS[key].tr;
}
