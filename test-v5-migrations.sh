#!/bin/bash

export PGHOST=127.0.0.1
export PGPORT=5433
export PGDATABASE=strapi
export PGUSER=strapi
export PGPASSWORD=strapi_test_password
export NODE_ENV=production

cd /home/nick/bundeling/therapy-strapi

echo "=== Starting Strapi v5 with production backup data ==="
echo "Database: $PGHOST:$PGPORT/$PGDATABASE"
echo ""

pnpm dev 2>&1 | tee /tmp/strapi-migration-test.log &
STRAPI_PID=$!

# Wait for startup and check logs
sleep 15

if ps -p $STRAPI_PID > /dev/null; then
  echo ""
  echo "✓ Strapi started successfully"
  echo ""
  echo "=== Migration Log (last 50 lines) ==="
  tail -50 /tmp/strapi-migration-test.log
  echo ""
  echo "Killing Strapi..."
  kill $STRAPI_PID 2>/dev/null
  wait $STRAPI_PID 2>/dev/null
else
  echo ""
  echo "✗ Strapi failed to start"
  echo ""
  echo "=== Error Log ==="
  cat /tmp/strapi-migration-test.log
  exit 1
fi

echo ""
echo "=== Test Complete ==="
