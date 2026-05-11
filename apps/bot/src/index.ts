import { Telegraf, Markup } from 'telegraf';
import { prisma } from '@tonbet/database';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config({ path: '../../.env' });

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('[Fatal] BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf(token);

// Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => console.error('Redis Error:', err.message));
sub.on('error', (err) => console.error('Redis Sub Error:', err.message));

// Configuration
let webAppUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (webAppUrl.includes('${RAILWAY_PUBLIC_DOMAIN}') && process.env.RAILWAY_PUBLIC_DOMAIN) {
  webAppUrl = webAppUrl.replace('${RAILWAY_PUBLIC_DOMAIN}', process.env.RAILWAY_PUBLIC_DOMAIN);
}

// Command: /start
bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username || null;
  const firstName = ctx.from.first_name;

  try {
    await prisma.user.upsert({
      where: { telegram_id: telegramId },
      update: { username: username },
      create: {
        telegram_id: telegramId,
        username: username,
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });

    await ctx.reply(
      `Welcome to TonBet, ${firstName}! 🚀\n\nPredict on world events and win TON.`,
      Markup.inlineKeyboard([
        [Markup.button.webApp('Launch TonBet 📱', webAppUrl)],
        [Markup.button.url('Join Community 👥', 'https://t.me/tonbet_community')]
      ])
    );
  } catch (error) {
    console.error('[Database] Start Error:', error);
  }
});

// Express + Socket.IO Server
async function startServer() {
  const express = require('express');
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(express.json());

  // Health check
  app.get('/health', (_: any, res: any) => res.status(200).send('OK'));
  app.post('/webhook', bot.webhookCallback('/webhook'));

  // Socket logic
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`[Socket] User disconnected: ${socket.id}`));
  });

  // Redis Subscription for Real-time Broadcast
  sub.subscribe('market_updates', (err) => {
    if (err) console.error('Failed to subscribe to market_updates:', err);
  });

  sub.on('message', (channel, message) => {
    if (channel === 'market_updates') {
      const data = JSON.parse(message);
      console.log(`[Realtime] Broadcasting update for market ${data.marketId}`);
      io.emit('market_update', data);
    }
  });

  const port = 8080;
  server.listen(port, '0.0.0.0', async () => {
    console.log(`[Final] Real-time Hub Online on 0.0.0.0:${port}`);
    
    // Auto-update Webhook
    const domain = process.env.WEBHOOK_DOMAIN || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    if (domain && domain !== 'https://undefined') {
      try {
        await bot.telegram.setWebhook(`${domain}/webhook`);
        console.log(`[Webhook] Telegram synced: ${domain}/webhook`);
      } catch (e: any) {
        console.error('[Webhook] Sync Failed:', e.message);
      }
    }
  });

  const stopServer = (signal: string) => {
    console.log(`[Shutdown] ${signal}`);
    bot.stop(signal);
    server.close();
    process.exit(0);
  };

  process.once('SIGINT', () => stopServer('SIGINT'));
  process.once('SIGTERM', () => stopServer('SIGTERM'));
}

startServer().catch(err => console.error('[Fatal] Server Crash:', err));
