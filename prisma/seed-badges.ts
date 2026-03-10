import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultBadges = [
  {
    name: 'أول شهادة',
    nameEn: 'First Certificate',
    description: 'حصلت على شهادتك الأولى! بداية رائعة لرحلتك المهنية.',
    descriptionEn: 'You earned your first certificate! A great start to your professional journey.',
    icon: 'Award',
    color: '#4CAF50',
    type: 'first_certificate',
    requirement: JSON.stringify({ certificates: 1 }),
    points: 10,
  },
  {
    name: 'خمس شهادات',
    nameEn: 'Five Certificates',
    description: 'حققت إنجازاً رائعاً بحصولك على 5 شهادات مهنية.',
    descriptionEn: 'Achieved a great milestone by earning 5 professional certificates.',
    icon: 'Trophy',
    color: '#2196F3',
    type: 'certificates_5',
    requirement: JSON.stringify({ certificates: 5 }),
    points: 50,
  },
  {
    name: 'عشر شهادات',
    nameEn: 'Ten Certificates',
    description: 'إنجاز استثنائي! حصلت على 10 شهادات مهنية.',
    descriptionEn: 'Exceptional achievement! You earned 10 professional certificates.',
    icon: 'Crown',
    color: '#9C27B0',
    type: 'certificates_10',
    requirement: JSON.stringify({ certificates: 10 }),
    points: 100,
  },
  {
    name: 'متعدد المستويات',
    nameEn: 'Multi-Level Master',
    description: 'حصلت على شهادات في جميع المستويات (مبتدئ، متوسط، متقدم، خبير).',
    descriptionEn: 'Earned certificates across all levels (Beginner, Intermediate, Advanced, Expert).',
    icon: 'Layers',
    color: '#FF9800',
    type: 'all_levels',
    requirement: JSON.stringify({ levels: ['مبتدئ', 'متوسط', 'متقدم', 'خبير'] }),
    points: 75,
  },
  {
    name: 'درجة كاملة',
    nameEn: 'Perfect Score',
    description: 'حققت درجة 100% في أحد الاختبارات! أداء متميز.',
    descriptionEn: 'Achieved a perfect 100% score on an exam! Outstanding performance.',
    icon: 'Star',
    color: '#FFD700',
    type: 'perfect_score',
    requirement: JSON.stringify({ score: 100 }),
    points: 50,
  },
  {
    name: 'سريع الإنجاز',
    nameEn: 'Speed Achiever',
    description: 'أكملت اختباراً في وقت قياسي مع درجة نجاح.',
    descriptionEn: 'Completed an exam in record time with a passing score.',
    icon: 'Zap',
    color: '#00BCD4',
    type: 'speed_achievement',
    requirement: JSON.stringify({ maxTime: 300 }), // 5 minutes
    points: 25,
  },
];

async function main() {
  console.log('بدء إنشاء البادج الافتراضية...');

  for (const badge of defaultBadges) {
    const existing = await prisma.badge.findFirst({
      where: { type: badge.type },
    });

    if (!existing) {
      await prisma.badge.create({ data: badge });
      console.log(`تم إنشاء بادج: ${badge.name}`);
    } else {
      console.log(`البادج موجود بالفعل: ${badge.name}`);
    }
  }

  console.log('تم إنشاء جميع البادج بنجاح!');
}

main()
  .catch((e) => {
    console.error('خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
