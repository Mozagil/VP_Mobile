export type Module = {
  id: number;
  title: string;
  desc: string;
  category: string;
  type: 'module' | 'technique';
  level: string;
  duration?: string;
  exercises: string[];
  tips: string[];
};

// Category → local image
export const categoryCovers: Record<string, any> = {
  'Bireysel Performans': require('../assets/covers/attack.jpg'),
  'Teknik Gelişim':      require('../assets/covers/passing.jpg'),
  'Takım Organizasyonu': require('../assets/covers/tactics.jpg'),
  'Pozisyona Özel':      require('../assets/covers/setting.jpg'),
  'Temel Teknikler':     require('../assets/covers/passing.jpg'),
  'Atak Teknikleri':     require('../assets/covers/attack.jpg'),
  'Savunma Teknikleri':  require('../assets/covers/defense.jpg'),
  'Servis Teknikleri':   require('../assets/covers/serve.jpg'),
};

export function getModuleCover(category: string) {
  return categoryCovers[category] ?? require('../assets/covers/tactics.jpg');
}

export const modules: Module[] = [
  { id: 1, type: 'module', title: 'Dikey Sıçrama Geliştirme', category: 'Bireysel Performans', level: 'Orta', duration: '6 hafta',
    desc: 'Patlayıcı güç ve dikey sıçrama yüksekliğini artırarak smaç ve blok performansını üst seviyeye taşımak.',
    exercises: ['Depth jump 3x8', 'Box jump 4x6', 'Single leg squat 3x10', 'Tuck jump 3x12', 'Weighted squat 4x8'],
    tips: ['Haftada 3 gün uygulayın', 'Dinlenme günlerini atlmayın', 'Formunuza dikkat edin'] },
  { id: 2, type: 'module', title: 'Hız ve İlk Adım', category: 'Bireysel Performans', level: 'Orta', duration: '4 hafta',
    desc: 'Reaksiyon hızı ve sahada ilk adım çabukluğunu geliştirmek.',
    exercises: ['Sprint start drili 5x10m', 'Lateral shuffle 4x15sn', 'T-drill 3x tekrar', 'Agility ladder 5x'],
    tips: ['Her tekrarı maksimum eforla yapın', 'Sıcak ısınma şart', 'Ayak pozisyonuna dikkat'] },
  { id: 3, type: 'module', title: 'Servis Tekniği Geliştirme', category: 'Bireysel Performans', level: 'Başlangıç', duration: '3 hafta',
    desc: 'Float ve jump servis mekaniklerini mükemmelleştirerek servis tutarlılığını artırmak.',
    exercises: ['Duvar servisi 3x20', 'Hedef bölge servisi 4x10', 'Jump float servis 3x15'],
    tips: ['Top atma yüksekliğini sabit tutun', 'Kol takibi tamamlansın', 'Hedefi önceden belirleyin'] },
  { id: 4, type: 'module', title: 'Core Stabilitesi', category: 'Bireysel Performans', level: 'Başlangıç', duration: '4 hafta',
    desc: 'Vücut merkez kası güçlendirme programı. Tüm voleybol hareketlerinin temelini oluşturur.',
    exercises: ['Plank 3x45sn', 'Side plank 3x30sn', 'Russian twist 3x20', 'Dead bug 3x12', 'Hollow hold 3x30sn'],
    tips: ['Bel pozisyonuna her zaman dikkat', 'Nefes kontrolü çok önemli', 'Süreyi kademeli artırın'] },
  { id: 5, type: 'module', title: 'Reaksiyon ve Refleks', category: 'Bireysel Performans', level: 'Orta', duration: '3 hafta',
    desc: 'Sahada top okuma ve tepki hızını artırarak savunma ve karşılama kalitesini yükseltmek.',
    exercises: ['Renkli top yakalama 4x10', 'Partner random toss 3x20', 'Multi-ball savunma 3x10'],
    tips: ['Göz top üzerinde olsun', 'Sürekli hazır pozisyonda kal', 'Zihinsel hazırlık antrenman kadar önemli'] },
  { id: 6, type: 'module', title: 'Rallide Dayanıklılık', category: 'Bireysel Performans', level: 'İleri', duration: '5 hafta',
    desc: 'Uzun rallilerde performans düşüşünü önleme kondisyon programı.',
    exercises: ['Interval sprint 8x30sn', 'Shuttle run 5x', 'Burpee+sprint 4x8', 'Maç simülasyonu 3x5dk'],
    tips: ['Kalp atış hızını takip et', 'Yeterli su tüket', 'Progresif yükleme yap'] },
  { id: 7, type: 'module', title: 'Manşet Mekaniği Düzeltme', category: 'Teknik Gelişim', level: 'Başlangıç', duration: '3 hafta',
    desc: 'Kolların doğru açısı, platform oluşturma ve kontrollü pas tekniğini mükemmelleştirmek.',
    exercises: ['Duvar manşet 5x30', 'Partner manşet 4x20', 'Hedefe manşet 3x15', 'Hareket halinde manşet 3x15'],
    tips: ['Kolları kilitli ve düz tut', 'Platform açısını kontrol et', 'Bacaklardan güç al'] },
  { id: 8, type: 'module', title: 'Servis Ritmi ve Tutarlılığı', category: 'Teknik Gelişim', level: 'Başlangıç', duration: '2 hafta',
    desc: 'Kişisel servis rutini oluşturarak servis tutarlılığını artırmak.',
    exercises: ['10 servis seri 3x10', 'Ritim sayarak servis 4x10', 'Baskı altında servis 3x10'],
    tips: ['Kendi ritminizi bulun', 'Top atma yüksekliği sabit olsun', 'Nefes + servis ritmi'] },
  { id: 9, type: 'module', title: 'Üstten Pas Netliği', category: 'Teknik Gelişim', level: 'Orta', duration: '4 hafta',
    desc: 'Parmak uçlarıyla hassas ve kontrollü set yapma becerisini geliştirmek.',
    exercises: ['Kendi kendine set 5x30', 'Partner uzun set 4x20', 'Hareket halinde set 3x15', 'Quick set 3x10'],
    tips: ['Üçgen el şekli oluştur', 'Bileklerden güç ver', 'Topu alın hizasında karşıla'] },
  { id: 10, type: 'module', title: 'Blok Zamanlaması', category: 'Teknik Gelişim', level: 'Orta', duration: '3 hafta',
    desc: 'Rakip atakçıyı okuma ve doğru zıplama zamanlaması kazanarak blok başarı oranını artırmak.',
    exercises: ['Shadow block 4x10', 'Partner atak+blok 3x10', 'Çift blok koordinasyon 3x8'],
    tips: ['Rakibin omzunu izle', 'Ellerini fileyi aşacak şekilde uzat', 'Çok erken zıplama'] },
  { id: 11, type: 'module', title: 'Atak Kol Mekaniği', category: 'Teknik Gelişim', level: 'Orta', duration: '3 hafta',
    desc: 'Doğru kol çekişi, vuruş noktası ve takip hareketi ile smaç gücünü geliştirmek.',
    exercises: ['Duvar smaç 5x15', 'Standing spike 4x10', 'Approach+spike 3x10'],
    tips: ['Dirseği yüksek tut', 'Topu en yüksek noktada vur', 'Bilek snap çalış'] },
  { id: 12, type: 'module', title: '5-1 Formasyon Sistemi', category: 'Takım Organizasyonu', level: 'Orta', duration: '4 hafta',
    desc: '1 pasör, 5 atakçı ile oynanan sistem ve rotasyon yapısını öğrenmek.',
    exercises: ['6 rotasyon walkthrough', 'Serve receive 4x tekrar', 'Transition drili 3x10'],
    tips: ['Rotasyonları ezberle', 'Pasör penetrasyonu hızlı olsun', 'İletişim her şeydir'] },
  { id: 13, type: 'module', title: 'Side-out Disiplini', category: 'Takım Organizasyonu', level: 'İleri', duration: '3 hafta',
    desc: 'Karşı takım servisinde sayı alma oranını artırmak.',
    exercises: ['Serve receive+atak 4x10', 'First ball kill 3x10', 'Kontrollü serve receive 4x15'],
    tips: ['İlk pas kalitesi her şeyi belirler', 'İlk temasta hata minimize et', 'Basit oyna'] },
];

export const techniques: Module[] = [
  { id: 101, type: 'technique', title: 'Manşet (Forearm Pass)', category: 'Temel Teknikler', level: 'Başlangıç', duration: undefined,
    desc: 'Kolların düz tutularak topun ön kol iç yüzeyiyle kontrol edilmesi tekniğidir. Voleybolun en temel savunma ve pas alma becerisidir.',
    exercises: ['Duvar manşet çalışması', 'Partner manşet alışverişi', 'Servis karşılama drili', 'Hareket sonrası manşet'],
    tips: ['Kollarınızı düz tutun', 'Dizlerinizi hafif bükün', 'Topu gövdenizin önünde karşılayın'] },
  { id: 102, type: 'technique', title: 'Üstten Pas (Overhead Pass / Set)', category: 'Temel Teknikler', level: 'Başlangıç', duration: undefined,
    desc: 'Parmak uçlarıyla yukarıdan yapılan, genellikle smaça hazırlık için kullanılan temel pas tekniği.',
    exercises: ['Kendi kendine set', 'Duvar set', 'Partner set', 'Hareket halinde set'],
    tips: ['Üçgen el şekli oluştur', 'Bileklerden güç ver', 'Topu alın hizasında karşıla'] },
  { id: 103, type: 'technique', title: 'Savunma Pozisyonu (Defensive Stance)', category: 'Savunma Teknikleri', level: 'Başlangıç', duration: undefined,
    desc: 'Voleybolda tüm savunma hareketlerinin başlangıç noktası olan temel hazır duruş pozisyonu.',
    exercises: ['Base pozisyon drili', 'Lateral shuffle', 'Reaksiyon drili'],
    tips: ['Dizleri bük, ağırlığı öne ver', 'Ayaklar omuz genişliğinde', 'Gözler topu izlesin'] },
  { id: 104, type: 'technique', title: 'Smaç (Spike)', category: 'Atak Teknikleri', level: 'Orta', duration: undefined,
    desc: 'Filein üzerinden rakip sahaya kuvvetli vurulan temel atak tekniği.',
    exercises: ['Yaklaşım adımları', 'Kol salınım drili', 'Approach+spike', 'Hedef smaç'],
    tips: ['4 adım yaklaşım: sol-sağ-sol (sağ elini için)', 'Dirsek yüksek tut', 'Bilek snap yap'] },
  { id: 105, type: 'technique', title: 'Servis (Float)', category: 'Servis Teknikleri', level: 'Başlangıç', duration: undefined,
    desc: 'Topu döndürmeden atılan, havada salınım yapan ve savunmayı zorlayan servis türü.',
    exercises: ['Duvar servisi', 'Kısa mesafe servis', 'Hedef bölge servisi'],
    tips: ['Top atma yüksekliği sabit olsun', 'Bilekten snap yapma', 'Topa düz vur'] },
  { id: 106, type: 'technique', title: 'Blok', category: 'Savunma Teknikleri', level: 'Orta', duration: undefined,
    desc: 'File üzerinde rakibin smaçına karşı yapılan engelleme hareketi.',
    exercises: ['Shadow block', 'Yerinde zıplama blok', 'Partner atak+blok'],
    tips: ['Rakibin omzunu izle', 'Ellerini fileyi aşacak uzat', 'Erken zıplama'] },
  { id: 107, type: 'technique', title: 'Pancake Kurtarış', category: 'Savunma Teknikleri', level: 'İleri', duration: undefined,
    desc: 'El sırtıyla yerden top kurtarma; imkansız görünen topları kazandıran ileri savunma becerisi.',
    exercises: ['Pancake pozisyon drili', 'Dalış+pancake', 'Rastgele top fırlatma+pancake'],
    tips: ['Eli düz ve yere paralel tut', 'Dalış açısını düşük tut', 'Topun iniş noktasını tahmin et'] },
];

export const allModules = [...modules, ...techniques];
