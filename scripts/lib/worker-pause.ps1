# Pause / resume worker containers + host agent process trees during an orchestrator bless.
# Dot-source after worker-layout.ps1. Never pauses the orchestrator or unrelated Docker projects.

function Get-BlogWorkerShellProcesses {
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.CommandLine -and $_.CommandLine -match '-File\s+"?[^"]*run-blog-worker\.ps1'
        }
}

function Get-WorkerShellPid {
    param([int]$WorkerId)
    $match = @(Get-BlogWorkerShellProcesses | Where-Object {
        $_.CommandLine -match "-WorkerId\s+$WorkerId\b" -or $_.CommandLine -match "-WorkerId\s+`"*$WorkerId"
    } | Select-Object -First 1)
    if ($match.Count -eq 0) { return $null }
    return [int]$match[0].ProcessId
}

function Get-ProcessDescendantIds {
    param([int]$RootPid)
    if ($RootPid -le 0) { return @() }
    $all = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue)
    $ids = New-Object System.Collections.Generic.List[int]
    $queue = New-Object System.Collections.Queue
    $queue.Enqueue($RootPid)
    $seen = @{}
    while ($queue.Count -gt 0) {
        $id = [int]$queue.Dequeue()
        if ($seen.ContainsKey($id)) { continue }
        $seen[$id] = $true
        $ids.Add($id)
        foreach ($child in $all) {
            if ($child.ParentProcessId -eq $id) { $queue.Enqueue([int]$child.ProcessId) }
        }
    }
    return @($ids)
}

function Ensure-NtProcessHelpers {
    if (Get-Command Suspend-NtProcess -ErrorAction SilentlyContinue) { return }
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public static class NtProc {
  [DllImport("ntdll.dll")] public static extern uint NtSuspendProcess(IntPtr processHandle);
  [DllImport("ntdll.dll")] public static extern uint NtResumeProcess(IntPtr processHandle);
  [DllImport("kernel32.dll", SetLastError = true)] public static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
  [DllImport("kernel32.dll", SetLastError = true)] public static extern bool CloseHandle(IntPtr handle);
  public const uint PROCESS_SUSPEND_RESUME = 0x0800;
  public static bool Suspend(int pid) {
    IntPtr h = OpenProcess(PROCESS_SUSPEND_RESUME, false, pid);
    if (h == IntPtr.Zero) return false;
    uint st = NtSuspendProcess(h);
    CloseHandle(h);
    return st == 0;
  }
  public static bool Resume(int pid) {
    IntPtr h = OpenProcess(PROCESS_SUSPEND_RESUME, false, pid);
    if (h == IntPtr.Zero) return false;
    uint st = NtResumeProcess(h);
    CloseHandle(h);
    return st == 0;
  }
}
"@ -ErrorAction Stop
    function global:Suspend-NtProcess([int]$ProcessId) { [NtProc]::Suspend($ProcessId) }
    function global:Resume-NtProcess([int]$ProcessId) { [NtProc]::Resume($ProcessId) }
}

function Pause-WorkerFleet {
    param(
        [string]$RepoRoot,
        [int]$ExcludeId = 0
    )
    $pidFile = Join-Path $RepoRoot "artifacts\conveyor-suspended-pids.json"
    $suspended = New-Object System.Collections.Generic.List[int]
    $pausedContainers = New-Object System.Collections.Generic.List[string]

    for ($i = 1; $i -le 5; $i++) {
        if ($i -eq $ExcludeId) { continue }
        $name = Get-BlogWorkerContainerName $i
        $prev = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        & docker pause $name 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $pausedContainers.Add($name) | Out-Null }
        $ErrorActionPreference = $prev

        $shellPid = Get-WorkerShellPid $i
        if (-not $shellPid) { continue }
        try {
            Ensure-NtProcessHelpers
            foreach ($pid in (Get-ProcessDescendantIds $shellPid)) {
                if ($pid -eq $PID) { continue }
                if (Suspend-NtProcess -ProcessId $pid) { $suspended.Add($pid) | Out-Null }
            }
        } catch {
            # Docker pause still holds container writes; host agent may keep running.
        }
    }

    @{
        pids = @($suspended)
        containers = @($pausedContainers)
        excludeId = $ExcludeId
        at = (Get-Date).ToUniversalTime().ToString("o")
    } | ConvertTo-Json | Set-Content -Path $pidFile -Encoding UTF8
}

function Resume-WorkerFleet {
    param([string]$RepoRoot)
    $pidFile = Join-Path $RepoRoot "artifacts\conveyor-suspended-pids.json"
    $recorded = $null
    if (Test-Path $pidFile) {
        try {
            $recorded = (Get-Content $pidFile -Raw) -replace '^\uFEFF', '' | ConvertFrom-Json
        } catch {}
    }

    for ($i = 1; $i -le 5; $i++) {
        $name = Get-BlogWorkerContainerName $i
        $prev = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        & docker unpause $name 2>$null | Out-Null
        $ErrorActionPreference = $prev
    }

    if ($recorded -and $recorded.pids) {
        try {
            Ensure-NtProcessHelpers
            foreach ($pid in @($recorded.pids)) {
                try { Resume-NtProcess -ProcessId ([int]$pid) | Out-Null } catch {}
            }
        } catch {}
    }
    if (Test-Path $pidFile) {
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    }
}
