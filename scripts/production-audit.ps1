# Production Audit Script for Oracle Cloud Deployment (PowerShell)
# This script audits the current production setup and prepares for clean redeployment

param(
    [switch]$Detailed = $false
)

Write-Host "🔍 Production Environment Audit" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

# Check if we're in the right directory
if (-not (Test-Path "docker-compose.prod.yml")) {
    Write-Error "docker-compose.prod.yml not found. Are you in the project root?"
    exit 1
}

Write-Status "Starting production environment audit..."

# 1. Check Git status
Write-Host "`n📋 Git Repository Status" -ForegroundColor White
Write-Host "========================" -ForegroundColor White

try {
    $currentBranch = git branch --show-current
    $latestCommit = git log -1 --oneline
    Write-Status "Current branch: $currentBranch"
    Write-Status "Latest commit: $latestCommit"

    # Check if we're up to date with origin/main
    git fetch origin main 2>$null
    $local = git rev-parse HEAD
    $remote = git rev-parse origin/main

    if ($local -ne $remote) {
        Write-Warning "Local repository is not up to date with origin/main"
        Write-Host "  Local:  $local" -ForegroundColor Gray
        Write-Host "  Remote: $remote" -ForegroundColor Gray
    } else {
        Write-Success "Repository is up to date with origin/main"
    }

    # Check for uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Warning "Uncommitted changes detected:"
        git status --short
    } else {
        Write-Success "No uncommitted changes"
    }
} catch {
    Write-Error "Git not available or not a git repository"
}

# 2. Check Docker containers
Write-Host "`n🐳 Docker Container Status" -ForegroundColor White
Write-Host "==========================" -ForegroundColor White

try {
    Write-Status "Current running containers:"
    docker ps --format "table {{.Names}}`t{{.Image}}`t{{.Status}}`t{{.Ports}}"

    Write-Status "All containers (including stopped):"
    docker ps -a --format "table {{.Names}}`t{{.Image}}`t{{.Status}}"
} catch {
    Write-Error "Docker not available or not running"
}

# 3. Check Docker images
Write-Host "`n📦 Docker Images" -ForegroundColor White
Write-Host "================" -ForegroundColor White

try {
    Write-Status "Current images:"
    docker images --format "table {{.Repository}}`t{{.Tag}}`t{{.Size}}`t{{.CreatedAt}}"

    # Check for dangling images
    $danglingImages = docker images -f "dangling=true" -q
    if ($danglingImages) {
        Write-Warning "Dangling images found (can be cleaned up):"
        docker images -f "dangling=true"
    } else {
        Write-Success "No dangling images found"
    }
} catch {
    Write-Error "Failed to check Docker images"
}

# 4. Check Docker volumes
Write-Host "`n💾 Docker Volumes" -ForegroundColor White
Write-Host "=================" -ForegroundColor White

try {
    Write-Status "Current volumes:"
    docker volume ls

    # Check for unused volumes
    $unusedVolumes = docker volume ls -f "dangling=true" -q
    if ($unusedVolumes) {
        Write-Warning "Unused volumes found (can be cleaned up):"
        docker volume ls -f "dangling=true"
    } else {
        Write-Success "No unused volumes found"
    }
} catch {
    Write-Error "Failed to check Docker volumes"
}

# 5. Check environment files
Write-Host "`n🔧 Environment Configuration" -ForegroundColor White
Write-Host "============================" -ForegroundColor White

# Check for .env files
if (Test-Path ".env") {
    Write-Success ".env file found"
    Write-Host "  Variables defined:" -ForegroundColor Gray
    Get-Content ".env" | Where-Object { $_ -notmatch '^#' -and $_ -ne '' } | ForEach-Object { 
        $varName = ($_ -split '=')[0]
        Write-Host "    $varName" -ForegroundColor Gray
    }
} else {
    Write-Warning ".env file not found"
}

if (Test-Path ".env.production") {
    Write-Success ".env.production file found"
    Write-Host "  Variables defined:" -ForegroundColor Gray
    Get-Content ".env.production" | Where-Object { $_ -notmatch '^#' -and $_ -ne '' } | ForEach-Object { 
        $varName = ($_ -split '=')[0]
        Write-Host "    $varName" -ForegroundColor Gray
    }
} else {
    Write-Warning ".env.production file not found"
}

# 6. Check Traefik data
Write-Host "`n🔒 Traefik Configuration" -ForegroundColor White
Write-Host "=======================" -ForegroundColor White

if (Test-Path "data/traefik/acme") {
    Write-Success "Traefik ACME directory exists"
    if (Test-Path "data/traefik/acme/acme.json") {
        Write-Success "ACME certificates file exists"
        $fileInfo = Get-Item "data/traefik/acme/acme.json"
        Write-Host "  File size: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
        Write-Host "  Last modified: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
    } else {
        Write-Warning "ACME certificates file not found"
    }
} else {
    Write-Warning "Traefik ACME directory not found"
}

# 7. Check disk space
Write-Host "`n💿 Disk Space" -ForegroundColor White
Write-Host "=============" -ForegroundColor White

Write-Status "Disk usage:"
Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DriveType -eq 3 } | ForEach-Object {
    $freeGB = [math]::Round($_.FreeSpace / 1GB, 2)
    $totalGB = [math]::Round($_.Size / 1GB, 2)
    $usedGB = $totalGB - $freeGB
    $percentUsed = [math]::Round(($usedGB / $totalGB) * 100, 1)
    Write-Host "  $($_.DeviceID) $usedGB GB used / $totalGB GB total ($percentUsed% used)" -ForegroundColor Gray
}

try {
    Write-Status "Docker system disk usage:"
    docker system df
} catch {
    Write-Warning "Could not get Docker disk usage"
}

# 8. Check network connectivity
Write-Host "`n🌐 Network Connectivity" -ForegroundColor White
Write-Host "=======================" -ForegroundColor White

Write-Status "Checking GitHub Container Registry connectivity..."
try {
    $response = Invoke-WebRequest -Uri "https://ghcr.io" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "GitHub Container Registry is accessible"
    } else {
        Write-Warning "GitHub Container Registry returned status: $($response.StatusCode)"
    }
} catch {
    Write-Error "Cannot reach GitHub Container Registry"
}

# 9. Check for potential issues
Write-Host "`n⚠️  Potential Issues" -ForegroundColor White
Write-Host "===================" -ForegroundColor White

# Check for old containers with similar names
try {
    $oldContainers = docker ps -a --format "{{.Names}}" | Where-Object { $_ -match "(my-site|web|api)" -and $_ -notmatch "staging" }
    if ($oldContainers) {
        Write-Warning "Found containers with similar names that might conflict:"
        $oldContainers | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
    }
} catch {
    Write-Warning "Could not check for conflicting containers"
}

# Check for port conflicts
Write-Status "Checking for port conflicts..."
try {
    $portsInUse = Get-NetTCPConnection | Where-Object { $_.LocalPort -in @(80, 443, 4000, 8000) -and $_.State -eq "Listen" }
    if ($portsInUse) {
        Write-Warning "Ports 80, 443, 4000, or 8000 are in use:"
        $portsInUse | ForEach-Object { 
            Write-Host "    Port $($_.LocalPort) - Process ID: $($_.OwningProcess)" -ForegroundColor Gray 
        }
    } else {
        Write-Success "No port conflicts detected"
    }
} catch {
    Write-Warning "Could not check for port conflicts"
}

# 10. Generate cleanup recommendations
Write-Host "`n🧹 Cleanup Recommendations" -ForegroundColor White
Write-Host "==========================" -ForegroundColor White

Write-Host "To prepare for clean redeployment, consider running:" -ForegroundColor White
Write-Host ""
Write-Host "1. Stop and remove current containers:" -ForegroundColor Yellow
Write-Host "   docker compose -f docker-compose.prod.yml down" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Remove unused Docker resources:" -ForegroundColor Yellow
Write-Host "   docker system prune -f" -ForegroundColor Gray
Write-Host "   docker volume prune -f" -ForegroundColor Gray
Write-Host "   docker image prune -f" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Pull latest images:" -ForegroundColor Yellow
Write-Host "   docker compose -f docker-compose.prod.yml pull" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start fresh deployment:" -ForegroundColor Yellow
Write-Host "   docker compose -f docker-compose.prod.yml up -d" -ForegroundColor Gray

# 11. Summary
Write-Host "`n📊 Audit Summary" -ForegroundColor White
Write-Host "================" -ForegroundColor White
Write-Status "Audit completed. Review the warnings and recommendations above."
Write-Status "Ensure .env.production contains all necessary secrets before redeployment."
Write-Status "Consider backing up Traefik ACME certificates before cleanup."

Write-Host "`n✅ Audit complete!" -ForegroundColor Green 