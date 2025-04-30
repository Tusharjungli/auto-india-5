import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { vehicle: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5, // limit results
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('❌ Smart Search Error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
