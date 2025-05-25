#!/bin/bash

# Quick Frontend Fix Script
# This script diagnoses and fixes the frontend container issue

set -e

echo "🔧 Frontend Container Diagnostic & Fix"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    print_error "docker-compose.prod.yml not found. Are you in ~/my-site?"
    exit 1
fi

print_status "Checking current container status..."
docker compose -f docker-compose.prod.yml ps

print_status "Checking what's listening on ports..."
sudo ss -tuln | grep -E ":(80|443|4000|8000)" || echo "No services found on expected ports"

print_status "Checking frontend container logs..."
docker compose -f docker-compose.prod.yml logs web | tail -20

print_status "Attempting to restart frontend container..."
docker compose -f docker-compose.prod.yml up -d web

print_status "Waiting 10 seconds for container to start..."
sleep 10

print_status "Testing frontend connectivity..."
if curl -f http://localhost:4000 > /dev/null 2>&1; then
    print_success "Frontend is now responding!"
else
    print_warning "Frontend still not responding. Checking logs again..."
    docker compose -f docker-compose.prod.yml logs web | tail -10
fi

print_status "Final container status:"
docker compose -f docker-compose.prod.yml ps

print_status "Testing external access..."
curl -I http://localhost || echo "Traefik routing issue"

echo ""
print_status "If the frontend is still not working, run:"
echo "docker compose -f docker-compose.prod.yml logs web"
echo "docker compose -f docker-compose.prod.yml pull web"
echo "docker compose -f docker-compose.prod.yml up -d --force-recreate web" 