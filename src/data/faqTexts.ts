import type { Lang } from '../i18n';
import type { LegalDoc } from './legalTexts';

// Sıkça Sorulan Sorular. Sorular uygulamanın gerçek akışına göre yazılmıştır;
// bir özellik değişirse (ör. süre hesabı, düzenleme akışı) cevabı da güncelleyin.
// Yardım & Destek > Sık Sorulan Sorular üzerinden açılır.

const FAQ_TR: LegalDoc = {
  title: 'Sık Sorulan Sorular',
  updated: '',
  sections: [
    {
      heading: '1. Antrenman süresi nasıl hesaplanıyor?',
      body: `Toplam süre, antrenmana eklediğin hareketlerin sürelerinin toplamıdır; ayrıca bir süre girmene gerek yoktur.

Her hareketin süresi Antrenman Kütüphanesi'nde kartın üzerinde yazar. Bir hareketi çıkardığında ya da eklediğinde toplam süre ve bölüm süreleri (Isınma / Ana Antrenman / Soğuma) otomatik olarak güncellenir.

Hazır antrenmanlar yaklaşık 45 dakika olacak şekilde hazırlanır: ısınma bloğu, ana antrenman ve soğuma birlikte bu süreyi verir.`,
    },
    {
      heading: '2. Antrenmanıma nasıl hareket ekler veya çıkarırım?',
      body: `Antrenman sekmesinden programı aç, "Antrenmanı Başlat" ekranının sağ üstündeki üç noktaya dokun, sonra "Düzenle"ye bas.

• Çıkarmak için: hareketin yanındaki ✕ işaretine dokun ve onayla.
• Eklemek için: "+ Drill Ekle" ile kütüphaneyi aç ve istediğin hareketi seç.

Eklediğin hareket kendi bölümüne (Isınma, Ana Antrenman veya Soğuma) otomatik yerleşir. Değişiklikler anında kaydedilir, ayrıca bir kaydetme adımı yoktur.`,
    },
    {
      heading: '3. AI ile oluşturulan antrenman neye göre hazırlanıyor?',
      body: `Sihirbazda seçtiğin hedef, odak alanları, seviye ve süre birlikte değerlendirilir.

Uygulama hiçbir hareket uydurmaz; yalnızca kendi video kütüphanesindeki gerçek drill'ler arasından seçim yapar. Seviyene uygun olanlara öncelik verir ve seçtiğin süreyi dolduracak kadar hareket ekler.

Programı beğenmezsen tek tek düzenleyebilirsin: hareket çıkarabilir, kütüphaneden yenisini ekleyebilirsin.`,
    },
    {
      heading: '4. Videolar açılmıyor veya veriler gelmiyor, ne yapmalıyım?',
      body: `Drill videoları ve antrenman verilerin sunucudan geldiği için uygulamanın internet bağlantısına ihtiyacı vardır; çevrimdışı çalışmaz.

Sırasıyla şunları dene:
• Bağlantını kontrol et (mobil veri veya Wi-Fi).
• Uygulamayı tamamen kapatıp yeniden aç.
• Çıkış yapıp tekrar giriş yap.

Sorun sürerse info@voleypro.com adresine yazabilirsin.`,
    },
    {
      heading: '5. Antrenman hatırlatıcıları neden gelmiyor?',
      body: `Hatırlatıcılar telefonunun kendi bildirim sistemi üzerinden gösterilir, bu yüzden iki şeyin doğru olması gerekir:

• Cihaz ayarlarında VoleyPro için bildirim izni açık olmalı.
• Antrenmana bir gün ve saat atanmış olmalı. "Antrenmanı Başlat" ekranındaki Gün satırına dokunarak tarih ve saat seçebilirsin.

Gün ve saat seçilmemiş bir antrenman için hatırlatıcı oluşturulmaz.`,
    },
  ],
};

const FAQ_EN: LegalDoc = {
  title: 'Frequently Asked Questions',
  updated: '',
  sections: [
    {
      heading: '1. How is the session duration calculated?',
      body: `The total is simply the sum of the drills you added to the session — you never have to type a duration yourself.

Each drill’s length is shown on its card in the Drill Library. Whenever you add or remove a drill, the total and the section times (Warm-up / Main Session / Stretch) update automatically.

Ready-made sessions are built to run about 45 minutes: the warm-up block, the main session and the stretch add up to that.`,
    },
    {
      heading: '2. How do I add or remove drills in my session?',
      body: `Open the session from the Training tab, tap the three dots at the top right of the "Start Session" screen, then tap "Edit".

• To remove: tap the ✕ next to the drill and confirm.
• To add: tap "+ Add Drill" to open the library and pick a drill.

The drill you add goes into its own section (Warm-up, Main Session or Stretch) automatically. Changes are saved immediately — there is no separate save step.`,
    },
    {
      heading: '3. How does the AI build a session?',
      body: `The wizard weighs the goal, focus areas, level and duration you selected, all together.

The app never invents a drill: it only picks from the real drills in its own video library. It prioritises drills that match your level and keeps adding until the duration you chose is filled.

If you do not like the result you can edit it drill by drill — remove one, or add another from the library.`,
    },
    {
      heading: '4. Videos will not play or my data will not load — what should I do?',
      body: `Drill videos and your training data come from the server, so the app needs an internet connection; it does not work offline.

Try these in order:
• Check your connection (mobile data or Wi-Fi).
• Close the app completely and reopen it.
• Sign out and sign back in.

If the problem continues, write to info@voleypro.com.`,
    },
    {
      heading: '5. Why am I not getting session reminders?',
      body: `Reminders are delivered through your phone’s own notification system, so two things need to be in place:

• Notification permission for VoleyPro must be enabled in your device settings.
• The session must have a day and time assigned. Tap the Day row on the "Start Session" screen to pick a date and time.

No reminder is created for a session that has no day and time set.`,
    },
  ],
};

export function faqDoc(lang: Lang): LegalDoc {
  return lang === 'en' ? FAQ_EN : FAQ_TR;
}
