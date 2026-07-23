"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { products, formatPrice, Product } from "@/lib/brand";
import { presetGroups } from "@/lib/presets";

/* ---------------- Types ---------------- */

type Photo = { id: string; url: string; caption: string; w?: number; h?: number; lowRes?: boolean };
type Layout = 1 | 2 | 3 | 4;
type Slot = { photoId: string; zoom: number; fit: "cover" | "contain" } | null;
type Page = { id: string; layout: Layout; slots: Slot[] };

type CoverStyle = "poster" | "centered" | "fullbleed" | "band" | "minimal" | "framed";

/* ---------------- Constants ---------------- */

const coverStyles: { id: CoverStyle; label: string }[] = [
  { id: "poster", label: "Travel poster" },
  { id: "centered", label: "Photo centered" },
  { id: "fullbleed", label: "Full bleed" },
  { id: "band", label: "Bottom band" },
  { id: "minimal", label: "Minimal type" },
  { id: "framed", label: "Framed" },
];

const POSTER_COLORS: { bg: string; dark?: boolean }[] = [
  { bg: "#F3ECD9" }, { bg: "#F5E1A4" }, { bg: "#FDE2A7" }, { bg: "#F4C542" }, { bg: "#F6C9A8" }, { bg: "#FFCCBC" },
  { bg: "#FADCD9" }, { bg: "#F6C6D0" }, { bg: "#F8BBD0" }, { bg: "#EC6A9C", dark: true }, { bg: "#E4572E", dark: true }, { bg: "#AD1457", dark: true },
  { bg: "#DCEDC8" }, { bg: "#C8E6C9" }, { bg: "#BFD1B0" }, { bg: "#B2DFDB" }, { bg: "#8FA088" }, { bg: "#2E7D32", dark: true },
  { bg: "#B3E5FC" }, { bg: "#A9D5E8" }, { bg: "#B7E0D0" }, { bg: "#3C7DA6", dark: true }, { bg: "#1565C0", dark: true },
  { bg: "#CDBCE8" }, { bg: "#D1C4E9" }, { bg: "#6A1B9A", dark: true },
  { bg: "#C0663F", dark: true }, { bg: "#6D4C41", dark: true }, { bg: "#25262B", dark: true },
];

const COVER_ICONS = [
  "🏖️", "🏝️", "🏕️", "🌴", "🌊", "🗼", "🗽", "⛩️", "🕌", "🛕", "🏔️", "🗻", "🌋", "🏛️", "🌉", "🏙️", "🎡", "🚢", "⛵", "🚂",
  "🚗", "✈️", "🎈", "🧳", "🗺️", "🌸", "🌺", "🌻", "🌷", "🌵", "🍄", "🍁", "🌈", "🌅", "🌄", "☀️", "🌙", "⭐", "❄️", "🌿",
  "🦩", "🐚", "🐬", "🐢", "🐘", "🦒", "🐪", "🦜", "🍋", "🍹", "🍕", "🍜", "🍰", "🥂", "☕", "💍", "💐", "🎓", "👶", "🎂",
  "🎉", "🎁", "❤️", "🕋", "🎄", "🥳", "👑", "💎", "📸",
];

const LAYOUTS: { id: Layout; label: string }[] = [
  { id: 1, label: "1 photo" },
  { id: 2, label: "2 photos" },
  { id: 3, label: "3 photos" },
  { id: 4, label: "4 photos" },
];

const accentBg: Record<Product["accent"], string> = { coral: "bg-coral", sunny: "bg-sunny", teal: "bg-teal", grape: "bg-grape", sky: "bg-sky" };
const accentText: Record<Product["accent"], string> = { coral: "text-cream", sunny: "text-ink", teal: "text-ink", grape: "text-cream", sky: "text-ink" };

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/* ---------------- Main component ---------------- */

export function BookBuilder() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pages, setPages] = useState<Page[]>([{ id: uid(), layout: 1, slots: [null] }]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const [title, setTitle] = useState("Our Memories");
  const [subtitle, setSubtitle] = useState("2026");
  const [productSlug, setProductSlug] = useState(products[1].slug);
  const [coverStyle, setCoverStyle] = useState<CoverStyle>("poster");
  const [coverColor, setCoverColor] = useState("#F5E1A4");
  const [coverIcon, setCoverIcon] = useState("🏖️");
  const [presetTab, setPresetTab] = useState(presetGroups[0].id);
  const [suggestedIcons, setSuggestedIcons] = useState<string[]>([]);
  const [spread, setSpread] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.slug === productSlug) ?? products[1];
  const coverPhoto = photos[0]?.url;
  const activeGroup = presetGroups.find((g) => g.id === presetTab) ?? presetGroups[0];
  const selectedPage = pages.find((p) => p.id === selectedPageId) ?? null;
  const photoById = (id: string) => photos.find((p) => p.id === id);

  /* -------- Photo library -------- */
  function addFiles(files: FileList | null) {
    if (!files) return;
    const next: Photo[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ id: uid(), url: URL.createObjectURL(f), caption: "" }));
    setPhotos((prev) => [...prev, ...next]);
    next.forEach((p) => {
      const im = new window.Image();
      im.onload = () => {
        const lowRes = Math.min(im.naturalWidth, im.naturalHeight) < 1000;
        setPhotos((prev) => prev.map((x) => (x.id === p.id ? { ...x, w: im.naturalWidth, h: im.naturalHeight, lowRes } : x)));
      };
      im.src = p.url;
    });
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const t = prev.find((p) => p.id === id);
      if (t) URL.revokeObjectURL(t.url);
      return prev.filter((p) => p.id !== id);
    });
    // clear this photo from any slots
    setPages((prev) => prev.map((pg) => ({ ...pg, slots: pg.slots.map((s) => (s && s.photoId === id ? null : s)) })));
  }

  function setCaption(id: string, caption: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  }

  /* -------- Pages -------- */
  function addPage() {
    const pg: Page = { id: uid(), layout: 1, slots: [null] };
    setPages((prev) => [...prev, pg]);
    setSelectedPageId(pg.id);
    const newIndex = pages.length;
    setSpread(1 + Math.floor(newIndex / 2));
  }

  function deletePage(id: string) {
    setPages((prev) => (prev.length <= 1 ? prev : prev.filter((p) => p.id !== id)));
    if (selectedPageId === id) setSelectedPageId("");
  }

  function selectPage(id: string) {
    setSelectedPageId(id);
    const idx = pages.findIndex((p) => p.id === id);
    if (idx >= 0) setSpread(1 + Math.floor(idx / 2));
  }

  function setLayout(pageId: string, layout: Layout) {
    setPages((prev) =>
      prev.map((pg) => {
        if (pg.id !== pageId) return pg;
        const slots = [...pg.slots];
        while (slots.length < layout) slots.push(null);
        slots.length = layout;
        return { ...pg, layout, slots };
      }),
    );
  }

  // Place a library photo into the first empty slot of the selected page.
  function placePhoto(photoId: string) {
    if (!selectedPage) return;
    setPages((prev) =>
      prev.map((pg) => {
        if (pg.id !== selectedPage.id) return pg;
        const slots = [...pg.slots];
        const empty = slots.findIndex((s) => s === null);
        const target = empty === -1 ? slots.length - 1 : empty; // replace last if full
        slots[target] = { photoId, zoom: 1, fit: "cover" };
        return { ...pg, slots };
      }),
    );
  }

  function clearSlot(pageId: string, slotIdx: number) {
    setPages((prev) => prev.map((pg) => (pg.id === pageId ? { ...pg, slots: pg.slots.map((s, i) => (i === slotIdx ? null : s)) } : pg)));
  }

  function slotZoom(pageId: string, slotIdx: number, delta: number) {
    setPages((prev) =>
      prev.map((pg) =>
        pg.id === pageId
          ? { ...pg, slots: pg.slots.map((s, i) => (i === slotIdx && s ? { ...s, zoom: clamp(+(s.zoom + delta).toFixed(2), 1, 2.5) } : s)) }
          : pg,
      ),
    );
  }

  function slotFit(pageId: string, slotIdx: number) {
    setPages((prev) =>
      prev.map((pg) =>
        pg.id === pageId
          ? { ...pg, slots: pg.slots.map((s, i) => (i === slotIdx && s ? { ...s, fit: s.fit === "cover" ? "contain" : "cover" } : s)) }
          : pg,
      ),
    );
  }

  /* -------- Preview leaves -------- */
  const coverProps: CoverProps = { title, subtitle, product, coverStyle, coverPhoto, coverColor, coverIcon };
  const interiorSpreads = Math.ceil(pages.length / 2);
  const totalSpreads = 1 + interiorSpreads;
  const clampedSpread = Math.min(spread, totalSpreads - 1);
  const isCover = clampedSpread === 0;
  const pairIndex = clampedSpread - 1;
  const leftPage = pages[pairIndex * 2];
  const rightPage = pages[pairIndex * 2 + 1];

  function applyPreset(name: string, emojis: string[]) {
    setTitle(name);
    setSuggestedIcons(emojis);
    if (emojis[0]) setCoverIcon(emojis[0]);
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* -------- Left: preview + page editor -------- */}
      <div>
        {/* Preview */}
        <div className="card bg-sand">
          <div className="book-perspective flex min-h-[360px] items-center justify-center py-6">
            <div key={clampedSpread} className="page-turn relative">
              <div className="absolute inset-x-6 -bottom-3 h-6 rounded-full bg-ink/25 blur-xl" />
              {isCover ? (
                <ClosedBook cover={coverProps} />
              ) : (
                <div className="flex shadow-soft ring-1 ring-ink/10">
                  <PageLeaf page={leftPage} photoById={photoById} side="left" />
                  <div className="w-[6px] bg-gradient-to-r from-ink/25 via-ink/10 to-ink/25" />
                  <PageLeaf page={rightPage} photoById={photoById} side="right" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4">
            <button className="btn-outline text-sm" onClick={() => setSpread((s) => Math.max(0, s - 1))} disabled={clampedSpread === 0}>← Prev</button>
            <span className="min-w-[110px] text-center font-display text-sm italic text-ink/60">
              {isCover ? "Front cover" : `Pages ${pairIndex * 2 + 1}–${pairIndex * 2 + 2}`}
            </span>
            <button className="btn-primary text-sm" onClick={() => setSpread((s) => Math.min(totalSpreads - 1, s + 1))} disabled={clampedSpread >= totalSpreads - 1}>
              {isCover ? "Open book →" : "Next →"}
            </button>
          </div>
        </div>

        {/* Page strip */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Pages ({pages.length})</h3>
            <button className="btn-secondary text-sm" onClick={addPage}>+ Add page</button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {pages.map((pg, i) => (
              <button
                key={pg.id}
                onClick={() => selectPage(pg.id)}
                className={`relative shrink-0 rounded-lg border-2 p-1 transition ${selectedPageId === pg.id ? "border-coral" : "border-ink/15 hover:border-ink/40"}`}
              >
                <div className="h-16 w-12">
                  <PageThumb page={pg} photoById={photoById} />
                </div>
                <span className="mt-0.5 block text-center text-[10px] text-ink/50">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected page editor */}
        {selectedPage ? (
          <div className="card mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">Editing page {pages.findIndex((p) => p.id === selectedPage.id) + 1}</h3>
              <button className="tag px-2 py-0.5 text-coral" onClick={() => deletePage(selectedPage.id)} disabled={pages.length <= 1}>Delete page</button>
            </div>

            <div className="mt-3">
              <span className="mb-1 block text-sm font-medium text-ink/60">Layout</span>
              <div className="flex flex-wrap gap-2">
                {LAYOUTS.map((l) => (
                  <button key={l.id} onClick={() => setLayout(selectedPage.id, l.id)} className={`tag ${selectedPage.layout === l.id ? "border-coral bg-coral/10" : ""}`}>{l.label}</button>
                ))}
              </div>
            </div>

            {/* Slots */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedPage.slots.map((slot, i) => (
                <div key={i} className="rounded-lg border border-ink/10 bg-cream p-2">
                  <div className="text-xs font-medium text-ink/50">Slot {i + 1}</div>
                  {slot ? (
                    <div className="mt-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoById(slot.photoId)?.url} alt="" className="h-14 w-full rounded object-cover ring-1 ring-ink/10" />
                      <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
                        <button className="tag px-1.5 py-0.5" onClick={() => slotFit(selectedPage.id, i)}>{slot.fit === "cover" ? "Fill" : "Fit"}</button>
                        <button className="tag px-1.5 py-0.5" onClick={() => slotZoom(selectedPage.id, i, -0.1)} disabled={slot.zoom <= 1}>−</button>
                        <span className="tabular-nums text-ink/50">{Math.round(slot.zoom * 100)}%</span>
                        <button className="tag px-1.5 py-0.5" onClick={() => slotZoom(selectedPage.id, i, 0.1)} disabled={slot.zoom >= 2.5}>+</button>
                        <button className="tag px-1.5 py-0.5 text-coral" onClick={() => clearSlot(selectedPage.id, i)}>×</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 grid h-14 place-items-center rounded border border-dashed border-ink/25 text-xs text-ink/40">empty</div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink/50">Tap a photo below to place it in the next empty slot.</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink/50">Tap a page above to edit its layout and photos.</p>
        )}

        {/* Photo library */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Photo library ({photos.length})</h3>
            <button className="btn-secondary text-sm" onClick={() => fileInput.current?.click()}>+ Upload photos</button>
          </div>
          {photos.length === 0 ? (
            <button onClick={() => fileInput.current?.click()} className="mt-3 grid w-full place-items-center rounded-2xl border-2 border-dashed border-ink/25 bg-white py-12 text-center transition hover:border-coral">
              <span className="text-5xl">📸</span>
              <span className="mt-3 font-display font-semibold">Upload your photos</span>
              <span className="mt-1 max-w-xs text-xs text-ink/45">For sharp prints, use <strong>original</strong> photos (not screenshots), ideally 1500px+ on the long side.</span>
            </button>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((p) => (
                <div key={p.id} className="group relative">
                  <button onClick={() => placePhoto(p.id)} title="Tap to place in selected page" className="block w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="" className="aspect-square w-full rounded-lg object-cover ring-1 ring-ink/10 transition group-hover:ring-coral" />
                  </button>
                  <button onClick={() => removePhoto(p.id)} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-xs text-cream">×</button>
                  {p.lowRes && <span className="absolute bottom-1 left-1 rounded bg-coral px-1 text-[9px] text-cream">low-res</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* -------- Right: cover design + order -------- */}
      <aside className="card h-fit space-y-5">
        <div>
          <span className="mb-2 block font-display font-semibold">Cover style</span>
          <div className="grid grid-cols-3 gap-2">
            {coverStyles.map((c) => (
              <button key={c.id} onClick={() => setCoverStyle(c.id)} className={`rounded-xl border p-1.5 text-center transition-colors ${coverStyle === c.id ? "border-coral bg-coral/10" : "border-ink/15 hover:border-ink/40"}`}>
                <CoverThumb style={c.id} product={product} />
                <span className="mt-1 block text-[11px] font-medium">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {coverStyle === "poster" && (
          <>
            <div>
              <span className="mb-2 block font-display font-semibold">Quick start</span>
              <div className="flex gap-1.5">
                {presetGroups.map((g) => (
                  <button key={g.id} onClick={() => setPresetTab(g.id)} className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${presetTab === g.id ? "border-coral bg-coral/10" : "border-ink/15 hover:border-ink/40"}`}>{g.label}</button>
                ))}
              </div>
              <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-ink/10 bg-cream p-2">
                {activeGroup.items.map((it) => (
                  <button key={it.name} onClick={() => applyPreset(it.name, it.emojis)} className="rounded-full border border-ink/15 bg-white px-2.5 py-1 text-xs font-medium transition hover:border-coral hover:bg-coral/5">{it.emojis[0]} {it.name}</button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block font-display font-semibold">Cover colour</span>
              <div className="grid grid-cols-7 gap-2">
                {POSTER_COLORS.map((c) => (
                  <button key={c.bg} type="button" aria-label={c.bg} onClick={() => setCoverColor(c.bg)} style={{ backgroundColor: c.bg }} className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-white transition ${coverColor === c.bg ? "ring-ink" : "ring-transparent hover:ring-ink/30"}`} />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block font-display font-semibold">Cover icon</span>
              {suggestedIcons.length > 0 && (
                <div className="mb-2 rounded-xl border border-coral/30 bg-coral/5 p-2">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-coral">Suggested for {title || "this"}</span>
                  <div className="flex flex-wrap gap-1">
                    {suggestedIcons.map((e) => (
                      <button key={e} onClick={() => setCoverIcon(e)} className={`grid h-8 w-8 place-items-center rounded-lg text-lg transition ${coverIcon === e ? "bg-coral/20 ring-1 ring-coral" : "bg-white hover:bg-sand"}`}>{e}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid max-h-36 grid-cols-7 gap-1 overflow-y-auto rounded-xl border border-ink/10 bg-cream p-2">
                {COVER_ICONS.map((e) => (
                  <button key={e} onClick={() => setCoverIcon(e)} className={`grid h-8 place-items-center rounded-lg text-lg transition ${coverIcon === e ? "bg-coral/15 ring-1 ring-coral" : "hover:bg-sand"}`}>{e}</button>
                ))}
              </div>
            </div>
          </>
        )}

        <label className="block">
          <span className="mb-1 block font-display font-semibold">{coverStyle === "poster" ? "Place / event name" : "Cover title"}</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-display font-semibold">Subtitle (year / place)</span>
          <input className="input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-display font-semibold">Book size</span>
          <select className="input" value={productSlug} onChange={(e) => setProductSlug(e.target.value)}>
            {products.map((p) => (<option key={p.slug} value={p.slug}>{p.name} — {formatPrice(p.price)}</option>))}
          </select>
          <span className="mt-1 block text-sm text-ink/55">{product.size} · up to {product.pages} pages</span>
        </label>

        <div className="rounded-xl border border-ink/10 bg-sand p-4">
          <div className="flex justify-between font-display"><span>Photos</span><span className="font-semibold">{photos.length}</span></div>
          <div className="mt-1 flex justify-between font-display"><span>Price</span><span className="text-xl font-semibold">{formatPrice(product.price)}</span></div>
        </div>

        <Link href={`/order?product=${product.slug}`} className="btn-primary w-full">Looks great — order it →</Link>
        <p className="text-center text-xs text-ink/55">Live preview. After you order, send us these photos and we'll finalise your book for approval before printing.</p>
      </aside>

      <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/* ---------------- Page rendering ---------------- */

function layoutClasses(layout: Layout) {
  switch (layout) {
    case 2: return "grid-cols-1 grid-rows-2";
    case 3: return "grid-cols-2 grid-rows-2";
    case 4: return "grid-cols-2 grid-rows-2";
    default: return "grid-cols-1 grid-rows-1";
  }
}

const BOOK_W = "w-[clamp(150px,42vw,230px)]";

function PageLeaf({ page, photoById, side }: { page?: Page; photoById: (id: string) => Photo | undefined; side: "left" | "right" }) {
  const rounded = side === "left" ? "rounded-l-md" : "rounded-r-md";
  if (!page) return <div className={`paper ${BOOK_W} aspect-[3/4] ${rounded} opacity-60`} />;
  return (
    <div className={`paper relative ${BOOK_W} aspect-[3/4] overflow-hidden ${rounded}`}>
      <div className={`grid h-full w-full gap-1 p-2 ${layoutClasses(page.layout)}`}>
        {page.slots.map((slot, i) => (
          <SlotView key={i} slot={slot} photoById={photoById} span={page.layout === 3 && i === 0} />
        ))}
      </div>
      <div className={`pointer-events-none absolute inset-y-0 ${side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"} w-8 from-ink/12 to-transparent`} />
    </div>
  );
}

function SlotView({ slot, photoById, span }: { slot: Slot; photoById: (id: string) => Photo | undefined; span?: boolean }) {
  const spanCls = span ? "col-span-2" : "";
  if (!slot) return <div className={`grid place-items-center rounded-sm border border-dashed border-ink/20 text-[10px] text-ink/25 ${spanCls}`}>photo</div>;
  const photo = photoById(slot.photoId);
  if (!photo) return <div className={`rounded-sm bg-ink/5 ${spanCls}`} />;
  return (
    <div className={`overflow-hidden rounded-sm ring-1 ring-ink/10 ${spanCls}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt="" className={`h-full w-full ${slot.fit === "contain" ? "object-contain" : "object-cover"}`} style={{ transform: `scale(${slot.zoom})` }} />
    </div>
  );
}

function PageThumb({ page, photoById }: { page: Page; photoById: (id: string) => Photo | undefined }) {
  return (
    <div className={`grid h-full w-full gap-px rounded bg-white p-0.5 ring-1 ring-ink/10 ${layoutClasses(page.layout)}`}>
      {page.slots.map((slot, i) => {
        const span = page.layout === 3 && i === 0 ? "col-span-2" : "";
        const photo = slot ? photoById(slot.photoId) : undefined;
        return photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={photo.url} alt="" className={`h-full w-full rounded-[1px] object-cover ${span}`} />
        ) : (
          <div key={i} className={`rounded-[1px] bg-ink/10 ${span}`} />
        );
      })}
    </div>
  );
}

/* ---------------- Cover rendering (unchanged design) ---------------- */

type CoverProps = { title: string; subtitle: string; product: Product; coverStyle: CoverStyle; coverPhoto?: string; coverColor: string; coverIcon: string };

function ClosedBook({ cover }: { cover: CoverProps }) {
  return (
    <div className="relative">
      <div className="absolute right-[-6px] top-1.5 bottom-1.5 w-2 rounded-r-sm bg-gradient-to-r from-ink/20 to-ink/5" />
      <div className={`${BOOK_W} aspect-[3/4] overflow-hidden rounded-l-sm rounded-r-md shadow-soft ring-1 ring-ink/15`}>
        <CoverArt {...cover} />
      </div>
      <div className="absolute inset-y-0 left-0 w-2 rounded-l-sm bg-gradient-to-r from-black/25 to-transparent" />
    </div>
  );
}

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
          <div className={`pt-1 font-body text-2xl font-extrabold uppercase leading-[0.92] tracking-tight ${t}`}>{title || "Your Title"}</div>
          {subtitle && <div className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${tSub}`}>{subtitle}</div>}
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
          <div className="w-full flex-1 border border-ink/70 p-1.5"><Img className="h-full w-full object-cover" /></div>
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
          <div className="w-full flex-1 overflow-hidden rounded-md bg-white ring-1 ring-ink/10"><Img className="h-full w-full object-cover" /></div>
          <div className="mt-3 text-center">
            <div className="font-display text-lg font-semibold leading-tight">{title}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">{subtitle}</div>
          </div>
        </div>
      );
  }
}

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
      return <span className={`${base} relative bg-ink/30`}><span className="absolute bottom-0 left-0.5 h-2 w-4 rounded-sm bg-cream/80" /></span>;
    case "band":
      return <span className={`${base} flex flex-col`}><span className="h-6 bg-ink/30" /><span className={`flex-1 ${bg}`} /></span>;
    case "minimal":
      return <span className={`${base} ${bg} grid place-items-center`}><span className="h-0.5 w-4 bg-ink/60" /></span>;
    case "framed":
      return <span className={`${base} bg-cream p-1`}><span className="block h-full w-full ring-1 ring-ink/50 bg-ink/30" /></span>;
    case "centered":
    default:
      return <span className={`${base} ${bg} flex flex-col items-center justify-center gap-0.5 p-1`}><span className="h-5 w-full rounded-sm bg-cream/80" /><span className="h-0.5 w-4 bg-cream/70" /></span>;
  }
}
