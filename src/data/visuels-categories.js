export const visuelsCategorie = {
  "Concert": { emoji: "🎸", c1: "#c7d2fe", c2: "#a5b4fc" },
  "Festival": { emoji: "🎉", c1: "#e9d5ff", c2: "#d8b4fe" },
  "Culture": { emoji: "🏛️", c1: "#bfdbfe", c2: "#93c5fd" },
  "Exposition": { emoji: "🖼️", c1: "#99f6e4", c2: "#5eead4" },
  "Atelier": { emoji: "🏺", c1: "#fbcfe8", c2: "#f9a8d4" },
  "Sport": { emoji: "⚽", c1: "#bbf7d0", c2: "#86efac" },
  "Marché": { emoji: "🥕", c1: "#fed7aa", c2: "#fdba74" },
  "Vide-Grenier": { emoji: "🧺", c1: "#fde68a", c2: "#fcd34d" },
  "Spectacle": { emoji: "🎭", c1: "#fecdd3", c2: "#fda4af" },
  "Conférence": { emoji: "🎤", c1: "#e2e8f0", c2: "#cbd5e1" },
  "Autre": { emoji: "✨", c1: "#e5e7eb", c2: "#d1d5db" },
};

export function visuelPour(categorie) {
  return visuelsCategorie[categorie] || visuelsCategorie["Autre"];
}
