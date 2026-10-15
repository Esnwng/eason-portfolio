// Hanging maths for the gallery world.
// A "wall" is a row of works hung on one eye-line. Each work gets a width in
// container-query units (cqw of the hang) so works keep their relative scale at
// every viewport. Scale is set by area, not width, so portrait and landscape
// prints of the same rank read as the same weight.
import type { ImageMetadata } from 'astro';

// Relative areas per position for walls of 1, 2, 3 works. The value 1 is the
// lead work; the rest hang smaller beside it.
const PATTERNS: Record<number, number[]> = {
  1: [1.35],
  2: [1, 0.5],
  3: [0.55, 1, 0.36],
};
const LEAD_SLOT: Record<number, number> = { 1: 0, 2: 0, 3: 1 };
const BASE_AREA = 1500; // cqw^2 for the lead work
const GAP = 6; // cqw between works, mirrored in global.css
const SINGLE_MAX = 66; // a lone landscape never fills the wall

export type Hung<T> = { item: T; w: number; wm: number; side: 'start' | 'end' | 'center'; lead: boolean };

export const aspect = (img: ImageMetadata) => img.width / img.height;

/** Lay out one wall. `items[leadIndex]` is placed in the lead slot. */
export function composeWall<T>(items: T[], aspectOf: (t: T) => number, leadIndex = 0, wallIndex = 0): Hung<T>[] {
  const n = Math.min(items.length, 3);
  const list = items.slice(0, n);
  const pattern = PATTERNS[n] ?? PATTERNS[1];
  // Move the lead into its slot.
  const slot = LEAD_SLOT[n] ?? 0;
  if (leadIndex !== slot && leadIndex < n) {
    const [lead] = list.splice(leadIndex, 1);
    list.splice(slot, 0, lead);
  }
  let widths = list.map((t, i) => Math.sqrt(BASE_AREA * pattern[i] * aspectOf(t)));
  if (n === 1) widths = widths.map((w) => Math.min(w, SINGLE_MAX));
  const budget = 100 - GAP * (n - 1) - 2;
  const sum = widths.reduce((a, b) => a + b, 0);
  const k = Math.min(1, budget / sum);
  return list.map((item, i) => {
    const rel = pattern[i];
    const wm = rel >= 1 ? 100 : rel >= 0.5 ? 84 : 68;
    const side = wm === 100 ? 'center' : (i + wallIndex) % 2 === 0 ? 'start' : 'end';
    return { item, w: +(widths[i] * k).toFixed(2), wm, side, lead: i === slot };
  });
}

/** Split a series into walls with a walking rhythm: dense, dense, quiet. */
export function chunkWalls<T>(items: T[], rhythm = [3, 2, 1]): T[][] {
  const walls: T[][] = [];
  let i = 0;
  let r = 0;
  while (i < items.length) {
    const size = rhythm[r % rhythm.length];
    walls.push(items.slice(i, i + size));
    i += size;
    r++;
  }
  return walls;
}

/** `sizes` attribute for a work of width `w` cqw; the hang is roughly 0.9 of the viewport. */
export const sizesFor = (w: number, wm: number) =>
  `(max-width: 720px) ${Math.round(wm * 0.92)}vw, ${Math.max(20, Math.round(w * 0.9))}vw`;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
