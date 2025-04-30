import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      categoryId: true,
      brand: true,
      vehicle: true,
    },
  });

  // 🧠 Simulate AI embedding for now
  const embeddings = products.map((product) => ({
    id: product.id,
    embedding: [Math.random(), Math.random(), Math.random()], // Replace with real model later
  }));

  return NextResponse.json({ embeddings });
}
