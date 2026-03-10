import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

// توليد رقم شهادة فريد
function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CERT-${timestamp}-${random}`;
}

// إنشاء شهادة PDF
async function generateCertificatePDF(data: {
  certificateNumber: string;
  userName: string;
  certificateTitle: string;
  certificateTitleEn: string;
  score: number;
  issueDate: Date;
  qrCodeDataUrl: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      const stream = new PassThrough();
      
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);

      doc.pipe(stream);

      // الخلفية
      doc.rect(0, 0, doc.page.width, doc.page.height)
        .fillColor('#F8FAFC')
        .fill();

      // الإطار الخارجي
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .strokeColor('#1E3A5F')
        .lineWidth(3)
        .stroke();

      // الإطار الداخلي المزخرف
      doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70)
        .strokeColor('#D4AF37')
        .lineWidth(2)
        .stroke();

      // الشريط العلوي
      doc.rect(50, 50, doc.page.width - 100, 60)
        .fillColor('#1E3A5F')
        .fill();

      // عنوان المنصة
      doc.fillColor('#D4AF37')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('ECERTIFPRO', 0, 60, { 
          align: 'center',
          width: doc.page.width 
        });

      doc.fillColor('#FFFFFF')
        .fontSize(12)
        .font('Helvetica')
        .text('Professional Certification Platform | منصة الشهادات المهنية', 0, 85, { 
          align: 'center',
          width: doc.page.width 
        });

      // عنوان الشهادة
      doc.fillColor('#1E3A5F')
        .fontSize(36)
        .font('Helvetica-Bold')
        .text('CERTIFICATE', 0, 130, { 
          align: 'center',
          width: doc.page.width 
        });

      doc.fillColor('#1E3A5F')
        .fontSize(20)
        .font('Helvetica')
        .text('شهادة إتمام', 0, 165, { 
          align: 'center',
          width: doc.page.width 
        });

      // خط فاصل مزخرف
      doc.moveTo(doc.page.width / 2 - 150, 195)
        .lineTo(doc.page.width / 2 + 150, 195)
        .strokeColor('#D4AF37')
        .lineWidth(2)
        .stroke();

      // اسم المستخدم
      doc.fillColor('#000000')
        .fontSize(14)
        .font('Helvetica')
        .text('This is to certify that', 0, 210, { 
          align: 'center',
          width: doc.page.width 
        });

      doc.fillColor('#1E3A5F')
        .fontSize(32)
        .font('Helvetica-Bold')
        .text(data.userName, 0, 235, { 
          align: 'center',
          width: doc.page.width 
        });

      // نص الإنجاز
      doc.fillColor('#000000')
        .fontSize(14)
        .font('Helvetica')
        .text('has successfully completed the', 0, 280, { 
          align: 'center',
          width: doc.page.width 
        });

      // اسم الشهادة
      doc.fillColor('#D4AF37')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text(data.certificateTitle, 0, 305, { 
          align: 'center',
          width: doc.page.width 
        });

      doc.fillColor('#666666')
        .fontSize(14)
        .font('Helvetica-Oblique')
        .text(data.certificateTitleEn, 0, 335, { 
          align: 'center',
          width: doc.page.width 
        });

      // الدرجة
      const scoreText = data.score === 100 ? 'Perfect Score' : `Score: ${data.score}%`;
      doc.fillColor('#1E3A5F')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(scoreText, 0, 365, { 
          align: 'center',
          width: doc.page.width 
        });

      // التاريخ ورقم الشهادة
      const issueDateStr = data.issueDate.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.fillColor('#000000')
        .fontSize(11)
        .font('Helvetica')
        .text(`Issue Date: ${data.issueDate.toISOString().split('T')[0]} | تاريخ الإصدار: ${issueDateStr}`, 0, 400, { 
          align: 'center',
          width: doc.page.width 
        });

      doc.fillColor('#666666')
        .fontSize(10)
        .text(`Certificate ID: ${data.certificateNumber}`, 0, 420, { 
          align: 'center',
          width: doc.page.width 
        });

      // إضافة QR Code
      const qrImageBuffer = Buffer.from(data.qrCodeDataUrl.split(',')[1], 'base64');
      doc.image(qrImageBuffer, doc.page.width - 130, doc.page.height - 130, { 
        width: 80, 
        height: 80 
      });

      // نص التحقق
      doc.fillColor('#666666')
        .fontSize(8)
        .text('Scan to verify', doc.page.width - 125, doc.page.height - 45, {
          width: 70,
          align: 'center'
        });

      // التوقيع
      doc.moveTo(80, doc.page.height - 100)
        .lineTo(200, doc.page.height - 100)
        .strokeColor('#1E3A5F')
        .lineWidth(1)
        .stroke();

      doc.fillColor('#1E3A5F')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Authorized Signature', 80, doc.page.height - 95, {
          width: 120,
          align: 'center'
        });

      doc.fillColor('#666666')
        .fontSize(8)
        .font('Helvetica')
        .text('ECERTIFPRO Administration', 80, doc.page.height - 80, {
          width: 120,
          align: 'center'
        });

      // الفوتر
      doc.fillColor('#999999')
        .fontSize(8)
        .text('This certificate is verified and authenticated by ECERTIFPRO.COM', 0, doc.page.height - 35, {
          align: 'center',
          width: doc.page.width
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// POST /api/certificates/generate - توليد شهادة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, certificateId, score, paymentId } = body;

    if (!userId || !certificateId || score === undefined) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من المستخدم
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من الشهادة
    const certificate = await db.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'الشهادة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من النجاح
    if (score < certificate.passingScore) {
      return NextResponse.json(
        { success: false, error: `الدرجة المطلوبة للنجاح: ${certificate.passingScore}%` },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود شهادة سابقة
    const existingCert = await db.userCertificate.findFirst({
      where: { userId, certificateId },
    });

    if (existingCert) {
      return NextResponse.json(
        { success: false, error: 'لديك شهادة سابقة في هذا المجال' },
        { status: 400 }
      );
    }

    // توليد رقم الشهادة
    const certificateNumber = generateCertificateNumber();

    // إنشاء رابط التحقق
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certificateNumber}`;

    // توليد QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1E3A5F',
        light: '#FFFFFF'
      }
    });

    // إنشاء سجل الشهادة
    const userCertificate = await db.userCertificate.create({
      data: {
        userId,
        certificateId,
        certificateNumber,
        score,
        status: 'valid',
        paymentId: paymentId || null,
      },
    });

    // توليد PDF
    const pdfBuffer = await generateCertificatePDF({
      certificateNumber,
      userName: user.name || user.email,
      certificateTitle: certificate.title,
      certificateTitleEn: certificate.titleEn,
      score,
      issueDate: userCertificate.issueDate,
      qrCodeDataUrl,
    });

    // تحديث نقاط المستخدم
    const pointsEarned = score === 100 ? 100 : Math.floor(score);
    await db.user.update({
      where: { id: userId },
      data: {
        points: { increment: pointsEarned },
      },
    });

    // التحقق من البادج
    await checkAndAwardBadges(userId);

    // إرسال إشعار
    await db.notification.create({
      data: {
        userId,
        title: 'تهانينا! حصلت على شهادة جديدة',
        message: `لقد حصلت على شهادة "${certificate.title}" بدرجة ${score}%`,
        type: 'certificate',
        link: `/certificate/${userCertificate.id}`,
      },
    });

    // إرجاع PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء توليد الشهادة' },
      { status: 500 }
    );
  }
}

// دالة التحقق من البادج ومنحها
async function checkAndAwardBadges(userId: string) {
  try {
    // الحصول على عدد شهادات المستخدم
    const userCerts = await db.userCertificate.findMany({
      where: { userId },
      include: {
        certificate: { select: { level: true } },
      },
    });

    const certCount = userCerts.length;
    const levels = [...new Set(userCerts.map(uc => uc.certificate.level))];
    const hasPerfectScore = userCerts.some(uc => uc.score === 100);

    // التحقق من وجود البادج
    const allBadges = await db.badge.findMany({
      where: { isActive: true },
    });

    const userBadges = await db.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });

    const earnedBadgeIds = userBadges.map(ub => ub.badgeId);

    // البادج المطلوب التحقق منها
    const badgeChecks = [
      { type: 'first_certificate', condition: certCount >= 1 },
      { type: 'certificates_5', condition: certCount >= 5 },
      { type: 'certificates_10', condition: certCount >= 10 },
      { type: 'all_levels', condition: levels.length >= 4 }, // مبتدئ، متوسط، متقدم، خبير
      { type: 'perfect_score', condition: hasPerfectScore },
    ];

    for (const check of badgeChecks) {
      const badge = allBadges.find(b => b.type === check.type);
      if (badge && check.condition && !earnedBadgeIds.includes(badge.id)) {
        await db.userBadge.create({
          data: { userId, badgeId: badge.id },
        });

        // إضافة النقاط
        await db.user.update({
          where: { id: userId },
          data: { points: { increment: badge.points } },
        });

        // إرسال إشعار
        await db.notification.create({
          data: {
            userId,
            title: 'حصلت على بادج جديد!',
            message: `مبروك! لقد حصلت على بادج "${badge.name}"`,
            type: 'achievement',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}
