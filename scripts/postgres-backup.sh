#!/bin/bash

# PostgreSQL Backup Script for mirkotrotta.com
# Created for Task 11.9 - Hetzner Cloud Deployment
# Performs daily backups with 7-day retention

set -euo pipefail

# Configuration
BACKUP_DIR="/var/backups/postgres"
RETENTION_DAYS=7
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="/var/log/postgres-backup.log"

# Docker container name (adjust if different)
POSTGRES_CONTAINER="mirkotrotta-db-1"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

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

# Function to perform backup
perform_backup() {
    local backup_file="$BACKUP_DIR/postgres_backup_$TIMESTAMP.sql"
    local compressed_file="$backup_file.gz"
    
    log_message "Starting PostgreSQL backup..."
    
    # Get database credentials from container environment
    local db_name=$(docker exec "$POSTGRES_CONTAINER" printenv POSTGRES_DB)
    local db_user=$(docker exec "$POSTGRES_CONTAINER" printenv POSTGRES_USER)
    
    # Perform backup using pg_dump
    if docker exec "$POSTGRES_CONTAINER" pg_dump -U "$db_user" -d "$db_name" > "$backup_file"; then
        # Compress the backup
        gzip "$backup_file"
        
        # Verify compressed file exists and has content
        if [[ -s "$compressed_file" ]]; then
            local file_size=$(du -h "$compressed_file" | cut -f1)
            log_message "SUCCESS: Backup completed - $compressed_file ($file_size)"
            return 0
        else
            log_message "ERROR: Backup file is empty or missing"
            return 1
        fi
    else
        log_message "ERROR: pg_dump command failed"
        return 1
    fi
}

# Function to clean up old backups
cleanup_old_backups() {
    log_message "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local deleted_count=0
    
    # Find and delete files older than retention period
    while IFS= read -r -d '' file; do
        rm "$file"
        log_message "Deleted old backup: $(basename "$file")"
        ((deleted_count++))
    done < <(find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -print0)
    
    if [[ $deleted_count -eq 0 ]]; then
        log_message "No old backups to clean up"
    else
        log_message "Cleaned up $deleted_count old backup(s)"
    fi
}

# Function to verify backup integrity
verify_backup() {
    local latest_backup=$(find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [[ -n "$latest_backup" ]]; then
        # Test if the compressed file can be read
        if gzip -t "$latest_backup" 2>/dev/null; then
            log_message "Backup integrity verified: $(basename "$latest_backup")"
        else
            log_message "WARNING: Backup integrity check failed for $(basename "$latest_backup")"
        fi
    fi
}

# Function to display backup summary
backup_summary() {
    local backup_count=$(find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -type f | wc -l)
    local total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "0")
    
    log_message "Backup Summary:"
    log_message "  - Total backups: $backup_count"
    log_message "  - Storage used: $total_size"
    log_message "  - Backup location: $BACKUP_DIR"
}

# Main execution
main() {
    log_message "=== PostgreSQL Backup Process Started ==="
    
    # Check if container is running
    check_container
    
    # Perform the backup
    if perform_backup; then
        # Clean up old backups
        cleanup_old_backups
        
        # Verify backup integrity
        verify_backup
        
        # Show summary
        backup_summary
        
        log_message "=== Backup Process Completed Successfully ==="
    else
        log_message "=== Backup Process Failed ==="
        exit 1
    fi
}

# Run main function
main "$@" 