# Runs blog production locally via Cursor CLI (no Cursor Cloud VM).
# Started by watch-blog-production.ps1 or manually.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$PidFile = Join-Path $RepoRoot "artifacts\blog-production.pid"
$StartingFile = Join-Path $RepoRoot "artifacts\blog-production.starting"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogFile = Join-Path $LogDir "production-$Timestamp.log"
$RunId = "local-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
Set-Location $RepoRoot

function Write-Log($Message) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Add-Content -Path $LogFile -Value $line
    Write-Host $line
}

function Write-Lock($Status, $Notes) {
    # Re-read lastSlug from disk so agent heartbeat updates are not clobbered on exit.
    if (Test-Path $LockFile) {
        try {
            $cur = Get-Content $LockFile -Raw | ConvertFrom-Json
            if ($cur.lastSlug) { $script:LastSlug = $cur.lastSlug }
            if ($Status -ne "running" -and $cur.startedAt) { $script:StartedAt = $cur.startedAt }
        } catch {}
    }
    $payload = @{
        status = $Status
        lastHeartbeat = (Get-Date).ToUniversalTime().ToString("o")
        startedAt = if ($Status -eq "running") { (Get-Date).ToUniversalTime().ToString("o") } else { $script:StartedAt }
        runId = if ($Status -eq "running") { $RunId } else { $null }
        trigger = "local-scheduled"
        lastSlug = $script:LastSlug
        notes = $Notes
    }
    if ($Status -eq "running" -and $script:StartedAt) {
        $payload.startedAt = $script:StartedAt
    }
    $payload | ConvertTo-Json | Set-Content -Path $LockFile -Encoding UTF8
}

$script:StartedAt = (Get-Date).ToUniversalTime().ToString("o")
$script:LastSlug = $null
if (Test-Path $LockFile) {
    try {
        $existing = Get-Content $LockFile -Raw | ConvertFrom-Json
        $script:LastSlug = $existing.lastSlug
    } catch {}
}

Write-Log "Starting local blog production run ($RunId)"
Write-Log "Repo: $RepoRoot"

if (Test-Path $LockFile) {
    try {
        $existingLock = Get-Content $LockFile -Raw | ConvertFrom-Json
        if ($existingLock.status -eq "paused") {
            Write-Log "Automation is paused (lock status=paused). Exiting."
            exit 0
        }
    } catch {}
}

# Two agents editing posts.ts at once corrupts output - refuse if another production
# shell is already alive. Match -File ...script only (agent prompts mention the filename).
$otherProduction = @(
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.ProcessId -ne $PID -and
            $_.CommandLine -and
            $_.CommandLine -match '-File\s+"?[^"]*run-blog-production-local\.ps1'
        }
)
if ($otherProduction.Count -gt 0) {
    Write-Log "Another production run is active (PID $($otherProduction[0].ProcessId)). Exiting without starting."
    exit 0
}

if (-not (Get-Command agent -ErrorAction SilentlyContinue)) {
    Write-Log "ERROR: Cursor agent CLI not found"
    exit 1
}

$auth = & agent status 2>&1 | Out-String
if ($auth -match "Not logged in") {
    Write-Log "ERROR: Not logged in. Run: agent login"
    exit 1
}

# Heavy ~/.cursor/skills (book chunk corpora) get bundled into every agent turn and
# trip HTTP/2 ENHANCE_YOUR_CALM -> "Connection lost, reconnecting". Park anything
# over this size for the duration of the production run, then restore on exit.
$SkillsRoot = Join-Path $env:USERPROFILE ".cursor\skills"
$SkillsPark = Join-Path $env:USERPROFILE ".cursor\skills-parked-blog-production"
$SkillParkMaxBytes = 200KB
# Within one agent process: kill when the CLI's reconnect attempt number reaches
# this threshold (or grace expires). Do NOT count duplicate lines for the same
# attempt ("Connection lost… attempt N" + "Retry attempt N" are one event).
$MaxReconnectAttempts = if ($env:BLOG_AGENT_MAX_RECONNECTS) { [int]$env:BLOG_AGENT_MAX_RECONNECTS } else { 3 }
$ReconnectGraceSeconds = if ($env:BLOG_AGENT_RECONNECT_GRACE_SEC) { [int]$env:BLOG_AGENT_RECONNECT_GRACE_SEC } else { 90 }
# Single agent session per production shell. On transport death, run transport
# debug then exit so the watchdog can start a fresh runId (no in-shell retry).
$MaxSessionRestarts = if ($env:BLOG_AGENT_MAX_SESSION_RESTARTS) { [int]$env:BLOG_AGENT_MAX_SESSION_RESTARTS } else { 1 }
# If no reconnect noise for this long, treat the next blip as a new streak
# (avoids killing a healthy long deploy because attempt-1 noise was 30m earlier).
$BlipStreakGapSeconds = if ($env:BLOG_AGENT_BLIP_STREAK_GAP_SEC) { [int]$env:BLOG_AGENT_BLIP_STREAK_GAP_SEC } else { 90 }
$TransportExhaustCooldownSec = if ($env:BLOG_AGENT_TRANSPORT_COOLDOWN_SEC) { [int]$env:BLOG_AGENT_TRANSPORT_COOLDOWN_SEC } else { 60 }

function Get-DirectorySizeBytes([string]$Path) {
    if (-not (Test-Path $Path)) { return 0 }
    $sum = (Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum).Sum
    if ($null -eq $sum) { return 0 }
    return [int64]$sum
}

function Suspend-HeavyCursorSkills {
    if (-not (Test-Path $SkillsRoot)) { return }
    New-Item -ItemType Directory -Path $SkillsPark -Force | Out-Null
    $moved = @()
    Get-ChildItem -Path $SkillsRoot -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $bytes = Get-DirectorySizeBytes $_.FullName
        if ($bytes -lt $SkillParkMaxBytes) { return }
        $dest = Join-Path $SkillsPark $_.Name
        if (Test-Path $dest) {
            Remove-Item -Path $dest -Recurse -Force -ErrorAction SilentlyContinue
        }
        Move-Item -Path $_.FullName -Destination $dest -Force
        $moved += ("{0} ({1:N1} MB)" -f $_.Name, ($bytes / 1MB))
    }
    if ($moved.Count -gt 0) {
        Write-Log ("Parked heavy Cursor skills to reduce agent payload: " + ($moved -join "; "))
    } else {
        Write-Log "No heavy Cursor skills to park (all under 200KB)."
    }
}

function Restore-HeavyCursorSkills {
    if (-not (Test-Path $SkillsPark)) { return }
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

function Start-TransportDebug([string]$Reason) {
    $debugScript = Join-Path $RepoRoot "scripts\debug-agent-transport.ps1"
    if (-not (Test-Path $debugScript)) {
        Write-Log "WARN: transport debug script missing ($debugScript)"
        return
    }
    Write-Log "Starting transport debug ($Reason)..."
    try {
        $stdout = Join-Path $LogDir "transport-debug-stdout.log"
        $stderr = Join-Path $LogDir "transport-debug-stderr.log"
        $proc = Start-Process -FilePath "powershell.exe" -ArgumentList @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", $debugScript
        ) -WorkingDirectory $RepoRoot -WindowStyle Minimized -PassThru `
            -RedirectStandardOutput $stdout -RedirectStandardError $stderr
        Write-Log "Transport debug started (PID $($proc.Id)) -> artifacts/transport-debug/"
    } catch {
        Write-Log "WARN: failed to start transport debug: $($_.Exception.Message)"
    }
}

function Stop-AgentDescendants {
    $all = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue)
    $wanted = New-Object System.Collections.Generic.HashSet[int]
    [void]$wanted.Add([int]$PID)
    for ($depth = 0; $depth -lt 6; $depth++) {
        $added = $false
        foreach ($p in $all) {
            if ($p.ParentProcessId -and $wanted.Contains([int]$p.ParentProcessId)) {
                if ($wanted.Add([int]$p.ProcessId)) { $added = $true }
            }
        }
        if (-not $added) { break }
    }
    foreach ($id in $wanted) {
        if ($id -eq $PID) { continue }
        $proc = Get-Process -Id $id -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -match "^(node|agent)$") {
            Write-Log "Stopping agent child PID $id ($($proc.ProcessName))"
            Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
        }
    }
}

$PID | Out-File -FilePath $PidFile -Encoding ascii -Force
if (Test-Path $StartingFile) {
    Remove-Item $StartingFile -Force -ErrorAction SilentlyContinue
}
Write-Lock "running" "Local production agent started."

$PromptFile = Join-Path $RepoRoot "scripts\blog-production-prompt.txt"
if (Test-Path $PromptFile) {
    $Prompt = Get-Content $PromptFile -Raw
    $Prompt = $Prompt.Replace("{{RUN_ID}}", $RunId)
    Write-Log "Loaded prompt from scripts/blog-production-prompt.txt (runId=$RunId)"
} else {
    $Prompt = @"
Operating mode: infinite conveyor. Follow .cursor/rules/autonomous-blog-production.mdc.
Run npm run theme-balance before each post. Minimum 2 posts per turn when deploy succeeds.
"@
}

$exitCode = 0
# Keep heavy skills parked for the whole production shell (including mid-run
# session restarts). stop-blog-automation.ps1 restores them on pause.
try {
    Suspend-HeavyCursorSkills

    $session = 0
    $continuePrompt = @"
CONTINUE_PRODUCTION - transport session refresh.

Your run ID is still {{RUN_ID}}. You are the active conveyor.
Read artifacts/blog-production-lock.json. Resume from lastSlug.
If newest posts in posts.ts are missing from out/blog/, run npm run deploy for those FIRST.
Do not publish to Firebase Hosting as part of production.
Then continue the infinite conveyor (ship -> verify local build -> next).
Do not ask the user anything. Follow scripts/blog-production-prompt.txt gates.
"@.Replace("{{RUN_ID}}", $RunId)

    while ($session -lt $MaxSessionRestarts) {
        $session++
        $activePrompt = if ($session -eq 1) { $Prompt } else { $continuePrompt }
        Write-Log "Invoking agent session $session/$MaxSessionRestarts (-p --force --trust)"
        Write-Lock "running" ("Local production agent session " + $session)

        $transcriptPath = Join-Path $LogDir "agent-transcript-$RunId-s$session.txt"
        Start-Transcript -Path $transcriptPath -Append -ErrorAction SilentlyContinue | Out-Null

        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        $script:ForceRestart = $false
        $script:ReconnectSince = $null
        $script:LastBlipAt = $null
        $script:CliAttemptHigh = 0
        $sessionExit = 0
        try {
            & agent -p --force --trust --workspace $RepoRoot $activePrompt 2>&1 | ForEach-Object {
                $line = if ($_ -is [System.Management.Automation.ErrorRecord]) {
                    $_.Exception.Message
                } else {
                    $_.ToString()
                }
                if (-not $line) { return }
                Write-Host $line
                Add-Content -Path $LogFile -Value $line -Encoding UTF8

                $isTransportBlip = $line -match "(?i)Connection lost|reconnect|Retry attempt"
                $attempt = $null
                if ($line -match "(?i)(?:Connection lost|reconnect|Retry attempt).*?attempt\s+(\d+)") {
                    $attempt = [int]$Matches[1]
                } elseif ($line -match "(?i)^Retry attempt\s+(\d+)") {
                    $attempt = [int]$Matches[1]
                }

                if ($isTransportBlip) {
                    $now = Get-Date
                    # New streak after a quiet period - do not inherit a stale timer
                    # from an earlier recovered blip (that caused the session-5 false kill).
                    if ($script:LastBlipAt) {
                        $gap = ($now - $script:LastBlipAt).TotalSeconds
                        if ($gap -gt $BlipStreakGapSeconds) {
                            Write-Log "INFO: blip streak reset after ${gap}s quiet (session $session)"
                            $script:ReconnectSince = $now
                            $script:CliAttemptHigh = 0
                        }
                    }
                    if (-not $script:ReconnectSince) {
                        $script:ReconnectSince = $now
                        $script:CliAttemptHigh = 0
                    }
                    $script:LastBlipAt = $now
                    if ($null -ne $attempt) {
                        if ($attempt -gt $script:CliAttemptHigh) { $script:CliAttemptHigh = $attempt }
                    } else {
                        $script:CliAttemptHigh++
                    }
                    $elapsed = [math]::Round(($now - $script:ReconnectSince).TotalSeconds, 0)
                    $attemptLabel = if ($null -ne $attempt) { $attempt } else { "?" }
                    Write-Log "WARN: transport blip attempt=$attemptLabel cliHigh=$($script:CliAttemptHigh) elapsed=${elapsed}s (session $session)"

                    $shouldKill = $false
                    # Kill when CLI reconnect attempt# reaches threshold (deduped), or grace expiry.
                    if ($script:CliAttemptHigh -ge $MaxReconnectAttempts) {
                        $shouldKill = $true
                    }
                    if ($elapsed -ge $ReconnectGraceSeconds) {
                        $shouldKill = $true
                    }
                    if ($shouldKill -and -not $script:ForceRestart) {
                        Write-Log "ERROR: transport unhealthy (attempt=$attemptLabel cliHigh=$($script:CliAttemptHigh) elapsed=${elapsed}s); killing session (no in-shell retry)"
                        $script:ForceRestart = $true
                        Stop-AgentDescendants
                    }
                } elseif ($script:ReconnectSince) {
                    # Non-blip output means the stream recovered; reset the grace timer.
                    $script:ReconnectSince = $null
                    $script:CliAttemptHigh = 0
                }
            }
            if ($null -ne $LASTEXITCODE) { $sessionExit = $LASTEXITCODE }
            if ($script:ForceRestart) { $sessionExit = 75 }
        } finally {
            $ErrorActionPreference = $prevEap
            Stop-Transcript -ErrorAction SilentlyContinue | Out-Null
        }

        Write-Log "Agent session $session finished with exit code $sessionExit"
        $exitCode = $sessionExit

        # No in-shell session retries. On transport death: debug, cool down, exit
        # so the watchdog starts a brand-new production run.
        if ($sessionExit -eq 75) {
            Start-TransportDebug "session $session exit 75 after transport kill"
            Write-Log "Transport failed on single allowed session ($session/$MaxSessionRestarts). Cooling down ${TransportExhaustCooldownSec}s, then exiting for full pipeline restart + debug report."
            Write-Lock "idle" "Transport failed (1 session); debug running; full restart pending."
            Start-Sleep -Seconds $TransportExhaustCooldownSec
            $exitCode = 0
            break
        }
        break
    }
} finally {
    if (Test-Path $PidFile) {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path $StartingFile) {
        Remove-Item $StartingFile -Force -ErrorAction SilentlyContinue
    }
    # Preserve transport-exhausted idle notes written before cooldown exit.
    $alreadyIdle = $false
    try {
        if (Test-Path $LockFile) {
            $raw = (Get-Content $LockFile -Raw) -replace '^\uFEFF', ''
            $alreadyIdle = ((ConvertFrom-Json $raw).status -eq "idle")
        }
    } catch {}
    if (-not $alreadyIdle) {
        Write-Lock "idle" "Local production agent exited."
    }
}

exit $exitCode
