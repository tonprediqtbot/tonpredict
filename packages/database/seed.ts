import { prisma } from './index';

async function seed() {
  console.log('🌱 Seeding Production Data...');

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { telegram_id: '12345678' },
    update: {},
    create: {
      telegram_id: '12345678',
      username: 'TonBetAdmin',
      referral_code: 'ADMIN1',
      points: 1000
    }
  });

  const markets = [
    {
      title: 'Will TON reach $10 before July 2025?',
      description: 'The price of TON must be >= $10 on CoinMarketCap at any point before July 1st, 2025.',
      category: 'Crypto',
      endDate: new Date('2025-07-01'),
      creatorId: admin.telegram_id,
      totalVolume: 1250,
      liquidity: 100,
      yesPool: 50,
      noPool: 50
    },
    {
      title: 'Will Telegram reach 1.5 Billion users this year?',
      description: 'Official announcement from Pavel Durov or Telegram blog regarding user count.',
      category: 'Tech',
      endDate: new Date('2025-12-31'),
      creatorId: admin.telegram_id,
      totalVolume: 840,
      liquidity: 100,
      yesPool: 50,
      noPool: 50
    },
    {
      title: 'Will Bitcoin hit a new ATH in Q2 2025?',
      description: 'BTC price exceeding $100,000 on major exchanges.',
      category: 'Crypto',
      endDate: new Date('2025-06-30'),
      creatorId: admin.telegram_id,
      totalVolume: 3200,
      liquidity: 100,
      yesPool: 50,
      noPool: 50
    }
  ];

  for (const market of markets) {
    await prisma.market.upsert({
      where: { title: market.title },
      update: market,
      create: market
    });
  }

  console.log('✅ Seeding complete!');
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
