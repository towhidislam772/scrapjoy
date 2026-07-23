import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Terms & Privacy — ${brand.name}`,
  description: `Terms of service, payment, delivery, and privacy for ${brand.name}.`,
};

export default function TermsPage() {
  return (
    <div className="container-x max-w-3xl py-16">
      <h1 className="font-display text-4xl font-semibold">Terms &amp; Privacy</h1>
      <p className="mt-2 text-ink/55">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-ink/80">
        <Section title="1. About us">
          {brand.name} is a custom photobook service based in {brand.country}. We design and
          print personalised photobooks from photos you provide and deliver them across
          {" "}{brand.country}. Books can cover trips to any country you&apos;ve visited, but
          orders are placed and delivered within {brand.country}.
        </Section>

        <Section title="2. Orders & payment">
          Because every book is made to order, we ask for a <strong>75% advance via bKash</strong>
          {" "}to begin production; the remaining balance is due before delivery. You may also
          pay in full up front. We do not offer Cash on Delivery. Prices are shown in BDT (৳)
          and may change without notice, but the price you paid for a confirmed order is honoured.
        </Section>

        <Section title="3. Design approval">
          We send a digital preview before printing. Your book is only printed after you
          approve it. Once approved and printed, an order cannot be changed.
        </Section>

        <Section title="4. Delivery, returns & reprints">
          We deliver nationwide via trusted couriers. If your book arrives damaged or
          defective, contact us within 3 days with a photo and we&apos;ll reprint and reship
          it free of charge. Because books are personalised, we cannot accept returns for
          reasons other than defects.
        </Section>

        <Section title="5. Your photos & privacy">
          The photos you upload remain <strong>yours</strong>. We use them only to design and
          print your book and never sell or share them. We store order details and photos
          securely and delete photos on request after your order is complete. We collect only
          the information needed to fulfil your order (name, contact, address, photos).
        </Section>

        <Section title="6. Our intellectual property">
          The {brand.name} name, logo, website design, cover templates, and all original
          artwork and content on this site are the property of {brand.name} and are protected
          by copyright and trademark law. You may not copy, reproduce, or reuse our branding,
          designs, or site without written permission.
        </Section>

        <Section title="7. Contact">
          Questions? Email <a className="text-coral underline" href={`mailto:${brand.email}`}>{brand.email}</a>
          {" "}or WhatsApp {brand.whatsapp}.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}
