import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// ✅ GET: Fetch all products (Admin only)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(products);
}

// ✅ POST: Add new product with category ID validation
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, price, stock, imageUrl, categoryId } = body;

  // ❌ Check for missing fields
  if (!name || !price || !stock || !imageUrl || !categoryId) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  try {
    // ✅ Verify that the Category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid Category ID. Category does not exist.' }, { status: 400 });
    }

    // ✅ Create the product if category is valid
    const product = await prisma.product.create({
      data: {
        name,
        description,
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
