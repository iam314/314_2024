// Store products — extracted from store/index.kit + store/<slug>/index.kit
export interface Product {
  slug: string; href: string; aria: string; thumb: string; thumbAlt: string; name: string; type: string; price: string;
}

export const products: Product[] = [
  {
    "slug": "stray-print",
    "href": "/store/stray-print/",
    "aria": "Stray Giclée Print — €40",
    "thumb": "/images/store/stray/stray_thumb.avif",
    "thumbAlt": "Stray giclée print by Lyudmil Dachev",
    "name": "Stray",
    "type": "Giclée print",
    "price": "€40"
  },
  {
    "slug": "horizon-print",
    "href": "/store/horizon-print/",
    "aria": "The Horizon Hand-Pulled Screen Print — €9",
    "thumb": "/images/store/thehorizon/thehorizon_thumb.avif",
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
    "thumbAlt": "The Kiss hand-pulled screen print by Lyudmil Dachev",
    "name": "The kiss",
    "type": "Hand pulled screen print",
    "price": "<span style=\"text-decoration: line-through;\">€40</span> SOLD OUT"
  },
  {
    "slug": "314bits-font",
    "href": "/store/314bits-font/",
    "aria": "314 Bits Display Font — €12",
    "thumb": "/images/store/314bits/314bits.avif",
    "thumbAlt": "314 Bits geometric display typeface by Lyudmil Dachev",
    "name": "314 bits",
    "type": "Display font",
    "price": "€12"
  },
  {
    "slug": "flag-icons",
    "href": "/store/flag-icons/",
    "aria": "Flag Icons and Animations — Pay what you want",
    "thumb": "/images/store/flags/flags_thumb.gif",
    "thumbAlt": "Minimal flag icon set by Lyudmil Dachev",
    "name": "Flag icons",
    "type": "Icons and animations",
    "price": "€0+"
  }
];
