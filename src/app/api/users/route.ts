import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users - الحصول على مستخدم بالإيميل
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (id) {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          certificates: {
            include: {
              certificate: true,
            },
          },
          payments: true,
          examAttempts: {
            include: {
              certificate: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: user });
    }

    if (email) {
      const user = await db.user.findUnique({
        where: { email },
        include: {
          certificates: {
            include: {
              certificate: true,
            },
          },
          payments: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: user });
    }

    // إذا لم يتم تحديد email أو id، نرجع كل المستخدمين
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        points: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// POST /api/users - إنشاء مستخدم جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // التحقق من وجود المستخدم
    const existingUser = await db.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        data: existingUser,
        message: 'User already exists',
      });
    }

    const user = await db.user.create({
      data: {
        email: body.email,
        name: body.name,
        phone: body.phone,
        avatar: body.avatar,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT /api/users - تحديث مستخدم
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        level: data.level,
        points: data.points,
        stripeCustomerId: data.stripeCustomerId,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
