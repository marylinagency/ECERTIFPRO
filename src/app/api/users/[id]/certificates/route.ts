import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users/[id]/certificates - الحصول على شهادات المستخدم
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const userCertificates = await db.userCertificate.findMany({
      where: { userId },
      include: {
        certificate: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    // تحويل skills من JSON string إلى array
    const formattedCertificates = userCertificates.map(uc => ({
      ...uc,
      certificate: uc.certificate ? {
        ...uc.certificate,
        skills: uc.certificate.skills ? JSON.parse(uc.certificate.skills) : [],
      } : null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCertificates,
    });
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user certificates' },
      { status: 500 }
    );
  }
}
