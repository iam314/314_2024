// Store product pages — single source of truth for the galleries and the
// Product structured data.
//
// Each product page renders its two Swiper sliders (thumbnails + main) from
// `gallery`, so an image is described exactly once. Thumbnails are rendered as
// decorative duplicates (alt="" + aria-hidden), which is why only `alt` needs
// to be written for the main slide.

export interface GalleryImage {
  type: 'image';
  /** Main slide source. */
  src: string;
  width: number;
  height: number;
  /** Descriptive alt text for the main slide. */
  alt: string;
  /** Optional separate thumbnail file; defaults to `src`. */
  thumbSrc?: string;
  thumbWidth?: number;
  thumbHeight?: number;
}

export interface GalleryVideo {
  type: 'video';
  src: string;
  width: number;
  height: number;
  poster: string;
  /** Descriptive label for the main slide (applied as aria-label on <video>). */
  alt: string;
  thumbSrc: string;
  thumbWidth: number;
  thumbHeight: number;
}

export type GalleryItem = GalleryImage | GalleryVideo;

export interface ProductSchema {
  sku: string;
  category: string;
  productType: 'physical' | 'digital';
  /** Medium / support, e.g. "Hahnemühle Photo Rag® Bright White". */
  material?: string;
  size?: string;
  /**
   * For pay-what-you-want products: the lowest accepted amount. Emitted as a
   * PriceSpecification so `price` stays a plain number ("0+" is not valid).
   */
  minPrice?: string;
  /** Extra factual specs surfaced to search + answer engines. */
  additionalProperty?: { name: string; value: string }[];
  /** Absolute-path images used for schema.org Product.image (first = primary). */
  images: string[];
}

export interface ProductPage {
  gallery: GalleryItem[];
  schema: ProductSchema;
}

export const productPages: Record<string, ProductPage> = {
  'stray-print': {
    gallery: [
      {
        type: 'image',
        src: '/images/store/stray/stray-1.avif',
        width: 1006,
        height: 1174,
        alt: 'Stray — limited edition giclée print by Lyudmil Dachev, 30 × 40 cm',
      },
      {
        type: 'image',
        src: '/images/store/stray/stray-2.avif',
        width: 1006,
        height: 1174,
        alt: 'Stray giclée print — detail 1',
      },
      {
        type: 'image',
        src: '/images/store/stray/stray-3.avif',
        width: 1006,
        height: 1174,
        alt: 'Stray giclée print — detail 2',
      },
      {
        type: 'video',
        src: '/images/store/stray/stray.mp4',
        width: 720,
        height: 1280,
        poster: '/images/store/stray/stray-video-poster.avif',
        alt: 'Film of the Stray giclée print by Lyudmil Dachev',
        thumbSrc: '/images/store/stray/stray-video-thumb.avif',
        thumbWidth: 800,
        thumbHeight: 800,
      },
    ],
    schema: {
      sku: 'STRAY-GICLEE-30X40',
      category: 'Art prints',
      productType: 'physical',
      material: 'Hahnemühle Photo Rag® Bright White fine art paper',
      size: '30 × 40 cm',
      additionalProperty: [
        { name: 'Print technique', value: 'Fine art giclée' },
        { name: 'Signed', value: 'Hand-signed by the artist in graphite' },
        { name: 'Dimensions', value: '30 × 40 cm / 11.811 × 15.748 in' },
      ],
      images: [
        '/images/store/stray/stray-1.avif',
        '/images/store/stray/stray-2.avif',
        '/images/store/stray/stray-3.avif',
      ],
    },
  },

  'kiss-print': {
    gallery: [
      {
        type: 'image',
        src: '/images/store/thekiss/thekiss-1.avif',
        width: 1006,
        height: 1174,
        alt: 'The Kiss — limited edition hand-pulled screen print by Lyudmil Dachev, 40 × 50 cm',
      },
      {
        type: 'image',
        src: '/images/store/thekiss/thekiss-2.avif',
        width: 1006,
        height: 1174,
        alt: 'The Kiss screen print — detail 1',
      },
      {
        type: 'image',
        src: '/images/store/thekiss/thekiss-3.avif',
        width: 1006,
        height: 1174,
        alt: 'The Kiss screen print — detail 2',
      },
    ],
    schema: {
      sku: 'KISS-SCREENPRINT-40X50',
      category: 'Art prints',
      productType: 'physical',
      material: 'Hand-pulled screen print on paper',
      size: '40 × 50 cm',
      additionalProperty: [
        { name: 'Print technique', value: 'Hand-pulled screen print' },
        { name: 'Edition', value: 'Limited edition of 9' },
        { name: 'Signed', value: 'Signed and numbered by the artist' },
        { name: 'Dimensions', value: '40 × 50 cm / 15.748 × 19.685 in' },
      ],
      images: [
        '/images/store/thekiss/thekiss-1.avif',
        '/images/store/thekiss/thekiss-2.avif',
        '/images/store/thekiss/thekiss-3.avif',
      ],
    },
  },

  'horizon-print': {
    gallery: [
      {
        type: 'image',
        src: '/images/store/thehorizon/thehorizon_1.avif',
        width: 1006,
        height: 1174,
        alt: 'The horizon — limited edition hand-pulled screen print by Lyudmil Dachev, 25 × 17.5 cm',
      },
      {
        type: 'image',
        src: '/images/store/thehorizon/thehorizon_2.avif',
        width: 1006,
        height: 1174,
        alt: 'The horizon screen print — detail',
      },
    ],
    schema: {
      sku: 'HORIZON-SCREENPRINT-25X17.5',
      category: 'Art prints',
      productType: 'physical',
      material: 'Hand-pulled screen print on paper',
      size: '25 × 17.5 cm',
      additionalProperty: [
        { name: 'Print technique', value: 'Hand-pulled screen print' },
        { name: 'Edition', value: 'Limited edition of 5' },
        { name: 'Signed', value: 'Signed and numbered by the artist' },
        { name: 'Dimensions', value: '25 × 17.5 cm / 9.842 × 6.889 in' },
      ],
      images: [
        '/images/store/thehorizon/thehorizon_1.avif',
        '/images/store/thehorizon/thehorizon_2.avif',
      ],
    },
  },

  'flag-icons': {
    gallery: [
      {
        type: 'image',
        src: '/images/store/flags/flags-all.gif',
        width: 1006,
        height: 1174,
        alt: 'Flag Icons — looping animation of all 112 minimal flag icons by Lyudmil Dachev',
      },
      {
        type: 'image',
        src: '/images/store/flags/flag_icons-1.avif',
        width: 1006,
        height: 1174,
        alt: 'Flag Icons preview — first part of the 112-icon set',
      },
      {
        type: 'image',
        src: '/images/store/flags/flag_icons-2.avif',
        width: 1006,
        height: 1174,
        alt: 'Flag Icons preview — second part of the 112-icon set',
      },
      {
        type: 'image',
        src: '/images/store/flags/flag_icons-3.avif',
        width: 1006,
        height: 1174,
        alt: 'Flag Icons preview — final part of the 112-icon set',
      },
    ],
    schema: {
      sku: 'FLAG-ICONS-112',
      category: 'Icons and animations',
      productType: 'digital',
      minPrice: '0',
      additionalProperty: [
        { name: 'Icons included', value: '112' },
        { name: 'Animated flags', value: '15' },
        { name: 'Formats', value: 'EPS, Lottie (.lottie), JSON, GIF' },
        { name: 'Grid', value: 'Designed on a 4px grid' },
        { name: 'Licence', value: 'Personal and commercial use allowed' },
      ],
      images: [
        '/images/store/flags/flags-all.gif',
        '/images/store/flags/flag_icons-1.avif',
        '/images/store/flags/flag_icons-2.avif',
        '/images/store/flags/flag_icons-3.avif',
      ],
    },
  },

  '314bits-font': {
    gallery: [
      {
        type: 'image',
        src: '/images/store/314bits/314bits_2.avif',
        width: 1006,
        height: 1174,
        alt: '314 bits display typeface specimen — capital letter A in the regular weight',
      },
      {
        type: 'image',
        src: '/images/store/314bits/314bits_3.avif',
        width: 1006,
        height: 1174,
        alt: '314 bits display typeface specimen — upper and lower case in the regular weight',
      },
      {
        type: 'image',
        src: '/images/store/314bits/314bits_4.avif',
        width: 1006,
        height: 1174,
        alt: '314 bits display typeface specimen — capital letter A in the striked weight',
      },
      {
        type: 'image',
        src: '/images/store/314bits/314bits_5.avif',
        width: 1006,
        height: 1174,
        alt: '314 bits display typeface specimen — upper and lower case in the striked weight',
      },
      {
        type: 'image',
        src: '/images/store/314bits/314bits_6.avif',
        width: 1006,
        height: 1174,
        alt: '314 bits display typeface specimen — capital letter A in the hand weight',
      },
      {
        type: 'image',
        src: '/images/store/314bits/314bits_7.avif',
        width: 1006,
        height: 1174,
        alt: '314 bits display typeface specimen — upper and lower case in the hand weight',
      },
    ],
    schema: {
      sku: '314BITS-FONT',
      category: 'Fonts',
      productType: 'digital',
      additionalProperty: [
        { name: 'Weights', value: '3' },
        { name: 'Glyphs per weight', value: '575' },
        { name: 'OpenType features', value: 'aalt, kern, locl, ordn, salt, ss01, subs, sups' },
        { name: 'Language support', value: '100+ Latin-based languages' },
        { name: 'Released', value: 'Started 2009, completed 2024' },
      ],
      images: [
        '/images/store/314bits/314bits_2.avif',
        '/images/store/314bits/314bits_3.avif',
        '/images/store/314bits/314bits_4.avif',
        '/images/store/314bits/314bits_5.avif',
        '/images/store/314bits/314bits_6.avif',
        '/images/store/314bits/314bits_7.avif',
      ],
    },
  },
};

export function getProductPage(slug: string): ProductPage {
  const page = productPages[slug];
  if (!page) throw new Error(`No product page data for slug "${slug}"`);
  return page;
}
