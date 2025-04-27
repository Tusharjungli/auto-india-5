import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('search') || '';
  const price = parseInt(searchParams.get('price') || '0', 10);
  const categoryIds = searchParams.getAll('category');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 6;

  const where: Prisma.ProductWhereInput = {
    AND: [
      {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
        ],
      },
      ...(price > 0 ? [{ price: { lte: price } }] : []),
      ...(categoryIds.length > 0 ? [{ categoryId: { in: categoryIds } }] : []),
    ],
  };

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}
