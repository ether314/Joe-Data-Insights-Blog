# Hidden backlog-drain watcher: when drain-only is set and the retryable queue
# is empty, stop the conveyor and clear the drain flag.
# LOCAL-ONLY: no Firebase, no git push.
#
# Usage:
#   powershell -File scripts/watch-blog-backlog-drain.ps1
#
# Log: artifacts/automation-logs/backlog-drain.log
# Pid: artifacts/backlog-drain-watch.pid

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
. (Join-Path $RepoRoot "scripts\lib\drain-mode.ps1")
[void](Ensure-BlogAutomationPath)

$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$JobsFile = Join-Path $RepoRoot "artifacts\agent-jobs.json"
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$LogFile = Join-Path $LogDir "backlog-drain.log"
$PidFile = Join-Path $RepoRoot "artifacts\backlog-drain-watch.pid"
$PollSeconds = if ($env:BLOG_DRAIN_POLL_SEC) { [int]$env:BLOG_DRAIN_POLL_SEC } else { 90 }
$ActiveStatuses = @("claimed", "researching", "building", "qa", "ready", "blessing", "merging")
$script:SelfStop = $false

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
Set-Location $RepoRoot
$PID | Out-File -FilePath $PidFile -Encoding ascii -Force

function Write-Log {
    param([string]$Message)
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    for ($i = 0; $i -lt 3; $i++) {
        try {
            Add-Content -Path $script:LogFile -Value $line -ErrorAction Stop
            break
        } catch [System.IO.IOException] {
            Start-Sleep -Milliseconds (25 * ($i + 1))
        } catch {
            break
        }
    }
    Microsoft.PowerShell.Utility\Write-Host $line
}

function Get-LockStatus {
    if (-not (Test-Path $script:LockFile)) { return "missing" }
    try {
        $lock = (Get-Content $script:LockFile -Raw -ErrorAction Stop) -replace '^\uFEFF', '' | ConvertFrom-Json
        $status = [string]$lock.status
        if (-not $status) { return "unknown" }
        return $status
    } catch {
        return "unreadable"
    }
}

function Get-DrainSnapshot {
    $probe = Join-Path $script:RepoRoot "scripts\lib\drain-queue-snapshot.mjs"
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $out = & node $probe 2>&1 | Out-String
        $start = $out.IndexOf("{")
        if ($start -lt 0) { return $null }
        return ($out.Substring($start) | ConvertFrom-Json -ErrorAction Stop)
    } catch {
        Write-Log "WARN: drain snapshot failed: $_"
        return $null
    } finally {
        $ErrorActionPreference = $prev
    }
}

function Invoke-DrainStop {
    $script:SelfStop = $true
    Write-Log "Backlog drained. Running npm run automation:stop and clearing drain flag."
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & npm run automation:stop
        $code = [int]$LASTEXITCODE
        Write-Log "automation:stop exited $code"
    } catch {
        Write-Log "ERROR: automation:stop failed: $_"
    } finally {
        $ErrorActionPreference = $prev
    }
    $flag = Get-BlogDrainFlagPath $script:RepoRoot
    if (Test-Path $flag) {
        Remove-Item $flag -Force -ErrorAction SilentlyContinue
        Write-Log "Cleared drain flag $flag"
    }
    Remove-Item Env:\BLOG_CLAIM_BACKLOG_ONLY -ErrorAction SilentlyContinue
}

$script:RepoRoot = $RepoRoot
$script:LockFile = $LockFile
$script:JobsFile = $JobsFile
$script:LogFile = $LogFile

Write-Log "Backlog-drain watcher started (pid $PID, poll ${PollSeconds}s)"

try {
    while ($true) {
        if (-not (Test-BlogDrainOnly -RepoRoot $script:RepoRoot)) {
            Write-Log "Drain flag/env not set. Watcher exiting."
            break
        }

        $lockStatus = Get-LockStatus
        $snap = Get-DrainSnapshot
        if ($null -eq $snap) {
            Write-Log "tick lock=$lockStatus snapshot=unavailable"
            Start-Sleep -Seconds $PollSeconds
            continue
        }

        $activeN = [int]$snap.active
        $retryN = [int]$snap.retryable
        $drained = [bool]$snap.drained
        Write-Log "tick lock=$lockStatus active=$activeN retryable=$retryN drained=$drained"

        if ($drained) {
            Invoke-DrainStop
            break
        }

        if ($lockStatus -eq "paused" -and -not $script:SelfStop) {
            Write-Log "Lock status=paused (operator stop). Watcher exiting; drain flag left in place."
            break
        }

        Start-Sleep -Seconds $PollSeconds
    }
} catch {
    Write-Log "ERROR: watcher failed: $_"
} finally {
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    Write-Log "Backlog-drain watcher exited"
}
