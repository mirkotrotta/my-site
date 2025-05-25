#!/bin/bash

# Full Production Fix Script
# This script attempts to diagnose and fix common issues with the production deployment.

set -e # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting Full Production Fix Script"
echo "====================================="

# --- Configuration ---
TRAEFIK_CONTAINER_NAME="my-site-traefik-1" # As per docker-compose.prod.yml
API_CONTAINER_NAME="my-site-api-1"
WEB_CONTAINER_NAME="my-site-web-1"
PROD_DOMAIN="mirkotrotta.com"
DOCKER_COMPOSE_PROD_FILE="docker-compose.prod.yml"

# --- Helper Functions ---
print_status() { echo -e "\\033[0;34m[INFO]\\033[0m $1"; }
print_success() { echo -e "\\033[0;32m[SUCCESS]\\033[0m $1"; }
print_warning() { echo -e "\\033[1;33m[WARNING]\\033[0m $1"; }
print_error() { echo -e "\\033[0;31m[ERROR]\\033[0m $1"; }

check_docker_compose_file() {
    if [ ! -f "$DOCKER_COMPOSE_PROD_FILE" ]; then
        print_error "$DOCKER_COMPOSE_PROD_FILE not found. Are you in the project root (~/my-site)?"
        exit 1
    fi
}

# --- Pre-Checks ---
check_docker_compose_file

print_status "Step 1: Ensuring correct backend/main.py API routes..."
# Create a backup of the current main.py on the server
if [ -f "backend/main.py" ]; then
    cp backend/main.py backend/main.py.bak.$(date +%s)
    print_status "Backed up existing backend/main.py"
fi

# Ensure the correct content for API routes in main.py
# The local version was already corrected in the previous step and pushed.
# This script assumes git pull has been run.
# We'll just verify the critical lines.
if grep -q 'prefix="/api/github"' backend/main.py && grep -q 'prefix="/api/resume"' backend/main.py; then
    print_success "backend/main.py has correct /api prefixes for routers."
else
    print_warning "backend/main.py might not have correct /api prefixes. Manually verify or ensure git pull was successful."
    print_warning "Attempting to restore from backup if one from this script exists..."
    # This restore is basic, assumes the .bak from this script is the one to restore
    # More robust restore might be needed if multiple .bak exist or if the issue is complex
    ls -t backend/main.py.bak.* | head -n 1 | xargs -I {} cp {} backend/main.py && print_success "Restored main.py from latest backup." || print_error "Failed to restore main.py or no backup found."
fi

print_status "Step 2: Verifying Traefik configuration in $DOCKER_COMPOSE_PROD_FILE..."
# Ensure API service has the stripprefix middleware and correct port
if grep -A 10 "services:" "$DOCKER_COMPOSE_PROD_FILE" | grep -A 8 "api:" | grep -q "traefik.http.middlewares.api-stripprefix.stripprefix.prefixes=/api"; then
    print_success "Traefik 'api-stripprefix' middleware found for API service."
else
    print_error "Traefik 'api-stripprefix' middleware MISSING for API service in $DOCKER_COMPOSE_PROD_FILE. This is critical!"
    # Add remediation steps here if necessary, e.g., sed to fix it, but for now, just error out.
    # Example: sed -i '/traefik.http.routers.api.tls.certresolver=letsencrypt/a \      - traefik.http.routers.api.middlewares=api-stripprefix\n      - traefik.http.middlewares.api-stripprefix.stripprefix.prefixes=/api' $DOCKER_COMPOSE_PROD_FILE
    print_warning "Manual correction of $DOCKER_COMPOSE_PROD_FILE might be needed or ensure git pull was successful."
fi

if grep -A 10 "services:" "$DOCKER_COMPOSE_PROD_FILE" | grep -A 8 "api:" | grep -q "traefik.http.services.api.loadbalancer.server.port=8000"; then
    print_success "Traefik API service port is correctly set to 8000."
else
    print_error "Traefik API service port is NOT set to 8000 in $DOCKER_COMPOSE_PROD_FILE."
fi

print_status "Step 3: Rebuilding and Restarting all services..."
print_warning "This will cause a brief downtime."
docker compose -f "$DOCKER_COMPOSE_PROD_FILE" down || print_warning "docker compose down failed, proceeding anyway..."
docker compose -f "$DOCKER_COMPOSE_PROD_FILE" up -d --build --force-recreate
print_success "All services rebuilt and restarted."
print_status "Waiting 30 seconds for services to stabilize..."
sleep 30

print_status "Step 4: Performing Post-Fix Diagnostics..."

print_status "Checking container status:"
docker compose -f "$DOCKER_COMPOSE_PROD_FILE" ps

print_status "Checking Traefik logs (last 50 lines):"
docker logs "$TRAEFIK_CONTAINER_NAME" --tail 50 || print_error "Could not get Traefik logs."

print_status "Checking API logs (last 20 lines):"
docker logs "$API_CONTAINER_NAME" --tail 20 || print_error "Could not get API logs."
# Check for GITHUB_TOKEN warning specifically
if docker logs "$API_CONTAINER_NAME" --tail 20 | grep -q "Missing GITHUB_TOKEN"; then
    print_warning "GITHUB_TOKEN is still missing in the API container environment. Projects API will use fallback data."
fi

print_status "Checking Web logs (last 20 lines):"
docker logs "$WEB_CONTAINER_NAME" --tail 20 || print_error "Could not get Web logs."

print_status "Testing site accessibility (https://$PROD_DOMAIN):"
SITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$PROD_DOMAIN/")
if [ "$SITE_STATUS" == "200" ]; then
    print_success "Site is accessible (HTTP $SITE_STATUS)."
elif [ "$SITE_STATUS" == "301" ] || [ "$SITE_STATUS" == "302" ] || [ "$SITE_STATUS" == "307" ] || [ "$SITE_STATUS" == "308" ]; then
    print_warning "Site is redirecting (HTTP $SITE_STATUS). This might be okay (e.g., to /en or /de)."
    REDIRECT_URL=$(curl -s -L -o /dev/null -w "%{url_effective}" "https://$PROD_DOMAIN/")
    print_warning "Redirects to: $REDIRECT_URL"
else
    print_error "Site is NOT accessible. Status: HTTP $SITE_STATUS."
fi

print_status "Testing API Health endpoint (https://$PROD_DOMAIN/api/health):"
API_HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$PROD_DOMAIN/api/health")
if [ "$API_HEALTH_STATUS" == "200" ]; then
    print_success "API Health endpoint is OK (HTTP $API_HEALTH_STATUS)."
    curl -s "https://$PROD_DOMAIN/api/health" && echo ""
else
    print_error "API Health endpoint FAILED. Status: HTTP $API_HEALTH_STATUS."
    curl -s "https://$PROD_DOMAIN/api/health" && echo ""
fi

print_status "Testing API GitHub endpoint (https://$PROD_DOMAIN/api/github):"
API_GITHUB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$PROD_DOMAIN/api/github")
if [ "$API_GITHUB_STATUS" == "200" ]; then
    print_success "API GitHub endpoint is OK (HTTP $API_GITHUB_STATUS)."
else
    print_error "API GitHub endpoint FAILED. Status: HTTP $API_GITHUB_STATUS."
    # Attempt to show response body on failure
    print_warning "Response from GitHub endpoint:"
    curl -s "https://$PROD_DOMAIN/api/github" && echo ""
fi

print_status "Testing API Resume endpoint (https://$PROD_DOMAIN/api/resume):"
API_RESUME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$PROD_DOMAIN/api/resume")
if [ "$API_RESUME_STATUS" == "200" ]; then
    print_success "API Resume endpoint is OK (HTTP $API_RESUME_STATUS)."
else
    print_error "API Resume endpoint FAILED. Status: HTTP $API_RESUME_STATUS."
    print_warning "Response from Resume endpoint:"
    curl -s "https://$PROD_DOMAIN/api/resume" && echo ""
fi

print_status "Checking Web container's NEXT_PUBLIC_API_URL environment variable:"
WEB_ENV_VAR=$(docker exec "$WEB_CONTAINER_NAME" env | grep NEXT_PUBLIC_API_URL)
if [ "$WEB_ENV_VAR" == "NEXT_PUBLIC_API_URL=https://$PROD_DOMAIN/api" ]; then
    print_success "Web container NEXT_PUBLIC_API_URL is correctly set: $WEB_ENV_VAR"
else
    print_error "Web container NEXT_PUBLIC_API_URL is INCORRECT: $WEB_ENV_VAR"
    print_error "Expected: NEXT_PUBLIC_API_URL=https://$PROD_DOMAIN/api"
fi


print_status "Final SSL Certificate Check:"
echo | openssl s_client -servername "$PROD_DOMAIN" -connect "$PROD_DOMAIN:443" 2>/dev/null | openssl x509 -noout -dates || print_error "SSL certificate check failed."

echo ""
print_success "Full Production Fix Script Completed."
print_warning "Review all outputs carefully. If issues persist, further manual debugging may be needed."
print_warning "Consider checking Oracle Cloud infrastructure (firewalls, load balancers) if external access issues remain." 