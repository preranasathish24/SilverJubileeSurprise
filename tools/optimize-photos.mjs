#!/usr/bin/env node
/* =============================================================================
   optimize-photos.mjs  —  needs `sharp`  (npm install)
   Resizes/compresses photos in media/<year>/ to web size, in place.
   Already-small photos are skipped, so it's safe to run repeatedly.
   Your originals on your computer/phone are untouched — this only affects the
   copies inside media/.

   Run:  node tools/optimize-photos.mjs      (or part of: npm run media)
   ========================================================================== */
import { readdirSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

let sharp;
try { sharp = (await import('sharp')).default; }
catch {
  console.error('\nThis step needs the "sharp" library.\n  →  run:  npm install\n');
  process.exit(1);
}

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA = join(ROOT, 'media');
const IMG   = /\.(jpe?g|png|webp)$/i;
const MAX = 1600;            // longest edge, px
const QUALITY = 80;          // jpeg quality
const SIZE_OK = 320 * 1024;  // already-optimised threshold (bytes)
const isYear = (d) => /^\d{4}$/.test(d);

let done = 0, skipped = 0;
for (const year of readdirSync(MEDIA).filter(d => isYear(d) && statSync(join(MEDIA, d)).isDirectory())) {
  for (const file of readdirSync(join(MEDIA, year)).filter(f => IMG.test(f))) {
    const p = join(MEDIA, year, file);
    const meta = await sharp(p).metadata().catch(() => null);
    if (!meta) continue;
    const big = meta.width > MAX || meta.height > MAX || statSync(p).size > SIZE_OK || extname(file).toLowerCase() !== '.jpg';
    if (!big) { skipped++; continue; }
    const buf = await sharp(p).rotate()
      .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    const out = join(MEDIA, year, basename(file, extname(file)) + '.jpg');
    writeFileSync(out, buf);
    if (out !== p) rmSync(p);   // drop the non-jpg original copy
    console.log(`  ${year}/${file}  →  ${basename(out)}  (${Math.round(buf.length / 1024)} KB)`);
    done++;
  }
}
console.log(`\n✓ optimised ${done} photo(s), ${skipped} already web-sized.`);
