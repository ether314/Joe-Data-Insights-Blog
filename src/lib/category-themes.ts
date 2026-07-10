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
    tagline: "Markets, incentives, and capital",
  },
  Technology: {
    gradient: "from-cyan-500 via-blue-600 to-indigo-900",
    glow: "bg-cyan-500/30",
    accent: "#22d3ee",
    tagline: "Infrastructure and digital systems",
  },
};
