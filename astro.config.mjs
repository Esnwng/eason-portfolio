// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Replace `site` with the real Vercel URL after the first deploy (used for canonical + OG tags).
const world = process.env.PUBLIC_WORLD || 'cinema';
// Canonical/OG base URL; set PUBLIC_SITE_URL per deployment.
const site = process.env.PUBLIC_SITE_URL || 'https://eason-wang.vercel.app';

export default defineConfig({
  site,
  output: 'static',
  outDir: `./dist/${world}`,
  trailingSlash: 'never',
  build: { format: 'file' },
  image: {
    responsiveStyles: true,
  },
  vite: {
    resolve: {
      // `@world/*` resolves to the active world only, so no other world's CSS or JS enters the bundle.
      alias: { '@world': fileURLToPath(new URL(`./src/worlds/${world}`, import.meta.url)) },
    },
  },
});
