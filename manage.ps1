<#
.SYNOPSIS
A PowerShell script to manage the Dockerized development environment for the my-site project.
This script is the PowerShell equivalent of the provided Makefile for Windows users.

.DESCRIPTION
Provides commands to start, stop, restart, and view logs for the development services
(api, frontend, db) defined in the Docker Compose files.

It automatically handles the creation of the .env.docker file from the .env.docker.example
template on the first run.

.PARAMETER Command
The action to perform. Valid options are:
- start: Builds and starts all development services in detached mode. (Default)
- stop: Stops and removes all development services, volumes, and networks.
- restart: Stops and then starts the development services.
- logs: Tails the logs from all running services.
- logs-api: Tails the logs specifically from the 'api' service.
- logs-frontend: Tails the logs specifically from the 'frontend' service.
- help: Displays this help message.

.EXAMPLE
# Start the development environment
.manage.ps1 -Command start

.EXAMPLE
# Stop the development environment
.manage.ps1 -Command stop

.EXAMPLE
# View logs for the API service
.manage.ps1 -Command logs-api

.EXAMPLE
# Show available commands
.manage.ps1 -Command help
#>
param (
    [ValidateSet("start", "stop", "restart", "logs", "logs-api", "logs-frontend", "help")]
    [string]$Command = "start"
)

# --- Configuration ---
# Get the current directory name to use as a project prefix for compose project name.
# This helps avoid conflicts if multiple projects use docker-compose on the same machine.
$ProjectName = (Get-Item -Path ".").Name
$ComposeProjectName = "${ProjectName}_dev"

# Define the set of Docker Compose files for the development environment as an array.
$ComposeFiles = @("-f", "compose.yaml", "-f", "compose.override.yaml")


# --- Helper Functions ---

# Ensures that the .env.docker file exists for local development.
# If it's missing, it copies it from the .env.docker.example template.
function Ensure-DockerEnv {
    if (-not (Test-Path ".env.docker")) {
        if (Test-Path ".env.docker.example") {
            Write-Host "Creating .env.docker from .env.docker.example..." -ForegroundColor Yellow
            Copy-Item ".env.docker.example" ".env.docker"
        } else {
            Write-Host "ERROR: .env.docker.example not found. Please create it before running." -ForegroundColor Red
            exit 1
        }
    }
}


# --- Main Command Functions ---

# Starts all development services in detached mode.
function Start-Dev {
    Write-Host "Starting development environment (using .env.docker)..." -ForegroundColor Green
    Ensure-DockerEnv
    docker compose -p $ComposeProjectName $ComposeFiles up --build -d
}

# Stops and removes all development services and their related resources.
function Stop-Dev {
    Write-Host "Stopping development environment..." -ForegroundColor Yellow
    docker compose -p $ComposeProjectName $ComposeFiles down -v --remove-orphans
}

# Tails logs from all or specific development services.
function Show-Logs {
    param (
        [string]$Service
    )

    if ($Service) {
        Write-Host "Tailing logs for service: $Service..." -ForegroundColor Cyan
        docker compose -p $ComposeProjectName $ComposeFiles logs -f $Service
    } else {
        Write-Host "Tailing logs for all services..." -ForegroundColor Cyan
        docker compose -p $ComposeProjectName $ComposeFiles logs -f
    }
}

# Displays a user-friendly help message with all available commands.
function Show-Help {
    Write-Host "PowerShell Script for Dockerized Project Management"
    Write-Host "--------------------------------------------------"
    Write-Host "Usage: .manage.ps1 -Command [command]" -ForegroundColor White
    Write-Host ""
    Write-Host "Available Commands:"
    Write-Host "  start           - Builds and starts all development services. (Default)" -ForegroundColor Green
    Write-Host "  stop            - Stops and removes all development services and networks." -ForegroundColor Yellow
    Write-Host "  restart         - Restarts all development services." -ForegroundColor Cyan
    Write-Host "  logs            - Tails logs from all development services." -ForegroundColor Cyan
    Write-Host "  logs-api        - Tails logs from the API service." -ForegroundColor Cyan
    Write-Host "  logs-frontend   - Tails logs from the Frontend service." -ForegroundColor Cyan
    Write-Host "  help            - Displays this help message." -ForegroundColor White
}


# --- Command Execution ---
# Runs the function corresponding to the provided command.
switch ($Command) {
    "start" { Start-Dev }
    "stop" { Stop-Dev }
    "restart" {
        Stop-Dev
        Start-Dev
    }
    "logs" { Show-Logs }
    "logs-api" { Show-Logs -Service "api" }
    "logs-frontend" { Show-Logs -Service "frontend" }
    "help" { Show-Help }
    default { Show-Help }
} 