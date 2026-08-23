import type { Category } from "@/types/post";

export type CategoryTheme = {
  gradient: string;
  glow: string;
  accent: string;
  tagline: string;
};

export const CATEGORY_THEMES: Record<Category, CategoryTheme> = {
  Economics: {
    gradient: "from-emerald-600 via-teal-600 to-cyan-800",
    glow: "bg-emerald-500/30",
    accent: "#34d399",
    tagline: "Growth, trade, and fiscal flows",
  },
  Politics: {
    gradient: "from-rose-600 via-red-700 to-slate-900",
    glow: "bg-rose-500/30",
    accent: "#fb7185",
    tagline: "Power structures and governance",
  },
  Finance: {
    gradient: "from-amber-500 via-orange-600 to-yellow-800",
    glow: "bg-amber-500/30",
    accent: "#fbbf24",
    tagline: "Bank credit and commercial lending",
  },
  Technology: {
    gradient: "from-cyan-500 via-blue-600 to-indigo-900",
    glow: "bg-cyan-500/30",
    accent: "#22d3ee",
    tagline: "Infrastructure and digital systems",
  },
  "Global Systems": {
    gradient: "from-violet-600 via-purple-700 to-slate-900",
    glow: "bg-violet-500/30",
    accent: "#a78bfa",
    tagline: "Chokepoints, fiscal plumbing, and structural flows",
  },
  Energy: {
    gradient: "from-yellow-500 via-amber-600 to-orange-900",
    glow: "bg-amber-400/35",
    accent: "#facc15",
    tagline: "Power grids, fuels, and climate stress",
  },
  Industry: {
    gradient: "from-orange-700 via-slate-700 to-stone-900",
    glow: "bg-orange-500/25",
    accent: "#fb923c",
    tagline: "Factories, fabs, and physical automation",
  },
  "Consumer Finance": {
    gradient: "from-fuchsia-600 via-rose-600 to-indigo-900",
    glow: "bg-fuchsia-500/30",
    accent: "#e879f9",
    tagline: "Household debt, savings, and retail money",
  },
  "Capital Markets": {
    gradient: "from-blue-600 via-indigo-700 to-amber-900",
    glow: "bg-blue-500/30",
    accent: "#60a5fa",
    tagline: "Bonds, ETFs, and corporate capital flows",
  },
  "Health Economics": {
    gradient: "from-teal-500 via-cyan-700 to-slate-900",
    glow: "bg-teal-500/30",
    accent: "#2dd4bf",
    tagline: "Drugs, trials, and the cost of staying alive",
  },
  "Labor & Skills": {
    gradient: "from-lime-500 via-green-700 to-slate-900",
    glow: "bg-lime-500/30",
    accent: "#a3e635",
    tagline: "Wages, unions, and the changing workforce",
  },
  "Real Estate": {
    gradient: "from-amber-600 via-orange-700 to-stone-900",
    glow: "bg-amber-500/30",
    accent: "#f59e0b",
    tagline: "Housing, land use, and the built economy",
  },
  "Food & Agriculture": {
    gradient: "from-green-600 via-emerald-800 to-stone-900",
    glow: "bg-green-500/30",
    accent: "#4ade80",
    tagline: "Crops, herds, and the price of a full plate",
  },
  "Transport & Logistics": {
    gradient: "from-sky-600 via-indigo-800 to-slate-900",
    glow: "bg-sky-500/30",
    accent: "#38bdf8",
    tagline: "Ports, rails, and the cost of moving things",
  },
};
