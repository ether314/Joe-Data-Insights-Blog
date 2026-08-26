# Registers Windows scheduled task CursorBlogProductionWatchdog.
# Trigger: current user logon only. The in-app watchdog loop already polls every
# 10 minutes; a 5-minute repeating task was a console-flash factory (new WT tabs).
# Action: one-shot watch-blog-production.ps1 (restart orchestrator / loop / stream /
# worker containers if down). Never docker compose down. Never Firebase deploy.
# Respects artifacts/blog-production-lock.json status=paused (watch script no-ops;
# npm run automation:stop also DISABLEs this task).

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
[void](Ensure-BlogAutomationPath)

$TaskName = "CursorBlogProductionWatchdog"
$WatchScript = Join-Path $RepoRoot "scripts\watch-blog-production.ps1"
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"

if (-not (Test-Path $WatchScript)) {
    throw "Watch script missing: $WatchScript"
}

$psExe = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
# -WindowStyle Hidden here is powershell.exe argv (one-shot check), not Start-Process.
$arg = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatchScript`""

$action = New-ScheduledTaskAction -Execute $psExe -Argument $arg -WorkingDirectory $RepoRoot

$logon = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
    -DontStopOnIdleEnd

$description = "Blog production conveyor watchdog (logon only). Restarts orchestrator, in-app loop, stream dashboard, and Docker workers if they died. Does not compose down or Firebase deploy. Disabled by npm run automation:stop."

$paused = $false
if (Test-Path $LockFile) {
    try {
        $lock = (Get-Content $LockFile -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
        $paused = ($lock.status -eq "paused")
    } catch {}
}

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $logon `
    -Principal $principal `
    -Settings $settings `
    -Description $description `
    -Force | Out-Null

if ($paused) {
    Disable-ScheduledTask -TaskName $TaskName | Out-Null
    Write-Host "Registered $TaskName (DISABLED because lock status=paused). Run npm run automation:resume to enable."
} else {
    Enable-ScheduledTask -TaskName $TaskName | Out-Null
    Write-Host "Registered $TaskName (ENABLED)."
}

Write-Host "Triggers: At logon ($env:USERNAME) only (in-app loop already polls every 10 min)."
Write-Host "Action: $psExe $arg"
Write-Host "Stop: npm run automation:stop  (sets lock=paused and disables this task)"
Write-Host "Resume: npm run automation:resume  (clears pause, enables task, starts stack)"
