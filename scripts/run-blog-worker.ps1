# Launch one Cursor agent worker for a claimed job inside its git worktree.
# Usage:
#   powershell -File scripts/run-blog-worker.ps1 -WorkerId 1 -JobId job-xxx
#   powershell -File scripts/run-blog-worker.ps1 -WorkerId 1   # picks first claimed unassigned job

param(
    [Parameter(Mandatory = $true)][ValidateRange(1, 5)][int]$WorkerId,
    [string]$JobId = ""
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$JobsFile = Join-Path $RepoRoot "artifacts\agent-jobs.json"
$WorktreeRoot = if ($env:BLOG_WORKTREE_ROOT) { $env:BLOG_WORKTREE_ROOT } else {
    Join-Path (Split-Path -Parent $RepoRoot) "data-insights-blog-worktrees"
}
$WorktreePath = Join-Path $WorktreeRoot "worker-$WorkerId"
# Per-worker listen ports so parallel npm run deploy / Playwright never share one Node server.
# W1: 4180/4181 ... W5: 4188/4189
$SmokePort = 4180 + (($WorkerId - 1) * 2)
$SmokeQaPort = $SmokePort + 1
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogFile = Join-Path $LogDir "worker-$WorkerId-$Timestamp.log"
$PromptTemplate = Join-Path $RepoRoot "scripts\prompts\worker.txt"
$RecoveryPromptTemplate = Join-Path $RepoRoot "scripts\prompts\recovery-worker.txt"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
Set-Location $RepoRoot

function Write-Log($Message) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Add-Content -Path $LogFile -Value $line
    Write-Host $line
}

function Invoke-JobUpdate([string[]]$ArgsList) {
    # Prefer direct node on .mjs - npx can hang/fail under concurrent worker spawns.
    $scriptPath = Join-Path $RepoRoot "scripts\update-agent-job.mjs"
    & node $scriptPath @ArgsList
    if ($LASTEXITCODE -ne 0) { throw "update-agent-job failed (exit $LASTEXITCODE)" }
}

function Read-Jobs {
    if (-not (Test-Path $JobsFile)) { throw "Missing $JobsFile - run claim-next-topics / bootstrap first" }
    # Windows: concurrent orch/worker writes can lock agent-jobs.json briefly.
    # Without retries the worker shell exits immediately -> worker_spawn_failed.
    $lastErr = $null
    for ($i = 0; $i -lt 12; $i++) {
        try {
            $raw = (Get-Content $JobsFile -Raw -ErrorAction Stop) -replace '^\uFEFF', ''
            return $raw | ConvertFrom-Json
        } catch {
            $lastErr = $_
            Start-Sleep -Milliseconds (80 + $i * 60)
        }
    }
    throw "Read-Jobs failed after retries: $lastErr"
}

if (-not (Get-Command agent -ErrorAction SilentlyContinue)) {
    Write-Log "ERROR: Cursor agent CLI not found"
    exit 1
}
if (-not (Test-Path $WorktreePath)) {
    Write-Log "ERROR: Worktree missing at $WorktreePath - run scripts/bootstrap-worktrees.ps1"
    exit 1
}

$jobs = Read-Jobs
$runId = $jobs.runId

if (-not $JobId) {
    $candidate = @($jobs.jobs | Where-Object { $_.status -eq "claimed" -and -not $_.workerId } | Select-Object -First 1)
    if (-not $candidate) {
        Write-Log "No unassigned claimed jobs"
        exit 0
    }
    $JobId = $candidate.id
}

$job = @($jobs.jobs | Where-Object { $_.id -eq $JobId } | Select-Object -First 1)
if (-not $job) {
    Write-Log "ERROR: Job $JobId not found"
    exit 1
}

$slug = $job.slug
$isRecovery = ($WorkerId -eq 5) -or ($job.recovery -eq $true)

function Resolve-CanonicalPostBranch {
    param($JobObj, [int]$Wid, [bool]$Recovery)
    # One stable branch per claim. Recovery MUST reuse the producer tip - never mint *-w5-recovery.
    if ($Recovery) {
        $candidates = @()
        if ($JobObj.recoverySourceBranch) { $candidates += [string]$JobObj.recoverySourceBranch }
        if ($JobObj.branch) { $candidates += [string]$JobObj.branch }
        foreach ($c in $candidates) {
            if (-not $c) { continue }
            if ($c -match '-w5-recovery$') { continue }
            return $c
        }
        # Fall back: pick existing producer branch with most commits ahead of main
        $best = $null
        $bestAhead = -1
        for ($w = 1; $w -le 4; $w++) {
            $cand = "post/$($JobObj.slug)-w$w"
            $prev = $ErrorActionPreference
            $ErrorActionPreference = "Continue"
            $null = & git -C $RepoRoot rev-parse --verify $cand 2>&1
            $ok = ($LASTEXITCODE -eq 0)
            $ahead = 0
            if ($ok) {
                $aheadRaw = & git -C $RepoRoot rev-list --count "master..$cand" 2>&1
                if ($LASTEXITCODE -eq 0) { $ahead = [int]([string]$aheadRaw).Trim() }
            }
            $ErrorActionPreference = $prev
            if ($ok -and $ahead -gt $bestAhead) {
                $best = $cand
                $bestAhead = $ahead
            }
        }
        if ($best -and $bestAhead -gt 0) { return $best }
        # No WIP tip: open a dedicated recovery lane still keyed to the original worker if known
        $home = if ($JobObj.workerId -and [int]$JobObj.workerId -ge 1 -and [int]$JobObj.workerId -le 4) {
            [int]$JobObj.workerId
        } else { 5 }
        return "post/$($JobObj.slug)-w$home"
    }
    return "post/$($JobObj.slug)-w$Wid"
}

$branch = Resolve-CanonicalPostBranch -JobObj $job -Wid $WorkerId -Recovery $isRecovery
$themeId = $job.themeId
$category = if ($job.category) { $job.category } else { "Global Systems" }
$sourceBranch = $null
if ($isRecovery) {
    $sourceBranch = $branch
}

$recoveryTag = if ($isRecovery) { " [RECOVERY]" } else { "" }
Write-Log "Worker $WorkerId starting job $JobId ($slug) in $WorktreePath (branch $branch)$recoveryTag"

# Persist canonical branch (non-fatal - never block startup logging / dispatch)
try {
    Invoke-JobUpdate @("--job", $JobId, "--branch", $branch) | Out-Null
} catch {
    Write-Log "WARN: could not persist branch on job: $_"
}

# Ensure worktree has latest automation scripts / package deploy definition from main
robocopy (Join-Path $RepoRoot "scripts") (Join-Path $WorktreePath "scripts") /E /XO /NFL /NDL /NJH /NJS /NP | Out-Null
Copy-Item (Join-Path $RepoRoot "package.json") (Join-Path $WorktreePath "package.json") -Force -ErrorAction SilentlyContinue
$env:BLOG_REPO_ROOT = $RepoRoot

function Invoke-GitQuiet {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)
    # git writes progress / "Switched to..." on stderr; with $ErrorActionPreference=Stop
    # that becomes a terminating NativeCommandError even when exit code is 0.
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & git @GitArgs 2>&1 | ForEach-Object {
            $text = if ($_ -is [System.Management.Automation.ErrorRecord]) { $_.Exception.Message } else { "$_" }
            if ($text) { Write-Log "git: $text" }
        }
        return [int]$LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prev
    }
}

# Prepare worktree branch
Push-Location $WorktreePath
try {
    $mainSha = (& git -C $RepoRoot rev-parse master).Trim()
    if (-not $mainSha -or $mainSha.Length -lt 7) {
        throw "Could not resolve master SHA (got '$mainSha')"
    }

    # If another worktree holds our canonical branch, detach it so we can reuse the tip.
    $wtPorcelain = & git -C $RepoRoot worktree list --porcelain
    $otherPath = $null
    $curPath = $null
    foreach ($line in ($wtPorcelain -split "`n")) {
        if ($line -match '^worktree (.+)$') { $curPath = $Matches[1].Trim() }
        if ($line -match '^branch refs/heads/(.+)$') {
            $bname = $Matches[1].Trim()
            if ($bname -eq $branch -and $curPath -and ($curPath -ne $WorktreePath)) {
                $otherPath = $curPath
            }
        }
    }
    if ($otherPath) {
        Write-Log "Releasing $branch from other worktree $otherPath (detach -> master)"
        $prev = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        & git -C $otherPath checkout --detach $mainSha 2>&1 | ForEach-Object { Write-Log "git: $_" }
        $ErrorActionPreference = $prev
    }

    # Decide start tip: reuse existing branch tip when it has commits ahead of master (real WIP).
    $startTip = $mainSha
    $branchExists = $false
    $aheadN = 0
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $null = & git -C $RepoRoot rev-parse --verify $branch 2>&1
    if ($LASTEXITCODE -eq 0) {
        $branchExists = $true
        $aheadRaw = & git -C $RepoRoot rev-list --count "master..$branch" 2>&1
        if ($LASTEXITCODE -eq 0) { $aheadN = [int]([string]$aheadRaw).Trim() }
        if ($aheadN -gt 0) {
            $startTip = (& git -C $RepoRoot rev-parse $branch).Trim()
            Write-Log "Reusing existing WIP tip $branch @ $startTip (ahead=$aheadN)"
        } else {
            Write-Log "Existing $branch is empty vs master - resetting from master $mainSha"
            $startTip = $mainSha
        }
    } else {
        Write-Log "Creating $branch from master $mainSha"
    }
    $ErrorActionPreference = $prev

    if (-not $startTip -or $startTip.Length -lt 7) {
        throw "Refusing checkout -B without explicit start tip (got '$startTip')"
    }

    Write-Log "Resetting worktree then checkout $branch at $startTip"
    [void](Invoke-GitQuiet reset --hard HEAD)
    # Always clear untracked scripts/ that block checkout (robocopy leaves QA scripts that
    # collide with branch switches). Keep untracked src/public post WIP on recovery.
    [void](Invoke-GitQuiet clean -fd -- scripts)
    if (-not $isRecovery) {
        [void](Invoke-GitQuiet clean -fd)
    } else {
        Write-Log "Recovery: cleaned scripts/; keeping other untracked WIP"
    }
    [void](Invoke-GitQuiet checkout --detach $mainSha)
    # Always pass an explicit SHA - never `checkout -B $branch` alone (that aliases previous HEAD).
    $co = Invoke-GitQuiet checkout -B $branch $startTip
    if ($co -ne 0) {
        Write-Log "WARN: checkout failed ($co); force-recreate $branch at $startTip"
        # Delete branch from main repo (may be locked by this worktree)
        $prev = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        & git -C $RepoRoot branch -D $branch 2>&1 | ForEach-Object { Write-Log "git: $_" }
        $ErrorActionPreference = $prev
        [void](Invoke-GitQuiet checkout --detach $mainSha)
        $co = Invoke-GitQuiet checkout -B $branch $startTip
    }
    if ($co -ne 0) {
        # Last resort: move blocking untracked files aside then retry once
        Write-Log "WARN: checkout still failing - parking untracked blockers"
        $aside = Join-Path $WorktreePath "artifacts\worktree-aside-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        New-Item -ItemType Directory -Path $aside -Force | Out-Null
        $porcelain = & git status --porcelain 2>$null
        foreach ($line in @($porcelain)) {
            if ($line -match '^\?\?\s+(.+)$') {
                $rel = $Matches[1].Trim().Trim('"')
                $src = Join-Path $WorktreePath $rel
                if (Test-Path $src) {
                    $dest = Join-Path $aside $rel
                    New-Item -ItemType Directory -Path (Split-Path $dest -Parent) -Force | Out-Null
                    Move-Item -Force -Path $src -Destination $dest -ErrorAction SilentlyContinue
                }
            }
        }
        $co = Invoke-GitQuiet checkout -B $branch $startTip
    }
    if ($co -ne 0) { throw "Failed to checkout branch $branch at $startTip (exit $co)" }
    # Overlay current main scripts/src/public so tooling stays current (XO = older only)
    robocopy (Join-Path $RepoRoot "scripts") (Join-Path $WorktreePath "scripts") /E /XO /NFL /NDL /NJH /NJS /NP | Out-Null
    if (-not $isRecovery -or $aheadN -eq 0) {
        # Fresh lane: sync src/public from main. Recovery with WIP keeps branch trees.
        robocopy (Join-Path $RepoRoot "src") (Join-Path $WorktreePath "src") /E /XO /NFL /NDL /NJH /NJS /NP | Out-Null
        robocopy (Join-Path $RepoRoot "public") (Join-Path $WorktreePath "public") /E /XO /NFL /NDL /NJH /NJS /NP | Out-Null
    } else {
        Copy-Item (Join-Path $RepoRoot "package.json") (Join-Path $WorktreePath "package.json") -Force -ErrorAction SilentlyContinue
    }
} catch {
    Write-Log "ERROR preparing worktree: $_"
    Invoke-JobUpdate @(
        "--job", $JobId,
        "--status", "failed",
        "--error", "worktree_prepare_failed",
        "--activity", "Failed: worktree prepare - $_"
    ) 2>$null
    Invoke-JobUpdate @("--worker", "$WorkerId", "--clear", "--pid", "$PID", "--job", $JobId) 2>$null
    exit 1
} finally {
    Pop-Location
}

$attempts = [int]$job.attempts + 1
Invoke-JobUpdate @(
    "--worker", "$WorkerId",
    "--status", "busy",
    "--pid", "$PID",
    "--job", $JobId
)
$failedPhaseLabel = if ($job.failedAtPhase) { [string]$job.failedAtPhase } else { "unknown" }
if ($isRecovery) {
    $startActivity = "Recovery worker starting (prior phase=$failedPhaseLabel)"
} else {
    $startActivity = "Worker $WorkerId starting agent session"
}
Invoke-JobUpdate @(
    "--job", $JobId,
    "--status", "researching",
    "--worker-id", "$WorkerId",
    "--worktree", $WorktreePath,
    "--branch", $branch,
    "--attempts", "$attempts",
    "--activity", $startActivity
)

$sources = ""
if ($job.primarySources) {
    if ($job.primarySources -is [System.Array]) { $sources = ($job.primarySources -join "; ") }
    else { $sources = [string]$job.primarySources }
}

$promptFile = if ($isRecovery -and (Test-Path $RecoveryPromptTemplate)) { $RecoveryPromptTemplate } else { $PromptTemplate }
if (-not (Test-Path $promptFile)) {
    Write-Log "ERROR: Missing worker prompt template at $promptFile"
    exit 1
}

$runIdVal = if ($runId) { [string]$runId } else { "local" }
$titleVal = if ($job.title) { [string]$job.title } else { $slug }
$coreQVal = if ($job.coreQuestion) { [string]$job.coreQuestion } else { "" }
$hintVal = if ($job.headlineStatHint) { [string]$job.headlineStatHint } else { "" }
$failErrVal = if ($job.flagReason) { [string]$job.flagReason } elseif ($job.lastError) { [string]$job.lastError } else { "failed" }
$recAttemptVal = if ($job.recoveryAttempts) { [string]$job.recoveryAttempts } else { "1" }
$prompt = Get-Content $promptFile -Raw
$prompt = $prompt.
    Replace("{{WORKER_ID}}", "$WorkerId").
    Replace("{{JOB_ID}}", "$JobId").
    Replace("{{SLUG}}", "$slug").
    Replace("{{THEME_ID}}", "$themeId").
    Replace("{{CATEGORY}}", "$category").
    Replace("{{BRANCH}}", "$branch").
    Replace("{{WORKTREE}}", $WorktreePath).
    Replace("{{REPO_ROOT}}", $RepoRoot).
    Replace("{{SMOKE_PORT}}", "$SmokePort").
    Replace("{{SMOKE_QA_PORT}}", "$SmokeQaPort").
    Replace("{{RUN_ID}}", $runIdVal).
    Replace("{{TITLE}}", $titleVal).
    Replace("{{CORE_QUESTION}}", $coreQVal).
    Replace("{{SOURCES}}", $sources).
    Replace("{{HEADLINE_HINT}}", $hintVal).
    Replace("{{FAILED_PHASE}}", $failedPhaseLabel).
    Replace("{{FAILED_ERROR}}", $failErrVal).
    Replace("{{RECOVERY_ATTEMPT}}", $recAttemptVal)

$env:SMOKE_PORT = "$SmokePort"
$env:SMOKE_QA_PORT = "$SmokeQaPort"
$env:BLOG_WORKER_ID = "$WorkerId"
$env:BLOG_JOB_ID = "$JobId"
Write-Log "Worker $WorkerId ports: SMOKE_PORT=$SmokePort SMOKE_QA_PORT=$SmokeQaPort (isolated Node static servers)"

# Prefer HTTP/1 for agent streams (reduces some HTTP/2 NGHTTP2_ENHANCE_YOUR_CALM kills).
try {
    $cliCfgPath = Join-Path $env:USERPROFILE ".cursor\cli-config.json"
    if (Test-Path $cliCfgPath) {
        $cliCfg = (Get-Content $cliCfgPath -Raw -ErrorAction Stop) -replace '^\uFEFF', '' | ConvertFrom-Json
        $http1 = $cliCfg.network.useHttp1ForAgent
        if ($http1 -eq $true) {
            Write-Log "Cursor CLI network.useHttp1ForAgent=true (ok)"
        } else {
            Write-Log "WARN: Cursor CLI useHttp1ForAgent is not true - transport blips may be worse. Set network.useHttp1ForAgent=true in $cliCfgPath"
        }
    } else {
        Write-Log "WARN: missing $cliCfgPath - recommend network.useHttp1ForAgent=true"
    }
} catch {
    Write-Log "WARN: could not read Cursor CLI config for HTTP/1 check"
}

$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$sessionExit = 0
$forceKill = $false
$reconnectSince = $null
$lastBlipAt = $null
$cliAttemptHigh = 0
# CLI prints both "Connection lost, reconnecting (attempt N)" and "Retry attempt N"
# for the SAME reconnect. Track unique CLI attempt numbers, not raw matching lines.
# Fail-fast on Cursor transport storms (was 12 -> 40m death spirals). 5 ~ park Manual Review sooner.
$maxReconnectAttempts = if ($env:BLOG_AGENT_MAX_RECONNECTS) { [int]$env:BLOG_AGENT_MAX_RECONNECTS } else { 5 }
$reconnectGraceSeconds = if ($env:BLOG_AGENT_RECONNECT_GRACE_SEC) { [int]$env:BLOG_AGENT_RECONNECT_GRACE_SEC } else { 600 }
$blipStreakGapSeconds = if ($env:BLOG_AGENT_BLIP_STREAK_GAP_SEC) { [int]$env:BLOG_AGENT_BLIP_STREAK_GAP_SEC } else { 120 }
# Kept for logging/compat; default policy is fail-once -> Manual Review (budget 0).
$maxTransportRequeues = if ($env:BLOG_TRANSPORT_REQUEUE_MAX) { [int]$env:BLOG_TRANSPORT_REQUEUE_MAX } else { 0 }
# Silent hang watchdog: agent process alive but no stdout and no job heartbeat refresh.
$silenceKillMinutes = if ($env:BLOG_WORKER_SILENCE_MIN) { [double]$env:BLOG_WORKER_SILENCE_MIN } else { 25 }
$script:LastAgentOutputAt = Get-Date
$silenceWatchdog = $null

try {
    Write-Log "Invoking agent for worker $WorkerId (-p --force --trust --workspace worktree)"
    $silenceWatchdog = Start-Job -ScriptBlock {
        param($JobsFile, $JobId, $ParentPid, $SilenceMin, $LogFile)
        $idleSince = Get-Date
        while ($true) {
            Start-Sleep -Seconds 30
            try {
                $parent = Get-Process -Id $ParentPid -ErrorAction SilentlyContinue
                if (-not $parent) { break }
                $raw = (Get-Content $JobsFile -Raw -ErrorAction Stop) -replace '^\uFEFF', ''
                $jobs = $raw | ConvertFrom-Json
                $job = @($jobs.jobs | Where-Object { $_.id -eq $JobId } | Select-Object -First 1)
                if (-not $job) { break }
                if ($job.status -in @("ready", "shipped", "failed", "merging")) { break }

                $hb = $null
                if ($job.heartbeat) { $hb = [datetime]$job.heartbeat }
                $logAgeMin = 999.0
                if (Test-Path $LogFile) {
                    $logAgeMin = ((Get-Date) - (Get-Item $LogFile).LastWriteTime).TotalMinutes
                }
                $hbAgeMin = if ($hb) { ((Get-Date) - $hb).TotalMinutes } else { 999.0 }

                # Both signals stale => hung. Heartbeat is the progress signal; log mtime alone
                # is NOT enough (transport blip lines keep refreshing the log while the agent
                # is stuck reconnecting with a dead heartbeat).
                $hbStale = ($hbAgeMin -ge $SilenceMin)
                $logStale = ($logAgeMin -ge $SilenceMin)
                if ($hbStale -and ($logStale -or $hbAgeMin -ge ($SilenceMin + 10))) {
                    $msg = "[silence-watchdog] worker parent=$ParentPid job=$JobId logAge=${logAgeMin}m hbAge=${hbAgeMin}m - killing agent children"
                    Add-Content -Path $LogFile -Value $msg -Encoding UTF8
                    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
                        Where-Object { $_.ParentProcessId -eq $ParentPid -and $_.Name -match "node|cmd|agent" } |
                        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
                    # Also stop deep cursor-agent descendants whose parent is node under this shell
                    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
                        Where-Object {
                            $_.CommandLine -and
                            $_.CommandLine -match 'cursor-agent|agent-cli' -and
                            $_.CommandLine -match [regex]::Escape("worker-")
                        } |
                        ForEach-Object {
                            # Only kill if ancestor chain includes ParentPid
                            $cur = $_
                            $guard = 0
                            while ($cur -and $guard -lt 8) {
                                if ($cur.ParentProcessId -eq $ParentPid) {
                                    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
                                    break
                                }
                                $cur = Get-CimInstance Win32_Process -Filter "ProcessId=$($cur.ParentProcessId)" -ErrorAction SilentlyContinue
                                $guard++
                            }
                        }
                    break
                }
            } catch {
                # keep watching
            }
        }
    } -ArgumentList $JobsFile, $JobId, $PID, $silenceKillMinutes, $LogFile

    # stream-json + partial output = granular assistant/tool events for the CoT dashboard.
    # Tee through formatter so the .log gets [cot:thought]/[cot:tool] lines; raw NDJSON sidecar kept too.
    $NdjsonFile = [regex]::Replace($LogFile, "\.log$", ".ndjson")
    # Dedicated CoT stream file - thoughts/tools only (no git/harness/transport).
    $CotLogFile = [regex]::Replace($LogFile, "\.log$", ".cot.log")
    $CotTee = Join-Path $RepoRoot "scripts\lib\agent-stream-cot.mjs"
    Write-Log "Agent stream-json -> $LogFile (cot $CotLogFile, raw $NdjsonFile)"
    $script:LastThoughtActivityAt = $null

    # Normalize ErrorRecords (stderr transport blips) to strings, then format CoT.
    & agent -p --force --trust --output-format stream-json --stream-partial-output --workspace $WorktreePath $prompt 2>&1 |
        ForEach-Object {
            if ($_ -is [System.Management.Automation.ErrorRecord]) { $_.Exception.Message } else { "$_" }
        } |
        & node $CotTee --tee --raw $NdjsonFile |
        ForEach-Object {
        $line = "$_"
        if (-not $line) { return }
        $script:LastAgentOutputAt = Get-Date
        Write-Host $line
        Add-Content -Path $LogFile -Value $line -Encoding UTF8
        # Pure CoT sidecar (dashboard Chain of Thought table reads only this)
        if ($line -match '^\[cot:(thought|tool|user|system)\]') {
            $cotStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Add-Content -Path $CotLogFile -Value "[$cotStamp] $line" -Encoding UTF8
        }

        if ($line -match "(?i)WorkerReady:") {
            Invoke-JobUpdate @("--job", $JobId, "--status", "ready", "--activity", $line.Trim()) 2>$null
        }
        # Surface tool activity onto the job card
        if ($line -match "^\[cot:tool\]\s+start\s+(.+)$") {
            $toolAct = "Agent tool: $($Matches[1])".Trim()
            if ($toolAct.Length -gt 200) { $toolAct = $toolAct.Substring(0, 200) }
            Invoke-JobUpdate @("--job", $JobId, "--activity", $toolAct) 2>$null
        } elseif ($line -match "^\[cot:thought\]\s+(.+)$") {
            $thoughtAct = "Thinking: $($Matches[1])".Trim()
            if ($thoughtAct.Length -gt 200) { $thoughtAct = $thoughtAct.Substring(0, 200) }
            # Throttle thought activity updates (every ~8s) so we don't hammer jobs file
            $nowThought = Get-Date
            if (-not $script:LastThoughtActivityAt -or (($nowThought - $script:LastThoughtActivityAt).TotalSeconds -ge 8)) {
                $script:LastThoughtActivityAt = $nowThought
                Invoke-JobUpdate @("--job", $JobId, "--activity", $thoughtAct) 2>$null
            }
        }

        $isBlip = $line -match "(?i)Connection lost|reconnect|Retry attempt"
        $attempt = $null
        if ($line -match "(?i)(?:Connection lost|reconnect|Retry attempt).*?attempt\s+(\d+)") {
            $attempt = [int]$Matches[1]
        } elseif ($line -match "(?i)^Retry attempt\s+(\d+)") {
            $attempt = [int]$Matches[1]
        }

        if ($isBlip) {
            $now = Get-Date
            if ($lastBlipAt -and (($now - $lastBlipAt).TotalSeconds -gt $blipStreakGapSeconds)) {
                Write-Log "INFO: blip streak reset after quiet gap"
                $reconnectSince = $now
                $cliAttemptHigh = 0
                $script:CliAttemptBaseline = $null
            }
            if (-not $reconnectSince) { $reconnectSince = $now; $cliAttemptHigh = 0; $script:CliAttemptBaseline = $null }
            $lastBlipAt = $now
            if ($null -ne $attempt) {
                # CLI attempt numbers are session-global. After a quiet-gap reset,
                # attempt=3 must not instantly kill - count relative to streak start.
                if ($null -eq $script:CliAttemptBaseline) {
                    $script:CliAttemptBaseline = [Math]::Max(0, $attempt - 1)
                }
                $relative = [Math]::Max(1, $attempt - $script:CliAttemptBaseline)
                if ($relative -gt $cliAttemptHigh) { $cliAttemptHigh = $relative }
            } else {
                $cliAttemptHigh++
            }
            $elapsed = [math]::Round(($now - $reconnectSince).TotalSeconds, 0)
            Write-Log "WARN: transport blip cliAttempt=$cliAttemptHigh (raw=$attempt) elapsed=${elapsed}s"
            # Kill only on a sustained reconnect storm. Cursor often blips for several
            # minutes during long tool runs; require more attempts + longer grace than before.
            #
            # HARD RULE: never transport-kill while job heartbeat is fresh. Heartbeat is
            # only refreshed when the agent (or worker) calls update-agent-job - so a fresh
            # hb means real progress (status/activity write), not CLI reconnect spam.
            # Backstop if hb goes stale: storm rules below. Backstop if blips keep the log
            # warm but hb is dead: silence-watchdog (checks hb age, not just log mtime).
            $stormByCount = ($cliAttemptHigh -ge $maxReconnectAttempts)
            $stormByTime = ($cliAttemptHigh -ge 6 -and $elapsed -ge $reconnectGraceSeconds)
            # Absolute ceiling even without hitting count/time thresholds together
            $stormAbsolute = ($elapsed -ge [Math]::Max($reconnectGraceSeconds * 2, 1200))
            $hbAgeSec = $null
            $hbFresh = $false
            try {
                $liveJobs = Read-Jobs
                $liveJob = @($liveJobs.jobs | Where-Object { $_.id -eq $JobId } | Select-Object -First 1)
                if ($liveJob -and $liveJob.heartbeat) {
                    $hbAgeSec = ((Get-Date) - [datetime]$liveJob.heartbeat).TotalSeconds
                    # 5 minutes: status updates during research/build are usually more frequent
                    if ($hbAgeSec -ge 0 -and $hbAgeSec -lt 300) { $hbFresh = $true }
                }
            } catch {
                $null = $_
            }
            if ($hbFresh) {
                if ($stormByCount -or $stormByTime -or $stormAbsolute) {
                    Write-Log "INFO: transport storm deferred - job heartbeat fresh (age=${hbAgeSec}s) - will not kill"
                }
            } elseif (($stormByCount -or $stormByTime -or $stormAbsolute) -and -not $forceKill) {
                Write-Log "ERROR: transport unhealthy (cliAttempt=$cliAttemptHigh elapsed=${elapsed}s hbAge=${hbAgeSec}s); killing worker agent"
                $forceKill = $true
                Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
                    Where-Object { $_.ParentProcessId -eq $PID -and $_.Name -match "node" } |
                    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
            }
        } elseif ($reconnectSince) {
            $reconnectSince = $null
            $cliAttemptHigh = 0
            $script:CliAttemptBaseline = $null
        }
    }
    if ($null -ne $LASTEXITCODE) { $sessionExit = $LASTEXITCODE }
    if ($forceKill) { $sessionExit = 75 }
} finally {
    $ErrorActionPreference = $prevEap
    if ($silenceWatchdog) {
        Stop-Job $silenceWatchdog -ErrorAction SilentlyContinue
        Remove-Job $silenceWatchdog -Force -ErrorAction SilentlyContinue
    }
}

# Remap Cursor transport / silence deaths (including exit -1) via shared classifier.
# Old bug: silence-watchdog only remapped exit 0, so killed agents parked as worker_exit_-1.
if (Test-Path $LogFile) {
    $remapScript = Join-Path $RepoRoot "scripts\lib\worker-exit-remap.mjs"
    $remapJson = & node $remapScript --exit "$sessionExit" --log $LogFile 2>$null
    if ($LASTEXITCODE -eq 0 -and $remapJson) {
        try {
            $remap = $remapJson | ConvertFrom-Json
            if ($null -ne $remap.code -and [int]$remap.code -ne [int]$sessionExit) {
                Write-Log "INFO: remapping exit $sessionExit -> $($remap.error) ($($remap.reason))"
                $sessionExit = [int]$remap.code
            }
        } catch {
            Write-Log "WARN: exit remap JSON parse failed: $remapJson"
        }
    } elseif (Select-String -Path $LogFile -Pattern "silence-watchdog" -Quiet -ErrorAction SilentlyContinue) {
        Write-Log "INFO: remapping exit $sessionExit -> silence_kill (fallback)"
        $sessionExit = 76
    } elseif (
        $sessionExit -ne 0 -and
        (Select-String -Path $LogFile -Pattern "(?i)RetriableError:\s*Connection failed|Connection failed repeatedly|Connection lost,\s*reconnecting" -Quiet -ErrorAction SilentlyContinue)
    ) {
        Write-Log "INFO: remapping exit $sessionExit -> transport_kill (fallback)"
        $sessionExit = 75
    }
}

# Re-read job status - agent may have marked ready
$jobs = Read-Jobs
$job = @($jobs.jobs | Where-Object { $_.id -eq $JobId } | Select-Object -First 1)
if ($job -and $job.status -eq "ready") {
    Write-Log "Job $JobId marked ready"
} elseif ($sessionExit -eq 75 -or $sessionExit -eq 76) {
    # Fail once -> Manual Review (auto-rerun refused). update-agent-job parks with manualReview flag.
    $errCode = if ($sessionExit -eq 75) { "transport_kill" } else { "silence_kill" }
    Write-Log "Parking $JobId for manual review after $errCode (auto-rerun refused)"
    Invoke-JobUpdate @(
        "--job", $JobId,
        "--status", "failed",
        "--error", $errCode,
        "--activity", "Manual review: process failed once ($errCode) - auto-rerun refused"
    )
    if ($sessionExit -eq 75 -and (Test-Path (Join-Path $RepoRoot "scripts\debug-agent-transport.ps1"))) {
        Start-Process powershell.exe -ArgumentList @(
            "-NoProfile", "-ExecutionPolicy", "Bypass",
            "-File", (Join-Path $RepoRoot "scripts\debug-agent-transport.ps1")
        ) -WindowStyle Minimized | Out-Null
    }
} elseif ($job -and $job.status -notin @("ready", "shipped", "failed", "merging")) {
    # If agent exited without ready, check for commit on branch
    Push-Location $WorktreePath
    $hasCommit = $false
    try {
        $log = git log -1 --oneline 2>$null
        if ($log -match [regex]::Escape($slug)) { $hasCommit = $true }
        if (Test-Path "out\blog\$slug\index.html") { $hasCommit = $true }
    } catch {}
    Pop-Location
    if ($hasCommit -and $sessionExit -eq 0) {
        Invoke-JobUpdate @("--job", $JobId, "--status", "ready", "--activity", "Agent exited 0 with post artifacts")
    } else {
        Invoke-JobUpdate @(
            "--job", $JobId,
            "--status", "failed",
            "--error", "worker_exit_$sessionExit",
            "--activity", "Failed: worker exit $sessionExit"
        )
    }
}

Invoke-JobUpdate @("--worker", "$WorkerId", "--clear", "--pid", "$PID", "--job", $JobId)

# Release the branch so recovery can reuse the same ref. Delete empty litter tips.
try {
    $jobs2 = Read-Jobs
    $job2 = @($jobs2.jobs | Where-Object { $_.id -eq $JobId } | Select-Object -First 1)
    $status2 = if ($job2) { [string]$job2.status } else { "" }
    Push-Location $WorktreePath
    try {
        $mainSha2 = (& git -C $RepoRoot rev-parse master).Trim()
        [void](Invoke-GitQuiet checkout --detach $mainSha2)
        if ($status2 -in @("failed", "shipped") -or $status2 -eq "") {
            $prev = $ErrorActionPreference
            $ErrorActionPreference = "Continue"
            $aheadRaw = & git -C $RepoRoot rev-list --count "master..$branch" 2>&1
            $aheadN2 = 0
            if ($LASTEXITCODE -eq 0) { $aheadN2 = [int]([string]$aheadRaw).Trim() }
            $ErrorActionPreference = $prev
            if ($status2 -eq "shipped" -or $aheadN2 -eq 0) {
                Write-Log "Deleting post branch $branch (status=$status2 ahead=$aheadN2)"
                $prev = $ErrorActionPreference
                $ErrorActionPreference = "Continue"
                & git -C $RepoRoot branch -D $branch 2>&1 | ForEach-Object { Write-Log "git: $_" }
                $ErrorActionPreference = $prev
            } elseif ($status2 -eq "failed") {
                Write-Log "Keeping WIP branch $branch for recovery (ahead=$aheadN2)"
            }
        }
    } finally {
        Pop-Location
    }
} catch {
    Write-Log "WARN branch release: $_"
}

Write-Log "Worker $WorkerId finished (exit=$sessionExit)"
exit $sessionExit
