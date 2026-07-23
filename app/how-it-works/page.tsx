import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { AnimatedTutorial } from "@/components/AnimatedTutorial";

export const metadata: Metadata = {
  title: `How it works — ${brand.name}`,
  description: "Making a photobook with Scrapjoy takes three simple steps.",
};

const steps = [
  {
    n: "1",
    title: "Choose your book",
    body: "Pick a size and page count, then pay a 75% advance via bKash to get started.",
    icon: "📚",
    color: "bg-sunny",
  },
  {
    n: "2",
    title: "Share your photos",
    body: "After ordering, upload your photos or send them to us on WhatsApp. Send as many as you like — we'll pick the best layout.",
    icon: "📲",
    color: "bg-teal",
  },
  {
    n: "3",
    title: "We design it for you",
    body: "Our designers arrange your photos into a beautiful book and send you a preview to approve. Free tweaks until you love it.",
    icon: "🎨",
    color: "bg-coral",
  },
  {
    n: "4",
    title: "Printed & delivered",
    body: "Once you approve and clear the balance, we print your book and ship it anywhere in Bangladesh.",
    icon: "🚚",
    color: "bg-grape",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container-x py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">How it works</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/70">
        No design skills needed. You send the memories, we do the rest.
      </p>

      <div className="mt-10 grid items-center gap-8 rounded-blob border border-ink/10 bg-sand p-8 md:grid-cols-2">
        <AnimatedTutorial />
        <div>
          <span className="eyebrow">Watch how easy it is</span>
          <h2 className="mt-2 font-display text-3xl font-semibold">Design a cover in seconds</h2>
          <p className="mt-2 leading-relaxed text-ink/70">
            Pick a place or event, choose a colour and an icon, add your title — and your
            cover comes to life. Then drop in your photos and we handle the rest.
          </p>
          <Link href="/create" className="btn-primary mt-5">Try the builder</Link>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        {steps.map((s) => (
          <div key={s.n} className="card flex flex-col items-start gap-5 md:flex-row md:items-center">
            <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-4xl ring-1 ring-ink/10 ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold">
                {s.n}. {s.title}
              </h3>
              <p className="mt-1 text-ink/70">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/products" className="btn-primary">Start my book</Link>
        <a href={`mailto:${brand.email}`} className="btn-outline">Ask a question</a>
      </div>
    </div>
  );
}
