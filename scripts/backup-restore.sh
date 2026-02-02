#!/bin/bash

# Backup and Restore Script for Strapi Database Testing
# This script helps you safely test schema changes with production data

set -e  # Exit on error

echo "=== Strapi Database Backup & Restore Tool ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to backup production database
backup_production() {
    echo -e "${YELLOW}Step 1: Backing up production database${NC}"
    echo ""
    echo "Enter your PRODUCTION database credentials:"
    read -p "Host: " PROD_HOST
    read -p "Port [5432]: " PROD_PORT
    PROD_PORT=${PROD_PORT:-5432}
    read -p "Database name: " PROD_DB
    read -p "Username: " PROD_USER
    read -sp "Password: " PROD_PASSWORD
    echo ""

    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"

    echo ""
    echo -e "${YELLOW}Creating backup...${NC}"
    PGPASSWORD="$PROD_PASSWORD" pg_dump -h "$PROD_HOST" -p "$PROD_PORT" -U "$PROD_USER" -d "$PROD_DB" -F c -f "$BACKUP_FILE"

    if [ -f "$BACKUP_FILE" ]; then
        echo -e "${GREEN}✓ Backup created successfully: $BACKUP_FILE${NC}"
        echo "$BACKUP_FILE"
    else
        echo -e "${RED}✗ Backup failed${NC}"
        exit 1
    fi
}

# Function to restore to local database
restore_local() {
    BACKUP_FILE=$1

    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}✗ Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi

    echo ""
    echo -e "${YELLOW}Step 2: Preparing local database${NC}"
    echo ""
    echo "Enter your LOCAL database credentials:"
    read -p "Host [127.0.0.1]: " LOCAL_HOST
    LOCAL_HOST=${LOCAL_HOST:-127.0.0.1}
    read -p "Port [5432]: " LOCAL_PORT
    LOCAL_PORT=${LOCAL_PORT:-5432}
    read -p "Database name [strapi_test]: " LOCAL_DB
    LOCAL_DB=${LOCAL_DB:-strapi_test}
    read -p "Username [strapi]: " LOCAL_USER
    LOCAL_USER=${LOCAL_USER:-strapi}
    read -sp "Password: " LOCAL_PASSWORD
    echo ""

    echo ""
    echo -e "${YELLOW}Dropping existing local database if exists...${NC}"
    PGPASSWORD="$LOCAL_PASSWORD" dropdb -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB" --if-exists

    echo -e "${YELLOW}Creating fresh local database...${NC}"
    PGPASSWORD="$LOCAL_PASSWORD" createdb -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB"

    echo -e "${YELLOW}Restoring backup to local database...${NC}"
    PGPASSWORD="$LOCAL_PASSWORD" pg_restore -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d "$LOCAL_DB" -v "$BACKUP_FILE"

    echo ""
    echo -e "${GREEN}✓ Database restored successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Update your .env file with these credentials:${NC}"
    echo "PGHOST=$LOCAL_HOST"
    echo "PGPORT=$LOCAL_PORT"
    echo "PGDATABASE=$LOCAL_DB"
    echo "PGUSER=$LOCAL_USER"
    echo "PGPASSWORD=$LOCAL_PASSWORD"
}

# Main menu
echo "What would you like to do?"
echo "1) Backup production and restore to local"
echo "2) Restore existing backup to local"
echo "3) Backup production only"
echo ""
read -p "Choice [1]: " CHOICE
CHOICE=${CHOICE:-1}

case $CHOICE in
    1)
        BACKUP_FILE=$(backup_production)
        restore_local "$BACKUP_FILE"
        ;;
    2)
        read -p "Enter backup file path: " BACKUP_FILE
        restore_local "$BACKUP_FILE"
        ;;
    3)
        backup_production
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}=== Done! ===${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your .env file with the local database credentials shown above"
echo "2. Stop your current Strapi server"
echo "3. Run: npm run dev"
echo "4. Test your changes thoroughly"
echo "5. If everything works, you can safely deploy to production"
