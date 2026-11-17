/**
 * Snapshot whether drain-only can stop: no active pipeline jobs and no
 * operator-retryable failed/MR infra jobs.
 */
import {
  readJobs,
  listOperatorRetryJobs,
  isOperatorRetryError,
} from "./agent-jobs.mjs";
import { isDrainOnly } from "./drain-mode.mjs";

const ACTIVE = new Set([
  "claimed",
  "researching",
  "building",
  "qa",
  "ready",
  "blessing",
  "merging",
]);

const data = readJobs();
const jobs = data.jobs || [];
const active = jobs.filter((j) => ACTIVE.has(j.status));
const retryable = listOperatorRetryJobs(data);
const contentParks = jobs.filter((j) => {
  if (j.status !== "failed" || j.resolution) return false;
  const err = j.lastError || j.manualReviewReason || j.flagReason;
  return !isOperatorRetryError(err);
});
const exhaustedInfra = jobs.filter((j) => {
  if (j.status !== "failed" || j.resolution) return false;
  const err = j.lastError || j.manualReviewReason || j.flagReason;
  if (!isOperatorRetryError(err)) return false;
  const retrySet = new Set(retryable.map((r) => r.id));
  return !retrySet.has(j.id);
});

const payload = {
  drainOnly: isDrainOnly(),
  drained: active.length === 0 && retryable.length === 0,
  active: active.length,
  retryable: retryable.length,
  contentParks: contentParks.length,
  exhaustedInfra: exhaustedInfra.length,
  activeJobs: active.map((j) => ({
    id: j.id,
    slug: j.slug,
    status: j.status,
    workerId: j.workerId || null,
    title: j.title || null,
  })),
  retryableJobs: retryable.map((j) => ({
    id: j.id,
    slug: j.slug,
    lastError: j.lastError || j.manualReviewReason || null,
    operatorRequeues: Number(j.operatorRequeues) || 0,
  })),
  leftoverParks: contentParks.map((j) => ({
    id: j.id,
    slug: j.slug,
    lastError: j.lastError || j.manualReviewReason || j.flagReason || null,
    operatorRequeues: Number(j.operatorRequeues) || 0,
    recoveryExhausted: Boolean(j.recoveryExhausted),
    manualReview: Boolean(j.manualReview),
  })),
  exhaustedInfraParks: exhaustedInfra.map((j) => ({
    id: j.id,
    slug: j.slug,
    lastError: j.lastError || j.manualReviewReason || j.flagReason || null,
    operatorRequeues: Number(j.operatorRequeues) || 0,
    recoveryExhausted: Boolean(j.recoveryExhausted),
  })),
};

console.log(JSON.stringify(payload, null, 2));
