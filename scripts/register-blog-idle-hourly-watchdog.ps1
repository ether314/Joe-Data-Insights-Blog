# Registers Windows scheduled task CursorBlogIdleHourlyWatchdog.
# Triggers: current user logon + every 1 hour. Not a 5-minute flashing task.
# Action: one-shot watch-blog-idle-hourly.ps1 (spawn Cursor agent CLI if running-but-idle).
# Never docker compose down. Never Firebase. Respects lock status=paused.
#
# If Register-ScheduledTask fails (rare: restricted token / GPO), the scripts
# still exist; run this file from an elevated PowerShell or:
#   schtasks /Create /TN CursorBlogIdleHourlyWatchdog /SC HOURLY /MO 1 /F /TR "..."

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
[void](Ensure-BlogAutomationPath)

$TaskName = "CursorBlogIdleHourlyWatchdog"
$WatchScript = Join-Path $RepoRoot "scripts\watch-blog-idle-hourly.ps1"
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"

if (-not (Test-Path $WatchScript)) {
    throw "Watch script missing: $WatchScript"
}

$psExe = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$arg = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatchScript`""

$action = New-ScheduledTaskAction -Execute $psExe -Argument $arg -WorkingDirectory $RepoRoot

$logon = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

# Hourly from ~2 minutes after register so the first tick is not immediate with logon.
$hourlyStart = (Get-Date).AddMinutes(2)
$hourly = New-ScheduledTaskTrigger -Once -At $hourlyStart -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration (New-TimeSpan -Days 3650)

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 20) `
    -DontStopOnIdleEnd

$description = "Blog conveyor idle-hourly watchdog. If lock=running (not paused) and 0 pipeline jobs, spawn Cursor agent CLI to refill unused novel themes. Does not compose down, Firebase deploy, or resume an operator pause."

$paused = $false
if (Test-Path $LockFile) {
    try {
        $lock = (Get-Content $LockFile -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
        $paused = ($lock.status -eq "paused")
    } catch {}
}

try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger @($logon, $hourly) `
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

    Write-Host "Triggers: At logon ($env:USERNAME) + hourly (start $hourlyStart, repeat 1h)."
    Write-Host "Action: $psExe $arg"
    Write-Host "Dry-run: powershell -NoProfile -ExecutionPolicy Bypass -File `"$WatchScript`" -DryRun"
    Write-Host "Stop: npm run automation:stop  (pauses lock and disables this task)"
    Write-Host "Resume: npm run automation:resume"
} catch {
    Write-Host "ERROR: could not register scheduled task $TaskName : $_"
    Write-Host "The watchdog script is still at $WatchScript"
    Write-Host "Register later (same user, or elevated if GPO blocks Register-ScheduledTask):"
    Write-Host "  powershell -NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    Write-Host "Or: schtasks /Create /TN $TaskName /SC HOURLY /MO 1 /F /TR `"$psExe $arg`" /RL LIMITED"
    exit 1
}
