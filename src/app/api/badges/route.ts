import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/badges - الحصول على البادج
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    // الحصول على جميع البادج النشطة
    const badges = await db.badge.findMany({
      where: {
        isActive: true,
        ...(type && { type }),
      },
      orderBy: { createdAt: 'asc' },
    });

    // إذا كان هناك مستخدم، نعيد البادج مع حالة الحصول عليها
    if (userId) {
      const userBadges = await db.userBadge.findMany({
        where: { userId },
        select: { badgeId: true, earnedAt: true },
      });

      const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

      const badgesWithStatus = badges.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.has(badge.id),
        earnedAt: userBadges.find(ub => ub.badgeId === badge.id)?.earnedAt || null,
      }));

      return NextResponse.json({
        success: true,
        data: badgesWithStatus,
      });
    }

    return NextResponse.json({
      success: true,
      data: badges,
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب البادج' },
      { status: 500 }
    );
  }
}

// POST /api/badges - إنشاء بادج جديد (للمشرفين)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      nameEn, 
      description, 
      descriptionEn, 
      icon, 
      color, 
      type, 
      requirement, 
      points 
    } = body;

    if (!name || !nameEn || !description || !type) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود بادج من نفس النوع
    const existingBadge = await db.badge.findFirst({
      where: { type },
    });

    if (existingBadge) {
      return NextResponse.json(
        { success: false, error: 'يوجد بادج من هذا النوع بالفعل' },
        { status: 400 }
      );
    }

    const badge = await db.badge.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn: descriptionEn || description,
        icon: icon || 'Award',
        color: color || '#FFD700',
        type,
        requirement: requirement ? JSON.stringify(requirement) : '{}',
        points: points || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: badge,
      message: 'تم إنشاء البادج بنجاح',
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إنشاء البادج' },
      { status: 500 }
    );
  }
}

// PUT /api/badges - تحديث بادج
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف البادج مطلوب' },
        { status: 400 }
      );
    }

    const badge = await db.badge.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.requirement && { requirement: JSON.stringify(updateData.requirement) }),
      },
    });

    return NextResponse.json({
      success: true,
      data: badge,
      message: 'تم تحديث البادج بنجاح',
    });
  } catch (error) {
    console.error('Error updating badge:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث البادج' },
      { status: 500 }
    );
  }
}

// DELETE /api/badges - حذف بادج (إلغاء تفعيل)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف البادج مطلوب' },
        { status: 400 }
      );
    }

    await db.badge.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء تفعيل البادج بنجاح',
    });
  } catch (error) {
    console.error('Error deleting badge:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في حذف البادج' },
      { status: 500 }
    );
  }
}
