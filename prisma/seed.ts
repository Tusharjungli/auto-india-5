// prisma/seed.ts
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  // ✅ Categories
  const categories = [
    { id: 'c1', name: 'Brake Pads', slug: 'brake-pads' },
    { id: 'c2', name: 'Engine Oils', slug: 'engine-oils' },
    { id: 'c3', name: 'Air Filters', slug: 'air-filters' },
    { id: 'c4', name: 'Filters', slug: 'filters' },
    { id: 'c5', name: 'Electrical Components', slug: 'electrical-components' },
    { id: 'c6', name: 'Suspension & Steering', slug: 'suspension-steering' },
    { id: 'c7', name: 'Cooling Systems', slug: 'cooling-systems' },
    { id: 'c8', name: 'Transmission Parts', slug: 'transmission-parts' },
    { id: 'c9', name: 'Lighting', slug: 'lighting' },
    { id: 'c10', name: 'Body Parts', slug: 'body-parts' },
    { id: 'c11', name: 'Accessories', slug: 'accessories' },
  ];

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log('✅ Categories seeded.');

  // ✅ Products
  const products = [
    {
      id: 'p1',
      name: 'Kia Brake Pads',
      price: 1500,
      stock: 20,
      imageUrl: '/images/products/brake-pads.jpg',
      categoryId: 'c1',
      brand: 'Kia',
      vehicle: 'Seltos, Sonet',
      engineType: 'Petrol',
      description: 'High-performance brake pads for Kia vehicles.',
    },
    {
      id: 'p2',
      name: 'Castrol Engine Oil 5W-30',
      price: 2500,
      stock: 50,
      imageUrl: '/images/products/engine-oil.jpg',
      categoryId: 'c2',
      brand: 'Castrol',
      vehicle: 'All Cars',
      engineType: 'Diesel, Petrol',
      description: 'Premium Castrol engine oil suitable for Indian conditions.',
    },
    {
      id: 'p3',
      name: 'Hyundai Air Filter',
      price: 800,
      stock: 30,
      imageUrl: '/images/products/air-filter.jpg',
      categoryId: 'c3',
      brand: 'Hyundai',
      vehicle: 'i10, i20, Creta',
      engineType: 'Petrol',
      description: 'Durable air filter compatible with Hyundai models.',
    },
    {
      id: 'p4',
      name: 'LED Headlight Bulb H4 12V',
      price: 1200,
      stock: 40,
      imageUrl: '/images/products/led-headlight.jpg',
      categoryId: 'c9',
      brand: 'Philips',
      vehicle: 'All Cars',
      engineType: 'Universal',
      description: 'Energy-efficient LED headlight bulbs for better visibility.',
    },
    {
      id: 'p5',
      name: 'Maruti Suzuki Suspension Kit',
      price: 4200,
      stock: 15,
      imageUrl: '/images/products/suspension-kit.jpg',
      categoryId: 'c6',
      brand: 'Maruti Suzuki',
      vehicle: 'Swift, Baleno',
      engineType: 'Petrol',
      description: 'Complete suspension kit for Maruti Suzuki models.',
    },
  ];

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log('✅ Products seeded.');

  // ✅ Admin and User Seeding
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

  console.log('✅ Admin and Test User seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
