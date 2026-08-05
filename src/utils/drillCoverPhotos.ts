import { MEDIA_BASE_URL } from '../api/client';

// Real cover photos for the videoed drills, keyed by drill id — filenames
// match the "DRILL NO" used in the source video/description docs.
const drillCoverFiles: Record<number, string> = {
  106: '2604210.png',
  107: '5791380.png',
  108: '7807231.png',
  109: '0915451.png',
  110: '4139500.png',
  111: '0277870.png',
  112: '2820530.png',
  113: '6385920.png',
  114: '5933950.png',
  115: '0588779.png',
  116: '8172569.png',
  117: '5167809.png',
  118: '2526560.png',
  119: '6222060.png',
  120: '8469880.png',
  121: '4337161.png',
  122: '5700841.png',
  123: '4702930.png',
  124: '6975250.png',
  125: '2141891.png',
  126: '2728040.png',
  127: '2640760.png',
  128: '556901.png',
  129: '9416928.png',
  130: '3302579.png',
  131: '3566389.png',
  132: '8250179.png',
  133: '5161660.png',
  134: '0714641.png',
  135: '6934130.png',
  136: '8702068.png',
  137: '0474482.png',
};

export function coverPhotoUrlFor(drillId: number): string | null {
  const file = drillCoverFiles[drillId];
  return file ? `${MEDIA_BASE_URL}/static/covers/${file}` : null;
}
