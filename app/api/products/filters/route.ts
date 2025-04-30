import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [brands, vehicles, engineTypes] = await Promise.all([
      prisma.product.findMany({
        where: { brand: { not: null } },
        distinct: ['brand'],
        select: { brand: true },
      }),
      prisma.product.findMany({
        where: { vehicle: { not: null } },
        distinct: ['vehicle'],
        select: { vehicle: true },
      }),
      prisma.product.findMany({
        where: { engineType: { not: null } },
        distinct: ['engineType'],
        select: { engineType: true },
      }),
    ]);

    return NextResponse.json({
      brands: brands.map((b) => b.brand),
      vehicles: vehicles.map((v) => v.vehicle),
      engineTypes: engineTypes.map((e) => e.engineType),
    });
  } catch (error) {
    console.error('❌ Error fetching product filters:', error);
    return NextResponse.json({ error: 'Server error fetching filters' }, { status: 500 });
  }
}
