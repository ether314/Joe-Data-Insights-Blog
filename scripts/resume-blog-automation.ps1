# Resumes blog production automation after stop-blog-automation.ps1.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
$WatchdogTask = "CursorBlogProductionWatchdog"
$StartScript = Join-Path $RepoRoot "scripts\start-blog-automation-in-app.ps1"
$BootstrapScript = Join-Path $RepoRoot "scripts\bootstrap-worktrees.ps1"
$WorktreeRoot = if ($env:BLOG_WORKTREE_ROOT) { $env:BLOG_WORKTREE_ROOT } else {
    Join-Path (Split-Path -Parent $RepoRoot) "data-insights-blog-worktrees"
}

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
        notes = "Resumed via resume-blog-automation.ps1 (parallel orchestrator mode)."
        mode = "parallel-worktrees"
    }
    $lock | ConvertTo-Json | Set-Content -Path $LockFile -Encoding UTF8
} else {
    Write-Host "Production/orchestrator already running (PID $($productionProcs[0].ProcessId)); preserving lock file."
}

$task = schtasks /Query /TN $WatchdogTask 2>$null
if ($LASTEXITCODE -eq 0) {
    schtasks /Change /TN $WatchdogTask /ENABLE | Out-Null
    Write-Host "Enabled scheduled task: $WatchdogTask"
}

& powershell -NoProfile -ExecutionPolicy Bypass -File $StartScript
Write-Host "Automation resumed."
