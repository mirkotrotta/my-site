#!/bin/bash

# Emergency Production Fix Script
# This script diagnoses and fixes the 403 error and API routing issues

set -e

echo "🚨 Emergency Production Fix"
echo "=========================="

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

print_status "=== EMERGENCY DIAGNOSTIC ==="

print_status "1. Checking container status..."
docker compose -f docker-compose.prod.yml ps

echo ""
print_status "2. Checking Traefik logs for errors..."
docker logs traefik --tail=50 | grep -E "(error|Error|ERROR|403|404)" || echo "No recent errors in Traefik logs"

echo ""
print_status "3. Checking web container logs..."
docker logs my-site-web-1 --tail=20 | grep -E "(error|Error|ERROR)" || echo "No recent errors in web logs"

echo ""
print_status "4. Checking API container logs..."
docker logs my-site-api-1 --tail=20 | grep -E "(error|Error|ERROR)" || echo "No recent errors in API logs"

echo ""
print_status "5. Testing direct container access..."
echo "Testing web container directly:"
curl -s -w "HTTP %{http_code}\n" http://localhost:4000/ || echo "Web container not accessible"

echo "Testing API container directly:"
curl -s -w "HTTP %{http_code}\n" http://localhost:8000/health || echo "API container not accessible"

echo ""
print_status "6. Checking Traefik dashboard access..."
curl -s -w "HTTP %{http_code}\n" http://localhost:8080/api/rawdata || echo "Traefik dashboard not accessible"

echo ""
print_status "7. Checking SSL certificate status..."
echo | openssl s_client -servername mirkotrotta.com -connect mirkotrotta.com:443 2>/dev/null | openssl x509 -noout -dates || echo "SSL certificate check failed"

echo ""
print_status "8. Checking DNS resolution..."
nslookup mirkotrotta.com || echo "DNS resolution failed"

echo ""
print_status "=== APPLYING EMERGENCY FIXES ==="

print_status "Fix 1: Restarting Traefik to reload configuration..."
docker compose -f docker-compose.prod.yml restart traefik

print_status "Waiting 10 seconds for Traefik to stabilize..."
sleep 10

print_status "Fix 2: Testing site accessibility..."
SITE_RESPONSE=$(curl -s -w "%{http_code}" https://mirkotrotta.com/ || echo "FAILED")
if [[ "$SITE_RESPONSE" == *"200"* ]]; then
    print_success "Site is now accessible!"
else
    print_error "Site still not accessible. Response: $SITE_RESPONSE"
fi

print_status "Fix 3: Testing API endpoints after Traefik restart..."
echo "Health endpoint:"
curl -s -w "HTTP %{http_code}\n" https://mirkotrotta.com/api/health

echo "GitHub endpoint:"
curl -s -w "HTTP %{http_code}\n" https://mirkotrotta.com/api/github

echo "Resume endpoint:"
curl -s -w "HTTP %{http_code}\n" https://mirkotrotta.com/api/resume

echo ""
print_status "=== FINAL STATUS ==="
print_status "If issues persist, we may need to:"
print_status "1. Check Traefik configuration file"
print_status "2. Verify SSL certificate renewal"
print_status "3. Check Oracle Cloud firewall rules"
print_status "4. Restart all containers with: docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up -d" 