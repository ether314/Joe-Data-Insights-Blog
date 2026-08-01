#!/usr/bin/env node
/**
 * Claim one Failed-before-merge job for the recovery worker (Worker 5).
 * Usage: node scripts/claim-recovery-job.mjs [--run-id ...]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  REPO_ROOT,
  readJobs,
  writeJobs,
  freeRecoveryWorker,
  listRecoverableFailures,
  reopenJobForRecovery,
  RECOVERY_WORKER_ID,
  RECOVERY_MAX_ATTEMPTS,
} from "./lib/agent-jobs.mjs";

function parseArgs(argv) {
  const out = { runId: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--run-id") out.runId = argv[++i];
  }
  return out;
}

function slugOnMain(slug) {
  try {
    const posts = fs.readFileSync(path.join(REPO_ROOT, "src/data/posts.ts"), "utf8");
    return new RegExp(`slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(posts);
  } catch {
    return false;
  }
}

function branchAhead(branch) {
  if (!branch) return false;
  try {
    execFileSync("git", ["rev-parse", "--verify", branch], {
      cwd: REPO_ROOT,
      stdio: ["ignore", "pipe", "ignore"],
    });
    const ahead = execFileSync("git", ["rev-list", "--count", `HEAD..${branch}`], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .trim();
    return Number(ahead || "0") > 0;
  } catch {
    return false;
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const data = readJobs();
  if (args.runId) data.runId = args.runId;

  const slot = freeRecoveryWorker(data);
  if (!slot) {
    console.log(
      JSON.stringify({
        claimed: 0,
        reason: "recovery_worker_busy",
        workerId: RECOVERY_WORKER_ID,
      }),
    );
    writeJobs(data);
    return;
  }

  // Do not mint another recovery claim while one is already waiting for Worker 5.
  const pending = (data.jobs || []).filter(
    (j) => j.status === "claimed" && j.recovery && !j.workerId,
  );
  if (pending.length) {
    const existing = pending[0];
    console.log(
      JSON.stringify(
        {
          claimed: 0,
          reused: 1,
          reason: "recovery_already_claimed",
          workerId: RECOVERY_WORKER_ID,
          job: {
            id: existing.id,
            slug: existing.slug,
            themeId: existing.themeId,
            recoveryAttempts: existing.recoveryAttempts || 1,
            branch: existing.branch,
            branchAhead: branchAhead(existing.branch),
          },
        },
        null,
        2,
      ),
    );
    writeJobs(data);
    return;
  }

  const candidates = listRecoverableFailures(data).filter((j) => !slugOnMain(j.slug));
  if (!candidates.length) {
    console.log(
      JSON.stringify({
        claimed: 0,
        reason: "no_recoverable_failures",
        maxAttempts: RECOVERY_MAX_ATTEMPTS,
      }),
    );
    writeJobs(data);
    return;
  }

  // Prefer jobs whose branch still has commits vs main
  const ranked = [...candidates].sort((a, b) => {
    const aa = branchAhead(a.branch) ? 0 : 1;
    const bb = branchAhead(b.branch) ? 0 : 1;
    if (aa !== bb) return aa - bb;
    return 0;
  });

  const pick = ranked[0];
  const reopened = reopenJobForRecovery(data, pick.id);
  if (!reopened) {
    console.log(JSON.stringify({ claimed: 0, reason: "reopen_failed" }));
    writeJobs(data);
    return;
  }

  writeJobs(data);
  console.log(
    JSON.stringify(
      {
        claimed: 1,
        workerId: RECOVERY_WORKER_ID,
        job: {
          id: reopened.id,
          slug: reopened.slug,
          themeId: reopened.themeId,
          phase: pick.failedAtPhase || null,
          recoveryAttempts: reopened.recoveryAttempts,
          branch: reopened.branch,
          branchAhead: branchAhead(reopened.branch),
        },
      },
      null,
      2,
    ),
  );
}

main();
