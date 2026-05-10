# TonBet

The Premier Prediction Market Platform on the TON Blockchain.

## Architecture

TonBet is built as a turborepo monorepo with the following structure:

- `apps/bot`: Telegram Bot for onboarding and notifications
- `apps/web`: Next.js Telegram Mini App (The main user interface)
- `apps/admin`: Next.js Admin Dashboard
- `packages/database`: Prisma ORM and PostgreSQL schema
- `packages/contracts`: Tact Smart Contracts for TON Blockchain
- `packages/shared`: Shared utilities and types

## Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, Framer Motion, @tonconnect/ui-react
- **Backend/Bot**: Node.js, Telegraf, Redis
- **Database**: PostgreSQL, Prisma
- **Blockchain**: TON, Tact, @ton/core
- **Deployment**: Docker, Railway

## Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Infrastructure**
   ```bash
   docker-compose up -d
   ```

3. **Setup Database**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   npm run db:push
   npm run db:generate
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This will start:
   - Web App on port 3000
   - Admin App on port 3001
   - Telegram Bot

## TON Smart Contracts Deployment

1. Configure your TON wallet mnemonic in `.env`
2. Run tests:
   ```bash
   cd packages/contracts
   npm test
   ```
3. Deploy to Testnet:
   ```bash
   npm run deploy:testnet
   ```

## Telegram Bot Setup

1. Talk to @BotFather on Telegram
2. Create a new bot and get the token
3. Set the token in `.env`
4. Setup the Web App URL in BotFather to point to your deployed `apps/web` URL.
