import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

// Every image inside a gallery folder. Adding a jpg to a folder is all that is needed to publish it.
const galleryImages = import.meta.glob<ImageMetadata>('/src/content/galleries/*/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
});

export type GalleryImage = { src: ImageMetadata; file: string };

export function imagesFor(galleryId: string): GalleryImage[] {
  return Object.entries(galleryImages)
    .filter(([p]) => p.includes(`/galleries/${galleryId}/`))
    .map(([p, src]) => ({ src, file: p.split('/').pop() ?? p }))
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
}

export async function getSite() {
  const site = await getEntry('site', 'main');
  if (!site) throw new Error('src/content/site.json must contain an entry with id "main"');
  return site.data;
}

export async function getGalleries() {
  const all = await getCollection('galleries', ({ data }) => data.published);
  return all
    .map((g) => {
      const images = imagesFor(g.id);
      const cover = g.data.cover ?? images[0]?.src;
      return { ...g, images, cover, count: images.length + g.data.videos.length };
    })
    .filter((g) => g.count > 0)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getFilms() {
  const all = await getCollection('films', ({ data }) => data.published);
  return all.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

const byDateDesc = <T extends { data: { date: string } }>(a: T, b: T) => b.data.date.localeCompare(a.data.date);

export async function getAwards() {
  return (await getCollection('awards', ({ data }) => data.published)).sort(byDateDesc);
}
export async function getPress() {
  return (await getCollection('press', ({ data }) => data.published)).sort(byDateDesc);
}
export async function getExhibitions() {
  return (await getCollection('exhibitions', ({ data }) => data.published)).sort(byDateDesc);
}

export function formatDate(d: string) {
  const [y, m] = d.split('-');
  if (!m) return y;
  const month = new Date(Number(y), Number(m) - 1, 1).toLocaleString('en-US', { month: 'long' });
  return `${month} ${y}`;
}

export type Film = CollectionEntry<'films'>;
export type Gallery = Awaited<ReturnType<typeof getGalleries>>[number];
