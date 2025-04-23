import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/app/utils/email'; // ✅ Fixed import path

type CartItem = {
  id: string;
  quantity: number;
  price: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, cart, total } = body;

    if (!userEmail || !Array.isArray(cart) || cart.length === 0 || typeof total !== 'number') {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
      include: {
        items: {
          include: {
            product: true, // ✅ Include product name for email
          },
        },
      },
    });

    // ✅ Send confirmation email (now passing 2 args)
    await sendOrderConfirmation(user.email, order.id);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('❌ Order creation failed:', error);
    return NextResponse.json({ error: 'Server error while placing order' }, { status: 500 });
  }
}
