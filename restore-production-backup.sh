#!/bin/bash

# Script to restore production backup to local test database
set -e

echo "=== Strapi Production Backup Restore ==="
echo ""
echo "This will:"
echo "1. Create a new test database called 'strapi_test'"
echo "2. Restore the production backup to it"
echo "3. Update your .env to use the test database"
echo ""

# Default local database credentials
LOCAL_HOST="127.0.0.1"
LOCAL_PORT="5432"
LOCAL_DB="strapi_test"
LOCAL_USER="strapi"

read -sp "Enter your LOCAL PostgreSQL password for user '$LOCAL_USER': " LOCAL_PASSWORD
echo ""

echo ""
echo "Step 1: Dropping existing test database if it exists..."
PGPASSWORD="$LOCAL_PASSWORD" dropdb -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB" --if-exists 2>/dev/null || true

echo "Step 2: Creating fresh test database..."
PGPASSWORD="$LOCAL_PASSWORD" createdb -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB"


echo "Step 3: Restoring production backup (this may take a minute)..."
read -rp "Enter the path to your backup directory (default: ./db-backups): " BACKUP_DIR
BACKUP_DIR=${BACKUP_DIR:-./db-backups}
cd "$BACKUP_DIR"
PGPASSWORD="$LOCAL_PASSWORD" pg_restore -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d "$LOCAL_DB" --no-owner --no-privileges -v . 2>&1 | grep -v "^pg_restore: " || true

echo ""
echo "✓ Backup restored successfully!"
echo ""
echo "=== IMPORTANT: Update your .env file ==="
echo ""
echo "Change these values in your .env file:"
echo ""
echo "PGHOST=$LOCAL_HOST"
echo "PGPORT=$LOCAL_PORT"
echo "PGDATABASE=$LOCAL_DB"
echo "PGUSER=$LOCAL_USER"
echo "PGPASSWORD=$LOCAL_PASSWORD"
echo ""
echo "After updating .env, restart your Strapi server with: npm run dev"
echo ""
echo "=== Testing checklist ==="
echo "1. Start Strapi with the test database"
echo "2. Check if all content types load"
echo "3. Check if the modalVideo field works (now as text field)"
echo "4. Test creating/editing content"
echo ""
echo "If everything works, you can safely deploy these changes to production!"
