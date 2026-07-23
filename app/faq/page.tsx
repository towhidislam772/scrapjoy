import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `FAQ, Shipping & Returns — ${brand.name}`,
  description: "Answers about ordering, shipping across Bangladesh, payment, and returns.",
};

const faqs = [
  {
    q: "How do I send my photos?",
    a: "After you place an order, you'll get a link to upload your photos — or you can just send them to us on WhatsApp. Send as many as you like; we'll choose the best ones for your layout.",
  },
  {
    q: "How much does it cost?",
    a: `Books start at ${brand.currency}990 for our Mini Memories book and go up based on size and page count. See the Photobooks page for full pricing.`,
  },
  {
    q: "How do I pay?",
    a: "You can pay Cash on Delivery (COD) anywhere in Bangladesh, or send an advance via bKash. Card and mobile-banking checkout is coming soon.",
  },
  {
    q: "How long does it take?",
    a: "Most books are designed within 2–3 days. After you approve the preview, printing and delivery usually takes 4–7 business days depending on your city.",
  },
  {
    q: "Where do you deliver?",
    a: "Everywhere in Bangladesh via trusted couriers (Pathao, Steadfast, RedX, and Sundarban). Delivery inside Dhaka is fastest.",
  },
  {
    q: "What if my book arrives damaged?",
    a: "We'll reprint and reship it for free. Just send us a photo within 3 days of delivery.",
  },
  {
    q: "Can I see my book before it's printed?",
    a: "Yes! We send you a digital preview and you can request free tweaks until you're happy. Nothing prints until you approve.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-x py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">FAQ, shipping & returns</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/70">
        Everything you need to know before you order. Still stuck? Message us on WhatsApp.
      </p>

      <div className="mt-12 space-y-4">
        {faqs.map((f, i) => (
          <details key={i} className="card group cursor-pointer">
            <summary className="flex list-none items-center justify-between font-display text-lg font-bold">
              {f.q}
              <span className="text-coral transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-ink/70">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="card mt-12 bg-sunny">
        <h2 className="font-display text-2xl font-bold">Still have a question?</h2>
        <p className="mt-2 text-ink/80">
          Email <a className="underline" href={`mailto:${brand.email}`}>{brand.email}</a> or
          WhatsApp {brand.whatsapp} — we're friendly, promise.
        </p>
        <Link href="/products" className="btn-primary mt-4">Start my book</Link>
      </div>
    </div>
  );
}
