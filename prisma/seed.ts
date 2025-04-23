// prisma/seed.ts
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  // ✅ Create Categories
  await prisma.category.createMany({
    data: [
      { id: 'c1', name: 'Brake Pads', slug: 'brake-pads' },
      { id: 'c2', name: 'Engine Oils', slug: 'engine-oils' },
      { id: 'c3', name: 'Air Filters', slug: 'air-filters' },
    ],
    skipDuplicates: true,
  });

  // ✅ Create Products
  await prisma.product.createMany({
    data: [
      {
        id: 'p1',
        name: 'Kia Brake Pads',
        price: 1500,
        stock: 20,
        imageUrl: '/images/products/brake-pads.jpg',
        categoryId: 'c1',
        description: 'High-performance brake pads for Kia vehicles.',
      },
      {
        id: 'p2',
        name: 'Castrol Engine Oil 5W-30',
        price: 2500,
        stock: 50,
        imageUrl: '/images/products/engine-oil.jpg',
        categoryId: 'c2',
        description: 'Premium Castrol engine oil suitable for Indian conditions.',
      },
      {
        id: 'p3',
        name: 'Hyundai Air Filter',
        price: 800,
        stock: 30,
        imageUrl: '/images/products/air-filter.jpg',
        categoryId: 'c3',
        description: 'Durable air filter compatible with Hyundai models.',
      },
    ],
    skipDuplicates: true,
  });

  // ✅ Create Admin and Test Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@autoindia.com' },
    update: {},
    create: {
      email: 'admin@autoindia.com',
      name: 'Admin',
      hashedPassword: adminPassword,
      isAdmin: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@autoindia.com' },
    update: {},
    create: {
      email: 'user@autoindia.com',
      name: 'Test User',
      hashedPassword: userPassword,
      isAdmin: false,
    },
  });

  console.log('✅ Dummy products, categories, and users seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
