#!/bin/bash
# Production Docker Compose Management Script
# Usage: ./prod-manage.sh [command]
# Examples:
#   ./prod-manage.sh ps        # Show container status
#   ./prod-manage.sh logs      # Show logs
#   ./prod-manage.sh restart   # Restart all services
#   ./prod-manage.sh down      # Stop all services
#   ./prod-manage.sh up        # Start all services

set -e

COMPOSE_FILE="compose.production.yaml"
ENV_FILE=".env.production"

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found!"
    echo "Make sure you're in the correct directory (/opt/mirkotrotta)"
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Error: $COMPOSE_FILE not found!"
    exit 1
fi

# Default to 'ps' if no command given
COMMAND=${1:-ps}

case $COMMAND in
    "ps"|"status")
        echo "🔍 Checking container status..."
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE ps
        ;;
    "logs")
        echo "📋 Showing logs..."
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE logs --tail 50 "${@:2}"
        ;;
    "up"|"start")
        echo "🚀 Starting services..."
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d
        ;;
    "down"|"stop")
        echo "⏹️  Stopping services..."
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE down
        ;;
    "restart")
        echo "🔄 Restarting services..."
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE down
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d
        ;;
    "health")
        echo "🏥 Checking service health..."
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE exec api curl -f http://localhost:8000/health
        echo ""
        echo "✅ API health check passed!"
        ;;
    "config")
        echo "⚙️  Showing resolved configuration..."
        docker compose -f $COMPOSE_FILE --env-file $ENV_FILE config
        ;;
    *)
        echo "🐳 Production Docker Compose Manager"
        echo ""
        echo "Available commands:"
        echo "  ps, status    - Show container status"
        echo "  logs          - Show container logs"
        echo "  up, start     - Start all services"
        echo "  down, stop    - Stop all services"
        echo "  restart       - Restart all services"
        echo "  health        - Test API health"
        echo "  config        - Show resolved config"
        echo ""
        echo "Usage: $0 [command]"
        ;;
esac 