#!/bin/bash

# Fix API Routes Script
# This script fixes the API routing issue by correcting the route definitions

set -e

echo "🔧 Fixing API Routes"
echo "==================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    print_error "docker-compose.prod.yml not found. Are you in ~/my-site?"
    exit 1
fi

print_status "The issue is that FastAPI routes have /api prefix, but Traefik strips /api"
print_status "This creates a mismatch: /api/github becomes /github but FastAPI expects /api/github"

print_status "Current API routes in main.py:"
grep -n "prefix=" backend/main.py || echo "No prefix routes found"

print_status "We need to either:"
print_status "1. Remove /api prefix from FastAPI routes (recommended)"
print_status "2. Or remove path stripping from Traefik"

print_status "Applying fix: Updating main.py to remove /api prefix from routes..."

# Create a backup
cp backend/main.py backend/main.py.backup

# Fix the routes by removing /api prefix
sed -i 's|prefix="/api/github"|prefix="/github"|g' backend/main.py
sed -i 's|prefix="/api/resume"|prefix="/resume"|g' backend/main.py

print_status "Updated routes:"
grep -n "prefix=" backend/main.py

print_status "Rebuilding and restarting API container..."
docker compose -f docker-compose.prod.yml build api
docker compose -f docker-compose.prod.yml up -d api

print_status "Waiting 10 seconds for API to start..."
sleep 10

print_status "Testing fixed endpoints..."
echo "Health endpoint:"
curl -s -w "HTTP %{http_code}\n" https://mirkotrotta.com/api/health

echo "GitHub endpoint:"
curl -s -w "HTTP %{http_code}\n" https://mirkotrotta.com/api/github

echo "Resume endpoint:"
curl -s -w "HTTP %{http_code}\n" https://mirkotrotta.com/api/resume

print_success "API routes fix applied!"
print_status "If this doesn't work, we can revert with: cp backend/main.py.backup backend/main.py" 