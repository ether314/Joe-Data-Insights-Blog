/**
 * Site-level social / audience KPIs for the hidden outreach desk.
 * Update weekly (or after a GA export). New articles do not need edits here —
 * only the headline reader/subscriber counts.
 *
 * Last updated via: node scripts/update-social-metrics.mjs
 */
export interface SocialMetricsWeek {
  /** ISO date for the Monday (or start) of the measured week */
  weekOf: string;
  /** Unique readers / users for the week (GA4 active users is fine) */
  weeklyReaders: number;
  /** Email / newsletter / Linktree followers — whatever you treat as "subscribers" */
  subscribers: number;
  /** Optional: sessions or pageviews if you prefer a different GA metric */
  weeklyPageviews?: number;
  notes?: string;
  source: "manual" | "ga4-export";
  updatedAt: string;
}

/** Current week — replace numbers when you refresh from Analytics. */
export const SOCIAL_METRICS: SocialMetricsWeek = {
  weekOf: "2026-09-08",
  weeklyReaders: 0,
  subscribers: 0,
  weeklyPageviews: 0,
  notes: "Placeholder zeros until first GA4 export.",
  source: "manual",
  updatedAt: "2026-09-15T06:56:51.674Z",
};
