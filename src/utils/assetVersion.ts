import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Short content hash for a file in `public/`, used to version asset URLs.
 *
 * The CSS and JS live in `public/` and are linked directly, so they bypass the
 * bundler and keep a fixed filename. Without a version in the URL a browser will
 * happily serve a stale stylesheet for as long as the cache allows — which is how
 * a deploy can look like it didn't happen.
 *
 * Appending `?v=<hash>` gives each revision its own URL, so a changed file is
 * always fetched fresh and an unchanged one stays cacheable.
 *
 * Resolved from the working directory rather than `import.meta.url`, because Astro
 * bundles this module during the build and the bundled path no longer points back
 * at `src/utils/`. `npm run build` always runs from the project root.
 */
export const assetVersion = (relPath: string): string => {
  const file = resolve(process.cwd(), 'public', relPath);

  try {
    return createHash('sha1').update(readFileSync(file)).digest('hex').slice(0, 8);
  } catch {
    // Do not fall back to a timestamp: that would change the URL on every build
    // and quietly destroy caching while looking like it works.
    throw new Error(
      `assetVersion: cannot read "${file}" for cache-busting. ` +
        `Run the build from the project root (npm run build).`,
    );
  }
};
