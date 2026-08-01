# Bootstrap 5 git worktrees for parallel blog workers (1-4 producers + 5 recovery).
# Usage: powershell -File scripts/bootstrap-worktrees.ps1 [-Force]

param([switch]$Force)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$WorktreeRoot = if ($env:BLOG_WORKTREE_ROOT) { $env:BLOG_WORKTREE_ROOT } else {
    Join-Path (Split-Path -Parent $RepoRoot) "data-insights-blog-worktrees"
}
$WorkerCount = 5

Set-Location $RepoRoot
New-Item -ItemType Directory -Path $WorktreeRoot -Force | Out-Null

$baseBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if (-not $baseBranch) { $baseBranch = "master" }
Write-Host "Base branch: $baseBranch"
Write-Host "Worktree root: $WorktreeRoot"

# Ensure node_modules exists in main for junction
if (-not (Test-Path (Join-Path $RepoRoot "node_modules"))) {
    Write-Host "Installing dependencies in main repo..."
    npm install
}

for ($i = 1; $i -le $WorkerCount; $i++) {
    $name = "worker-$i"
    $path = Join-Path $WorktreeRoot $name
    $branch = "worktree/$name"

    if (Test-Path $path) {
        if ($Force) {
            Write-Host "Removing existing worktree $name..."
            git worktree remove --force $path 2>$null
            if (Test-Path $path) { Remove-Item -Recurse -Force $path }
            git branch -D $branch 2>$null
        } else {
            Write-Host "Worktree $name already exists at $path"
            $nm = Join-Path $path "node_modules"
            if (-not (Test-Path $nm)) {
                cmd /c mklink /J "$nm" "$(Join-Path $RepoRoot 'node_modules')" | Out-Null
                Write-Host "  Linked node_modules"
            }
            continue
        }
    }

    # Create branch from current HEAD if missing
    $exists = git show-ref --verify --quiet "refs/heads/$branch"
    if ($LASTEXITCODE -ne 0) {
        git branch $branch HEAD | Out-Null
    }

    git worktree add -f $path $branch
    if ($LASTEXITCODE -ne 0) { throw "Failed to add worktree $name" }

    $nm = Join-Path $path "node_modules"
    if (-not (Test-Path $nm)) {
        cmd /c mklink /J "$nm" "$(Join-Path $RepoRoot 'node_modules')" | Out-Null
    }
    Write-Host "Ready: $name -> $path (branch $branch)"
}

# Init empty jobs file if missing
$jobs = Join-Path $RepoRoot "artifacts\agent-jobs.json"
New-Item -ItemType Directory -Path (Join-Path $RepoRoot "artifacts\locks") -Force | Out-Null
if (-not (Test-Path $jobs)) {
    node -e "import('./scripts/lib/agent-jobs.mjs').then(m=>m.writeJobs(m.emptyQueue()))"
}

Write-Host "Bootstrap complete."
git worktree list
