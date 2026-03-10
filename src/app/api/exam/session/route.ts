import { NextResponse } from 'next/server';
import crypto from 'crypto';

// تخزين جلسات الاختبار في الذاكرة (في الإنتاج يجب استخدام Redis)
const examSessions = new Map<string, ExamSession>();

interface ExamSession {
  id: string;
  certificateId: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  questions: ExamQuestion[];
  correctAnswers: Record<string, number>;
  userAnswers: Record<string, number>;
  startTime: number;
  duration: number;
  studentName: string;
  userId: string;
  tabSwitches: number;
  completed: boolean;
  securityToken: string;
}

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  points: number;
  category: string;
  difficulty: string;
}

// مدة الاختبار حسب المستوى (بالدقائق)
const examDurations: Record<string, number> = {
  'almarjaa-beginner': 30,
  'almarjaa-intermediate': 45,
  'almarjaa-advanced': 60,
  'almarjaa-professional': 75,
};

// عدد الأسئلة حسب المستوى
const questionCounts: Record<string, number> = {
  'almarjaa-beginner': 20,
  'almarjaa-intermediate': 25,
  'almarjaa-advanced': 30,
  'almarjaa-professional': 35,
};

// استيراد الأسئلة من بنك الأسئلة
import {
  beginnerQuestions,
  intermediateQuestions,
  advancedQuestions,
  professionalQuestions,
} from '@/lib/questions-bank';

function getQuestionsForLevel(level: string) {
  switch (level) {
    case 'beginner':
      return beginnerQuestions;
    case 'intermediate':
      return intermediateQuestions;
    case 'advanced':
      return advancedQuestions;
    case 'professional':
      return professionalQuestions;
    default:
      return beginnerQuestions;
  }
}

function getLevelFromCertificateId(certificateId: string): string {
  if (certificateId.includes('beginner')) return 'beginner';
  if (certificateId.includes('intermediate')) return 'intermediate';
  if (certificateId.includes('advanced')) return 'advanced';
  if (certificateId.includes('professional')) return 'professional';
  return 'beginner';
}

function generateSecurityToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex');
}

// خلط المصفوفة (خوارزمية Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// خلط الخيارات وإرجاع الفهرس الصحيح الجديد
function shuffleOptions(options: string[], correctIndex: number): { shuffled: string[]; newCorrect: number } {
  const indexed = options.map((opt, idx) => ({ opt, idx }));
  const shuffled = shuffleArray(indexed);
  return {
    shuffled: shuffled.map(item => item.opt),
    newCorrect: shuffled.findIndex(item => item.idx === correctIndex),
  };
}

// POST - إنشاء جلسة اختبار جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { certificateId, studentName, userId } = body;

    if (!certificateId || !studentName) {
      return NextResponse.json(
        { success: false, error: 'البيانات غير مكتملة' },
        { status: 400 }
      );
    }

    const level = getLevelFromCertificateId(certificateId);
    const allQuestions = getQuestionsForLevel(level);
    const questionCount = questionCounts[certificateId] || 20;
    const duration = (examDurations[certificateId] || 30) * 60;

    // اختيار أسئلة عشوائية
    const shuffledQuestions = shuffleArray([...allQuestions]);
    const selectedQuestions = shuffledQuestions.slice(0, questionCount);

    // خلط خيارات كل سؤال
    const examQuestions: ExamQuestion[] = [];
    const correctAnswers: Record<string, number> = {};

    selectedQuestions.forEach(q => {
      const { shuffled, newCorrect } = shuffleOptions(q.options, q.correctAnswer);
      examQuestions.push({
        id: q.id,
        question: q.question,
        options: shuffled,
        points: q.points,
        category: q.category,
        difficulty: q.difficulty,
      });
      correctAnswers[q.id] = newCorrect;
    });

    // إنشاء الجلسة
    const sessionId = generateSessionId();
    const securityToken = generateSecurityToken();

    const session: ExamSession = {
      id: sessionId,
      certificateId,
      level: level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
      questions: examQuestions,
      correctAnswers,
      userAnswers: {},
      startTime: Date.now(),
      duration,
      studentName,
      userId: userId || 'guest',
      tabSwitches: 0,
      completed: false,
      securityToken,
    };

    examSessions.set(sessionId, session);

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        securityToken,
        certificateId,
        questions: examQuestions,
        duration,
        totalQuestions: examQuestions.length,
        studentName,
        startTime: session.startTime,
      },
    });
  } catch (error) {
    console.error('Error creating exam session:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء جلسة الاختبار' },
      { status: 500 }
    );
  }
}

// GET - الحصول على جلسة اختبار
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const securityToken = searchParams.get('token');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'معرف الجلسة مطلوب' },
        { status: 400 }
      );
    }

    const session = examSessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'جلسة الاختبار غير موجودة' },
        { status: 404 }
      );
    }

    if (securityToken && session.securityToken !== securityToken) {
      return NextResponse.json(
        { success: false, error: 'رمز الأمان غير صالح' },
        { status: 403 }
      );
    }

    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const remaining = Math.max(0, session.duration - elapsed);

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        certificateId: session.certificateId,
        questions: session.questions,
        duration: session.duration,
        remainingTime: remaining,
        totalQuestions: session.questions.length,
        completed: session.completed,
      },
    });
  } catch (error) {
    console.error('Error getting exam session:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في الحصول على جلسة الاختبار' },
      { status: 500 }
    );
  }
}

// PUT - حفظ إجابة أو إنهاء الاختبار
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, securityToken, questionId, answer, action, tabSwitch } = body;

    if (!sessionId || !securityToken) {
      return NextResponse.json(
        { success: false, error: 'البيانات غير مكتملة' },
        { status: 400 }
      );
    }

    const session = examSessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'جلسة الاختبار غير موجودة' },
        { status: 404 }
      );
    }

    if (session.securityToken !== securityToken) {
      return NextResponse.json(
        { success: false, error: 'رمز الأمان غير صالح' },
        { status: 403 }
      );
    }

    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    if (elapsed >= session.duration) {
      session.completed = true;
      return finishExam(session);
    }

    if (tabSwitch) {
      session.tabSwitches++;
    }

    if (action === 'answer' && questionId !== undefined && answer !== undefined) {
      session.userAnswers[questionId] = answer;
      return NextResponse.json({
        success: true,
        data: { saved: true },
      });
    }

    if (action === 'submit') {
      return finishExam(session);
    }

    return NextResponse.json(
      { success: false, error: 'إجراء غير معروف' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating exam session:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث جلسة الاختبار' },
      { status: 500 }
    );
  }
}

function finishExam(session: ExamSession) {
  const allQuestions = getQuestionsForLevel(session.level);
  
  let correctCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  const results = session.questions.map((q) => {
    const originalQuestion = allQuestions.find((oq) => oq.id === q.id);
    const userAnswer = session.userAnswers[q.id];
    const correctAnswer = session.correctAnswers[q.id];
    const isCorrect = userAnswer !== undefined && userAnswer === correctAnswer;

    if (isCorrect) {
      correctCount++;
      earnedPoints += q.points;
    }
    totalPoints += q.points;

    return {
      questionId: q.id,
      userAnswer,
      isCorrect,
      correctAnswer,
      explanation: originalQuestion?.explanation,
    };
  });

  const percentage = Math.round((correctCount / session.questions.length) * 100);
  const passingScore = getPassingScore(session.level);
  const passed = percentage >= passingScore;
  const timeSpent = Math.floor((Date.now() - session.startTime) / 1000);

  session.completed = true;

  return NextResponse.json({
    success: true,
    data: {
      sessionId: session.id,
      certificateId: session.certificateId,
      studentName: session.studentName,
      userId: session.userId,
      score: percentage,
      correctCount,
      totalQuestions: session.questions.length,
      passed,
      passingScore,
      earnedPoints,
      totalPoints,
      timeSpent,
      tabSwitches: session.tabSwitches,
      results,
      certificateNumber: passed
        ? `ECERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        : null,
    },
  });
}

function getPassingScore(level: string): number {
  switch (level) {
    case 'beginner':
      return 60;
    case 'intermediate':
      return 70;
    case 'advanced':
      return 75;
    case 'professional':
      return 80;
    default:
      return 60;
  }
}
