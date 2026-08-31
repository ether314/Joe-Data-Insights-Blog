# Shared worker clone / Docker layout for the blog conveyor.
# Dot-source after $RepoRoot is set.

function Get-BlogWorkerRoot {
    param([string]$RepoRoot)
    if ($env:BLOG_WORKTREE_ROOT -and $env:BLOG_WORKTREE_ROOT.Trim()) {
        return $env:BLOG_WORKTREE_ROOT.Trim()
    }
    if ($env:LOCALAPPDATA) {
        return (Join-Path $env:LOCALAPPDATA "data-insights-blog-workers")
    }
    return (Join-Path (Split-Path -Parent $RepoRoot) "data-insights-blog-workers")
}

function Get-BlogWorkerPath {
    param([string]$RepoRoot, [int]$WorkerId)
    Join-Path (Get-BlogWorkerRoot $RepoRoot) "worker-$WorkerId"
}

function Get-BlogWorkerContainerName {
    param([int]$WorkerId)
    "blog-worker-$WorkerId"
}

function Get-BlogWorkerServiceNames {
    @("worker-1", "worker-2", "worker-3", "worker-4", "worker-5")
}

function ConvertTo-DockerBindPath {
    param([string]$Path)
    ($Path -replace '\\', '/').TrimEnd('/')
}

function Test-IndependentGitClone {
    param([string]$Path)
    $git = Join-Path $Path ".git"
    if (-not (Test-Path -LiteralPath $git)) { return $false }
    # Windows Git marks .git Hidden; Get-Item without -Force throws
    # "Could not find item" and workers exit as worker_spawn_failed.
    $item = Get-Item -LiteralPath $git -Force -ErrorAction SilentlyContinue
    return [bool]($item -and $item.PSIsContainer)
}

function Ensure-BlogAutomationPath {
    # Scheduled tasks inherit a stripped PATH. Merge Machine + User so
    # docker, node, and agent resolve the same way as an interactive shell.
    # Unique-merge only: concatenating current PATH on every call (watchdog
    # loop dotsources this every 10 min in-process) balloons until Windows
    # throws "Environment variable name or value is too long".
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $seen = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $parts = [System.Collections.Generic.List[string]]::new()
    foreach ($chunk in @($userPath, $machinePath, $env:PATH)) {
        if ([string]::IsNullOrWhiteSpace($chunk)) { continue }
        foreach ($seg in ($chunk -split ';')) {
            $s = $seg.Trim()
            if (-not $s) { continue }
            if ($seen.Add($s)) { [void]$parts.Add($s) }
        }
    }
    $budget = 24000
    $kept = [System.Collections.Generic.List[string]]::new()
    $len = 0
    foreach ($p in $parts) {
        $add = $p.Length + 1
        if ($kept.Count -gt 0 -and ($len + $add) -gt $budget) { break }
        [void]$kept.Add($p)
        $len += $add
    }
    $env:PATH = ($kept -join ';')
    try {
        return (Ensure-BlogGitOnPath)
    } catch {
        return $null
    } finally {
        [void](Ensure-BlogAgentCliOnPath)
    }
}

function Ensure-BlogGitOnPath {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        return (Get-Command git).Source
    }
    $cmdDirs = @()
    $gdRoot = Join-Path $env:LOCALAPPDATA "GitHubDesktop"
    if (Test-Path $gdRoot) {
        Get-ChildItem -Path $gdRoot -Directory -Filter "app-*" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            ForEach-Object {
                $cmdDirs += (Join-Path $_.FullName "resources\app\git\cmd")
            }
    }
    $cmdDirs += @(
        "C:\Program Files\Git\cmd",
        "C:\Program Files (x86)\Git\cmd"
    )
    foreach ($dir in $cmdDirs) {
        $exe = Join-Path $dir "git.exe"
        if (Test-Path $exe) {
            $env:PATH = "$dir;$env:PATH"
            break
        }
    }
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "git.exe not found (install Git for Windows or GitHub Desktop)"
    }
    # Process-local only (does not write git config). Needed when the repo
    # owner SID does not match the current user.
    if (-not $env:GIT_CONFIG_COUNT) {
        $env:GIT_CONFIG_COUNT = "1"
        $env:GIT_CONFIG_KEY_0 = "safe.directory"
        $env:GIT_CONFIG_VALUE_0 = "*"
    }
    return (Get-Command git).Source
}

function Ensure-BlogAgentCliOnPath {
    if (Get-Command agent -ErrorAction SilentlyContinue) {
        return (Get-Command agent).Source
    }
    # cursor-agent installs shims under %LOCALAPPDATA%\cursor-agent, which lives
    # only on the User PATH - scheduled tasks / hidden spawns may not inherit it.
    $shimDirs = @(
        (Join-Path $env:LOCALAPPDATA "cursor-agent"),
        (Join-Path $env:APPDATA "npm")
    )
    foreach ($dir in $shimDirs) {
        if (-not $dir) { continue }
        $exe = Join-Path $dir "agent.cmd"
        if (Test-Path $exe) {
            $env:PATH = "$dir;$env:PATH"
            return $exe
        }
    }
    return $null
}

function Export-BlogWorkerComposeEnv {
    param([string]$RepoRoot)
    $root = Get-BlogWorkerRoot $RepoRoot
    $env:BLOG_WORKTREE_ROOT = $root
    $env:BLOG_WORKER_HOST_ROOT = ConvertTo-DockerBindPath $root
    return $root
}
