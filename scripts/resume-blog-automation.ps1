# Resumes blog production automation after stop-blog-automation.ps1.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$WatchdogTask = "CursorBlogProductionWatchdog"
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
$StartScript = Join-Path $RepoRoot "scripts\start-blog-automation-in-app.ps1"
$RegisterScript = Join-Path $RepoRoot "scripts\register-blog-production-watchdog.ps1"
$BootstrapScript = Join-Path $RepoRoot "scripts\bootstrap-worktrees.ps1"
$WorktreeRoot = Get-BlogWorkerRoot $RepoRoot

$lastSlug = $null
$productionRunning = $false
if (Test-Path $LockFile) {
    try {
        $existing = Get-Content $LockFile -Raw | ConvertFrom-Json
        $lastSlug = $existing.lastSlug
    } catch {}
}

# Ensure worktrees exist before start (idempotent; start also checks).
if (Test-Path $BootstrapScript) {
    $needBootstrap = $false
    for ($i = 1; $i -le 5; $i++) {
        if (-not (Test-Path (Join-Path $WorktreeRoot "worker-$i"))) { $needBootstrap = $true; break }
    }
    if ($needBootstrap) {
        Write-Host "Bootstrapping missing worktrees under $WorktreeRoot"
        & powershell -NoProfile -ExecutionPolicy Bypass -File $BootstrapScript
    }
}

$productionProcs = @(
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.CommandLine -and (
                $_.CommandLine -like "*run-blog-orchestrator.ps1*" -or
                $_.CommandLine -like "*run-blog-production-local.ps1*"
            )
        }
)
$productionRunning = $productionProcs.Count -gt 0

if (-not $productionRunning) {
    $lock = @{
        status = "idle"
        lastHeartbeat = (Get-Date).ToUniversalTime().ToString("o")
        startedAt = $null
        runId = $null
        trigger = "manual-resume"
        lastSlug = $lastSlug
        notes = "Resumed via resume-blog-automation.ps1 (Docker-isolated workers)."
        mode = "docker-isolated-workers"
    }
    $lock | ConvertTo-Json | Set-Content -Path $LockFile -Encoding UTF8
} else {
    Write-Host "Production/orchestrator already running (PID $($productionProcs[0].ProcessId)); preserving lock file."
}

# Missing scheduled task writes to stderr; with Stop that aborts before start.
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
cmd /c "schtasks /Query /TN `"$WatchdogTask`" >nul 2>&1"
$taskExists = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prevEap
if (-not $taskExists) {
    Write-Host "Scheduled task $WatchdogTask missing - registering OS watchdog..."
    & powershell -NoProfile -ExecutionPolicy Bypass -File $RegisterScript
} else {
    schtasks /Change /TN $WatchdogTask /ENABLE | Out-Null
    Write-Host "Enabled scheduled task: $WatchdogTask"
}

& powershell -NoProfile -ExecutionPolicy Bypass -File $StartScript
Write-Host "Automation resumed."
