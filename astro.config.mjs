import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.iam314.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
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
