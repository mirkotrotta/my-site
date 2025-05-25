#!/bin/bash

# Production Audit Script for Oracle Cloud Deployment
# This script audits the current production setup and prepares for clean redeployment

set -e

echo "🔍 Production Environment Audit"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    print_error "docker-compose.prod.yml not found. Are you in the project root?"
    exit 1
fi

print_status "Starting production environment audit..."

# 1. Check Git status
echo -e "\n📋 Git Repository Status"
echo "========================"
print_status "Current branch: $(git branch --show-current)"
print_status "Latest commit: $(git log -1 --oneline)"

# Check if we're up to date with origin/main
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    print_warning "Local repository is not up to date with origin/main"
    echo "  Local:  $LOCAL"
    echo "  Remote: $REMOTE"
else
    print_success "Repository is up to date with origin/main"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Uncommitted changes detected:"
    git status --short
else
    print_success "No uncommitted changes"
fi

# 2. Check Docker containers
echo -e "\n🐳 Docker Container Status"
echo "=========================="
print_status "Current running containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

print_status "All containers (including stopped):"
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

# 3. Check Docker images
echo -e "\n📦 Docker Images"
echo "================"
print_status "Current images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Check for dangling images
DANGLING=$(docker images -f "dangling=true" -q)
if [ -n "$DANGLING" ]; then
    print_warning "Dangling images found (can be cleaned up):"
    docker images -f "dangling=true"
else
    print_success "No dangling images found"
fi

# 4. Check Docker volumes
echo -e "\n💾 Docker Volumes"
echo "================="
print_status "Current volumes:"
docker volume ls

# Check for unused volumes
UNUSED_VOLUMES=$(docker volume ls -f "dangling=true" -q)
if [ -n "$UNUSED_VOLUMES" ]; then
    print_warning "Unused volumes found (can be cleaned up):"
    docker volume ls -f "dangling=true"
else
    print_success "No unused volumes found"
fi

# 5. Check environment files
echo -e "\n🔧 Environment Configuration"
echo "============================"

# Check for .env files
if [ -f ".env" ]; then
    print_success ".env file found"
    echo "  Variables defined:"
    grep -v '^#' .env | grep -v '^$' | cut -d'=' -f1 | sed 's/^/    /'
else
    print_warning ".env file not found"
fi

if [ -f ".env.production" ]; then
    print_success ".env.production file found"
    echo "  Variables defined:"
    grep -v '^#' .env.production | grep -v '^$' | cut -d'=' -f1 | sed 's/^/    /'
else
    print_warning ".env.production file not found"
fi

# 6. Check Traefik data
echo -e "\n🔒 Traefik Configuration"
echo "======================="
if [ -d "data/traefik/acme" ]; then
    print_success "Traefik ACME directory exists"
    if [ -f "data/traefik/acme/acme.json" ]; then
        print_success "ACME certificates file exists"
        echo "  File size: $(du -h data/traefik/acme/acme.json | cut -f1)"
        echo "  Permissions: $(ls -la data/traefik/acme/acme.json | cut -d' ' -f1)"
    else
        print_warning "ACME certificates file not found"
    fi
else
    print_warning "Traefik ACME directory not found"
fi

# 7. Check disk space
echo -e "\n💿 Disk Space"
echo "============="
print_status "Disk usage:"
df -h | grep -E "(Filesystem|/dev/)"

print_status "Docker system disk usage:"
docker system df

# 8. Check network connectivity
echo -e "\n🌐 Network Connectivity"
echo "======================="
print_status "Checking GitHub Container Registry connectivity..."
if curl -s https://ghcr.io > /dev/null; then
    print_success "GitHub Container Registry is accessible"
else
    print_error "Cannot reach GitHub Container Registry"
fi

# 9. Check for potential issues
echo -e "\n⚠️  Potential Issues"
echo "==================="

# Check for old containers with similar names
OLD_CONTAINERS=$(docker ps -a --format "{{.Names}}" | grep -E "(my-site|web|api)" | grep -v staging || true)
if [ -n "$OLD_CONTAINERS" ]; then
    print_warning "Found containers with similar names that might conflict:"
    echo "$OLD_CONTAINERS" | sed 's/^/    /'
fi

# Check for port conflicts
print_status "Checking for port conflicts..."
PORTS_IN_USE=$(netstat -tuln 2>/dev/null | grep -E ":(80|443|4000|8000)" || true)
if [ -n "$PORTS_IN_USE" ]; then
    print_warning "Ports 80, 443, 4000, or 8000 are in use:"
    echo "$PORTS_IN_USE" | sed 's/^/    /'
fi

# 10. Generate cleanup recommendations
echo -e "\n🧹 Cleanup Recommendations"
echo "=========================="

echo "To prepare for clean redeployment, consider running:"
echo ""
echo "1. Stop and remove current containers:"
echo "   docker compose -f docker-compose.prod.yml down"
echo ""
echo "2. Remove unused Docker resources:"
echo "   docker system prune -f"
echo "   docker volume prune -f"
echo "   docker image prune -f"
echo ""
echo "3. Pull latest images:"
echo "   docker compose -f docker-compose.prod.yml pull"
echo ""
echo "4. Start fresh deployment:"
echo "   docker compose -f docker-compose.prod.yml up -d"

# 11. Summary
echo -e "\n📊 Audit Summary"
echo "================"
print_status "Audit completed. Review the warnings and recommendations above."
print_status "Ensure .env.production contains all necessary secrets before redeployment."
print_status "Consider backing up Traefik ACME certificates before cleanup."

echo -e "\n✅ Audit complete!" 