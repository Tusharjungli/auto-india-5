import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('search') || '';
    const price = parseInt(searchParams.get('price') || '0', 10);
    const categoryIds = searchParams.getAll('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 6;
  
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          ...(price ? [{ price: { lte: price } }] : []),
          ...(categoryIds.length
            ? [{ categoryId: { in: categoryIds } }]
            : []),
        ],
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  
    const totalCount = await prisma.product.count(); // for future total pages
  
    return NextResponse.json({ products, totalCount });
  }
  
  