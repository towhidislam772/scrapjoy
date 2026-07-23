import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Scrapjoy premium palette — warm, muted, editorial.
        // (Accent keys are kept stable so components/pages don't need rewiring;
        //  the values below are the refined premium tones.)
        coral: "#BC5D43", // terracotta — primary accent
        sunny: "#D8A24A", // ochre / gold
        teal: "#8FA088", // sage
        grape: "#3E5C68", // deep ocean
        sky: "#C9B7AC", // warm sand / taupe
        ink: "#221E1B", // warm near-black
        cream: "#FAF6EF", // ivory background
        sand: "#EFE7DA", // soft neutral surface
        line: "#E5DBCC", // hairline border tone
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px -16px rgba(34,30,27,0.28)",
        "soft-sm": "0 8px 24px -12px rgba(34,30,27,0.22)",
        // kept for backwards-compat; now a subtle premium shadow, not brutalist.
        pop: "0 12px 40px -16px rgba(34,30,27,0.28)",
        "pop-sm": "0 8px 24px -12px rgba(34,30,27,0.22)",
      },
      borderRadius: {
        blob: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
