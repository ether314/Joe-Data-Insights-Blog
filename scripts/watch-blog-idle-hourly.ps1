# Hourly idle detector: if the conveyor is running-but-has-nothing-to-claim,
# spawn a Cursor `agent` CLI session to refill unused novel themes.
# Never docker compose down. Never Firebase. Never force-start a paused lock.
#
# Usage:
#   powershell -File scripts/watch-blog-idle-hourly.ps1 -DryRun
#   powershell -File scripts/watch-blog-idle-hourly.ps1
#   powershell -File scripts/watch-blog-idle-hourly.ps1 -SpawnAgent   # internal
#
# Schedule: scripts/register-blog-idle-hourly-watchdog.ps1
# Log: artifacts/automation-logs/idle-hourly-watchdog.log

param(
    [switch]$DryRun,
    [switch]$SpawnAgent
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
. (Join-Path $RepoRoot "scripts\lib\hidden-process.ps1")
[void](Ensure-BlogAutomationPath)

$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$JobsFile = Join-Path $RepoRoot "artifacts\agent-jobs.json"
$PidFile = Join-Path $RepoRoot "artifacts\novel-theme-refill.pid"
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$LogFile = Join-Path $LogDir "idle-hourly-watchdog.log"
$AgentLog = Join-Path $LogDir "novel-theme-refill.log"
$PromptNovel = Join-Path $RepoRoot "scripts\prompts\novel-theme-refill.txt"
$PromptIdle = Join-Path $RepoRoot "scripts\prompts\idle-refill-worker.txt"
$PromptFile = if (Test-Path $PromptNovel) { $PromptNovel } else { $PromptIdle }
$ThisScript = $MyInvocation.MyCommand.Path
$PipelineStatuses = @("claimed", "researching", "building", "qa", "ready", "merging")

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

function Write-Log {
    param([string]$Message)
    $prefix = ""
    if ($script:DetectorDryRun) { $prefix = "[DRYRUN] " }
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $prefix$Message"
    for ($i = 0; $i -lt 3; $i++) {
        try {
            [void](Add-Content -Path $script:LogFile -Value $line -ErrorAction Stop)
            break
        } catch [System.IO.IOException] {
            Start-Sleep -Milliseconds (25 * ($i + 1))
        } catch {
            break
        }
    }
    Microsoft.PowerShell.Utility\Write-Host $line
}

function Read-JsonFile {
    param([string]$Path)
    if (-not (Test-Path $Path)) { return $null }
    $lastErr = $null
    for ($i = 0; $i -lt 4; $i++) {
        try {
            $raw = (Get-Content $Path -Raw -ErrorAction Stop) -replace '^\uFEFF', ''
            return ($raw | ConvertFrom-Json -ErrorAction Stop)
        } catch {
            $lastErr = $_
            Start-Sleep -Milliseconds (50 * ($i + 1))
        }
    }
    Write-Log "WARN: could not parse $Path ($lastErr)"
    return $null
}

function Test-PidAlive {
    param([int]$ProcessId)
    if ($ProcessId -le 0) { return $false }
    return $null -ne (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)
}

function Get-IdleRefillPids {
    $found = New-Object System.Collections.Generic.List[int]
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | ForEach-Object {
        $cmd = $_.CommandLine
        if (-not $cmd) { return }
        if ([int]$_.ProcessId -eq $PID) { return }
        $isSpawn = ($cmd -match 'watch-blog-idle-hourly\.ps1' -and $cmd -match '-SpawnAgent')
        $isRefillAgent = ($cmd -match 'IDLE-REFILL' -or $cmd -match 'idle-refill-worker' -or $cmd -match 'novel-theme-refill' -or $cmd -match 'NOVEL-THEME REFILL')
        if ($isSpawn -or $isRefillAgent) {
            [void]$found.Add([int]$_.ProcessId)
        }
    }
    return @($found)
}

function Test-IdleRefillAlreadyRunning {
    if (Test-Path $script:PidFile) {
        $raw = Get-Content $script:PidFile -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($raw -match '^\d+$') {
            $id = [int]$raw
            if ($id -ne $PID -and (Test-PidAlive $id)) { return $id }
        }
        Remove-Item $script:PidFile -Force -ErrorAction SilentlyContinue
    }
    $live = @(Get-IdleRefillPids)
    if ($live.Count -gt 0) { return $live[0] }
    return $null
}

function Test-RefillCooldownActive {
    $stampPath = Join-Path $script:RepoRoot "artifacts\novel-theme-refill.stamp.json"
    $j = Read-JsonFile $stampPath
    if (-not $j -or -not $j.lastSpawnAt) { return $false }
    try {
        $then = [datetimeoffset]::Parse([string]$j.lastSpawnAt)
        return (([datetimeoffset]::UtcNow) - $then).TotalMinutes -lt 15
    } catch {
        return $false
    }
}

function Get-LockStatus {
    $lock = Read-JsonFile $script:LockFile
    if (-not $lock) { return "missing" }
    $status = [string]$lock.status
    if (-not $status) { return "unknown" }
    return $status
}

function Get-PipelineJobCount {
    $data = Read-JsonFile $script:JobsFile
    if (-not $data -or -not $data.jobs) { return 0 }
    $n = 0
    foreach ($j in @($data.jobs)) {
        if ($script:PipelineStatuses -contains [string]$j.status) { $n++ }
    }
    return $n
}

function Get-RunningWorkerContainerCount {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { return -1 }
    $up = 0
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        foreach ($id in 1..5) {
            $name = "blog-worker-$id"
            $state = (& docker inspect -f "{{.State.Running}}" $name 2>$null | Out-String).Trim()
            if ($state -eq "true") { $up++ }
        }
    } catch {
        return -1
    } finally {
        $ErrorActionPreference = $prev
    }
    return $up
}

function Get-ClaimDryRunClaimed {
    $claimScript = Join-Path $script:RepoRoot "scripts\claim-next-topics.mjs"
    $script:LastClaimCount = $null
    if (-not (Test-Path $claimScript)) { return }
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) { return }
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $claimOut = & node $claimScript --dry-run --force-slots 2 2>&1 | Out-String
        $claimedN = 0
        $retriedN = 0
        if ($claimOut -match '"claimed"\s*:\s*(\d+)') { $claimedN = [int]$Matches[1] }
        if ($claimOut -match '"retried"\s*:\s*(\d+)') { $retriedN = [int]$Matches[1] }
        if ($claimOut -match '"claimed"\s*:') {
            $script:LastClaimCount = ($claimedN + $retriedN)
        }
        Write-Log "claim-next-topics dry-run parsed claimed=$claimedN retried=$retriedN"
    } catch {
        Write-Log "WARN: claim dry-run failed: $_"
        $script:LastClaimCount = $null
    } finally {
        $ErrorActionPreference = $prev
    }
}

function Invoke-IdleRefillAgent {
    if (-not (Test-Path $script:PromptFile)) {
        Write-Log "ERROR: missing prompt $($script:PromptFile)"
        return
    }
    $agentPath = Ensure-BlogAgentCliOnPath
    if (-not $agentPath -and -not (Get-Command agent -ErrorAction SilentlyContinue)) {
        Write-Log "ERROR: Cursor agent CLI not found (install cursor-agent / run agent login). Scheduler will retry next hour."
        return
    }
    $auth = & agent status 2>&1 | Out-String
    if ($auth -match "Not logged in") {
        Write-Log "ERROR: agent CLI not logged in. Run: agent login"
        return
    }

    $prompt = (Get-Content $script:PromptFile -Raw).Replace("{{REPO_ROOT}}", $script:RepoRoot)
    $PID | Out-File -FilePath $script:PidFile -Encoding ascii -Force
    Write-Log "Spawning idle-refill agent in workspace $($script:RepoRoot) (pid file $($script:PidFile), this PID $PID)"
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $exitCode = 0
    try {
        & agent -p --force --trust --workspace $script:RepoRoot $prompt 2>&1 | ForEach-Object {
            $text = if ($_ -is [System.Management.Automation.ErrorRecord]) { $_.Exception.Message } else { "$_" }
            if ($text) { Write-Log "agent: $text" }
        }
        $exitCode = [int]$LASTEXITCODE
    } catch {
        Write-Log "ERROR: agent invocation failed: $_"
        $exitCode = 1
    } finally {
        $ErrorActionPreference = $prev
        Remove-Item $script:PidFile -Force -ErrorAction SilentlyContinue
    }
    Write-Log "Idle-refill agent exited $exitCode"
}

function Start-IdleRefillHidden {
    $psExe = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
    $arg = "-NoProfile -ExecutionPolicy Bypass -File `"$($script:ThisScript)`" -SpawnAgent"
    $proc = Start-HiddenProcess -FilePath $psExe -ArgumentList $arg -WorkingDirectory $script:RepoRoot `
        -RedirectStandardOutput $script:AgentLog -RedirectStandardError $script:AgentLog
    if ($proc -and $proc.Id) {
        $proc.Id | Out-File -FilePath $script:PidFile -Encoding ascii -Force
        Write-Log "Spawned hidden idle-refill shell PID $($proc.Id) (agent log $($script:AgentLog))"
    } else {
        Write-Log "ERROR: hidden spawn returned no PID"
    }
}

# Copy params into script scope so nested functions do not collide with JSON "dryRun".
$script:RepoRoot = $RepoRoot
$script:LockFile = $LockFile
$script:JobsFile = $JobsFile
$script:PidFile = $PidFile
$script:LogDir = $LogDir
$script:LogFile = $LogFile
$script:AgentLog = $AgentLog
$script:PromptFile = $PromptFile
$script:ThisScript = $ThisScript
$script:PipelineStatuses = $PipelineStatuses
$script:DetectorDryRun = [bool]$DryRun.IsPresent
$script:LastClaimCount = $null

if ($SpawnAgent) {
    $script:DetectorDryRun = $false
    $script:LogFile = $script:AgentLog
    try {
        $lockStatus = Get-LockStatus
        if ($lockStatus -eq "paused") {
            Write-Log "Lock status=paused. SpawnAgent skip (will not resume)."
            return
        }
        $already = Test-IdleRefillAlreadyRunning
        if ($already) {
            Write-Log "Refill already running PID $already. SpawnAgent skip."
            return
        }
        Invoke-IdleRefillAgent
    } catch {
        Write-Log "ERROR: SpawnAgent failed: $_"
        Remove-Item $script:PidFile -Force -ErrorAction SilentlyContinue
    }
    return
}

$action = "skip"
$lockStatus = "unknown"
$pipeline = 0
$workersUp = -1
$already = $null
try {
    $lockStatus = Get-LockStatus
    $pipeline = Get-PipelineJobCount
    $workersUp = Get-RunningWorkerContainerCount
    $already = Test-IdleRefillAlreadyRunning
} catch {
    Write-Log "ERROR: idle detector probes failed: $_"
}

Write-Log "tick lock=$lockStatus pipeline=$pipeline workersUp=$workersUp refillPid=$(if ($already) { $already } else { 'none' }) dryRun=$($script:DetectorDryRun)"

if ($lockStatus -eq "paused") {
    $action = "paused"
} elseif ($already) {
    $action = "already"
} elseif (-not (($lockStatus -eq "running") -or ($workersUp -ge 5))) {
    $action = "process-down"
} elseif ($pipeline -gt 0) {
    $action = "busy"
} else {
    Write-Log "Checking claim-next-topics --dry-run..."
    Get-ClaimDryRunClaimed
    if ($null -ne $script:LastClaimCount -and $script:LastClaimCount -gt 0) {
        $action = "claimer-has-work"
    } else {
        $action = "idle-refill"
    }
}

switch ($action) {
    "paused" {
        Write-Log "Lock status=paused (operator stop). Skip. Will not resume."
    }
    "already" {
        Write-Log "Idle-refill agent already running (PID $already). Skip."
    }
    "process-down" {
        Write-Log "Process plane not running (lock=$lockStatus workersUp=$workersUp). Leave to CursorBlogProductionWatchdog. Skip."
    }
    "busy" {
        Write-Log "Busy: $pipeline job(s) in claimed/researching/building/qa/ready/merging. Skip."
    }
    "claimer-has-work" {
        Write-Log "Claim dry-run claimed/retried=$($script:LastClaimCount) - orchestrator should dispatch. Skip agent."
    }
    "idle-refill" {
        $claimNote = if ($null -eq $script:LastClaimCount) { "claim-dry-run=unavailable" } else { "claim-dry-run=0" }
        Write-Log "Idle: lock=$lockStatus workersUp=$workersUp pipeline=0 $claimNote. Need novel-theme refill via agent CLI."
        if ($script:DetectorDryRun) {
            Write-Log "would spawn hidden agent (scripts/prompts/novel-theme-refill.txt) - no docker bounce, no resume, no Firebase"
        } elseif (Test-RefillCooldownActive) {
            Write-Log "Refill cooldown active (15m). Skip hourly spawn (in-process claimer is primary)."
        } else {
            $agentPath = Ensure-BlogAgentCliOnPath
            if (-not $agentPath -and -not (Get-Command agent -ErrorAction SilentlyContinue)) {
                Write-Log "ERROR: Cursor agent CLI not found. Not crashing scheduler; retry next hour."
            } else {
                try {
                    Start-IdleRefillHidden
                } catch {
                    Write-Log "ERROR: hidden spawn failed: $_"
                }
            }
        }
    }
    default {
        Write-Log "Skip (action=$action)."
    }
}
