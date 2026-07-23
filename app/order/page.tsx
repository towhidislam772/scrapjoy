import type { Metadata } from "next";
import { Suspense } from "react";
import { brand, brandReady } from "@/lib/brand";
import { OrderForm } from "./OrderForm";

export const metadata: Metadata = {
  title: `Order — ${brand.name}`,
  description: "Place your photobook order and pay easily with bKash.",
};

export default function OrderPage() {
  return (
    <div className="container-x py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Place your order</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/70">
        Fill this in and we'll message you to collect your photos. A 75% advance via bKash
        gets your book started.
      </p>

      {!brandReady && (
        <div className="mt-6 rounded-blob border border-sunny/50 bg-sunny/10 p-4 text-sm">
          🚧 <strong>We&apos;re putting the finishing touches on our store.</strong> Online
          ordering opens very soon — follow us on{" "}
          <a href={brand.instagram} className="underline">Instagram</a> and{" "}
          <a href={brand.facebook} className="underline">Facebook</a> for the launch!
        </div>
      )}
      <Suspense fallback={<p className="mt-10">Loading…</p>}>
        <OrderForm />
      </Suspense>
    </div>
  );
}
