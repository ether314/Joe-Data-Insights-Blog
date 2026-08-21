# Bootstrap 5 isolated git clones + Docker worker containers
# (worker-1..4 producers + worker-5 recovery).
#
# Clones live under %LOCALAPPDATA%\data-insights-blog-workers (override with
# BLOG_WORKTREE_ROOT). Each clone is bind-mounted only into blog-worker-N.
# The main checkout is never mounted writable into a worker.
#
# Usage: powershell -File scripts/bootstrap-worktrees.ps1 [-Force] [-SkipContainers]

param(
    [switch]$Force,
    [switch]$SkipContainers
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
[void](Ensure-BlogGitOnPath)

$WorktreeRoot = Export-BlogWorkerComposeEnv $RepoRoot
$WorkerCount = 5
$JobsFile = Join-Path $RepoRoot "artifacts\agent-jobs.json"

Set-Location $RepoRoot
New-Item -ItemType Directory -Path $WorktreeRoot -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $RepoRoot "artifacts\locks") -Force | Out-Null

$baseBranch = $null
$prev = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$baseBranch = (git rev-parse --abbrev-ref HEAD 2>$null | Select-Object -First 1)
$ErrorActionPreference = $prev
if ($baseBranch) { $baseBranch = ([string]$baseBranch).Trim() }
if (-not $baseBranch -or $baseBranch -eq "HEAD") { $baseBranch = "master" }
Write-Host "Base branch: $baseBranch"
Write-Host "Worker clone root: $WorktreeRoot"
Write-Host "Main repo (merge target, not mounted RW): $RepoRoot"

function Invoke-GitHere {
    param([string]$Cwd, [string[]]$GitArgs)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & git -C $Cwd @GitArgs 2>&1 | Out-Null
        return [int]$LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prev
    }
}

for ($i = 1; $i -le $WorkerCount; $i++) {
    $name = "worker-$i"
    $path = Join-Path $WorktreeRoot $name
    $parking = "worktree/$name"

    if (Test-Path $path) {
        if ($Force) {
            Write-Host "Removing existing clone $name..."
            if (Test-IndependentGitClone $path) {
                Remove-Item -Recurse -Force $path
            } else {
                git worktree remove --force $path 2>$null
                if (Test-Path $path) { Remove-Item -Recurse -Force $path }
            }
        } else {
            Write-Host "Clone $name already exists at $path"
            if (Test-IndependentGitClone $path) {
                Invoke-GitHere $path @("remote", "set-url", "origin", $RepoRoot) | Out-Null
                Invoke-GitHere $path @("fetch", "origin") | Out-Null
            }
            continue
        }
    }

    Write-Host "Cloning $name (no hardlinks) -> $path"
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & git clone --no-hardlinks -- "$RepoRoot" "$path"
    $cloneExit = [int]$LASTEXITCODE
    $ErrorActionPreference = $prev
    if ($cloneExit -ne 0) { throw "Failed to clone $name (exit $cloneExit)" }

    Invoke-GitHere $path @("remote", "set-url", "origin", $RepoRoot) | Out-Null
    $co = Invoke-GitHere $path @("checkout", "-B", $parking, "origin/$baseBranch")
    if ($co -ne 0) {
        Invoke-GitHere $path @("checkout", "-B", $parking, $baseBranch) | Out-Null
    }
    Write-Host "Ready: $name -> $path (parking branch $parking, container blog-worker-$i)"
}

# Persist worker clone paths into the jobs file so dispatch uses C: clones.
if (Get-Command node -ErrorAction SilentlyContinue) {
    & node (Join-Path $RepoRoot "scripts\reconcile-worker-paths.mjs")
} else {
    Write-Host "WARN: node not on PATH; jobs file worker paths not rewritten"
}

if (-not (Test-Path $JobsFile)) {
    New-Item -ItemType Directory -Path (Join-Path $RepoRoot "artifacts") -Force | Out-Null
}

if (-not $SkipContainers) {
    $containerScript = Join-Path $RepoRoot "scripts\worker-containers.ps1"
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "Starting worker containers (profile workers; will not touch web/ollama)..."
        & powershell -NoProfile -ExecutionPolicy Bypass -File $containerScript -Action start
        if ($LASTEXITCODE -ne 0) {
            Write-Host "WARN: worker containers failed to start (exit $LASTEXITCODE). Clones are ready; retry npm run workers:up"
        }
    } else {
        Write-Host "WARN: docker not on PATH; skip worker containers"
    }
}

Write-Host "Bootstrap complete."
Write-Host "Clones:"
Get-ChildItem $WorktreeRoot -Directory | ForEach-Object { Write-Host "  $($_.FullName)" }
