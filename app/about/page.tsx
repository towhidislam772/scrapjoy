import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `About — ${brand.name}`,
  description: `Why we started ${brand.name} and what we care about.`,
};

export default function AboutPage() {
  return (
    <div className="container-x py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Our story</h1>

      <div className="mt-8 max-w-2xl space-y-5 text-lg text-ink/80">
        <p>
          These days our best moments live and die on our phones — thousands of photos we
          never look at again. We started {brand.name} because memories deserve better than
          a camera roll.
        </p>
        <p>
          We turn your photos into real, hold-in-your-hands books: printed beautifully,
          bound to last, and delivered to your door anywhere in {brand.country}. Whether it's
          a trip, a wedding, a baby's first year, or just a year you don't want to forget —
          we help you keep it forever.
        </p>
        <p>
          We're a small, joyful team obsessed with color, craft, and happy customers. Every
          book is checked by a real human before it ships.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card bg-sunny">
          <div className="text-4xl">🎨</div>
          <h3 className="mt-3 font-display text-xl font-bold">Made with care</h3>
          <p className="mt-1 text-ink/70">A real designer lays out every book.</p>
        </div>
        <div className="card bg-teal">
          <div className="text-4xl">💵</div>
          <h3 className="mt-3 font-display text-xl font-bold">Easy bKash payment</h3>
          <p className="mt-1 text-ink/70">Secure bKash payment, delivered across {brand.country}.</p>
        </div>
        <div className="card bg-coral text-white">
          <div className="text-4xl">🔁</div>
          <h3 className="mt-3 font-display text-xl font-bold">Love it guarantee</h3>
          <p className="mt-1 text-white/80">Free reprint if it arrives damaged.</p>
        </div>
      </div>

      <div className="mt-12">
        <Link href="/products" className="btn-primary">Make your first book</Link>
      </div>
    </div>
  );
}
