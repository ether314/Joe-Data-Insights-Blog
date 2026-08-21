# Registers Windows scheduled task CursorBlogProductionWatchdog.
# Triggers: current user logon + every 5 minutes while logged on.
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
$arg = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatchScript`""

$action = New-ScheduledTaskAction -Execute $psExe -Argument $arg -WorkingDirectory $RepoRoot

# Logon + 5-minute repetition (survives reboot once the user is logged on).
$logon = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$logonRepeat = New-ScheduledTaskTrigger -Once -At (Get-Date).Date `
    -RepetitionInterval (New-TimeSpan -Minutes 5) `
    -RepetitionDuration (New-TimeSpan -Days 9999)
$logon.Repetition = $logonRepeat.Repetition

# Also start a repeating clock from ~1 minute after register so the interval
# does not wait for the next logon.
$interval = New-ScheduledTaskTrigger -Once -At ((Get-Date).AddMinutes(1)) `
    -RepetitionInterval (New-TimeSpan -Minutes 5) `
    -RepetitionDuration (New-TimeSpan -Days 9999)

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
    -DontStopOnIdleEnd

$description = "Blog production conveyor watchdog. Restarts orchestrator, in-app loop, stream dashboard, and Docker workers if they died. Does not compose down or Firebase deploy. Disabled by npm run automation:stop."

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
    -Trigger @($logon, $interval) `
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

Write-Host "Triggers: At logon ($env:USERNAME) with 5-min repetition; plus 5-min interval starting in ~1 min."
Write-Host "Action: $psExe $arg"
Write-Host "Stop: npm run automation:stop  (sets lock=paused and disables this task)"
Write-Host "Resume: npm run automation:resume  (clears pause, enables task, starts stack)"
