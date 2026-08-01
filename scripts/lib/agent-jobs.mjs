/**
 * Shared job queue for 5-agent parallel production (orchestrator + 4 workers).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(
  process.env.BLOG_REPO_ROOT || path.resolve(__dirname, "../.."),
);
export const JOBS_FILE = path.join(REPO_ROOT, "artifacts", "agent-jobs.json");
export const LOCKS_DIR = path.join(REPO_ROOT, "artifacts", "locks");
export const WORKTREE_ROOT =
  process.env.BLOG_WORKTREE_ROOT ||
  path.resolve(REPO_ROOT, "..", "data-insights-blog-worktrees");
export const PRODUCTION_WORKER_COUNT = 4;
/** Dedicated recovery agent slot (Worker 5) — retries Failed-before-merge jobs only. */
export const RECOVERY_WORKER_ID = "5";
export const WORKER_COUNT = 5;
export const RECOVERY_MAX_ATTEMPTS = Number(process.env.BLOG_RECOVERY_MAX_ATTEMPTS || 2);
/**
 * Producer auto-reruns after Cursor transport/silence kill.
 * Default 0: fail once → special `manualReview` flag, refuse further auto-rerun.
 * Set BLOG_TRANSPORT_REQUEUE_MAX>0 only if you want automatic retries again.
 */
export const TRANSPORT_REQUEUE_MAX = Number(process.env.BLOG_TRANSPORT_REQUEUE_MAX || 0);

/**
 * Failures caused by agent/process/infra — not a bad topic.
 * These must NOT permanently theme-block the lane (that starved producers).
 */
export const INFRA_FAILURE_ERRORS = new Set([
  "transport_kill",
  "silence_kill",
  "worker_process_gone",
  "worktree_prepare_failed",
  "deferred_for_recovery_queue",
  "recovery_interrupted",
  "superseded_by_recovery_queue",
  "branch_empty",
  "merge_lock_busy",
  "worker_spawn_failed",
  "dispatch_failed",
]);

/** Transient Cursor CLI / spawn kills that should soft-requeue producers instead of flagging. */
export const SOFT_REQUEUE_ERRORS = new Set([
  "transport_kill",
  "silence_kill",
  "worker_spawn_failed",
  "worker_process_gone",
  "worker_exit_0",
  "worker_exit_-1",
  "dispatch_failed",
]);

export function isInfraFailure(errorCode) {
  const err = String(errorCode || "");
  if (!err) return false;
  if (INFRA_FAILURE_ERRORS.has(err)) return true;
  if (err.startsWith("worker_exit_")) return true;
  if (err.startsWith("stale_")) return true;
  if (err.startsWith("stale_worker_")) return true;
  if (err.startsWith("worker_stale_")) return true;
  return false;
}

export function isSoftRequeueError(errorCode) {
  const err = String(errorCode || "");
  if (SOFT_REQUEUE_ERRORS.has(err)) return true;
  // Orch stamps stale heartbeats as stale_${minutes}m / stale_worker_*
  if (err.startsWith("stale_")) return true;
  if (err.startsWith("stale_worker_")) return true;
  if (err.startsWith("worker_stale_")) return true;
  return false;
}

/**
 * Convert a transport/silence kill into a claimed requeue when budget remains.
 * Returns the patched job, or null if hard-fail / manual-review should proceed.
 * With default TRANSPORT_REQUEUE_MAX=0 this always returns null (fail once → manual review).
 */
export function maybeSoftRequeueTransportKill(job, errorCode) {
  if (!job) return null;
  if (job.recovery) return null; // recovery worker owns its own retry budget
  if (job.manualReview) return null; // already parked — refuse further auto-rerun
  if (!isSoftRequeueError(errorCode)) return null;
  if (TRANSPORT_REQUEUE_MAX <= 0) return null;
  const used = Number(job.transportRequeues) || 0;
  if (used >= TRANSPORT_REQUEUE_MAX) return null;
  const next = used + 1;
  Object.assign(job, {
    status: "claimed",
    workerId: null,
    lastError: null,
    flagged: false,
    flagReason: null,
    flaggedAt: null,
    manualReview: false,
    transportRequeues: next,
    activity: `Requeued after ${errorCode} (requeue ${next}/${TRANSPORT_REQUEUE_MAX}) - awaiting worker`,
    updatedAt: new Date().toISOString(),
    heartbeat: new Date().toISOString(),
  });
  return job;
}

/** Process/infra failure → special flag; auto-rerun refused; dashboard Manual Review bucket. */
export function parkJobForManualReview(job, errorCode, meta = {}) {
  if (!job) return null;
  const err = String(errorCode || job.lastError || "failed");
  const now = new Date().toISOString();
  const phase =
    meta.phase ||
    job.failedAtPhase ||
    inferPhaseFromActivity(job.activity) ||
    "unknown";
  Object.assign(job, {
    status: "failed",
    flagged: true,
    flaggedAt: now,
    flagReason: "manual_review",
    manualReview: true,
    manualReviewAt: now,
    manualReviewReason: err,
    lastError: err,
    failedAtPhase: phase,
    workerId: null,
    activity: `Manual review: process failed once (${err}) — auto-rerun refused`,
    updatedAt: now,
  });
  return job;
}

export function isManualReviewJob(job) {
  return Boolean(job && job.status === "failed" && job.manualReview && !job.resolution);
}

export const JOB_STATUSES = [
  "claimed",
  "researching",
  "building",
  "qa",
  "ready",
  "merging",
  "shipped",
  "failed",
];

export function emptyQueue(runId = null) {
  return {
    version: 1,
    runId,
    updatedAt: new Date().toISOString(),
    orchestrator: {
      status: "idle",
      pid: null,
      heartbeat: null,
      notes: null,
    },
    workers: Object.fromEntries(
      Array.from({ length: WORKER_COUNT }, (_, i) => {
        const id = String(i + 1);
        return [
          id,
          {
            id,
            status: "idle",
            pid: null,
            jobId: null,
            heartbeat: null,
            worktreePath: path.join(WORKTREE_ROOT, `worker-${id}`),
            smokePort: 4180 + i,
            role: id === RECOVERY_WORKER_ID ? "recovery" : "producer",
          },
        ];
      }),
    ),
    jobs: [],
    flags: { blockedStems: [], blockedThemes: [], failures: [] },
  };
}

export function readJobs() {
  try {
    const raw = fs.readFileSync(JOBS_FILE, "utf8").replace(/^\uFEFF/, "");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return emptyQueue();
    if (!data.workers) data.workers = emptyQueue().workers;
    if (!Array.isArray(data.jobs)) data.jobs = [];
    if (!data.orchestrator) data.orchestrator = emptyQueue().orchestrator;
    // Ensure recovery slot exists on older job files
    const defaults = emptyQueue().workers;
    for (const id of Object.keys(defaults)) {
      if (!data.workers[id]) data.workers[id] = { ...defaults[id] };
    }
    for (const w of Object.values(data.workers)) {
      if (!w.worktreePath) w.worktreePath = path.join(WORKTREE_ROOT, `worker-${w.id}`);
      if (!w.smokePort) w.smokePort = 4180 + (Number(w.id) - 1);
      if (!w.role) w.role = String(w.id) === RECOVERY_WORKER_ID ? "recovery" : "producer";
    }
    return data;
  } catch {
    return emptyQueue();
  }
}

export function writeJobs(data) {
  fs.mkdirSync(path.dirname(JOBS_FILE), { recursive: true });
  data.updatedAt = new Date().toISOString();
  const tmp = `${JOBS_FILE}.tmp`;
  const body = `${JSON.stringify(data, null, 2)}\n`;
  let lastErr = null;
  for (let i = 0; i < 8; i++) {
    try {
      fs.writeFileSync(tmp, body, "utf8");
      try {
        fs.renameSync(tmp, JOBS_FILE);
      } catch (err) {
        // Windows: target locked — overwrite in place
        if (err && (err.code === "EPERM" || err.code === "EACCES" || err.code === "EEXIST")) {
          fs.writeFileSync(JOBS_FILE, body, "utf8");
          try {
            fs.unlinkSync(tmp);
          } catch {
            /* ignore */
          }
        } else {
          throw err;
        }
      }
      return data;
    } catch (err) {
      lastErr = err;
      // Windows rename can EPERM when another reader has the file open
      const start = Date.now();
      while (Date.now() - start < 50 + i * 40) {
        /* spin */
      }
    }
  }
  throw lastErr;
}

export function writeWorkerLock(workerId, payload) {
  fs.mkdirSync(LOCKS_DIR, { recursive: true });
  const file = path.join(LOCKS_DIR, `worker-${workerId}.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...payload, updatedAt: new Date().toISOString() }, null, 2)}\n`);
}

export function readWorkerLock(workerId) {
  const file = path.join(LOCKS_DIR, `worker-${workerId}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  } catch {
    return null;
  }
}

export function slugify(title) {
  return String(title || "topic")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

export function activeJobs(data = readJobs()) {
  return data.jobs.filter((j) => !["shipped", "failed"].includes(j.status));
}

/** Normalize slug to a topic family stem (drop year / msXXXX suffixes). */
export function topicStem(slug) {
  return String(slug || "")
    .replace(/-ms[a-z0-9]+$/i, "")
    .replace(/-20\d{2}$/, "")
    .replace(/-research$/, "-research"); // keep -research as part of research stems
}

/**
 * Coarser family key for remints of the same dataset story
 * (e.g. copper-mine-vs-refinery-geography ≈ copper-mine-vs-refinery-concentration).
 */
export function topicFamilyStem(slug) {
  return topicStem(slug)
    .replace(/-research$/, "")
    .replace(
      /-(geography|concentration|intensity|depletion-path|export-dependence|supply-concentration|hosting-burden)$/i,
      "",
    );
}

function ensureFlags(data) {
  if (!data.flags || typeof data.flags !== "object") {
    data.flags = { blockedStems: [], blockedThemes: [], failures: [] };
  }
  if (!Array.isArray(data.flags.blockedStems)) data.flags.blockedStems = [];
  if (!Array.isArray(data.flags.blockedThemes)) data.flags.blockedThemes = [];
  if (!Array.isArray(data.flags.failures)) data.flags.failures = [];
  return data.flags;
}

/**
 * Record a failed job so claim will not keep minting the same topic family.
 * Captures phase-at-failure for the tracker failures sub-table.
 *
 * Infra kills (transport, process gone, stale): block the exact stem only —
 * stops msXXXX remints without freezing the whole theme lane.
 * Content / unknown failures: block stem (+ research twin) and theme.
 */
export function recordJobFailure(data, job, errorCode, meta = {}) {
  const flags = ensureFlags(data);
  const stem = topicStem(job?.slug);
  const themeId = job?.themeId || null;
  const err = String(errorCode || job?.lastError || "failed");
  const infra = isInfraFailure(err);
  const now = new Date().toISOString();
  const phase =
    meta.phase && meta.phase !== "failed"
      ? String(meta.phase)
      : job?.failedAtPhase && job.failedAtPhase !== "failed"
        ? String(job.failedAtPhase)
        : inferPhaseFromActivity(job?.activity) || "unknown";
  const activity = String(meta.activity || job?.activity || "").slice(0, 200);

  // Dedupe rapid double-records for the same jobId+error within a few seconds
  const prev = flags.failures[0];
  if (
    prev &&
    prev.jobId &&
    prev.jobId === job?.id &&
    prev.error === err &&
    Math.abs(Date.parse(prev.at) - Date.parse(now)) < 5000
  ) {
    prev.phase = phase;
    prev.activity = activity || prev.activity;
    prev.workerId = job?.workerId ?? prev.workerId;
    prev.infra = infra;
    return flags;
  }

  flags.failures.unshift({
    at: now,
    jobId: job?.id || null,
    slug: job?.slug || null,
    stem,
    themeId,
    workerId: job?.workerId ?? null,
    phase,
    error: err,
    infra,
    activity: activity || null,
    attempts: job?.attempts ?? null,
  });
  flags.failures = flags.failures.slice(0, 200);

  // Process/infra kills park in Manual Review (no auto-rerun). Still stem-block so
  // claim-next-topics cannot remint the same slug under a new job id every poll.
  const parkManual = infra || isSoftRequeueError(err);

  // Always block exact stem after any unresolved failure (stops msXXXX / year remints).
  if (stem && !flags.blockedStems.includes(stem)) {
    flags.blockedStems.push(stem);
  }

  if (!infra) {
    // Content failure: also block research/bare twin + whole theme.
    if (stem?.endsWith("-research")) {
      const bare = stem.replace(/-research$/, "");
      if (bare && !flags.blockedStems.includes(bare)) flags.blockedStems.push(bare);
    } else if (stem) {
      const research = `${stem}-research`;
      if (!flags.blockedStems.includes(research)) flags.blockedStems.push(research);
    }
    if (themeId && !flags.blockedThemes.includes(themeId)) {
      flags.blockedThemes.push(themeId);
    }
  }
  // Infra / Manual Review: stem-block only (above). Do not theme-block — one
  // transport kill must not freeze an entire lane while a human parks the job.

  if (job) {
    job.status = "failed";
    job.lastError = err;
    job.failedAtPhase = phase;
    if (parkManual) {
      parkJobForManualReview(job, err, { phase });
    } else {
      job.flagged = true;
      job.flaggedAt = now;
      job.flagReason = err;
      job.manualReview = false;
      if (activity) job.activity = activity;
      if (job.recovery) {
        const attempts = job.recoveryAttempts || 1;
        if (attempts >= RECOVERY_MAX_ATTEMPTS) {
          job.recoveryExhausted = true;
          job.activity = `Failed: recovery exhausted (${attempts}/${RECOVERY_MAX_ATTEMPTS}) — ${err}`;
        }
      }
    }
  }
  return flags;
}

function inferPhaseFromActivity(activity) {
  const a = String(activity || "").toLowerCase();
  if (!a) return null;
  if (/merging|merge/.test(a)) return "merging";
  if (/\bqa\b|smoke|deploy gate|build \+ smoke/.test(a)) return "qa";
  if (/building|dashboard|data file|writing/.test(a)) return "building";
  if (/research|starting agent|invoking/.test(a)) return "researching";
  if (/ready|workerready/.test(a)) return "ready";
  if (/claimed/.test(a)) return "claimed";
  return null;
}

export function isStemBlocked(data, stemOrSlug) {
  const flags = ensureFlags(data);
  const stem = topicStem(stemOrSlug);
  if (!stem) return false;
  if (flags.blockedStems.includes(stem)) return true;
  if (flags.blockedStems.includes(`${stem}-research`)) return true;
  if (stem.endsWith("-research") && flags.blockedStems.includes(stem.replace(/-research$/, ""))) {
    return true;
  }
  // Prefix match: blocked "global-remittance-corridors" catches "...-msXYZ"
  return flags.blockedStems.some(
    (b) => stem === b || stem.startsWith(`${b}-`) || b.startsWith(`${stem}-`),
  );
}

export function isThemeBlocked(data, themeId) {
  if (!themeId) return false;
  return ensureFlags(data).blockedThemes.includes(themeId);
}

/** After a successful ship, keep the stem blocked but free the theme for other candidates. */
export function clearThemeBlockOnShip(data, job) {
  const flags = ensureFlags(data);
  const themeId = job?.themeId;
  if (!themeId) return flags;
  flags.blockedThemes = flags.blockedThemes.filter((t) => t !== themeId);
  return flags;
}

/**
 * Recompute blockedStems / blockedThemes from failed jobs using current rules.
 * Clears legacy infra theme-blocks that starved the producer claim queue.
 */
export function rebuildFlagBlocks(data) {
  const flags = ensureFlags(data);
  const stems = new Set();
  const themes = new Set();

  const consider = (slug, themeId, errorCode) => {
    const stem = topicStem(slug);
    const err = String(errorCode || "failed");
    const infra = isInfraFailure(err) || isSoftRequeueError(err);
    if (stem) stems.add(stem);
    if (!infra) {
      if (stem?.endsWith("-research")) {
        const bare = stem.replace(/-research$/, "");
        if (bare) stems.add(bare);
      } else if (stem) {
        stems.add(`${stem}-research`);
      }
      if (themeId) themes.add(themeId);
    }
    // Infra / Manual Review: stem only — theme stays claimable for sibling topics.
  };

  const resolvedJobIds = new Set(
    (data.jobs || []).filter((j) => j.resolution).map((j) => j.id).filter(Boolean),
  );
  const resolvedStems = new Set(
    (data.jobs || [])
      .filter((j) => j.resolution)
      .map((j) => topicStem(j.slug))
      .filter(Boolean),
  );
  // Unresolved failed / Manual Review jobs keep their stems blocked even if an
  // older sibling job for the same stem was marked resolved (abandoned_infra, etc.).
  const unresolvedStems = new Set(
    (data.jobs || [])
      .filter((j) => j.status === "failed" && !j.resolution)
      .map((j) => topicStem(j.slug))
      .filter(Boolean),
  );

  for (const job of data.jobs || []) {
    if (job.resolution) continue; // resolved failures stay out of the block lists
    if (job.status !== "failed" && !job.flagged) continue;
    consider(
      job.slug,
      job.themeId,
      job.lastError || job.manualReviewReason || job.flagReason || "failed",
    );
  }
  for (const row of flags.failures || []) {
    // Do not resurrect blocks from historical failure rows once a job is resolved
    if (row.jobId && resolvedJobIds.has(row.jobId)) continue;
    const rowStem = topicStem(row.slug || row.stem);
    // Keep historical blocks if an unresolved job still owns this stem.
    if (rowStem && resolvedStems.has(rowStem) && !unresolvedStems.has(rowStem)) continue;
    if (row.resolved || row.resolution) continue;
    consider(row.slug, row.themeId, row.error || "failed");
  }

  // Never theme-block themes that still have in-flight work
  const activeThemes = new Set(
    activeJobs(data)
      .map((j) => j.themeId)
      .filter(Boolean),
  );
  for (const t of activeThemes) themes.delete(t);

  // Exhausted infra failures: drop their stems so producers can remint —
  // unless still parked in Manual Review (fail-once park must stick).
  for (const job of data.jobs || []) {
    if (job.resolution) continue;
    if (job.status !== "failed") continue;
    if (job.manualReview) continue;
    if (!job.recoveryExhausted) continue;
    if (!isInfraFailure(job.lastError || job.flagReason || job.manualReviewReason)) continue;
    const stem = topicStem(job.slug);
    if (stem && !unresolvedStems.has(stem)) {
      stems.delete(stem);
      if (stem.endsWith("-research")) {
        stems.delete(stem.replace(/-research$/, ""));
      } else {
        stems.delete(`${stem}-research`);
      }
    }
  }

  // Resolved stems clear only when no unresolved failure remains for that stem.
  for (const stem of resolvedStems) {
    if (unresolvedStems.has(stem)) continue;
    stems.delete(stem);
    if (stem.endsWith("-research")) {
      stems.delete(stem.replace(/-research$/, ""));
    } else {
      stems.delete(`${stem}-research`);
    }
  }

  flags.blockedStems = [...stems].sort();
  flags.blockedThemes = [...themes].sort();
  return flags;
}

/** Seed flags from historical failed jobs (one-time / idempotent), then rebuild blocks. */
export function seedFlagsFromHistory(data) {
  const flags = ensureFlags(data);
  const knownJobIds = new Set(flags.failures.map((f) => f.jobId).filter(Boolean));

  for (const job of data.jobs || []) {
    if (job.status !== "failed") continue;
    if (job.resolution) continue; // do not re-flag resolved jobs
    if (!job.flagged) {
      recordJobFailure(data, job, job.lastError || "failed", {
        phase: job.failedAtPhase || inferPhaseFromActivity(job.activity) || "unknown",
        activity: job.activity,
      });
      continue;
    }
    const stem = topicStem(job.slug);
    if (job.id && !knownJobIds.has(job.id)) {
      recordJobFailure(data, job, job.lastError || job.flagReason || "failed", {
        phase: job.failedAtPhase || inferPhaseFromActivity(job.activity) || "unknown",
        activity: job.activity,
      });
      knownJobIds.add(job.id);
    } else if (job.id) {
      const row = flags.failures.find((f) => f.jobId === job.id);
      if (row && (!row.phase || row.phase === "unknown")) {
        row.phase = job.failedAtPhase || inferPhaseFromActivity(job.activity) || row.phase || "unknown";
        row.activity = row.activity || (job.activity ? String(job.activity).slice(0, 200) : null);
        row.workerId = row.workerId ?? job.workerId ?? null;
        row.attempts = row.attempts ?? job.attempts ?? null;
      }
      if (row) row.infra = isInfraFailure(row.error || job.lastError || job.flagReason);
    }
    // keep stem list consistent before rebuild
    if (stem && !flags.blockedStems.includes(stem)) flags.blockedStems.push(stem);
  }

  rebuildFlagBlocks(data);
  return flags;
}

export function freeWorkers(data = readJobs()) {
  return Object.values(data.workers).filter((w) => {
    if (String(w.id) === RECOVERY_WORKER_ID) return false; // recovery is separate
    if (w.jobId) return false;
    return !w.status || w.status === "idle";
  });
}

export function freeRecoveryWorker(data = readJobs()) {
  const w = data.workers?.[RECOVERY_WORKER_ID];
  if (!w) return null;
  if (w.jobId) return null;
  if (w.status && w.status !== "idle") return null;
  return w;
}

/**
 * Pick a failed-before-merge job eligible for the recovery agent.
 * Prefers jobs closest to done (ready/qa/building) and with a branch tip.
 */
export function listRecoverableFailures(data = readJobs()) {
  const maxAttempts = RECOVERY_MAX_ATTEMPTS;
  const phaseRank = {
    ready: 0,
    qa: 1,
    building: 2,
    researching: 3,
    merging: 4,
    claimed: 5,
    unknown: 6,
  };
  const skipErrors = new Set([
    "superseded_by_recovery_queue",
    "deferred_for_recovery_queue",
  ]);
  return (data.jobs || [])
    .filter((j) => j.status === "failed")
    .filter((j) => !j.resolution)
    .filter((j) => !j.manualReview) // fail-once manual review: refuse auto recovery rerun
    .filter((j) => !j.recoveryExhausted)
    .filter((j) => (j.recoveryAttempts || 0) < maxAttempts)
    .filter((j) => j.slug)
    .filter((j) => !skipErrors.has(String(j.lastError || j.flagReason || "")))
    .map((j) => {
      const phase = j.failedAtPhase || "unknown";
      return {
        job: j,
        phase,
        rank: phaseRank[phase] ?? 9,
        attempts: j.recoveryAttempts || 0,
      };
    })
    .sort((a, b) => a.rank - b.rank || a.attempts - b.attempts || String(a.job.updatedAt).localeCompare(String(b.job.updatedAt)))
    .map((x) => x.job);
}

/** Re-open a failed job for the recovery worker (does not mint a new slug). */
export function reopenJobForRecovery(data, jobId) {
  const job = findJob(data, jobId);
  if (!job || job.status !== "failed") return null;
  const attempts = (job.recoveryAttempts || 0) + 1;
  const now = new Date().toISOString();
  // Keep the first producer branch tip across recovery retries.
  // Never promote *-w5-recovery aliases — recovery reuses the canonical producer branch.
  if (!job.recoverySourceBranch && job.branch && !String(job.branch).includes("-w5-recovery")) {
    job.recoverySourceBranch = job.branch;
  }
  const canonical =
    job.recoverySourceBranch ||
    (job.branch && !String(job.branch).includes("-w5-recovery") ? job.branch : null);
  Object.assign(job, {
    status: "claimed",
    workerId: null,
    recovery: true,
    recoveryAttempts: attempts,
    flagged: false,
    flagReason: null,
    flaggedAt: null,
    manualReview: false,
    manualReviewAt: null,
    manualReviewReason: null,
    resolution: null,
    lastError: null,
    branch: canonical || job.branch,
    activity: `Recovery attempt ${attempts}/${RECOVERY_MAX_ATTEMPTS} — finishing failed pre-merge job`,
    heartbeat: now,
    updatedAt: now,
    startedAt: null,
  });
  return job;
}

/** Claimed jobs not yet assigned to a worker (waiting for dispatch). */
export function unassignedClaimedJobs(data = readJobs()) {
  return data.jobs.filter(
    (j) => j.status === "claimed" && !j.workerId && !j.recovery,
  );
}

export function findJob(data, jobId) {
  return data.jobs.find((j) => j.id === jobId) || null;
}

export function updateJob(data, jobId, patch) {
  const job = findJob(data, jobId);
  if (!job) return null;
  Object.assign(job, patch, { updatedAt: new Date().toISOString() });
  return job;
}

export function touchOrchestrator(notes, pid = process.pid) {
  const data = readJobs();
  data.orchestrator = {
    status: "running",
    pid,
    heartbeat: new Date().toISOString(),
    notes: notes || data.orchestrator?.notes || null,
  };
  return writeJobs(data);
}

export function listDashboardAgents(data = readJobs()) {
  const agents = [];
  const orch = data.orchestrator || {};
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];
  const pending = jobs.filter((j) =>
    ["claimed", "researching", "building", "qa", "ready"].includes(j.status),
  );
  const claimedWaiting = jobs.filter((j) => j.status === "claimed" && !j.workerId);
  const busyWorkers = Object.values(data.workers || {}).filter(
    (w) => w.status === "busy" || w.jobId,
  ).length;

  let orchActivity = orch.notes;
  if (!orchActivity) {
    if (orch.status === "running") {
      orchActivity =
        claimedWaiting.length > 0
          ? `Dispatching ${claimedWaiting.length} claimed job(s) | ${busyWorkers}/4 workers busy`
          : pending.length > 0
            ? `Monitoring ${pending.length} in-flight job(s) | ${busyWorkers}/4 busy`
            : "Idle - waiting to claim next topics";
    } else {
      orchActivity =
        pending.length > 0
          ? `Offline | ${pending.length} job(s) queued (resume automation)`
          : "Offline - start orchestrator to schedule workers";
    }
  }

  agents.push({
    id: "orchestrator",
    role: "Orchestrator",
    kind: "orchestrator",
    pid: orch.pid || null,
    state: orch.status === "running" ? "active" : orch.status || "idle",
    statusLabel: orch.notes || orch.status || "Idle",
    activity: orchActivity,
    attemptsLabel: "1x",
    runningForLabel: null,
    jobId: null,
    runId: data.runId || null,
  });

  for (const w of Object.values(data.workers || {})) {
    const job = w.jobId ? findJob(data, w.jobId) : null;
    const alive = w.pid != null;
    let activity = job?.activity || null;
    if (!activity) {
      if (job) activity = `${job.status}: ${job.slug}`;
      else if (alive && w.status === "busy") activity = "Busy - no job linked yet";
      else if (alive) activity = "Idle - waiting for job assignment";
      else activity = "Slot empty - worker not started";
    }
    agents.push({
      id: `worker-${w.id}`,
      role: String(w.id) === RECOVERY_WORKER_ID ? "Recovery" : `Worker ${w.id}`,
      kind: String(w.id) === RECOVERY_WORKER_ID ? "recovery-slot" : "worker-slot",
      pid: w.pid || null,
      state:
        w.status === "busy" || job
          ? job?.status === "qa"
            ? "busy"
            : "active"
          : "idle",
      statusLabel: job
        ? `${job.recovery ? "recovery/" : ""}${job.status}: ${job.slug}`
        : String(w.id) === RECOVERY_WORKER_ID
          ? "idle: recovery"
          : w.status || "idle",
      activity,
      attemptsLabel: job
        ? job.recovery
          ? `R${job.recoveryAttempts || 1}/${RECOVERY_MAX_ATTEMPTS}`
          : `${job.attempts || 1}x`
        : "—",
      runningForLabel: null,
      jobId: w.jobId || null,
      slug: job?.slug || null,
      themeId: job?.themeId || null,
      worktreePath: w.worktreePath,
      smokePort: w.smokePort,
      runId: data.runId || null,
      startedAt: job?.startedAt || null,
      recovery: Boolean(job?.recovery) || String(w.id) === RECOVERY_WORKER_ID,
    });
  }
  return agents;
}

/**
 * Content failures that still need recovery attention (excludes Manual Review).
 * Process/infra fail-once jobs live in {@link listManualReview} instead.
 */
export function listOpenIssues(data = readJobs()) {
  return (data.jobs || [])
    .filter((j) => j.status === "failed" && !j.resolution && !j.manualReview)
    .map((j) => {
      const err = String(j.lastError || j.flagReason || "failed");
      return {
        id: j.id,
        slug: j.slug,
        themeId: j.themeId || null,
        workerId: j.workerId ?? null,
        phase: j.failedAtPhase || inferPhaseFromActivity(j.activity) || "unknown",
        error: err,
        infra: isInfraFailure(err),
        severity: isInfraFailure(err) ? "warn" : "critical",
        flagged: !!j.flagged,
        manualReview: false,
        recoveryExhausted: !!j.recoveryExhausted,
        recoveryAttempts: j.recoveryAttempts || 0,
        activity: j.activity || null,
        at: j.flaggedAt || j.updatedAt || j.heartbeat || null,
        branch: j.branch || null,
      };
    })
    .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
}

/** Process failures parked after one fail — auto-rerun refused; human decides. */
export function listManualReview(data = readJobs()) {
  return (data.jobs || [])
    .filter((j) => isManualReviewJob(j))
    .map((j) => {
      const err = String(j.manualReviewReason || j.lastError || j.flagReason || "failed");
      return {
        id: j.id,
        slug: j.slug,
        themeId: j.themeId || null,
        workerId: j.workerId ?? null,
        phase: j.failedAtPhase || inferPhaseFromActivity(j.activity) || "unknown",
        error: err,
        flag: "manual_review",
        infra: true,
        severity: "manual",
        flagged: true,
        manualReview: true,
        activity: j.activity || null,
        at: j.manualReviewAt || j.flaggedAt || j.updatedAt || null,
        branch: j.branch || null,
      };
    })
    .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
}

/**
 * Collapse duplicate Manual Review rows for the same slug (remint storm cleanup).
 * Keeps the newest unresolved park; marks older ones superseded_duplicate.
 * @returns {number} count of jobs superseded
 */
export function collapseDuplicateManualReview(data = readJobs()) {
  const bySlug = new Map();
  for (const j of data.jobs || []) {
    if (!isManualReviewJob(j) || !j.slug) continue;
    const list = bySlug.get(j.slug) || [];
    list.push(j);
    bySlug.set(j.slug, list);
  }
  const now = new Date().toISOString();
  let n = 0;
  for (const [, list] of bySlug) {
    if (list.length < 2) continue;
    list.sort((a, b) =>
      String(b.updatedAt || b.manualReviewAt || "").localeCompare(
        String(a.updatedAt || a.manualReviewAt || ""),
      ),
    );
    const keep = list[0];
    for (const j of list.slice(1)) {
      j.resolution = "superseded_duplicate";
      j.resolvedAt = now;
      j.activity = `Superseded duplicate of ${keep.id} (remint collapse)`;
      j.updatedAt = now;
      n++;
    }
  }
  if (n > 0) rebuildFlagBlocks(data);
  return n;
}

/**
 * Live system health for the agent dashboard.
 * @param {object} [opts]
 * @param {object|null} [opts.lock] blog-production-lock.json
 * @param {object|null} [opts.pids] { orchestratorAlive, productionAlive, ... }
 * @param {boolean} [opts.mergeLockPresent]
 * @param {number|null} [opts.mergeLockAgeMin]
 */
export function computeSystemHealth(data = readJobs(), opts = {}) {
  const now = Date.now();
  const alerts = [];
  const push = (severity, code, message, extra = {}) => {
    alerts.push({ severity, code, message, ...extra, at: new Date(now).toISOString() });
  };

  const openIssues = listOpenIssues(data);
  const manualReview = listManualReview(data);
  const flags = ensureFlags(data);
  const active = activeJobs(data);

  // --- Lock / orchestrator ---
  const lock = opts.lock || null;
  let lockAgeMin = null;
  if (lock?.lastHeartbeat) {
    const age = (now - Date.parse(lock.lastHeartbeat)) / 60000;
    if (Number.isFinite(age)) lockAgeMin = Math.round(age * 10) / 10;
  }
  if (lock?.status === "running" && lockAgeMin != null && lockAgeMin > 20) {
    push(
      "critical",
      "orch_heartbeat_stale",
      `Orchestrator lock heartbeat is ${lockAgeMin}m old — automation may be wedged`,
      { lockAgeMin },
    );
  } else if (lock?.status === "running" && lockAgeMin != null && lockAgeMin > 10) {
    push(
      "warn",
      "orch_heartbeat_slow",
      `Orchestrator heartbeat ${lockAgeMin}m old`,
      { lockAgeMin },
    );
  } else if (!lock || lock.status === "idle") {
    if (opts.pids?.orchestratorAlive) {
      push("warn", "orch_lock_idle", "Orchestrator process alive but production lock is idle");
    } else {
      push(
        "info",
        "orch_idle",
        "Conveyor idle — no active production lock (start automation to resume)",
      );
    }
  }

  if (opts.pids && opts.pids.orchestratorAlive === false && lock?.status === "running") {
    push(
      "critical",
      "orch_pid_dead",
      "Production lock says running but orchestrator PID is not alive",
    );
  }

  if (opts.mergeLockPresent) {
    const age = opts.mergeLockAgeMin;
    if (age != null && age > 15) {
      push(
        "critical",
        "merge_lock_stuck",
        `Merge lock held for ${age}m — ships may be blocked`,
        { mergeLockAgeMin: age },
      );
    } else if (age != null && age > 5) {
      push("warn", "merge_lock_held", `Merge lock held for ${age}m`, { mergeLockAgeMin: age });
    }
  }

  // --- Stuck active jobs ---
  for (const j of active) {
    const hb = j.heartbeat || j.updatedAt;
    if (!hb) continue;
    const ageMin = (now - Date.parse(hb)) / 60000;
    if (!Number.isFinite(ageMin)) continue;
    if (["researching", "building", "qa", "merging"].includes(j.status) && ageMin > 45) {
      push(
        "critical",
        "job_stuck",
        `${j.slug} stuck in ${j.status} for ${Math.round(ageMin)}m`,
        { jobId: j.id, slug: j.slug, phase: j.status, ageMin: Math.round(ageMin) },
      );
    } else if (j.status === "ready" && ageMin > 30) {
      push(
        "warn",
        "ready_unmerged",
        `${j.slug} ready but unmerged for ${Math.round(ageMin)}m`,
        { jobId: j.id, slug: j.slug, ageMin: Math.round(ageMin) },
      );
    } else if (j.status === "claimed" && ageMin > 20) {
      push(
        "warn",
        "claim_undispatched",
        `${j.slug} claimed but not started for ${Math.round(ageMin)}m`,
        { jobId: j.id, slug: j.slug, ageMin: Math.round(ageMin) },
      );
    }
  }

  // --- Worker slot health ---
  for (const w of Object.values(data.workers || {})) {
    if (w.status !== "busy") continue;
    const ageMin = w.heartbeat
      ? (now - Date.parse(w.heartbeat)) / 60000
      : null;
    if (ageMin != null && Number.isFinite(ageMin) && ageMin > 25) {
      push(
        "critical",
        "worker_heartbeat_stale",
        `Worker ${w.id} busy but heartbeat ${Math.round(ageMin)}m old`,
        { workerId: w.id, jobId: w.jobId, ageMin: Math.round(ageMin) },
      );
    }
  }

  // --- Open failure pressure ---
  const criticalOpen = openIssues.filter((i) => i.severity === "critical");
  const warnOpen = openIssues.filter((i) => i.severity === "warn");
  if (criticalOpen.length) {
    push(
      "critical",
      "open_content_failures",
      `${criticalOpen.length} open content failure(s) need recovery or resolution`,
      { count: criticalOpen.length, slugs: criticalOpen.slice(0, 5).map((i) => i.slug) },
    );
  }
  if (warnOpen.length >= 1) {
    push(
      "warn",
      "open_infra_failures",
      `${warnOpen.length} open infra failure(s) (transport/worktree/process)`,
      { count: warnOpen.length, slugs: warnOpen.slice(0, 5).map((i) => i.slug) },
    );
  }
  if (manualReview.length >= 1) {
    push(
      "warn",
      "manual_review_queue",
      `${manualReview.length} job(s) in Manual Review (failed once — auto-rerun refused)`,
      { count: manualReview.length, slugs: manualReview.slice(0, 5).map((i) => i.slug) },
    );
  }

  // Recent worktree prepare storm
  const recent = (flags.failures || []).filter((f) => {
    const t = Date.parse(f.at);
    return Number.isFinite(t) && now - t < 60 * 60 * 1000;
  });
  const wtFails = recent.filter((f) => /worktree_prepare/i.test(f.error || ""));
  if (wtFails.length >= 3) {
    push(
      "critical",
      "worktree_prepare_storm",
      `${wtFails.length} worktree_prepare_failed in the last hour`,
      { count: wtFails.length },
    );
  }
  const transportFails = recent.filter((f) =>
    /transport_kill|worker_process_gone|silence_kill/i.test(f.error || ""),
  );
  if (transportFails.length >= 5) {
    push(
      "warn",
      "agent_churn",
      `${transportFails.length} agent transport/process kills in the last hour`,
      { count: transportFails.length },
    );
  }

  // Idle producers while open recoverable work exists
  const freeProducers = Object.values(data.workers || {}).filter(
    (w) => String(w.id) !== RECOVERY_WORKER_ID && w.status === "idle",
  ).length;
  const recoverable = listRecoverableFailures(data).length;
  if (recoverable > 0) {
    const rec = data.workers?.[RECOVERY_WORKER_ID];
    if (rec?.status === "idle") {
      push(
        "warn",
        "recovery_idle_with_queue",
        `Recovery worker idle but ${recoverable} recoverable failure(s) waiting`,
        { count: recoverable },
      );
    }
  }

  if (flags.blockedStems.length > 8) {
    push(
      "warn",
      "stem_block_pressure",
      `${flags.blockedStems.length} stems blocked — claim queue may starve`,
      { count: flags.blockedStems.length },
    );
  }
  if (flags.blockedThemes.length > 4) {
    push(
      "warn",
      "theme_block_pressure",
      `${flags.blockedThemes.length} themes blocked`,
      { count: flags.blockedThemes.length, themes: flags.blockedThemes.slice(0, 6) },
    );
  }

  // Unflagged failures (should not happen — backfill signal)
  const unflagged = (data.jobs || []).filter(
    (j) => j.status === "failed" && !j.resolution && !j.flagged,
  );
  if (unflagged.length) {
    push(
      "warn",
      "unflagged_failures",
      `${unflagged.length} failed job(s) are not flagged — dashboard may have missed them`,
      { count: unflagged.length, slugs: unflagged.slice(0, 5).map((j) => j.slug) },
    );
  }

  const severityRank = { critical: 0, warn: 1, info: 2 };
  alerts.sort(
    (a, b) =>
      (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9) ||
      String(a.code).localeCompare(String(b.code)),
  );

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warnCount = alerts.filter((a) => a.severity === "warn").length;

  return {
    at: new Date(now).toISOString(),
    ok: criticalCount === 0,
    summary:
      criticalCount || warnCount
        ? `${criticalCount} critical · ${warnCount} warn · ${openIssues.length} open · ${manualReview.length} manual review`
        : `healthy · ${openIssues.length} open · ${manualReview.length} manual review · ${active.length} active`,
    criticalCount,
    warnCount,
    alerts,
    openIssues,
    manualReview,
    counts: {
      active: active.length,
      openIssues: openIssues.length,
      openCritical: criticalOpen.length,
      openInfra: warnOpen.length,
      manualReview: manualReview.length,
      blockedStems: flags.blockedStems.length,
      blockedThemes: flags.blockedThemes.length,
      failureLog: flags.failures.length,
      freeProducers,
      recoverable,
    },
    lockAgeMin,
  };
}

/** Ensure every failed job without resolution is flagged (dashboard visibility). */
export function ensureFailuresFlagged(data = readJobs()) {
  let n = 0;
  for (const job of data.jobs || []) {
    if (job.status !== "failed" || job.resolution) continue;
    if (job.flagged) continue;
    recordJobFailure(data, job, job.lastError || job.flagReason || "failed", {
      phase: job.failedAtPhase || inferPhaseFromActivity(job.activity) || "unknown",
      activity: job.activity,
    });
    n++;
  }
  return n;
}
