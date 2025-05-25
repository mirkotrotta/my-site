#!/bin/bash

# Staging Environment Setup Script
# This script sets up a staging environment for testing before production deployment

set -e

echo "🎭 Staging Environment Setup"
echo "============================"

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
if [ ! -f "docker-compose.staging.yml" ]; then
    print_error "docker-compose.staging.yml not found. Are you in the project root?"
    exit 1
fi

print_status "Setting up staging environment..."

# 1. Create staging directories
echo -e "\n📁 Creating Staging Directories"
echo "==============================="

print_status "Creating staging-specific directories..."
mkdir -p data/traefik-staging/acme
chmod 600 data/traefik-staging/acme 2>/dev/null || true
print_success "Staging directories created"

# 2. Check for environment file
echo -e "\n🔧 Environment Configuration"
echo "============================"

if [ ! -f ".env" ] && [ ! -f ".env.staging" ]; then
    print_warning "No environment file found"
    print_status "Creating basic .env file for staging..."
    
    cat > .env << EOF
# Staging Environment Configuration
DOMAIN=localhost
ACME_EMAIL=admin@example.com
GITHUB_REPOSITORY=mirkotrotta/my-site
DOCKER_REGISTRY=ghcr.io
TAG=latest
EOF
    
    print_success "Basic .env file created"
    print_warning "Please review and update the .env file with appropriate values"
else
    print_success "Environment file found"
fi

# 3. Pull latest images
echo -e "\n📦 Pulling Latest Images"
echo "========================"

print_status "Pulling latest container images for staging..."
if docker compose -f docker-compose.staging.yml pull; then
    print_success "Images pulled successfully"
else
    print_warning "Failed to pull some images (they might not exist yet)"
    print_status "You may need to build and push images first"
fi

# 4. Start staging environment
echo -e "\n🚀 Starting Staging Environment"
echo "==============================="

print_status "Starting staging containers..."
if docker compose -f docker-compose.staging.yml up -d; then
    print_success "Staging environment started successfully"
else
    print_error "Failed to start staging environment"
    exit 1
fi

# 5. Health checks
echo -e "\n🏥 Health Checks"
echo "================"

print_status "Waiting for services to start..."
sleep 10

# Check if containers are running
print_status "Checking container status..."
docker compose -f docker-compose.staging.yml ps

# 6. Display access information
echo -e "\n🌐 Access Information"
echo "===================="

print_success "Staging environment is ready!"
echo ""
echo "Access URLs:"
echo "  Frontend: http://localhost:4001"
echo "  API:      http://localhost:8001"
echo "  Traefik Dashboard: http://localhost:8080 (if enabled)"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose -f docker-compose.staging.yml logs -f"
echo "  Stop staging: docker compose -f docker-compose.staging.yml down"
echo "  Restart:      docker compose -f docker-compose.staging.yml restart"
echo ""

# 7. Test connectivity
echo -e "\n🔍 Testing Connectivity"
echo "======================="

print_status "Testing frontend connectivity..."
if curl -s http://localhost:4001 > /dev/null; then
    print_success "Frontend is accessible"
else
    print_warning "Frontend is not yet accessible (may still be starting)"
fi

print_status "Testing API connectivity..."
if curl -s http://localhost:8001 > /dev/null; then
    print_success "API is accessible"
else
    print_warning "API is not yet accessible (may still be starting)"
fi

print_success "Staging setup completed!"

echo ""
echo "Next steps:"
echo "1. Test your application at http://localhost:4001"
echo "2. Verify API endpoints at http://localhost:8001"
echo "3. Make any necessary changes to your code"
echo "4. When satisfied, deploy to production using the clean-deploy script" 