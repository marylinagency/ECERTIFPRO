import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { exams, calculateScore } from '@/lib/exams';

// GET /api/exams - الحصول على محاولات الاختبار
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const certificateId = searchParams.get('certificateId');

    if (userId && certificateId) {
      const attempts = await db.examAttempt.findMany({
        where: { userId, certificateId },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: attempts });
    }

    if (userId) {
      const attempts = await db.examAttempt.findMany({
        where: { userId },
        include: { certificate: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: attempts });
    }

    return NextResponse.json(
      { success: false, error: 'userId is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching exam attempts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exam attempts' },
      { status: 500 }
    );
  }
}

// POST /api/exams - حفظ نتيجة الاختبار
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, certificateId, answers, studentName, timeSpent } = body;

    // حساب النتيجة
    const result = calculateScore(answers, certificateId);
    
    // الحصول على معلومات الشهادة
    const certificate = await db.certificate.findUnique({
      where: { id: certificateId }
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // حفظ محاولة الاختبار
    const attempt = await db.examAttempt.create({
      data: {
        userId,
        certificateId,
        answers: JSON.stringify(answers),
        score: result.percentage,
        passed: result.passed,
        completedAt: new Date(),
        timeSpent: timeSpent || 0,
      },
    });

    // إذا نجح، إنشاء شهادة
    let certificateNumber = null;
    let userCertificate = null;

    if (result.passed && userId && userId !== 'guest') {
      // التحقق من وجود شهادة سابقة
      const existingCert = await db.userCertificate.findFirst({
        where: { userId, certificateId },
      });

      if (!existingCert) {
        // إنشاء رقم شهادة فريد
        certificateNumber = `ECERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // إنشاء شهادة جديدة
        userCertificate = await db.userCertificate.create({
          data: {
            certificateId,
            userId,
            certificateNumber,
            score: result.percentage,
            status: 'valid',
          },
        });

        // تحديث نقاط المستخدم
        await db.user.update({
          where: { id: userId },
          data: {
            points: { increment: 100 },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        certificate: userCertificate,
        certificateNumber,
        passed: result.passed,
        score: result.percentage,
        correctCount: result.correctCount,
        totalCount: result.totalCount,
      },
    });
  } catch (error) {
    console.error('Error saving exam attempt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save exam attempt' },
      { status: 500 }
    );
  }
}
