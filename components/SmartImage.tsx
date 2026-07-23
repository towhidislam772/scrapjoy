"use client";

import { useState } from "react";

// A resilient image: shows the photo if it loads, and a tasteful gradient
// placeholder (never a broken-image icon) if the URL ever fails. This keeps the
// site looking polished even while you're still swapping in your own photos.
export function SmartImage({
  src,
  alt = "",
  className = "",
  fallbackClass = "bg-gradient-to-br from-sand to-sky",
}: {
  src?: string;
  alt?: string;
  className?: string;
  fallbackClass?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`${className} ${fallbackClass} grid place-items-center text-2xl text-ink/25`}>
        📷
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
