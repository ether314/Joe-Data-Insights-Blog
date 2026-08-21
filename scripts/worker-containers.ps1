# Start / stop / pause Docker-isolated blog workers (never touches `web` or other projects).
# Usage:
#   powershell -File scripts/worker-containers.ps1 -Action start
#   powershell -File scripts/worker-containers.ps1 -Action ensure
#   powershell -File scripts/worker-containers.ps1 -Action stop
#   powershell -File scripts/worker-containers.ps1 -Action pause -ExcludeId 3
#   powershell -File scripts/worker-containers.ps1 -Action unpause

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("start", "stop", "pause", "unpause", "status", "ensure")]
    [string]$Action,
    [int]$ExcludeId = 0
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
. (Join-Path $RepoRoot "scripts\lib\worker-layout.ps1")
. (Join-Path $RepoRoot "scripts\lib\worker-pause.ps1")
[void](Ensure-BlogAutomationPath)

Set-Location $RepoRoot
$WorktreeRoot = Export-BlogWorkerComposeEnv $RepoRoot
$ComposeFile = Join-Path $RepoRoot "docker-compose.yml"
$Services = Get-BlogWorkerServiceNames

function Invoke-WorkerCompose {
    param([string[]]$ComposeArgs)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & docker compose --project-directory $RepoRoot -f $ComposeFile --profile workers @ComposeArgs
        return [int]$LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prev
    }
}

switch ($Action) {
    "start" {
        Write-Host "Worker clones: $WorktreeRoot"
        Write-Host "BLOG_WORKER_HOST_ROOT=$($env:BLOG_WORKER_HOST_ROOT)"
        $code = Invoke-WorkerCompose (@("up", "-d", "--build", "--no-deps") + $Services)
        if ($code -ne 0) { throw "docker compose up workers failed (exit $code)" }
        [void](Invoke-WorkerCompose (@("ps") + $Services))
    }
    "ensure" {
        # Bring exited/missing workers back. Never `compose down` (that kills `web`).
        Write-Host "Worker clones: $WorktreeRoot"
        $needStart = $false
        foreach ($id in 1..5) {
            $name = Get-BlogWorkerContainerName $id
            $running = $false
            $prev = $ErrorActionPreference
            $ErrorActionPreference = "Continue"
            try {
                $state = (& docker inspect -f "{{.State.Running}}" $name 2>$null | Out-String).Trim()
                $running = ($state -eq "true")
            } catch {
                $running = $false
            } finally {
                $ErrorActionPreference = $prev
            }
            if (-not $running) { $needStart = $true; break }
        }
        if (-not $needStart) {
            Write-Host "Worker containers already running (blog-worker-1..5)"
            return
        }
        Write-Host "Starting missing/exited worker containers (up -d --no-deps; no compose down)"
        $code = Invoke-WorkerCompose (@("up", "-d", "--no-deps") + $Services)
        if ($code -ne 0) {
            Write-Host "WARN: up without --build failed (exit $code); retrying with --build"
            $code = Invoke-WorkerCompose (@("up", "-d", "--build", "--no-deps") + $Services)
        }
        if ($code -ne 0) { throw "docker compose up workers failed (exit $code)" }
        [void](Invoke-WorkerCompose (@("ps") + $Services))
    }
    "stop" {
        $code = Invoke-WorkerCompose (@("stop") + $Services)
        if ($code -ne 0) { Write-Host "WARN: docker compose stop workers exit $code" }
    }
    "pause" {
        Pause-WorkerFleet -RepoRoot $RepoRoot -ExcludeId $ExcludeId
    }
    "unpause" {
        Resume-WorkerFleet -RepoRoot $RepoRoot
    }
    "status" {
        [void](Invoke-WorkerCompose (@("ps") + $Services))
    }
}
