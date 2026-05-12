#!/bin/sh
set -e

echo "🚀 Starting TonBet Production Boot Sequence..."

# 1. Sync Database Schema (Backgrounded)
echo "📡 Syncing Database Schema..."
npx prisma db push --schema packages/database/prisma/schema.prisma --accept-data-loss > /dev/null 2>&1 &

# 2. Seed Initial Data (Backgrounded)
echo "🌱 Seeding Initial Data..."
npx prisma db seed --schema packages/database/prisma/schema.prisma > /dev/null 2>&1 &

# 3. Start Web Service
echo "🌐 Launching Web Service on Port ${PORT:-8080}..."
cd apps/web && exec npm run start -- -p ${PORT:-8080} -H 0.0.0.0
