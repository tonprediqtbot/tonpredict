#!/bin/sh
set -e

echo "🚀 Starting TonBet Production Boot Sequence..."

# 1. Sync Database Schema (Timeout after 30s)
echo "📡 Syncing Database Schema..."
(npx prisma db push --schema packages/database/prisma/schema.prisma --accept-data-loss & PID=$!; sleep 30; kill $PID 2>/dev/null || true) &

# 2. Seed Initial Data (Run in background)
echo "🌱 Seeding Initial Data..."
(npx prisma db seed --schema packages/database/prisma/schema.prisma &)

# 3. Start Web Service
echo "🌐 Launching Web Service on Port ${PORT:-8080}..."
cd apps/web && exec node_modules/.bin/next start -p ${PORT:-8080} -H 0.0.0.0
