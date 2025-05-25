#!/bin/bash

# Clean Production Deployment Script
# This script performs a safe, clean redeployment of the production environment

set -e

echo "🚀 Clean Production Deployment"
echo "=============================="

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

# Function to ask for confirmation
confirm() {
    read -p "$(echo -e ${YELLOW}$1${NC}) [y/N]: " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    print_error "docker-compose.prod.yml not found. Are you in the project root?"
    exit 1
fi

# Check for required environment file
if [ ! -f ".env.production" ] && [ ! -f ".env" ]; then
    print_error "No environment file found (.env.production or .env)"
    print_error "Please create one with the required variables before deployment"
    exit 1
fi

print_status "Starting clean production deployment..."

# 1. Backup current state
echo -e "\n💾 Backup Current State"
echo "======================"

BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup Traefik certificates if they exist
if [ -f "data/traefik/acme/acme.json" ]; then
    print_status "Backing up Traefik certificates..."
    cp -r data/traefik/acme "$BACKUP_DIR/"
    print_success "Certificates backed up to $BACKUP_DIR/acme/"
fi

# Backup environment files
if [ -f ".env.production" ]; then
    cp .env.production "$BACKUP_DIR/"
    print_success "Environment file backed up"
fi

# Export current container logs
print_status "Exporting current container logs..."
docker compose -f docker-compose.prod.yml logs > "$BACKUP_DIR/container-logs.txt" 2>/dev/null || true
print_success "Logs exported to $BACKUP_DIR/container-logs.txt"

# 2. Pre-deployment checks
echo -e "\n🔍 Pre-deployment Checks"
echo "========================"

# Check Git status
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Uncommitted changes detected. Consider committing them first."
    if ! confirm "Continue anyway?"; then
        exit 1
    fi
fi

# Check if we're up to date with main
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    print_warning "Local repository is not up to date with origin/main"
    if confirm "Pull latest changes from origin/main?"; then
        git pull origin main
        print_success "Repository updated"
    fi
fi

# Check Docker connectivity
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running or accessible"
    exit 1
fi

# Check GitHub Container Registry connectivity
if ! curl -s https://ghcr.io > /dev/null; then
    print_error "Cannot reach GitHub Container Registry"
    exit 1
fi

print_success "Pre-deployment checks passed"

# 3. Stop current deployment
echo -e "\n🛑 Stopping Current Deployment"
echo "=============================="

if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    print_status "Stopping current containers..."
    docker compose -f docker-compose.prod.yml down
    print_success "Containers stopped"
else
    print_status "No running containers found"
fi

# 4. Clean up Docker resources
echo -e "\n🧹 Cleaning Up Docker Resources"
echo "==============================="

if confirm "Remove unused Docker images and containers?"; then
    print_status "Cleaning up unused Docker resources..."
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images (but keep the ones we might need)
    docker image prune -f
    
    # Remove unused volumes (be careful with this)
    if confirm "Remove unused Docker volumes? (This might remove data!)"; then
        docker volume prune -f
    fi
    
    print_success "Docker cleanup completed"
fi

# 5. Pull latest images
echo -e "\n📦 Pulling Latest Images"
echo "========================"

print_status "Pulling latest container images..."
if docker compose -f docker-compose.prod.yml pull; then
    print_success "Images pulled successfully"
else
    print_error "Failed to pull images"
    exit 1
fi

# 6. Verify environment configuration
echo -e "\n🔧 Environment Configuration"
echo "============================"

# Use .env.production if it exists, otherwise .env
ENV_FILE=".env.production"
if [ ! -f "$ENV_FILE" ]; then
    ENV_FILE=".env"
fi

print_status "Using environment file: $ENV_FILE"

# Check for required variables
REQUIRED_VARS=("DOMAIN" "ACME_EMAIL")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" "$ENV_FILE" 2>/dev/null; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    print_warning "Missing required environment variables:"
    printf '  %s\n' "${MISSING_VARS[@]}"
    if ! confirm "Continue anyway?"; then
        exit 1
    fi
fi

# 7. Ensure required directories exist
echo -e "\n📁 Creating Required Directories"
echo "==============================="

print_status "Creating required directories..."
mkdir -p data/traefik/acme
chmod 600 data/traefik/acme 2>/dev/null || true
print_success "Directories created"

# 8. Deploy new version
echo -e "\n🚀 Deploying New Version"
echo "========================"

print_status "Starting new deployment..."

# Set environment file for docker-compose
export COMPOSE_FILE="docker-compose.prod.yml"
if [ -f ".env.production" ]; then
    export COMPOSE_ENV_FILE=".env.production"
fi

if docker compose -f docker-compose.prod.yml up -d; then
    print_success "Deployment started successfully"
else
    print_error "Deployment failed"
    
    # Attempt to restore from backup if available
    if [ -d "$BACKUP_DIR" ] && confirm "Attempt to restore from backup?"; then
        print_status "Restoring from backup..."
        if [ -d "$BACKUP_DIR/acme" ]; then
            cp -r "$BACKUP_DIR/acme" data/traefik/
        fi
        docker compose -f docker-compose.prod.yml up -d
    fi
    exit 1
fi

# 9. Health checks
echo -e "\n🏥 Health Checks"
echo "================"

print_status "Waiting for services to start..."
sleep 10

# Check if containers are running
RUNNING_CONTAINERS=$(docker compose -f docker-compose.prod.yml ps --services --filter "status=running")
EXPECTED_SERVICES=("web" "api" "traefik")

for service in "${EXPECTED_SERVICES[@]}"; do
    if echo "$RUNNING_CONTAINERS" | grep -q "$service"; then
        print_success "$service is running"
    else
        print_warning "$service is not running"
    fi
done

# Check container health
print_status "Checking container health..."
docker compose -f docker-compose.prod.yml ps

# 10. Verify deployment
echo -e "\n✅ Deployment Verification"
echo "=========================="

print_status "Deployment completed successfully!"
print_status "Backup created in: $BACKUP_DIR"

echo ""
echo "Next steps:"
echo "1. Monitor the application logs: docker compose -f docker-compose.prod.yml logs -f"
echo "2. Check the website is accessible at your domain"
echo "3. Verify SSL certificates are working"
echo "4. Test API endpoints"
echo ""
echo "If issues occur, you can:"
echo "1. Check logs: docker compose -f docker-compose.prod.yml logs"
echo "2. Restart services: docker compose -f docker-compose.prod.yml restart"
echo "3. Restore from backup in: $BACKUP_DIR"

print_success "Clean deployment completed!" 