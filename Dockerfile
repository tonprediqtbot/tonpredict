FROM node:22-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

RUN npm install turbo --global

# Copy all source files
COPY . .

# Install all dependencies with full context
RUN npm install --legacy-peer-deps --ignore-scripts

# Generate prisma
WORKDIR /app/packages/database
RUN npx prisma generate

# Build all apps
WORKDIR /app
RUN npm run build

FROM base AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=builder /app .

# Expose port for Railway Edge Router
EXPOSE 8080
ENV PORT=8080

# Define start command based on SERVICE env var
CMD if [ "$SERVICE" = "bot" ]; then \
      cd apps/bot && exec node dist/index.js; \
    elif [ "$SERVICE" = "web" ]; then \
      cd apps/web && exec node_modules/.bin/next start; \
    elif [ "$SERVICE" = "admin" ]; then \
      cd apps/admin && exec node_modules/.bin/next start; \
    else \
      echo "Unknown service: $SERVICE"; exit 1; \
    fi

