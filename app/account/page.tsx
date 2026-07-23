"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand, formatPrice } from "@/lib/brand";
import { getBrowserSupabase, supabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

type Order = {
  id: string;
  created_at: string;
  status: string;
  product_name: string;
  price: number;
  discount: number;
  payment: string;
};

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (!supabaseConfigured) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Accounts coming soon</h1>
        <p className="mt-3 text-ink/60">
          Customer accounts turn on once the store's database is connected.
        </p>
        <Link href="/products" className="btn-primary mt-6">Browse photobooks</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container-x py-20 text-center text-ink/50">Loading…</div>;
  }

  return (
    <div className="container-x py-16">
      {user ? <Dashboard email={user.email ?? ""} /> : <AuthForms />}
    </div>
  );
}

function AuthForms() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) return;
    setBusy(true);
    setMsg("");
    try {
      if (mode === "up") {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) setMsg("Account created! Check your email to confirm, then sign in.");
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-center font-display text-3xl font-semibold">
        {mode === "in" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-center text-ink/60">
        {mode === "in" ? "Sign in to see your orders." : "Track orders and leave reviews."}
      </p>
      <form onSubmit={submit} className="card mt-8 space-y-4">
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {msg && <p className="text-sm text-coral">{msg}</p>}
        <button className="btn-primary w-full disabled:opacity-50" disabled={busy}>
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        {mode === "in" ? "New here?" : "Already have an account?"}{" "}
        <button className="font-semibold text-coral underline" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(""); }}>
          {mode === "in" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function Dashboard({ email }: { email: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    sb.from("orders")
      .select("id, created_at, status, product_name, price, discount, payment")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, []);

  async function signOut() {
    await getBrowserSupabase()?.auth.signOut();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">My account</span>
          <h1 className="mt-2 font-display text-3xl font-semibold">Hi, {email.split("@")[0]} 👋</h1>
        </div>
        <button onClick={signOut} className="btn-outline text-sm">Sign out</button>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Your orders</h2>
      {orders === null ? (
        <p className="mt-4 text-ink/50">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="card mt-4">
          <p className="text-ink/60">No orders yet.</p>
          <Link href="/create" className="btn-primary mt-4">Design your first book</Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display font-semibold">{o.product_name}</div>
                <div className="text-sm text-ink/55">
                  {new Date(o.created_at).toLocaleDateString()} · #{o.id.slice(0, 8)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="tag bg-sunny px-2 py-0.5 text-xs">{o.status}</span>
                <span className="font-display font-semibold">{formatPrice(o.price - (o.discount || 0))}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReviewForm hasOrders={(orders?.length ?? 0) > 0} email={email} />
    </div>
  );
}

function ReviewForm({ hasOrders, email }: { hasOrders: boolean; email: string }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) return;
    setBusy(true);
    setMsg("");
    try {
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: session?.access_token,
          rating,
          body,
          customer_name: name || email.split("@")[0],
        }),
      });
      if (!res.ok) throw new Error("Could not submit review.");
      setDone(true);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-12">
      <h2 className="font-display text-xl font-semibold">Leave a review</h2>
      {!hasOrders ? (
        <p className="mt-2 text-ink/55">You can leave a review once you've placed your first order.</p>
      ) : done ? (
        <div className="card mt-4 bg-teal">
          <p className="font-display font-semibold">Thank you for your review! 💛</p>
          <p className="mt-1 text-sm text-ink/70">It'll appear on the site once approved.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="card mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold">Rating</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} className="text-2xl leading-none">
                {n <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
          <input className="input" placeholder="Display name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="input min-h-24" placeholder="How was your Scrapjoy book?" value={body} onChange={(e) => setBody(e.target.value)} required />
          {msg && <p className="text-sm text-coral">{msg}</p>}
          <button className="btn-primary disabled:opacity-50" disabled={busy}>{busy ? "Sending…" : "Submit review"}</button>
        </form>
      )}
    </div>
  );
}
