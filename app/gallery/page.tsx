import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { img } from "@/lib/images";
import { SmartImage } from "@/components/SmartImage";

export const metadata: Metadata = {
  title: `Gallery — ${brand.name}`,
  description: "A peek at photobooks we've made for customers across Bangladesh.",
};

export default function GalleryPage() {
  return (
    <div className="container-x py-16">
      <span className="eyebrow">Our work</span>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Gallery</h1>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink/65">
        Real books, real memories. (These are sample images for now — swap in your own
        product photos in <code className="text-sm">lib/images.ts</code> once you have them.)
      </p>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {img.gallery.map((tile, i) => (
          <figure key={i} className="group relative aspect-square overflow-hidden rounded-blob ring-1 ring-ink/10">
            <SmartImage
              src={tile.src}
              alt={tile.label}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-3 left-3 right-3 font-display text-sm font-medium text-cream">
              {tile.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/create" className="btn-primary">Design yours</Link>
      </div>
    </div>
  );
}
