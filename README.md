# Eason Wang — portfolio

Static portfolio site. Astro 7, no UI framework, content-as-files. See [MAINTENANCE.md](MAINTENANCE.md) for the day-to-day editing guide.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # → dist/
pnpm preview
```

Node ≥ 22.12, pnpm.

## Layout

```
src/content/        all site content (JSON + images). Edited by the owner; see MAINTENANCE.md
src/content.config.ts   collection schemas (zod)
src/lib/content.ts  loaders: gallery image globbing, sorting, published filters
src/pages/          /, /work, /work/[slug], /photography, /photography/[slug], /cv, 404
src/components/     Hero, FilmCard, GalleryTile, YouTube (click-to-load facade), Lightbox, Recognition
src/layouts/Base.astro   head, nav, footer, grain overlay, reveal/sheen/tilt scripts
src/styles/global.css    design tokens + all styles (single theme: "cinema")
scripts/import-assets.mjs   one-off importer from the raw photo folders (sharp resize to ≤2400px, strips EXIF)
public/video/       self-hosted short clips referenced from gallery.json `videos`
```

Images in `src/content` are web-sized (≤2400 px, ~15 MB total). Originals and zips are git-ignored. Astro's `<Image>` generates the responsive WebP set at build time.

## Deploy (Vercel)

Live (personal Vercel scope, Hobby plan, static):

| World | URL |
|---|---|
| cinema | https://eason-wang.vercel.app |
| hang | https://eason-wang-gallery.vercel.app |
| night | https://eason-wang-night.vercel.app |

Redeploy after any content change (needs `vercel login` once):

```bash
scripts/deploy-worlds.sh            # all three
scripts/deploy-worlds.sh hang       # one world
```

Each world builds with `PUBLIC_WORLD` and `PUBLIC_SITE_URL`, is copied to `deploy/<project>/` with a `vercel.json` (`cleanUrls`), and pushed with `vercel deploy --prod`.

Alternative, once the repo is on GitHub: import it in Vercel and it auto-detects Astro (set `PUBLIC_WORLD` and `PUBLIC_SITE_URL` as project env vars):

- Framework preset: **Astro**
- Install command: `pnpm install`
- Build command: `pnpm build`
- Output directory: `dist`

After the first deploy, set `site` in `astro.config.mjs` to the real URL (used for canonical and Open Graph tags). Every push to `main` redeploys.

## Re-importing raw photos

```bash
node scripts/import-assets.mjs --source /path/to/Eason
```

Idempotent: existing targets are skipped. Add new source folders to `FOLDER_MAP` in the script. Writes `scripts/import-log.md`.
