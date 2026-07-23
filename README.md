# Scrapjoy 📸

Custom photobook store for Bangladesh — built with Next.js + Tailwind CSS.

> **Original brand.** This is your own business, not a copy of any other store.
> All branding, copy, and design here are original and yours to change.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Where to edit things

| What | File |
| --- | --- |
| Brand name, tagline, contact, WhatsApp | `lib/brand.ts` |
| Products, sizes, prices | `lib/brand.ts` (`products` array) |
| Colors & fonts | `tailwind.config.ts`, `app/layout.tsx` |
| Home page | `app/page.tsx` |
| Other pages | `app/<page>/page.tsx` |
| Checkout / order flow | `app/order/OrderForm.tsx` |

## Before launch (do these!)

1. Set your real **WhatsApp number**, **email**, and **social links** in `lib/brand.ts`.
2. Set your real **prices** in the `products` array.
3. Replace the emoji placeholders in `app/gallery/page.tsx` with real product photos
   (put images in `/public` and use `next/image`).
4. Buy a domain and deploy free to **Vercel** (`vercel` CLI or connect the GitHub repo).

## Phases

- **Phase 1 (now):** Marketing/store site. Orders come in via a pre-filled WhatsApp
  message — no backend or merchant account needed. You design books manually.
- **Phase 2:** Customer accounts, photo uploads, an admin dashboard, and online
  payment via SSLCommerz (needs a registered business). See `lib/sslcommerz.ts`.
- **Phase 3:** In-browser photobook builder (drag-and-drop editor + print-ready PDF export).

## Payments

The store requires a **75% advance via bKash** (no Cash on Delivery). Until you have
a bKash **merchant** account (needs a registered business), this runs as a **manual
bKash advance**: the customer sends the advance to your bKash number and shares the
transaction ID through the order / WhatsApp flow. Set your bKash number in
`lib/brand.ts`. Automated bKash checkout is scaffolded in `lib/bkash.ts`.
