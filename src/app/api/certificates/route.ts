import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/certificates - الحصول على جميع الشهادات
export async function GET() {
  try {
    console.log('[API] Fetching certificates from database...');
    
    const certificates = await db.certificate.findMany({
      where: { isActive: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    console.log(`[API] Found ${certificates.length} active certificates`);

    // تحويل skills من JSON string إلى array
    const formattedCertificates = certificates.map(cert => ({
      ...cert,
      skills: typeof cert.skills === 'string' ? JSON.parse(cert.skills) : cert.skills || [],
    }));

    return NextResponse.json({
      success: true,
      data: formattedCertificates,
      count: formattedCertificates.length,
    });
  } catch (error) {
    console.error('[API] Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/certificates - إنشاء شهادة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const certificate = await db.certificate.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        category: body.category,
        price: body.price,
        originalPrice: body.originalPrice,
        duration: body.duration,
        level: body.level,
        skills: JSON.stringify(body.skills),
        passingScore: body.passingScore || 70,
        totalQuestions: body.totalQuestions,
        examDuration: body.examDuration,
        featured: body.featured || false,
        image: body.image,
      },
    });

    return NextResponse.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}
