# Stops blog production automation: watchdog loop, production agent, stream dashboard, scheduled task.
# Does NOT stop the always-on local blog preview on :4173 (npm run blog:local).
# Sets lock status to "paused" so nothing restarts until resume-blog-automation.ps1.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$LoopPidFile = Join-Path $RepoRoot "artifacts\cursor-watchdog-loop.pid"
$ProdPidFile = Join-Path $RepoRoot "artifacts\blog-production.pid"
$StreamPidFile = Join-Path $RepoRoot "artifacts\production-stream.pid"
$StartingFile = Join-Path $RepoRoot "artifacts\blog-production.starting"
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$WatchdogTask = "CursorBlogProductionWatchdog"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

function Write-Log($Message) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Add-Content -Path (Join-Path $LogDir "watchdog.log") -Value $line
    Write-Host $line
}

$lastSlug = $null
if (Test-Path $LockFile) {
    try {
        $existing = Get-Content $LockFile -Raw | ConvertFrom-Json
        $lastSlug = $existing.lastSlug
    } catch {}
}

if (Test-Path $LoopPidFile) {
    $raw = Get-Content $LoopPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($raw -match '^\d+$') {
        $proc = Get-Process -Id ([int]$raw) -ErrorAction SilentlyContinue
        if ($proc) {
            Stop-Process -Id ([int]$raw) -Force -ErrorAction SilentlyContinue
            Write-Log "Stopped watchdog loop PID $raw"
        }
    }
    Remove-Item $LoopPidFile -Force -ErrorAction SilentlyContinue
}

Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object {
        $_.CommandLine -and (
            $_.CommandLine -match '-File\s+"?[^"]*run-blog-orchestrator\.ps1' -or
            $_.CommandLine -match '-File\s+"?[^"]*run-blog-worker\.ps1' -or
            $_.CommandLine -match '-File\s+"?[^"]*run-blog-production-local\.ps1'
        )
    } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        Write-Log "Stopped automation shell PID $($_.ProcessId)"
    }

if (Test-Path $ProdPidFile) {
    $raw = Get-Content $ProdPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($raw -match '^\d+$') {
        Stop-Process -Id ([int]$raw) -Force -ErrorAction SilentlyContinue
    }
    Remove-Item $ProdPidFile -Force -ErrorAction SilentlyContinue
}

$OrchPidFile = Join-Path $RepoRoot "artifacts\blog-orchestrator.pid"
if (Test-Path $OrchPidFile) {
    $raw = Get-Content $OrchPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($raw -match '^\d+$') {
        Stop-Process -Id ([int]$raw) -Force -ErrorAction SilentlyContinue
        Write-Log "Stopped orchestrator PID $raw"
    }
    Remove-Item $OrchPidFile -Force -ErrorAction SilentlyContinue
}

# Stop stream dashboard (by pid file + any leftover node process)
if (Test-Path $StreamPidFile) {
    $raw = Get-Content $StreamPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($raw -match '^\d+$') {
        $proc = Get-Process -Id ([int]$raw) -ErrorAction SilentlyContinue
        if ($proc) {
            Stop-Process -Id ([int]$raw) -Force -ErrorAction SilentlyContinue
            Write-Log "Stopped stream dashboard PID $raw"
        }
    }
    Remove-Item $StreamPidFile -Force -ErrorAction SilentlyContinue
}
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and $_.CommandLine -like "*production-stream-server.mjs*" } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        Write-Log "Stopped stream dashboard PID $($_.ProcessId)"
    }

if (Test-Path $StartingFile) {
    Remove-Item $StartingFile -Force -ErrorAction SilentlyContinue
}

$task = schtasks /Query /TN $WatchdogTask 2>$null
if ($LASTEXITCODE -eq 0) {
    schtasks /Change /TN $WatchdogTask /DISABLE | Out-Null
    Write-Log "Disabled scheduled task: $WatchdogTask"
}

$lock = @{
    status = "paused"
    lastHeartbeat = (Get-Date).ToUniversalTime().ToString("o")
    startedAt = $null
    runId = $null
    trigger = "manual-stop"
    lastSlug = $lastSlug
    notes = "Paused via stop-blog-automation.ps1. Run scripts/resume-blog-automation.ps1 to restart."
}
$lock | ConvertTo-Json | Set-Content -Path $LockFile -Encoding UTF8
Write-Log "Automation paused (lock status=paused)"

# Restore book-chunk skills parked by run-blog-production-local.ps1 during conveyor runs.
$SkillsRoot = Join-Path $env:USERPROFILE ".cursor\skills"
$SkillsPark = Join-Path $env:USERPROFILE ".cursor\skills-parked-blog-production"
if (Test-Path $SkillsPark) {
    New-Item -ItemType Directory -Path $SkillsRoot -Force | Out-Null
    $restored = 0
    Get-ChildItem -Path $SkillsPark -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $dest = Join-Path $SkillsRoot $_.Name
        if (Test-Path $dest) {
            Remove-Item -Path $dest -Recurse -Force -ErrorAction SilentlyContinue
        }
        Move-Item -Path $_.FullName -Destination $dest -Force
        $restored++
    }
    if ($restored -gt 0) {
        Write-Log "Restored $restored parked Cursor skill folder(s)."
    }
}
