# Watchdog: every run checks if blog production is active; starts it if not.
# Schedule: scripts\register-blog-production-watchdog.ps1 (logon only; the in-app loop already polls)
#
# -DryRun reports the decision without killing or starting anything.
# Thresholds can be overridden via WATCHDOG_STALE_MINUTES / WATCHDOG_CPU_DELTA_SECONDS (QA only).

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$PidFile = Join-Path $RepoRoot "artifacts\blog-orchestrator.pid"
$LegacyPidFile = Join-Path $RepoRoot "artifacts\blog-production.pid"
$StartingFile = Join-Path $RepoRoot "artifacts\blog-production.starting"
$StateFile = Join-Path $RepoRoot "artifacts\watchdog-state.json"
$ProductionScript = Join-Path $RepoRoot "scripts\run-blog-orchestrator.ps1"
$LegacyProductionScript = Join-Path $RepoRoot "scripts\run-blog-production-local.ps1"
$StreamScript = Join-Path $RepoRoot "scripts\production-stream-server.mjs"
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$LogFile = Join-Path $LogDir "watchdog.log"
$StreamPidFile = Join-Path $RepoRoot "artifacts\production-stream.pid"
$StreamPort = if ($env:STREAM_PORT) { [int]$env:STREAM_PORT } else { 4177 }

# An agent is only stale when EVERY activity signal is older than this and it burned no CPU.
# Local deploy (build + smoke) routinely takes 10-20+ minutes with few src edits.
$StaleMinutes = if ($env:WATCHDOG_STALE_MINUTES) { [double]$env:WATCHDOG_STALE_MINUTES } else { 40 }
$CpuDeltaSeconds = if ($env:WATCHDOG_CPU_DELTA_SECONDS) { [double]$env:WATCHDOG_CPU_DELTA_SECONDS } else { 0.5 }
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
. (Join-Path $RepoRoot "scripts\lib\hidden-process.ps1")
[void](Ensure-BlogAutomationPath)
$JobsFile = Join-Path $RepoRoot "artifacts\agent-jobs.json"
$WorktreeRoot = Get-BlogWorkerRoot $RepoRoot
$LoopPidFile = Join-Path $RepoRoot "artifacts\cursor-watchdog-loop.pid"
$LoopScript = Join-Path $RepoRoot "scripts\cursor-watchdog-loop.ps1"
$WorkerContainersScript = Join-Path $RepoRoot "scripts\worker-containers.ps1"

# Paths the production agent touches while working - include build/deploy outputs so a
# long `npm run deploy` is not mistaken for a hung authoring session.
$ActivityPaths = @(
    (Join-Path $RepoRoot "src"),
    (Join-Path $RepoRoot "scripts"),
    (Join-Path $RepoRoot "public\images"),
    (Join-Path $RepoRoot "artifacts\backend-manifest.json"),
    (Join-Path $RepoRoot "artifacts\agent-jobs.json"),
    (Join-Path $RepoRoot "out"),
    (Join-Path $RepoRoot ".next"),
    $WorktreeRoot
)

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

function Write-Log($Message) {
    $prefix = if ($DryRun) { "[DRYRUN] " } else { "" }
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $prefix$Message"
    for ($i = 0; $i -lt 3; $i++) {
        try {
            Add-Content -Path $LogFile -Value $line -ErrorAction Stop
            break
        } catch [System.IO.IOException] {
            Start-Sleep -Milliseconds (25 * ($i + 1))
        } catch {
            break
        }
    }
    Write-Host $line
}

function Read-Lock {
    if (-not (Test-Path $LockFile)) {
        return $null
    }
    # The orchestrator rewrites the lock every loop; a read landing mid-write used
    # to parse as null and misclassify a live orchestrator as legacy mode. Retry
    # briefly, then fall back to the previous good snapshot instead of null.
    $script:LockReadDegraded = $false
    $lastErr = $null
    for ($i = 0; $i -lt 4; $i++) {
        try {
            return Get-Content $LockFile -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
        } catch {
            $lastErr = $_
            Start-Sleep -Milliseconds (50 * ($i + 1))
        }
    }
    if ($script:LastGoodLockJson) {
        try {
            $fallback = $script:LastGoodLockJson | ConvertFrom-Json
            Write-Log "WARN: lock file unreadable ($($lastErr.Exception.Message)); using last good snapshot"
            $script:LockReadDegraded = $true
            return $fallback
        } catch {}
    }
    $script:LockReadDegraded = $true
    Write-Log "WARN: lock file unreadable ($($lastErr.Exception.Message))"
    return $null
}

function Test-ProcessAlive([int]$ProcessId) {
    if ($ProcessId -le 0) { return $false }
    return $null -ne (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)
}

function Get-ProductionProcesses {
    $found = @()
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        ForEach-Object {
            $cmd = $_.CommandLine
            if ($cmd -and (
                $cmd -match '-File\s+"?[^"]*run-blog-orchestrator\.ps1' -or
                $cmd -match '-File\s+"?[^"]*run-blog-production-local\.ps1'
            )) {
                $found += $_
            }
        }

    return $found
}

function Test-WorkerShellPresent {
    $found = @()
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        ForEach-Object {
            $cmd = $_.CommandLine
            if ($cmd -and $cmd -match 'run-blog-worker\.ps1') {
                $found += $_
            }
        }
    return $found
}

function Test-OrchestratorMode($Lock) {
    if (-not $Lock) { return $false }
    if ($Lock.mode -eq "parallel-worktrees") { return $true }
    if ($Lock.trigger -eq "orchestrator") { return $true }
    return $false
}

# Legacy single-writer mode: agent CLI runs as a node.exe descendant of the production
# shell. Parallel orchestrator mode does NOT host agent CLIs as children - workers are
# sibling hidden shells - so missing agentChild must not trigger a restart.
function Test-AgentChildPresent($Procs) {
    if (-not $Procs -or $Procs.Count -eq 0) { return $false }

    $allProcs = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue)
    $wanted = New-Object System.Collections.Generic.HashSet[int]
    foreach ($p in $Procs) { [void]$wanted.Add([int]$p.ProcessId) }

    for ($depth = 0; $depth -lt 6; $depth++) {
        $added = $false
        foreach ($p in $allProcs) {
            if ($p.ParentProcessId -and $wanted.Contains([int]$p.ParentProcessId)) {
                if ($wanted.Add([int]$p.ProcessId)) {
                    $added = $true
                    $cmd = if ($p.CommandLine) { $p.CommandLine } else { "" }
                    $name = $p.Name
                    if ($name -eq "node.exe") { return $true }
                    if ($name -match "^(npm|npx|node|cmd|powershell|pwsh)\.exe$" -and (
                        $cmd -match "next build|npm run deploy|smoke-test|playwright|qa-homepage|claim-next|merge-ready|update-agent-job"
                    )) { return $true }
                }
            }
        }
        if (-not $added) { break }
    }
    return $false
}

# Total CPU seconds of the production shells plus their descendants (the agent CLI does
# the real work in a child node.exe, so the shell's own CPU barely moves).
function Get-ProductionCpuSeconds($Procs) {
    if (-not $Procs -or $Procs.Count -eq 0) { return $null }

    $allProcs = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue)
    $wanted = New-Object System.Collections.Generic.HashSet[int]
    foreach ($p in $Procs) { [void]$wanted.Add([int]$p.ProcessId) }

    # Walk down the tree a few generations to catch node.exe -> child agent processes.
    for ($depth = 0; $depth -lt 4; $depth++) {
        $added = $false
        foreach ($p in $allProcs) {
            if ($p.ParentProcessId -and $wanted.Contains([int]$p.ParentProcessId)) {
                if ($wanted.Add([int]$p.ProcessId)) { $added = $true }
            }
        }
        if (-not $added) { break }
    }

    $total = 0.0
    foreach ($id in $wanted) {
        $proc = Get-Process -Id $id -ErrorAction SilentlyContinue
        if ($proc) {
            try { $total += $proc.TotalProcessorTime.TotalSeconds } catch {}
        }
    }
    return $total
}

function Get-NewestActivityUtc {
    $newest = $null
    foreach ($path in $ActivityPaths) {
        if (-not (Test-Path $path)) { continue }
        $item = Get-Item $path -ErrorAction SilentlyContinue
        if ($item -and -not $item.PSIsContainer) {
            if (-not $newest -or $item.LastWriteTimeUtc -gt $newest) { $newest = $item.LastWriteTimeUtc }
            continue
        }
        $candidate = Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTimeUtc -Descending |
            Select-Object -First 1
        if ($candidate -and (-not $newest -or $candidate.LastWriteTimeUtc -gt $newest)) {
            $newest = $candidate.LastWriteTimeUtc
        }
    }
    return $newest
}

function Get-LatestProductionLogUtc {
    $log = Get-ChildItem -Path $LogDir -Filter "production-*.log" -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTimeUtc -Descending |
        Select-Object -First 1
    if ($log) { return $log.LastWriteTimeUtc }
    return $null
}

function Get-HeartbeatUtc($Lock) {
    if (-not $Lock -or -not $Lock.lastHeartbeat) { return $null }
    try {
        $ts = [DateTime]::Parse($Lock.lastHeartbeat).ToUniversalTime()
        # The agent writes rounded timestamps that can land in the future; a future
        # heartbeat would read as permanently fresh and mask a hang, so ignore it.
        if ($ts -gt [DateTime]::UtcNow.AddMinutes(5)) { return $null }
        return $ts
    } catch {
        return $null
    }
}

function Read-State {
    if (-not (Test-Path $StateFile)) { return $null }
    try {
        return Get-Content $StateFile -Raw | ConvertFrom-Json
    } catch {
        return $null
    }
}

function Write-State($CpuSeconds) {
    if ($DryRun) { return }
    $state = @{
        cpuSeconds = $CpuSeconds
        recordedAt = (Get-Date).ToUniversalTime().ToString("o")
    }
    $state | ConvertTo-Json | Set-Content -Path $StateFile -Encoding UTF8
}

# Returns a list of stale reasons. Empty list means the agent is considered alive.
function Get-StaleReasons($Lock, $Procs) {
    $now = (Get-Date).ToUniversalTime()
    $signals = @{
        "repo edit"     = Get-NewestActivityUtc
        "heartbeat"     = Get-HeartbeatUtc $Lock
        "production log" = Get-LatestProductionLogUtc
    }

    $freshSignals = @()
    $ageSummary = @()
    foreach ($name in $signals.Keys) {
        $ts = $signals[$name]
        if (-not $ts) {
            $ageSummary += "${name}=none"
            continue
        }
        $ageMin = [math]::Round(($now - $ts).TotalMinutes, 1)
        $ageSummary += "${name}=${ageMin}m"
        if ($ageMin -le $StaleMinutes) { $freshSignals += $name }
    }

    $cpuNow = Get-ProductionCpuSeconds $Procs
    $prevState = Read-State
    $cpuAdvanced = $false
    if ($null -ne $cpuNow -and $prevState -and $null -ne $prevState.cpuSeconds) {
        # Absolute delta: child processes come and go, so tree CPU can drop while the
        # agent is healthily working. Any movement at all means something is running.
        $delta = $cpuNow - [double]$prevState.cpuSeconds
        if ([math]::Abs($delta) -ge $CpuDeltaSeconds) { $cpuAdvanced = $true }
        $ageSummary += ("cpuDelta=" + [math]::Round($delta, 2) + "s")
    } elseif ($null -ne $cpuNow) {
        # First observation: no baseline yet, so treat as alive and record it.
        $cpuAdvanced = $true
        $ageSummary += "cpuDelta=baseline"
    }
    Write-State $cpuNow

    $orchMode = Test-OrchestratorMode $Lock
    $workerShells = @(Test-WorkerShellPresent)
    $agentAlive = Test-AgentChildPresent $Procs
    $ageSummary += "mode=$(if ($orchMode) { 'orch' } else { 'legacy' })"
    $ageSummary += "agentChild=$agentAlive"
    $ageSummary += "workerShells=$($workerShells.Count)"
    $script:ActivitySummary = ($ageSummary -join ", ")

    if ($orchMode) {
        # Orchestrator heartbeat / job-queue edits / worker shells are the liveness signals.
        if ($freshSignals.Count -gt 0 -or $cpuAdvanced -or $workerShells.Count -gt 0) {
            return @()
        }
        return @("orchestrator idle ${StaleMinutes}m with no workers and no CPU progress ($script:ActivitySummary)")
    }

    if (-not $agentAlive) {
        return @("agent CLI child process missing ($script:ActivitySummary)")
    }

    if ($freshSignals.Count -gt 0 -or $cpuAdvanced) {
        return @()
    }

    return @("no activity in ${StaleMinutes}m and no CPU progress ($script:ActivitySummary)")
}

function Stop-ProductionProcesses {
    if ($DryRun) {
        Write-Log "would stop production processes"
        return
    }
    foreach ($proc in @(Get-ProductionProcesses)) {
        Write-Log "Stopping production shell PID $($proc.ProcessId)"
        Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path $PidFile) {
        $rawPid = Get-Content $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($rawPid -match '^\d+$') {
            Stop-Process -Id ([int]$rawPid) -Force -ErrorAction SilentlyContinue
        }
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path $StartingFile) {
        Remove-Item $StartingFile -Force -ErrorAction SilentlyContinue
    }
    Remove-Item $StateFile -Force -ErrorAction SilentlyContinue
}

function Clear-RunningLock($Lock, $Notes) {
    if ($DryRun) {
        Write-Log "would clear running lock: $Notes"
        return
    }
    $cleared = @{
        status = "idle"
        lastHeartbeat = (Get-Date).ToUniversalTime().ToString("o")
        startedAt = if ($Lock) { $Lock.startedAt } else { $null }
        runId = $null
        trigger = "watchdog-cleared-stale"
        lastSlug = if ($Lock) { $Lock.lastSlug } else { $null }
        notes = $Notes
    }
    $cleared | ConvertTo-Json | Set-Content -Path $LockFile -Encoding UTF8
}

function Test-StartInProgress {
    if (-not (Test-Path $StartingFile)) { return $false }
    $ageMinutes = ((Get-Date).ToUniversalTime() - (Get-Item $StartingFile).LastWriteTimeUtc).TotalMinutes
    if ($ageMinutes -ge 3) {
        Write-Log "Stale .starting file (${ageMinutes}m old). Removing."
        if (-not $DryRun) {
            Remove-Item $StartingFile -Force -ErrorAction SilentlyContinue
        }
        return $false
    }
    return $true
}

function Write-OrchestratorLastWords {
    # Forensics only: when the watchdog decides the orchestrator is gone/stale,
    # snapshot what it last emitted so restart causes are attributable later.
    $oStdout = Join-Path $LogDir "orchestrator-stdout.log"
    $oStderr = Join-Path $LogDir "orchestrator-stderr.log"
    try {
        $tail = @(Get-Content $oStdout -Tail 3 -ErrorAction SilentlyContinue |
            ForEach-Object { $t = "$_"; if ($t.Length -gt 200) { $t.Substring(0, 200) } else { $t } })
        if ($tail.Count -gt 0) {
            Write-Log ("orchestrator stdout tail: " + ($tail -join " ||| "))
        }
        $errFile = Get-Item $oStderr -ErrorAction SilentlyContinue
        if ($errFile) {
            Write-Log ("orchestrator stderr bytes={0:N0} lastWrite={1:yyyy-MM-dd HH:mm:ss}" -f $errFile.Length, $errFile.LastWriteTime)
        }
    } catch {
        # Never let forensics break the restart path.
    }
}

function Start-ProductionAgent {
    if ($DryRun) {
        Write-Log "would start production agent"
        return
    }

    Write-Log "Starting orchestrator in background"
    New-Item -ItemType File -Path $StartingFile -Force | Out-Null
    # Path has spaces ("AI Projects") - quote -File in a single argument string.
    # CreateNoWindow via Start-HiddenProcess (do not use Start-Process -WindowStyle Hidden).
    $psArgs = "-NoProfile -ExecutionPolicy Bypass -File `"$ProductionScript`""
    $stdout = Join-Path $LogDir "orchestrator-stdout.log"
    $stderr = Join-Path $LogDir "orchestrator-stderr.log"
    $proc = Start-HiddenProcess -FilePath "powershell.exe" -ArgumentList $psArgs -WorkingDirectory $RepoRoot `
        -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    Write-Log "Spawned orchestrator shell PID $($proc.Id)"

    # Agent CLI can take 60-90s before the production shell shows up in process queries.
    for ($i = 0; $i -lt 120; $i++) {
        Start-Sleep -Seconds 1
        $procs = @(Get-ProductionProcesses)
        $spawnAlive = $false
        try {
            $spawnAlive = $null -ne (Get-Process -Id $proc.Id -ErrorAction SilentlyContinue)
        } catch {}
        if ($procs.Count -gt 0 -or $spawnAlive -or (Test-Path $PidFile)) {
            Write-Log "Production agent confirmed running after $($i + 1)s (procs=$($procs.Count), spawnAlive=$spawnAlive)"
            Remove-Item $StartingFile -Force -ErrorAction SilentlyContinue
            return
        }
    }

    Remove-Item $StartingFile -Force -ErrorAction SilentlyContinue
    Write-Log "ERROR: production shell PID $($proc.Id) did not survive startup; will retry next run"
}

function Test-StreamListening {
    try {
        $conn = Get-NetTCPConnection -LocalPort $StreamPort -State Listen -ErrorAction SilentlyContinue |
            Select-Object -First 1
        return $null -ne $conn
    } catch {
        return $null -ne (netstat -ano | Select-String ":$StreamPort\s+.*LISTENING")
    }
}

function Test-WatchdogLoopAlive {
    if (Test-Path $LoopPidFile) {
        $raw = Get-Content $LoopPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($raw -match '^\d+$' -and (Test-ProcessAlive ([int]$raw))) {
            return $true
        }
    }
    $found = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and $_.CommandLine -like "*cursor-watchdog-loop.ps1*" } |
        Select-Object -First 1
    return $null -ne $found
}

function Ensure-WatchdogLoop {
    if ($DryRun) {
        if (-not (Test-WatchdogLoopAlive)) {
            Write-Log "would start watchdog loop"
        }
        return
    }
    if (Test-WatchdogLoopAlive) { return }
    if (-not (Test-Path $LoopScript)) {
        Write-Log "WARN: watchdog loop script missing at $LoopScript"
        return
    }
    Write-Log "Watchdog loop not running - starting"
    $argList = "-NoProfile -ExecutionPolicy Bypass -File `"$LoopScript`""
    $stdout = Join-Path $LogDir "watchdog-loop-stdout.log"
    $stderr = Join-Path $LogDir "watchdog-loop-stderr.log"
    $proc = Start-HiddenProcess -FilePath "powershell.exe" -ArgumentList $argList -WorkingDirectory $RepoRoot `
        -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    Start-Sleep -Seconds 2
    $alive = $false
    if ($proc -and $proc.Id) {
        $alive = $null -ne (Get-Process -Id $proc.Id -ErrorAction SilentlyContinue)
    }
    if ($alive) {
        Write-Log "Watchdog loop started (PID $($proc.Id))"
    } else {
        Write-Log "WARN: watchdog loop failed to stay up"
    }
}

function Ensure-WorkerContainers {
    if ($DryRun) {
        Write-Log "would ensure Docker worker containers (no compose down)"
        return
    }
    if (-not (Test-Path $WorkerContainersScript)) { return }
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Log "WARN: docker not on PATH; cannot ensure worker containers"
        return
    }
    try {
        Write-Log "Ensuring Docker worker containers (blog-worker-1..5; never compose down)"
        & powershell -NoProfile -ExecutionPolicy Bypass -File $WorkerContainersScript -Action ensure
        if ($LASTEXITCODE -ne 0) {
            Write-Log "WARN: worker-containers ensure exited $LASTEXITCODE"
        }
    } catch {
        Write-Log "WARN: worker-containers ensure failed: $_"
    }
}

function Ensure-StreamDashboard {
    if ($DryRun) {
        if (-not (Test-StreamListening)) {
            Write-Log "would start stream dashboard on :$StreamPort"
        }
        return
    }
    if (Test-StreamListening) { return }
    if (-not (Test-Path $StreamScript)) {
        Write-Log "WARN: stream script missing; cannot restart dashboard"
        return
    }
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Log "WARN: node not found; cannot restart stream dashboard"
        return
    }

    Write-Log "Stream dashboard down on :$StreamPort - restarting"
    $stdout = Join-Path $LogDir "production-stream-stdout.log"
    $stderr = Join-Path $LogDir "production-stream-stderr.log"
    $proc = Start-Process -FilePath "node" `
        -ArgumentList "`"$StreamScript`"" `
        -WorkingDirectory $RepoRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -PassThru
    $proc.Id | Out-File -FilePath $StreamPidFile -Encoding ascii -Force
    Start-Sleep -Milliseconds 800
    if (Test-StreamListening) {
        Write-Log "Stream dashboard restarted (PID $($proc.Id)) -> http://127.0.0.1:$StreamPort/"
    } else {
        Write-Log "WARN: stream dashboard PID $($proc.Id) did not bind :$StreamPort"
    }
}

$lock = Read-Lock
if ($lock -and $lock.status -eq "paused") {
    Write-Log "Automation paused (lock status=paused). No action."
    return
}

# Remember the last successfully parsed lock for torn-read fallback.
try {
    if ($null -ne $lock) { $script:LastGoodLockJson = $lock | ConvertTo-Json -Depth 10 }
} catch {}

# A freshly (re)started orchestrator needs time before staleness logic applies:
# its lock may not exist yet and CPU baseline starts at zero. Without this grace
# window the watchdog has killed healthy orchestrators minutes after start.
$orchStartGraceMin = 5
$graceActive = $false
if ($script:LastGoodLockJson) {
    try {
        $g = $script:LastGoodLockJson | ConvertFrom-Json
        if ($g.startedAt) {
            $ageMin = ((Get-Date).ToUniversalTime() - [DateTime]::Parse($g.startedAt).ToUniversalTime()).TotalMinutes
            if ($ageMin -lt $orchStartGraceMin) { $graceActive = $true }
        }
    } catch {}
}

# Keep stream, in-session watchdog loop, and worker containers alive.
# Logon scheduled task + the in-app loop restart them if Cursor/session/crash took them down.
Ensure-StreamDashboard
Ensure-WatchdogLoop
Ensure-WorkerContainers

if (Test-StartInProgress) {
    Write-Log "Production start already in progress (.starting file). No action."
    return
}

$pidFromFile = $null
if (Test-Path $PidFile) {
    $rawPid = (Get-Content $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
    if ($rawPid -match '^\d+$') {
        $pidFromFile = [int]$rawPid
    }
}

$pidAlive = Test-ProcessAlive $pidFromFile
$procs = @(Get-ProductionProcesses)
$processRunning = $pidAlive -or ($procs.Count -gt 0)

if ($processRunning) {
    if ($graceActive) {
        Write-Log "Production within start grace window (<${orchStartGraceMin}m since startedAt). Skipping staleness check."
        return
    }
    if ($script:LockReadDegraded) {
        Write-Log "Lock read degraded this cycle - skipping staleness check to avoid a false kill."
        return
    }
    $staleReasons = @(Get-StaleReasons $lock $procs)
    if ($staleReasons.Count -gt 0) {
        Write-Log "Stale production detected: $($staleReasons -join '; '). Restarting."
        Write-OrchestratorLastWords
        Stop-ProductionProcesses
        Clear-RunningLock $lock ("Restarting after stale: " + ($staleReasons -join "; "))
        $processRunning = $false
        $lock = $null
    } else {
        Write-Log "Production active (lock=$(if ($lock) { $lock.status } else { 'none' })). Activity: $script:ActivitySummary"
        return
    }
}

if ($processRunning -and $lock -and $lock.status -ne "running") {
    Write-Log "Production process running but lock=$($lock.status). No action."
    return
}

if (-not $processRunning) {
    if ($lock -and $lock.status -eq "running") {
        Write-Log "Lock says running but no process found. Clearing stale lock."
        Write-OrchestratorLastWords
        Clear-RunningLock $lock "Cleared by watchdog: process not found."
    }

    if (-not (Test-Path $ProductionScript)) {
        Write-Log "ERROR: Production script missing at $ProductionScript"
        return
    }

    if (-not (Get-Command agent -ErrorAction SilentlyContinue)) {
        Write-Log "ERROR: Cursor agent CLI not found"
        return
    }

    $auth = & agent status 2>&1 | Out-String
    if ($auth -match "Not logged in") {
        Write-Log "ERROR: agent CLI not logged in. Run: agent login"
        return
    }

    Start-ProductionAgent
    return
}

Write-Log "Unexpected watchdog state. No action."
return
