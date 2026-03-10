import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// POST /api/auth - تسجيل الدخول أو التسجيل
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone } = body;

    // تسجيل مستخدم جديد
    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: 'جميع الحقول مطلوبة' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
          { status: 400 }
        );
      }

      // التحقق من عدم وجود المستخدم
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
          { status: 400 }
        );
      }

      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // إنشاء المستخدم
      const user = await db.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
          level: 'مبتدئ',
          points: 0,
          role: 'user',
        },
      });

      const session = {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        points: user.points,
      };

      return NextResponse.json({
        success: true,
        data: {
          user: session,
          message: 'تم التسجيل بنجاح',
        },
      });
    }

    // تسجيل الدخول
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'البريد وكلمة المرور مطلوبان' },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'البريد الإلكتروني غير مسجل' },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور غير صحيحة' },
          { status: 401 }
        );
      }

      await db.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const session = {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        points: user.points,
      };

      return NextResponse.json({
        success: true,
        data: {
          user: session,
          message: 'تم تسجيل الدخول بنجاح',
        },
      });
    }

    // التحقق من الجلسة
    if (action === 'verify') {
      const { userId } = body;
      
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'غير مصرح' },
          { status: 401 }
        );
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          level: true,
          points: true,
          createdAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'المستخدم غير موجود' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user,
      });
    }

    return NextResponse.json(
      { success: false, error: 'إجراء غير معروف' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// GET /api/auth - الحصول على مستخدم بالمعرف
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        points: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
