export type SozlukTerm = {
  id: number;
  term: string;
  category: string;
  desc: string;
  detail?: string;
  example?: string;
  keywords: string[];
};

// ── Category accent colors ───────────────────────────────────────────────────
export const categoryColor: Record<string, string> = {
  Hücum: '#f97316',
  Savunma: '#22c55e',
  Servis: '#60a5fa',
  Pas: '#a78bfa',
  Blok: '#f59e0b',
  Kural: '#6366f1',
  Diğer: '#8da3cc',
};

export const categoryIcon: Record<string, string> = {
  Hücum: '💥',
  Savunma: '🛡️',
  Servis: '🎾',
  Pas: '🤝',
  Blok: '🧱',
  Kural: '📖',
  Diğer: '🏐',
};

export const CATEGORIES = ['Tümü', 'Hücum', 'Savunma', 'Servis', 'Pas', 'Blok', 'Kural', 'Diğer'];

export const KEYWORD_FILTERS = ['defans', 'hücum', 'servis', 'pas', 'blok', 'smaç', 'pozisyon', 'rotasyon'];

export const SOZLUK_TERMS: SozlukTerm[] = [
  {
    id: 1, term: 'Ace', category: 'Servis',
    desc: 'Rakibin dokunmadan ya da hata yaparak tamamlanamayan, doğrudan sayı kazandıran servis.',
    detail: 'Ace serviste hedef, savunucunun pozisyon dışına düşen ya da kontrolsüz bir topa neden olacak şekilde hız veya yerleştirme avantajı sağlamaktır.',
    example: "Güçlü float servisini ace'e dönüştürerek seti kapattı.",
    keywords: ['servis', 'doğrudan sayı', 'hız', 'yerleştirme'],
  },
  {
    id: 2, term: 'Blok', category: 'Blok',
    desc: 'File üzerinde rakibin smaçına karşı yapılan engelleme hareketi.',
    detail: '1, 2 veya 3 oyuncuyla yapılabilir. Etkili bir blok, rakibin saldırı açısını daraltır ve takım savunmasını kolaylaştırır.',
    example: 'Ortanın çift bloğu rakibin güçlü smaçını sahaya düşürdü.',
    keywords: ['blok', 'file', 'savunma', 'smaç'],
  },
  {
    id: 3, term: 'Libero', category: 'Diğer',
    desc: 'Özel formaya sahip, yalnızca arka sırada oynayan savunma uzmanı oyuncu.',
    detail: 'Libero smaç atamaz ve servis kullanamaz. Arka sıra rotasyonlarında herhangi bir oyuncunun yerine serbestçe girebilir; bu değişim sayılmaz.',
    example: 'Libero servis bölgesine çöktü ve zor topu kurtardı.',
    keywords: ['pozisyon', 'savunma', 'rotasyon'],
  },
  {
    id: 4, term: 'Manşet', category: 'Savunma',
    desc: 'Rakibin servis veya saldırı vuruşlarını karşılamak için önkolların birleştirilip düzleştirilerek topa kontrollü şekilde yön verilen temel savunma tekniği.',
    detail: 'Her iki kolun iç yüzeyi birleştirilir, dirsekler kilitlenir ve gövde topa doğru pozisyon alarak sabit bir platform oluşturur. Karşılamada ve savunmada kullanılır.',
    example: 'Rakip servis kullandığında, libero durağan pozisyonda gelen topu manşet ile karşılayarak pasöre organize bir geçiş yaptı.',
    keywords: ['defans', 'servis karşılama', 'kontrol', 'gövde pozisyonu', 'platform'],
  },
  {
    id: 5, term: 'Pasör', category: 'Diğer',
    desc: 'Takımın oyun kuruculuğunu yapan, smaçörlere ikinci dokunuşu aktaran oyuncu.',
    detail: 'Pasör, rakip savunmasını okuyarak hızlı, yüksek veya çapraz setler vererek saldırıyı yönetir. Takımın motor gücüdür.',
    example: 'Pasör hızlı set ile ortanın önüne harika bir açılım yaptı.',
    keywords: ['pozisyon', 'pas', 'hücum'],
  },
  {
    id: 6, term: 'Smaç', category: 'Hücum',
    desc: 'File üzerinden rakip sahaya kuvvetli vurulan atak tekniği.',
    detail: 'Smaçör zıplayarak havada topla buluşur; bilek, omuz ve gövde rotasyonuyla güç üretir. Köşe, çapraz veya düz hedeflere vurulabilir.',
    example: 'Köşe smaç ile rakibin savunmasını dağıttı.',
    keywords: ['hücum', 'smaç', 'blok', 'pas'],
  },
  {
    id: 7, term: 'Floater', category: 'Servis',
    desc: 'Topu döndürmeden atılan, havada salınım yapan ve savunucuyu zorlayan servis türü.',
    detail: 'Topa herhangi bir spin verilmez; bu durum topun hava akışından etkilenerek öngörülemez biçimde salınmasına yol açar.',
    example: 'Float servis savunucunun gözünden kaçarak düştü.',
    keywords: ['servis', 'defans'],
  },
  {
    id: 8, term: 'Dump', category: 'Hücum',
    desc: 'Pasörün ikinci dokunuşta fileyi geçirerek yaptığı sürpriz topa vurma.',
    detail: 'Rakip takım genellikle üçüncü bir dokunuş beklerken pasörün topu doğrudan rakip sahaya bırakması sürpriz yaratır.',
    example: 'Pasör rakibi şaşırtmak için dump yaptı.',
    keywords: ['hücum', 'pas', 'pozisyon'],
  },
  {
    id: 9, term: 'Tip', category: 'Hücum',
    desc: 'Smaç pozisyonundan güçlü vurmak yerine parmak uçlarıyla yapılan kontrollü dokunuş.',
    detail: 'Blok duvarını aşmak veya boş bölgeye yerleştirmek amacıyla kullanılır. Savunmanın güç beklediği anlarda etkilidir.',
    example: 'Blok beklentisini boşa çıkarmak için tip yaptı.',
    keywords: ['hücum', 'smaç', 'blok'],
  },
  {
    id: 10, term: 'Pancake', category: 'Savunma',
    desc: 'Oyuncunun yere uzanarak elini düz koyduğu savunma hamlesi.',
    detail: 'Top yere değmeden hemen önce el yatay olarak zemine yerleştirilir ve top bu elin üzerinden sekerek oyunda kalır. Büyük refleks gerektirir.',
    example: 'Son anda pancake kurtarışıyla puanı kurtardı.',
    keywords: ['defans', 'savunma'],
  },
  {
    id: 11, term: 'Rölyef', category: 'Savunma',
    desc: 'Rakibin smaçından sonra savunmada topun kontrolünü sağlayan teknik.',
    keywords: ['defans', 'savunma', 'blok', 'kontrol'],
  },
  {
    id: 12, term: 'Rotasyon', category: 'Kural',
    desc: 'Her servis kazanımında oyuncuların saat yönünde birer mevzi kaydığı zorunlu yer değiştirme.',
    keywords: ['rotasyon', 'pozisyon'],
  },
  {
    id: 13, term: 'Set', category: 'Kural',
    desc: 'Her oyunun bölünmüş birimleri; 25 sayıya ulaşan takım seti kazanır, 5. set 15 sayıda oynanır.',
    keywords: ['rotasyon', 'servis'],
  },
  {
    id: 14, term: 'Topa Sahip Olma', category: 'Diğer',
    desc: 'Topun rakibe geçmeden önce üç dokunuş hakkının tamamını kullanma stratejisi.',
    keywords: ['hücum', 'pas'],
  },
  {
    id: 15, term: 'Topspin Servis', category: 'Servis',
    desc: 'Topa üst rotasyon verilmesiyle sert ve düşük giden, karşı çıkması zor servis türü.',
    keywords: ['servis', 'rotasyon'],
  },
  {
    id: 16, term: 'Zıplama Servisi', category: 'Servis',
    desc: 'Oyuncunun zıplayarak havada vurduğu, güç ve açı avantajı sağlayan servis türü.',
    keywords: ['servis'],
  },
  {
    id: 17, term: 'Pipe', category: 'Hücum',
    desc: 'Arka sıra 6 numaralı pozisyondan yapılan orta saldırı.',
    keywords: ['hücum', 'pozisyon'],
  },
  {
    id: 18, term: 'Quick (Hızlı Pas)', category: 'Hücum',
    desc: 'Pasörün kısa ve hızlı verdiği pastan orta oyuncunun yapacağı ani smaç.',
    keywords: ['hücum', 'pas', 'smaç'],
  },
  {
    id: 19, term: 'Çift Faz', category: 'Kural',
    desc: 'Aynı oyuncunun topa iki kez art arda dokunması; bu kurala aykırıdır.',
    keywords: ['pas'],
  },
  {
    id: 20, term: 'Yüzer Çizgi', category: 'Kural',
    desc: 'Sahayı ikiye bölen ve oyuncuların rakip sahaya geçmesini engelleyen orta çizgi.',
    keywords: ['blok'],
  },
  {
    id: 21, term: 'Antenna', category: 'Kural',
    desc: 'Filenin her iki yanındaki dikey çubuk; topun bu çubuğun dışından geçmesi hatadır.',
    keywords: ['blok', 'servis'],
  },
  {
    id: 22, term: 'Libero Trafiği', category: 'Kural',
    desc: 'Liberonun bir sette en fazla iki kez aynı oyuncunun yerini alabilmesi kuralı.',
    keywords: ['pozisyon', 'rotasyon', 'defans'],
  },
  {
    id: 23, term: 'Servis Çizgisi', category: 'Kural',
    desc: 'Arkasından servis atılan 3 metre genişliğindeki servis bölgesi.',
    keywords: ['servis'],
  },
  {
    id: 24, term: 'Üçlü Blok', category: 'Blok',
    desc: 'Üç oyuncunun yan yana gelerek oluşturduğu geniş blok duvarı.',
    keywords: ['blok', 'savunma', 'smaç'],
  },
  {
    id: 25, term: 'Overhand Pas', category: 'Pas',
    desc: 'Parmak uçlarıyla yukarıdan yapılan, genellikle smaça hazırlık için kullanılan pas tekniği.',
    keywords: ['pas', 'smaç'],
  },
  {
    id: 26, term: 'Sideout', category: 'Diğer',
    desc: 'Rakibin servis attığı turda sayı kazanarak servis hakkını geri alma.',
    keywords: ['servis', 'rotasyon'],
  },
  {
    id: 27, term: 'Doğrudan Sayı', category: 'Kural',
    desc: 'Servis edilen topun smaç, blok veya serbest top kazanımıyla doğrudan sayıya dönüştürülmesi.',
    keywords: ['smaç', 'blok'],
  },
  {
    id: 28, term: 'Karşı Alan Saldırısı', category: 'Hücum',
    desc: 'Rakibin saldırısını blok veya kazanılan topla karşılayıp konter saldırıya geçme.',
    keywords: ['hücum', 'blok', 'defans'],
  },
  {
    id: 29, term: 'Arka Hat (Back Row)', category: 'Kural',
    desc: '1-6 rotasyonunda sahanın arka üçlü bölgesi; buradaki oyuncular 3 metre çizgisinin önünden sıçrayarak hücum edemez.',
    keywords: ['rotasyon', 'pozisyon', 'hücum'],
  },
  {
    id: 30, term: 'Bekleme Bölgesi', category: 'Kural',
    desc: 'Oyuna girecek veya çıkan oyuncuların bulunduğu alan.',
    keywords: ['pozisyon'],
  },
  {
    id: 31, term: 'Blok-Out', category: 'Hücum',
    desc: 'Hücum topunun bloktan sekerek oyun alanı dışına çıkması; hücum eden takımın sayısı olur.',
    keywords: ['hücum', 'blok'],
  },
  {
    id: 32, term: 'Çift Blok', category: 'Blok',
    desc: 'İki oyuncunun yan yana gelerek oluşturduğu blok türü.',
    keywords: ['blok', 'savunma'],
  },
  {
    id: 33, term: 'Çizgi Hakemi', category: 'Diğer',
    desc: 'Dip ve yan çizgileri gözleyen hakem.',
    keywords: ['kural'],
  },
  {
    id: 34, term: 'Çizgi Şutu (Line Shot)', category: 'Hücum',
    desc: 'Hücumun file kenarına paralel, düz bir çizgide vurulması.',
    keywords: ['hücum', 'smaç'],
  },
  {
    id: 35, term: 'Etkili Hücum Yüzdesi', category: 'Diğer',
    desc: '(Sayı - Hata) / Toplam hücum formülüyle hesaplanan hücum performans ölçütü.',
    keywords: ['hücum', 'istatistik'],
  },
  {
    id: 36, term: 'File Hatası (Net Fault)', category: 'Kural',
    desc: 'Oyun sırasında bir oyuncunun fileye veya antenlere kural dışı temas etmesi.',
    keywords: ['blok', 'kural'],
  },
  {
    id: 37, term: 'Formasyon', category: 'Savunma',
    desc: 'Servis karşılama veya savunmada kullanılan, örneğin 2-1-3 gibi oyuncu dizilişi.',
    keywords: ['defans', 'pozisyon', 'servis'],
  },
  {
    id: 38, term: 'Geçiş Oyunu (Transition)', category: 'Diğer',
    desc: 'Bir takımın savunmadan hücuma hızlı ve düzenli biçimde geçiş yapması.',
    keywords: ['defans', 'hücum'],
  },
  {
    id: 39, term: 'Gözlemci', category: 'Diğer',
    desc: 'Müsabaka organizasyonunu ve hakem performansını denetleyen yetkili.',
    keywords: ['kural'],
  },
  {
    id: 40, term: 'Hızlı Hücum (1. Tempo)', category: 'Hücum',
    desc: 'Pasörden top çıkarken hücumcunun zaten havada olduğu, çok hızlı tempolu hücum.',
    keywords: ['hücum', 'pas', 'smaç'],
  },
  {
    id: 41, term: 'Joust', category: 'Diğer',
    desc: 'File üstünde iki karşı oyuncunun aynı anda topa temas etme mücadelesi.',
    keywords: ['blok', 'kural'],
  },
  {
    id: 42, term: 'Kaptan', category: 'Diğer',
    desc: 'Takımın resmi temsilcisi; hakemlerle iletişimi yürüten oyuncu.',
    keywords: ['pozisyon'],
  },
  {
    id: 43, term: 'Maç Sayısı (Match Point)', category: 'Kural',
    desc: 'Bir takımın kazanmasıyla maçı bitirecek olan kritik sayı fırsatı.',
    keywords: ['kural'],
  },
  {
    id: 44, term: 'Mola (Time-Out)', category: 'Kural',
    desc: 'Antrenörün oyunun akışını değiştirmek için istediği zaman kullanabileceği kısa süre.',
    keywords: ['kural'],
  },
  {
    id: 45, term: 'Nötr Top (Free Ball)', category: 'Diğer',
    desc: 'Hücum niyeti taşımayan, kolayca karşı sahaya dönen top.',
    keywords: ['defans', 'hücum'],
  },
  {
    id: 46, term: 'Orta Oyuncu (Middle Blocker)', category: 'Diğer',
    desc: '3 numaradan merkez blok kuran ve hızlı hücum (1. tempo) yapan pozisyon.',
    keywords: ['pozisyon', 'blok', 'hücum'],
  },
  {
    id: 47, term: 'Overpass', category: 'Kural',
    desc: 'Servis karşılama topunun kontrolsüzce doğrudan file üzerinden rakip sahaya geçmesi.',
    keywords: ['servis', 'pas'],
  },
  {
    id: 48, term: 'Oyuncu Değişikliği (Substitution)', category: 'Kural',
    desc: 'Bir setin herhangi bir anında, kurallara uygun şekilde oyuncu değiştirme hakkı.',
    keywords: ['kural', 'rotasyon'],
  },
  {
    id: 49, term: 'Ön Hat (Front Row)', category: 'Kural',
    desc: '2, 3 ve 4 numaralı bölgelerden oluşan, blok ve hücum ağırlıklı üçlü hat.',
    keywords: ['rotasyon', 'pozisyon', 'blok', 'hücum'],
  },
  {
    id: 50, term: 'Pasör Çaprazı (Opposite)', category: 'Diğer',
    desc: 'Pasörün karşı pozisyonunda oynayan, servis karşılama yükü az olan takımın ana skoreri.',
    keywords: ['pozisyon', 'hücum'],
  },
  {
    id: 51, term: 'Plase', category: 'Hücum',
    desc: 'Smaça benzer teknikle, topu blok arkasındaki boşluğa yumuşak şekilde bırakma.',
    keywords: ['hücum', 'smaç', 'blok'],
  },
  {
    id: 52, term: 'Pozisyon Hatası', category: 'Kural',
    desc: 'Oyuncuların servis anında rotasyon sırasına veya doğru konuma uymamasından doğan ihlal.',
    keywords: ['rotasyon', 'pozisyon', 'servis'],
  },
  {
    id: 53, term: 'Servis Karşılama (Reception)', category: 'Savunma',
    desc: 'Rakip servisine yapılan ilk temas; pasörün rahat oynamasını belirleyen kritik aşama.',
    keywords: ['defans', 'servis', 'pas'],
  },
  {
    id: 54, term: 'Smaçör (Outside Hitter)', category: 'Diğer',
    desc: 'Genellikle 4 numaradan hücum eden, karşılama yükü de yüksek olan takımın ana hücumcusu.',
    keywords: ['pozisyon', 'hücum', 'defans'],
  },
  {
    id: 55, term: 'Şemsiye Savunma', category: 'Savunma',
    desc: 'Blok arkasında kalan alanı yay şeklinde kapatan savunma yerleşimi.',
    keywords: ['defans', 'blok'],
  },
  {
    id: 56, term: 'Tek Blok', category: 'Blok',
    desc: 'Filede yalnızca bir oyuncunun kurduğu blok türü.',
    keywords: ['blok'],
  },
  {
    id: 57, term: 'Teknik Mola', category: 'Kural',
    desc: 'Bazı liglerde set içinde belirli sayılara ulaşıldığında otomatik olarak verilen kısa mola.',
    keywords: ['kural'],
  },
  {
    id: 58, term: 'Top Taşıma (Lift)', category: 'Kural',
    desc: 'Topu kavrama ya da sürükleme gibi uzun süreli, kontrolsüz temas; kurala aykırıdır.',
    keywords: ['pas', 'kural'],
  },
  {
    id: 59, term: 'Uzatma (Deuce)', category: 'Kural',
    desc: 'Setin 24-24 veya beşinci sette 14-14 olması durumunda, kazanmak için iki fark şartının arandığı an.',
    keywords: ['kural'],
  },
  {
    id: 60, term: 'Yardımlı Blok (Soft Block)', category: 'Blok',
    desc: 'Topu doğrudan öldürmek yerine yumuşatarak takımın savunma yapmasına imkan veren blok.',
    keywords: ['blok', 'defans'],
  },
  {
    id: 61, term: 'Yüksek Top (High Ball)', category: 'Pas',
    desc: 'Blok tam yerleşsin, hücumcu da doğrulanabilsin diye bilerek yüksek verilen pas.',
    keywords: ['pas', 'blok', 'hücum'],
  },
];
