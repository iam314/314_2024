import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Resolve a git binary that actually runs.
 *
 * On this machine /usr/local/bin/git is an x86_64/i386 build with no arm64 slice,
 * so it fails with "Bad CPU type in executable" while shadowing the working
 * /usr/bin/git on PATH. Probe candidates instead of trusting PATH blindly.
 */
const GIT = (() => {
  for (const candidate of [process.env.GIT, 'git', '/usr/bin/git']) {
    if (!candidate) continue;
    try {
      execFileSync(candidate, ['--version'], { stdio: 'ignore' });
      return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
})();

/**
 * Map of repo-relative source path -> ISO date of its most recent commit.
 *
 * `git log` lists newest first, so the first time a path appears is its latest
 * change. Needs full history: on a shallow clone (the GitHub Actions default)
 * every file reports HEAD's date, which would be worse than no lastmod at all.
 */
const commitDates = () => {
  const dates = new Map();
  if (!GIT) return dates;
  try {
    const out = execFileSync(GIT, ['log', '--name-only', '--format=@@%cI'], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    let current = null;
    for (const raw of out.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('@@')) {
        current = line.slice(2);
      } else if (current && !dates.has(line)) {
        dates.set(line, current);
      }
    }
  } catch {
    // Not a git checkout, or git missing. Sitemap simply omits lastmod.
  }
  return dates;
};

/**
 * A page's own source file, so lastmod reflects when that page actually changed.
 * Deliberately narrow: it does not walk component imports, so editing a shared
 * component will not bump the date on every page that includes it. Under-reporting
 * is the safer error — Google ignores lastmod it finds unreliable.
 */
const sourceForUrl = (url) => {
  const path = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  const candidates = path
    ? [`src/pages/${path}.astro`, `src/pages/${path}/index.astro`]
    : ['src/pages/index.astro'];
  return candidates.find((candidate) => existsSync(resolve(candidate))) ?? null;
};

const dates = commitDates();

if (dates.size === 0) {
  console.warn(
    '[sitemap] No git history available, so lastmod will be omitted. ' +
      'In CI this means the checkout needs fetch-depth: 0.',
  );
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.iam314.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const source = sourceForUrl(item.url);
        const committed = source ? dates.get(source) : undefined;
        return committed ? { ...item, lastmod: new Date(committed) } : item;
      },
    }),
  ],
  redirects: {
    // Stray Print
    '/stray.html': 'https://www.iam314.com/store/stray-print/',
    '/stray': 'https://www.iam314.com/store/stray-print/',

    // 314bits Font
    '/314bits.html': 'https://www.iam314.com/store/314bits-font/',
    '/314bits': 'https://www.iam314.com/store/314bits-font/',

    // Thank You
    '/thank-you.html': 'https://www.iam314.com/thanks/',
    '/thank-you': 'https://www.iam314.com/thanks/',

    // The Kiss
    '/the-kiss.html': 'https://www.iam314.com/store/kiss-print/',
    '/the-kiss': 'https://www.iam314.com/store/kiss-print/',

    // Main Store
    '/store.html': 'https://www.iam314.com/store/',

    // The Horizon
    '/the-horizon.html': 'https://www.iam314.com/store/horizon-print/',
    '/the-horizon': 'https://www.iam314.com/store/horizon-print/',

    // Flag Icons
    '/flag-icons.html': 'https://www.iam314.com/store/flag-icons/',
    '/flag-icons': 'https://www.iam314.com/store/flag-icons/',

    // Newsletter Signup
    '/signup.html': 'https://www.iam314.com/newsletter/',
    '/signup': 'https://www.iam314.com/newsletter/',
  },
});
