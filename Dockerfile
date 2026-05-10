FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install turbo
RUN npm install turbo --global

COPY package.json turbo.json ./
COPY apps/bot/package.json ./apps/bot/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/admin/package.json ./apps/admin/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json

RUN npm install --legacy-peer-deps --ignore-scripts

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate prisma
WORKDIR /app/packages/database
RUN npx prisma generate

WORKDIR /app
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app .

# Define start command based on SERVICE env var
CMD if [ "$SERVICE" = "bot" ]; then \
      cd apps/bot && npm start; \
    elif [ "$SERVICE" = "web" ]; then \
      cd apps/web && npm start; \
    elif [ "$SERVICE" = "admin" ]; then \
      cd apps/admin && npm start; \
    else \
      echo "Unknown service: $SERVICE"; exit 1; \
    fi
