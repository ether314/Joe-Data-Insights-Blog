#!/usr/bin/env node
/**
 * Update weekly reader/subscriber counts for the hidden social outreach desk.
 *
 * Usage:
 *   node scripts/update-social-metrics.mjs --readers 1234 --subs 56 [--pageviews 7890] [--week 2026-09-08] [--notes "..."]
 *
 * Writes src/data/social-metrics.ts. The /ops/social-outreach page picks it up
 * automatically at the next build — no other edits needed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(here, "..", "src", "data", "social-metrics.ts");

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
}

function mondayOf(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = (x.getUTCDay() + 6) % 7; // Mon=0
  x.setUTCDate(x.getUTCDate() - dow);
  return x.toISOString().slice(0, 10);
}

const readers = Number(arg("readers"));
const subs = Number(arg("subs"));
const pageviewsRaw = arg("pageviews");
const week = String(arg("week", mondayOf()));
const notes = String(arg("notes", ""));

if (!Number.isFinite(readers) || readers < 0) {
  console.error("Missing/invalid --readers <n> (GA4 active users, last 7 days).");
  process.exit(1);
}
if (!Number.isFinite(subs) || subs < 0) {
  console.error("Missing/invalid --subs <n> (newsletter + Linktree headcount).");
  process.exit(1);
}
const pageviews = pageviewsRaw === undefined ? 0 : Number(pageviewsRaw);
if (!Number.isFinite(pageviews) || pageviews < 0) {
  console.error("Invalid --pageviews <n>.");
  process.exit(1);
}

const now = new Date().toISOString();
const body = `/**
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
  weekOf: ${JSON.stringify(week)},
  weeklyReaders: ${Math.round(readers)},
  subscribers: ${Math.round(subs)},
  weeklyPageviews: ${Math.round(pageviews)},
  notes: ${JSON.stringify(
    notes ||
      "Updated from GA4 weekly pull. Set weeklyReaders from GA4 Active users (7 days) and subscribers from list/Linktree follower count.",
  )},
  source: "manual",
  updatedAt: ${JSON.stringify(now)},
};
`;

fs.writeFileSync(target, body);
console.log(`Wrote ${target}`);
console.log(`week=${week} readers=${Math.round(readers)} subs=${Math.round(subs)} pageviews=${Math.round(pageviews)}`);
