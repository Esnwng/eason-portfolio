// Skyline composition, measured from content: every window's proportions come from its image,
// every label from the entry's own fields. Tower profiles cycle so new works keep the skyline varied.
import type { ImageMetadata } from 'astro';
import type { FilmWithAwards } from '../../lib/pages';
import type { Gallery } from '../../lib/content';

export type Slot = {
  key: string;
  href: string;
  src: ImageMetadata;
  alt: string;
  title: string;
  meta: string;
  r: number; // window aspect (desktop)
  rm: number; // window aspect (phone)
  fr: number; // column width
  rise: number; // px of facade below the window
  roof: 'tank' | 'step' | 'spire' | 'antenna' | 'beacon';
  spanM: number; // phone grid span (of 6)
  film?: FilmWithAwards;
};

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
// Rises are spread so neighbouring towers differ by at least 120px of facade (film slot sits at index 2).
const PROFILES: { hk: number; rise: number; roof: Slot['roof'] }[] = [
  { hk: 1.0, rise: 150, roof: 'step' },
  { hk: 1.18, rise: 0, roof: 'spire' },
  { hk: 0.94, rise: 0, roof: 'tank' },
  { hk: 0.9, rise: 160, roof: 'antenna' },
  { hk: 1.1, rise: 20, roof: 'step' },
  { hk: 1.02, rise: 170, roof: 'tank' },
];
const FILM_RISE = 130;

export function countLabel(g: Gallery) {
  const n = g.images.length, v = g.data.videos.length;
  return [n ? `${n} ${n === 1 ? 'image' : 'images'}` : '', v ? `${v} ${v === 1 ? 'clip' : 'clips'}` : ''].filter(Boolean).join(' · ');
}

/** One line of sign lettering for a film's awards, oldest first: "CHINH GOLD 2023 · ETHOS OFFICIAL SELECTION 2026". */
export function beaconLine(awards: { data: { title: string; festival: string; date: string } }[]) {
  return [...awards]
    .sort((a, b) => a.data.date.localeCompare(b.data.date))
    .map((a) => {
      const words = a.data.festival.split(/\s+/).filter((w) => !/^\d+(st|nd|rd|th)$/i.test(w) && !/^(international|the)$/i.test(w));
      const short = words[0] ?? '';
      const title = short && !a.data.title.toLowerCase().includes(short.toLowerCase()) ? `${short} ${a.data.title}` : a.data.title;
      return `${title} ${a.data.date.slice(0, 4)}`;
    })
    .join(' · ');
}

export function seriesMeta(g: Gallery) {
  return [g.data.location, g.data.year, countLabel(g)].filter(Boolean).join(' · ');
}

export function buildSkyline(films: FilmWithAwards[], galleries: Gallery[]): Slot[] {
  const film = films[0];
  const series = galleries.filter((g) => g.cover).slice(0, film ? 5 : 6);
  const slots: Slot[] = series.map((g, i) => {
    const p = PROFILES[i % PROFILES.length];
    const src = g.cover!;
    const r = clamp(src.width / src.height, 0.6, 1.25);
    return {
      key: g.id, href: `/photography/${g.id}`, src, alt: `${g.data.title}: photography series`,
      title: g.data.title, meta: seriesMeta(g), r, rm: clamp(r, 0.8, 1.8), fr: Math.max(r * p.hk, 0.85), rise: p.rise, roof: p.roof, spanM: 3,
    };
  });
  if (film) {
    const r = clamp(film.data.poster.width / film.data.poster.height, 1.5, 1.9);
    slots.splice(Math.min(2, slots.length), 0, {
      key: film.id, href: `/work/${film.id}`, src: film.data.poster, alt: `${film.data.title}: still from the film`,
      title: film.data.title, meta: [film.data.role, film.data.year].filter(Boolean).join(' · '),
      r, rm: r, fr: r * 1.75, rise: FILM_RISE, roof: 'beacon', spanM: 6, film,
    });
  }
  // Phone: the film comes first (CSS order), the other towers share rows of two or three.
  const rest = slots.filter((x) => !x.film);
  const rows: number[] = [];
  let n = rest.length;
  if (n % 3 === 1 && n > 1) { rows.push(2, 2); n -= 4; } else if (n % 3 === 2) { rows.push(2); n -= 2; } else if (n === 1) { rows.push(1); n = 0; }
  while (n > 0) { rows.push(3); n -= 3; }
  let k = 0;
  for (const size of rows) for (let j = 0; j < size; j++) rest[k++].spanM = 6 / size;
  return slots;
}
