// بيانات أولية لقاعدة البيانات
import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// ============================================
// شهادات لغة المرجع - Al-Marjaa Language Certificates
// ============================================

const almarjaaCertificates = [
  // المستوى الأول: مبتدئ
  {
    id: 'almarjaa-beginner',
    title: 'مبتدئ لغة المرجع',
    titleEn: 'Al-Marjaa Language Beginner',
    description: 'شهادة تمهيدية في أساسيات لغة المرجع - أول لغة برمجة عربية متكاملة مع الذكاء الاصطناعي. تغطي الصيغة الأساسية، المتغيرات، أنواع البيانات، والعمليات الحسابية.',
    category: 'برمجة',
    price: 49,
    originalPrice: 99,
    duration: 'أسبوعين',
    level: 'مبتدئ',
    skills: JSON.stringify([
      'فهم صيغة لغة المرجع',
      'المتغيرات والثوابت',
      'أنواع البيانات الأساسية',
      'العمليات الحسابية والمنطقية',
      'الطباعة والإدخال'
    ]),
    passingScore: 60,
    totalQuestions: 20,
    examDuration: 30,
    featured: true,
  },
  // المستوى الثاني: متوسط
  {
    id: 'almarjaa-intermediate',
    title: 'مطور لغة المرجع',
    titleEn: 'Al-Marjaa Language Developer',
    description: 'شهادة متوسطة في برمجة لغة المرجع. تشمل الدوال، الحلقات، الشروط، المصفوفات، والبرمجة الكائنية الأساسية.',
    category: 'برمجة',
    price: 99,
    originalPrice: 199,
    duration: '4 أسابيع',
    level: 'متوسط',
    skills: JSON.stringify([
      'تعريف الدوال واستخدامها',
      'الحلقات التكرارية',
      'الشروط والتفرعات',
      'المصفوفات والقوائم',
      'أساسيات البرمجة الكائنية',
      'معالجة الأخطاء'
    ]),
    passingScore: 70,
    totalQuestions: 30,
    examDuration: 45,
    featured: true,
  },
  // المستوى الثالث: متقدم
  {
    id: 'almarjaa-advanced',
    title: 'خبير لغة المرجع',
    titleEn: 'Al-Marjaa Language Expert',
    description: 'شهادة متقدمة في لغة المرجع. تشمل البرمجة الكائنية المتقدمة، واجهات المستخدم، تكامل الذكاء الاصطناعي، Vibe Coding، والتعامل مع الملفات.',
    category: 'برمجة',
    price: 149,
    originalPrice: 299,
    duration: '6 أسابيع',
    level: 'متقدم',
    skills: JSON.stringify([
      'البرمجة الكائنية المتقدمة',
      'نظام واجهات المستخدم',
      'تكامل الذكاء الاصطناعي',
      'Vibe Coding - البرمجة باللغة الطبيعية',
      'دعم ONNX',
      'التعامل مع الملفات',
      'البرمجة غير المتزامنة'
    ]),
    passingScore: 75,
    totalQuestions: 40,
    examDuration: 60,
    featured: true,
  },
  // المستوى الرابع: خبير
  {
    id: 'almarjaa-professional',
    title: 'محترف لغة المرجع المعتمد',
    titleEn: 'Certified Al-Marjaa Professional',
    description: 'الشهادة الاحترافية العليا في لغة المرجع. تشمل JIT Compiler، تحسين الأداء، بناء التطبيقات الكاملة، والنشر والإنتاج.',
    category: 'برمجة',
    price: 199,
    originalPrice: 399,
    duration: '8 أسابيع',
    level: 'خبير',
    skills: JSON.stringify([
      'JIT Compiler والتحسين',
      'بناء تطبيقات كاملة',
      'أداء عالي وتحسين الكود',
      'النشر والإنتاج',
      'بناء مكتبات مخصصة',
      'التكامل مع الأنظمة الخارجية',
      'أفضل الممارسات'
    ]),
    passingScore: 80,
    totalQuestions: 50,
    examDuration: 75,
    featured: true,
  },
];

// ============================================
// البادج - Badges
// ============================================

const badges = [
  {
    id: 'first-certificate',
    name: 'البداية',
    nameEn: 'First Steps',
    description: 'حصلت على شهادتك الأولى',
    descriptionEn: 'Earned your first certificate',
    icon: 'Award',
    color: '#10B981',
    type: 'first_certificate',
    requirement: JSON.stringify({ certificates: 1 }),
    points: 50,
  },
  {
    id: 'five-certificates',
    name: 'المتعلم',
    nameEn: 'Learner',
    description: 'حصلت على 5 شهادات',
    descriptionEn: 'Earned 5 certificates',
    icon: 'BookOpen',
    color: '#3B82F6',
    type: 'certificates_5',
    requirement: JSON.stringify({ certificates: 5 }),
    points: 100,
  },
  {
    id: 'ten-certificates',
    name: 'الخبير',
    nameEn: 'Expert',
    description: 'حصلت على 10 شهادات',
    descriptionEn: 'Earned 10 certificates',
    icon: 'Trophy',
    color: '#8B5CF6',
    type: 'certificates_10',
    requirement: JSON.stringify({ certificates: 10 }),
    points: 200,
  },
  {
    id: 'all-levels',
    name: 'شامل المستويات',
    nameEn: 'Level Master',
    description: 'حصلت على شهادات في جميع المستويات',
    descriptionEn: 'Earned certificates in all levels',
    icon: 'Layers',
    color: '#F59E0B',
    type: 'all_levels',
    requirement: JSON.stringify({ levels: ['مبتدئ', 'متوسط', 'متقدم', 'خبير'] }),
    points: 300,
  },
  {
    id: 'perfect-score',
    name: 'الدرجة الكاملة',
    nameEn: 'Perfect Score',
    description: 'حصلت على 100% في اختبار',
    descriptionEn: 'Achieved 100% on an exam',
    icon: 'Star',
    color: '#EF4444',
    type: 'perfect_score',
    requirement: JSON.stringify({ score: 100 }),
    points: 150,
  },
  {
    id: 'speed-achiever',
    name: 'سريع الإنجاز',
    nameEn: 'Speed Achiever',
    description: 'أكملت اختباراً في أقل من نصف الوقت',
    descriptionEn: 'Completed an exam in less than half the time',
    icon: 'Zap',
    color: '#06B6D4',
    type: 'speed_achievement',
    requirement: JSON.stringify({ timeRatio: 0.5 }),
    points: 75,
  },
  {
    id: 'almarjaa-pioneer',
    name: 'رائد المرجع',
    nameEn: 'Al-Marjaa Pioneer',
    description: 'حصلت على جميع شهادات لغة المرجع',
    descriptionEn: 'Earned all Al-Marjaa Language certificates',
    icon: 'Crown',
    color: '#D4AF37',
    type: 'almarjaa_all',
    requirement: JSON.stringify({ certificateIds: ['almarjaa-beginner', 'almarjaa-intermediate', 'almarjaa-advanced', 'almarjaa-professional'] }),
    points: 500,
  },
];

// ============================================
// أسئلة المستوى المبتدئ - Beginner Questions
// ============================================

const beginnerQuestions = [
  // أساسيات الصيغة
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هي الكلمة المفتاحية الصحيحة لتعريف متغير في لغة المرجع؟',
    options: JSON.stringify(['متغير', 'var', 'let', 'define']),
    correctAnswer: 0,
    explanation: 'في لغة المرجع، نستخدم الكلمة المفتاحية العربية "متغير" لتعريف المتغيرات، مثال: متغير العدد = 10؛',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هي الكلمة المفتاحية لتعريف ثابت (قيمة لا تتغير)؟',
    options: JSON.stringify(['ثابت', 'const', 'final', 'ثابت_قيمة']),
    correctAnswer: 0,
    explanation: 'نستخدم "ثابت" لتعريف القيم الثابتة، مثال: ثابت باي = 3.14159؛',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما الرمز المستخدم لإنهاء التعليمة في لغة المرجع؟',
    options: JSON.stringify(['؛', ';', '.', '،']),
    correctAnswer: 0,
    explanation: 'لغة المرجع تستخدم الفاصلة المنقوطة العربية "؛" لإنهاء التعليمات.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'كيف تُطبع رسالة "مرحباً" في لغة المرجع؟',
    options: JSON.stringify([
      'اطبع("مرحباً")؛',
      'print("مرحباً")؛',
      'cout << "مرحباً"؛',
      'console.log("مرحباً")؛'
    ]),
    correctAnswer: 0,
    explanation: 'الدالة "اطبع" هي الدالة الأساسية للطباعة في لغة المرجع.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هو الناتج: متغير س = 5 + 3؛ اطبع(س)؛؟',
    options: JSON.stringify(['8', '53', 'خطأ', '5 + 3']),
    correctAnswer: 0,
    explanation: 'العملية الحسابية 5 + 3 = 8 يتم تخزينها في المتغير س ثم طباعتها.',
  },
  // أنواع البيانات
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما نوع القيمة "مرحباً بالعالم"؟',
    options: JSON.stringify(['نص', 'عدد', 'منطقي', 'قائمة']),
    correctAnswer: 0,
    explanation: 'القيم النصية (strings) في لغة المرجع تُسمى "نص" وتُكتب بين علامتي تنصيص.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما نوع القيمة 3.14159؟',
    options: JSON.stringify(['عدد_عشري', 'عدد_صحيح', 'نص', 'منطقي']),
    correctAnswer: 0,
    explanation: 'الأعداد العشرية (float) في لغة المرجع تُسمى "عدد_عشري".',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما القيم الممكنة للنوع "منطقي"؟',
    options: JSON.stringify(['صحيح وخطأ', '0 و 1', 'نعم ولا', 'true و false']),
    correctAnswer: 0,
    explanation: 'النوع المنطقي (boolean) يقبل القيمتين "صحيح" و "خطأ" بالعربية.',
  },
  // العمليات
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما نتيجة: 10 % 3؟',
    options: JSON.stringify(['1', '3', '0', '10']),
    correctAnswer: 0,
    explanation: 'عملية % (باقي القسمة) ترجع باقي قسمة 10 على 3 وهو 1.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما العملية المستخدمة للأس؟ مثال: 2³',
    options: JSON.stringify(['**', '^', 'أس', 'pow']),
    correctAnswer: 0,
    explanation: 'لغة المرجع تستخدم ** للأس، مثال: 2 ** 3 = 8.',
  },
  // التعليقات
  {
    certificateId: 'almarjaa-beginner',
    question: 'كيف تكتب تعليق سطر واحد في لغة المرجع؟',
    options: JSON.stringify(['// تعليق', '# تعليق', '-- تعليق', '/* تعليق */']),
    correctAnswer: 0,
    explanation: 'التعليقات السطرية تبدأ بـ // مثل العديد من اللغات الحديثة.',
  },
  // المقارنة
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما رمز "يساوي" للمقارنة بين قيمتين؟',
    options: JSON.stringify(['==', '=', '===', 'يساوي']),
    correctAnswer: 0,
    explanation: 'نستخدم == للمقارنة و = للإسناد، مثل اللغات الأخرى.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما رمز "لا يساوي"؟',
    options: JSON.stringify(['!=', '<>', '=/=', '≠']),
    correctAnswer: 0,
    explanation: 'نستخدم != للتحقق من عدم المساواة.',
  },
  // المزيد من الأسئلة
  {
    certificateId: 'almarjaa-beginner',
    question: 'كيف تُعرّف مصفوفة فارغة؟',
    options: JSON.stringify(['[]', '{}', '()', '<>']),
    correctAnswer: 0,
    explanation: 'المصفوفات تُعرّف بأقواس مربعة [].',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هي نتيجة: "مرحباً" + " " + "عالم"؟',
    options: JSON.stringify(['مرحباً عالم', 'مرحباًعالم', 'خطأ', 'مرحباً  عالم']),
    correctAnswer: 0,
    explanation: 'العملية + مع النصوص تقوم بالدمج (concatenation).',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هي وحدة بناء البرامج في لغة المرجع؟',
    options: JSON.stringify(['التعليمات', 'الأوامر', 'الحزم', 'الوحدات']),
    correctAnswer: 0,
    explanation: 'التعليمات (statements) هي الوحدة الأساسية لبناء البرامج.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هي ميزة لغة المرجع الرئيسية؟',
    options: JSON.stringify([
      'دعم عربي كامل',
      'سرعة فائقة فقط',
      'سهولة التعلم فقط',
      'حجم صغير'
    ]),
    correctAnswer: 0,
    explanation: 'لغة المرجع هي أول لغة برمجة عربية متكاملة مع الذكاء الاصطناعي مع دعم عربي كامل.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هي اللغة التي بُنيت بها لغة المرجع؟',
    options: JSON.stringify(['Rust', 'Python', 'C++', 'Go']),
    correctAnswer: 0,
    explanation: 'لغة المرجع بُنيت باستخدام Rust للحصول على أداء عالٍ وأمان.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'ما هو Vibe Coding؟',
    options: JSON.stringify([
      'البرمجة باللغة الطبيعية',
      'برمجة الألعاب',
      'برمجة الويب',
      'برمجة الأنظمة'
    ]),
    correctAnswer: 0,
    explanation: 'Vibe Coding هي ميزة ثورية تتيح البرمجة باللغة الطبيعية العربية.',
  },
  {
    certificateId: 'almarjaa-beginner',
    question: 'كيف تُكتب الدالة الرئيسية في لغة المرجع؟',
    options: JSON.stringify([
      'دالة رئيسي()',
      'function main()',
      'def main():',
      'int main()'
    ]),
    correctAnswer: 0,
    explanation: 'الدالة الرئيسية تُعرّف بـ "دالة رئيسي()" وتُنفذ عند تشغيل البرنامج.',
  },
];

// ============================================
// أسئلة المستوى المتوسط - Intermediate Questions
// ============================================

const intermediateQuestions = [
  // الدوال
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تُعرّف دالة تستقبل معامل وترجع قيمة؟',
    options: JSON.stringify([
      'دالة اسم_الدالة(المعامل) { أرجع القيمة؛ }',
      'function name(param) { return value; }',
      'def name(param): return value',
      'func name(param) -> value'
    ]),
    correctAnswer: 0,
    explanation: 'الدوال تُعرّف بـ "دالة" وتستخدم "أرجع" لإرجاع القيم.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما الكلمة المفتاحية لإرجاع قيمة من دالة؟',
    options: JSON.stringify(['أرجع', 'return', 'إرجاع', 'أعطي']),
    correctAnswer: 0,
    explanation: 'نستخدم "أرجع" لإرجاع القيم من الدوال.',
  },
  // الحلقات
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تُكتب حلقة تكرار من 1 إلى 10؟',
    options: JSON.stringify([
      'لكل رق�� في مدى(1، 10) { }',
      'for i in range(1, 10):',
      'for (i = 1; i <= 10; i++) { }',
      'loop i from 1 to 10:'
    ]),
    correctAnswer: 0,
    explanation: 'الحلقة "لكل" مع "مدى" تُستخدم للتكرار على نطاق من الأرقام.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما هي الكلمة المفتاحية للخروج من حلقة؟',
    options: JSON.stringify(['اخرج', 'break', 'توقف', 'خروج']),
    correctAnswer: 0,
    explanation: '"اخرج" تُستخدم للخروج المبكر من الحلقات.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما هي الكلمة المفتاحية للتخطي للتكرار التالي؟',
    options: JSON.stringify(['تخطي', 'continue', 'التالي', 'skip']),
    correctAnswer: 0,
    explanation: '"تخطي" تتجاوز التكرار الحالي وتنتقل للتكرار التالي.',
  },
  // الشروط
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تُكتب جملة شرطية بسيطة؟',
    options: JSON.stringify([
      'إذا الشرط { }',
      'if condition { }',
      'when condition:',
      'case condition:'
    ]),
    correctAnswer: 0,
    explanation: 'الشرطية تُكتب بـ "إذا" متبوعة بالشرط والأقواس.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما الكلمة المفتاحية للشرط البديل (else)؟',
    options: JSON.stringify(['وإلا', 'else', 'غير', 'خلاف']),
    correctAnswer: 0,
    explanation: '"وإلا" تُستخدم للكتلة البديلة في الشرطيات.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تُكتب شرطية متعددة الفروع؟',
    options: JSON.stringify([
      'إذا الشرط1 { } وإلا_إذا الشرط2 { } وإلا { }',
      'if cond1 {} else if cond2 {} else {}',
      'if cond1: elif cond2: else:',
      'case when cond1: when cond2: else:'
    ]),
    correctAnswer: 0,
    explanation: 'نستخدم "إلا_إذا" للفروع الإضافية و "وإلا" للفرع الافتراضي.',
  },
  // المصفوفات
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تصل للعنصر الأول في مصفوفة؟',
    options: JSON.stringify(['المصفوفة[0]', 'المصفوفة[1]', 'المصفوفة.أول', 'أول(المصفوفة)']),
    correctAnswer: 0,
    explanation: 'الفهرسة تبدأ من 0 مثل معظم لغات البرمجة.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تحصل على عدد عناصر المصفوفة؟',
    options: JSON.stringify(['المصفوفة.طول', 'length(المصفوفة)', 'len(المصفوفة)', 'المصفوفة.عدد']),
    correctAnswer: 0,
    explanation: 'الخاصية "طول" تُرجع عدد العناصر في المصفوفة.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تضيف عنصراً لنهاية مصفوفة؟',
    options: JSON.stringify(['المصفوفة.أضف(العنصر)', 'المصفوفة.push(العنصر)', 'المصفوفة += العنصر', 'أضف(المصفوفة، العنصر)']),
    correctAnswer: 0,
    explanation: 'الدالة "أضف" تضيف عنصراً جديداً لنهاية المصفوفة.',
  },
  // البرمجة الكائنية
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تُعرّف صنف (class) جديد؟',
    options: JSON.stringify([
      'صنف الاسم { }',
      'class الاسم { }',
      'type الاسم = { }',
      'struct الاسم { }'
    ]),
    correctAnswer: 0,
    explanation: 'الأصناف تُعرّف بـ "صنف" في لغة المرجع.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما الكلمة المفتاحية للإشارة للكائن الحالي؟',
    options: JSON.stringify(['هذا', 'self', 'this', 'أنا']),
    correctAnswer: 0,
    explanation: '"هذا" تُستخدم للإشارة للكائن الحالي داخل الصنف.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما هي الدالة البانية (constructor)؟',
    options: JSON.stringify([
      'دالة تحمل نفس اسم الصنف',
      'دالة __init__',
      'دالة constructor',
      'دالة new'
    ]),
    correctAnswer: 0,
    explanation: 'الدالة البانية تحمل نفس اسم الصنف وتُنفذ عند إنشاء كائن جديد.',
  },
  // معالجة الأخطاء
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تتعامل مع الأخطاء المحتملة؟',
    options: JSON.stringify([
      'حاول { } أمسك (خطأ) { }',
      'try { } catch (e) { }',
      'try: except:',
      'handle error:'
    ]),
    correctAnswer: 0,
    explanation: 'نستخدم "حاول" و "أمسك" لمعالجة الأخطاء.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تُطلق استثناءً؟',
    options: JSON.stringify(['ارفع("الخطأ")', 'throw "الخطأ"', 'raise "الخطأ"', 'خطأ("الخطأ")']),
    correctAnswer: 0,
    explanation: '"ارفع" تُستخدم لإطلاق الاستثناءات.',
  },
  // المزيد من الأسئلة
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما هي نتيجة: مدى(1، 5)؟',
    options: JSON.stringify(['[1، 2، 3، 4]', '[1، 2، 3، 4، 5]', '[0، 1، 2، 3، 4]', '[2، 3، 4]']),
    correctAnswer: 0,
    explanation: 'مدى(1، 5) يُنشئ نطاقاً من 1 إلى 4 (غير شامل النهاية).',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تُعرّف دالة بسائق افتراضي؟',
    options: JSON.stringify([
      'دالة الاسم(المعامل = القيمة) { }',
      'function name(param = value) { }',
      'def name(param=value):',
      'func name(param: value) {}'
    ]),
    correctAnswer: 0,
    explanation: 'المعاملات الافتراضية تُحدد بـ = عند تعريف الدالة.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'ما هي الميزة التي تتيح إنشاء دوال بعدد متغير من المعاملات؟',
    options: JSON.stringify(['المعاملات المتعددة', 'Varargs', 'Spread', 'Rest']),
    correctAnswer: 0,
    explanation: 'لغة المرجع تدعم المعاملات المتعددة للدوال المرنة.',
  },
  {
    certificateId: 'almarjaa-intermediate',
    question: 'كيف تستدعي دالة على كل عنصر في مصفوفة؟',
    options: JSON.stringify([
      'لكل عنصر في المصفوفة { الدالة(عنصر)؛ }',
      'المصفوفة.map(الدالة)',
      'map(الدالة، المصفوفة)',
      'for element in array: function(element)'
    ]),
    correctAnswer: 0,
    explanation: 'حلقة "لكل" تُستخدم للتكرار على عناصر المصفوفة وتنفيذ كود عليها.',
  },
];

// ============================================
// أسئلة المستوى المتقدم - Advanced Questions
// ============================================

const advancedQuestions = [
  // الذكاء الاصطناعي
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تُنشئ شبكة عصبية في لغة المرجع؟',
    options: JSON.stringify([
      'متغير شبكة = شبكة_عصبية()؛',
      'import torch; model = nn.Network()',
      'const network = new NeuralNetwork()',
      'network = NeuralNetwork.create()'
    ]),
    correctAnswer: 0,
    explanation: 'شبكة_عصبية() تُنشئ شبكة عصبية جديدة في لغة المرجع.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تضيف طبقة للشبكة العصبية؟',
    options: JSON.stringify([
      'شبكة.أضف_طبقة(128، "relu")؛',
      'network.add_layer(128, "relu")',
      'شبكة << طبقة(128, relu)',
      'شبكة.add(Layer(128, relu))'
    ]),
    correctAnswer: 0,
    explanation: 'أضف_طبقة تضيف طبقة جديدة مع عدد الخلايا ودالة التنشيط.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هي دالة التنشيط softmax المستخدمة لـ؟',
    options: JSON.stringify([
      'طبقة الإخراج للتصنيف المتعدد',
      'الطبقات المخفية فقط',
      'تقليل overfitting',
      'تسريع التدريب'
    ]),
    correctAnswer: 0,
    explanation: 'softmax تُستخدم في طبقة الإخراج للتصنيف المتعدد حيث تُحوّل المخرجات لاحتمالات.',
  },
  // Vibe Coding
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هو Vibe Coding في لغة المرجع؟',
    options: JSON.stringify([
      'البرمجة باللغة الطبيعية العربية',
      'برمجة الرسوم المتحركة',
      'برمجة قواعد البيانات',
      'برمجة الألعاب'
    ]),
    correctAnswer: 0,
    explanation: 'Vibe Coding هي ميزة ثورية تتيح كتابة الكود باللغة الطبيعية العربية.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما نتيجة: "أنشئ متغير اسم يساوي أحمد"؟',
    options: JSON.stringify([
      'متغير اسم = "أحمد"؛',
      'var name = "أحمد";',
      'let name := "أحمد"',
      'name = "أحمد"'
    ]),
    correctAnswer: 0,
    explanation: 'Vibe Coding يُحوّل اللغة الطبيعية لكود لغة المرجع.',
  },
  // ONNX
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هو ONNX؟',
    options: JSON.stringify([
      'تنسيق مفتوح لنماذج الذكاء الاصطناعي',
      'قاعدة بيانات',
      'لغة برمجة',
      'إطار عمل ويب'
    ]),
    correctAnswer: 0,
    explanation: 'ONNX (Open Neural Network Exchange) هو تنسيق لتبادل نماذج التعلم العميق.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تحمّل نموذج ONNX؟',
    options: JSON.stringify([
      'نموذج = أونكس.حمّل("model.onnx")؛',
      'model = onnx.load("model.onnx")',
      'import onnx; model = load("model.onnx")',
      'model := LoadONNX("model.onnx")'
    ]),
    correctAnswer: 0,
    explanation: 'أونكس.حمّل تحمّل نموذج ONNX للاستخدام في لغة المرجع.',
  },
  // UI Framework
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تُنشئ زراً في إطار عمل الواجهات؟',
    options: JSON.stringify([
      'زر("اضغط هنا") { نقر: () => اطبع("تم")، }،',
      '<button onClick={print}>اضغط</button>',
      'Button(text="اضغط", onClick=print)',
      'new Button("اضغط", action: print)'
    ]),
    correctAnswer: 0,
    explanation: 'زر تُنشئ زراً مع نص ومعالج النقر.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هو الربط التلقائي للبيانات؟',
    options: JSON.stringify([
      'تحديث الواجهة تلقائياً عند تغيير البيانات',
      'ربط قاعدة البيانات',
      'ربط الملفات',
      'ربط الشبكة'
    ]),
    correctAnswer: 0,
    explanation: 'الربط التلقائي يُحدّث الواجهة تلقائياً عند تغيير البيانات المرتبطة.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تُعرّف متغيراً قابلاً للملاحظة للواجهة؟',
    options: JSON.stringify([
      'متغير العدد = قابل_للملاحظة(0)؛',
      'let count = observable(0)',
      '@observable count = 0',
      'state count = 0'
    ]),
    correctAnswer: 0,
    explanation: 'قابل_للملاحظة تُنشئ متغيراً يُحدّث الواجهة تلقائياً عند تغييره.',
  },
  // البرمجة الكائنية المتقدمة
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هو الوراثة في البرمجة الكائنية؟',
    options: JSON.stringify([
      'اكتساب خصائص صنف آخر',
      'نسخ الأصناف',
      'حذف الأصناف',
      'دمج الأصناف'
    ]),
    correctAnswer: 0,
    explanation: 'الوراثة تتيح للصنف اكتساب خصائص ودوال صنف آخر.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تعرّف صنفاً يرث من صنف آخر؟',
    options: JSON.stringify([
      'صنف الابن يرث الأب { }',
      'class Son extends Father { }',
      'صنف الابن : الأب { }',
      'type Son = Father + {}'
    ]),
    correctAnswer: 0,
    explanation: 'الكلمة "يرث" تُستخدم لتعريف الوراثة بين الأصناف.',
  },
  // الملفات
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تقرأ محتوى ملف؟',
    options: JSON.stringify([
      'محتوى = اقرأ_ملف("الملف.txt")؛',
      'content = File.read("file.txt")',
      'open("file.txt").read()',
      'readFile("file.txt")'
    ]),
    correctAnswer: 0,
    explanation: 'اقرأ_ملف تقرأ محتوى ملف نصي وتُرجعه كسلسلة.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تكتب لملف؟',
    options: JSON.stringify([
      'اكتب_ملف("الملف.txt"، "المحتوى")؛',
      'File.write("file.txt", "content")',
      'write("file.txt", "content")',
      'echo "content" > file.txt'
    ]),
    correctAnswer: 0,
    explanation: 'اكتب_ملف تكتب محتوى نصي لملف.',
  },
  // البرمجة غير المتزامنة
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هي البرمجة غير المتزامنة؟',
    options: JSON.stringify([
      'تنفيذ العمليات دون انتظار اكتمالها',
      'تنفيذ العمليات بالتوازي فقط',
      'تنفيذ العمليات بالترتيب',
      'إيقاف البرنامج'
    ]),
    correctAnswer: 0,
    explanation: 'البرمجة غير المتزامنة تتيح تنفيذ عمليات دون حظر البرنامج.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما الكلمة المفتاحية للدالة غير المتزامنة؟',
    options: JSON.stringify(['غير_متزامن', 'async', 'await', 'مؤجل']),
    correctAnswer: 0,
    explanation: '"غير_متزامن" تُعرّف دالة تعمل بشكل غير متزامن.',
  },
  // أداء
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هي الميزة التي تُسرّع تنفيذ الكود بشكل كبير؟',
    options: JSON.stringify(['JIT Compiler', 'AOT Compiler', 'Interpreter', 'Transpiler']),
    correctAnswer: 0,
    explanation: 'JIT (Just-In-Time) Compiler يُترجم الكود للغة الآلة أثناء التنفيذ لتسريع الأداء.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'كم مستوى تحسين في JIT Compiler للغة المرجع؟',
    options: JSON.stringify(['5 مستويات', '3 مستويات', '2 مستويات', '1 مستوى']),
    correctAnswer: 0,
    explanation: 'JIT Compiler له 5 مستويات تحسين من Tier 0 إلى Tier 4.',
  },
  // المزيد
  {
    certificateId: 'almarjaa-advanced',
    question: 'ما هي نسبة التسريع التي يوفرها JIT Compiler؟',
    options: JSON.stringify(['5.08x تسريع', '2x تسريع', '10x تسريع', '1.5x تسريع']),
    correctAnswer: 0,
    explanation: 'JIT Compiler يُسرّع الأداء بنسبة 5.08x مقارنة بالمفسر.',
  },
  {
    certificateId: 'almarjaa-advanced',
    question: 'كيف تُصدّر شبكة عصبية لـ ONNX؟',
    options: JSON.stringify([
      'شبكة.صدّر("mymodel.onnx")؛',
      'export(network, "mymodel.onnx")',
      'torch.save(network, "mymodel.onnx")',
      'network.save_onnx("mymodel.onnx")'
    ]),
    correctAnswer: 0,
    explanation: 'صدّر تُصدّر الشبكة العصبية لتنسيق ONNX للاستخدام في منصات أخرى.',
  },
];

// ============================================
// أسئلة المستوى الخبير - Professional Questions
// ============================================

const professionalQuestions = [
  // JIT Compiler المتقدم
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو Tier 0 في JIT Compiler؟',
    options: JSON.stringify([
      'المفسر الأساسي (Interpreter Baseline)',
      'التحسين الأول',
      'SIMD Optimizations',
      'Tracing JIT'
    ]),
    correctAnswer: 0,
    explanation: 'Tier 0 هو التنفيذ بالمفسر قبل أي تحسين JIT.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'متى يُفعّل Tier 1 (Baseline JIT)؟',
    options: JSON.stringify(['بعد 50 تنفيذ', 'فوراً', 'بعد 1000 تنفيذ', 'بعد 5 تنفيذات']),
    correctAnswer: 0,
    explanation: 'Baseline JIT يُفعّل بعد 50 تنفيذ لنفس الكود.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو SIMD Optimization؟',
    options: JSON.stringify([
      'استخدام تعليمات المعالج المتوازية',
      'تحسين الذاكرة',
      'ضغط الكود',
      'تسريع الشبكة'
    ]),
    correctAnswer: 0,
    explanation: 'SIMD (Single Instruction, Multiple Data) يُنفّذ نفس التعليمة على بيانات متعددة بالتوازي.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'متى يُفعّل Tracing JIT (Tier 4)؟',
    options: JSON.stringify(['بعد 5000 تنفيذ', 'بعد 100 تنفيذ', 'فوراً', 'بعد 50 تنفيذ']),
    correctAnswer: 0,
    explanation: 'Tracing JIT يُفعّل بعد 5000 تنفيذ للكود الساخن.',
  },
  // بناء التطبيقات
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي أفضل طريقة لتنظيم مشروع كبير في لغة المرجع؟',
    options: JSON.stringify([
      'تقسيم الكود لوحدات وأصناف',
      'ملف واحد كبير',
      'نسخ الكود لكل ميزة',
      'استخدام لغة أخرى'
    ]),
    correctAnswer: 0,
    explanation: 'المشاريع الكبيرة تُنظّم في وحدات وأصناف منفصلة.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'كيف تُدير التبعيات في مشروع لغة المرجع؟',
    options: JSON.stringify([
      'استخدام نظام الحزم',
      'نسخ الملفات يدوياً',
      'تضمين كل الكود',
      'لا توجد طريقة'
    ]),
    correctAnswer: 0,
    explanation: 'نظام الحزم يُدير التبعيات ويُسهّل مشاركة المكتبات.',
  },
  // الأداء
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي عدد العمليات الحسابية في الثانية مع JIT؟',
    options: JSON.stringify(['3.6M عملية/ثانية', '100K عملية/ثانية', '1M عملية/ثانية', '500K عملية/ثانية']),
    correctAnswer: 0,
    explanation: 'JIT يُتيح تنفيذ 3.6 مليون عملية حسابية في الثانية.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو اختبار الضغط؟',
    options: JSON.stringify([
      'اختبار أداء النظام تحت حمل عالي',
      'اختبار الواجهة',
      'اختبار الأمان',
      'اختبار التوافق'
    ]),
    correctAnswer: 0,
    explanation: 'اختبار الضغط يتحقق من أداء النظام تحت أحمال عالية.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'كم عملية/ثانية في اختبار الضغط للغة المرجع؟',
    options: JSON.stringify(['19.9M عملية/ثانية', '1M عملية/ثانية', '5M عملية/ثانية', '10M عملية/ثانية']),
    correctAnswer: 0,
    explanation: 'لغة المرجع تحقق 19.9 مليون عملية في الثانية في اختبار الضغط.',
  },
  // النشر والإنتاج
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو أول خطوة لنشر تطبيق لغة المرجع؟',
    options: JSON.stringify([
      'بناء النسخة الإنتاجية',
      'حذف الكود المصدري',
      'نسخ الملفات',
      'نشر مباشر'
    ]),
    correctAnswer: 0,
    explanation: 'البناء الإنتاجي يُحسّن الكود ويُجهّزه للنشر.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي أفضل ممارسة للتعامل مع الأخطاء في الإنتاج؟',
    options: JSON.stringify([
      'تسجيل الأخطاء ومراقبتها',
      'تجاهل الأخطاء',
      'إيقاف البرنامج',
      'طباعة الأخطاء للمستخدم'
    ]),
    correctAnswer: 0,
    explanation: 'تسجيل ومراقبة الأخطاء يُتيح اكتشاف وحل المشاكل بسرعة.',
  },
  // التكامل
  {
    certificateId: 'almarjaa-professional',
    question: 'كيف تتكامل لغة المرجع مع أنظمة أخرى؟',
    options: JSON.stringify([
      'عبر واجهات برمجة التطبيقات (APIs)',
      'لا تتكامل',
      'نسخ الملفات',
      'إعادة كتابة الكود'
    ]),
    correctAnswer: 0,
    explanation: 'APIs تُتيح التكامل مع الأنظمة والخدمات الخارجية.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي ميزة FFI في لغة المرجع؟',
    options: JSON.stringify([
      'استدعاء دوال من لغات أخرى',
      'تشفير الكود',
      'ضغط الملفات',
      'تسريع الشبكة'
    ]),
    correctAnswer: 0,
    explanation: 'FFI (Foreign Function Interface) يُتيح استدعاء دوال من مكتبات C وغيرها.',
  },
  // مكتبات مخصصة
  {
    certificateId: 'almarjaa-professional',
    question: 'كيف تُنشئ مكتبة قابلة لإعادة الاستخدام؟',
    options: JSON.stringify([
      'تغليف الدوال في وحدة مستقلة',
      'كتابة كل شيء في ملف واحد',
      'نسخ الكود لكل مشروع',
      'استخدام لغة أخرى'
    ]),
    correctAnswer: 0,
    explanation: 'المكتبات تُبنى بتغليف الدوال والأصناف في وحدات مستقلة.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو التوثيق الجيد للمكتبات؟',
    options: JSON.stringify([
      'شرح كل دالة مع أمثلة',
      'لا حاجة للتوثيق',
      'توثيق جزئي',
      'توثيق باللغة الإنجليزية فقط'
    ]),
    correctAnswer: 0,
    explanation: 'التوثيق الشامل مع الأمثلة يُسهّل استخدام المكتبة.',
  },
  // أمن
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي أفضل ممارسة أمنية للمدخلات؟',
    options: JSON.stringify([
      'التحقق والتنظيف قبل المعالجة',
      'قبول كل المدخلات',
      'رفض كل المدخلات',
      'تخزين كما هي'
    ]),
    correctAnswer: 0,
    explanation: 'التحقق من المدخلات يحمي من الهجمات مثل XSS و SQL Injection.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'كيف تحمي كلمات المرور في التطبيق؟',
    options: JSON.stringify([
      'تشفيرها بـ bcrypt أو مشابه',
      'تخزينها كنص عادي',
      'تشفير بسيط',
      'حفظها في الكود'
    ]),
    correctAnswer: 0,
    explanation: 'bcrypt يُشفر كلمات المرور بشكل آمن مع salt.',
  },
  // اختبارات
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو نوع الاختبار الذي يتحقق من وحدة واحدة من الكود؟',
    options: JSON.stringify(['اختبار الوحدة', 'اختبار التكامل', 'اختبار الأداء', 'اختبار القبول']),
    correctAnswer: 0,
    explanation: 'اختبار الوحدة يتحقق من صحة دالة أو صنف واحد.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي نسبة التغطية المثالية للاختبارات؟',
    options: JSON.stringify(['80% أو أعلى', '50%', '30%', '100% دائماً']),
    correctAnswer: 0,
    explanation: 'تغطية 80%+ تعتبر جيدة مع توازن بين الجودة والسرعة.',
  },
  // أفضل الممارسات
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي أفضل ممارسة لتسمية المتغيرات؟',
    options: JSON.stringify([
      'أسماء واضحة بالعربية',
      'أسماء قصيرة جداً',
      'أسماء بالإنجليزية',
      'أحرف فقط'
    ]),
    correctAnswer: 0,
    explanation: 'الأسماء الواضحة بالعربية تُسهّل فهم الكود.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي أفضل ممارسة لدوال طويلة؟',
    options: JSON.stringify([
      'تقسيمها لدوال أصغر',
      'تركها كما هي',
      'حذف بعض الكود',
      'دمجها مع دوال أخرى'
    ]),
    correctAnswer: 0,
    explanation: 'الدوال الصغيرة أسهل في الفهم والاختبار والصيانة.',
  },
  // ميزات متقدمة
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هي الميزة التي تتيح التنفيذ المتوازي التلقائي؟',
    options: JSON.stringify(['التنفيذ المتوازي', 'الحلقات التسلسلية', 'البرمجة الكائنية', 'الدوال العادية']),
    correctAnswer: 0,
    explanation: 'التنفيذ المتوازي يُسرّع العمليات المستقلة بتوزيعها على الأنوية.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو إصدار لغة المرجع الحالي؟',
    options: JSON.stringify(['3.3.0', '1.0.0', '2.0.0', '4.0.0']),
    correctAnswer: 0,
    explanation: 'الإصدار الحالي 3.3.0 يشمل JIT Compiler الكامل ودعم ONNX.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'من هو مؤسس لغة المرجع؟',
    options: JSON.stringify(['رضوان دالي حمدوني', 'محمد علي', 'أحمد حسن', 'خالد محمود']),
    correctAnswer: 0,
    explanation: 'رضوان دالي حمدوني هو مؤسس ومطور لغة المرجع.',
  },
  {
    certificateId: 'almarjaa-professional',
    question: 'ما هو الغرض الرئيسي من لغة المرجع؟',
    options: JSON.stringify([
      'تمكين المتحدثين بالعربية من البرمجة بلغتهم',
      'استبدال اللغات الأخرى',
      'التعليم فقط',
      'الألعاب فقط'
    ]),
    correctAnswer: 0,
    explanation: 'لغة المرجع صُمّمت لتمكين العرب من البرمجة بلغتهم الأم.',
  },
];

async function main() {
  console.log('🌱 Starting seed...');
  console.log('');

  // إنشاء المستخدم الإداري
  // Admin Email: admin@ecertif.pro
  // Admin Password: AdminSecure@2024
  const adminPassword = await bcrypt.hash('AdminSecure@2024', SALT_ROUNDS);
  const admin = await db.user.upsert({
    where: { email: 'admin@ecertif.pro' },
    update: {},
    create: {
      email: 'admin@ecertif.pro',
      name: 'المشرف العام',
      password: adminPassword,
      role: 'admin',
      level: 'خبير',
      points: 1000,
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log(`✅ Admin User Created:`);
  console.log(`   📧 Email: ${admin.email}`);
  console.log(`   🔐 Password: AdminSecure@2024`);
  console.log('');

  // إنشاء مستخدم تجريبي
  // Demo Email: user@test.com
  // Demo Password: TestUser123
  const demoPassword = await bcrypt.hash('TestUser123', SALT_ROUNDS);
  const demoUser = await db.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      name: 'مستخدم اختبار',
      password: demoPassword,
      role: 'user',
      level: 'مبتدئ',
      points: 0,
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log(`✅ Test User Created:`);
  console.log(`   📧 Email: ${demoUser.email}`);
  console.log(`   🔐 Password: TestUser123`);
  console.log('');

  // إنشاء شهادات لغة المرجع
  console.log('📜 Creating Al-Marjaa Language Certificates...');
  for (const cert of almarjaaCertificates) {
    await db.certificate.upsert({
      where: { id: cert.id },
      update: cert,
      create: cert,
    });
    console.log(`   ✅ ${cert.title} (${cert.level})`);
  }
  console.log('');

  // إنشاء البادج
  console.log('🏆 Creating Badges...');
  for (const badge of badges) {
    await db.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge,
    });
    console.log(`   ✅ ${badge.name} (${badge.type})`);
  }
  console.log('');

  // إنشاء الأسئلة
  console.log('❓ Creating Questions...');
  
  // أسئلة المبتدئ
  for (const q of beginnerQuestions) {
    await db.question.upsert({
      where: { 
        id: `${q.certificateId}-${beginnerQuestions.indexOf(q)}`
      },
      update: {
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      create: {
        id: `${q.certificateId}-${beginnerQuestions.indexOf(q)}`,
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }
  console.log(`   ✅ ${beginnerQuestions.length} سؤال للمبتدئين`);

  // أسئلة المتوسط
  for (const q of intermediateQuestions) {
    await db.question.upsert({
      where: { 
        id: `${q.certificateId}-${intermediateQuestions.indexOf(q)}`
      },
      update: {
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      create: {
        id: `${q.certificateId}-${intermediateQuestions.indexOf(q)}`,
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }
  console.log(`   ✅ ${intermediateQuestions.length} سؤال للمتوسط`);

  // أسئلة المتقدم
  for (const q of advancedQuestions) {
    await db.question.upsert({
      where: { 
        id: `${q.certificateId}-${advancedQuestions.indexOf(q)}`
      },
      update: {
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      create: {
        id: `${q.certificateId}-${advancedQuestions.indexOf(q)}`,
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }
  console.log(`   ✅ ${advancedQuestions.length} سؤال للمتقدم`);

  // أسئلة الخبير
  for (const q of professionalQuestions) {
    await db.question.upsert({
      where: { 
        id: `${q.certificateId}-${professionalQuestions.indexOf(q)}`
      },
      update: {
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      create: {
        id: `${q.certificateId}-${professionalQuestions.indexOf(q)}`,
        certificateId: q.certificateId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }
  console.log(`   ✅ ${professionalQuestions.length} سؤال للخبراء`);
  console.log('');

  // إنشاء كوبون خصم
  await db.coupon.upsert({
    where: { code: 'LAUNCH50' },
    update: {},
    create: {
      code: 'LAUNCH50',
      discountPercent: 50,
      maxUses: 100,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
    },
  });
  console.log('✅ Created coupon: LAUNCH50');

  // كوبون خاص بلغة المرجع
  await db.coupon.upsert({
    where: { code: 'MARJAA100' },
    update: {},
    create: {
      code: 'MARJAA100',
      discountPercent: 100,
      maxUses: 50,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Created coupon: MARJAA100 (مجاني لشهادات المرجع)');
  console.log('');

  // إنشاء إعدادات المنصة
  const settings = [
    { key: 'platform_name', value: 'ECERTIFPRO' },
    { key: 'platform_url', value: 'ECERTIFPRO.COM' },
    { key: 'founder_name', value: 'رضوان دالي حمدوني' },
    { key: 'contact_email', value: 'almarjaa.project@hotmail.com' },
    { key: 'currency', value: 'USD' },
    { key: 'certificate_validity', value: 'lifetime' },
    { key: 'almarjaa_version', value: '3.3.0' },
  ];

  for (const setting of settings) {
    await db.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Created platform settings');

  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   📜 شهادات لغة المرجع - Al-Marjaa Language Certificates');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('   🟢 مبتدئ لغة المرجع - 20 سؤال - 30 دقيقة');
  console.log('   🟡 مطور لغة المرجع - 20 سؤال - 45 دقيقة');
  console.log('   🟠 خبير لغة المرجع - 20 سؤال - 60 دقيقة');
  console.log('   🔴 محترف لغة المرجع المعتمد - 25 سؤال - 75 دقيقة');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   🏆 البادج - Badges');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  badges.forEach(b => {
    console.log(`   ${b.icon} ${b.name} - ${b.points} نقطة`);
  });
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 Admin Login:');
  console.log('   Email: admin@ecertifpro.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('📋 Demo Login:');
  console.log('   Email: demo@ecertifpro.com');
  console.log('   Password: demo123');
  console.log('');
  console.log('🎁 Free Coupon: MARJAA100 (شهادات المرجع مجانية!)');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
