// One-time (idempotent) importer: raw photo folders -> web-sized gallery images.
// Usage: node scripts/import-assets.mjs [--source /path/to/Eason] [--contact-sheet /out/dir]
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const SOURCE = opt('--source', '/Users/d1dai/Downloads/Eason');
const SHEET_DIR = opt('--contact-sheet', null);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const GALLERIES = path.join(ROOT, 'src/content/galleries');
const MAX_EDGE = 2400;
const QUALITY = 82;

// Chinese source folder -> gallery slug. Add a line here when a new folder arrives.
const FOLDER_MAP = {
  '西藏': 'tibet',
  '北京': 'beijing',
  '动植物': 'wildlife',
  '汽车': 'cars',
  '环境主题': 'environment',
};
const FILM_FOLDER = 'ANNA_S DIARY 微电影';

const isImage = (f) => /\.(jpe?g|png)$/i.test(f);
const isVideo = (f) => /\.(mp4|mov)$/i.test(f);
const exists = async (p) => !!(await fs.stat(p).catch(() => null));

const log = [['# Import log', '', `Source: \`${SOURCE}\``, '', '| Source | Target | Note |', '|---|---|---|']];
const note = (src, dst, n = '') => log[0].push(`| ${src} | ${dst} | ${n} |`);

async function webImage(src, dst) {
  if (await exists(dst)) { note(src, path.relative(ROOT, dst), 'exists, skipped'); return; }
  const meta = await sharp(src).metadata();
  await sharp(src)
    .rotate() // honour EXIF orientation, then strip all metadata (no GPS leaks)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(dst);
  note(src, path.relative(ROOT, dst), `${meta.width}x${meta.height} -> ≤${MAX_EDGE}`);
}

async function importGallery(folder, slug) {
  const dir = path.join(SOURCE, folder);
  if (!(await exists(dir))) return;
  const out = path.join(GALLERIES, slug);
  await fs.mkdir(out, { recursive: true });
  const files = (await fs.readdir(dir)).filter((f) => !f.startsWith('.')).sort();
  let n = 0;
  for (const f of files) {
    const src = path.join(dir, f);
    if (isImage(f)) {
      n += 1;
      await webImage(src, path.join(out, `${slug}-${String(n).padStart(2, '0')}.jpg`));
    } else if (isVideo(f)) {
      const base = `${slug}-${String(++n).padStart(2, '0')}`;
      const dst = path.join(ROOT, 'public/video', `${base}.mp4`);
      if (!(await exists(dst))) {
        await fs.copyFile(src, dst);
        execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', '1', '-i', dst, '-frames:v', '1', '-q:v', '3', dst.replace(/\.mp4$/, '.jpg')]);
        note(src, path.relative(ROOT, dst), 'video copied + poster frame');
      } else note(src, path.relative(ROOT, dst), 'exists, skipped');
    }
  }
  const galleryJson = path.join(out, 'gallery.json');
  if (!(await exists(galleryJson))) {
    const title = slug.charAt(0).toUpperCase() + slug.slice(1);
    await fs.writeFile(galleryJson, JSON.stringify({ title, description: '', year: '', location: '', order: 99 }, null, 2) + '\n');
    note('(generated)', path.relative(ROOT, galleryJson), 'placeholder gallery.json');
  }
}

async function importFilm() {
  const dir = path.join(SOURCE, FILM_FOLDER);
  if (!(await exists(dir))) return;
  const stills = (await fs.readdir(dir)).filter(isImage).sort();
  for (const [i, f] of stills.entries()) {
    await webImage(path.join(dir, f), path.join(ROOT, 'src/content/films', `anna-s-diary-${String(i + 1).padStart(2, '0')}.jpg`));
  }
}

async function contactSheets() {
  if (!SHEET_DIR) return;
  await fs.mkdir(SHEET_DIR, { recursive: true });
  const slugs = (await fs.readdir(GALLERIES)).filter((d) => !d.startsWith('.'));
  for (const slug of slugs) {
    const dir = path.join(GALLERIES, slug);
    const files = (await fs.readdir(dir)).filter(isImage).sort();
    const W = 360, H = 240, COLS = 4;
    const rows = Math.ceil(files.length / COLS);
    const tiles = await Promise.all(files.map(async (f, i) => ({
      input: await sharp(path.join(dir, f)).resize(W, H, { fit: 'cover' }).toBuffer(),
      left: (i % COLS) * W, top: Math.floor(i / COLS) * H,
    })));
    const labels = files.map((f, i) => ({
      input: Buffer.from(`<svg width="${W}" height="${H}"><text x="8" y="22" font-size="18" font-family="sans-serif" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">${f}</text></svg>`),
      left: (i % COLS) * W, top: Math.floor(i / COLS) * H,
    }));
    await sharp({ create: { width: W * COLS, height: H * rows, channels: 3, background: '#111' } })
      .composite([...tiles, ...labels]).jpeg({ quality: 80 }).toFile(path.join(SHEET_DIR, `${slug}.jpg`));
  }
}

for (const [folder, slug] of Object.entries(FOLDER_MAP)) await importGallery(folder, slug);
// Film posters are added by hand (see MAINTENANCE.md); the film folder in the source only holds a certificate.
await fs.writeFile(path.join(ROOT, 'scripts/import-log.md'), log[0].join('\n') + '\n');
await contactSheets();
console.log(log[0].slice(5).join('\n'));
