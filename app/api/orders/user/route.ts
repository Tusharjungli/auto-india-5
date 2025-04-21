import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

  const orders = await prisma.order.findMany({
    where: { userEmail: email },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}
