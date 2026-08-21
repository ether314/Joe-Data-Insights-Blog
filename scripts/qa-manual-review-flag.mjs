#!/usr/bin/env node
/**
 * QA: process fails once → special manual_review flag, auto-rerun refused,
 * job lands in Manual Review bucket (not soft-requeued / not recovery).
 *
 * Usage: node scripts/qa-manual-review-flag.mjs [--migrate]
 */
import {
  TRANSPORT_REQUEUE_MAX,
  maybeSoftRequeueTransportKill,
  isSoftRequeueError,
  isInfraFailure,
  recordJobFailure,
  listOpenIssues,
  listManualReview,
  listRecoverableFailures,
  parkJobForManualReview,
  emptyQueue,
  readJobs,
  writeJobs,
  rebuildFlagBlocks,
  collapseDuplicateManualReview,
  unresolvedManualReviewThemes,
  isStemBlocked,
  isThemeBlocked,
  topicStem,
  OPERATOR_REQUEUE_MAX,
  isOperatorRetryError,
  listOperatorRetryJobs,
  reopenJobForOperatorRetry,
} from "./lib/agent-jobs.mjs";

const migrate = process.argv.includes("--migrate");

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("PASS:", msg);
  }
}

assert(TRANSPORT_REQUEUE_MAX === 0, `TRANSPORT_REQUEUE_MAX defaults to 0 (got ${TRANSPORT_REQUEUE_MAX})`);

const base = {
  id: "job-qa-manual",
  slug: "adaptation-economics-research-2026",
  status: "building",
  recovery: false,
  transportRequeues: 0,
  activity: "Building post",
};

assert(
  maybeSoftRequeueTransportKill({ ...base }, "transport_kill") === null,
  "transport_kill does NOT soft-requeue (auto-rerun refused)",
);
assert(
  maybeSoftRequeueTransportKill({ ...base }, "worker_exit_-1") === null,
  "worker_exit_-1 does NOT soft-requeue",
);
assert(
  maybeSoftRequeueTransportKill({ ...base }, "stale_40m") === null,
  "stale_* does NOT soft-requeue",
);

const data = emptyQueue("qa-manual-review");
const job = { ...base };
data.jobs.push(job);
recordJobFailure(data, job, "worker_process_gone", {
  phase: "qa",
  activity: "Failed: worker process exited without finishing",
});

assert(job.manualReview === true, "infra fail sets manualReview");
assert(job.flagReason === "manual_review", "flagReason is manual_review");
assert(job.flagged === true, "job is flagged");
assert(job.status === "failed", "job status failed");
assert(
  /auto-rerun refused/i.test(job.activity || ""),
  "activity says auto-rerun refused",
);
assert(job.manualReviewReason === "worker_process_gone", "keeps original error on manualReviewReason");

const open = listOpenIssues(data);
const manual = listManualReview(data);
const recoverable = listRecoverableFailures(data);
assert(open.length === 0, "manual-review jobs excluded from open issues");
assert(manual.length === 1 && manual[0].flag === "manual_review", "appears in manual review list");
assert(recoverable.length === 0, "manual-review jobs excluded from recovery queue");

// Content failure still goes to open issues (not manual review)
const content = {
  id: "job-qa-content",
  slug: "some-bad-content-post-2026",
  status: "qa",
  themeId: "chokepoint-commodities",
  activity: "QA failed chart bug",
};
data.jobs.push(content);
recordJobFailure(data, content, "viz_smoke_failed", { phase: "qa" });
assert(!content.manualReview, "content failure is not manualReview");
assert(listOpenIssues(data).some((i) => i.slug === content.slug), "content failure stays in open issues");

// parkJobForManualReview helper
const parked = parkJobForManualReview(
  { id: "p", slug: "x", status: "building" },
  "silence_kill",
);
assert(parked.manualReview && parked.flagReason === "manual_review", "parkJobForManualReview helper");

assert(isSoftRequeueError("transport_kill"), "transport still classified soft-requeueable");
assert(isInfraFailure("worker_exit_0"), "worker_exit_0 is infra");

// Parked infra must stem-block + theme-block so claim cannot remint same slug/theme.
assert(
  isStemBlocked(data, job.slug),
  "manual-review park blocks stem (prevents remint under new job id)",
);
const themed = {
  id: "job-qa-themed-park",
  slug: "global-shipbuilding-gt-delivery-concentration-2026",
  themeId: "heavy-industrial-capacity",
  status: "building",
  activity: "Building",
};
data.jobs.push(themed);
recordJobFailure(data, themed, "worker_spawn_failed", { phase: "claimed" });
rebuildFlagBlocks(data);
assert(themed.manualReview, "worker_spawn_failed parks to manual review");
assert(isStemBlocked(data, themed.slug), "spawn-fail park blocks stem");
assert(
  !isThemeBlocked(data, themed.themeId),
  "spawn-fail park does NOT theme-block (sibling topics still claimable)",
);

// Duplicate remint collapse: keep newest, supersede older
const older = {
  id: "job-qa-dup-old",
  slug: themed.slug,
  themeId: themed.themeId,
  status: "failed",
  manualReview: true,
  flagReason: "manual_review",
  manualReviewReason: "worker_spawn_failed",
  lastError: "worker_spawn_failed",
  updatedAt: "2026-01-01T00:00:00.000Z",
};
data.jobs.push(older);
const collapsed = collapseDuplicateManualReview(data);
assert(collapsed === 1, `collapse supersedes 1 duplicate (got ${collapsed})`);
assert(older.resolution === "superseded_duplicate", "older dup marked superseded_duplicate");
assert(listManualReview(data).filter((i) => i.slug === themed.slug).length === 1, "one MR row per slug after collapse");
assert(
  unresolvedManualReviewThemes(data).has(themed.themeId),
  "unresolved Manual Review theme is listed so claim will not mint siblings",
);

// Resolved abandoned_infra sibling must NOT wipe stem while unresolved MR remains
const abandoned = {
  id: "job-qa-abandoned",
  slug: themed.slug,
  themeId: themed.themeId,
  status: "failed",
  resolution: "abandoned_infra",
  lastError: "worker_spawn_failed",
};
data.jobs.push(abandoned);
rebuildFlagBlocks(data);
assert(
  isStemBlocked(data, topicStem(themed.slug)),
  "resolved abandoned_infra does not clear stem while unresolved MR exists",
);

assert(OPERATOR_REQUEUE_MAX === 2, `OPERATOR_REQUEUE_MAX defaults to 2 (got ${OPERATOR_REQUEUE_MAX})`);
assert(isOperatorRetryError("worker_exit_0"), "worker_exit_0 is operator-retryable");
assert(isOperatorRetryError("transport_kill"), "transport_kill is operator-retryable");
assert(isOperatorRetryError("worker_spawn_failed"), "worker_spawn_failed is operator-retryable");
assert(isOperatorRetryError("cursor_cli_missing"), "cursor_cli_missing is operator-retryable");
assert(!isOperatorRetryError("content_rejected"), "content failures are not operator-retryable");

const retryQueue = emptyQueue("qa-op-retry");
retryQueue.jobs = [
  {
    id: "job-qa-op-retry",
    slug: "bank-commercial-credit-research-2026",
    themeId: "bank-commercial-credit",
    status: "failed",
    manualReview: true,
    lastError: "worker_exit_0",
    manualReviewReason: "worker_exit_0",
    operatorRequeues: 0,
  },
];
const listed = listOperatorRetryJobs(retryQueue);
assert(listed.length === 1, "parked worker_exit_0 is listed for operator retry");
const reopened = reopenJobForOperatorRetry(retryQueue, "job-qa-op-retry");
assert(reopened && reopened.status === "claimed", "operator retry reopens as claimed");
assert(reopened.operatorRequeues === 1, "operator retry increments cap counter");
assert(reopened.manualReview === false, "operator retry clears manualReview");
assert(reopened.recovery === false, "operator retry is a producer job, not W5 recovery");
assert(reopened.previousError === "worker_exit_0", "operator retry persists previousError for stream UI");
reopened.status = "failed";
reopened.lastError = "worker_exit_0";
reopened.manualReviewReason = "worker_exit_0";
reopenJobForOperatorRetry(retryQueue, "job-qa-op-retry");
reopened.status = "failed";
reopened.lastError = "worker_exit_0";
reopened.manualReviewReason = "worker_exit_0";
const third = reopenJobForOperatorRetry(retryQueue, "job-qa-op-retry");
assert(third === null, "operator retry refuses after OPERATOR_REQUEUE_MAX");

if (migrate) {
  const live = readJobs();
  const now = new Date().toISOString();
  let n = 0;
  for (const j of live.jobs || []) {
    if (j.status !== "failed" || j.resolution || j.manualReview) continue;
    const err = String(j.lastError || j.flagReason || "");
    if (!isInfraFailure(err) && !isSoftRequeueError(err)) continue;
    parkJobForManualReview(j, err, {
      phase: j.failedAtPhase,
      activity: j.activity,
    });
    j.updatedAt = now;
    n++;
    console.log(`MIGRATE: ${j.slug} → manual_review (${err})`);
  }
  const dupes = collapseDuplicateManualReview(live);
  rebuildFlagBlocks(live);
  writeJobs(live);
  console.log(`Migrated ${n} infra failure(s) into Manual Review; collapsed ${dupes} duplicate MR row(s)`);
  assert(
    listOpenIssues(live).every((i) => !i.infra || i.severity === "critical"),
    "after migrate, open issues are content-focused",
  );
}

if (failed) {
  console.error(`\n${failed} manual-review QA failure(s)`);
  process.exit(1);
}
console.log("\nAll manual-review flag QA checks passed.");
