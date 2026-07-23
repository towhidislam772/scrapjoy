"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  body: string;
  verified: boolean;
};

type Fallback = { quote: string; name: string; city: string };

// Shows real approved reviews from the database. Until any exist (or if the
// backend isn't connected yet), it shows the sample testimonials passed in.
export function Reviews({ fallback }: { fallback: Fallback[] }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => setReviews([]));
  }, []);

  const hasReal = reviews && reviews.length > 0;

  return (
    <div className="mt-14 grid gap-6 md:grid-cols-3">
      {hasReal
        ? reviews!.slice(0, 6).map((r) => (
            <figure key={r.id} className="card flex flex-col">
              <div className="text-lg">{"⭐".repeat(r.rating)}</div>
              <blockquote className="mt-2 flex-1 font-display text-lg italic leading-relaxed text-ink/80">
                {r.body}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-2 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sand font-display font-semibold">
                  {r.customer_name[0]?.toUpperCase()}
                </span>
                <span className="font-semibold text-ink">{r.customer_name}</span>
                {r.verified && (
                  <span className="rounded-full bg-teal/40 px-2 py-0.5 text-xs font-medium">✓ Verified</span>
                )}
              </figcaption>
            </figure>
          ))
        : fallback.map((t, i) => (
            <figure key={i} className="card flex flex-col">
              <span className="font-display text-5xl leading-none text-coral/30">“</span>
              <blockquote className="-mt-3 flex-1 font-display text-lg italic leading-relaxed text-ink/80">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sand font-display text-sm font-semibold">
                  {t.name[0]}
                </span>
                <span className="text-sm text-ink/60">
                  <span className="font-semibold text-ink">{t.name}</span> · {t.city}
                </span>
              </figcaption>
            </figure>
          ))}
    </div>
  );
}
