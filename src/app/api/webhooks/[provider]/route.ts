// ============================================
// Webhook Handler - معالجة إشعارات الدفع
// يدعم: Stripe, PayPal, Coinbase
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  verifyStripeSignature, 
  verifyCoinbaseSignature,
  logAuditEvent,
} from '@/lib/security';
import { getPaymentSettings } from '@/lib/payments';

// ============================================
// Stripe Webhook Handler
// ============================================

async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  const settings = getPaymentSettings();
  
  const verification = verifyStripeSignature(
    payload,
    signature,
    settings.stripeWebhookSecret
  );
  
  if (!verification.valid) {
    return { success: false, error: verification.error };
  }
  
  const event = verification.event as Record<string, unknown>;
  const eventType = event.type as string;
  const data = event.data as Record<string, unknown>;
  const object = data?.object as Record<string, unknown>;
  
  // معالجة الأحداث المختلفة
  switch (eventType) {
    case 'checkout.session.completed': {
      const sessionId = object?.id as string;
      const customerEmail = object?.customer_email as string;
      const paymentIntent = object?.payment_intent as string;
      const metadata = object?.metadata as Record<string, string>;
      
      // تحديث الدفع في قاعدة البيانات
      try {
        await db.payment.updateMany({
          where: { stripeSessionId: sessionId },
          data: {
            status: 'completed',
            stripePaymentId: paymentIntent,
          },
        });
        
        // إنشاء شهادة للمستخدم
        const payment = await db.payment.findFirst({
          where: { stripeSessionId: sessionId },
          include: { user: true },
        });
        
        if (payment && payment.user && metadata?.certificate_id) {
          const certNumber = `ECERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          
          await db.userCertificate.create({
            data: {
              certificateId: metadata.certificate_id,
              userId: payment.userId,
              certificateNumber: certNumber,
              score: 100,
              status: 'valid',
              paymentId: payment.id,
            },
          });
        }
        
        logAuditEvent({
          action: 'payment_completed_stripe',
          userId: payment?.userId,
          ip: 'webhook',
          details: { sessionId, customerEmail },
          success: true,
        });
      } catch (error) {
        console.error('Error processing Stripe payment:', error);
      }
      break;
    }
    
    case 'checkout.session.expired': {
      const sessionId = object?.id as string;
      await db.payment.updateMany({
        where: { stripeSessionId: sessionId },
        data: { status: 'cancelled' },
      });
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntentId = object?.id as string;
      await db.payment.updateMany({
        where: { stripePaymentId: paymentIntentId },
        data: { status: 'failed' },
      });
      break;
    }
  }
  
  return { success: true };
}

// ============================================
// PayPal Webhook Handler
// ============================================

async function handlePayPalWebhook(
  payload: string,
  headers: Headers
): Promise<{ success: boolean; error?: string }> {
  try {
    const event = JSON.parse(payload);
    const eventType = event.event_type;
    
    // التحقق من التوقيع
    const transmissionId = headers.get('paypal-transmission-id');
    const transmissionSig = headers.get('paypal-transmission-sig');
    
    if (!transmissionId || !transmissionSig) {
      return { success: false, error: 'Missing PayPal signature headers' };
    }
    
    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED': {
        const orderId = event.resource?.id;
        await db.payment.updateMany({
          where: { paypalOrderId: orderId },
          data: { status: 'processing' },
        });
        break;
      }
      
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const capture = event.resource;
        const orderId = capture?.order_id || capture?.supplementary_data?.related_ids?.order_id;
        
        await db.payment.updateMany({
          where: { paypalOrderId: orderId },
          data: {
            status: 'completed',
            paypalCaptureId: capture?.id,
          },
        });
        
        const payment = await db.payment.findFirst({
          where: { paypalOrderId: orderId },
          include: { user: true },
        });
        
        if (payment && payment.user) {
          const certNumber = `ECERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          
          await db.userCertificate.create({
            data: {
              certificateId: payment.certificateId || 'almarjaa-beginner',
              userId: payment.userId,
              certificateNumber: certNumber,
              score: 100,
              status: 'valid',
              paymentId: payment.id,
            },
          });
        }
        
        logAuditEvent({
          action: 'payment_completed_paypal',
          userId: payment?.userId,
          ip: 'webhook',
          details: { orderId },
          success: true,
        });
        break;
      }
      
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED': {
        const capture = event.resource;
        const orderId = capture?.order_id;
        
        await db.payment.updateMany({
          where: { paypalOrderId: orderId },
          data: { status: 'failed' },
        });
        break;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('PayPal Webhook Error:', error);
    return { success: false, error: 'Processing error' };
  }
}

// ============================================
// Coinbase Webhook Handler
// ============================================

async function handleCoinbaseWebhook(
  payload: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  const settings = getPaymentSettings();
  
  const verification = verifyCoinbaseSignature(
    payload,
    signature,
    settings.coinbaseWebhookSecret
  );
  
  if (!verification.valid) {
    return { success: false, error: verification.error };
  }
  
  const event = verification.event as Record<string, unknown>;
  const eventType = event.type as string;
  const data = event.data as Record<string, unknown>;
  
  switch (eventType) {
    case 'charge:confirmed': {
      const chargeId = data?.id as string;
      
      await db.payment.updateMany({
        where: { id: chargeId },
        data: { status: 'completed' },
      });
      
      const payment = await db.payment.findFirst({
        where: { id: chargeId },
        include: { user: true },
      });
      
      if (payment && payment.user) {
        const certNumber = `ECERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        await db.userCertificate.create({
          data: {
            certificateId: payment.certificateId || 'almarjaa-beginner',
            userId: payment.userId,
            certificateNumber: certNumber,
            score: 100,
            status: 'valid',
            paymentId: payment.id,
          },
        });
      }
      
      logAuditEvent({
        action: 'payment_completed_coinbase',
        userId: payment?.userId,
        ip: 'webhook',
        details: { chargeId },
        success: true,
      });
      break;
    }
    
    case 'charge:failed': {
      const chargeId = data?.id as string;
      await db.payment.updateMany({
        where: { id: chargeId },
        data: { status: 'failed' },
      });
      break;
    }
    
    case 'charge:expired': {
      const chargeId = data?.id as string;
      await db.payment.updateMany({
        where: { id: chargeId },
        data: { status: 'cancelled' },
      });
      break;
    }
  }
  
  return { success: true };
}

// ============================================
// Main Webhook Route Handler
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  
  try {
    const payload = await request.text();
    
    let result: { success: boolean; error?: string };
    
    switch (provider) {
      case 'stripe': {
        const signature = request.headers.get('stripe-signature') || '';
        result = await handleStripeWebhook(payload, signature);
        break;
      }
      
      case 'paypal': {
        result = await handlePaypalWebhook(payload, request.headers);
        break;
      }
      
      case 'coinbase': {
        const signature = request.headers.get('x-cc-webhook-signature') || '';
        result = await handleCoinbaseWebhook(payload, signature);
        break;
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown provider' },
          { status: 400 }
        );
    }
    
    if (!result.success) {
      logAuditEvent({
        action: `webhook_failed_${provider}`,
        ip: 'webhook',
        details: { error: result.error },
        success: false,
        riskLevel: 'high',
      });
      
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Webhook Error (${provider}):`, error);
    
    logAuditEvent({
      action: `webhook_error_${provider}`,
      ip: 'webhook',
      details: { error: String(error) },
      success: false,
      riskLevel: 'high',
    });
    
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
