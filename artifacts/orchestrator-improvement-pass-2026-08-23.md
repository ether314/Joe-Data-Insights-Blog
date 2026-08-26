# Orchestrator Improvement Pass — 2026-08-23

Passive, evidence-driven harness pass. No conveyor processes touched; all edits local-only.

## Evidence (logs + ledger)

- **Ledger** (`artifacts/agent-jobs.json`): 32 jobs — 20 shipped / 12 failed.
  Failure taxonomy: 10× `researching/worker_exit_0`, 2× `merging/branch_empty`,
  2× `researching/worker_spawn_failed`. Ship cadence avg ~0.8 h between ships
  (max gap 13.8 h).
- **Smoking gun (worker logs 21:53–21:58 on 08-23):**
  `Error: [unavailable] getaddrinfo ENOTFOUND api2.cursor.sh` in ≥20 worker
  sessions. The agent CLI dies from a DNS/network failure but exits **0**, so the
  harness logged healthy-looking `worker_exit_0` failures and immediately
  respawned into the same dead network — burning attempts fleet-wide in minutes.
- **Orchestrator log:** repeated `sync-worker-clones exit=2` rebase conflicts on
  shared files (`src/data/posts.ts`, `theme-registry.ts`, `PostVisualization.tsx`)
  during bless-syncs; two `branch_empty` merge failures; W5 idle-assign churn;
  occasional Windows file-lock loop errors on shared JSON/logs.
- **Pool starvation (live):** all 35 novel themes are now consumed by 220 posts;
  every claim poll returns `claimed: 0` with all candidates rejected as sequels.
  Throughput is zero until new themes are added (out of scope for this pass).

## Changes made (all safe, code-level)

1. **Exit classifier: network-death-despite-exit-0 → transport_kill**
   (`scripts/lib/worker-exit-remap.mjs`). Exit 0 + `[unavailable] getaddrinfo
   ENOTFOUND/EAI_AGAIN/ECONNREFUSED/ECONNRESET/ETIMEDOUT` now remaps to
   transport_kill instead of a fake-success failure. Verified:
   DNS line → `{code:75,transport_kill}`; clean `WorkerReady` log stays exit 0.
2. **Worker skips exit remap once job reached ready/shipped/merging**
   (`scripts/run-blog-worker.ps1`). A post-handoff network error line can no
   longer demote a clean finish into a transport failure (the near-miss in
   `worker-1-2026-08-23_21-58-45.log`: smoke passed, ready marked, then blips).
   Also fixed an unbalanced-brace parse error at that block.
3. **Fleet-wide spawn cooldown** (`scripts/run-blog-orchestrator.ps1`).
   N consecutive instant-death spawns arm a 1→10 min cooldown that gates topic
   claiming, producer dispatch, and recovery dispatch — no more attempt-burning
   respawn storms into a dead network. Reset on any successful spawn.
4. **QA suite hardening for live-conveyor races + archive churn**
   (`scripts/qa-claim-never-idle.mjs`, `scripts/resolve-flagged-jobs.mjs`):
   - dry-run mutation check now asserts "no job adds / status flips" instead of
     byte-equality (heartbeats legitimately mutate the file mid-test);
   - claim payload read prefers the dry-run's own stdout over the shared,
     concurrently-overwritten `last-claim.json`;
   - pool-exhaustion is reported as WARN, not FAIL (guard working as designed);
   - aircraft remint self-test SKIPs when its candidate slug has itself shipped.

## QA verification

- `node scripts/qa-worker-isolation-requeue.mjs` → PASS (includes remap unit tests)
- `node scripts/qa-worker-transport-exit.mjs` → PASS
- `node scripts/qa-claim-never-idle.mjs` → PASS (with exhaustion WARN)
- `node scripts/resolve-flagged-jobs.mjs --self-test` → ok
- PowerShell parser: 0 errors on both edited .ps1 scripts

## Recommended (documented, not implemented)

- **Add new novel themes** — the single highest-value fix; pool is exhausted and
  the conveyor cannot mint anything without it (content-diversity territory).
- **Clone sync conflict policy**: current rebase-abort leaves clones behind main
  for cycles; consider merge `-X ours` on post-owned paths or per-worker path
  ownership to stop serial `sync-worker-clones exit=2`.
- **branch_empty pre-check**: before merging, compare branch tree vs main for
  post-file diffs and auto-requeue with a clear activity line instead of failing.
- **Set `network.useHttp1ForAgent=true`** in `%USERPROFILE%\.cursor\cli-config.json`
  (workers warn about this every session; reduces transport storm severity).
