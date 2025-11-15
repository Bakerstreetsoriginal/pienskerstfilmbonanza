#!/bin/bash

# Database backup script
# Usage: ./scripts/backup-db.sh

set -e

# Load environment variables
source .env

# Create backup directory
BACKUP_DIR="backups"
mkdir -p $BACKUP_DIR

# Generate filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/kerstfilms_${TIMESTAMP}.sql"

echo "🎄 Creating database backup..."

# Create backup
docker compose -f docker-compose.prod.yml exec -T db pg_dump \
    -U $POSTGRES_USER \
    $POSTGRES_DB > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
ls -t $BACKUP_DIR/*.sql.gz | tail -n +8 | xargs -r rm

echo "✅ Cleaned up old backups (keeping last 7)"

