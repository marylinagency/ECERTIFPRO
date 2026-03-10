import { NextResponse } from 'next/server';

// تخزين اشتراكات Push (في الإنتاج استخدم قاعدة البيانات)
const pushSubscriptions = new Map<string, any[]>();

// إضافة اشتراك جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, subscription, notification } = body;

    switch (action) {
      case 'subscribe':
        // إضافة اشتراك جديد
        if (!pushSubscriptions.has(userId)) {
          pushSubscriptions.set(userId, []);
        }
        pushSubscriptions.get(userId)!.push(subscription);
        
        return NextResponse.json({
          success: true,
          message: 'Subscription saved',
        });

      case 'unsubscribe':
        // إزالة اشتراك
        const subs = pushSubscriptions.get(userId);
        if (subs) {
          const index = subs.findIndex(s => s.endpoint === subscription?.endpoint);
          if (index > -1) {
            subs.splice(index, 1);
          }
        }
        
        return NextResponse.json({
          success: true,
          message: 'Subscription removed',
        });

      case 'send':
        // إرسال إشعار
        const userSubs = pushSubscriptions.get(userId);
        if (!userSubs || userSubs.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'No subscriptions found',
          });
        }

        // في الإنتاج، استخدم web-push library
        // هنا نحاكي الإرسال
        let sent = 0;
        for (const sub of userSubs) {
          try {
            // إرسال فعلي عبر web-push
            // await webpush.sendNotification(sub, JSON.stringify(notification));
            sent++;
          } catch (error) {
            console.error('Failed to send push:', error);
          }
        }

        return NextResponse.json({
          success: sent > 0,
          sent,
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error handling push:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to handle push request' },
      { status: 500 }
    );
  }
}

// الحصول على اشتراكات المستخدم
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId is required' },
      { status: 400 }
    );
  }

  const subs = pushSubscriptions.get(userId) || [];
  
  return NextResponse.json({
    success: true,
    count: subs.length,
    subscriptions: subs.map(s => ({ endpoint: s.endpoint })),
  });
}
