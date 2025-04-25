import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendOrderConfirmation } from '@/app/utils/email'; // ✅ Add this import

type CartItem = {
  id: string;
  quantity: number;
  price: number;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { cart, total } = body;

    if (!Array.isArray(cart) || cart.length === 0 || typeof total !== 'number') {
      return NextResponse.json({ error: 'Invalid order data.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: cart.map((item: CartItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // ✅ Send the confirmation email after successful order creation:
    await sendOrderConfirmation(session.user.email, order.id);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json({ error: 'Server error while placing order.' }, { status: 500 });
  }
}
