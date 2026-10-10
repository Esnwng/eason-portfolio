// A "world" is one complete visual implementation of the site (layout + page components).
// Pages under src/pages are thin: they load data and hand it to the active world's component.
// Select with PUBLIC_WORLD=<name> (folder under src/worlds). Default: cinema.
const worldComponents = import.meta.glob('/src/worlds/*/*.astro');

export const WORLD = (import.meta.env.PUBLIC_WORLD as string | undefined) || 'cinema';

export async function worldComponent(name: 'Home' | 'WorkIndex' | 'FilmPage' | 'PhotoIndex' | 'GalleryPage' | 'CVPage' | 'NotFound') {
  const key = `/src/worlds/${WORLD}/${name}.astro`;
  const loader = worldComponents[key];
  if (!loader) throw new Error(`World "${WORLD}" has no ${name}.astro (expected ${key})`);
  return (await loader()).default as any;
}
