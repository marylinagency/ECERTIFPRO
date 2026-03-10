import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// معلومات الشهادات (للاستخدام بدون قاعدة بيانات)
const CERTIFICATES_PRICES: Record<string, { price: number; title: string }> = {
  'almarjaa-developer': { price: 199, title: 'مطور Al-Marjaa المعتمد' },
  'ai-expert-arabic': { price: 299, title: 'خبير AI بالعربية' },
  'web-developer-pro': { price: 249, title: 'مطور ويب محترف' },
  'data-analyst': { price: 279, title: 'محلل بيانات معتمد' },
  'cybersecurity-expert': { price: 349, title: 'خبير أمن سيبراني' },
};

// GET /api/payments - الحصول على المدفوعات
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const paymentId = searchParams.get('id');

    if (paymentId) {
      const payment = await db.payment.findUnique({
        where: { id: paymentId },
        include: { user: true, certificate: true },
      });

      if (!payment) {
        return NextResponse.json(
          { success: false, error: 'Payment not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: payment });
    }

    if (userId) {
      const payments = await db.payment.findMany({
        where: { userId },
        include: { certificate: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, data: payments });
    }

    const payments = await db.payment.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST /api/payments - إنشاء جلسة دفع
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, certificateId, email, name } = body;

    // الحصول على معلومات الشهادة
    const certInfo = CERTIFICATES_PRICES[certificateId];
    if (!certInfo) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // إنشاء أو الحصول على المستخدم
    let user;
    if (userId) {
      user = await db.user.findUnique({ where: { id: userId } });
    }
    
    if (!user && email) {
      user = await db.user.upsert({
        where: { email },
        create: { email, name: name || email.split('@')[0] },
        update: { name: name || undefined },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 400 }
      );
    }

    // إنشاء سجل دفع
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        certificateId: null,
        amount: certInfo.price,
        currency: 'USD',
        status: 'pending',
        paymentMethod: 'stripe',
      },
    });

    // إعداد Stripe Checkout Session
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      // إذا لم يكن Stripe متوفراً، نرجع معلومات للدفع التجريبي
      return NextResponse.json({
        success: true,
        data: {
          paymentId: payment.id,
          amount: certInfo.price,
          currency: 'USD',
          certificateId,
          certificateTitle: certInfo.title,
          mode: 'demo', // وضع تجريبي
          checkoutUrl: `/checkout/demo?paymentId=${payment.id}&certificateId=${certificateId}`,
        },
      });
    }

    // إنشاء Stripe Checkout Session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[][price_data][currency]': 'usd',
        'line_items[][price_data][product_data][name]': certInfo.title,
        'line_items[][price_data][product_data][description]': `شهادة مهنية من ECERTIFPRO`,
        'line_items[][price_data][unit_amount]': Math.round(certInfo.price * 100).toString(),
        'line_items[][quantity]': '1',
        'mode': 'payment',
        'success_url': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?paymentId=${payment.id}`,
        'cancel_url': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel?paymentId=${payment.id}`,
        'metadata[paymentId]': payment.id,
        'metadata[userId]': user.id,
        'metadata[certificateId]': certificateId,
        'customer_email': user.email,
      }),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe error:', session);
      return NextResponse.json(
        { success: false, error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    // تحديث سجل الدفع بـ Stripe Session ID
    await db.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        sessionId: session.id,
        checkoutUrl: session.url,
      },
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// PUT /api/payments - تحديث حالة الدفع
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, status, stripePaymentId } = body;

    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status,
        stripePaymentId,
      },
    });

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}
