#!/bin/bash

# Network Diagnostic Script
# This script diagnoses network connectivity issues between Traefik and containers

set -e

echo "🌐 Network Connectivity Diagnostic"
echo "=================================="

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

print_status "Checking Docker network configuration..."
docker network ls
echo ""

print_status "Checking app-network details..."
docker network inspect app-network | grep -A 10 -B 5 "Containers" || echo "Network details not available"
echo ""

print_status "Testing container-to-container connectivity..."

# Test if Traefik can reach frontend
print_status "Testing Traefik -> Frontend connectivity..."
if docker exec my-site-traefik-1 wget -qO- --timeout=5 http://my-site-web-1:4000 > /dev/null 2>&1; then
    print_success "Traefik can reach frontend container!"
else
    print_error "Traefik CANNOT reach frontend container"
fi

# Test if Traefik can reach API
print_status "Testing Traefik -> API connectivity..."
if docker exec my-site-traefik-1 wget -qO- --timeout=5 http://my-site-api-1:8000 > /dev/null 2>&1; then
    print_success "Traefik can reach API container!"
else
    print_error "Traefik CANNOT reach API container"
fi

# Test frontend internal connectivity
print_status "Testing Frontend internal connectivity..."
if docker exec my-site-web-1 curl -f --timeout=5 http://localhost:4000 > /dev/null 2>&1; then
    print_success "Frontend responds to internal requests!"
else
    print_error "Frontend does NOT respond to internal requests"
fi

# Test API internal connectivity
print_status "Testing API internal connectivity..."
if docker exec my-site-api-1 curl -f --timeout=5 http://localhost:8000 > /dev/null 2>&1; then
    print_success "API responds to internal requests!"
else
    print_error "API does NOT respond to internal requests"
fi

print_status "Checking Traefik service discovery..."
# Enable Traefik API temporarily if not enabled
docker exec my-site-traefik-1 wget -qO- http://localhost:8080/api/http/services 2>/dev/null | grep -E "(web|api)" || print_warning "Traefik API not accessible or services not discovered"

print_status "Checking container IP addresses..."
echo "Frontend IP: $(docker inspect my-site-web-1 | grep -E '"IPAddress"' | head -1 | cut -d'"' -f4)"
echo "API IP: $(docker inspect my-site-api-1 | grep -E '"IPAddress"' | head -1 | cut -d'"' -f4)"
echo "Traefik IP: $(docker inspect my-site-traefik-1 | grep -E '"IPAddress"' | head -1 | cut -d'"' -f4)"

print_status "Testing external domain resolution..."
nslookup mirkotrotta.com | grep -A 2 "Non-authoritative answer:"

print_status "Testing HTTPS certificate..."
echo | openssl s_client -connect mirkotrotta.com:443 -servername mirkotrotta.com 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || print_warning "SSL certificate check failed"

print_status "Checking Traefik logs for errors..."
docker compose -f docker-compose.prod.yml logs traefik | tail -20 | grep -E "(error|Error|ERROR)" || echo "No recent errors in Traefik logs"

echo ""
print_status "=== SUMMARY ==="
print_status "If Traefik cannot reach containers, the issue is likely:"
echo "1. Docker network configuration"
echo "2. Container networking mode"
echo "3. Firewall rules blocking internal traffic"
echo ""
print_status "If containers respond internally but not externally:"
echo "1. Traefik routing configuration"
echo "2. DNS/domain configuration"
echo "3. SSL certificate issues" 