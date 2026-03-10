import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/verify - التحقق من شهادة برقم الشهادة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNumber = searchParams.get('certificateNumber');

    if (!certificateNumber) {
      return NextResponse.json(
        { success: false, error: 'رقم الشهادة مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن الشهادة
    const userCertificate = await db.userCertificate.findUnique({
      where: { certificateNumber },
      include: {
        certificate: {
          select: {
            title: true,
            titleEn: true,
            description: true,
            category: true,
            level: true,
            duration: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!userCertificate) {
      return NextResponse.json(
        { success: false, error: 'الشهادة غير موجودة', verified: false },
        { status: 404 }
      );
    }

    // تحديد حالة الشهادة
    let statusMessage = '';
    let isValid = true;

    switch (userCertificate.status) {
      case 'valid':
        statusMessage = 'الشهادة صالحة ومعتمدة';
        break;
      case 'expired':
        statusMessage = 'الشهادة منتهية الصلاحية';
        isValid = false;
        break;
      case 'revoked':
        statusMessage = 'الشهادة ملغاة';
        isValid = false;
        break;
      default:
        statusMessage = 'حالة غير معروفة';
        isValid = false;
    }

    // التحقق من تاريخ الانتهاء
    if (userCertificate.expiryDate && new Date() > userCertificate.expiryDate) {
      statusMessage = 'الشهادة منتهية الصلاحية';
      isValid = false;
    }

    const verificationData = {
      verified: isValid,
      status: userCertificate.status,
      statusMessage,
      certificateNumber: userCertificate.certificateNumber,
      issueDate: userCertificate.issueDate,
      expiryDate: userCertificate.expiryDate,
      score: userCertificate.score,
      certificate: {
        title: userCertificate.certificate.title,
        titleEn: userCertificate.certificate.titleEn,
        description: userCertificate.certificate.description,
        category: userCertificate.certificate.category,
        level: userCertificate.certificate.level,
        duration: userCertificate.certificate.duration,
      },
      recipient: {
        name: userCertificate.user.name,
        // لا نعرض البريد الإلكتروني للخصوصية
      },
      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certificateNumber}`,
    };

    return NextResponse.json({
      success: true,
      data: verificationData,
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في التحقق من الشهادة' },
      { status: 500 }
    );
  }
}

// POST /api/verify - التحقق من شهادات متعددة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificateNumbers } = body;

    if (!certificateNumbers || !Array.isArray(certificateNumbers)) {
      return NextResponse.json(
        { success: false, error: 'قائمة أرقام الشهادات مطلوبة' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      certificateNumbers.map(async (certNum: string) => {
        const userCertificate = await db.userCertificate.findUnique({
          where: { certificateNumber: certNum },
          include: {
            certificate: {
              select: {
                title: true,
                titleEn: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
        });

        if (!userCertificate) {
          return {
            certificateNumber: certNum,
            verified: false,
            error: 'الشهادة غير موجودة',
          };
        }

        const isValid = userCertificate.status === 'valid' && 
          (!userCertificate.expiryDate || new Date() <= userCertificate.expiryDate);

        return {
          certificateNumber: certNum,
          verified: isValid,
          status: userCertificate.status,
          certificateTitle: userCertificate.certificate.title,
          recipientName: userCertificate.user.name,
          issueDate: userCertificate.issueDate,
          score: userCertificate.score,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error verifying certificates:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في التحقق من الشهادات' },
      { status: 500 }
    );
  }
}
