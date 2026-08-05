import { MEDIA_BASE_URL } from '../api/client';

const drillVideoFiles: Record<number, string> = {
  106: 'diz-uzerinde-sag-sol-reaksiyon-ve-tek-temas-kontrolu.mov',
  107: 'file-uzerinde-blok-zamanlamasi-ve-temas-teknigi.mov',
  108: 'tek-diz-uzerinde-4-numaraya-kontrollu-parmak-pas.mov',
  109: 'sabit-pozisyonda-2-numara-blok-calismasi.mov',
  110: 'tek-diz-uzerinde-direkt-tek-temasli-4-numaraya-parmak-pas.mov',
  111: 'hedefe-yonlendirmeli-ikili-yon-parmak-pas-calismasi.mov',
  112: 'sicrayarak-jump-set-4-numaraya-parmak-pas.mov',
  113: 'karsilikli-temel-manset-pas-calismasi.mov',
  114: 'keskin-capraz-smac-ve-kontrollu-manset-calismasi.mov',
  115: 'yanal-hareketli-file-uzeri-parmak-pas-calismasi.mov',
  116: 'diz-uzerinde-pancake-reaksiyon-calismasi.mov',
  117: 'karsilikli-ayakta-ziplamasiz-smac-calismasi.mov',
  118: 'manset-kontrolu-ve-ikinci-temasa-hazirlik-calismasi.mov',
  119: 'bas-uzerinde-kontrollu-parmak-pas-calismasi.mov',
  120: 'servis-karsilama-hedefe-yonlendirilmis-manset-calismasi.mov',
  121: 'temel-sicrayarak-jump-serve-servis-calismasi.mov',
  122: 'karisik-tekniklerle-karsilikli-top-kontrolu-calismasi.mov',
  123: 'parmak-pas-kontrolu-ve-ikinci-temas-calismasi.mov',
  124: '4-numaradan-hedefe-yonlendirilmis-hucum-calismasi.mov',
  125: 'sirti-donuk-pozisyonda-2-numaraya-geriye-parmak-pas.mov',
  126: 'sirti-donuk-pozisyonda-4-numaraya-geriye-parmak-pas.mov',
  127: 'pasorden-tip-ve-plase-hucum-karar-calismasi.mov',
  128: 'duvarda-hedefli-servis-ve-manset-karsilama-calismasi.mov',
  129: '4-numaraya-temel-parmak-pas-calismasi.mov',
  130: 'smac-manset-kontrollu-hucum-devamlilik-calismasi.mov',
  131: '2-numaradan-hedefe-yonlendirilmis-hucum-calismasi.mov',
  132: 'ortadan-hucum-hazirligi-ve-atak-zamanlamasi-calismasi.mov',
  133: 'donuslu-reaksiyon-ve-ardisik-smac-savunmasi.mov',
  134: 'mansetten-hucuma-gecis-4-numara-atagi.mov',
  135: 'top-destekli-parmak-pas-koordinasyon-calismasi.mov',
  136: 'hareketli-parmak-pas-ve-pozisyon-degistirme-calismasi.mov',
  137: 'bank-uzerinde-kademeli-geriye-parmak-pas-gelisim-calismasi.mov',
};

export function videoUrlFor(drillId: number): string | null {
  const file = drillVideoFiles[drillId];
  return file ? `${MEDIA_BASE_URL}/static/videos/${file}` : null;
}
