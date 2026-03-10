import { NextResponse } from 'next/server';
import { sendEmail, getEmailTemplate } from '@/lib/email';

// إرسال إشعار بالبريد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, name, certificateTitle, score, certificateNumber, amount, daysLeft } = body;

    let result;

    switch (action) {
      case 'welcome':
        result = await sendEmail({
          to: email,
          subject: '🎉 مرحباً بك في ECERTIFPRO!',
          html: getEmailTemplate(
            'مرحباً بك! 👋',
            `<p>أهلاً <strong>${name}</strong>،</p>
             <p>نحن سعداء بانضمامك إلى مجتمع ECERTIFPRO!</p>
             <p>يمكنك الآن البدء في رحلتك التعليمية والحصول على شهادات مهنية معتمدة.</p>`,
            'استكشف الشهادات',
            'https://ecertifpro.com/certificates'
          ),
        });
        break;

      case 'certificate':
        result = await sendEmail({
          to: email,
          subject: `🏆 تهانينا! حصلت على شهادة ${certificateTitle}`,
          html: getEmailTemplate(
            'شهادة جديدة! 🎉',
            `<p>أهلاً <strong>${name}</strong>،</p>
             <p>تهانينا! حصلت على شهادة <strong>${certificateTitle}</strong> بدرجة ${score}%</p>
             <p>رقم الشهادة: <code>${certificateNumber}</code></p>`,
            'عرض الشهادة',
            `https://ecertifpro.com/certificate/${certificateNumber}`
          ),
        });
        break;

      case 'payment':
        result = await sendEmail({
          to: email,
          subject: '✅ تم تأكيد الدفع بنجاح',
          html: getEmailTemplate(
            'تم الدفع بنجاح',
            `<p>أهلاً <strong>${name}</strong>،</p>
             <p>تم تأكيد عملية الدفع بنجاح!</p>
             <p>المبلغ: $${amount}</p>
             <p>الشهادة: ${certificateTitle}</p>`,
            'لوحة التحكم',
            'https://ecertifpro.com/dashboard'
          ),
        });
        break;

      case 'reminder':
        result = await sendEmail({
          to: email,
          subject: `⏰ تذكير: اختبار ${certificateTitle} ينتظرك`,
          html: getEmailTemplate(
            'تذكير بالاختبار',
            `<p>أهلاً <strong>${name}</strong>،</p>
             <p>لديك اختبار غير مكتمل: <strong>${certificateTitle}</strong></p>
             <p>متبقي ${daysLeft} أيام</p>`,
            'أكمل الاختبار',
            'https://ecertifpro.com/exam/' + certificateTitle
          ),
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
