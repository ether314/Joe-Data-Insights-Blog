# Dig into Cursor agent "Connection lost, reconnecting to api2.cursor.sh" failures.
# Invoked by run-blog-production-local.ps1 after a transport kill, or manually:
#   powershell -File scripts/debug-agent-transport.ps1

$ErrorActionPreference = "Continue"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogDir = Join-Path $RepoRoot "artifacts\automation-logs"
$OutDir = Join-Path $RepoRoot "artifacts\transport-debug"
$Stamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$Report = Join-Path $OutDir "transport-debug-$Stamp.md"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

function Add-Section([string]$Title) {
    Add-Content -Path $Report -Value ""
    Add-Content -Path $Report -Value "## $Title"
    Add-Content -Path $Report -Value ""
}

function Add-Line([string]$Line) {
    Add-Content -Path $Report -Value $Line
}

function Add-Code([string]$Text) {
    Add-Content -Path $Report -Value '```'
    Add-Content -Path $Report -Value ($Text -replace "`r", "")
    Add-Content -Path $Report -Value '```'
}

@"
# Agent transport debug - $Stamp

Collected after a Cursor CLI transport failure (Connection lost / api2.cursor.sh).
"@ | Set-Content -Path $Report -Encoding UTF8

Write-Host "[transport-debug] Writing $Report"

Add-Section "Summary hypotheses"
Add-Line "- Oversized agent turn payload (skills, MCP, huge prompt, long tool results)"
Add-Line "- HTTP/2 / TLS / proxy blips to api2.cursor.sh"
Add-Line "- Concurrent agent / deploy / MCP processes saturating the connection"
Add-Line "- Stale reconnect kill policy treating recovered sessions as unhealthy"

# --- Environment ---
Add-Section "Environment"
Add-Line "- Time (local): $(Get-Date -Format o)"
Add-Line "- Time (UTC): $((Get-Date).ToUniversalTime().ToString('o'))"
Add-Line "- User: $env:USERNAME"
Add-Line "- Repo: $RepoRoot"
try {
    $agentVer = & agent --version 2>&1 | Out-String
    Add-Line "- agent --version:"
    Add-Code $agentVer.Trim()
} catch {
    Add-Line "- agent --version: FAILED ($($_.Exception.Message))"
}
try {
    $agentStatus = & agent status 2>&1 | Out-String
    Add-Line "- agent status:"
    Add-Code $agentStatus.Trim()
} catch {
    Add-Line "- agent status: FAILED ($($_.Exception.Message))"
}

# --- Lock / run ---
Add-Section "Production lock"
$LockFile = Join-Path $RepoRoot "artifacts\blog-production-lock.json"
if (Test-Path $LockFile) {
    Add-Code ((Get-Content $LockFile -Raw) -replace '^\uFEFF', '')
} else {
    Add-Line "_No lock file_"
}

# --- Latest production log ---
Add-Section "Latest production log (tail)"
$prodLog = Get-ChildItem -Path $LogDir -Filter "production-20*.log" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
if ($prodLog) {
    Add-Line "- File: ``$($prodLog.Name)`` (mtime $($prodLog.LastWriteTime.ToString('o')))"
    $tail = Get-Content $prodLog.FullName -Tail 80
    Add-Code ($tail -join "`n")
    $blips = Select-String -Path $prodLog.FullName -Pattern "Connection lost|Retry attempt|transport|ENHANCE_YOUR_CALM|session" -AllMatches |
        Select-Object -Last 30
    Add-Line "Blip-related lines:"
    Add-Code (($blips | ForEach-Object { $_.Line }) -join "`n")
} else {
    Add-Line "_No production-20*.log found_"
}

# --- Prompt size ---
Add-Section "Prompt / payload sizes"
$PromptFile = Join-Path $RepoRoot "scripts\blog-production-prompt.txt"
if (Test-Path $PromptFile) {
    $len = (Get-Item $PromptFile).Length
    Add-Line "- blog-production-prompt.txt: $len bytes ($([math]::Round($len/1KB,1)) KB)"
}
$SkillsRoot = Join-Path $env:USERPROFILE ".cursor\skills"
$SkillsPark = Join-Path $env:USERPROFILE ".cursor\skills-parked-blog-production"
Add-Line "- ~/.cursor/skills:"
if (Test-Path $SkillsRoot) {
    Get-ChildItem $SkillsRoot -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $sum = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
        if ($null -eq $sum) { $sum = 0 }
        Add-Line ("  - {0}: {1:N1} MB" -f $_.Name, ($sum / 1MB))
    }
} else {
    Add-Line "  _(missing)_"
}
Add-Line "- ~/.cursor/skills-parked-blog-production:"
if (Test-Path $SkillsPark) {
    Get-ChildItem $SkillsPark -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $sum = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
        if ($null -eq $sum) { $sum = 0 }
        Add-Line ("  - {0}: {1:N1} MB" -f $_.Name, ($sum / 1MB))
    }
} else {
    Add-Line "  _(none)_"
}

# MCP / project rules size ballpark
$McpCandidates = @(
    (Join-Path $env:USERPROFILE ".cursor\mcp.json"),
    (Join-Path $RepoRoot ".cursor\mcp.json")
)
foreach ($mcp in $McpCandidates) {
    if (Test-Path $mcp) {
        Add-Line "- MCP config: ``$mcp`` ($((Get-Item $mcp).Length) bytes)"
    }
}

# --- Network to api2.cursor.sh ---
Add-Section "Network: api2.cursor.sh"
try {
    $dns = Resolve-DnsName api2.cursor.sh -ErrorAction Stop | Select-Object -First 5
    Add-Line "DNS:"
    Add-Code (($dns | Format-Table -AutoSize | Out-String).Trim())
} catch {
    Add-Line "DNS FAILED: $($_.Exception.Message)"
}

foreach ($name in @("api2.cursor.sh", "api.cursor.sh")) {
    try {
        $tcp = Test-NetConnection $name -Port 443 -WarningAction SilentlyContinue
        Add-Line ("TCP 443 {0}: TcpTestSucceeded={1} RemoteAddress={2}" -f $name, $tcp.TcpTestSucceeded, $tcp.RemoteAddress)
    } catch {
        Add-Line "TCP 443 $name FAILED: $($_.Exception.Message)"
    }
}

try {
    $sw = [Diagnostics.Stopwatch]::StartNew()
    $resp = Invoke-WebRequest -Uri "https://api2.cursor.sh/" -Method Head -TimeoutSec 20 -UseBasicParsing
    $sw.Stop()
    Add-Line ("HTTPS HEAD https://api2.cursor.sh/ -> {0} in {1}ms" -f [int]$resp.StatusCode, $sw.ElapsedMilliseconds)
} catch {
    $sw.Stop()
    Add-Line ("HTTPS HEAD https://api2.cursor.sh/ FAILED in {0}ms: {1}" -f $sw.ElapsedMilliseconds, $_.Exception.Message)
}

# Proxy / HTTP2 related env
Add-Section "Proxy / HTTP env"
@(
    "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "NO_PROXY",
    "http_proxy", "https_proxy", "all_proxy", "no_proxy",
    "NODE_OPTIONS", "GRPC_DNS_RESOLVER"
) | ForEach-Object {
    $v = [Environment]::GetEnvironmentVariable($_)
    if ($v) { Add-Line "- $_=$v" }
}

# --- Competing processes ---
Add-Section "Relevant processes"
$patterns = @(
    "run-blog-production-local\.ps1",
    "index\.js.*-p --force",
    "cursor-agent",
    "firebase-tools",
    "firebase-deploy-hosting",
    "production-stream-server",
    "npm run (build|deploy)",
    "smoke-test-viz"
)
$procs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -and (
        $_.CommandLine -match ($patterns -join "|")
    )
}
if ($procs) {
    $lines = foreach ($p in $procs) {
        $cmd = ($p.CommandLine -replace "\s+", " ")
        if ($cmd.Length -gt 180) { $cmd = $cmd.Substring(0, 177) + "..." }
        "pid=$($p.ProcessId) ppid=$($p.ParentProcessId) $($p.Name) | $cmd"
    }
    Add-Code ($lines -join "`n")
} else {
    Add-Line "_None matched_"
}

# --- Recent agent transcripts ---
Add-Section "Latest agent transcript (tail)"
$tx = Get-ChildItem -Path $LogDir -Filter "agent-transcript-*.txt" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
if ($tx) {
    Add-Line "- File: ``$($tx.Name)``"
    Add-Code ((Get-Content $tx.FullName -Tail 40) -join "`n")
} else {
    Add-Line "_No transcript_"
}

# --- Verdict sketch ---
Add-Section "Auto notes"
$notes = @()
if ($prodLog) {
    $text = Get-Content $prodLog.FullName -Raw
    if ($text -match "No heavy Cursor skills to park") {
        $notes += "Production reported no heavy skills parked - confirm book skills are not silently missing or restored mid-run."
    }
    if ($text -match "Parked heavy Cursor skills") {
        $notes += "Heavy skills were parked for this run (good for payload size)."
    }
    $lostCount = ([regex]::Matches($text, "Connection lost")).Count
    $notes += "Connection lost count in latest production log: $lostCount"
}
if (-not $notes.Count) { $notes += "See sections above; correlate blip times with deploy/MCP spikes." }
$notes | ForEach-Object { Add-Line "- $_" }

Add-Line ""
Add-Line "_Report path: ``$Report``_"

# Also append a short pointer into the main automation log dir
$pointer = Join-Path $LogDir "transport-debug-latest.txt"
"Report: $Report`nWritten: $(Get-Date -Format o)" | Set-Content -Path $pointer -Encoding UTF8
Write-Host "[transport-debug] Done -> $Report"
exit 0
