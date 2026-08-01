# Background watchdog loop for blog production (started by start-blog-automation-in-app.ps1)
# 10 minutes: frequent enough to restart a dead agent, rare enough to avoid thrash during long deploys.
$IntervalSeconds = 600

$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$script = Join-Path $repo "scripts\watch-blog-production.ps1"
$log = Join-Path $repo "artifacts\automation-logs\cursor-watchdog-loop.log"
$pidFile = Join-Path $repo "artifacts\cursor-watchdog-loop.pid"

$PID | Out-File -FilePath $pidFile -Encoding ascii -Force

while ($true) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    & powershell -NoProfile -ExecutionPolicy Bypass -File $script 2>&1 |
        ForEach-Object { Add-Content -Path $log -Value "[$ts] $_" }
    Start-Sleep -Seconds $IntervalSeconds
}
