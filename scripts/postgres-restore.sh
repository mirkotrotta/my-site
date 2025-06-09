#!/bin/bash

# PostgreSQL Restore Script for mirkotrotta.com
# Created for Task 11.9 - Hetzner Cloud Deployment
# Restores from backups created by postgres-backup.sh

set -euo pipefail

# Configuration
BACKUP_DIR="/var/backups/postgres"
LOG_FILE="/var/log/postgres-restore.log"

# Docker container name (adjust if different)
POSTGRES_CONTAINER="mirkotrotta-db-1"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check if container is running
check_container() {
    if ! docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
        log_message "ERROR: PostgreSQL container '$POSTGRES_CONTAINER' is not running"
        exit 1
    fi
}

# Function to list available backups
list_backups() {
    echo "Available backups:"
    local backups=($(find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -type f | sort -r))
    
    if [[ ${#backups[@]} -eq 0 ]]; then
        echo "No backups found in $BACKUP_DIR"
        exit 1
    fi
    
    for i in "${!backups[@]}"; do
        local file="${backups[$i]}"
        local date_created=$(stat -c %y "$file" | cut -d' ' -f1,2 | cut -d'.' -f1)
        local size=$(du -h "$file" | cut -f1)
        echo "  $((i+1)). $(basename "$file") - Created: $date_created - Size: $size"
    done
    
    echo "${backups[@]}"
}

# Function to select backup file
select_backup() {
    local backup_file="$1"
    
    if [[ -z "$backup_file" ]]; then
        echo "Please specify a backup file to restore from."
        echo ""
        readarray -t available_backups < <(find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -type f | sort -r)
        
        if [[ ${#available_backups[@]} -eq 0 ]]; then
            log_message "ERROR: No backup files found in $BACKUP_DIR"
            exit 1
        fi
        
        echo "Available backups:"
        for i in "${!available_backups[@]}"; do
            local file="${available_backups[$i]}"
            local date_created=$(stat -c %y "$file" | cut -d' ' -f1,2 | cut -d'.' -f1)
            local size=$(du -h "$file" | cut -f1)
            echo "  $((i+1)). $(basename "$file") - $date_created ($size)"
        done
        
        echo ""
        read -p "Select backup number (1-${#available_backups[@]}): " selection
        
        if [[ "$selection" =~ ^[0-9]+$ ]] && [[ "$selection" -ge 1 ]] && [[ "$selection" -le "${#available_backups[@]}" ]]; then
            backup_file="${available_backups[$((selection-1))]}"
        else
            log_message "ERROR: Invalid selection"
            exit 1
        fi
    else
        # If filename provided, check if it exists
        if [[ ! -f "$BACKUP_DIR/$backup_file" ]] && [[ ! -f "$backup_file" ]]; then
            log_message "ERROR: Backup file not found: $backup_file"
            exit 1
        fi
        
        # Use full path if not already provided
        if [[ "$backup_file" != /* ]]; then
            backup_file="$BACKUP_DIR/$backup_file"
        fi
    fi
    
    echo "$backup_file"
}

# Function to confirm restore operation
confirm_restore() {
    local backup_file="$1"
    
    echo ""
    echo "⚠️  WARNING: This will COMPLETELY REPLACE the current database!"
    echo "Backup file: $(basename "$backup_file")"
    echo "Database container: $POSTGRES_CONTAINER"
    echo ""
    
    read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation
    
    if [[ "$confirmation" != "yes" ]]; then
        log_message "Restore operation cancelled by user"
        exit 0
    fi
}

# Function to perform restore
perform_restore() {
    local backup_file="$1"
    
    log_message "Starting PostgreSQL restore from $(basename "$backup_file")..."
    
    # Get database credentials from container environment
    local db_name=$(docker exec "$POSTGRES_CONTAINER" printenv POSTGRES_DB)
    local db_user=$(docker exec "$POSTGRES_CONTAINER" printenv POSTGRES_USER)
    
    # Verify backup file integrity
    if ! gzip -t "$backup_file" 2>/dev/null; then
        log_message "ERROR: Backup file integrity check failed"
        exit 1
    fi
    
    # Create a temporary SQL file
    local temp_sql="/tmp/restore_$(date +%s).sql"
    
    # Decompress backup file
    log_message "Decompressing backup file..."
    if ! gunzip -c "$backup_file" > "$temp_sql"; then
        log_message "ERROR: Failed to decompress backup file"
        exit 1
    fi
    
    # Drop existing connections to the database
    log_message "Terminating existing database connections..."
    docker exec "$POSTGRES_CONTAINER" psql -U "$db_user" -d postgres -c "
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE datname = '$db_name' AND pid <> pg_backend_pid();"
    
    # Drop and recreate database
    log_message "Dropping and recreating database '$db_name'..."
    docker exec "$POSTGRES_CONTAINER" psql -U "$db_user" -d postgres -c "DROP DATABASE IF EXISTS $db_name;"
    docker exec "$POSTGRES_CONTAINER" psql -U "$db_user" -d postgres -c "CREATE DATABASE $db_name;"
    
    # Restore from backup
    log_message "Restoring database from backup..."
    if docker exec -i "$POSTGRES_CONTAINER" psql -U "$db_user" -d "$db_name" < "$temp_sql"; then
        log_message "SUCCESS: Database restored successfully"
        
        # Clean up temporary file
        rm -f "$temp_sql"
        
        # Verify restore
        verify_restore "$db_name" "$db_user"
    else
        log_message "ERROR: Database restore failed"
        rm -f "$temp_sql"
        exit 1
    fi
}

# Function to verify restore
verify_restore() {
    local db_name="$1"
    local db_user="$2"
    
    log_message "Verifying restored database..."
    
    # Check if database exists and has tables
    local table_count=$(docker exec "$POSTGRES_CONTAINER" psql -U "$db_user" -d "$db_name" -t -c "
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public';" | tr -d ' \n')
    
    if [[ "$table_count" -gt 0 ]]; then
        log_message "Verification successful: Database contains $table_count table(s)"
    else
        log_message "WARNING: Database appears to be empty or verification failed"
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [backup_filename]"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Interactive mode - select from available backups"
    echo "  $0 postgres_backup_20241208_140000.sql.gz  # Restore specific backup file"
    echo ""
    echo "Options:"
    echo "  -l, --list    List available backup files"
    echo "  -h, --help    Show this help message"
}

# Main execution
main() {
    case "${1:-}" in
        -l|--list)
            list_backups >/dev/null  # Redirect the array output, keep the formatted list
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            log_message "=== PostgreSQL Restore Process Started ==="
            
            # Check if container is running
            check_container
            
            # Select backup file
            backup_file=$(select_backup "${1:-}")
            
            # Confirm restore operation
            confirm_restore "$backup_file"
            
            # Perform the restore
            perform_restore "$backup_file"
            
            log_message "=== Restore Process Completed Successfully ==="
            ;;
    esac
}

# Run main function
main "$@" 