import type { Metadata } from "next";
import { brand, products } from "@/lib/brand";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: `Photobooks — ${brand.name}`,
  description: "Choose from mini, classic A4, and big square photobooks. Printed and delivered across Bangladesh.",
};

export default function ProductsPage() {
  return (
    <div className="container-x py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Our photobooks</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/70">
        Every book is printed on premium paper with a sturdy cover, then delivered to your door.
        Not sure which to pick? Message us on WhatsApp and we'll help.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="card mt-12 bg-teal">
        <h2 className="font-display text-2xl font-bold">Want a custom size or bulk order?</h2>
        <p className="mt-2 text-ink/80">
          Corporate gifts, wedding sets, or something unique — we do those too.
          Email <a className="underline" href={`mailto:${brand.email}`}>{brand.email}</a> or
          WhatsApp {brand.whatsapp}.
        </p>
      </div>
    </div>
  );
}
