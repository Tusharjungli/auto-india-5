import { prisma } from '@/lib/prisma';
import {  NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const feedbacks = await prisma.feedback.findMany({
    include: {
      user: true,
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(feedbacks);
}
