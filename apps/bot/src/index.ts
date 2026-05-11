import { Telegraf, Markup } from 'telegraf';
import { prisma } from '@tonbet/database';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';

console.log('[Entry] Process starting...');

dotenv.config({ path: '../../.env' });

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('[Fatal] BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf(token);

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Restore Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

let webAppUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (webAppUrl.includes('${RAILWAY_PUBLIC_DOMAIN}')) {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    webAppUrl = webAppUrl.replace('${RAILWAY_PUBLIC_DOMAIN}', process.env.RAILWAY_PUBLIC_DOMAIN);
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
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 1);
    if (count > 5) return ctx.reply('Please slow down.');
  } catch (e) {}
  return next();
});

bot.start(async (ctx) => {
  console.log("START COMMAND RECEIVED");
  await ctx.reply("Welcome to TonBet 🚀");
});

bot.command('markets', (ctx) => {
  ctx.reply('Browse active markets:', Markup.inlineKeyboard([
    [Markup.button.webApp('Open Markets', `${webAppUrl}/markets`)]
  ]));
});

bot.command('refer', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  try {
    const user = await prisma.user.findUnique({ where: { telegram_id: telegramId } });
    if (user) {
      const refLink = `https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}?start=${user.referral_code}`;
      ctx.reply(`Your referral link:\n${refLink}`);
    } else {
      ctx.reply('Please use /start first.');
    }
  } catch (e) {
    ctx.reply('Error fetching referral link.');
  }
});

async function startServer() {
  const express = require('express');
  const app = express();
  app.use(express.json());

  app.use((req: any, res: any, next: any) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });

  app.get('/health', (_: any, res: any) => res.status(200).send('OK'));
  app.post('/webhook', bot.webhookCallback('/webhook'));
  app.get('/', (_: any, res: any) => res.status(200).send('TonBet Bot Running'));
  app.use((req: any, res: any) => res.status(200).send('OK'));

  const port = process.env.PORT || 8080;
  const server = app.listen(port, async () => {
    console.log(`[Final] Bot Server listening on port ${port}`);
    
    // Automatically update Telegram Webhook on startup
    const domain = process.env.WEBHOOK_DOMAIN || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    if (domain && domain !== 'https://undefined') {
      const webhookUrl = `${domain}/webhook`;
      console.log(`[Webhook] Setting Telegram webhook to: ${webhookUrl}`);
      try {
        await bot.telegram.setWebhook(webhookUrl);
        console.log('[Webhook] Telegram webhook updated successfully');
      } catch (e: any) {
        console.error('[Webhook] Failed to set Telegram webhook:', e.message);
      }
    }

    // Heartbeat to prove lifecycle stability
    setInterval(() => {
      console.log(`[Heartbeat] ${new Date().toISOString()} - Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    }, 10000);
  });


  const stopBot = (signal: string) => {
    console.log(`[Shutdown] ${signal}`);
    try { bot.stop(signal); } catch (e) {}
    server.close();
    process.exit(0);
  };

  process.once('SIGINT', () => stopBot('SIGINT'));
  process.once('SIGTERM', () => stopBot('SIGTERM'));
}

startServer().catch(err => console.error('[Fatal]', err));
