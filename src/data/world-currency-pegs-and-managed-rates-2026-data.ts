/**
 * World currency pegs and managed rates — 2026 dashboard data.
 *
 * Re-exports the upstream IMF AREAER 2023 + 2024 country chapter universe
 * (updated through Sep 2026) and adds a couple of presentation-only
 * helpers (palette, headline counts) used by
 * `WorldCurrencyPegsAndManagedRates2026Dashboard.tsx`.
 *
 * Source data, geometry, and 5y vol series live in
 * `world-currency-pegs-2026-data.ts`; see that file for provenance.
 */

export {
  PEGS,
  WORLD,
  MAP_POINTS,
  MAP_REGIONS,
  EUROZONE,
  EURO_SET,
  MAP_EXTRAS,
  SOURCE_NOTE,
  SOURCES,
  type Peg,
  type Kind,
  type Status,
  type Entity,
  type Vq,
  type MapFeat,
  type MapExtra,
  type MapPoint,
  type MapRegion,
} from "@/data/world-currency-pegs-2026-data";

/** Kind palette — matches the dashboard legend. */
export const KIND_PALETTE: Record<string, string> = {
  Hard: "#3b82f6",
  Soft: "#22d3ee",
  Crawl: "#f97316",
  Dirty: "#d97706",
  Other: "#475569",
};

/** Anchor palette — matches the dashboard legend. */
export const ANCHOR_PALETTE: Record<string, string> = {
  USD: "#3b82f6",
  EUR: "#06b6d4",
  GBP: "#ec4899",
  Basket: "#a855f7",
  ZAR: "#f97316",
  INR: "#f97316",
  SGD: "#f97316",
  HKD: "#f97316",
  AUD: "#f97316",
  CHF: "#f97316",
  NZD: "#f97316",
  DKK: "#06b6d4",
};

/** Display order for kind filter chips. */
export const KIND_ORDER: ReadonlyArray<string> = ["Hard", "Soft", "Crawl", "Dirty", "Other"];

/** Display order for anchor filter chips (USD / EUR dominate). */
export const ANCHOR_ORDER: ReadonlyArray<string> = [
  "USD",
  "EUR",
  "Basket",
  "ZAR",
  "INR",
  "GBP",
  "AUD",
  "SGD",
  "HKD",
  "CHF",
  "NZD",
  "DKK",
];