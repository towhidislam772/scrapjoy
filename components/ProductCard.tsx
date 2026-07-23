import Link from "next/link";
import { Product, formatPrice } from "@/lib/brand";
import { img } from "@/lib/images";
import { SmartImage } from "@/components/SmartImage";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group card flex flex-col transition-shadow duration-200 hover:shadow-soft">
      <div className="relative mb-6 h-48 overflow-hidden rounded-2xl">
        <SmartImage
          src={img.productCovers[product.slug]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-ink shadow-soft-sm">
            {product.badge}
          </span>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-ink/50">
        {product.size} · {product.pages} pages
      </p>
      <p className="mt-3 flex-1 leading-relaxed text-ink/70">{product.blurb}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-2xl font-semibold">
          {formatPrice(product.price)}
        </span>
        <Link href={`/order?product=${product.slug}`} className="btn-primary text-sm">
          Order now
        </Link>
      </div>
    </div>
  );
}
