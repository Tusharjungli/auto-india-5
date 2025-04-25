import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency = 'INR' } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Amount is required and must be a number.' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error('❌ Razorpay Error:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
