import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userEmail, cart, total } = body;

  if (!userEmail || !cart || !total) {
    return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      userEmail,
      items: cart,
      total,
    },
  });

  return NextResponse.json(order);
}
