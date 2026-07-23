"use client";

import { useState } from "react";
import { brand, formatPrice } from "@/lib/brand";

const STATUSES = ["new", "designing", "approved", "printing", "shipped", "done", "cancelled"];

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
      if (!res.ok) {
        let detail = "";
        try {
          const j = await res.json();
          if (j?.error) detail = `: ${j.error}`;
        } catch {
          /* ignore */
        }
        throw new Error(`Failed (${res.status})${detail}`);
      }
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, status } : o)) ?? prev);
    try {
      await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, status }),
      });
    } catch {
      /* optimistic update; a failed sync will correct on next reload */
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

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total orders" value={String(orders.length)} />
        <Stat label="Customers" value={String(new Set(orders.map((o) => o.phone)).size)} />
        <Stat
          label="In progress"
          value={String(orders.filter((o) => ["designing", "approved", "printing", "shipped"].includes(o.status)).length)}
        />
        <Stat label="Revenue" value={formatPrice(orders.reduce((s, o) => s + (o.price || 0), 0))} />
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
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="rounded-full border border-ink/20 bg-white px-2 py-0.5 text-xs font-medium"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wide text-ink/50">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
