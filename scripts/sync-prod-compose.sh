#!/bin/bash

# Sync Production Docker Compose & Fix Script
# This script ensures the server's docker-compose.prod.yml matches the repository
# and then runs the full production fix script.

set -e

echo "🔄 Syncing docker-compose.prod.yml and Running Full Fix"
echo "======================================================"

# --- Helper Functions ---
print_status() { echo -e "\\033[0;34m[INFO]\\033[0m $1"; }
print_success() { echo -e "\\033[0;32m[SUCCESS]\\033[0m $1"; }
print_warning() { echo -e "\\033[1;33m[WARNING]\\033[0m $1"; }
print_error() { echo -e "\\033[0;31m[ERROR]\\033[0m $1"; }

COMPOSE_FILE="docker-compose.prod.yml"

# --- Main Script ---
print_status "Step 1: Ensuring we are in the project root (~/my-site)..."
if [ ! -d ".git" ]; then
    print_error "This script must be run from the root of the my-site Git repository."
    exit 1
fi

print_status "Step 2: Backing up current $COMPOSE_FILE on server..."
if [ -f "$COMPOSE_FILE" ]; then
    cp "$COMPOSE_FILE" "${COMPOSE_FILE}.bak.pre-sync.$(date +%s)"
    print_success "Backed up existing $COMPOSE_FILE to ${COMPOSE_FILE}.bak.pre-sync.*"
else
    print_warning "No existing $COMPOSE_FILE found to back up."
fi

print_status "Step 3: Fetching latest changes from Git repository..."
git fetch origin

print_status "Step 4: Forcefully checking out $COMPOSE_FILE from origin/main..."
# This will overwrite any local changes to this specific file.
git checkout origin/main -- "$COMPOSE_FILE"
if [ $? -eq 0 ]; then
    print_success "$COMPOSE_FILE has been successfully synced with origin/main."
else
    print_error "Failed to sync $COMPOSE_FILE from origin/main. Please check Git status and resolve conflicts manually."
    exit 1
fi

print_status "Step 5: Verifying the synced $COMPOSE_FILE contents (middleware and port)..."
if grep -A 10 "services:" "$COMPOSE_FILE" | grep -A 8 "api:" | grep -q "traefik.http.middlewares.api-stripprefix.stripprefix.prefixes=/api"; then
    print_success "Synced $COMPOSE_FILE contains Traefik 'api-stripprefix' middleware."
else
    print_error "Synced $COMPOSE_FILE STILL MISSING Traefik 'api-stripprefix' middleware. Critical error!"
    exit 1
fi
if grep -A 10 "services:" "$COMPOSE_FILE" | grep -A 8 "api:" | grep -q "traefik.http.services.api.loadbalancer.server.port=8000"; then
    print_success "Synced $COMPOSE_FILE contains correct API service port 8000."
else
    print_error "Synced $COMPOSE_FILE STILL MISSING API service port 8000. Critical error!"
    exit 1
fi

print_status "Step 6: Running the full production fix script..."
if [ -f "./scripts/full-prod-fix.sh" ]; then
    chmod +x ./scripts/full-prod-fix.sh
    ./scripts/full-prod-fix.sh
else
    print_error "./scripts/full-prod-fix.sh not found. Cannot proceed."
    exit 1
fi

print_success "Sync and Fix process completed."
print_warning "Please review the output of full-prod-fix.sh carefully." 