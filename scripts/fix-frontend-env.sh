#!/bin/bash

# Fix Frontend Environment Variables Script
# This script fixes the frontend environment variable issue

set -e

echo "🔧 Fixing Frontend Environment Variables"
echo "========================================"

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

print_status "Current environment variables in web container:"
docker exec my-site-web-1 env | grep -E "(NEXT_PUBLIC_API_URL|NODE_ENV)" || echo "No relevant env vars found"

echo ""
print_status "The issue is that the frontend was built with localhost:8000 instead of the production domain."
print_status "We need to trigger a rebuild with the correct environment variables."

echo ""
print_warning "This will trigger GitHub Actions to rebuild and redeploy the containers."
print_warning "The process will take a few minutes."

echo ""
read -p "Do you want to proceed with triggering a rebuild? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Operation cancelled."
    exit 0
fi

print_status "Creating a dummy commit to trigger GitHub Actions..."

# Create a small change to trigger rebuild
echo "# Trigger rebuild - $(date)" >> .rebuild-trigger
git add .rebuild-trigger
git commit -m "trigger: rebuild frontend with correct environment variables"
git push origin main

print_success "Rebuild triggered!"
print_status "GitHub Actions will now:"
print_status "1. Build the frontend with NEXT_PUBLIC_API_URL=https://mirkotrotta.com/api"
print_status "2. Push new images to GitHub Container Registry"
print_status "3. Watchtower will automatically pull and restart containers"

echo ""
print_status "Monitor the progress:"
print_status "1. GitHub Actions: https://github.com/mirkotrotta/my-site/actions"
print_status "2. Watch containers: docker compose -f docker-compose.prod.yml logs -f"

echo ""
print_status "The fix should be complete in 3-5 minutes."
print_status "After that, both resume and GitHub projects should work correctly!"

echo ""
print_status "You can test the endpoints while waiting:"
print_status "curl -s https://mirkotrotta.com/api/health"
print_status "curl -s https://mirkotrotta.com/api/github"
print_status "curl -s https://mirkotrotta.com/api/resume" 