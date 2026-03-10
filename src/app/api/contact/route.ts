import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// GET: جلب جميع رسائل التواصل (للأدمن)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الرسائل' },
      { status: 500 }
    );
  }
}

// ============================================
// POST: إرسال رسالة تواصل جديدة
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, category } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    // إنشاء الرسالة
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        category: category || 'general',
        status: 'new',
      },
    });

    return NextResponse.json({
      success: true,
      data: contactMessage,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إرسال الرسالة' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT: تحديث حالة الرسالة (للأدمن)
// ============================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الرسالة مطلوب' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status === 'read') updateData.readAt = new Date();
    if (status === 'replied') updateData.repliedAt = new Date();

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث الرسالة' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE: حذف رسالة (للأدمن)
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الرسالة مطلوب' },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح',
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في حذف الرسالة' },
      { status: 500 }
    );
  }
}
