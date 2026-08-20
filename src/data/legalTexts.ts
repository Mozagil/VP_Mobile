import type { Lang } from '../i18n';

// KVKK Aydınlatma Metni ve Gizlilik Politikası içerikleri.
// Metinler uygulamanın gerçek veri akışına göre yazılmıştır: veriler
// voleypro.com altyapısında (Türkiye) tek origin üzerinden işlenir, üçüncü
// taraf analitik/reklam SDK'sı yoktur, bildirimler cihaz üzerinde yereldir.
// İçerik değişirse LAST_UPDATED tarihini de güncelleyin.

export type LegalDocKey = 'kvkk' | 'privacy';
export type LegalSection = { heading: string; body: string };
export type LegalDoc = { title: string; updated: string; sections: LegalSection[] };

export const SUPPORT_EMAIL = 'info@voleypro.com';

const LAST_UPDATED_TR = 'Son güncelleme: 20 Ağustos 2026';
const LAST_UPDATED_EN = 'Last updated: 20 August 2026';

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
• Spor profili bilgileri: seviye, mevki, antrenman hedefleri, haftalık antrenman sıklığı, tercih ettiğiniz günler, seans süresi ve yoğunluk tercihi
• Uygulama içi kullanım verileri: oluşturduğunuz antrenman programları, programlara eklediğiniz hareketler ve notlar, tamamladığınız hareket kayıtları, antrenman takvimi ve planladığınız seanslar

Uygulama doğum tarihi, T.C. kimlik numarası, konum, rehber, fotoğraf galerisi, biyometrik veri veya KVKK m.6 anlamında özel nitelikli kişisel veri (sağlık verisi dâhil) toplamamaktadır.`,
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
      body: 'Kişisel verileriniz, tamamen elektronik ortamda ve doğrudan sizden, uygulamaya kayıt olurken ve uygulamayı kullanırken doldurduğunuz formlar aracılığıyla toplanır. Uygulamada üçüncü taraf analitik, reklam veya takip yazılımı (SDK) bulunmamaktadır.',
    },
    {
      heading: '6. Kişisel Verilerin Aktarılması',
      body: `Kişisel verileriniz pazarlama, reklam veya profilleme amacıyla üçüncü kişilere satılmaz, kiralanmaz ve aktarılmaz.

Uygulama, verilerinizi yalnızca VoleyPro altyapısındaki sunucularda (Türkiye) işler; uygulama içindeki video ve içerikler de aynı altyapı üzerinden sunulur. Verileriniz yurt dışına aktarılmamaktadır.

Verileriniz yalnızca kanunen yetkili kamu kurum ve kuruluşlarının usulüne uygun talebi hâlinde, ilgili mevzuatın öngördüğü sınırlar içinde paylaşılabilir.`,
    },
    {
      heading: '7. Saklama Süreleri',
      body: `• Hesap ve profil verileriniz, hesabınız aktif olduğu sürece saklanır.
• Hesabınızı sildiğinizde, hesabınıza bağlı kişisel verileriniz en geç 6 ay içinde silinir, yok edilir veya anonim hâle getirilir.
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

Hesabınızı ve verilerinizi uygulama içinden de silebilirsiniz: Ana Sayfa > Profil ve Ayarlar > Hesabı Sil.`,
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

Bu bilgilerin tamamını doğrudan siz girersiniz; arka planda sessizce toplanan bir veri yoktur.`,
    },
    {
      heading: '3. Toplamadığımız Bilgiler',
      body: `Uygulama şunları toplamaz:

• Konum bilgisi
• Rehber, çağrı kaydı veya mesajlar
• Fotoğraf galerisi veya kamera içeriği
• Biyometrik veri
• Sağlık verisi (nabız, kilo, sakatlık geçmişi vb.)
• Doğum tarihi
• Reklam kimliği (IDFA/GAID)

Uygulamada üçüncü taraf analitik, reklam ağı veya sosyal medya takip SDK'sı bulunmaz; davranışsal reklam amacıyla takip yapılmaz.`,
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
      body: `Verileriniz VoleyPro altyapısındaki sunucularda (Türkiye) barındırılır. Uygulamanın kullandığı API ve video içerikleri aynı altyapıdan sunulur; verileriniz yurt dışına aktarılmaz.

Verilerinizi üçüncü taraflarla paylaşmayız. Tek istisna, kanunen yetkili kamu kurumlarının usulüne uygun talepleridir.`,
    },
    {
      heading: '8. Saklama ve Silme',
      body: `Verileriniz hesabınız aktif olduğu sürece saklanır. Hesabınızı uygulama içinden silebilirsiniz: Ana Sayfa > Profil ve Ayarlar > Hesabı Sil.

Hesap silme talebinizin ardından kişisel verileriniz en geç 6 ay içinde silinir, yok edilir veya anonim hâle getirilir. Verilerinizin bir kopyasını talep etmek için ${SUPPORT_EMAIL} adresine yazabilirsiniz.`,
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
• Sports profile: level, position, training goals, weekly training frequency, preferred days, preferred session length and intensity
• In-app usage data: training programs you create, drills and notes you add to them, drills you complete, and your training calendar

The app does not collect date of birth, national ID, location, contacts, photo library, biometric data, or any special category of personal data (including health data) within the meaning of Article 6 of the KVKK.`,
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
      body: 'Your personal data is collected electronically and directly from you, through the forms you fill in when you register and while you use the app. The app contains no third-party analytics, advertising or tracking SDKs.',
    },
    {
      heading: '6. Transfer of Personal Data',
      body: `Your personal data is never sold, rented or transferred to third parties for marketing, advertising or profiling purposes.

Your data is processed only on VoleyPro infrastructure located in Türkiye, and in-app videos and content are served from the same infrastructure. Your data is not transferred abroad.

Data may only be shared with public authorities that are legally competent, upon a duly made request and within the limits set by the applicable legislation.`,
    },
    {
      heading: '7. Retention Periods',
      body: `• Your account and profile data is kept for as long as your account is active.
• When you delete your account, the personal data linked to it is erased, destroyed or anonymised within 6 months at the latest.
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

You can also delete your account and data from within the app: Home > Profile and Settings > Delete Account.`,
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

You enter all of this information yourself; nothing is collected silently in the background.`,
    },
    {
      heading: '3. Information We Do Not Collect',
      body: `The app does not collect:

• Location data
• Contacts, call logs or messages
• Photo library or camera content
• Biometric data
• Health data (heart rate, weight, injury history, etc.)
• Date of birth
• Advertising identifiers (IDFA/GAID)

The app contains no third-party analytics, ad network or social media tracking SDKs, and does not track you for behavioural advertising.`,
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
      body: `Your data is hosted on VoleyPro infrastructure located in Türkiye. The API and video content used by the app are served from the same infrastructure; your data is not transferred abroad.

We do not share your data with third parties. The only exception is a duly made request from a legally competent public authority.`,
    },
    {
      heading: '8. Retention and Deletion',
      body: `Your data is kept for as long as your account is active. You can delete your account from within the app: Home > Profile and Settings > Delete Account.

After a deletion request, your personal data is erased, destroyed or anonymised within 6 months at the latest. To request a copy of your data, write to ${SUPPORT_EMAIL}.`,
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

const DOCS: Record<LegalDocKey, Record<Lang, LegalDoc>> = {
  kvkk: { tr: KVKK_TR, en: KVKK_EN },
  privacy: { tr: PRIVACY_TR, en: PRIVACY_EN },
};

export function legalDoc(key: LegalDocKey, lang: Lang): LegalDoc {
  return DOCS[key][lang] ?? DOCS[key].tr;
}
