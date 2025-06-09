# Makefile for managing Dockerized development and production workflows

# Default TAG for images if not specified
TAG ?= latest
# Default DOCKER_REGISTRY if not specified (e.g., for ghcr.io/username/project)
# DOCKER_REGISTRY ?= your-registry/your-project

# Get current directory name to use as a project prefix for compose project name
# This helps avoid conflicts if multiple projects use docker-compose on the same machine.
COMPOSE_PROJECT_NAME ?= $(shell basename "$(CURDIR)")

# Ensure .env.docker file exists for local development by copying from .env.docker.example if .env.docker is missing
.PHONY: ensure-docker-env
ensure-docker-env:
	@if [ ! -f .env.docker ]; then \
		echo "Creating .env.docker from .env.docker.example..."; \
		cp .env.docker.example .env.docker; \
	else \
		echo ".env.docker file already exists."; \
	fi

# ====================================================================
# Development Commands (uses compose.yaml, compose.override.yaml which loads .env.docker)
# ====================================================================
.PHONY: dev dev-up
dev dev-up: ensure-docker-env ## Start all development services in detached mode (api, frontend, db)
	@echo "Starting development environment (using .env.docker)..."
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml up --build -d

.PHONY: dev-down
dev-down: ## Stop and remove all development services and network
	@echo "Stopping development environment..."
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml down -v --remove-orphans

.PHONY: dev-logs
dev-logs: ## Tail logs from all development services
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml logs -f

.PHONY: dev-logs-api
dev-logs-api: ## Tail logs from the API service (development)
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml logs -f api

.PHONY: dev-logs-frontend
dev-logs-frontend: ## Tail logs from the Frontend service (development)
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml logs -f frontend

.PHONY: dev-shell-api
dev-shell-api: ## Open a shell into the running API container (development)
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml exec api sh

.PHONY: dev-shell-frontend
dev-shell-frontend: ## Open a shell into the running Frontend container (development)
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml exec frontend sh

.PHONY: dev-restart
dev-restart: dev-down dev-up ## Restart all development services

# ====================================================================
# Production Build Commands (builds images based on Dockerfiles)
# ====================================================================
.PHONY: build build-prod
build build-prod: ## Build production images for api and frontend
	@echo "Building production images..."
	# These builds will use ARGs defined in Dockerfiles if any, 
	# and ENV vars from the Dockerfiles themselves. 
	# For production runtime ENV vars, those are set on the server.
	@docker compose -p $(COMPOSE_PROJECT_NAME)_prod -f compose.yaml -f compose.production.yaml build --no-cache api frontend
	# Example for tagging and pushing (manual or CI):
	# @echo "To tag and push (example):"
	# @echo "  docker tag my-site-api $(DOCKER_REGISTRY)/my-site-api:$(TAG)"
	# @echo "  docker tag my-site-frontend $(DOCKER_REGISTRY)/my-site-frontend:$(TAG)"
	# @echo "  docker push $(DOCKER_REGISTRY)/my-site-api:$(TAG)"
	# @echo "  docker push $(DOCKER_REGISTRY)/my-site-frontend:$(TAG)"

# =============================================================================
# Production Deployment Commands (uses compose.production.yaml with pre-built images)
# Assumes images are already built and available, and production ENV VARS are set on the HOST.
# =============================================================================
.PHONY: prod-up
prod-up: ## Start production services (Traefik, api, frontend, db, watchtower)
	@echo "Starting production environment..."
	@echo "Ensure PRODUCTION environment variables are set on the host! (Refer to .env.docker.example)"
	@docker compose -p $(COMPOSE_PROJECT_NAME)_prod -f compose.production.yaml up -d

.PHONY: prod-down
prod-down: ## Stop and remove production services
	@echo "Stopping production environment..."
	@docker compose -p $(COMPOSE_PROJECT_NAME)_prod -f compose.production.yaml down -v --remove-orphans

.PHONY: prod-logs
prod-logs: ## Tail logs from all production services
	@docker compose -p $(COMPOSE_PROJECT_NAME)_prod -f compose.production.yaml logs -f

.PHONY: prod-pull
prod-pull: ## Pull latest images for production services (if using pre-built from registry)
	@echo "Pulling latest production images (ensure DOCKER_REGISTRY and TAG are correct or set in compose file)..."
	@docker compose -p $(COMPOSE_PROJECT_NAME)_prod -f compose.production.yaml pull

# =============================================================================
# Staging Deployment Commands (uses compose.staging.yaml with pre-built images)
# Assumes images are already built and available, and staging ENV VARS are set on the HOST.
# =============================================================================
.PHONY: staging-up
staging-up: ## Start staging services
	@echo "Starting staging environment..."
	@echo "Ensure STAGING environment variables are set on the host! (Refer to .env.docker.example)"
	@docker compose -p $(COMPOSE_PROJECT_NAME)_staging -f compose.staging.yaml up -d

.PHONY: staging-down
staging-down: ## Stop and remove staging services
	@echo "Stopping staging environment..."
	@docker compose -p $(COMPOSE_PROJECT_NAME)_staging -f compose.staging.yaml down -v --remove-orphans

.PHONY: staging-logs
staging-logs: ## Tail logs from all staging services
	@docker compose -p $(COMPOSE_PROJECT_NAME)_staging -f compose.staging.yaml logs -f

# ====================================================================
# Utility Commands
# ====================================================================
.PHONY: clean-docker
clean-docker: ## Remove all stopped containers, unused networks, dangling images, and build cache
	@echo "Cleaning up Docker system..."
	@docker system prune -af --volumes

.PHONY: list list-services
list list-services: ## List running docker-compose services for dev, prod, and staging projects
	@echo "--- Development Services ($(COMPOSE_PROJECT_NAME)_dev) ---"
	@docker compose -p $(COMPOSE_PROJECT_NAME)_dev -f compose.yaml -f compose.override.yaml ps || true
	@echo "\n--- Production Services ($(COMPOSE_PROJECT_NAME)_prod) ---"
	@docker compose -p $(COMPOSE_PROJECT_NAME)_prod -f compose.production.yaml ps || true
	@echo "\n--- Staging Services ($(COMPOSE_PROJECT_NAME)_staging) ---"
	@docker compose -p $(COMPOSE_PROJECT_NAME)_staging -f compose.staging.yaml ps || true

.PHONY: help
help:
	@echo "Makefile for Dockerized Project Management"
	@echo "-------------------------------------------"
	@echo "Usage: make [target]"
	@echo ""
	@echo "Development Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}' | grep -i 'development'
	@echo ""
	@echo "Production Build Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}' | grep -i 'production build'
	@echo ""
	@echo "Production Deployment Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}' | grep -i 'production services'
	@echo ""
	@echo "Staging Deployment Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}' | grep -i 'staging services'
	@echo ""
	@echo "Utility Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}' | grep -i 'utility'

# Default target
.DEFAULT_GOAL := help 