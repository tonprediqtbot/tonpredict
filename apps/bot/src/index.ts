import { Telegraf, Markup } from 'telegraf';
import { prisma } from '@tonbet/database';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';
import * as http from 'http';

dotenv.config({ path: '../../.env' });

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});
let webAppUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// If Railway failed to interpolate the variable, inject it manually if it exists
if (webAppUrl.includes('${RAILWAY_PUBLIC_DOMAIN}')) {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    webAppUrl = webAppUrl.replace('${RAILWAY_PUBLIC_DOMAIN}', process.env.RAILWAY_PUBLIC_DOMAIN);
  } else {
    console.warn("Warning: RAILWAY_PUBLIC_DOMAIN is not set but was referenced in NEXT_PUBLIC_API_URL. Falling back to localhost.");
    webAppUrl = 'http://localhost:3000';
  }
}

// Debug logging for all incoming updates
bot.use(async (ctx, next) => {
  console.log("Incoming update:", JSON.stringify(ctx.update, null, 2));
  await next();
});

// Rate limiting middleware
bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  const key = `rate_limit:${ctx.from.id}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 1); // 1 second window
  }
  if (count > 3) {
    return ctx.reply('Please slow down. You are sending messages too fast.');
  }
  return next();
});

bot.start(async (ctx) => {
  console.log("START COMMAND RECEIVED");

  await ctx.reply(
    "Welcome to TonBet 🚀"
  );
});

bot.command('markets', (ctx) => {
  ctx.reply('Browse active markets:', Markup.inlineKeyboard([
    [Markup.button.webApp('Open Markets', `${webAppUrl}/markets`)]
  ]));
});

bot.command('refer', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = await prisma.user.findUnique({ where: { telegram_id: telegramId } });
  
  if (user) {
    const refLink = `https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}?start=${user.referral_code}`;
    ctx.reply(`Share this link to invite friends and earn a portion of their fees:\n\n${refLink}`);
  } else {
    ctx.reply('Please use /start first to register your account.');
  }
});

bot.action('help', (ctx) => {
  ctx.reply('TonBet Help:\n\n/start - Start the bot\n/markets - View active markets\n/refer - Get your referral link\n\nClick the "Launch TonBet" button to open the mini app and start betting!');
});

bot.action('portfolio', (ctx) => {
  ctx.reply('View your portfolio:', Markup.inlineKeyboard([
    [Markup.button.webApp('Open Portfolio', `${webAppUrl}/portfolio`)]
  ]));
});

console.log('[Config] RAW RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);
console.log('[Config] RAW WEBHOOK_DOMAIN:', process.env.WEBHOOK_DOMAIN);
console.log('[Config] RAW PORT:', process.env.PORT);

// Evaluate Railway's dynamic variable properly
let domain = process.env.RAILWAY_PUBLIC_DOMAIN 
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
  : process.env.WEBHOOK_DOMAIN;

console.log('[Startup] Domain evaluated before interpolation check:', domain);

if (domain && domain.includes('${RAILWAY_PUBLIC_DOMAIN}')) {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    domain = domain.replace('${RAILWAY_PUBLIC_DOMAIN}', process.env.RAILWAY_PUBLIC_DOMAIN);
    console.log('[Startup] Domain after interpolation replacement:', domain);
  } else {
    console.warn("[Startup] Warning: RAILWAY_PUBLIC_DOMAIN is not set but was referenced in WEBHOOK_DOMAIN. Falling back to Long Polling.");
  }
}

const express = require('express');
const app = express();

app.use(express.json());

// Log every request
app.use((req: any, res: any, next: any) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Explicit health check for Railway
app.get('/health', (_: any, res: any) => {
  res.status(200).send('OK');
});

// Webhook endpoint
app.post('/api/webhook', bot.webhookCallback('/api/webhook'));

// Root endpoint
app.get('/', (_: any, res: any) => {
  res.status(200).send('TonBet Bot Running');
});

// Catch-all
app.use((req: any, res: any) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`[Final] Bot Server is fully initialized and listening on port ${port}`);
});

// Remove manual timeouts for a moment to see if Express 5 defaults work better on Railway

