import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { BookBuilder } from "@/components/builder/BookBuilder";

export const metadata: Metadata = {
  title: `Design your book — ${brand.name}`,
  description: "Upload your photos and see exactly how your photobook will look before you order.",
};

export default function CreatePage() {
  return (
    <div className="container-x py-16">
      <span className="tag bg-sunny">🎨 Live preview</span>
      <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Design your book</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/70">
        Add your photos and flip through your book to see how it'll look. Reorder, add
        captions, and pick a size — then order when you're happy.
      </p>
      <BookBuilder />
    </div>
  );
}
