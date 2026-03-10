import nodemailer from 'nodemailer';

// إعداد الناقل
const createTransporter = () => {
  // للإنتاج استخدم SMTP حقيقي
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // للتطوير استخدم Ethereal Email
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'test@ethereal.email',
      pass: 'test',
    },
  });
};

// واجهة البريد
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

// قالب البريد الأساسي
export const getEmailTemplate = (
  title: string,
  content: string,
  buttonText?: string,
  buttonLink?: string
) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }
    body { 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1a365d 0%, #2a4a7d 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #d69e2e;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #fff;
      margin: 10px 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .content h2 {
      color: #1a365d;
      margin: 0 0 20px;
      font-size: 22px;
    }
    .content p {
      color: #4a5568;
      line-height: 1.8;
      margin: 0 0 20px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #d69e2e 0%, #b7791f 100%);
      color: #1a365d !important;
      padding: 15px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      margin: 10px 0;
    }
    .footer {
      background: #f7fafc;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      color: #718096;
      font-size: 14px;
      margin: 5px 0;
    }
    .footer a {
      color: #1a365d;
      text-decoration: none;
    }
    .badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
    }
    .badge-success { background: #c6f6d5; color: #276749; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-info { background: #bee3f8; color: #2b6cb0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>🏆 ECERTIFPRO</h1>
        <p>منصة الشهادات المهنية الإلكترونية</p>
      </div>
      <div class="content">
        <h2>${title}</h2>
        ${content}
        ${buttonText && buttonLink ? `
          <div style="text-align: center;">
            <a href="${buttonLink}" class="button">${buttonText}</a>
          </div>
        ` : ''}
      </div>
      <div class="footer">
        <p><strong>المؤسس:</strong> رضوان دالي حمدوني</p>
        <p><strong>الموقع:</strong> <a href="https://ecertifpro.com">ECERTIFPRO.COM</a></p>
        <p><strong>البريد:</strong> <a href="mailto:almarjaa.project@hotmail.com">almarjaa.project@hotmail.com</a></p>
        <p style="margin-top: 15px; font-size: 12px;">
          © ${new Date().getFullYear()} ECERTIFPRO. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// إرسال بريد
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ECERTIFPRO" <${process.env.SMTP_USER || 'noreply@ecertifpro.com'}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// إرسال بريد ترحيبي
export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  return sendEmail({
    to: email,
    subject: '🎉 مرحباً بك في ECERTIFPRO!',
    html: getEmailTemplate(
      'مرحباً بك! 👋',
      `
        <p>أهلاً <strong>${name}</strong>،</p>
        <p>نحن سعداء بانضمامك إلى مجتمع ECERTIFPRO! يمكنك الآن البدء في رحلتك التعليمية والحصول على شهادات مهنية معتمدة.</p>
        <p>مع ECERTIFPRO ستحصل على:</p>
        <ul style="padding-right: 20px; color: #4a5568;">
          <li>شهادات مهنية معتمدة عالمياً</li>
          <li>اختبارات تفاعلية مع نتائج فورية</li>
          <li>محتوى عربي عالي الجودة</li>
          <li>دعم فني على مدار الساعة</li>
        </ul>
        <p style="margin-top: 20px;">🎁 <strong>عرض خاص:</strong> استخدم كود <span class="badge badge-warning">LAUNCH50</span> للحصول على خصم 50%!</p>
      `,
      'استكشف الشهادات',
      'https://ecertifpro.com/certificates'
    ),
  });
}

// إرسال إشعار شهادة جديدة
export async function sendCertificateEmail(
  email: string,
  name: string,
  certificateTitle: string,
  score: number,
  certificateNumber: string,
  certificateUrl: string
) {
  return sendEmail({
    to: email,
    subject: `🏆 تهانينا! حصلت على شهادة ${certificateTitle}`,
    html: getEmailTemplate(
      'شهادة جديدة! 🎉',
      `
        <p>أهلاً <strong>${name}</strong>،</p>
        <p>تهانينا الحارة! لقد حصلت بنجاح على شهادة:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #2a4a7d 100%); color: white; padding: 20px; border-radius: 12px;">
            <h3 style="margin: 0; color: #d69e2e;">${certificateTitle}</h3>
            <p style="margin: 10px 0 0; opacity: 0.9;">بدرجة ${score}%</p>
          </div>
        </div>
        <p><strong>رقم الشهادة:</strong> <code style="background: #f7fafc; padding: 5px 10px; border-radius: 4px;">${certificateNumber}</code></p>
        <p>يمكنك الآن:</p>
        <ul style="padding-right: 20px; color: #4a5568;">
          <li>تحميل شهادتك بصيغة PDF</li>
          <li>مشاركتها على LinkedIn</li>
          <li>التحقق منها في أي وقت عبر QR Code</li>
        </ul>
      `,
      'عرض الشهادة',
      certificateUrl
    ),
  });
}

// إرسال إشعار دفع ناجح
export async function sendPaymentSuccessEmail(
  email: string,
  name: string,
  amount: number,
  certificateTitle: string,
  paymentId: string
) {
  return sendEmail({
    to: email,
    subject: '✅ تم تأكيد الدفع بنجاح',
    html: getEmailTemplate(
      'تم الدفع بنجاح',
      `
        <p>أهلاً <strong>${name}</strong>،</p>
        <p>تم تأكيد عملية الدفع بنجاح!</p>
        <div style="background: #f7fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0;"><strong>المبلغ:</strong> $${amount}</p>
          <p style="margin: 10px 0 0;"><strong>الشهادة:</strong> ${certificateTitle}</p>
          <p style="margin: 10px 0 0;"><strong>رقم العملية:</strong> <code>${paymentId}</code></p>
        </div>
        <p>يمكنك الآن البدء في الاختبار والحصول على شهادتك.</p>
      `,
      'ابدأ الاختبار',
      'https://ecertifpro.com/dashboard'
    ),
  });
}

// إرسال تذكير بالاختبار
export async function sendExamReminderEmail(
  email: string,
  name: string,
  certificateTitle: string,
  daysLeft: number,
  examUrl: string
) {
  return sendEmail({
    to: email,
    subject: `⏰ تذكير: اختبار ${certificateTitle} ينتظرك`,
    html: getEmailTemplate(
      'تذكير بالاختبار',
      `
        <p>أهلاً <strong>${name}</strong>،</p>
        <p>نود تذكيرك بأن لديك اختبار غير مكتمل:</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-right: 4px solid #f59e0b;">
          <p style="margin: 0;"><strong>${certificateTitle}</strong></p>
          <p style="margin: 10px 0 0; color: #92400e;">متبقي ${daysLeft} أيام</p>
        </div>
        <p>أكمل اختبارك واحصل على شهادتك المهنية!</p>
      `,
      'أكمل الاختبار الآن',
      examUrl
    ),
  });
}

// إرسال إشعار إنجاز جديد
export async function sendAchievementEmail(
  email: string,
  name: string,
  achievementTitle: string,
  points: number,
  newLevel?: string
) {
  return sendEmail({
    to: email,
    subject: `🏆 إنجاز جديد: ${achievementTitle}`,
    html: getEmailTemplate(
      'إنجاز جديد! 🎉',
      `
        <p>أهلاً <strong>${name}</strong>،</p>
        <p>تهانينا! حصلت على إنجاز جديد:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: linear-gradient(135deg, #805ad5 0%, #6b46c1 100%); color: white; padding: 25px; border-radius: 12px;">
            <h3 style="margin: 0; color: #faf089;">🏆 ${achievementTitle}</h3>
            <p style="margin: 10px 0 0; font-size: 24px;">+${points} نقطة</p>
            ${newLevel ? `<p style="margin: 10px 0 0; opacity: 0.9;">وصلت لمستوى: ${newLevel}</p>` : ''}
          </div>
        </div>
        <p>استمر في التعلم واحصل على المزيد من الإنجازات!</p>
      `,
      'عرض إنجازاتي',
      'https://ecertifpro.com/dashboard'
    ),
  });
}

// إرسال بريد جماعي
export async function sendBulkEmails(
  emails: string[],
  subject: string,
  html: string
) {
  const results = await Promise.all(
    emails.map(email => sendEmail({ to: email, subject, html }))
  );

  return {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
  };
}
