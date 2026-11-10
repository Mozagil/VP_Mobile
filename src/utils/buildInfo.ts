import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

/**
 * Cihazda gerçekte hangi sürümün çalıştığını gösteren etiket.
 * Örnek: "1.2.2 (23)" (mağaza derlemesi), "1.2.2 (23) · OTA 01a1c22d" (üstüne güncelleme inmiş).
 *
 * Elle güncellenmez. Eski sabit etiket ("v19") derlemelerde değiştirilmediği için
 * yanıltıcı oluyordu; bu değerler derlemeden ve çalışan güncellemeden okunur.
 * Yalnızca mevcut modüller kullanılır (yeni yerel bağımlılık yok), bu yüzden OTA ile de güvenle gider.
 */
export function getBuildLabel(): string {
  // runtimeVersion "appVersion" politikasında yerel uygulamanın sürümüdür.
  const version = Updates.runtimeVersion ?? Constants.expoConfig?.version ?? '?';
  const code =
    Constants.platform?.android?.versionCode ??
    Constants.platform?.ios?.buildNumber ??
    null;
  const ota =
    !Updates.isEmbeddedLaunch && Updates.updateId
      ? ` · OTA ${Updates.updateId.slice(0, 8)}`
      : '';
  return `${version}${code != null ? ` (${code})` : ''}${ota}`;
}
