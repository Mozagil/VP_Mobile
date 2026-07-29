import { MEDIA_BASE_URL } from '../api/client';

const drillVideoFiles: Record<number, string> = {
  12: 'karsilikli-temel-manset-karsilama.mov',
};

export function videoUrlFor(drillId: number): string | null {
  const file = drillVideoFiles[drillId];
  return file ? `${MEDIA_BASE_URL}/static/videos/${file}` : null;
}
