#!/bin/bash

# Test API Endpoints Script
# This script tests if the API endpoints are working correctly

set -e

echo "🧪 Testing API Endpoints"
echo "========================"

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

print_status "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" https://mirkotrotta.com/api/health)
HTTP_CODE="${HEALTH_RESPONSE: -3}"
RESPONSE_BODY="${HEALTH_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Health endpoint working! Response: $RESPONSE_BODY"
else
    print_error "Health endpoint failed! HTTP Code: $HTTP_CODE, Response: $RESPONSE_BODY"
fi

echo ""
print_status "Testing GitHub API endpoint..."
GITHUB_RESPONSE=$(curl -s -w "%{http_code}" https://mirkotrotta.com/api/github)
HTTP_CODE="${GITHUB_RESPONSE: -3}"
RESPONSE_BODY="${GITHUB_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    print_success "GitHub API working! Response length: ${#RESPONSE_BODY} characters"
    echo "First 200 characters: ${RESPONSE_BODY:0:200}..."
else
    print_error "GitHub API failed! HTTP Code: $HTTP_CODE, Response: $RESPONSE_BODY"
fi

echo ""
print_status "Testing resume API endpoint..."
RESUME_RESPONSE=$(curl -s -w "%{http_code}" https://mirkotrotta.com/api/resume)
HTTP_CODE="${RESUME_RESPONSE: -3}"
RESPONSE_BODY="${RESUME_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Resume API working! Response length: ${#RESPONSE_BODY} characters"
else
    print_error "Resume API failed! HTTP Code: $HTTP_CODE, Response: $RESPONSE_BODY"
fi

echo ""
print_status "Checking current environment variables in web container..."
docker exec my-site-web-1 env | grep -E "(NEXT_PUBLIC_API_URL|NODE_ENV)" || echo "Environment variables not found"

echo ""
print_status "Checking current environment variables in API container..."
docker exec my-site-api-1 env | grep -E "(FRONTEND_URL|PORT)" || echo "Environment variables not found" 