import Link from "next/link";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-ink/10 bg-ink text-cream">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 font-display text-2xl font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-coral text-sm">
              {brand.emoji}
            </span>
            {brand.name}
          </div>
          <p className="mt-4 max-w-sm leading-relaxed text-cream/60">{brand.pitch}</p>
        </div>

        <div>
          <h4 className="eyebrow text-cream/50">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-cream/75">
            <li><Link href="/create" className="transition hover:text-cream">Design your book</Link></li>
            <li><Link href="/products" className="transition hover:text-cream">Photobooks</Link></li>
            <li><Link href="/how-it-works" className="transition hover:text-cream">How it works</Link></li>
            <li><Link href="/gallery" className="transition hover:text-cream">Gallery</Link></li>
            <li><Link href="/faq" className="transition hover:text-cream">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-cream/50">Say hello</h4>
          <ul className="mt-4 space-y-2.5 text-cream/75">
            <li><a href={`mailto:${brand.email}`} className="transition hover:text-cream">{brand.email}</a></li>
            <li>WhatsApp: {brand.whatsapp}</li>
            <li><a href={brand.instagram} className="transition hover:text-cream">Instagram</a></li>
            <li><a href={brand.facebook} className="transition hover:text-cream">Facebook</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-sm text-cream/50 md:flex-row">
          <span>© {new Date().getFullYear()} {brand.name}. Made with care in {brand.country}.</span>
          <div className="flex gap-5">
            <Link href="/faq" className="transition hover:text-cream">Shipping</Link>
            <Link href="/faq" className="transition hover:text-cream">Returns</Link>
            <Link href="/about" className="transition hover:text-cream">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
