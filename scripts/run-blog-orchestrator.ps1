# Orchestrator for 5-agent parallel blog production (1 controller + 4 workers).
# Claims topics, assigns worktrees, merges ready jobs into main, ships locally.
#
# Usage: powershell -File scripts/run-blog-orchestrator.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
. (Join-Path $RepoRoot "scripts\lib\worker-pause.ps1")
[void](Ensure-BlogAutomationPath)
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$PidFile = Join-Path $RepoRoot "artifacts\blog-orchestrator.pid"
$JobsFile = Join-Path $RepoRoot "artifacts\agent-jobs.json"
$ProductionScriptLegacy = Join-Path $RepoRoot "scripts\run-blog-production-local.ps1"
$WorkerScript = Join-Path $RepoRoot "scripts\run-blog-worker.ps1"
$BootstrapScript = Join-Path $RepoRoot "scripts\bootstrap-worktrees.ps1"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogFile = Join-Path $LogDir "production-$Timestamp.log"
$RunId = "orch-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
# Parallel Cursor agent streams amplify transport blips - keep default at 4 but
# stagger spawns so they do not all connect to api2.cursor.sh at once.
$WorkerCount = if ($env:BLOG_PRODUCTION_WORKER_COUNT) { [int]$env:BLOG_PRODUCTION_WORKER_COUNT } else { 4 }
if ($WorkerCount -lt 1) { $WorkerCount = 1 }
if ($WorkerCount -gt 4) { $WorkerCount = 4 }
$RecoveryWorkerId = 5
$TotalWorkerSlots = 5
$PollSeconds = if ($env:BLOG_ORCH_POLL_SEC) { [int]$env:BLOG_ORCH_POLL_SEC } else { 20 }
$IdlePollSeconds = if ($env:BLOG_ORCH_IDLE_POLL_SEC) { [int]$env:BLOG_ORCH_IDLE_POLL_SEC } else { 5 }
# Delay between successive Start-WorkerJob calls (seconds). Default 20s.
$SpawnStaggerSeconds = if ($env:BLOG_WORKER_SPAWN_STAGGER_SEC) { [int]$env:BLOG_WORKER_SPAWN_STAGGER_SEC } else { 20 }
if ($SpawnStaggerSeconds -lt 0) { $SpawnStaggerSeconds = 0 }
# Active research/build/qa jobs with no heartbeat refresh beyond this are failed + killed.
$StaleJobMinutes = if ($env:BLOG_ORCH_STALE_MIN) { [double]$env:BLOG_ORCH_STALE_MIN } else { 40 }
# Worker slot busy with dead/hung process (no job heartbeat) - reclaim sooner.
$StaleWorkerMinutes = if ($env:BLOG_ORCH_STALE_WORKER_MIN) { [double]$env:BLOG_ORCH_STALE_WORKER_MIN } else { 45 }
$script:W5SpawnBackoffUntil = $null

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $RepoRoot "artifacts\locks") -Force | Out-Null
Set-Location $RepoRoot

function Write-Log($Message) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Add-Content -Path $LogFile -Value $line
    Write-Host $line
}

function Write-Lock($Status, $Notes) {
    $lastSlug = $null
    $startedAt = $script:StartedAt
    if (Test-Path $LockFile) {
        try {
            $cur = (Get-Content $LockFile -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
            if ($cur.lastSlug) { $lastSlug = $cur.lastSlug }
            if ($Status -eq "running" -and $cur.startedAt) { $startedAt = $cur.startedAt }
        } catch {}
    }
    $payload = @{
        status = $Status
        lastHeartbeat = (Get-Date).ToUniversalTime().ToString("o")
        startedAt = if ($Status -eq "running") { $startedAt } else { $null }
        runId = if ($Status -eq "running") { $RunId } else { $null }
        trigger = "orchestrator"
        lastSlug = if ($script:LastSlug) { $script:LastSlug } else { $lastSlug }
        notes = $Notes
        mode = "docker-isolated-workers"
    }
    $payload | ConvertTo-Json | Set-Content -Path $LockFile -Encoding UTF8
}

function Invoke-NodeTsx([string]$Script, [string[]]$ArgsList) {
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $full = Join-Path $RepoRoot $Script
        # .mjs runs directly under node - avoids npx hangs when many workers spawn at once.
        if ($Script -match '\.mjs$') {
            & node $full @ArgsList 2>&1 | Out-String | Out-Null
        } else {
            & npx --yes tsx $full @ArgsList 2>&1 | Out-String | Out-Null
        }
        return [int]$LASTEXITCODE
    } catch {
        Write-Log "WARN: Invoke-NodeTsx $Script failed: $_"
        return 1
    } finally {
        $ErrorActionPreference = $prev
    }
}

function Read-Jobs {
    if (-not (Test-Path $JobsFile)) {
        Invoke-NodeTsx "scripts/lib/agent-jobs.mjs" @() 2>$null | Out-Null
        node --input-type=module -e "import { writeJobs, emptyQueue } from './scripts/lib/agent-jobs.mjs'; writeJobs(emptyQueue(process.argv[1]));" $RunId | Out-Null
    }
    $raw = (Get-Content $JobsFile -Raw) -replace '^\uFEFF', ''
    return $raw | ConvertFrom-Json
}

function Update-OrchestratorNotes([string]$Notes) {
    Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
        "--orchestrator",
        "--status", "running",
        "--notes", $Notes,
        "--pid", "$PID",
        "--run-id", $RunId
    ) | Out-Null
}

function Get-WorkerProcesses {
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.CommandLine -and $_.CommandLine -match '-File\s+"?[^"]*run-blog-worker\.ps1'
        }
}

function Test-WorkerRunning([int]$Id) {
    @(Get-WorkerProcesses | Where-Object {
        $_.CommandLine -match "-WorkerId\s+$Id\b" -or $_.CommandLine -match "-WorkerId\s+`"*$Id"
    }).Count -gt 0
}

function Stop-WorkerProcess([int]$Id, [string]$Reason) {
    $procs = @(Get-WorkerProcesses | Where-Object {
        $_.CommandLine -match "-WorkerId\s+$Id\b" -or $_.CommandLine -match "-WorkerId\s+`"*$Id"
    })
    if ($procs.Count -eq 0) { return 0 }
    Write-Log "Stopping worker $Id process(es) ($Reason)"
    foreach ($p in $procs) {
        # Kill agent/node children first, then the worker shell
        Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
            Where-Object { $_.ParentProcessId -eq $p.ProcessId } |
            ForEach-Object {
                Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
            }
        Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
    return $procs.Count
}

function Start-WorkerJob([int]$WorkerId, [string]$JobId) {
    Write-Log "Assigning job $JobId -> worker $WorkerId"

    # Atomically bind job<->worker BEFORE spawning. Without this, a claimed recovery
    # job with workerId=null is re-assigned every poll while the process is still
    # starting (or dying in worktree prepare), creating an infinite dispatch loop.
    Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
        "--worker", "$WorkerId",
        "--status", "busy",
        "--job", "$JobId"
    ) | Out-Null
    Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
        "--job", "$JobId",
        "--worker-id", "$WorkerId",
        "--activity", "Dispatched to worker $WorkerId"
    ) | Out-Null

    # Start-Process on Windows does NOT quote ArgumentList array elements. Paths with
    # spaces (e.g. E:\AI Projects\...) must be wrapped in explicit quotes or -File
    # becomes "E:\AI" and the worker exits immediately - causing an infinite
    # recovery re-assign loop (claimed + workerId=null forever).
    $argLine = @(
        "-NoProfile",
        "-ExecutionPolicy Bypass",
        "-WindowStyle Minimized",
        "-File `"$WorkerScript`"",
        "-WorkerId $WorkerId",
        "-JobId $JobId"
    ) -join " "
    $proc = $null
    for ($spawnAttempt = 1; $spawnAttempt -le 2; $spawnAttempt++) {
        $proc = Start-Process -FilePath "powershell.exe" -PassThru -ArgumentList $argLine -WorkingDirectory $RepoRoot
        if (-not ($proc -and $proc.Id)) {
            Write-Log "ERROR: Start-Process returned no PID for worker $WorkerId / $JobId (attempt $spawnAttempt)"
            Start-Sleep -Seconds 2
            continue
        }
        Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
            "--worker", "$WorkerId",
            "--status", "busy",
            "--pid", "$($proc.Id)",
            "--job", "$JobId"
        ) | Out-Null
        Write-Log "Spawned worker $WorkerId shell pid=$($proc.Id) for $JobId (attempt $spawnAttempt)"
        # Brief settle - if spawn args were still wrong the process exits instantly.
        Start-Sleep -Seconds 4
        if (Get-Process -Id $proc.Id -ErrorAction SilentlyContinue) {
            if ($WorkerId -eq $RecoveryWorkerId) { $script:W5SpawnBackoffUntil = $null }
            return
        }
        Write-Log "WARN: worker $WorkerId pid=$($proc.Id) exited immediately after spawn (attempt $spawnAttempt)"
        Start-Sleep -Seconds 2
    }
    Write-Log "ERROR: worker $WorkerId failed to stay up after spawn retries for $JobId"
    $liveJobs = Read-Jobs
    $dead = @($liveJobs.jobs | Where-Object { $_.id -eq $JobId } | Select-Object -First 1)
    if ($dead) {
        # update-agent-job soft-requeues worker_spawn_failed when budget remains
        Fail-Job $dead "worker_spawn_failed" "Failed: worker process exited immediately after spawn"
    }
    if ($WorkerId -eq $RecoveryWorkerId) {
        $script:W5SpawnBackoffUntil = (Get-Date).AddMinutes(2)
        Write-Log "W5 spawn backoff until $($script:W5SpawnBackoffUntil.ToUniversalTime().ToString('o')) (not a tight retry loop)"
    }
}

function Fail-Job($Job, [string]$ErrorCode, [string]$Activity) {
    $act = if ($Activity.Length -gt 240) { $Activity.Substring(0, 240) } else { $Activity }
    # Kill hung agent ONLY if this job is still the worker's active slot.
    # Otherwise failing an old ready/merge job murders the worker's next assignment
    # (seen: weather branch_empty kill wiped freshly started ai-financing on W3).
    if ($Job.workerId) {
        $live = Read-Jobs
        $w = $live.workers."$($Job.workerId)"
        $stillThisJob = -not $w -or -not $w.jobId -or ($w.jobId -eq $Job.id)
        if ($stillThisJob) {
            [void](Stop-WorkerProcess ([int]$Job.workerId) "fail $($Job.id): $ErrorCode")
        } else {
            Write-Log "Skip kill worker $($Job.workerId) for failed $($Job.id) - slot now on $($w.jobId)"
        }
    }
    Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
        "--job", $Job.id,
        "--status", "failed",
        "--error", $ErrorCode,
        "--activity", $act
    ) | Out-Null
    if ($Job.workerId) {
        # clear only clears when job matches (update-agent-job enforces job_mismatch)
        Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
            "--worker", "$($Job.workerId)", "--clear", "--job", "$($Job.id)"
        ) | Out-Null
    }
}

function Invoke-HardenedMerge($Job) {
    $slug = $Job.slug
    $branch = if ($Job.branch) { $Job.branch } else { "post/$slug" }
    $worktree = if ($Job.worktreePath) { $Job.worktreePath } else { "" }
    $workerId = if ($Job.workerId) { "$($Job.workerId)" } else { "" }

    $argsList = @(
        "--slug", "$slug",
        "--branch", "$branch"
    )
    if ($worktree) { $argsList += @("--worktree", "$worktree") }
    if ($workerId) { $argsList += @("--worker-id", "$workerId") }

    # Prefer node for .mjs (tsx can wrap/alter exit codes on Windows)
    $mergeScript = Join-Path $RepoRoot "scripts/merge-ready-job.mjs"
    $jsonOut = & node $mergeScript @argsList 2>&1 | Out-String
    $exit = $LASTEXITCODE
    Write-Log ("merge-ready-job exit=$exit")
    # Log last chunk of JSON / errors
    $trim = $jsonOut.Trim()
    if ($trim.Length -gt 1800) {
        Write-Log ("merge-ready-job out: " + $trim.Substring($trim.Length - 1800))
    } else {
        Write-Log ("merge-ready-job out: " + $trim)
    }

    $parsed = $null
    try {
        # Extract JSON object from mixed stdout (ignore node warnings before `{`)
        $start = $trim.IndexOf("{")
        $end = $trim.LastIndexOf("}")
        if ($start -ge 0 -and $end -gt $start) {
            $parsed = ($trim.Substring($start, $end - $start + 1) | ConvertFrom-Json)
        }
    } catch {
        Write-Log "WARN: could not parse merge-ready-job JSON: $_"
    }

    $ok = ($exit -eq 0) -and ($null -eq $parsed -or $parsed.ok -eq $true)
    return @{
        Exit = $exit
        Ok = $ok
        Parsed = $parsed
        Raw = $trim
    }
}

function Set-ConveyorPhase {
    param(
        [string]$Phase,
        [string]$JobId = "",
        [string]$Slug = "",
        [string]$Branch = "",
        [string]$Exclude = ""
    )
    $argsList = @("--set-phase", $Phase)
    if ($JobId) { $argsList += @("--job", $JobId) }
    if ($Slug) { $argsList += @("--slug", $Slug) }
    if ($Branch) { $argsList += @("--branch", $Branch) }
    if ($Exclude) { $argsList += @("--exclude", $Exclude) }
    Invoke-NodeTsx "scripts/lib/conveyor-sync.mjs" $argsList | Out-Null
}

function Read-ConveyorPhase {
    $file = Join-Path $RepoRoot "artifacts\conveyor-sync.json"
    if (-not (Test-Path $file)) { return "idle" }
    try {
        $cur = (Get-Content $file -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
        if ($cur.phase) { return [string]$cur.phase }
    } catch {}
    return "idle"
}

function Invoke-BlessedMerge($Job) {
    $slug = $Job.slug
    $branch = if ($Job.branch) { $Job.branch } else { "post/$slug" }
    $exclude = if ($Job.workerId) { [string]$Job.workerId } else { "0" }
    Write-Log "Blessing $slug ($branch) - pausing other workers"

    Set-ConveyorPhase -Phase "pausing" -JobId $Job.id -Slug $slug -Branch $branch -Exclude $exclude
    try {
        Pause-WorkerFleet -RepoRoot $RepoRoot -ExcludeId ([int]$exclude)
    } catch {
        Write-Log "WARN: pause fleet: $_"
    }
    Start-Sleep -Seconds 2

    Set-ConveyorPhase -Phase "merging" -JobId $Job.id -Slug $slug -Branch $branch -Exclude $exclude
    Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
        "--job", $Job.id, "--status", "merging", "--activity", "Orchestrator merging $branch (blessed)"
    ) | Out-Null
    $result = Invoke-HardenedMerge $Job

    if ($result.Ok) {
        Write-Log "Blessed merge ok - syncing worker clones from main"
        Set-ConveyorPhase -Phase "syncing" -JobId $Job.id -Slug $slug -Branch $branch -Exclude $exclude
        $syncScript = Join-Path $RepoRoot "scripts\sync-worker-clones.mjs"
        $syncOut = & node $syncScript --exclude $exclude --merged-branch $branch 2>&1 | Out-String
        $syncExit = $LASTEXITCODE
        $trim = $syncOut.Trim()
        if ($trim.Length -gt 1200) { $trim = $trim.Substring($trim.Length - 1200) }
        Write-Log "sync-worker-clones exit=$syncExit $trim"
    }

    try {
        Resume-WorkerFleet -RepoRoot $RepoRoot
    } catch {
        Write-Log "WARN: resume fleet: $_"
    }
    Set-ConveyorPhase -Phase "idle"
    return $result
}

function Merge-ReadyJob($Job) {
    $slug = $Job.slug
    $branch = $Job.branch
    if (-not $branch) { $branch = "post/$slug" }
    Write-Log "Merging ready job $($Job.id) ($slug) from $branch"

    # Defer ONLY while this job is still the worker's active slot (agent printed
    # WorkerReady but has not exited). Do NOT defer because the same workerId is
    # busy on a later job - that blocked merges for hours (W2 backlog).
    if ($Job.workerId) {
        $live = Read-Jobs
        $w = $live.workers."$($Job.workerId)"
        $stillThisJob = $w -and $w.jobId -and ($w.jobId -eq $Job.id)
        if ($stillThisJob -and (Test-WorkerRunning ([int]$Job.workerId))) {
            Write-Log "Defer merge of $slug - worker $($Job.workerId) still finishing this job"
            Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
                "--job", $Job.id,
                "--status", "ready",
                "--activity", "Deferred merge - worker still finishing this job"
            ) | Out-Null
            return $false
        }
    }

    Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
        "--job", $Job.id, "--status", "blessing", "--activity", "Orchestrator blessing $branch"
    ) | Out-Null

    $result = Invoke-BlessedMerge $Job
    if (-not $result.Ok) {
        $err = if ($result.Parsed -and $result.Parsed.error) { [string]$result.Parsed.error } else { "merge_failed" }
        $detail = if ($result.Parsed -and $result.Parsed.detail) { [string]$result.Parsed.detail } else { $result.Raw }
        if ($err -in @("merge_lock", "stash_incomplete", "stash_failed")) {
            # Transient / dirty-tree issues - put back to ready and try later
            Write-Log "Merge deferred for $slug ($err) - re-queue ready"
            Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
                "--job", $Job.id,
                "--status", "ready",
                "--activity", "Deferred merge - $err"
            ) | Out-Null
            return $false
        }
        Fail-Job $Job $err "Failed: $err - $detail"
        return $false
    }

    $shippedAt = Get-Date
    $started = if ($Job.startedAt) { [datetime]$Job.startedAt } else { $shippedAt }
    $dur = [int][math]::Max(0, ($shippedAt - $started).TotalSeconds)
    $shipLine = "Shipped: $slug | duration_sec=$dur"
    Write-Log $shipLine
    if ($result.Parsed -and $result.Parsed.branchDeleted) {
        $closed = if ($result.Parsed.deletedBranches) {
            ($result.Parsed.deletedBranches -join ", ")
        } else { $branch }
        Write-Log "Closed branch(es) after merge: $closed"
    } elseif ($result.Parsed -and $result.Parsed.log) {
        $closeNote = @($result.Parsed.log | Where-Object { $_ -match 'closed shipped branch' } | Select-Object -Last 1)
        if ($closeNote) { Write-Log $closeNote }
    }
    $script:LastSlug = $slug
    Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
        "--job", $Job.id,
        "--status", "shipped",
        "--activity", $shipLine,
        "--headline", $shipLine
    ) | Out-Null
    if ($Job.workerId) {
        Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
            "--worker", "$($Job.workerId)", "--clear", "--job", "$($Job.id)"
        ) | Out-Null
    }
    Write-Lock "running" "Shipped $slug"
    return $true
}

function Clear-StaleJobs($JobsObj) {
    $now = Get-Date
    $orphanMergeMinutes = if ($env:BLOG_ORCH_ORPHAN_MERGE_MIN) { [double]$env:BLOG_ORCH_ORPHAN_MERGE_MIN } else { 12 }
    foreach ($job in @($JobsObj.jobs)) {
        if ($job.status -eq "shipped" -or $job.status -eq "failed") { continue }

        # Orphaned merges: status set to merging then orch died / hung
        if ($job.status -eq "merging") {
            $stamp = if ($job.updatedAt) { [datetime]$job.updatedAt } elseif ($job.heartbeat) { [datetime]$job.heartbeat } else { $null }
            if (-not $stamp) { continue }
            $age = ($now - $stamp).TotalMinutes
            if ($age -le $orphanMergeMinutes) { continue }
            $branch = if ($job.branch) { $job.branch } else { "post/$($job.slug)" }
            $prev = $ErrorActionPreference
            $ErrorActionPreference = "Continue"
            $null = git rev-parse --verify $branch 2>&1
            $branchOk = ($LASTEXITCODE -eq 0)
            $ErrorActionPreference = $prev
            if ($branchOk) {
                Write-Log "Orphaned merging job $($job.id) ($($job.slug)) age=${age}m - re-queue as ready"
                Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
                    "--job", $job.id,
                    "--status", "ready",
                    "--activity", "Reset from orphaned merge - awaiting clean merge"
                ) | Out-Null
            } else {
                Write-Log "Orphaned merging job $($job.id) ($($job.slug)) age=${age}m - branch missing, failing"
                Fail-Job $job "orphaned_merge" "Failed: orphaned merge (${age}m, branch missing)"
            }
            continue
        }

        # Claimed+bound but no live worker shell -> dispatch failed (spawn path bug / instant exit).
        if ($job.status -eq "claimed" -and $job.workerId) {
            $wid = [int]$job.workerId
            $stamp = if ($job.updatedAt) { [datetime]$job.updatedAt } elseif ($job.heartbeat) { [datetime]$job.heartbeat } else { $null }
            $ageMin = if ($stamp) { ($now - $stamp).TotalMinutes } else { 999 }
            if (-not (Test-WorkerRunning $wid) -and $ageMin -gt 2) {
                Write-Log "Claimed job $($job.id) bound to worker $wid but process gone (${ageMin}m) - failing dispatch"
                Fail-Job $job "dispatch_failed" "Failed: claimed+bound but worker process never stayed up"
                continue
            }
        }

        if ($job.status -in @("ready", "claimed")) { continue }
        if (-not $job.heartbeat -and -not $job.startedAt) { continue }
        $hb = if ($job.heartbeat) { [datetime]$job.heartbeat } else { [datetime]$job.startedAt }
        $age = ($now - $hb).TotalMinutes
        if ($age -gt $StaleJobMinutes) {
            Write-Log "Stale job $($job.id) ($($job.slug)) age=${age}m - failing + killing worker"
            Fail-Job $job "stale_${age}m" "Failed: stale heartbeat (${age}m)"
        }
    }

    # Reclaim busy slots whose process died, or whose job heartbeat is stale even
    # if JSON still says busy (Fail-Job may have been skipped earlier).
    foreach ($prop in @($JobsObj.workers.PSObject.Properties)) {
        $w = $prop.Value
        if (-not $w -or $w.status -ne "busy") { continue }
        $id = [int]$prop.Name
        $running = Test-WorkerRunning $id
        $jobHbAge = $null
        if ($w.jobId) {
            $activeJob = @($JobsObj.jobs | Where-Object { $_.id -eq $w.jobId } | Select-Object -First 1)
            if ($activeJob -and $activeJob.heartbeat) {
                $jobHbAge = ($now - [datetime]$activeJob.heartbeat).TotalMinutes
            } elseif ($activeJob -and $activeJob.startedAt) {
                $jobHbAge = ($now - [datetime]$activeJob.startedAt).TotalMinutes
            }
        }
        $slotHbAge = if ($w.heartbeat) { ($now - [datetime]$w.heartbeat).TotalMinutes } else { 999 }

        if (-not $running) {
            Write-Log "Worker $id marked busy but process gone - clearing slot (job=$($w.jobId))"
            if ($w.jobId) {
                # Fail in-flight jobs; already-failed/shipped/ready just need the slot freed.
                $deadJob = @($JobsObj.jobs | Where-Object {
                    $_.id -eq $w.jobId -and $_.status -notin @("ready","shipped","failed","merging","claimed")
                } | Select-Object -First 1)
                if ($deadJob) {
                    Fail-Job $deadJob "worker_process_gone" "Failed: worker process exited without finishing"
                    continue
                }
                # Claimed-but-unbound soft-requeues: clear slot only, leave job for redispatch
            }
            Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
                "--worker", "$id", "--clear", "--job", "$(if ($w.jobId) { $w.jobId } else { 'null' })"
            ) | Out-Null
            continue
        }

        $staleByJob = ($null -ne $jobHbAge -and $jobHbAge -gt $StaleWorkerMinutes)
        $staleBySlot = ($slotHbAge -gt $StaleWorkerMinutes -and ($null -eq $jobHbAge -or $jobHbAge -gt $StaleWorkerMinutes))
        if ($staleByJob -or $staleBySlot) {
            $ageLabel = if ($null -ne $jobHbAge) { "jobHb=${jobHbAge}m" } else { "slotHb=${slotHbAge}m" }
            Write-Log "Stale busy worker $id ($ageLabel) - killing + failing job $($w.jobId)"
            if ($w.jobId) {
                $stuck = @($JobsObj.jobs | Where-Object { $_.id -eq $w.jobId } | Select-Object -First 1)
                if ($stuck -and $stuck.status -notin @("ready", "shipped", "failed")) {
                    Fail-Job $stuck "stale_worker_${ageLabel}" "Failed: stale worker ($ageLabel)"
                    continue
                }
            }
            [void](Stop-WorkerProcess $id "stale slot $ageLabel")
            Invoke-NodeTsx "scripts/update-agent-job.mjs" @(
                "--worker", "$id", "--clear", "--job", "$(if ($w.jobId) { $w.jobId } else { 'null' })"
            ) | Out-Null
        }
    }
}

# --- Refuse if legacy single conveyor or another orchestrator is alive ---
$otherOrch = @(
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.ProcessId -ne $PID -and $_.CommandLine -and
            $_.CommandLine -match '-File\s+"?[^"]*run-blog-orchestrator\.ps1'
        }
)
if ($otherOrch.Count -gt 0) {
    Write-Log "Another orchestrator is active (PID $($otherOrch[0].ProcessId)). Exiting."
    exit 0
}

$legacy = @(
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.CommandLine -and $_.CommandLine -match '-File\s+"?[^"]*run-blog-production-local\.ps1'
        }
)
if ($legacy.Count -gt 0) {
    Write-Log "Legacy single-agent production is running (PID $($legacy[0].ProcessId)). Stop it before orchestrator."
    exit 1
}

if (Test-Path $LockFile) {
    try {
        $existingLock = (Get-Content $LockFile -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
        if ($existingLock.status -eq "paused") {
            Write-Log "Automation is paused. Exiting."
            exit 0
        }
    } catch {}
}

$script:StartedAt = (Get-Date).ToUniversalTime().ToString("o")
$script:LastSlug = $null
if (Test-Path $LockFile) {
    try {
        $existing = (Get-Content $LockFile -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
        $script:LastSlug = $existing.lastSlug
    } catch {}
}

$PID | Out-File -FilePath $PidFile -Encoding ascii -Force
Write-Log "Starting orchestrator ($RunId)"
Write-Log "Transport mitigations: producers=$WorkerCount spawnStagger=${SpawnStaggerSeconds}s (env BLOG_PRODUCTION_WORKER_COUNT / BLOG_WORKER_SPAWN_STAGGER_SEC)"
Write-Lock "running" "Orchestrator started"

# Park heavy skills once for all workers
$parkScript = Join-Path $RepoRoot "scripts\run-blog-production-local.ps1"
# Reuse park via a tiny inline call - invoke bootstrap + skill park from production helpers
Write-Log "Bootstrapping worker clones + Docker containers..."
$env:BLOG_WORKTREE_ROOT = Get-BlogWorkerRoot $RepoRoot
Export-BlogWorkerComposeEnv $RepoRoot | Out-Null
& powershell -NoProfile -ExecutionPolicy Bypass -File $BootstrapScript
if ($LASTEXITCODE -ne 0) { Write-Log "WARN: bootstrap returned $LASTEXITCODE" }

# Unpause any leftover bless (crash during previous merge)
try {
    Resume-WorkerFleet -RepoRoot $RepoRoot
    Set-ConveyorPhase -Phase "idle"
} catch {
    Write-Log "WARN: conveyor unpause on start: $_"
}

# Park skills (same as production shell)
$SkillsRoot = Join-Path $env:USERPROFILE ".cursor\skills"
$SkillsPark = Join-Path $env:USERPROFILE ".cursor\skills-parked-blog-production"
$SkillParkMaxBytes = 200KB
function Get-DirectorySizeBytes([string]$Path) {
    if (-not (Test-Path $Path)) { return 0 }
    $sum = (Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
    if ($null -eq $sum) { return 0 }
    return [int64]$sum
}
if (Test-Path $SkillsRoot) {
    New-Item -ItemType Directory -Path $SkillsPark -Force | Out-Null
    Get-ChildItem -Path $SkillsRoot -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $bytes = Get-DirectorySizeBytes $_.FullName
        if ($bytes -lt $SkillParkMaxBytes) { return }
        $dest = Join-Path $SkillsPark $_.Name
        if (Test-Path $dest) { Remove-Item -Path $dest -Recurse -Force -ErrorAction SilentlyContinue }
        Move-Item -Path $_.FullName -Destination $dest -Force
        Write-Log "Parked skill $($_.Name) ($([math]::Round($bytes/1MB,1)) MB)"
    }
}

Invoke-NodeTsx "scripts/update-agent-job.mjs" @("--run-id", $RunId, "--orchestrator", "--notes", "Bootstrapped", "--pid", "$PID") | Out-Null

# Seed failure flags so claim will not re-loop dead topic families
try {
    Write-Log "Seeding topic failure flags from history..."
    $seed = & node --input-type=module -e "import { readJobs, writeJobs, seedFlagsFromHistory } from './scripts/lib/agent-jobs.mjs'; const d=readJobs(); const f=seedFlagsFromHistory(d); writeJobs(d); console.log(JSON.stringify({blockedStems:f.blockedStems.length,blockedThemes:f.blockedThemes.length,failures:f.failures.length}));" 2>&1 | Out-String
    Write-Log ("flags seed: " + $seed.Trim())
} catch {
    Write-Log "WARN: flag seed failed: $_"
}

# Recover leftover MERGE_HEAD / merge stash from a previous crash
try {
    Write-Log "Recovering any orphaned merge state..."
    $rec = & node (Join-Path $RepoRoot "scripts/merge-ready-job.mjs") --recover 2>&1 | Out-String
    Write-Log ("merge recover: " + $rec.Trim())
} catch {
    Write-Log "WARN: merge recover failed: $_"
}

try {
    while ($true) {
        try {
        if (Test-Path $LockFile) {
            try {
                $lock = (Get-Content $LockFile -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
                if ($lock.status -eq "paused") {
                    Write-Log "Lock paused - orchestrator stopping"
                    break
                }
            } catch {}
        }

        Write-Lock "running" "Orchestrator loop"
        Update-OrchestratorNotes "Polling jobs / claiming topics"

        Clear-StaleJobs (Read-Jobs)

        $jobsObj = Read-Jobs
        $recBusy = Test-WorkerRunning $RecoveryWorkerId
        $recSlot = $jobsObj.workers."$RecoveryWorkerId"
        $recFree = (-not $recBusy) -and (-not ($recSlot -and $recSlot.jobId -and $recSlot.status -eq "busy"))
        if ($recFree -and $script:W5SpawnBackoffUntil -and ((Get-Date) -lt $script:W5SpawnBackoffUntil)) {
            Write-Log "Skip W5 extra claim - spawn backoff until $($script:W5SpawnBackoffUntil.ToString('HH:mm:ss'))"
            $recFree = $false
        }

        # Fill idle producer slots. W5 is recovery-first; if it is free, claim an extra
        # producer topic so the slot never idles when there is nothing to recover.
        $claimMax = $WorkerCount
        $claimArgs = @("--run-id", $RunId, "--max", "$claimMax")
        if ($recFree) {
            $claimMax = $TotalWorkerSlots
            $claimArgs = @("--run-id", $RunId, "--include-recovery-idle", "--max", "$claimMax")
        }
        $claimExit = Invoke-NodeTsx "scripts/claim-next-topics.mjs" $claimArgs
        if ($claimExit -ne 0) {
            Write-Log "WARN: claim-next-topics exit=$claimExit"
        }

        $jobsObj = Read-Jobs
        # Non-recovery claimed jobs go to workers 1-4 first; leftover may go to W5.
        $claimed = @($jobsObj.jobs | Where-Object {
            $_.status -eq "claimed" -and -not $_.workerId -and (-not $_.recovery)
        })
        $assignedThisLoop = 0
        for ($i = 1; $i -le $WorkerCount; $i++) {
            if ($claimed.Count -eq 0) { break }
            $w = $jobsObj.workers."$i"
            $busy = Test-WorkerRunning $i
            if ($busy) { continue }
            if ($w -and $w.jobId -and $w.status -eq "busy") { continue }

            $job = $claimed[0]
            $claimed = @($claimed | Select-Object -Skip 1)
            if ($assignedThisLoop -gt 0 -and $SpawnStaggerSeconds -gt 0) {
                Write-Log "Staggering next agent spawn by ${SpawnStaggerSeconds}s (avoid concurrent Cursor connects)"
                Start-Sleep -Seconds $SpawnStaggerSeconds
            }
            Start-WorkerJob -WorkerId $i -JobId $job.id
            $assignedThisLoop++
            $jobsObj = Read-Jobs
        }

        # Recovery worker (5): Failed-before-merge first; else a producer topic (never idle).
        $jobsObj = Read-Jobs
        $recBusy = Test-WorkerRunning $RecoveryWorkerId
        $recSlot = $jobsObj.workers."$RecoveryWorkerId"
        $recFree = (-not $recBusy) -and (-not ($recSlot -and $recSlot.jobId -and $recSlot.status -eq "busy"))
        if ($recFree -and $script:W5SpawnBackoffUntil -and ((Get-Date) -lt $script:W5SpawnBackoffUntil)) {
            $recFree = $false
        }
        if ($recFree) {
            $recJob = @($jobsObj.jobs | Where-Object {
                $_.status -eq "claimed" -and $_.recovery -and -not $_.workerId
            } | Select-Object -First 1)
            if (-not $recJob) {
                $recExit = Invoke-NodeTsx "scripts/claim-recovery-job.mjs" @("--run-id", $RunId)
                if ($recExit -ne 0) {
                    Write-Log "WARN: claim-recovery-job exit=$recExit"
                }
                $jobsObj = Read-Jobs
                $recJob = @($jobsObj.jobs | Where-Object {
                    $_.status -eq "claimed" -and $_.recovery -and -not $_.workerId
                } | Select-Object -First 1)
            }
            if ($recJob -and $recJob.workerId) {
                Write-Log "Skip recovery assign $($recJob.id) - already bound to worker $($recJob.workerId)"
                $recJob = $null
            }
            if ($recJob) {
                Write-Log "Assigning recovery job $($recJob.id) ($($recJob.slug)) -> worker $RecoveryWorkerId"
                Start-WorkerJob -WorkerId $RecoveryWorkerId -JobId $recJob.id
                $assignedThisLoop++
            } else {
                $prodJob = @($jobsObj.jobs | Where-Object {
                    $_.status -eq "claimed" -and -not $_.workerId -and (-not $_.recovery)
                } | Select-Object -First 1)
                if ($prodJob) {
                    Write-Log "W5 idle (no recovery candidate) - assigning producer $($prodJob.id) ($($prodJob.slug))"
                    if ($assignedThisLoop -gt 0 -and $SpawnStaggerSeconds -gt 0) {
                        Write-Log "Staggering next agent spawn by ${SpawnStaggerSeconds}s (avoid concurrent Cursor connects)"
                        Start-Sleep -Seconds $SpawnStaggerSeconds
                    }
                    Start-WorkerJob -WorkerId $RecoveryWorkerId -JobId $prodJob.id
                    $assignedThisLoop++
                }
            }
        }

        # Merge one at a time (hardened merge holds orch-merge.lock)
        $jobsObj = Read-Jobs
        $ready = @($jobsObj.jobs | Where-Object { $_.status -eq "ready" } | Select-Object -First 1)
        foreach ($job in $ready) {
            Update-OrchestratorNotes "Merging $($job.slug)"
            Merge-ReadyJob $job | Out-Null
        }

        $jobsObj = Read-Jobs
        $active = @($jobsObj.jobs | Where-Object { $_.status -notin @("shipped", "failed") })
        $idleWorkers = @($jobsObj.workers.PSObject.Properties | ForEach-Object { $_.Value } | Where-Object {
            (-not $_.jobId) -and ($_.status -eq "idle" -or -not $_.status)
        })
        $recNote = ""
        $rw = $jobsObj.workers."$RecoveryWorkerId"
        if ($rw -and $rw.jobId) { $recNote = " | recovery=busy" }
        elseif ($recFree) { $recNote = " | recovery=idle" }
        Update-OrchestratorNotes ("Active jobs: " + $active.Count + " | idle workers: " + $idleWorkers.Count + $recNote + " | " + (($active | ForEach-Object { "$($_.slug):$($_.status)" }) -join ", "))

        $sleepSec = if ($idleWorkers.Count -gt 0 -or $assignedThisLoop -gt 0) { $IdlePollSeconds } else { $PollSeconds }
        Start-Sleep -Seconds $sleepSec
        } catch {
            Write-Log "WARN: orchestrator loop error (continuing): $_"
            Start-Sleep -Seconds $PollSeconds
        }
    }
} finally {
    if (Test-Path $PidFile) { Remove-Item $PidFile -Force -ErrorAction SilentlyContinue }
    # Do not restore skills here if stop script will; restore only if still parked and we are exiting idle
    Write-Lock "idle" "Orchestrator exited"
    Write-Log "Orchestrator stopped"
}

exit 0
