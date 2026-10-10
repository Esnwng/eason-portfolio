// @ts-check
import { defineConfig } from 'astro/config';

// Replace `site` with the real Vercel URL after the first deploy (used for canonical + OG tags).
const world = process.env.PUBLIC_WORLD || 'cinema';

export default defineConfig({
  site: 'https://eason-wang.vercel.app',
  output: 'static',
  outDir: `./dist/${world}`,
  trailingSlash: 'never',
  build: { format: 'file' },
  image: {
    responsiveStyles: true,
  },
});
