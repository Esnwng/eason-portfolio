// Shared data loaders: every world receives exactly these props for each page.
import { getImage } from 'astro:assets';
import { getSite, getFilms, getGalleries, getAwards, getPress, getExhibitions, imagesFor, formatDate, type Film, type Gallery } from './content';

export type FilmWithAwards = Film & { awards: Awaited<ReturnType<typeof getAwards>> };

async function filmsWithAwards() {
  const [films, awards] = await Promise.all([getFilms(), getAwards()]);
  return films.map((f) => Object.assign(f, { awards: awards.filter((a) => a.data.work === f.id) })) as FilmWithAwards[];
}

export async function homeProps() {
  const [site, films, galleries, awards, press, exhibitions] = await Promise.all([getSite(), filmsWithAwards(), getGalleries(), getAwards(), getPress(), getExhibitions()]);
  const heroImage = imagesFor(site.hero.gallery).find((i) => i.file === site.hero.file)?.src ?? galleries[0]?.cover;
  if (!heroImage) throw new Error('No hero image: check site.json "hero"');
  const og = await getImage({ src: heroImage, width: 1200, height: 630, fit: 'cover', format: 'jpg' });
  return { site, films, galleries, awards, press, exhibitions, heroImage, ogImage: og.src };
}

export async function workIndexProps() {
  const [site, films] = await Promise.all([getSite(), filmsWithAwards()]);
  return { site, films };
}

export async function filmPageProps(film: Film) {
  const [site, awards] = await Promise.all([getSite(), getAwards()]);
  const og = await getImage({ src: film.data.poster, width: 1200, height: 630, fit: 'cover', format: 'jpg' });
  return { site, film, awards: awards.filter((a) => a.data.work === film.id), ogImage: og.src };
}

export async function photoIndexProps() {
  const [site, galleries] = await Promise.all([getSite(), getGalleries()]);
  return { site, galleries };
}

export async function galleryPageProps(gallery: Gallery, next: Gallery | undefined) {
  const site = await getSite();
  // Full-size (lightbox) URLs, index-aligned with gallery.images
  const full = await Promise.all(gallery.images.map((img) => getImage({ src: img.src, width: 2000, format: 'webp', quality: 84 })));
  const og = gallery.cover ? (await getImage({ src: gallery.cover, width: 1200, height: 630, fit: 'cover', format: 'jpg' })).src : undefined;
  return { site, gallery, full: full.map((f) => f.src), next, ogImage: og };
}

export async function cvProps() {
  const [site, films, awards, exhibitions, press, galleries] = await Promise.all([getSite(), filmsWithAwards(), getAwards(), getExhibitions(), getPress(), getGalleries()]);
  return { site, films, awards, exhibitions, press, galleries };
}

export { formatDate };
