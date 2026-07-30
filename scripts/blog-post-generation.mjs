#!/usr/bin/env node
/**
 * Blog post generation lock CLI for cron Cloud Agent automations.
 *
 * Workflow:
 *   read lock → skip if active → acquire lock → work → release on stop
 *
 * Usage:
 *   node scripts/blog-post-generation.mjs status
 *   node scripts/blog-post-generation.mjs acquire
 *   node scripts/blog-post-generation.mjs release
 *   node scripts/blog-post-generation.mjs run -- <command...>
 */
import { spawn } from "node:child_process";
import {
  describeLock,
  installReleaseOnStop,
  isLockActive,
  readLock,
  releaseLock,
  syncLockFromRemote,
  tryAcquireLock,
} from "./lib/blog-post-generation-lock.mjs";

const [command, ...rest] = process.argv.slice(2);

function printStatus() {
  syncLockFromRemote();
  const lock = readLock();
  if (!lock) {
    console.log("blog-post-generation lock: idle (no lock file)");
    return 0;
  }
  console.log(`blog-post-generation lock: ${describeLock(lock)}`);
  return isLockActive(lock) ? 2 : 0;
}

function doAcquire() {
  const result = tryAcquireLock();
  if (!result.acquired) {
    console.log(
      `blog-post-generation lock: skip — ${describeLock(result.lock)}`,
    );
    return 2;
  }
  installReleaseOnStop();
  console.log(
    `blog-post-generation lock: acquired — ${describeLock(result.lock)}`,
  );
  return 0;
}

function doRelease() {
  const previous = releaseLock({ syncRemote: true, publish: true });
  if (!previous) {
    console.log("blog-post-generation lock: already idle");
    return 0;
  }
  console.log(
    `blog-post-generation lock: released — was ${describeLock(previous)}`,
  );
  return 0;
}

async function doRun() {
  const dash = rest.indexOf("--");
  const childArgs = dash >= 0 ? rest.slice(dash + 1) : [];
  if (childArgs.length === 0) {
    console.error("run requires a command after --");
    return 1;
  }

  const acquire = tryAcquireLock();
  if (!acquire.acquired) {
    console.log(
      `blog-post-generation lock: skip — ${describeLock(acquire.lock)}`,
    );
    return 2;
  }

  installReleaseOnStop();
  console.log(
    `blog-post-generation lock: acquired — ${describeLock(acquire.lock)}`,
  );

  const [bin, ...args] = childArgs;
  const child = spawn(bin, args, { stdio: "inherit", shell: false });
  const code = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  releaseLock({ publish: true });
  console.log("blog-post-generation lock: released after run");
  return code ?? 1;
}

async function main() {
  switch (command) {
    case "status":
      return printStatus();
    case "acquire":
      return doAcquire();
    case "release":
      return doRelease();
    case "run":
      return doRun();
    default:
      console.error(
        "Usage: node scripts/blog-post-generation.mjs <status|acquire|release|run -- cmd...>",
      );
      return 1;
  }
}

main()
  .then((code) => process.exit(code ?? 0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
