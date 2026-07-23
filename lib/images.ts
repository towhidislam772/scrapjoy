// Central image config.
//
// These are reliable, license-free stock photos (picsum.photos) used as tasteful
// placeholders so the site looks real right away. When you have your OWN product
// photos, the best move is:
//   1. Drop your image files into the /public folder (e.g. /public/hero.jpg)
//   2. Replace the URLs below with "/hero.jpg" etc.
// Everything else updates automatically. (Your own photos of real photobooks will
// convert far better than any stock image.)

const pic = (seed: string, w = 800, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const img = {
  heroMain: pic("scrapjoy-travel", 900, 900),
  heroPolaroid1: pic("scrapjoy-wedding", 500, 500),
  heroPolaroid2: pic("scrapjoy-grad", 500, 500),

  // Product cover imagery (keyed by product slug)
  productCovers: {
    "mini-memories": pic("scrapjoy-mini", 700, 500),
    "classic-a4": pic("scrapjoy-classic", 700, 500),
    "big-adventure": pic("scrapjoy-big", 700, 500),
  } as Record<string, string>,

  // Gallery tiles
  gallery: [
    { src: pic("scrapjoy-g1", 600, 600), label: "Honeymoon in Sajek" },
    { src: pic("scrapjoy-g2", 600, 600), label: "Baby's first year" },
    { src: pic("scrapjoy-g3", 600, 600), label: "Wedding album" },
    { src: pic("scrapjoy-g4", 600, 600), label: "Cox's Bazar trip" },
    { src: pic("scrapjoy-g5", 600, 600), label: "Graduation memories" },
    { src: pic("scrapjoy-g6", 600, 600), label: "Family reunion" },
    { src: pic("scrapjoy-g7", 600, 600), label: "Eid celebrations" },
    { src: pic("scrapjoy-g8", 600, 600), label: "Best friends forever" },
  ],
};
