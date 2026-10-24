// Store products — extracted from store/index.kit + store/<slug>/index.kit
export interface Product {
  slug: string; href: string; aria: string; thumb: string; thumbWidth: number; thumbHeight: number; thumbAlt: string; name: string; type: string; price: string;
  /** Set true to keep the product page live but hide the card from /store/. */
  hidden?: boolean;
}

export const products: Product[] = [
  {
    "slug": "stray-print",
    "href": "/store/stray-print/",
    "aria": "Stray Giclée Print — €40",
    "thumb": "/images/store/stray/stray_thumb.avif",
    "thumbWidth": 800,
    "thumbHeight": 800,
    "thumbAlt": "Stray giclée print by Lyudmil Dachev",
    "name": "Stray",
    "type": "Giclée print",
    "price": "€40"
  },
  {
    // Thumbnail is the final Journal 1 artwork. Gallery + copy on the product
    // page (productPages.ts) still needs the real Journal 1 images/video.
    "slug": "journal-1-print",
    "href": "/store/journal-1-print/",
    "aria": "Journal 1 (2024-2025) Print — €22",
    "thumb": "/images/store/journal-1/journal-1_thumb.avif",
    "thumbWidth": 800,
    "thumbHeight": 800,
    "thumbAlt": "Journal 1 print by Lyudmil Dachev",
    "name": "Journal 1 (2024-2025)",
    "type": "Print",
    "price": "€22"
  },
  {
    "slug": "horizon-print",
    "href": "/store/horizon-print/",
    "aria": "The Horizon Hand-Pulled Screen Print — €9",
    "thumb": "/images/store/thehorizon/thehorizon_thumb.avif",
    "thumbWidth": 800,
    "thumbHeight": 800,
    "thumbAlt": "The Horizon hand-pulled screen print by Lyudmil Dachev",
    "name": "The horizon",
    "type": "Hand pulled screen print",
    "price": "€9"
  },
  {
    "slug": "kiss-print",
    "href": "/store/kiss-print/",
    "aria": "The Kiss Screen Print — Sold Out",
    "thumb": "/images/store/thekiss/thekiss_thumb.avif",
    "thumbWidth": 600,
    "thumbHeight": 600,
    "thumbAlt": "The Kiss hand-pulled screen print by Lyudmil Dachev",
    "name": "The kiss",
    "type": "Hand pulled screen print",
    "price": "<span style=\"text-decoration: line-through;\">€40</span> SOLD OUT"
  },
  {
    "slug": "314bits-font",
    "href": "/store/314bits-font/",
    "aria": "314 Bits Display Font — From €7",
    "thumb": "/images/store/314bits/314bits.avif",
    "thumbWidth": 600,
    "thumbHeight": 600,
    "thumbAlt": "314 Bits geometric display typeface by Lyudmil Dachev",
    "name": "314 bits",
    "type": "Display font",
    "price": "€15"
  },
  {
    "slug": "flag-icons",
    "href": "/store/flag-icons/",
    "aria": "Flag Icons and Animations — Pay what you want",
    "thumb": "/images/store/flags/flags_thumb.gif",
    "thumbWidth": 600,
    "thumbHeight": 600,
    "thumbAlt": "Minimal flag icon set by Lyudmil Dachev",
    "name": "Flag icons",
    "type": "Icons and animations",
    "price": "€0+"
  }
];
