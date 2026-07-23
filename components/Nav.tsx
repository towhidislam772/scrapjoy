import Link from "next/link";
import { brand } from "@/lib/brand";

const links = [
  { href: "/create", label: "Design your book" },
  { href: "/products", label: "Photobooks" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur">
      <nav className="container-x flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-coral text-sm text-cream">
            {brand.emoji}
          </span>
          {brand.name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/account" className="hidden text-sm font-medium text-ink/70 transition-colors hover:text-ink sm:block">
            Account
          </Link>
          <Link href="/create" className="btn-primary text-sm">
            Make a book
          </Link>
        </div>
      </nav>
    </header>
  );
}
