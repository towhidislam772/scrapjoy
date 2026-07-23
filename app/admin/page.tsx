"use client";

import { useState } from "react";
import { brand, formatPrice } from "@/lib/brand";

type Order = {
  id: string;
  created_at: string;
  status: string;
  product_name: string;
  price: number;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  occasion: string;
  payment: string;
  photo_count: number;
  photos: string[];
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) throw new Error("Wrong password.");
      if (res.status === 501) throw new Error("Backend not configured yet. Add your Supabase keys and ADMIN_PASSWORD.");
      if (!res.ok) throw new Error(`Failed (${res.status}).`);
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!orders) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center py-16">
        <form onSubmit={login} className="card w-full max-w-sm space-y-4">
          <h1 className="font-display text-2xl font-semibold">{brand.name} admin</h1>
          <p className="text-sm text-ink/60">Enter your admin password to view orders.</p>
          <input
            type="password"
            className="input"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-coral">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="mt-2 font-display text-3xl font-semibold">Orders ({orders.length})</h1>
        </div>
        <button className="btn-outline text-sm" onClick={() => setOrders(null)}>Lock</button>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-ink/60">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((o) => (
            <div key={o.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-semibold">{o.customer_name}</span>
                    <span className="tag bg-sunny px-2 py-0.5 text-xs">{o.status}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink/60">
                    {new Date(o.created_at).toLocaleString()} · #{o.id.slice(0, 8)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-semibold">{formatPrice(o.price)}</div>
                  <div className="text-sm text-ink/60">{o.payment}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-x-8 gap-y-1 text-sm text-ink/75 sm:grid-cols-2">
                <Line label="Book" value={o.product_name} />
                <Line label="Phone" value={o.phone} />
                <Line label="City" value={o.city} />
                <Line label="Occasion" value={o.occasion || "—"} />
                <Line label="Address" value={o.address} />
                <Line label="Photos" value={String(o.photos?.length ?? 0)} />
              </div>

              {o.photos && o.photos.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {o.photos.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" title="Open full size">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover ring-1 ring-ink/10 transition hover:opacity-80" />
                      </a>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink/45">Click a photo to open/download full size.</p>
                </div>
              )}

              <div className="mt-4">
                <a
                  href={`https://wa.me/${o.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-sm"
                >
                  Message {o.customer_name.split(" ")[0]} on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 text-ink/45">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
