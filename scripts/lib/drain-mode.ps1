# Drain-only / backlog-only conveyor helpers. Dot-source after $RepoRoot is set.

function Get-BlogDrainFlagPath {
    param([string]$RepoRoot)
    return (Join-Path $RepoRoot "artifacts\blog-drain-only.flag")
}

function Test-BlogDrainOnly {
    param([string]$RepoRoot)
    if ($env:BLOG_CLAIM_BACKLOG_ONLY -match '^(1|true|yes)$') { return $true }
    return (Test-Path (Get-BlogDrainFlagPath $RepoRoot))
}

function Set-BlogDrainEnv {
    param([string]$RepoRoot)
    if (Test-BlogDrainOnly -RepoRoot $RepoRoot) {
        $env:BLOG_CLAIM_BACKLOG_ONLY = "1"
        return $true
    }
    return $false
}
