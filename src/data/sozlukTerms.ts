export type SozlukTerm = {
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
    term: 'Ace', category: 'Servis',
    desc: 'Rakibin dokunmadan ya da hata yaparak tamamlanamayan, doğrudan sayı kazandıran servis.',
    detail: 'Ace serviste hedef, savunucunun pozisyon dışına düşen ya da kontrolsüz bir topa neden olacak şekilde hız veya yerleştirme avantajı sağlamaktır.',
    example: "Güçlü float servisini ace'e dönüştürerek seti kapattı.",
    keywords: ['servis', 'doğrudan sayı', 'hız', 'yerleştirme'],
  },
  {
    term: 'Blok', category: 'Blok',
    desc: 'File üzerinde rakibin smaçına karşı yapılan engelleme hareketi.',
    detail: '1, 2 veya 3 oyuncuyla yapılabilir. Etkili bir blok, rakibin saldırı açısını daraltır ve takım savunmasını kolaylaştırır.',
    example: 'Ortanın çift bloğu rakibin güçlü smaçını sahaya düşürdü.',
    keywords: ['blok', 'file', 'savunma', 'smaç'],
  },
  {
    term: 'Libero', category: 'Diğer',
    desc: 'Özel formaya sahip, yalnızca arka sırada oynayan savunma uzmanı oyuncu.',
    detail: 'Libero smaç atamaz ve servis kullanamaz. Arka sıra rotasyonlarında herhangi bir oyuncunun yerine serbestçe girebilir; bu değişim sayılmaz.',
    example: 'Libero servis bölgesine çöktü ve zor topu kurtardı.',
    keywords: ['pozisyon', 'savunma', 'rotasyon'],
  },
  {
    term: 'Manşet', category: 'Savunma',
    desc: 'Rakibin servis veya saldırı vuruşlarını karşılamak için önkolların birleştirilip düzleştirilerek topa kontrollü şekilde yön verilen temel savunma tekniği.',
    detail: 'Her iki kolun iç yüzeyi birleştirilir, dirsekler kilitlenir ve gövde topa doğru pozisyon alarak sabit bir platform oluşturur. Karşılamada ve savunmada kullanılır.',
    example: 'Rakip servis kullandığında, libero durağan pozisyonda gelen topu manşet ile karşılayarak pasöre organize bir geçiş yaptı.',
    keywords: ['defans', 'servis karşılama', 'kontrol', 'gövde pozisyonu', 'platform'],
  },
  {
    term: 'Pasör', category: 'Diğer',
    desc: 'Takımın oyun kuruculuğunu yapan, smaçörlere ikinci dokunuşu aktaran oyuncu.',
    detail: 'Pasör, rakip savunmasını okuyarak hızlı, yüksek veya çapraz setler vererek saldırıyı yönetir. Takımın motor gücüdür.',
    example: 'Pasör hızlı set ile ortanın önüne harika bir açılım yaptı.',
    keywords: ['pozisyon', 'pas', 'hücum'],
  },
  {
    term: 'Smaç', category: 'Hücum',
    desc: 'File üzerinden rakip sahaya kuvvetli vurulan atak tekniği.',
    detail: 'Smaçör zıplayarak havada topla buluşur; bilek, omuz ve gövde rotasyonuyla güç üretir. Köşe, çapraz veya düz hedeflere vurulabilir.',
    example: 'Köşe smaç ile rakibin savunmasını dağıttı.',
    keywords: ['hücum', 'smaç', 'blok', 'pas'],
  },
  {
    term: 'Floater', category: 'Servis',
    desc: 'Topu döndürmeden atılan, havada salınım yapan ve savunucuyu zorlayan servis türü.',
    detail: 'Topa herhangi bir spin verilmez; bu durum topun hava akışından etkilenerek öngörülemez biçimde salınmasına yol açar.',
    example: 'Float servis savunucunun gözünden kaçarak düştü.',
    keywords: ['servis', 'defans'],
  },
  {
    term: 'Dump', category: 'Hücum',
    desc: 'Pasörün ikinci dokunuşta fileyi geçirerek yaptığı sürpriz topa vurma.',
    detail: 'Rakip takım genellikle üçüncü bir dokunuş beklerken pasörün topu doğrudan rakip sahaya bırakması sürpriz yaratır.',
    example: 'Pasör rakibi şaşırtmak için dump yaptı.',
    keywords: ['hücum', 'pas', 'pozisyon'],
  },
  {
    term: 'Tip', category: 'Hücum',
    desc: 'Smaç pozisyonundan güçlü vurmak yerine parmak uçlarıyla yapılan kontrollü dokunuş.',
    detail: 'Blok duvarını aşmak veya boş bölgeye yerleştirmek amacıyla kullanılır. Savunmanın güç beklediği anlarda etkilidir.',
    example: 'Blok beklentisini boşa çıkarmak için tip yaptı.',
    keywords: ['hücum', 'smaç', 'blok'],
  },
  {
    term: 'Pancake', category: 'Savunma',
    desc: 'Oyuncunun yere uzanarak elini düz koyduğu savunma hamlesi.',
    detail: 'Top yere değmeden hemen önce el yatay olarak zemine yerleştirilir ve top bu elin üzerinden sekerek oyunda kalır. Büyük refleks gerektirir.',
    example: 'Son anda pancake kurtarışıyla puanı kurtardı.',
    keywords: ['defans', 'savunma'],
  },
  {
    term: 'Rölyef', category: 'Savunma',
    desc: 'Rakibin smaçından sonra savunmada topun kontrolünü sağlayan teknik.',
    keywords: ['defans', 'savunma', 'blok', 'kontrol'],
  },
  {
    term: 'Rotasyon', category: 'Kural',
    desc: 'Her servis kazanımında oyuncuların saat yönünde birer mevzi kaydığı zorunlu yer değiştirme.',
    keywords: ['rotasyon', 'pozisyon'],
  },
  {
    term: 'Set', category: 'Kural',
    desc: 'Her oyunun bölünmüş birimleri; 25 sayıya ulaşan takım seti kazanır, 5. set 15 sayıda oynanır.',
    keywords: ['rotasyon', 'servis'],
  },
  {
    term: 'Topa Sahip Olma', category: 'Diğer',
    desc: 'Topun rakibe geçmeden önce üç dokunuş hakkının tamamını kullanma stratejisi.',
    keywords: ['hücum', 'pas'],
  },
  {
    term: 'Topspin Servis', category: 'Servis',
    desc: 'Topa üst rotasyon verilmesiyle sert ve düşük giden, karşı çıkması zor servis türü.',
    keywords: ['servis', 'rotasyon'],
  },
  {
    term: 'Zıplama Servisi', category: 'Servis',
    desc: 'Oyuncunun zıplayarak havada vurduğu, güç ve açı avantajı sağlayan servis türü.',
    keywords: ['servis'],
  },
  {
    term: 'Pipe', category: 'Hücum',
    desc: 'Arka sıra 6 numaralı pozisyondan yapılan orta saldırı.',
    keywords: ['hücum', 'pozisyon'],
  },
  {
    term: 'Quick (Hızlı Pas)', category: 'Hücum',
    desc: 'Pasörün kısa ve hızlı verdiği pastan orta oyuncunun yapacağı ani smaç.',
    keywords: ['hücum', 'pas', 'smaç'],
  },
  {
    term: 'Çift Faz', category: 'Kural',
    desc: 'Aynı oyuncunun topa iki kez art arda dokunması; bu kurala aykırıdır.',
    keywords: ['pas'],
  },
  {
    term: 'Yüzer Çizgi', category: 'Kural',
    desc: 'Sahayı ikiye bölen ve oyuncuların rakip sahaya geçmesini engelleyen orta çizgi.',
    keywords: ['blok'],
  },
  {
    term: 'Antenna', category: 'Kural',
    desc: 'Filenin her iki yanındaki dikey çubuk; topun bu çubuğun dışından geçmesi hatadır.',
    keywords: ['blok', 'servis'],
  },
  {
    term: 'Libero Trafiği', category: 'Kural',
    desc: 'Liberonun bir sette en fazla iki kez aynı oyuncunun yerini alabilmesi kuralı.',
    keywords: ['pozisyon', 'rotasyon', 'defans'],
  },
  {
    term: 'Servis Çizgisi', category: 'Kural',
    desc: 'Arkasından servis atılan 3 metre genişliğindeki servis bölgesi.',
    keywords: ['servis'],
  },
  {
    term: 'Üçlü Blok', category: 'Blok',
    desc: 'Üç oyuncunun yan yana gelerek oluşturduğu geniş blok duvarı.',
    keywords: ['blok', 'savunma', 'smaç'],
  },
  {
    term: 'Overhand Pas', category: 'Pas',
    desc: 'Parmak uçlarıyla yukarıdan yapılan, genellikle smaça hazırlık için kullanılan pas tekniği.',
    keywords: ['pas', 'smaç'],
  },
  {
    term: 'Sideout', category: 'Diğer',
    desc: 'Rakibin servis attığı turda sayı kazanarak servis hakkını geri alma.',
    keywords: ['servis', 'rotasyon'],
  },
  {
    term: 'Doğrudan Sayı', category: 'Kural',
    desc: 'Servis edilen topun smaç, blok veya serbest top kazanımıyla doğrudan sayıya dönüştürülmesi.',
    keywords: ['smaç', 'blok'],
  },
  {
    term: 'Karşı Alan Saldırısı', category: 'Hücum',
    desc: 'Rakibin saldırısını blok veya kazanılan topla karşılayıp konter saldırıya geçme.',
    keywords: ['hücum', 'blok', 'defans'],
  },
];
