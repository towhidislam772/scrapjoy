// A looping, animated preview of the poster covers you can make — three example
// designs cross-fade to show how the cover customises (colour, title, icon).
// Pure CSS animation (see .tut-scene in globals.css); respects reduced-motion.

const scenes = [
  { color: "#F5E1A4", emoji: "🏖️", title: "COX'S BAZAR", sub: "2026", dark: false },
  { color: "#EC6A9C", emoji: "💍", title: "OUR WEDDING", sub: "Dhaka", dark: true },
  { color: "#A9D5E8", emoji: "⛰️", title: "SAJEK", sub: "Trip", dark: false },
];

export function AnimatedTutorial() {
  return (
    <div className="relative mx-auto h-72 w-56">
      {/* soft shadow under the book */}
      <div className="absolute inset-x-6 bottom-1 h-5 rounded-full bg-ink/25 blur-lg" />
      {scenes.map((s, i) => (
        <div key={i} className="tut-scene absolute inset-0" style={{ animationDelay: `${i * 3}s` }}>
          <div className="relative h-full w-full">
            {/* page-stack edge */}
            <div className="absolute right-[-5px] top-1.5 bottom-1.5 w-1.5 rounded-r bg-gradient-to-r from-ink/20 to-ink/5" />
            <div
              className="flex h-full w-full flex-col items-center p-5 text-center shadow-soft ring-1 ring-ink/15"
              style={{ backgroundColor: s.color, borderRadius: "4px 8px 8px 4px" }}
            >
              <div className={`pt-2 font-body text-2xl font-extrabold uppercase leading-none tracking-tight ${s.dark ? "text-cream" : "text-ink"}`}>
                {s.title}
              </div>
              <div className={`mt-1 text-xs font-semibold uppercase tracking-[0.2em] ${s.dark ? "text-cream/80" : "text-ink/70"}`}>
                {s.sub}
              </div>
              <div className="grid flex-1 place-items-center text-6xl">{s.emoji}</div>
            </div>
            {/* spine */}
            <div className="absolute inset-y-0 left-0 w-1.5 rounded-l bg-gradient-to-r from-black/25 to-transparent" />
          </div>
        </div>
      ))}
    </div>
  );
}
