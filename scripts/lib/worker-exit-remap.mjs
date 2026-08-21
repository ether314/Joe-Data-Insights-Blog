/**
 * Classify worker/agent exit codes from the session log so transient Cursor
 * transport/silence deaths soft-requeue instead of parking as open issues.
 */

export const EXIT_TRANSPORT = 75;
export const EXIT_SILENCE = 76;

/**
 * @param {number|string|null|undefined} exitCode
 * @param {string} logText
 * @returns {{ code: number, error: string|null, reason: string|null }}
 */
export function remapWorkerExit(exitCode, logText = "") {
  const log = String(logText || "");
  let code = Number(exitCode);
  if (!Number.isFinite(code)) code = 0;
  // PowerShell sometimes surfaces killed processes as unsigned 32-bit.
  if (code === 4294967295) code = -1;

  if (/\[silence-watchdog\]/i.test(log) || /silence-watchdog.*killing agent/i.test(log)) {
    return { code: EXIT_SILENCE, error: "silence_kill", reason: "silence-watchdog in log" };
  }

  if (/RetriableError:\s*Connection failed|Connection failed repeatedly/i.test(log)) {
    return { code: EXIT_TRANSPORT, error: "transport_kill", reason: "Cursor connection failed repeatedly" };
  }

  // Abrupt kill (-1) after reconnect storm — treat as transport even without RetriableError line.
  if (
    (code === -1 || code === 1) &&
    /Connection lost,\s*reconnecting|Retry attempt\s+\d+/i.test(log)
  ) {
    return { code: EXIT_TRANSPORT, error: "transport_kill", reason: `exit ${code} after reconnect storm` };
  }

  if (code === EXIT_TRANSPORT) {
    return { code: EXIT_TRANSPORT, error: "transport_kill", reason: "exit 75" };
  }
  if (code === EXIT_SILENCE) {
    return { code: EXIT_SILENCE, error: "silence_kill", reason: "exit 76" };
  }

  return { code, error: code === 0 ? null : `worker_exit_${code}`, reason: null };
}

/** Errors that should soft-requeue producers (budget permitting) instead of flagging. */
export function isTransientWorkerError(errorCode) {
  const err = String(errorCode || "");
  if (!err) return false;
  if (
    err === "transport_kill" ||
    err === "silence_kill" ||
    err === "worker_spawn_failed" ||
    err === "cursor_cli_missing" ||
    err === "worker_process_gone" ||
    err === "worker_exit_0" ||
    err === "worker_exit_-1" ||
    err === "dispatch_failed"
  ) {
    return true;
  }
  if (err.startsWith("stale_")) return true;
  if (err.startsWith("stale_worker_")) return true;
  if (err.startsWith("worker_stale_")) return true;
  return false;
}

// CLI: node scripts/lib/worker-exit-remap.mjs --exit N --log path\to\log
const __cli = process.argv.includes("--exit") && process.argv.includes("--log");
if (__cli) {
  const fs = await import("node:fs");
  const args = process.argv.slice(2);
  let exit = 0;
  let logPath = "";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exit") exit = Number(args[++i]);
    else if (args[i] === "--log") logPath = args[++i];
  }
  const log = fs.readFileSync(logPath, "utf8");
  process.stdout.write(JSON.stringify(remapWorkerExit(exit, log)));
}
