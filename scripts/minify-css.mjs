/**
 * Minifies the CSS in the build output, leaving `public/css/` untouched.
 *
 * The stylesheets live in `public/` so they can be edited by hand and are linked
 * directly. That means they bypass Vite entirely and, unlike CSS imported from
 * `src/`, Astro does not minify them. This runs after `astro build` and only
 * rewrites `dist/css/`, so the source stays readable while visitors get the
 * smaller file.
 *
 * URL versioning in BaseLayout hashes the *source* file, so the `?v=` value still
 * changes whenever you edit the readable original.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { transform } from 'esbuild';

const CSS_DIR = 'dist/css';

const files = (await readdir(CSS_DIR)).filter((f) => f.endsWith('.css'));

if (files.length === 0) {
  console.error(`minify-css: no .css files in ${CSS_DIR} — did the build run?`);
  process.exit(1);
}

let before = 0;
let after = 0;

for (const name of files.sort()) {
  const path = join(CSS_DIR, name);
  const source = await readFile(path, 'utf8');

  const { code } = await transform(source, {
    loader: 'css',
    minify: true,
    // Keep the license/attribution banners that start with /*!
    legalComments: 'inline',
  });

  // Guard against a minifier bug silently emptying a stylesheet.
  if (code.trim().length === 0 && source.trim().length > 0) {
    console.error(`minify-css: refusing to write empty output for ${name}`);
    process.exit(1);
  }

  await writeFile(path, code);

  before += Buffer.byteLength(source);
  after += Buffer.byteLength(code);

  const saved = ((1 - Buffer.byteLength(code) / Buffer.byteLength(source)) * 100).toFixed(0);
  console.log(`  ${name.padEnd(18)} ${(Buffer.byteLength(source) / 1024).toFixed(1)} KB -> ${(Buffer.byteLength(code) / 1024).toFixed(1)} KB  (-${saved}%)`);
}

const total = ((1 - after / before) * 100).toFixed(0);
console.log(`minify-css: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB total (-${total}%)`);
