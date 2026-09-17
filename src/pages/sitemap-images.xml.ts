import type { APIRoute } from 'astro';
import { productPages } from '../data/productPages';
import { products } from '../data/products';
import { projects } from '../data/projects';

/**
 * Image sitemap.
 *
 * `@astrojs/sitemap` cannot emit image entries — its SitemapItem only allows url,
 * lastmod, changefreq, priority and links — so this is generated alongside it and
 * referenced from robots.txt.
 *
 * Worth having because the prints are sold direct: Google Images is a real route
 * to the artwork, and the store galleries are the only images here with an
 * unambiguous product meaning. Work thumbnails are included too so the portfolio
 * images can surface in image search.
 */
const SITE = 'https://www.iam314.com';

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

interface ImageEntry {
  loc: string;
  title: string;
}

interface UrlEntry {
  loc: string;
  images: ImageEntry[];
}

const urlEntries: UrlEntry[] = [];

// Store product pages: the full gallery for each print, font or icon set.
for (const [slug, page] of Object.entries(productPages)) {
  const images: ImageEntry[] = page.gallery
    .filter((item) => item.type === 'image')
    .map((item) => ({
      loc: SITE + item.src,
      title: item.alt,
    }));

  if (images.length > 0) {
    urlEntries.push({ loc: `${SITE}/store/${slug}/`, images });
  }
}

// Store index thumbnails.
urlEntries.push({
  loc: `${SITE}/store/`,
  images: products.map((p) => ({ loc: SITE + p.thumb, title: p.thumbAlt })),
});

// Work index thumbnails, so case-study imagery is discoverable too.
urlEntries.push({
  loc: `${SITE}/work/`,
  images: projects.map((p) => ({ loc: SITE + p.thumb, title: p.thumbAlt })),
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
${entry.images
  .map(
    (image) => `    <image:image>
      <image:loc>${escape(image.loc)}</image:loc>
      <image:title>${escape(image.title)}</image:title>
    </image:image>`,
  )
  .join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;

export const GET: APIRoute = () =>
  new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
