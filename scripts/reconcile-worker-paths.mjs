#!/usr/bin/env node
/** Point agent-jobs worker slots at the current Docker clone paths. */
import { readJobs, writeJobs } from "./lib/agent-jobs.mjs";
import {
  defaultWorkerRoot,
  workerClonePath,
  workerContainerName,
} from "./lib/worker-layout.mjs";

const data = readJobs();
const root = defaultWorkerRoot();
for (const w of Object.values(data.workers || {})) {
  w.worktreePath = workerClonePath(w.id, root);
  w.containerName = workerContainerName(w.id);
}
writeJobs(data);
console.log(
  JSON.stringify({
    ok: true,
    workerRoot: root,
    workers: Object.fromEntries(
      Object.values(data.workers).map((w) => [
        w.id,
        { worktreePath: w.worktreePath, containerName: w.containerName },
      ]),
    ),
  }),
);
