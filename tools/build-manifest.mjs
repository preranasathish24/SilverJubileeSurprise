#!/usr/bin/env node
/* =============================================================================
   build-manifest.mjs  —  zero-dependency
   Scans media/<year>/ for photos, syncs media/captions.csv (every photo gets a
   row), and writes media/manifest.json that the website reads.

   Run:  node tools/build-manifest.mjs      (or: npm run manifest)
   ========================================================================== */
import { readdirSync, existsSync, writeFileSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA = join(ROOT, 'media');
const CSV   = join(MEDIA, 'captions.csv');
const OUT   = join(MEDIA, 'manifest.json');
const IMG   = /\.(jpe?g|png|webp|gif)$/i;

const isYear = (d) => /^\d{4}$/.test(d) || d === 'before-him' || d === 'before-her';
const nat = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

/* ---- tiny CSV helpers (caption may be quoted to allow commas) ------------- */
function parseLine(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === ',') { out.push(cur); cur = ''; }
    else if (c === '"') { q = true; }
    else cur += c;
  }
  out.push(cur);
  return out.map(s => s.trim());
}
const esc = (s) => /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;

function readCaptions() {
  const map = new Map();
  if (!existsSync(CSV)) return map;
  const lines = readFileSync(CSV, 'utf8').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const [year, file, caption = '', anim = ''] = parseLine(lines[i]);
    if (year && file) map.set(`${year}/${file}`, { caption, anim: anim.trim() });
  }
  return map;
}

/* ---- scan + build --------------------------------------------------------- */
if (!existsSync(MEDIA)) { console.error('No media/ folder found.'); process.exit(1); }
const captions = readCaptions();
const years = readdirSync(MEDIA).filter(d => isYear(d) && statSync(join(MEDIA, d)).isDirectory()).sort(nat);

const manifest = {};
const rows = [];
for (const year of years) {
  const files = readdirSync(join(MEDIA, year)).filter(f => IMG.test(f)).sort(nat);
  if (!files.length) continue;
  manifest[year] = files.map(file => {
    const meta = captions.get(`${year}/${file}`) ?? { caption: '', anim: '' };
    const caption = meta.caption ?? '';
    const anim = meta.anim ?? '';
    rows.push([year, file, caption, anim]);
    const entry = { file, caption };
    if (anim) entry.anim = anim;          // optional per-photo entrance animation
    return entry;
  });
}

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
writeFileSync(CSV, 'Year,Photo,Caption,Anim\n' + rows.map(([y, f, c, a]) => `${y},${f},${esc(c)},${esc(a || '')}`).join('\n') + (rows.length ? '\n' : ''));

const total = rows.length;
const missing = rows.filter(r => !r[2]).length;
console.log(`✓ media/manifest.json  →  ${Object.keys(manifest).length} years, ${total} photos`);
console.log(`✓ media/captions.csv synced  →  ${total} rows${missing ? `, ${missing} still need a caption` : ', all captioned'}`);
