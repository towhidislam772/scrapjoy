"use client";

import { useEffect, useRef, useState } from "react";
import { brand, products, formatPrice, prepaidPercent } from "@/lib/brand";

// A lightweight, self-contained help bot. It answers common questions using ONLY
// the info in this project (no external AI, no API keys, nothing to leak). It
// matches the user's message against a small knowledge base and falls back to
// WhatsApp when it doesn't know.

type Msg = { from: "bot" | "user"; text: string };

const priceList = products.map((p) => `${p.name} (${p.size}) — ${formatPrice(p.price)}`).join("; ");

const KB: { keys: string[]; answer: string }[] = [
  {
    keys: ["price", "cost", "how much", "taka", "৳", "koto", "rate"],
    answer: `Our photobooks: ${priceList}. Delivery charge depends on your city and is confirmed on WhatsApp.`,
  },
  {
    keys: ["pay", "payment", "bkash", "cod", "cash", "advance", "prepaid"],
    answer: `We take a ${prepaidPercent}% advance via bKash to start your book (no Cash on Delivery). The rest is paid before delivery. You can also pay in full up front.`,
  },
  {
    keys: ["deliver", "shipping", "ship", "courier", "how long", "time", "days"],
    answer: `We deliver anywhere in ${brand.country} via couriers (Pathao, Steadfast, RedX, Sundarban). Design takes ~2–3 days; after you approve, printing + delivery is about 4–7 business days.`,
  },
  {
    keys: ["how", "make", "create", "order", "start", "work"],
    answer: `Easy! 1) Pick a size and design your cover, 2) upload your photos, 3) pay a ${prepaidPercent}% bKash advance. We design it, send you a preview to approve, then print & deliver. Start at /create.`,
  },
  {
    keys: ["size", "big", "small", "page", "pages", "dimension"],
    answer: `We offer: ${products.map((p) => `${p.name} — ${p.size}, ${p.pages} pages`).join("; ")}.`,
  },
  {
    keys: ["photo", "picture", "image", "quality", "resolution", "upload", "blurry"],
    answer: "For the sharpest prints, upload your original photos (not screenshots or downloads) — ideally 1500px or larger on the long side. Our builder warns you if a photo is too low-resolution.",
  },
  {
    keys: ["return", "refund", "damage", "damaged", "reprint", "broken"],
    answer: "If your book arrives damaged or defective, send us a photo within 3 days and we'll reprint and reship it free. Since books are personalised, we can't accept returns for other reasons.",
  },
  {
    keys: ["foreign", "abroad", "country", "travel", "outside"],
    answer: `We're based in and deliver within ${brand.country} — but your book can be about a trip to any country you've visited. Just pick the place (or type your own) when designing the cover.`,
  },
  {
    keys: ["occasion", "wedding", "birthday", "gift", "eid", "baby", "anniversary", "event"],
    answer: "Photobooks make perfect gifts for weddings, birthdays, Eid, newborns, anniversaries, friendships and trips. Pick an event in the cover designer for matching colours and icons.",
  },
  {
    keys: ["contact", "whatsapp", "call", "email", "reach", "talk", "human"],
    answer: `You can reach us on WhatsApp ${brand.whatsapp} or email ${brand.email}. Happy to help!`,
  },
];

const QUICK = ["How does it work?", "What are the prices?", "How do I pay?", "Delivery time?"];

function answerFor(text: string): string {
  const q = text.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const item of KB) {
    const score = item.keys.reduce((s, k) => (q.includes(k) ? s + 1 : s), 0);
    if (score > 0 && (!best || score > best.score)) best = { score, answer: item.answer };
  }
  if (best) return best.answer;
  return `I'm not sure about that one 😅 — please message us on WhatsApp ${brand.whatsapp} and a real person will help you.`;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: `Hi! I'm the ${brand.name} helper 📸 Ask me about prices, payment, delivery, or how it works.` },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }, { from: "bot", text: answerFor(t) }]);
    setInput("");
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open help chat"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-coral text-2xl text-cream shadow-soft transition hover:-translate-y-0.5"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft">
          <div className="flex items-center gap-2 border-b border-ink/10 bg-ink px-4 py-3 text-cream">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-coral text-sm">{brand.emoji}</span>
            <span className="font-display font-semibold">{brand.name} Help</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user" ? "bg-coral text-cream" : "bg-sand text-ink"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-ink/15 px-3 py-1 text-xs hover:border-coral">
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-ink/10 p-3"
          >
            <input
              className="input py-2 text-sm"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn-primary shrink-0 px-4 py-2 text-sm" type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
