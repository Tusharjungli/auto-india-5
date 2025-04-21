import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 🔄 Step 1: Clean old data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ✅ Step 2: Add fresh categories
  const [brake, oil, filter] = await Promise.all([
    prisma.category.create({ data: { name: 'Brakes' } }),
    prisma.category.create({ data: { name: 'Engine Oil' } }),
    prisma.category.create({ data: { name: 'Air Filters' } }),
  ]);

  // ✅ Step 3: Seed products linked to categories
  await prisma.product.createMany({
    data: [
      {
        name: 'Kia Brake Pad',
        description: 'Front disc brake pad — Compatible with Kia Seltos & Sonet',
        price: 2499,
        imageUrl: '/images/kia-brake-pad.jpg',
        stock: 20,
        categoryId: brake.id,
      },
      {
        name: 'Hyundai Engine Oil 5W-30',
        description: 'Premium synthetic oil — 3L pack for Hyundai models',
        price: 1899,
        imageUrl: '/images/hyundai-oil.jpg',
        stock: 15,
        categoryId: oil.id,
      },
      {
        name: 'Tata Safari Air Filter',
        description: 'HEPA air filter for optimal engine performance',
        price: 799,
        imageUrl: '/images/tata-air-filter.jpg',
        stock: 30,
        categoryId: filter.id,
      },
    ],
  });

  console.log('✅ Clean seed completed: categories + products loaded!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
