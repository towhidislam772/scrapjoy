"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { products, formatPrice, Product } from "@/lib/brand";

type Photo = { id: string; url: string; caption: string };

// Original cover layouts (our own designs, not copied from anyone).
type CoverStyle = "poster" | "centered" | "fullbleed" | "band" | "minimal" | "framed";

const coverStyles: { id: CoverStyle; label: string }[] = [
  { id: "poster", label: "Travel poster" },
  { id: "centered", label: "Photo centered" },
  { id: "fullbleed", label: "Full bleed" },
  { id: "band", label: "Bottom band" },
  { id: "minimal", label: "Minimal type" },
  { id: "framed", label: "Framed" },
];

// Selectable background colours for the Travel-poster cover.
// `dark: true` means the swatch is dark, so text/icon flips to light.
const POSTER_COLORS: { bg: string; dark?: boolean }[] = [
  { bg: "#F3ECD9" },
  { bg: "#F5E1A4" },
  { bg: "#F4C542" },
  { bg: "#F6C9A8" },
  { bg: "#F6C6D0" },
  { bg: "#EC6A9C", dark: true },
  { bg: "#E4572E", dark: true },
  { bg: "#BFD1B0" },
  { bg: "#B7E0D0" },
  { bg: "#A9D5E8" },
  { bg: "#3C7DA6", dark: true },
  { bg: "#CDBCE8" },
  { bg: "#C0663F", dark: true },
  { bg: "#25262B", dark: true },
];

// Selectable icons (standard emoji — free to use, not copied artwork).
const COVER_ICONS = [
  "🏖️", "🌴", "🌊", "🗼", "🗽", "⛩️", "🕌", "🏔️", "🏛️", "🌉",
  "🌸", "🌺", "🌻", "🍋", "🍹", "🦩", "🐚", "⭐", "☀️", "🌙",
  "✈️", "🚗", "💍", "🎓", "👶", "🎂", "❤️", "🎄",
];

const accentBg: Record<Product["accent"], string> = {
  coral: "bg-coral",
  sunny: "bg-sunny",
  teal: "bg-teal",
  grape: "bg-grape",
  sky: "bg-sky",
};

const accentText: Record<Product["accent"], string> = {
  coral: "text-cream",
  sunny: "text-ink",
  teal: "text-ink",
  grape: "text-cream",
  sky: "text-ink",
};

export function BookBuilder() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState("Our Memories");
  const [subtitle, setSubtitle] = useState("2026");
  const [productSlug, setProductSlug] = useState(products[1].slug);
  const [coverStyle, setCoverStyle] = useState<CoverStyle>("poster");
  const [coverColor, setCoverColor] = useState<string>("#F5E1A4");
  const [coverIcon, setCoverIcon] = useState<string>("🏖️");
  const [spread, setSpread] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.slug === productSlug) ?? products[1];
  const coverPhoto = photos[0]?.url;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next: Photo[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(f),
        caption: "",
      }));
    setPhotos((prev) => [...prev, ...next]);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function move(id: string, dir: -1 | 1) {
    setPhotos((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function setCaption(id: string, caption: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  }

  const coverProps: CoverProps = { title, subtitle, product, coverStyle, coverPhoto, coverColor, coverIcon };

  // Spread 0 = closed front cover. Interior spreads pair up photos: [1|2], [3|4]...
  const interiorSpreads = Math.ceil(photos.length / 2);
  const totalSpreads = 1 + interiorSpreads;
  const clampedSpread = Math.min(spread, totalSpreads - 1);
  const isCover = clampedSpread === 0;
  const pairIndex = clampedSpread - 1;
  const leftPhoto = photos[pairIndex * 2];
  const rightPhoto = photos[pairIndex * 2 + 1];

  const atStart = clampedSpread === 0;
  const atEnd = clampedSpread >= totalSpreads - 1;

  const spreadLabel = useMemo(() => {
    if (isCover) return "Front cover";
    return `Pages ${pairIndex * 2 + 1}–${pairIndex * 2 + 2}`;
  }, [isCover, pairIndex]);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Preview */}
      <div>
        <div className="card bg-sand">
          {photos.length === 0 ? (
            <EmptyState onPick={() => fileInput.current?.click()} />
          ) : (
            <>
              <div className="book-perspective flex min-h-[360px] items-center justify-center py-6">
                <div key={clampedSpread} className="page-turn relative">
                  {/* soft shadow beneath the book */}
                  <div className="absolute inset-x-6 -bottom-3 h-6 rounded-full bg-ink/25 blur-xl" />
                  {isCover ? (
                    <ClosedBook cover={coverProps} />
                  ) : (
                    <OpenSpread
                      left={leftPhoto}
                      right={rightPhoto}
                      leftNo={pairIndex * 2 + 1}
                      rightNo={pairIndex * 2 + 2}
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button className="btn-outline text-sm" onClick={() => setSpread((s) => Math.max(0, s - 1))} disabled={atStart}>
                  ← Prev
                </button>
                <span className="min-w-[120px] text-center font-display text-sm italic text-ink/60">
                  {spreadLabel}
                </span>
                <button
                  className="btn-primary text-sm"
                  onClick={() => setSpread((s) => Math.min(totalSpreads - 1, s + 1))}
                  disabled={atEnd}
                >
                  {isCover ? "Open book →" : "Next →"}
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-ink/45">
                This is how your printed book will look, spread by spread.
              </p>
            </>
          )}
        </div>

        {/* Thumbnail strip / reorder */}
        {photos.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">
                Your photos ({photos.length}) · first is the cover
              </h3>
              <button className="btn-secondary text-sm" onClick={() => fileInput.current?.click()}>
                + Add more
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {photos.map((p, i) => (
                <div key={p.id} className="card flex gap-3 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-ink/10" />
                  <div className="flex-1">
                    <input
                      className="input px-3 py-1.5 text-sm"
                      placeholder="Add a caption…"
                      value={p.caption}
                      onChange={(e) => setCaption(p.id, e.target.value)}
                    />
                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                      {i === 0 && <span className="tag bg-sunny px-2 py-0.5">Cover</span>}
                      <button className="tag px-2 py-0.5" onClick={() => move(p.id, -1)} disabled={i === 0}>←</button>
                      <button className="tag px-2 py-0.5" onClick={() => move(p.id, 1)} disabled={i === photos.length - 1}>→</button>
                      <button className="tag px-2 py-0.5 text-coral" onClick={() => removePhoto(p.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <aside className="card h-fit space-y-5">
        <div>
          <span className="mb-2 block font-display font-semibold">Cover style</span>
          <div className="grid grid-cols-3 gap-2">
            {coverStyles.map((c) => (
              <button
                key={c.id}
                onClick={() => setCoverStyle(c.id)}
                className={`rounded-xl border p-1.5 text-center transition-colors ${
                  coverStyle === c.id ? "border-coral bg-coral/10" : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <CoverThumb style={c.id} product={product} />
                <span className="mt-1 block text-[11px] font-medium">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {coverStyle === "poster" && (
          <>
            <div>
              <span className="mb-2 block font-display font-semibold">Cover colour</span>
              <div className="grid grid-cols-7 gap-2">
                {POSTER_COLORS.map((c) => (
                  <button
                    key={c.bg}
                    type="button"
                    aria-label={`Colour ${c.bg}`}
                    onClick={() => setCoverColor(c.bg)}
                    style={{ backgroundColor: c.bg }}
                    className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-white transition ${
                      coverColor === c.bg ? "ring-ink" : "ring-transparent hover:ring-ink/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block font-display font-semibold">Cover icon</span>
              <div className="grid max-h-36 grid-cols-7 gap-1 overflow-y-auto rounded-xl border border-ink/10 bg-cream p-2">
                {COVER_ICONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setCoverIcon(e)}
                    className={`grid h-8 place-items-center rounded-lg text-lg transition ${
                      coverIcon === e ? "bg-coral/15 ring-1 ring-coral" : "hover:bg-sand"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <label className="block">
          <span className="mb-1 block font-display font-semibold">
            {coverStyle === "poster" ? "Place / event name" : "Cover title"}
          </span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label className="block">
          <span className="mb-1 block font-display font-semibold">Subtitle (year / place)</span>
          <input className="input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>

        <label className="block">
          <span className="mb-1 block font-display font-semibold">Book size</span>
          <select className="input" value={productSlug} onChange={(e) => setProductSlug(e.target.value)}>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} — {formatPrice(p.price)}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-sm text-ink/55">{product.size} · up to {product.pages} pages</span>
        </label>

        <div className="rounded-xl border border-ink/10 bg-sand p-4">
          <div className="flex justify-between font-display">
            <span>Photos added</span>
            <span className="font-semibold">{photos.length}</span>
          </div>
          <div className="mt-1 flex justify-between font-display">
            <span>Price</span>
            <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
          </div>
        </div>

        <Link href={`/order?product=${product.slug}`} className="btn-primary w-full">
          Looks great — order it →
        </Link>
        <p className="text-center text-xs text-ink/55">
          This is a live preview. After you order, you'll send us these photos and we'll
          design the final book for your approval before printing.
        </p>
      </aside>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function EmptyState({ onPick }: { onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="grid w-full place-items-center rounded-2xl border-2 border-dashed border-ink/25 bg-white py-20 text-center transition-colors hover:border-coral hover:bg-cream"
    >
      <span className="text-6xl">📸</span>
      <span className="mt-4 font-display text-xl font-semibold">Add your photos to start</span>
      <span className="mt-1 text-ink/55">Click to choose photos from your device</span>
    </button>
  );
}

/* ---------- Book rendering ---------- */

const BOOK_W = "w-[clamp(150px,42vw,230px)]"; // one page width

// Closed front cover, shown standing with a little page-stack thickness.
function ClosedBook({ cover }: { cover: CoverProps }) {
  return (
    <div className="relative">
      {/* page stack thickness on the right edge */}
      <div className="absolute right-[-6px] top-1.5 bottom-1.5 w-2 rounded-r-sm bg-gradient-to-r from-ink/20 to-ink/5" />
      <div
        className={`${BOOK_W} aspect-[3/4] overflow-hidden rounded-l-sm rounded-r-md shadow-soft ring-1 ring-ink/15`}
      >
        <CoverArt {...cover} />
      </div>
      {/* spine highlight */}
      <div className="absolute inset-y-0 left-0 w-2 rounded-l-sm bg-gradient-to-r from-black/25 to-transparent" />
    </div>
  );
}

// An open two-page spread with a center spine + gutter shadows.
function OpenSpread({
  left,
  right,
  leftNo,
  rightNo,
}: {
  left?: Photo;
  right?: Photo;
  leftNo: number;
  rightNo: number;
}) {
  return (
    <div className="flex shadow-soft ring-1 ring-ink/10">
      <InteriorPage photo={left} side="left" pageNo={leftNo} />
      {/* spine */}
      <div className="w-[6px] bg-gradient-to-r from-ink/25 via-ink/10 to-ink/25" />
      <InteriorPage photo={right} side="right" pageNo={rightNo} />
    </div>
  );
}

function InteriorPage({ photo, side, pageNo }: { photo?: Photo; side: "left" | "right"; pageNo: number }) {
  const rounded = side === "left" ? "rounded-l-md" : "rounded-r-md";
  return (
    <div className={`paper relative ${BOOK_W} aspect-[3/4] overflow-hidden ${rounded}`}>
      {photo ? (
        <div className="h-full w-full p-3">
          <div className="h-full w-full overflow-hidden rounded-sm ring-1 ring-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
          </div>
          {photo.caption && (
            <span className="absolute inset-x-3 bottom-6 rounded bg-cream/85 px-2 py-1 text-center text-[11px] text-ink">
              {photo.caption}
            </span>
          )}
        </div>
      ) : (
        <div className="grid h-full place-items-center text-ink/20">
          <span className="text-sm italic">blank page</span>
        </div>
      )}

      {/* gutter shadow near the spine */}
      <div
        className={`pointer-events-none absolute inset-y-0 ${
          side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"
        } w-10 from-ink/15 to-transparent`}
      />
      {/* page number on outer corner */}
      <span
        className={`absolute bottom-1.5 ${side === "left" ? "left-3" : "right-3"} text-[10px] text-ink/40`}
      >
        {pageNo}
      </span>
    </div>
  );
}

type CoverProps = {
  title: string;
  subtitle: string;
  product: Product;
  coverStyle: CoverStyle;
  coverPhoto?: string;
  coverColor: string;
  coverIcon: string;
};

// The original cover layouts.
function CoverArt({ title, subtitle, product, coverStyle, coverPhoto, coverColor, coverIcon }: CoverProps) {
  const bg = accentBg[product.accent];
  const txt = accentText[product.accent];
  const Img = ({ className }: { className: string }) =>
    coverPhoto ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={coverPhoto} alt="" className={className} />
    ) : (
      <div className={`${className} grid place-items-center bg-ink/10 text-3xl`}>🏞️</div>
    );

  switch (coverStyle) {
    case "poster": {
      const dark = POSTER_COLORS.find((c) => c.bg === coverColor)?.dark;
      const t = dark ? "text-cream" : "text-ink";
      const tSub = dark ? "text-cream/80" : "text-ink/70";
      return (
        <div className="flex h-full w-full flex-col items-center p-4 text-center" style={{ backgroundColor: coverColor }}>
          <div className={`pt-1 font-body text-2xl font-extrabold uppercase leading-[0.92] tracking-tight ${t}`}>
            {title || "Your Title"}
          </div>
          {subtitle && (
            <div className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${tSub}`}>{subtitle}</div>
          )}
          <div className="grid flex-1 place-items-center text-[64px] leading-none">{coverIcon}</div>
        </div>
      );
    }

    case "fullbleed":
      return (
        <div className="relative h-full w-full">
          <Img className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-left text-cream">
            <div className="font-display text-lg font-semibold leading-tight">{title}</div>
            <div className="text-xs uppercase tracking-widest opacity-80">{subtitle}</div>
          </div>
        </div>
      );

    case "band":
      return (
        <div className="flex h-full w-full flex-col">
          <Img className="h-[62%] w-full object-cover" />
          <div className={`flex flex-1 flex-col items-center justify-center px-3 text-center ${bg} ${txt}`}>
            <div className="font-display text-lg font-semibold leading-tight">{title}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">{subtitle}</div>
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className={`flex h-full w-full flex-col items-center justify-center px-4 text-center ${bg} ${txt}`}>
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">Photobook</div>
          <div className="mt-3 font-display text-2xl font-semibold leading-tight">{title}</div>
          <div className="mt-3 h-px w-10 bg-current opacity-40" />
          <div className="mt-3 text-xs tracking-widest opacity-80">{subtitle}</div>
        </div>
      );

    case "framed":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-cream p-3">
          <div className="w-full flex-1 border border-ink/70 p-1.5">
            <Img className="h-full w-full object-cover" />
          </div>
          <div className="mt-2 text-center">
            <div className="font-display text-base font-semibold leading-tight">{title}</div>
            <div className="text-[10px] uppercase tracking-widest text-ink/60">{subtitle}</div>
          </div>
        </div>
      );

    case "centered":
    default:
      return (
        <div className={`flex h-full w-full flex-col items-center justify-center p-4 ${bg} ${txt}`}>
          <div className="w-full flex-1 overflow-hidden rounded-md bg-white ring-1 ring-ink/10">
            <Img className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 text-center">
            <div className="font-display text-lg font-semibold leading-tight">{title}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">{subtitle}</div>
          </div>
        </div>
      );
  }
}

// Tiny schematic thumbnail for the cover-style picker (no photo needed).
function CoverThumb({ style, product }: { style: CoverStyle; product: Product }) {
  const bg = accentBg[product.accent];
  const base = "mx-auto block h-10 w-8 overflow-hidden rounded-sm ring-1 ring-ink/20";
  switch (style) {
    case "poster":
      return (
        <span className={`${base} flex flex-col items-center justify-between p-0.5`} style={{ backgroundColor: "#F5E1A4" }}>
          <span className="mt-0.5 h-0.5 w-4 rounded bg-ink/70" />
          <span className="text-[10px] leading-none">🏖️</span>
          <span className="mb-0.5 h-0.5 w-3 rounded bg-ink/40" />
        </span>
      );
    case "fullbleed":
      return (
        <span className={`${base} relative bg-ink/30`}>
          <span className="absolute bottom-0 left-0.5 h-2 w-4 rounded-sm bg-cream/80" />
        </span>
      );
    case "band":
      return (
        <span className={`${base} flex flex-col`}>
          <span className="h-6 bg-ink/30" />
          <span className={`flex-1 ${bg}`} />
        </span>
      );
    case "minimal":
      return (
        <span className={`${base} ${bg} grid place-items-center`}>
          <span className="h-0.5 w-4 bg-ink/60" />
        </span>
      );
    case "framed":
      return (
        <span className={`${base} bg-cream p-1`}>
          <span className="block h-full w-full ring-1 ring-ink/50 bg-ink/30" />
        </span>
      );
    case "centered":
    default:
      return (
        <span className={`${base} ${bg} flex flex-col items-center justify-center gap-0.5 p-1`}>
          <span className="h-5 w-full rounded-sm bg-cream/80" />
          <span className="h-0.5 w-4 bg-cream/70" />
        </span>
      );
  }
}
