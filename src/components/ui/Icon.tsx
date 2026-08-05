import React from 'react';
import { View, ViewStyle } from 'react-native';

import Menu from '../../assets/icons/01-menu.svg';
import Geri from '../../assets/icons/02-geri.svg';
import Ileri from '../../assets/icons/03-ileri.svg';
import AnaSayfa from '../../assets/icons/04-ana-sayfa.svg';
import Takvim from '../../assets/icons/05-takvim.svg';
import Ekle from '../../assets/icons/06-ekle.svg';
import Filtre from '../../assets/icons/07-filtre.svg';
import Bildirim from '../../assets/icons/08-bildirim.svg';
import Profil from '../../assets/icons/09-profil.svg';
import Ayarlar from '../../assets/icons/10-ayarlar.svg';
import Antrenmanlar from '../../assets/icons/11-antrenmanlar.svg';
import DrilKutuphanesi from '../../assets/icons/12-diri-kutuphanesi.svg';
import Hareketler from '../../assets/icons/13-hareketler.svg';
import ProgramTanimlandi from '../../assets/icons/14-program-tanimlandi.svg';
import Istatistikler from '../../assets/icons/15-istatistikler.svg';
import Hedefler from '../../assets/icons/16-hedefler.svg';
import AiKoc from '../../assets/icons/17-ai-koc.svg';
import Basarilar from '../../assets/icons/19-basarilar.svg';
import Ilerleme from '../../assets/icons/21-ilerleme.svg';
import Kalori from '../../assets/icons/24-kalori.svg';
import Sure from '../../assets/icons/25-sure.svg';
import Pas from '../../assets/icons/30-temel-teknik-pas.svg';
import Savunma from '../../assets/icons/32-savunma.svg';
import Hucum from '../../assets/icons/33-hucum.svg';
import Smac from '../../assets/icons/34-smac.svg';
import Servis from '../../assets/icons/35-servis.svg';
import Blok from '../../assets/icons/36-blok.svg';
import OyunKurma from '../../assets/icons/37-oyun-kurma.svg';
import VideoIzle from '../../assets/icons/38-video-izle.svg';
import Notlar from '../../assets/icons/39-notlar.svg';
import Tamamlandi from '../../assets/icons/40-tamamlandi.svg';
import Tamamlanmadi from '../../assets/icons/41-tamamlanmadi.svg';
import Yaklasan from '../../assets/icons/42-yaklasan.svg';
import Uyari from '../../assets/icons/44-uyari.svg';
import Bilgi from '../../assets/icons/45-bilgi.svg';
import Paylas from '../../assets/icons/47-paylas.svg';
import Favori from '../../assets/icons/48-favori.svg';
import Sil from '../../assets/icons/49-sil.svg';
import VoleybolTopu from '../../assets/icons/50-voleybol-topu.svg';
import Soguma from '../../assets/icons/51-soguma.svg';
import AnaAntrenman from '../../assets/icons/52-ana-antrenman.svg';
import Cikis from '../../assets/icons/53-cikis.svg';
import Destek from '../../assets/icons/54-destek.svg';

const registry = {
  menu: Menu,
  geri: Geri,
  ileri: Ileri,
  'ana-sayfa': AnaSayfa,
  takvim: Takvim,
  ekle: Ekle,
  filtre: Filtre,
  bildirim: Bildirim,
  profil: Profil,
  ayarlar: Ayarlar,
  antrenmanlar: Antrenmanlar,
  kutuphane: DrilKutuphanesi,
  hareketler: Hareketler,
  'program-tanimlandi': ProgramTanimlandi,
  istatistikler: Istatistikler,
  hedefler: Hedefler,
  'ai-koc': AiKoc,
  basarilar: Basarilar,
  ilerleme: Ilerleme,
  kalori: Kalori,
  sure: Sure,
  pas: Pas,
  savunma: Savunma,
  hucum: Hucum,
  smac: Smac,
  servis: Servis,
  blok: Blok,
  'oyun-kurma': OyunKurma,
  'video-izle': VideoIzle,
  notlar: Notlar,
  tamamlandi: Tamamlandi,
  tamamlanmadi: Tamamlanmadi,
  yaklasan: Yaklasan,
  uyari: Uyari,
  bilgi: Bilgi,
  paylas: Paylas,
  favori: Favori,
  sil: Sil,
  'voleybol-topu': VoleybolTopu,
  soguma: Soguma,
  'ana-antrenman': AnaAntrenman,
  cikis: Cikis,
  destek: Destek,
};

export type IconName = keyof typeof registry;

type Props = { name: IconName; size?: number; style?: ViewStyle; opacity?: number };

export default function Icon({ name, size = 20, style, opacity = 1 }: Props) {
  const SvgIcon = registry[name];
  return (
    <View style={[{ width: size, height: size, opacity }, style]}>
      <SvgIcon width={size} height={size} />
    </View>
  );
}
