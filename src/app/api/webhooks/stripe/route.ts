import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Stripe Webhook Handler
export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const sig = request.headers.get('stripe-signature');

    // في الإنتاج، يجب التحقق من التوقيع
    // const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    
    const event = JSON.parse(payload);

    // معالجة أنواع مختلفة من الأحداث
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const paymentId = session.metadata?.paymentId;
        const userId = session.metadata?.userId;
        const certificateId = session.metadata?.certificateId;

        if (paymentId) {
          // تحديث حالة الدفع
          await db.payment.update({
            where: { id: paymentId },
            data: {
              status: 'completed',
              stripePaymentId: session.payment_intent,
            },
          });

          // إذا كان هناك شهادة، يمكن إنشاؤها هنا
          // أو الانتظار حتى يكمل المستخدم الاختبار
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        // تحديث حالة الدفع إذا لزم الأمر
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // تحديث حالة الدفع إلى failed
        const sessionId = paymentIntent.metadata?.sessionId;
        if (sessionId) {
          await db.payment.updateMany({
            where: { stripeSessionId: sessionId },
            data: { status: 'failed' },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
