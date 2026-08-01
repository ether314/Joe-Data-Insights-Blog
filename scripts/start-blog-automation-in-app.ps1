# Starts the full in-app blog automation stack:
# 1. Cursor self-hosted worker (for cloud automations on this machine)
# 2. Production stream dashboard at http://127.0.0.1:4177
# 3. 10-minute watchdog background loop
# 4. Immediate watchdog check - starts 5-agent orchestrator (1 + 4 worktree workers) if idle
#
# Usage: powershell -ExecutionPolicy Bypass -File scripts/start-blog-automation-in-app.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$WatchdogScript = Join-Path $RepoRoot "scripts\watch-blog-production.ps1"
$WorkerScript = Join-Path $RepoRoot "scripts\start-cursor-worker.ps1"
$StreamScript = Join-Path $RepoRoot "scripts\production-stream-server.mjs"
$LocalBlogScript = Join-Path $RepoRoot "scripts\local-blog-server.mjs"
$LoopPidFile = Join-Path $RepoRoot "artifacts\cursor-watchdog-loop.pid"
$StreamPidFile = Join-Path $RepoRoot "artifacts\production-stream.pid"
$LocalBlogPidFile = Join-Path $RepoRoot "artifacts\local-blog-server.pid"
$StreamPort = if ($env:STREAM_PORT) { [int]$env:STREAM_PORT } else { 4177 }
$LocalBlogPort = if ($env:BLOG_LOCAL_PORT) { [int]$env:BLOG_LOCAL_PORT } else { 4173 }
$WorkerName = "$env:COMPUTERNAME-blog"
$BootstrapScript = Join-Path $RepoRoot "scripts\bootstrap-worktrees.ps1"
$WorktreeRoot = if ($env:BLOG_WORKTREE_ROOT) { $env:BLOG_WORKTREE_ROOT } else {
    Join-Path (Split-Path -Parent $RepoRoot) "data-insights-blog-worktrees"
}
$LocksDir = Join-Path $RepoRoot "artifacts\locks"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
New-Item -ItemType Directory -Path $LocksDir -Force | Out-Null
Set-Location $RepoRoot

function Write-Log($Message) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Add-Content -Path (Join-Path $LogDir "automation-startup.log") -Value $line
    Write-Host $line
}

function Test-AgentCli {
    if (-not (Get-Command agent -ErrorAction SilentlyContinue)) {
        throw "Cursor agent CLI not found. Install from cursor.com/docs/cli"
    }
    $auth = & agent status 2>&1 | Out-String
    if ($auth -match "Not logged in") {
        throw "agent CLI not logged in. Run: agent login"
    }
}

function Test-WorkerRunning {
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
        Where-Object {
            $_.CommandLine -and (
                $_.CommandLine -like "*agent*worker start*" -or
                $_.CommandLine -like "*worker start*--worker-dir*$([regex]::Escape($RepoRoot))*"
            )
        } |
        Select-Object -First 1
}

function Start-WorkerIfNeeded {
    if (Test-WorkerRunning) {
        Write-Log "Cursor worker already running for $RepoRoot"
        return
    }
    Write-Log "Starting Cursor self-hosted worker ($WorkerName)"
    $workerArgs = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WorkerScript`""
    Start-Process -FilePath "powershell.exe" -ArgumentList $workerArgs -WorkingDirectory $RepoRoot | Out-Null
    Start-Sleep -Seconds 4
    if (-not (Test-WorkerRunning)) {
        Write-Log "WARN: Worker may still be starting - check agent worker debug"
    } else {
        Write-Log "Worker started"
    }
}

function Test-PortListening([int]$Port) {
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Select-Object -First 1
        return $null -ne $conn
    } catch {
        $net = netstat -ano | Select-String ":$Port\s+.*LISTENING"
        return $null -ne $net
    }
}

function Test-StreamListening {
    return Test-PortListening $StreamPort
}

function Get-StreamProcesses {
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
        Where-Object {
            $_.CommandLine -and $_.CommandLine -like "*production-stream-server.mjs*"
        }
}

function Start-LocalBlogIfNeeded {
    if (Test-PortListening $LocalBlogPort) {
        Write-Log "Local blog already listening on http://127.0.0.1:$LocalBlogPort/"
        return
    }
    if (-not (Test-Path $LocalBlogScript)) {
        Write-Log "WARN: Local blog script missing at $LocalBlogScript"
        return
    }
    if (-not (Test-Path (Join-Path $RepoRoot "out"))) {
        Write-Log "WARN: out/ missing - skip local blog until first build"
        return
    }
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Log "WARN: node not found; cannot start local blog"
        return
    }

    Write-Log "Starting local blog preview on http://127.0.0.1:$LocalBlogPort/"
    $stdout = Join-Path $LogDir "local-blog-stdout.log"
    $stderr = Join-Path $LogDir "local-blog-stderr.log"
    $proc = Start-Process -FilePath "node" `
        -ArgumentList "`"$LocalBlogScript`"" `
        -WorkingDirectory $RepoRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -PassThru
    $proc.Id | Out-File -FilePath $LocalBlogPidFile -Encoding ascii -Force

    $up = $false
    for ($i = 0; $i -lt 20; $i++) {
        Start-Sleep -Milliseconds 250
        if (Test-PortListening $LocalBlogPort) { $up = $true; break }
    }
    if ($up) {
        Write-Log "Local blog started (PID $($proc.Id)) -> http://127.0.0.1:$LocalBlogPort/"
    } else {
        Write-Log "WARN: Local blog did not bind :$LocalBlogPort within 5s (PID $($proc.Id))"
    }
}

function Start-StreamDashboardIfNeeded {
    if (Test-StreamListening) {
        $existing = @(Get-StreamProcesses | Select-Object -First 1)
        if ($existing.Count -gt 0) {
            $existing[0].ProcessId | Out-File -FilePath $StreamPidFile -Encoding ascii -Force
        }
        Write-Log "Stream dashboard already listening on http://127.0.0.1:$StreamPort/"
        return
    }

    if (-not (Test-Path $StreamScript)) {
        Write-Log "WARN: Stream script missing at $StreamScript"
        return
    }
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Log "WARN: node not found; cannot start stream dashboard"
        return
    }

    Write-Log "Starting stream dashboard on http://127.0.0.1:$StreamPort/"
    $stdout = Join-Path $LogDir "production-stream-stdout.log"
    $stderr = Join-Path $LogDir "production-stream-stderr.log"
    # Quote path (repo has spaces). Node stays alive with Hidden; PowerShell does not on this host.
    $proc = Start-Process -FilePath "node" `
        -ArgumentList "`"$StreamScript`"" `
        -WorkingDirectory $RepoRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -PassThru
    $proc.Id | Out-File -FilePath $StreamPidFile -Encoding ascii -Force

    $up = $false
    for ($i = 0; $i -lt 20; $i++) {
        Start-Sleep -Milliseconds 250
        if (Test-StreamListening) { $up = $true; break }
    }
    if ($up) {
        Write-Log "Stream dashboard started (PID $($proc.Id)) -> http://127.0.0.1:$StreamPort/"
    } else {
        Write-Log "WARN: Stream dashboard did not bind :$StreamPort within 5s (PID $($proc.Id))"
    }
}

function Ensure-Worktrees {
    $missing = @()
    for ($i = 1; $i -le 5; $i++) {
        $path = Join-Path $WorktreeRoot "worker-$i"
        if (-not (Test-Path $path)) { $missing += $i }
        $lockPath = Join-Path $LocksDir "worker-$i.json"
        if (-not (Test-Path $lockPath)) {
            @{ workerId = $i; status = "idle"; updatedAt = (Get-Date).ToUniversalTime().ToString("o") } |
                ConvertTo-Json | Set-Content -Path $lockPath -Encoding UTF8
        }
    }
    if ($missing.Count -eq 0) {
        Write-Log "Worktrees ready under $WorktreeRoot (worker-1..5)"
        return
    }
    if (-not (Test-Path $BootstrapScript)) {
        Write-Log "WARN: bootstrap script missing; worktrees incomplete: $($missing -join ',')"
        return
    }
    Write-Log "Bootstrapping missing worktrees: $($missing -join ',')"
    & powershell -NoProfile -ExecutionPolicy Bypass -File $BootstrapScript
    if ($LASTEXITCODE -ne 0) {
        Write-Log "WARN: bootstrap-worktrees exited $LASTEXITCODE"
    }
}

function Stop-ExistingWatchdogLoop {
    if (Test-Path $LoopPidFile) {
        $oldPid = Get-Content $LoopPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($oldPid -match '^\d+$') {
            $proc = Get-Process -Id ([int]$oldPid) -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Log "Stopping previous watchdog loop PID $oldPid"
                Stop-Process -Id ([int]$oldPid) -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

function Start-WatchdogLoop {
    Stop-ExistingWatchdogLoop
    $loopFile = Join-Path $RepoRoot "scripts\cursor-watchdog-loop.ps1"
    # Path has spaces ("AI Projects") - must quote -File path in a single ArgumentList string.
    # WindowStyle is a Start-Process parameter (Hidden exits immediately on this host).
    $argList = "-NoProfile -ExecutionPolicy Bypass -File `"$loopFile`""
    $proc = Start-Process -FilePath "powershell.exe" `
        -ArgumentList $argList `
        -WorkingDirectory $RepoRoot `
        -WindowStyle Minimized `
        -PassThru
    Start-Sleep -Seconds 4
    $loopPid = $null
    if (Test-Path $LoopPidFile) {
        $loopPid = Get-Content $LoopPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    }
    if (-not $loopPid) { $loopPid = $proc.Id }
    $alive = $false
    if ($loopPid -match '^\d+$') {
        $alive = $null -ne (Get-Process -Id ([int]$loopPid) -ErrorAction SilentlyContinue)
    }
    if (-not $alive -and $proc) {
        $alive = $null -ne (Get-Process -Id $proc.Id -ErrorAction SilentlyContinue)
        if ($alive) { $loopPid = $proc.Id }
    }
    if ($alive) {
        Write-Log "Watchdog loop started (PID $loopPid, every 10 min)"
    } else {
        Write-Log "ERROR: Watchdog loop failed to start (expected PID $loopPid)"
    }
}

Write-Log "=== Blog automation startup (5-agent parallel worktrees) ==="
Test-AgentCli
Ensure-Worktrees
Start-WorkerIfNeeded
Start-LocalBlogIfNeeded
Start-StreamDashboardIfNeeded
Start-WatchdogLoop
Write-Log "Running immediate watchdog check (starts orchestrator if idle)..."
& powershell -NoProfile -ExecutionPolicy Bypass -File $WatchdogScript
Write-Log "=== Done ==="
Write-Log "Orchestrator: scripts/run-blog-orchestrator.ps1 (spawns workers 1-4 + recovery 5)"
Write-Log "Worktrees: $WorktreeRoot"
Write-Log "Local blog: http://127.0.0.1:$LocalBlogPort/"
Write-Log "Stream: http://127.0.0.1:$StreamPort/"
Write-Log "Watchdog loop PID: $(Get-Content $LoopPidFile -ErrorAction SilentlyContinue)"
Write-Log "Logs: artifacts/automation-logs/"
