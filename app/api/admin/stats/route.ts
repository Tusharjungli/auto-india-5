import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalRevenueData = await prisma.order.aggregate({
      _sum: { total: true },
    });
    const pendingOrders = await prisma.order.count({
      where: { status: 'pending' },
    });

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenueData._sum.total || 0,
      pendingOrders,
    });
  } catch (error) {
    console.error('❌ Stats Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
