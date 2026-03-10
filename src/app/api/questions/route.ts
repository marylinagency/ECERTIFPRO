import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/questions - الحصول على الأسئلة
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('certificateId');
    
    if (!certificateId) {
      return NextResponse.json(
        { success: false, error: 'Certificate ID is required' },
        { status: 400 }
      );
    }

    const questions = await db.question.findMany({
      where: { 
        certificateId,
        isActive: true 
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        options: true,
        // لا نرجع correctAnswer للعميل
      },
    });

    // تحويل options من JSON string إلى array
    const formattedQuestions = questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : [],
    }));

    return NextResponse.json({
      success: true,
      data: formattedQuestions,
      total: formattedQuestions.length,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST /api/questions - إنشاء سؤال جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const question = await db.question.create({
      data: {
        certificateId: body.certificateId,
        question: body.question,
        options: JSON.stringify(body.options),
        correctAnswer: body.correctAnswer,
        explanation: body.explanation,
        order: body.order || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
