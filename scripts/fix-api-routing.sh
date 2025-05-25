#!/bin/bash

# Fix API Routing Script
# This script fixes the Traefik routing issue by adding path stripping middleware

set -e

echo "🔧 Fixing API Routing Configuration"
echo "==================================="

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

print_status "Creating backup of current configuration..."
cp docker-compose.prod.yml docker-compose.prod.yml.backup

print_status "Updating Traefik configuration to strip /api prefix..."

# Create the updated docker-compose.prod.yml with path stripping
cat > docker-compose.prod.yml << 'EOF'
# docker-compose.prod.yml  – production stack (no local builds)

services:
  web:
    image: ghcr.io/mirkotrotta/my-site/my-site-web:${TAG:-latest}
    restart: unless-stopped
    expose:
      - 4000
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://${DOMAIN:-152.70.43.242}/api
    depends_on:
      - api
    labels:
      - traefik.enable=true
      - traefik.http.routers.web.rule=Host(`mirkotrotta.com`,`www.mirkotrotta.com`)
      - traefik.http.routers.web.entrypoints=websecure
      - traefik.http.routers.web.tls.certresolver=letsencrypt
      - traefik.http.services.web.loadbalancer.server.port=4000

  api:
    image: ghcr.io/mirkotrotta/my-site/my-site-api:${TAG:-latest}
    restart: unless-stopped
    expose:
      - 8000
    environment:
      - PYTHONUNBUFFERED=1
      - PORT=8000
      - FRONTEND_URL=https://${DOMAIN:-152.70.43.242}
    labels:
      - traefik.enable=true
      - traefik.http.routers.api.rule=Host(`mirkotrotta.com`) && PathPrefix(`/api`)
      - traefik.http.routers.api.entrypoints=websecure
      - traefik.http.routers.api.tls.certresolver=letsencrypt
      - traefik.http.routers.api.middlewares=api-stripprefix
      - traefik.http.middlewares.api-stripprefix.stripprefix.prefixes=/api
      - traefik.http.services.api.loadbalancer.server.port=8000

  traefik:
    image: traefik:v2.10
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./data/traefik/acme:/etc/traefik/acme
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"

      # entrypoints
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.websecure.address=:443"

      # ACME (production)
      - "--certificatesresolvers.letsencrypt.acme.email=${ACME_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/etc/traefik/acme/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"

    labels:
      - "traefik.enable=true"
      - "traefik.http.middlewares.security-headers.headers.browserXssFilter=true"
      - "traefik.http.middlewares.security-headers.headers.contentTypeNosniff=true"
      - "traefik.http.middlewares.security-headers.headers.forceSTSHeader=true"
      - "traefik.http.middlewares.security-headers.headers.stsIncludeSubdomains=true"
      - "traefik.http.middlewares.security-headers.headers.stsPreload=true"
      - "traefik.http.middlewares.security-headers.headers.stsSeconds=31536000"
      - "traefik.http.middlewares.security-headers.headers.customFrameOptionsValue=SAMEORIGIN"
      - "traefik.http.middlewares.security-headers.headers.contentSecurityPolicy=default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:;"
      - "traefik.http.middlewares.security-headers.headers.referrerPolicy=strict-origin-when-cross-origin"
      - "traefik.http.middlewares.security-headers.headers.permissionsPolicy=camera=(), microphone=(), geolocation=(), payment=()"

  watchtower:
    image: containrrr/watchtower:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 86400 --cleanup
    environment:
      - WATCHTOWER_NOTIFICATIONS=shoutrrr
      - WATCHTOWER_NOTIFICATION_URL=${NOTIFICATION_URL:-}

networks:
  default:
    name: app-network
    driver: bridge
EOF

print_success "Configuration updated successfully!"

print_status "Restarting services to apply changes..."
docker compose -f docker-compose.prod.yml up -d

print_status "Waiting for services to start..."
sleep 10

print_status "Testing API endpoints..."
echo ""
echo "Testing health endpoint:"
curl -s https://mirkotrotta.com/api/health | jq . || echo "Health endpoint test failed"

echo ""
echo "Testing GitHub API endpoint:"
curl -s https://mirkotrotta.com/api/github | jq . || echo "GitHub API test failed"

echo ""
print_success "API routing fix completed!"
print_status "Your GitHub projects should now load correctly on the website." 