import { prisma } from '@tonbet/database';

async function seed() {
  console.log('🌱 Seeding Markets...');

  const markets = [
    {
      title: 'Will TON reach $10 before July 2025?',
      description: 'The price of TON must be >= $10 on CoinMarketCap at any point before July 1st, 2025.',
      category: 'Crypto',
      end_time: new Date('2025-07-01'),
      created_by: 'admin',
      total_volume: 1250,
    },
    {
      title: 'Will Telegram reach 1.5 Billion users this year?',
      description: 'Official announcement from Pavel Durov or Telegram blog regarding user count.',
      category: 'Tech',
      end_time: new Date('2025-12-31'),
      created_by: 'admin',
      total_volume: 840,
    },
    {
      title: 'Will Bitcoin hit a new ATH in Q2 2025?',
      description: 'BTC price exceeding $100,000 on major exchanges.',
      category: 'Crypto',
      end_time: new Date('2025-06-30'),
      created_by: 'admin',
      total_volume: 3200,
    }
  ];

  for (const market of markets) {
    await prisma.market.create({
      data: market
    });
  }

  console.log('✅ Seeding complete!');
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
