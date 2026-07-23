import Link from "next/link";
import { brand, products, formatPrice } from "@/lib/brand";
import { ProductCard } from "@/components/ProductCard";
import { SmartImage } from "@/components/SmartImage";
import { img } from "@/lib/images";

const steps = [
  {
    n: "01",
    title: "Choose your book",
    body: "Pick a size and style that fits your story — mini, classic, or grand.",
  },
  {
    n: "02",
    title: "Send your photos",
    body: "Upload them or share on WhatsApp. Any phone, any camera works beautifully.",
  },
  {
    n: "03",
    title: "We print & deliver",
    body: "Our designers lay it out, you approve a preview, and it arrives at your door.",
  },
];

const advantages = [
  { icon: "🎨", title: "Designed by humans", body: "A real designer arranges every book — not an algorithm." },
  { icon: "📗", title: "Made to last", body: "Premium paper and sturdy, matte-finish hardcovers." },
  { icon: "💵", title: "Pay on delivery", body: "Cash on Delivery anywhere in Bangladesh." },
  { icon: "🔁", title: "Love-it guarantee", body: "Free reprint if your book ever arrives damaged." },
];

const testimonials = [
  { quote: "Gave one to my mom for Eid and she actually cried. Best gift I've given.", name: "Nusrat", city: "Dhaka" },
  { quote: "Our whole Cox's Bazar trip in one gorgeous book. The colors are so crisp.", name: "Rafiq", city: "Chattogram" },
  { quote: "So easy — I just sent my photos on WhatsApp and they did everything.", name: "Tania", city: "Sylhet" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sunny/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />

        <div className="container-x relative grid items-center gap-14 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="eyebrow">Handmade photobooks · {brand.country}</span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] md:text-6xl">
              Your photos deserve to be{" "}
              <span className="serif-italic text-coral">more than pixels</span>.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">
              {brand.pitch}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/create" className="btn-primary">Design your book</Link>
              <Link href="/how-it-works" className="btn-outline">See how it works</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/55">
              <span>💵 Cash on Delivery</span>
              <span>📦 Nationwide shipping</span>
              <span>🔁 Free reprint if damaged</span>
            </div>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* Advantages strip */}
      <section className="container-x py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <div key={a.title} className="card">
              <div className="text-2xl">{a.icon}</div>
              <h3 className="mt-3 font-display text-lg font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-16">
        <div className="text-center">
          <span className="eyebrow">Simple as can be</span>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Three <span className="wavy">little steps</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <span className="font-display text-5xl font-semibold text-coral/25">{s.n}</span>
              <h3 className="mt-2 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container-x py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">The collection</span>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Pick your photobook</h2>
          </div>
          <Link href="/products" className="btn-outline text-sm">View all →</Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-16">
        <div className="text-center">
          <span className="eyebrow">Loved by memory-keepers</span>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            People are <span className="wavy">obsessed</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="card flex flex-col">
              <span className="font-display text-5xl leading-none text-coral/30">“</span>
              <blockquote className="-mt-3 flex-1 font-display text-lg italic leading-relaxed text-ink/80">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sand font-display text-sm font-semibold">
                  {t.name[0]}
                </span>
                <span className="text-sm text-ink/60">
                  <span className="font-semibold text-ink">{t.name}</span> · {t.city}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-blob bg-ink px-8 py-16 text-center text-cream">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-coral/30 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold md:text-5xl">
              Make something you'll keep forever.
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-cream/70">
              Books start at just {formatPrice(products[0].price)}. Cash on Delivery available
              anywhere in {brand.country}.
            </p>
            <Link href="/create" className="btn-primary mt-8">Start my photobook</Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* Layered open-book mockup built in CSS — original, no stock assets needed. */
function HeroMockup() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Open book */}
      <div className="absolute inset-x-0 top-8 mx-auto flex h-64 w-[92%] overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink/10">
        <div className="w-1/2 overflow-hidden">
          <SmartImage src={img.heroMain} alt="A photobook spread" className="h-full w-full object-cover" />
        </div>
        <div className="w-px bg-ink/10" />
        <div className="flex w-1/2 flex-col justify-center gap-3 p-6">
          <span className="eyebrow">Sajek · 2026</span>
          <div className="h-2.5 w-4/5 rounded bg-ink/10" />
          <div className="h-2.5 w-3/5 rounded bg-ink/10" />
          <div className="mt-2 flex gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal text-lg">🌿</span>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-sunny text-lg">☕</span>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-sand text-lg">📷</span>
          </div>
        </div>
      </div>

      {/* Floating polaroid — top right */}
      <div className="absolute -right-2 top-0 w-32 rotate-6 rounded-xl bg-white p-2 pb-6 shadow-soft ring-1 ring-ink/10">
        <SmartImage src={img.heroPolaroid1} alt="" className="h-24 w-full rounded-md object-cover" />
      </div>

      {/* Floating polaroid — bottom left */}
      <div className="absolute -left-3 bottom-2 w-28 -rotate-6 rounded-xl bg-white p-2 pb-5 shadow-soft ring-1 ring-ink/10">
        <SmartImage src={img.heroPolaroid2} alt="" className="h-20 w-full rounded-md object-cover" />
      </div>
    </div>
  );
}
