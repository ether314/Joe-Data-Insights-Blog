#!/usr/bin/env node
/**
 * Update a job / worker slot in artifacts/agent-jobs.json
 *
 * node scripts/update-agent-job.mjs --job <id> --status ready --activity "..."
 * node scripts/update-agent-job.mjs --worker 1 --status busy --pid 123 --job <id>
 * node scripts/update-agent-job.mjs --orchestrator --notes "..." --pid 123 --run-id ...
 */
import {
  REPO_ROOT,
  readJobs,
  writeJobs,
  updateJob,
  writeWorkerLock,
  findJob,
  recordJobFailure,
  clearThemeBlockOnShip,
  maybeSoftRequeueTransportKill,
  isSoftRequeueError,
  TRANSPORT_REQUEUE_MAX,
  topicStem,
} from "./lib/agent-jobs.mjs";
import { deletePostBranchIfSafe } from "./lib/orch-merge.mjs";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const data = readJobs();
const now = new Date().toISOString();

if (args["run-id"]) data.runId = args["run-id"];

if (args.orchestrator) {
  data.orchestrator = {
    status: args.status || "running",
    pid: args.pid ? Number(args.pid) : data.orchestrator?.pid || null,
    heartbeat: now,
    notes: args.notes || args.activity || data.orchestrator?.notes || null,
  };
}

if (args.worker) {
  const id = String(args.worker);
  const w = data.workers[id];
  if (!w) {
    console.error(`Unknown worker ${id}`);
    process.exit(1);
  }

  let clearJob = null;
  if (args.clear) {
    const clearPid = args.pid != null && args.pid !== true ? Number(args.pid) : null;
    clearJob = args.job && args.job !== true && args.job !== "null" ? String(args.job) : null;
    // Ignore stale clears from a previous worker process that finished after a replacement started.
    if (clearPid != null && w.pid != null && clearPid !== w.pid) {
      console.log(
        JSON.stringify({
          skippedClear: true,
          worker: id,
          reason: "pid_mismatch",
          clearPid,
          currentPid: w.pid,
        }),
      );
    } else if (clearJob && w.jobId && clearJob !== w.jobId) {
      console.log(
        JSON.stringify({
          skippedClear: true,
          worker: id,
          reason: "job_mismatch",
          clearJob,
          currentJobId: w.jobId,
        }),
      );
    } else {
      w.status = "idle";
      w.pid = null;
      w.jobId = null;
      w.idleSince = now;
    }
  } else {
    if (args.status) w.status = args.status;
    if (args.pid) w.pid = Number(args.pid);
    if (args.job) w.jobId = args.job === "null" ? null : args.job;
    if (args.status === "busy" || (args.job && args.job !== "null")) {
      w.idleSince = null;
    } else if (args.status === "idle") {
      w.idleSince = now;
    }
  }

  w.heartbeat = now;
  writeWorkerLock(id, {
    workerId: id,
    status: w.status,
    pid: w.pid,
    jobId: w.jobId,
    worktreePath: w.worktreePath,
    smokePort: w.smokePort,
  });

  // Keep job.workerId in sync when a slot is bound - prevents orch from
  // re-assigning the same claimed recovery job in a tight loop.
  if (!args.clear && args.job && args.job !== "null" && args.job !== true) {
    const bound = findJob(data, String(args.job));
    if (bound) {
      bound.workerId = id;
      bound.heartbeat = now;
      bound.updatedAt = now;
      if (
        !bound.activity ||
        /Recovery attempt|claimed|Dispatched/i.test(String(bound.activity))
      ) {
        bound.activity = `Dispatched to worker ${id}`;
      }
    }
  }
  if (args.clear && clearJob) {
    const unbound = findJob(data, clearJob);
    // Only clear job.workerId if it still points at this worker (avoid races)
    if (unbound && String(unbound.workerId) === id && unbound.status === "claimed") {
      // Leave claimed but unbound only when process never started; orch will
      // redispatch. For failed/ready/etc. workerId is handled elsewhere.
    }
  }
}

if (args.job && !args.worker) {
  const existing = findJob(data, args.job);
  const phaseBeforeFail =
    args.status === "failed" && existing
      ? existing.status !== "failed"
        ? existing.status
        : existing.failedAtPhase || null
      : null;
  const activityBeforeFail = existing?.activity || null;

  const patch = { heartbeat: now };
  if (args.status) patch.status = args.status;
  if (args.activity) patch.activity = args.activity;
  if (args.error) patch.lastError = args.error;
  if (args.headline) patch.headlineStat = args.headline;
  if (args.attempts) patch.attempts = Number(args.attempts);
  if (args["worker-id"]) patch.workerId = String(args["worker-id"]);
  if (args.worktree) patch.worktreePath = args.worktree;
  if (args.branch) patch.branch = args.branch;

  // Central soft-requeue: even old worker shells that only know "--status failed
  // --error transport_kill" get requeued here (budget permitting).
  let softRequeued = false;
  if (args.status === "failed" && !args["requeue-transport"]) {
    const err = String(args.error || existing?.lastError || "failed");
    if (isSoftRequeueError(err) && existing && !existing.recovery) {
      const preview = {
        ...existing,
        transportRequeues: existing.transportRequeues,
        recovery: existing.recovery,
      };
      if (maybeSoftRequeueTransportKill(preview, err)) {
        softRequeued = true;
        Object.assign(patch, {
          status: preview.status,
          workerId: null,
          lastError: null,
          flagged: false,
          flagReason: null,
          flaggedAt: null,
          transportRequeues: preview.transportRequeues,
          activity: preview.activity,
          failedAtPhase: phaseBeforeFail || existing.failedAtPhase || null,
        });
        delete patch.error;
      }
    }
  }

  // Explicit --requeue-transport — only when TRANSPORT_REQUEUE_MAX > 0.
  // Default policy: fail once → Manual Review (refuse auto-rerun).
  if (args["requeue-transport"]) {
    if (TRANSPORT_REQUEUE_MAX > 0) {
      softRequeued = true;
      patch.status = "claimed";
      patch.workerId = null;
      patch.lastError = null;
      patch.flagged = false;
      patch.flagReason = null;
      patch.flaggedAt = null;
      patch.manualReview = false;
      patch.transportRequeues = (Number(existing?.transportRequeues) || 0) + 1;
      patch.activity =
        args.activity ||
        `Requeued after transport blip (requeue ${patch.transportRequeues}) - awaiting worker`;
      patch.updatedAt = now;
    } else {
      // Refuse auto-rerun: convert legacy --requeue-transport into a hard fail
      // so recordJobFailure parks the job in Manual Review.
      args.status = "failed";
      patch.status = "failed";
      if (!args.error) args.error = existing?.lastError || "transport_kill";
      patch.lastError = args.error;
      patch.activity =
        args.activity ||
        `Manual review: process failed once (${args.error}) — auto-rerun refused`;
      if (phaseBeforeFail) patch.failedAtPhase = phaseBeforeFail;
    }
  }
  if (args.status === "researching" || args.status === "building") {
    if (existing && !existing.startedAt) patch.startedAt = now;
  }
  if (args.status === "claimed" && !args["requeue-transport"] && !softRequeued) {
    if (args["clear-worker"]) patch.workerId = null;
  }
  if (args.status === "failed" && !softRequeued && phaseBeforeFail) {
    patch.failedAtPhase = phaseBeforeFail;
  }
  const updated = updateJob(data, args.job, patch);
  if (!updated) {
    console.error(`Unknown job ${args.job}`);
    process.exit(1);
  }
  if (softRequeued) {
    // Drop stem blocks that may have been set by an earlier hard-fail of this job
    const flags = data.flags || { blockedStems: [], blockedThemes: [], failures: [] };
    const stem = topicStem(updated.slug);
    if (stem) {
      flags.blockedStems = (flags.blockedStems || []).filter(
        (s) => s !== stem && s !== `${stem}-research` && stem !== `${s}-research`,
      );
    }
    data.flags = flags;
    console.error(
      `soft-requeue ${updated.id} (${updated.slug}) transportRequeues=${updated.transportRequeues}`,
    );
  } else if (args.status === "failed") {
    recordJobFailure(data, updated, args.error || updated.lastError || "failed", {
      phase: phaseBeforeFail || updated.failedAtPhase,
      activity: activityBeforeFail || updated.activity,
    });
  }
  if (args.status === "shipped") {
    clearThemeBlockOnShip(data, updated);
    // Belt-and-suspenders: close the worker branch whenever a job is marked shipped
    // (covers paths that skip mergeReadyJob or where merge cleanup was skipped).
    const branch = updated.branch || (updated.slug ? `post/${updated.slug}` : null);
    if (branch) {
      try {
        const del = deletePostBranchIfSafe(REPO_ROOT, branch);
        if (del.deleted) {
          console.error(
            `closed branch(es) on ship: ${del.deletedList.join(", ")}`,
          );
        }
      } catch (e) {
        console.error(`WARN branch close on ship: ${e?.message || e}`);
      }
    }
  }
}

writeJobs(data);
console.log(JSON.stringify({ ok: true, updatedAt: data.updatedAt }, null, 2));
