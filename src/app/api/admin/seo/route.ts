import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { startsWith: 'seo_' } }
    });
    const seoSettings: Record<string, string> = {};
    settings.forEach(s => {
      seoSettings[s.key.replace('seo_', '')] = s.value;
    });
    return NextResponse.json({ settings: seoSettings });
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json({ error: 'حدث خطأ في جلب الإعدادات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const savePromises = Object.entries(data).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key: `seo_${key}` },
        update: { value: String(value) },
        create: { key: `seo_${key}`, value: String(value) }
      });
    });
    await Promise.all(savePromises);
    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    console.error('Error saving SEO settings:', error);
    return NextResponse.json({ error: 'حدث خطأ في حفظ الإعدادات' }, { status: 500 });
  }
}
