import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/notifications - جلب إشعارات المستخدم
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.notification.count({ where: { userId } }),
      db.notification.count({ where: { userId, isRead: false } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        total,
        unreadCount,
        hasMore: total > offset + limit,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - إنشاء إشعار جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, message, type, link, data } = body;

    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification = await db.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
        data: data ? JSON.stringify(data) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - تحديث حالة الإشعار
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, markAllRead, userId } = body;

    // تحديد الكل كمقروء
    if (markAllRead && userId) {
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    // تحديث إشعار واحد
    if (notificationId) {
      const notification = await db.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: notification,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Missing notificationId or userId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - حذف إشعار
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const clearAll = searchParams.get('clearAll') === 'true';

    // حذف جميع الإشعارات
    if (clearAll && userId) {
      await db.notification.deleteMany({
        where: { userId },
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications deleted',
      });
    }

    // حذف إشعار واحد
    if (notificationId) {
      await db.notification.delete({
        where: { id: notificationId },
      });

      return NextResponse.json({
        success: true,
        message: 'Notification deleted',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Missing id or userId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
