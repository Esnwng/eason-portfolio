// Build every world and serve each dist/<world> on its own port for side-by-side comparison.
// Usage: node scripts/serve-worlds.mjs [--no-build] [world ...]
import { createServer } from 'node:http';
import { promises as fs, existsSync, createReadStream, statSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const noBuild = args.includes('--no-build');
const all = (await fs.readdir(path.join(ROOT, 'src/worlds'))).filter((d) => !d.startsWith('.')).sort();
const worlds = args.filter((a) => !a.startsWith('--')).length ? args.filter((a) => !a.startsWith('--')) : all;
const PORTS = { cinema: 4321, hang: 4331, sheet: 4332, night: 4333 };
const port = (w, i) => PORTS[w] ?? 4340 + i;

if (!noBuild) for (const w of worlds) {
  console.log(`\n▶ building ${w}`);
  execSync('pnpm exec astro build', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, PUBLIC_WORLD: w } });
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain' };

function serve(root, p, name) {
  createServer((req, res) => {
    let url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(root, url);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    if (existsSync(file) && statSync(file).isDirectory()) file = existsSync(path.join(file, 'index.html')) ? path.join(file, 'index.html') : file.replace(/\/$/, '') + '.html';
    if (!existsSync(file) && existsSync(file + '.html')) file += '.html';
    if (!existsSync(file)) { file = path.join(root, '404.html'); res.statusCode = 404; }
    res.setHeader('content-type', TYPES[path.extname(file)] ?? 'application/octet-stream');
    createReadStream(file).pipe(res);
  }).listen(p, () => console.log(`${name.padEnd(8)} http://localhost:${p}/`));
}

worlds.forEach((w, i) => serve(path.join(ROOT, 'dist', w), port(w, i), w));
