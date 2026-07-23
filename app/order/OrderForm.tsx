"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, brand, formatPrice } from "@/lib/brand";
import { getBrowserSupabase, supabaseConfigured, PHOTO_BUCKET } from "@/lib/supabase";

// Checkout flow:
//  • If Supabase is configured, we save the order to the database AND upload the
//    customer's photos to Storage, so everything lands in your admin dashboard.
//  • If not configured yet, we fall back to a pre-filled WhatsApp message so you
//    can start taking orders immediately with zero backend.

type Status = "idle" | "submitting" | "done" | "error";

export function OrderForm() {
  const params = useSearchParams();
  const preselected = params.get("product") ?? products[1].slug;

  const [productSlug, setProductSlug] = useState(preselected);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [occasion, setOccasion] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.slug === productSlug) ?? products[1];
  const ready = Boolean(name && phone && city && address);

  const waNumber = brand.whatsapp.replace(/[^\d]/g, "");
  const waMessage = [
    `Hi ${brand.name}! I'd like to order a photobook 📸`,
    ``,
    `Book: ${product.name} (${product.size}, ${product.pages} pages)`,
    `Price: ${formatPrice(product.price)}`,
    `Occasion: ${occasion || "—"}`,
    `Payment: ${payment}`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `City: ${city}`,
    `Address: ${address}`,
  ].join("\n");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;

    // Fallback: no backend configured → hand off to WhatsApp.
    if (!supabaseConfigured) {
      window.open(waLink, "_blank");
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      // 1) Create the order row.
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: product.slug,
          product_name: product.name,
          price: product.price,
          title: "",
          subtitle: "",
          customer_name: name,
          phone,
          city,
          address,
          occasion,
          payment,
          photo_count: photos.length,
        }),
      });
      if (!res.ok) throw new Error(`Order failed (${res.status})`);
      const { id } = (await res.json()) as { id: string };

      // 2) Upload photos to Storage under this order's folder.
      const supabase = getBrowserSupabase();
      if (supabase && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i];
          const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${id}/${String(i + 1).padStart(2, "0")}-${safe}`;
          const { error } = await supabase.storage
            .from(PHOTO_BUCKET)
            .upload(path, file, { upsert: false });
          if (error) throw new Error(`Photo upload failed: ${error.message}`);
        }
      }

      setStatus("done");
      setMessage(
        `Order received! Your reference is ${id.slice(0, 8)}. We'll message you on WhatsApp to confirm.`,
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-10 card bg-teal text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-3 font-display text-2xl font-semibold">Thank you!</h2>
        <p className="mt-2 text-ink/75">{message}</p>
        <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary mt-6">
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
      <form className="card space-y-5" onSubmit={handleSubmit}>
        <Field label="Which book?">
          <select className="input" value={productSlug} onChange={(e) => setProductSlug(e.target.value)}>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} — {formatPrice(p.price)}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Your name">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Phone / WhatsApp">
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="City">
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dhaka" />
          </Field>
          <Field label="Occasion (optional)">
            <input className="input" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="Wedding, trip, baby…" />
          </Field>
        </div>

        <Field label="Delivery address">
          <textarea className="input min-h-24" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, road, area…" />
        </Field>

        <Field label="Payment method">
          <div className="flex flex-wrap gap-3">
            {["Cash on Delivery", "bKash (advance)"].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setPayment(m)}
                className={`tag ${payment === m ? "border-coral bg-coral/10" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        {supabaseConfigured && (
          <Field label={`Your photos${photos.length ? ` (${photos.length} selected)` : ""}`}>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-ink/25 bg-cream py-6 text-center text-ink/60 transition-colors hover:border-coral"
            >
              📤 Click to attach your photos
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
            />
          </Field>
        )}

        {status === "error" && (
          <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{message}</p>
        )}

        <button type="submit" disabled={!ready || status === "submitting"} className="btn-primary w-full disabled:opacity-50">
          {status === "submitting"
            ? "Sending…"
            : supabaseConfigured
              ? "Place my order →"
              : "Send my order on WhatsApp →"}
        </button>
        <p className="text-center text-sm text-ink/50">
          {supabaseConfigured
            ? "We'll confirm your order on WhatsApp within a few hours."
            : "We'll confirm your order and collect your photos on WhatsApp."}
        </p>
      </form>

      <aside className="card h-fit bg-sand">
        <h3 className="font-display text-xl font-semibold">Order summary</h3>
        <div className="mt-4 space-y-2 text-ink/75">
          <Row label="Book" value={product.name} />
          <Row label="Size" value={product.size} />
          <Row label="Pages" value={String(product.pages)} />
          <Row label="Payment" value={payment} />
          <div className="my-2 border-t border-ink/15" />
          <Row label="Total" value={formatPrice(product.price)} bold />
        </div>
        <p className="mt-4 text-sm text-ink/55">
          Delivery charge is added based on your city and confirmed on WhatsApp.
        </p>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-display font-semibold">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={bold ? "font-display text-lg font-semibold" : "font-medium"}>{value}</span>
    </div>
  );
}
