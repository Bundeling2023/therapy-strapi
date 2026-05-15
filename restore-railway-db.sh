#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
One-off restore from local backup tarball into a target Postgres DB.

Usage:
  ./restore-railway-db.sh --target-url <postgres-url> --build-date <YYYY-MM-DD> [--yes]

Example:
  ./restore-railway-db.sh \
    --target-url "postgres://postgres@yamanote.proxy.rlwy.net:49970/railway" \
    --build-date "2026-05-12"

Behavior:
- Finds backup file in ./db-backups matching backup-<build-date>T*.tar.gz
- Prompts for target DB password if not present in the URL
- Restores full backup into target DB (clean + if-exists)
- Preserves migration history from backup
USAGE
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Error: required command not found: $1" >&2
    exit 1
  }
}

has_password_in_url() {
  local url="$1"
  [[ "$url" =~ ^postgres(ql)?://[^/@:]+:[^@]*@ ]]
}

sanitize_url() {
  local url="$1"
  echo "$url" | sed -E 's#^(postgres(ql)?://)[^@]+@#\1***@#'
}

TARGET_URL=""
BUILD_DATE=""
ASSUME_YES=0
TARGET_PASSWORD=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target-url)
      TARGET_URL="${2:-}"
      shift 2
      ;;
    --build-date)
      BUILD_DATE="${2:-}"
      shift 2
      ;;
    --yes)
      ASSUME_YES=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$TARGET_URL" || -z "$BUILD_DATE" ]]; then
  echo "Error: --target-url and --build-date are required." >&2
  usage
  exit 1
fi

if [[ ! "$BUILD_DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "Error: --build-date must use YYYY-MM-DD format." >&2
  exit 1
fi

require_cmd pg_restore
require_cmd psql
require_cmd tar

BACKUP_MATCHES=$(ls -1 "./db-backups/backup-${BUILD_DATE}T"*.tar.gz 2>/dev/null || true)
if [[ -z "$BACKUP_MATCHES" ]]; then
  echo "Error: no backup file found for date $BUILD_DATE in ./db-backups." >&2
  exit 1
fi

BACKUP_FILE=$(echo "$BACKUP_MATCHES" | sort | tail -n 1)

echo "Backup: $BACKUP_FILE"
echo "Target: $(sanitize_url "$TARGET_URL")"
echo ""
echo "Warning: this will overwrite the target database."

if [[ "$ASSUME_YES" -ne 1 ]]; then
  read -r -p "Type 'restore' to continue: " CONFIRM
  if [[ "$CONFIRM" != "restore" ]]; then
    echo "Aborted."
    exit 1
  fi
fi

if ! has_password_in_url "$TARGET_URL"; then
  read -r -s -p "Enter TARGET database password: " TARGET_PASSWORD
  echo ""
fi

run_db_cmd() {
  if [[ -n "$TARGET_PASSWORD" ]]; then
    PGPASSWORD="$TARGET_PASSWORD" "$@"
  else
    "$@"
  fi
}

TMP_DIR=$(mktemp -d)
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

EXTRACT_DIR="$TMP_DIR/extracted"
mkdir -p "$EXTRACT_DIR"
tar -xzf "$BACKUP_FILE" -C "$EXTRACT_DIR"

if [[ -f "$EXTRACT_DIR/toc.dat" ]]; then
  RESTORE_SOURCE="$EXTRACT_DIR"
else
  TOP_DIR=$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)
  if [[ -n "$TOP_DIR" && -f "$TOP_DIR/toc.dat" ]]; then
    RESTORE_SOURCE="$TOP_DIR"
  else
    echo "Error: could not find pg_dump directory data (toc.dat) in tarball." >&2
    exit 1
  fi
fi

echo ""
echo "Restoring into target..."
run_db_cmd pg_restore \
  --exit-on-error \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname "$TARGET_URL" \
  "$RESTORE_SOURCE"

echo ""
echo "Restore complete."
