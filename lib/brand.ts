// Single source of truth for brand + business config.
// Change the name, tagline, contact, or pricing here and it updates across the whole site.

export const brand = {
  name: "Scrapjoy",
  tagline: "Turn your photos into a book you'll actually hug.",
  // Short value props used in the hero / marketing
  pitch:
    "Custom photobooks, printed and delivered across Bangladesh. Upload your photos, we make the magic, you keep the memories forever.",
  emoji: "📸",
  // Contact / social — update with your real handles before launch
  whatsapp: "+8801XXXXXXXXX",
  email: "hello@scrapjoy.com.bd",
  instagram: "https://instagram.com/scrapjoy",
  facebook: "https://facebook.com/scrapjoy",
  currency: "৳", // BDT
  country: "Bangladesh",
};

// Whether SSLCommerz online payment is live yet. Until you have a merchant
// account, keep this false and orders run on COD + manual bKash.
export const paymentsLive = false;

export type Product = {
  slug: string;
  name: string;
  size: string;
  pages: number;
  price: number; // BDT
  blurb: string;
  badge?: string;
  accent: "coral" | "sunny" | "teal" | "grape" | "sky";
};

// Starter product line — edit sizes, page counts, and prices to match your printer's costs.
export const products: Product[] = [
  {
    slug: "mini-memories",
    name: "Mini Memories",
    size: "6\" × 6\" square",
    pages: 20,
    price: 990,
    blurb: "Pocket-sized and gift-perfect. Great for a single trip or event.",
    accent: "sunny",
  },
  {
    slug: "classic-a4",
    name: "Classic A4 Hardcover",
    size: "A4 hardcover",
    pages: 30,
    price: 1990,
    blurb: "Our most-loved book. Matte hardcover that looks great on any shelf.",
    badge: "Most popular",
    accent: "coral",
  },
  {
    slug: "big-adventure",
    name: "Big Adventure",
    size: "12\" × 12\" square",
    pages: 40,
    price: 3490,
    blurb: "Go big. Perfect for weddings, whole-year recaps, or epic travels.",
    accent: "grape",
  },
];

export function formatPrice(amount: number) {
  return `${brand.currency}${amount.toLocaleString("en-US")}`;
}
