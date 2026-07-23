// Quick-start presets for the poster cover: destinations & events with a set of
// relevant emoji options each. Picking one fills the cover title and offers its
// emojis as suggested icons. Add/edit freely — this is your content to grow.

export type Preset = { name: string; emojis: string[] };
export type PresetGroup = { id: string; label: string; items: Preset[] };

export const presetGroups: PresetGroup[] = [
  {
    id: "bd",
    label: "🇧🇩 Bangladesh",
    items: [
      { name: "Cox's Bazar", emojis: ["🏖️", "🌊", "🌅", "🦀", "🐚", "⛱️"] },
      { name: "Saint Martin", emojis: ["🏝️", "🥥", "🐚", "🐠", "🌊", "⛵"] },
      { name: "Sundarbans", emojis: ["🐅", "🌳", "🚤", "🐊", "🌿", "🦌"] },
      { name: "Sajek Valley", emojis: ["⛰️", "☁️", "🌄", "🏕️", "🌲"] },
      { name: "Bandarban", emojis: ["⛰️", "🌄", "🏞️", "🌲", "💧"] },
      { name: "Rangamati", emojis: ["🚤", "🏞️", "🌊", "🛶", "🌉"] },
      { name: "Sylhet", emojis: ["🍵", "🏞️", "🌿", "☁️", "💧"] },
      { name: "Srimangal", emojis: ["🍵", "🌿", "🐒", "🌳", "🦋"] },
      { name: "Jaflong", emojis: ["🪨", "🏞️", "💧", "⛰️"] },
      { name: "Kuakata", emojis: ["🏖️", "🌅", "🌊", "⛵"] },
      { name: "Dhaka", emojis: ["🏙️", "🕌", "🛺", "🌆", "🚕"] },
      { name: "Chattogram", emojis: ["🚢", "⚓", "🏙️", "🌊", "🏞️"] },
      { name: "Bagerhat", emojis: ["🕌", "🏛️", "📿"] },
      { name: "Paharpur", emojis: ["🛕", "🏛️", "🧱", "📿"] },
      { name: "Nafakhum", emojis: ["💧", "🏞️", "🌿"] },
      { name: "Rangpur", emojis: ["🌾", "🏛️", "🌳"] },
      { name: "Bogura", emojis: ["🏛️", "🍬", "🧱"] },
      { name: "Cumilla", emojis: ["🛕", "🍥", "🏛️"] },
    ],
  },
  {
    id: "abroad",
    label: "✈️ Abroad",
    items: [
      { name: "Malaysia", emojis: ["🏙️", "🌴", "🗼", "🛍️"] },
      { name: "Thailand", emojis: ["🏖️", "🐘", "🛺", "🌴", "🍜"] },
      { name: "India", emojis: ["🕌", "🛕", "🚂", "🌶️", "🐅"] },
      { name: "Nepal", emojis: ["🏔️", "🙏", "🏞️", "🚩"] },
      { name: "Bhutan", emojis: ["🏔️", "🐉", "🏯", "🙏"] },
      { name: "Dubai", emojis: ["🏙️", "🐫", "🕌", "🌇", "🛍️"] },
      { name: "Saudi Arabia", emojis: ["🕋", "🕌", "📿", "🐫"] },
      { name: "Turkey", emojis: ["🎈", "🕌", "🌇", "☕"] },
      { name: "Maldives", emojis: ["🏝️", "🐠", "🌊", "🥥"] },
      { name: "Singapore", emojis: ["🦁", "🏙️", "🌳", "🎡"] },
      { name: "Indonesia", emojis: ["🌴", "🛕", "🌺", "🌋"] },
      { name: "Egypt", emojis: ["🐫", "🏜️", "🔺", "🧭"] },
    ],
  },
  {
    id: "events",
    label: "🎉 Events",
    items: [
      { name: "Wedding", emojis: ["💍", "💐", "👰", "🤵", "💒", "❤️"] },
      { name: "Gaye Holud", emojis: ["🌼", "💛", "🎶", "🌸"] },
      { name: "Birthday", emojis: ["🎂", "🎈", "🎁", "🥳", "🍰"] },
      { name: "Friendship", emojis: ["🫶", "👯", "🎉", "⭐", "💛"] },
      { name: "Anniversary", emojis: ["💞", "🥂", "🌹", "💐"] },
      { name: "Newborn", emojis: ["👶", "🍼", "🧸", "🐣"] },
      { name: "Graduation", emojis: ["🎓", "📜", "🥳", "📚"] },
      { name: "Eid", emojis: ["🌙", "🕌", "✨", "🕋"] },
      { name: "Honeymoon", emojis: ["💑", "🌴", "❤️", "🥂"] },
      { name: "Family", emojis: ["👨‍👩‍👧‍👦", "🏡", "❤️", "📸"] },
      { name: "Travel Diary", emojis: ["✈️", "🧳", "🗺️", "📸"] },
    ],
  },
];
