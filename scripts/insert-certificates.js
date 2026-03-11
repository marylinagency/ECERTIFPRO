#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function insertCertificates() {
  try {
    console.log('🔄 بدء إدراج الشهادات...\n');

    const certificates = [
      {
        id: 'almarjaa-beginner',
        title: 'مبتدئ لغة المرجع',
        titleEn: 'Al-Marjaa Language Beginner',
        description: 'شهادة تمهيدية في أساسيات لغة المرجع - أول لغة برمجة عربية متكاملة مع الذكاء الاصطناعي.',
        category: 'برمجة',
        price: 49,
        originalPrice: 99,
        duration: 'أسبوعين',
        level: 'مبتدئ',
        skills: JSON.stringify(['فهم صيغة لغة المرجع', 'المتغيرات والثوابت', 'أنواع البيانات الأساسية']),
        passingScore: 60,
        totalQuestions: 20,
        examDuration: 30,
        featured: true,
        isActive: true,
      },
      {
        id: 'almarjaa-intermediate',
        title: 'مطور لغة المرجع',
        titleEn: 'Al-Marjaa Language Developer',
        description: 'شهادة متوسطة في برمجة لغة المرجع. تشمل الدوال، الحلقات، الشروط، والمصفوفات.',
        category: 'برمجة',
        price: 99,
        originalPrice: 199,
        duration: '4 أسابيع',
        level: 'متوسط',
        skills: JSON.stringify(['تعريف الدوال', 'الحلقات التكرارية', 'الشروط والتفرعات', 'المصفوفات']),
        passingScore: 70,
        totalQuestions: 30,
        examDuration: 45,
        featured: true,
        isActive: true,
      },
      {
        id: 'almarjaa-advanced',
        title: 'خبير لغة المرجع',
        titleEn: 'Al-Marjaa Language Expert',
        description: 'شهادة متقدمة في لغة المرجع. تشمل البرمجة الكائنية المتقدمة والذكاء الاصطناعي.',
        category: 'برمجة',
        price: 149,
        originalPrice: 299,
        duration: '6 أسابيع',
        level: 'متقدم',
        skills: JSON.stringify(['البرمجة الكائنية', 'الذكاء الاصطناعي', 'واجهات المستخدم']),
        passingScore: 75,
        totalQuestions: 40,
        examDuration: 60,
        featured: true,
        isActive: true,
      },
      {
        id: 'almarjaa-professional',
        title: 'محترف لغة المرجع المعتمد',
        titleEn: 'Certified Al-Marjaa Professional',
        description: 'الشهادة الاحترافية العليا في لغة المرجع. تشمل JIT Compiler والنشر والإنتاج.',
        category: 'برمجة',
        price: 199,
        originalPrice: 399,
        duration: '8 أسابيع',
        level: 'خبير',
        skills: JSON.stringify(['JIT Compiler', 'الأداء العالي', 'النشر والإنتاج']),
        passingScore: 80,
        totalQuestions: 50,
        examDuration: 75,
        featured: true,
        isActive: true,
      },
    ];

    for (const cert of certificates) {
      const existing = await db.certificate.findUnique({
        where: { id: cert.id },
      });

      if (existing) {
        console.log(`✅ الشهادة "${cert.title}" موجودة بالفعل`);
        continue;
      }

      const created = await db.certificate.create({
        data: cert,
      });
      console.log(`✅ تم إنشاء: ${created.title} - $${created.price}`);
    }

    console.log('\n✨ اكتمل إدراج الشهادات بنجاح!');
    console.log('الشهادات الأربع:');
    console.log('1. مبتدئ لغة المرجع - $49');
    console.log('2. مطور لغة المرجع - $99');
    console.log('3. خبير لغة المرجع - $149');
    console.log('4. محترف لغة المرجع المعتمد - $199');

    await db.$disconnect();
  } catch (error) {
    console.error('[ERROR] فشل إدراج الشهادات:', error.message);
    await db.$disconnect();
    process.exit(1);
  }
}

insertCertificates();
