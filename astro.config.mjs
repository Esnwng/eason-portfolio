// @ts-check
import { defineConfig } from 'astro/config';

// Replace `site` with the real Vercel URL after the first deploy (used for canonical + OG tags).
export default defineConfig({
  site: 'https://eason-wang.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  image: {
    responsiveStyles: true,
  },
});
