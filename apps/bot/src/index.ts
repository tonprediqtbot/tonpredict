import { Telegraf, Markup } from 'telegraf';
import { prisma } from '@tonbet/database';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config({ path: '../../.env' });

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('[Fatal] BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf(token);

// Redis for rate limiting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('error', (err) => console.error('Redis Error:', err.message));

// Configuration
let webAppUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (webAppUrl.includes('${RAILWAY_PUBLIC_DOMAIN}') && process.env.RAILWAY_PUBLIC_DOMAIN) {
  webAppUrl = webAppUrl.replace('${RAILWAY_PUBLIC_DOMAIN}', process.env.RAILWAY_PUBLIC_DOMAIN);
}

// Error handlers
process.on('uncaughtException', (err) => console.error('[Fatal] Uncaught:', err));
process.on('unhandledRejection', (reason) => console.error('[Fatal] Rejection:', reason));

// Middleware: Rate Limiting
bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  const key = `rate_limit:${ctx.from.id}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 1);
    if (count > 10) return ctx.reply('⚠️ Please slow down a bit.');
  } catch (e) {}
  return next();
});

// Command: /start
bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username || null;
  const firstName = ctx.from.first_name;
  const startPayload = (ctx as any).startPayload; // Referral code from start payload

  console.log(`[User] Start command from ${telegramId} (${username || 'no-username'})`);

  try {
    // Upsert user to ensure they exist in our DB
    const user = await prisma.user.upsert({
      where: { telegram_id: telegramId },
      update: { username: username }, // Update username if it changed
      create: {
        telegram_id: telegramId,
        username: username,
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referred_by: startPayload || null,
      },
    });

    await ctx.reply(
      `Welcome to TonBet, ${firstName}! 🚀\n\nPredict on world events, sports, and crypto markets using TON. Secure, fast, and decentralized.`,
      Markup.inlineKeyboard([
        [Markup.button.webApp('Launch TonBet 📱', webAppUrl)],
        [Markup.button.callback('How it works ❓', 'help'), Markup.button.callback('My Portfolio 📊', 'portfolio')],
        [Markup.button.url('Join Community 👥', 'https://t.me/tonbet_community')]
      ])
    );
  } catch (error) {
    console.error('[Database] Sync Error:', error);
    await ctx.reply("Welcome back to TonBet! 🚀\n\nClick the button below to open the app and start predicting.", 
      Markup.inlineKeyboard([[Markup.button.webApp('Launch TonBet 📱', webAppUrl)]])
    );
  }
});

// Command: /markets
bot.command('markets', (ctx) => {
  ctx.reply('Explore active prediction markets:', Markup.inlineKeyboard([
    [Markup.button.webApp('View All Markets 📈', `${webAppUrl}/markets`)]
  ]));
});

// Command: /refer
bot.command('refer', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  try {
    const user = await prisma.user.findUnique({ where: { telegram_id: telegramId } });
    if (user) {
      const refLink = `https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}?start=${user.referral_code}`;
      ctx.reply(`💰 *Refer & Earn*\n\nShare your link and earn rewards from every bet your friends make!\n\nYour Link: \`${refLink}\``, { parse_mode: 'Markdown' });
    } else {
      ctx.reply('Please use /start first to register.');
    }
  } catch (e) {
    ctx.reply('Error fetching referral data.');
  }
});

// Callbacks
bot.action('help', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('📖 *How to play TonBet:*\n\n1. Launch the Mini App\n2. Connect your TON Wallet\n3. Choose a market and predict Yes or No\n4. Win TON when your prediction comes true!', { parse_mode: 'Markdown' });
});

bot.action('portfolio', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Your portfolio is available inside the Mini App:', Markup.inlineKeyboard([
    [Markup.button.webApp('Open Portfolio 💼', `${webAppUrl}/portfolio`)]
  ]));
});

// Express Server
async function startServer() {
  const express = require('express');
  const app = express();
  app.use(express.json());

  app.get('/health', (_: any, res: any) => res.status(200).send('OK'));
  app.get('/', (_: any, res: any) => res.status(200).send('TonBet Bot Online'));
  app.post('/webhook', bot.webhookCallback('/webhook'));
  
  app.use((req: any, res: any) => {
    res.status(200).send('OK');
  });

  const port = process.env.PORT || 8080;
  const server = app.listen(port, async () => {
    console.log(`[Final] Bot Server Online on Port ${port}`);
    
    // Auto-update Webhook
    const domain = process.env.WEBHOOK_DOMAIN || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    if (domain && domain !== 'https://undefined') {
      try {
        await bot.telegram.setWebhook(`${domain}/webhook`);
        console.log('[Webhook] Telegram synced successfully');
      } catch (e: any) {
        console.error('[Webhook] Sync Failed:', e.message);
      }
    }
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

startServer().catch(err => console.error('[Fatal] Server Crash:', err));
