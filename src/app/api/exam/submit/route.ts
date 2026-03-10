import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/exam/submit - تقديم الاختبار وحساب النتيجة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { certificateId, userId, answers } = body;

    if (!certificateId || !answers) {
      return NextResponse.json(
        { success: false, error: 'Certificate ID and answers are required' },
        { status: 400 }
      );
    }

    // الحصول على الأسئلة مع الإجابات الصحيحة
    const questions = await db.question.findMany({
      where: { 
        certificateId,
        isActive: true 
      },
      select: {
        id: true,
        correctAnswer: true,
        explanation: true,
      },
    });

    // حساب النتيجة
    let correctCount = 0;
    const results = questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // الحصول على معلومات الشهادة
    const certificate = await db.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    const passed = score >= certificate.passingScore;

    // حفظ محاولة الاختبار
    if (userId) {
      await db.examAttempt.create({
        data: {
          userId,
          certificateId,
          answers: JSON.stringify(answers),
          score,
          passed,
          completedAt: new Date(),
        },
      });

      // إذا نجح، إنشاء شهادة للمستخدم
      if (passed) {
        const certificateNumber = `MRJ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        await db.userCertificate.create({
          data: {
            userId,
            certificateId,
            certificateNumber,
            score,
            status: 'valid',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        score,
        totalQuestions,
        correctCount,
        passed,
        passingScore: certificate.passingScore,
        results,
        certificate: {
          title: certificate.title,
          titleEn: certificate.titleEn,
          level: certificate.level,
        },
      },
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit exam' },
      { status: 500 }
    );
  }
}
