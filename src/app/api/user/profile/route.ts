import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// GET /api/user/profile - الحصول على بيانات المستخدم الكاملة
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

    // بيانات المستخدم الأساسية
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        level: true,
        points: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // شهادات المستخدم
    const certificates = await db.userCertificate.findMany({
      where: { userId },
      include: {
        certificate: {
          select: {
            id: true,
            title: true,
            titleEn: true,
            level: true,
            category: true,
          },
        },
      },
      orderBy: { issueDate: 'desc' },
    });

    // بادج المستخدم
    const badges = await db.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    // محاولات الاختبار
    const examAttempts = await db.examAttempt.findMany({
      where: { userId },
      include: {
        certificate: {
          select: {
            id: true,
            title: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // الإحصائيات
    const stats = {
      totalCertificates: certificates.length,
      totalBadges: badges.length,
      totalAttempts: await db.examAttempt.count({ where: { userId } }),
      passedAttempts: await db.examAttempt.count({ where: { userId, passed: true } }),
      averageScore: certificates.length > 0
        ? Math.round(certificates.reduce((sum, c) => sum + c.score, 0) / certificates.length)
        : 0,
    };

    // المستوى بناءً على النقاط
    const levelThresholds = [
      { min: 0, level: 'مبتدئ' },
      { min: 100, level: 'متعلم' },
      { min: 300, level: 'ممارس' },
      { min: 600, level: 'متقدم' },
      { min: 1000, level: 'خبير' },
      { min: 1500, level: 'محترف' },
    ];

    const currentLevel = levelThresholds.reverse().find(t => user.points >= t.min)?.level || 'مبتدئ';

    // تحديث مستوى المستخدم إذا تغير
    if (currentLevel !== user.level) {
      await db.user.update({
        where: { id: userId },
        data: { level: currentLevel },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: { ...user, level: currentLevel },
        certificates,
        badges,
        examAttempts,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - تحديث بيانات المستخدم
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, avatar, currentPassword, newPassword } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    // تغيير كلمة المرور
    if (currentPassword && newPassword) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'المستخدم غير موجود' },
          { status: 404 }
        );
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور الحالية غير صحيحة' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        level: true,
        points: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'تم تحديث البيانات بنجاح',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
