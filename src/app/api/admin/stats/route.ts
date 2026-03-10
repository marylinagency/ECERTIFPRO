import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [usersCount, certificatesCount, paymentsCount, revenueResult] = await Promise.all([
      prisma.user.count(),
      prisma.userCertificate.count(),
      prisma.payment.count({ where: { status: 'completed' } }),
      prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } })
    ]);
    return NextResponse.json({
      stats: {
        users: usersCount,
        certificates: certificatesCount,
        payments: paymentsCount,
        revenue: revenueResult._sum.amount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'حدث خطأ في جلب الإحصائيات' }, { status: 500 });
  }
}
