// ============================================
// Payments API - مع حماية أمنية متقدمة
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  checkRateLimit,
  rateLimitConfigs,
  getClientIP,
  logAuditEvent,
  validateEmail,
  validateName,
  sanitizeInput,
  getSecurityHeaders,
  checkPaymentFraud,
  generateOrderId,
  getSecurityHeaders as getHeaders,
} from '@/lib/security';
import {
  createPayment,
  getCertificatePrice,
  getAvailableProviders,
  isProviderConfigured,
  PaymentProvider,
  Currency,
} from '@/lib/payments';

// الحصول على المدفوعات
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    // Rate limiting
    const rateLimit = checkRateLimit(`payments-get:${ip}`, rateLimitConfigs.api);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: 'طلبات كثيرة' }, { status: 429 });
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const paymentId = searchParams.get('id');
    
    if (paymentId) {
      const payment = await db.payment.findUnique({
        where: { id: paymentId },
        include: { user: true },
      });
      
      if (!payment) {
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
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
    return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// إنشاء جلسة دفع جديدة
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    
    // Rate limiting
    const rateLimit = checkRateLimit(`payments-create:${ip}`, rateLimitConfigs.payment);
    if (!rateLimit.allowed) {
      logAuditEvent({
        action: 'payment_rate_limited',
        ip,
        userAgent,
        details: {},
        success: false,
        riskLevel: 'medium',
      });
      
      return NextResponse.json(
        { success: false, error: 'طلبات كثيرة، يرجى المحاولة لاحقاً' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { 
      userId, 
      certificateId, 
      email, 
      name, 
      provider = 'stripe',
      currency = 'USD',
      successUrl,
      cancelUrl,
    } = body;
    
    // التحقق من صحة البيانات
    if (!certificateId) {
      return NextResponse.json(
        { success: false, error: 'معرف الشهادة مطلوب' },
        { status: 400 }
      );
    }
    
    if (!email || !validateEmail(email).valid) {
      return NextResponse.json(
        { success: false, error: validateEmail(email).error || 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }
    
    if (!name || !validateName(name).valid) {
      return NextResponse.json(
        { success: false, error: 'الاسم غير صالح' },
        { status: 400 }
      );
    }
    
    // التحقق من المزود
    const paymentProvider = provider as PaymentProvider;
    if (!isProviderConfigured(paymentProvider)) {
      return NextResponse.json(
        { success: false, error: 'بوابة الدفع غير مُعدة' },
        { status: 400 }
      );
    }
    
    // الحصول على معلومات الشهادة
    const certInfo = getCertificatePrice(certificateId);
    if (!certInfo.price) {
      return NextResponse.json(
        { success: false, error: 'الشهادة غير موجودة' },
        { status: 404 }
      );
    }
    
    // فحص الاحتيال
    const fraudCheck = checkPaymentFraud({
      amount: certInfo.price,
      currency,
      email: sanitizeInput(email),
      ip,
      userId,
      userAgent,
    });
    
    if (fraudCheck.risk === 'critical') {
      logAuditEvent({
        action: 'payment_fraud_blocked',
        ip,
        userAgent,
        details: { email, certificateId, flags: fraudCheck.flags },
        success: false,
        riskLevel: 'critical',
      });
      
      return NextResponse.json(
        { success: false, error: 'تم رفض المعاملة لأسباب أمنية' },
        { status: 403 }
      );
    }
    
    // إنشاء أو الحصول على المستخدم
    let user;
    if (userId) {
      user = await db.user.findUnique({ where: { id: userId } });
    }
    
    if (!user && email) {
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedName = sanitizeInput(name);
      
      user = await db.user.upsert({
        where: { email: sanitizedEmail },
        create: { 
          email: sanitizedEmail, 
          name: sanitizedName,
          level: 'مبتدئ',
          points: 0,
          role: 'user',
        },
        update: { name: sanitizedName },
      });
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'خطأ في إنشاء المستخدم' },
        { status: 400 }
      );
    }
    
    // إنشاء معرف الطلب
    const orderId = generateOrderId('PAY');
    
    // إنشاء سجل دفع
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        certificateId,
        amount: certInfo.price,
        currency,
        status: 'pending',
        paymentMethod: paymentProvider,
        metadata: JSON.stringify({
          originalPrice: certInfo.originalPrice,
          certificateTitle: certInfo.title,
          orderId,
        }),
      },
    });
    
    // إنشاء جلسة الدفع
    const paymentResult = await createPayment({
      orderId,
      provider: paymentProvider,
      amount: certInfo.price,
      currency: currency as Currency,
      customer: {
        name: user.name || name,
        email: user.email,
        userId: user.id,
      },
      items: [{
        id: certificateId,
        name: certInfo.title,
        description: `شهادة ${certInfo.title} من ECERTIFPRO`,
        amount: certInfo.price,
        quantity: 1,
      }],
      metadata: {
        payment_id: payment.id,
        certificate_id: certificateId,
        user_id: user.id,
      },
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?paymentId=${payment.id}`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?paymentId=${payment.id}`,
    });
    
    if (!paymentResult.success) {
      // تحديث حالة الدفع إلى فشل
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
      
      logAuditEvent({
        action: 'payment_session_failed',
        userId: user.id,
        ip,
        details: { error: paymentResult.error, certificateId },
        success: false,
      });
      
      return NextResponse.json(
        { success: false, error: paymentResult.error || 'فشل في إنشاء جلسة الدفع' },
        { status: 400 }
      );
    }
    
    // تحديث سجل الدفع مع معرف الجلسة
    await db.payment.update({
      where: { id: payment.id },
      data: {
        stripeSessionId: paymentResult.paymentId,
      },
    });
    
    logAuditEvent({
      action: 'payment_session_created',
      userId: user.id,
      ip,
      details: {
        paymentId: payment.id,
        provider: paymentProvider,
        amount: certInfo.price,
        currency,
        certificateId,
        fraudRisk: fraudCheck.risk,
      },
      success: true,
    });
    
    const response = NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        sessionId: paymentResult.paymentId,
        checkoutUrl: paymentResult.checkoutUrl,
        clientSecret: paymentResult.clientSecret,
        qrCode: paymentResult.qrCode,
      },
    });
    
    // إضافة headers أمنية
    for (const [key, value] of Object.entries(getSecurityHeaders())) {
      response.headers.set(key, value);
    }
    
    return response;
  } catch (error) {
    console.error('Error creating payment:', error);
    
    logAuditEvent({
      action: 'payment_error',
      ip: getClientIP(request),
      details: { error: String(error) },
      success: false,
      riskLevel: 'high',
    });
    
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إنشاء الدفع' },
      { status: 500 }
    );
  }
}

// تحديث حالة الدفع
export async function PUT(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    // Rate limiting
    const rateLimit = checkRateLimit(`payments-put:${ip}`, rateLimitConfigs.api);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: 'طلبات كثيرة' }, { status: 429 });
    }
    
    const body = await request.json();
    const { paymentId, status, stripePaymentId } = body;
    
    if (!paymentId) {
      return NextResponse.json({ success: false, error: 'معرف الدفع مطلوب' }, { status: 400 });
    }
    
    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status,
        stripePaymentId,
      },
    });
    
    logAuditEvent({
      action: 'payment_updated',
      ip,
      details: { paymentId, status },
      success: true,
    });
    
    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to update payment' }, { status: 500 });
  }
}
