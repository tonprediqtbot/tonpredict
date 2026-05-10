import { Telegraf, Markup } from 'telegraf';
import { prisma } from '@tonbet/database';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config({ path: '../../.env' });

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
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

bot.command('start', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username || '';
  
  // Extract referral code from deep link if any: /start ref_123
  const startPayload = ctx.message.text.split(' ')[1];
  let referredBy = null;
  if (startPayload && startPayload.startsWith('ref_')) {
    referredBy = startPayload.replace('ref_', '');
  }

  // Create or find user
  await prisma.user.upsert({
    where: { telegram_id: telegramId },
    update: { username },
    create: {
      telegram_id: telegramId,
      username,
      referral_code: `ref_${telegramId}`,
      referred_by: referredBy
    }
  });

  ctx.reply(
    `Welcome to TonBet! 🎲\n\nThe premier prediction market on the TON blockchain.\nPredict outcomes, trade shares, and earn TON.`,
    Markup.inlineKeyboard([
      [Markup.button.webApp('Launch TonBet', webAppUrl)],
      [Markup.button.callback('Help', 'help'), Markup.button.callback('My Portfolio', 'portfolio')]
    ])
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

// Evaluate Railway's dynamic variable properly
let domain = process.env.RAILWAY_PUBLIC_DOMAIN 
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
  : process.env.WEBHOOK_DOMAIN;

if (domain && domain.includes('${RAILWAY_PUBLIC_DOMAIN}')) {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    domain = domain.replace('${RAILWAY_PUBLIC_DOMAIN}', process.env.RAILWAY_PUBLIC_DOMAIN);
  } else {
    console.warn("Warning: RAILWAY_PUBLIC_DOMAIN is not set but was referenced in WEBHOOK_DOMAIN. Falling back to Long Polling.");
    domain = undefined; // falsy domain disables webhooks
  }
}

if (domain) {
  // Production: Use Webhooks
  import('http').then(({ createServer }) => {
    const port = Number(process.env.PORT) || 3000;
    const webhookHandler = bot.webhookCallback('/api/webhook');
    
    const url = `${domain}/api/webhook`;
    bot.telegram.setWebhook(url).then(() => {
      console.log(`Webhook set to ${url}`);
    });

    const server = createServer(webhookHandler);
    server.listen(port, () => {
      console.log(`Bot running via Webhooks on port ${port}`);
    });
  });
} else {
  // Local Development: Use Long Polling
  bot.launch().then(() => {
    console.log('Bot is running via Long Polling...');
  });
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
