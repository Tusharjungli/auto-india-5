import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
  }

  const body = await req.json();
  const { productId, rating, comment } = body;

  if (!productId || !rating) {
    return NextResponse.json({ error: 'Product ID and rating are required.' }, { status: 400 });
  }

  // ✅ Check if feedback already exists for this user and product
  const existingFeedback = await prisma.feedback.findFirst({
    where: {
      user: { email: session.user.email },
      productId,
    },
  });

  if (existingFeedback) {
    return NextResponse.json({ error: 'You have already submitted feedback for this product.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  const feedback = await prisma.feedback.create({
    data: {
      userId: user.id,
      productId,
      rating,
      comment,
    },
  });

  return NextResponse.json(feedback, { status: 201 });
}
