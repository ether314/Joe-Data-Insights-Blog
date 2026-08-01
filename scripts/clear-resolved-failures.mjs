import fs from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  readJobs,
  writeJobs,
  listOpenIssues,
  rebuildFlagBlocks,
} from "./lib/agent-jobs.mjs";

const now = new Date().toISOString();
const archivePath = path.join(REPO_ROOT, "artifacts", "agent-failures-archive.json");
const d = readJobs();

const prev = d.flags?.failures || [];
let archive = [];
try {
  archive = JSON.parse(fs.readFileSync(archivePath, "utf8"));
  if (!Array.isArray(archive)) archive = [];
} catch {
  archive = [];
}
archive = [...prev, ...archive].slice(0, 2000);
fs.writeFileSync(archivePath, JSON.stringify(archive, null, 2));

d.flags = d.flags || { blockedStems: [], blockedThemes: [], failures: [] };
d.flags.failures = [];
d.flags.blockedStems = [];
d.flags.blockedThemes = [];

let resolvedJobs = 0;
for (const j of d.jobs || []) {
  if (j.status === "failed" && !j.resolution) {
    const err = String(j.lastError || j.flagReason || "");
    const resolution = /superseded|deferred_for_recovery/i.test(err)
      ? "superseded"
      : "abandoned_infra";
    Object.assign(j, {
      flagged: false,
      resolution,
      resolvedAt: now,
      recoveryExhausted: true,
      activity: `Resolved: ${resolution}`,
      updatedAt: now,
    });
    resolvedJobs++;
  }
  if (j.status !== "failed" && j.status !== "shipped") {
    if (j.flagged || j.flagReason || j.flaggedAt) {
      j.flagged = false;
      j.flagReason = null;
      j.flaggedAt = null;
      j.updatedAt = now;
    }
  }
}

rebuildFlagBlocks(d);
writeJobs(d);

console.log(
  JSON.stringify(
    {
      archivedFailureRows: prev.length,
      archiveTotal: archive.length,
      resolvedJobs,
      openIssues: listOpenIssues(d).length,
      failureLogNow: d.flags.failures.length,
      blockedStems: d.flags.blockedStems,
      active: (d.jobs || [])
        .filter((j) => !["failed", "shipped"].includes(j.status))
        .map((j) => ({ slug: j.slug, status: j.status, workerId: j.workerId })),
    },
    null,
    2,
  ),
);
