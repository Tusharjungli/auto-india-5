import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// ✅ GET: Fetch paginated products (Admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 6;

  const skip = (page - 1) * pageSize;

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);

  return NextResponse.json({
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / pageSize),
    currentPage: page,
  });
}

// ✅ POST: Add new product (with brand, vehicle, engineType)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    description,
    brand,
    vehicle,
    engineType,
    price,
    stock,
    imageUrl,
    categoryId,
  } = body;

  if (!name || !price || !stock || !imageUrl || !categoryId || !brand || !vehicle || !engineType) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid Category ID. Category does not exist.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        vehicle,
        engineType,
        price,
        stock,
        imageUrl,
        categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('❌ Error adding product:', error);
    return NextResponse.json({ error: 'Server error while adding product.' }, { status: 500 });
  }
}
