import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/verify/[id] - التحقق من الشهادة
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: certificateNumber } = await params;

    // البحث عن الشهادة
    const userCertificate = await db.userCertificate.findUnique({
      where: { certificateNumber },
      include: {
        certificate: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!userCertificate) {
      return NextResponse.json({
        success: false,
        error: 'الشهادة غير موجودة',
      }, { status: 404 });
    }

    // تحويل skills من JSON string إلى array
    const skills = userCertificate.certificate?.skills 
      ? JSON.parse(userCertificate.certificate.skills) 
      : [];

    return NextResponse.json({
      success: true,
      data: {
        id: userCertificate.certificateNumber,
        studentName: userCertificate.user.name,
        certificateTitle: userCertificate.certificate?.title,
        certificateTitleEn: userCertificate.certificate?.titleEn,
        score: userCertificate.score,
        issueDate: userCertificate.issueDate,
        status: userCertificate.status,
        category: userCertificate.certificate?.category,
        skills,
        founderName: 'رضوان دالي حمدوني',
        platformName: 'ECERTIFPRO',
        platformUrl: 'ECERTIFPRO.COM',
        email: 'almarjaa.project@hotmail.com',
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في التحقق من الشهادة' },
      { status: 500 }
    );
  }
}
