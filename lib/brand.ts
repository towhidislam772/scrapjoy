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
  bkashNumber: "01XXXXXXXXX", // your bKash number for manual advance payments
  email: "hello@scrapjoy.com.bd",
  instagram: "https://instagram.com/scrapjoy",
  facebook: "https://facebook.com/scrapjoy",
  currency: "৳", // BDT
  country: "Bangladesh",
};

// True once you've replaced the placeholder WhatsApp/bKash numbers with real ones.
// While false, the order page shows a gentle "launching soon" notice so customers
// never hit a broken contact link on the live site.
export const brandReady = !/X{3,}/.test(brand.whatsapp) && !/X{3,}/.test(brand.bkashNumber);

// Payment policy: books are made to order, so we require an advance to start.
// No Cash on Delivery — customers pay a % up front (via bKash), rest before delivery.
export const prepaidPercent = 75;

export function advanceAmount(total: number) {
  return Math.ceil((total * prepaidPercent) / 100 / 10) * 10; // round up to nearest ৳10
}

// Kept for reference. The store now uses a 75% bKash advance (see prepaidPercent);
// automated bKash is scaffolded in lib/bkash.ts. Leave false until that's wired up.
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
