// بيانات الاختبارات
import { getCertificateById } from './certificates';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ExamData {
  certificateId: string;
  questions: Question[];
}

// اختبار مطور Al-Marjaa المعتمد
const almarjaaExam: ExamData = {
  certificateId: 'almarjaa-developer',
  questions: [
    {
      id: 1,
      question: 'ما هي المنصة التعليمية المرتبطة بشهادات ECERTIFPRO؟',
      options: ['Coursera', 'Al-Marjaa Language', 'Udemy', 'edX'],
      correctAnswer: 1,
      explanation: 'ECERTIFPRO مرتبطة بمنصة Al-Marjaa Language لتعلم اللغات.',
    },
    {
      id: 2,
      question: 'من هو مؤسس منصة Al-Marjaa؟',
      options: ['أحمد محمد', 'رضوان دالي حمدوني', 'خالد العمري', 'سامي الحربي'],
      correctAnswer: 1,
      explanation: 'المؤسس هو رضوان دالي حمدوني.',
    },
    {
      id: 3,
      question: 'ما هو البريد الإلكتروني الرسمي للمشروع؟',
      options: ['info@almarjaa.com', 'almarjaa.project@hotmail.com', 'support@almarjaa.net', 'contact@almarjaa.org'],
      correctAnswer: 1,
      explanation: 'البريد الرسمي هو almarjaa.project@hotmail.com',
    },
    {
      id: 4,
      question: 'ما هو الموقع الرسمي لمنصة ECERTIFPRO؟',
      options: ['ecertifpro.net', 'ecertifpro.org', 'ECERTIFPRO.COM', 'ecertifpro.edu'],
      correctAnswer: 2,
      explanation: 'الموقع الرسمي هو ECERTIFPRO.COM',
    },
    {
      id: 5,
      question: 'ما هي أهم ميزة في منصة Al-Marjaa للتعلم؟',
      options: ['الفيديوهات فقط', 'التعلم التفاعلي باللغة العربية', 'الكتب الإلكترونية فقط', 'الاختبارات الورقية'],
      correctAnswer: 1,
      explanation: 'المنصة تركز على التعلم التفاعلي باللغة العربية.',
    },
    {
      id: 6,
      question: 'كيف يمكن التحقق من صحة الشهادة؟',
      options: ['عبر الهاتف', 'من خلال QR Code', 'بالبريد العادي', 'بالإيميل فقط'],
      correctAnswer: 1,
      explanation: 'يمكن التحقق من الشهادة عبر مسح QR Code.',
    },
    {
      id: 7,
      question: 'ما هي مدة صلاحية الشهادة؟',
      options: ['سنة واحدة', 'سنتان', 'غير محدودة', 'ستة أشهر'],
      correctAnswer: 2,
      explanation: 'شهادات ECERTIFPRO صالحة مدى الحياة.',
    },
    {
      id: 8,
      question: 'ما هي أفضل طريقة للدراسة على المنصة؟',
      options: ['القراءة فقط', 'الممارسة اليومية المنتظمة', 'الاختبارات فقط', 'مشاهدة الفيديوهات'],
      correctAnswer: 1,
      explanation: 'الممارسة اليومية المنتظمة هي الطريقة الأفضل.',
    },
    {
      id: 9,
      question: 'هل يمكن مشاركة الشهادة على LinkedIn؟',
      options: ['لا', 'نعم', 'فقط للشهادات المدفوعة', 'بعد موافقة الإدارة'],
      correctAnswer: 1,
      explanation: 'يمكن مشاركة جميع الشهادات على LinkedIn.',
    },
    {
      id: 10,
      question: 'ما هي لغة الواجهة الرئيسية في المنصة؟',
      options: ['الإنجليزية', 'الفرنسية', 'العربية', 'الإسبانية'],
      correctAnswer: 2,
      explanation: 'الواجهة الرئيسية باللغة العربية.',
    },
  ],
};

// اختبار خبير AI بالعربية
const aiExam: ExamData = {
  certificateId: 'ai-expert-arabic',
  questions: [
    {
      id: 1,
      question: 'ما هو الذكاء الاصطناعي؟',
      options: [
        'برنامج حاسوبي عادي',
        'قدرة الآلات على محاكاة الذكاء البشري',
        'نوع من قواعد البيانات',
        'برنامج تشغيل الحاسوب',
      ],
      correctAnswer: 1,
      explanation: 'الذكاء الاصطناعي هو قدرة الآلات على محاكاة الذكاء البشري والتعلم منه.',
    },
    {
      id: 2,
      question: 'ما هي الشبكات العصبية الاصطناعية؟',
      options: [
        'شبكات إنترنت سريعة',
        'نظم حاسوبية مستوحاة من الدماغ البشري',
        'كابلات الألياف الضوئية',
        'شبكات التواصل الاجتماعي',
      ],
      correctAnswer: 1,
      explanation: 'الشبكات العصبية هي نظم حاسوبية مستوحاة من طريقة عمل الدماغ البشري.',
    },
    {
      id: 3,
      question: 'ما هو التعلم الآلي Machine Learning؟',
      options: [
        'تعلم الآلات من البيانات دون برمجة صريحة',
        'برمجة الآلات يدوياً',
        'تصليح الآلات',
        'تشغيل الآلات',
      ],
      correctAnswer: 0,
      explanation: 'التعلم الآلي هو قدرة الآلات على التعلم من البيانات دون برمجة صريحة.',
    },
    {
      id: 4,
      question: 'ما هو NLP؟',
      options: [
        'بروتوكول شبكات',
        'معالجة اللغة الطبيعية',
        'نظام تشغيل',
        'لغة برمجة'],
      correctAnswer: 1,
      explanation: 'NLP هو اختصار لـ Natural Language Processing أي معالجة اللغة الطبيعية.',
    },
    {
      id: 5,
      question: 'ما هي خصائص معالجة اللغة العربية؟',
      options: [
        'بسيطة كالإنجليزية',
        'تتطلب معالجة خاصة للجذور والصرف',
        'لا تحتاج معالجة',
        'مستحيلة المعالجة'],
      correctAnswer: 1,
      explanation: 'اللغة العربية تتطلب معالجة خاصة للجذور والصرف بسبب تعقيدها.',
    },
    {
      id: 6,
      question: 'ما هو التعلم العميق Deep Learning؟',
      options: [
        'نوع من قواعد البيانات',
        'شبكات عصبية متعددة الطبقات',
        'برنامج تعليمي',
        'نوع من الذاكرة'],
      correctAnswer: 1,
      explanation: 'التعلم العميق يستخدم شبكات عصبية متعددة الطبقات للتعلم.',
    },
    {
      id: 7,
      question: 'ما هو TensorFlow؟',
      options: [
        'لغة برمجة',
        'إطار عمل للتعلم الآلي من Google',
        'قاعدة بيانات',
        'نظام تشغيل'],
      correctAnswer: 1,
      explanation: 'TensorFlow هو إطار عمل مفتوح المصدر للتعلم الآلي من Google.',
    },
    {
      id: 8,
      question: 'ما هي الخوارزمية الأنسب للتصنيف Classification؟',
      options: [
        'K-Means',
        'Linear Regression',
        'Decision Tree',
        'PCA'],
      correctAnswer: 2,
      explanation: 'شجرة القرار Decision Tree من الخوارزميات الشائعة للتصنيف.',
    },
    {
      id: 9,
      question: 'ما هو الـ Overfitting؟',
      options: [
        'أداء جيد على البيانات الجديدة',
        'أداء ممتاز على بيانات التدريب وضعيف على الجديدة',
        'تعلم سريع',
        'تحسين الأداء'],
      correctAnswer: 1,
      explanation: 'Overfitting هو عندما يتعلم النموذج بيانات التدريب بشكل مفرط ولا يعمم جيداً.',
    },
    {
      id: 10,
      question: 'ما هي أفضل طريقة لتحسين نموذج AI؟',
      options: [
        'زيادة البيانات فقط',
        'استخدام المزيد من الطبقات فقط',
        'مزيج من البيانات والهندسة المعمارية المناسبة',
        'تقليل وقت التدريب'],
      correctAnswer: 2,
      explanation: 'تحسين النموذج يتطلب مزيجاً من البيانات الجيدة والهندسة المعمارية المناسبة.',
    },
  ],
};

// اختبار مطور ويب محترف
const webExam: ExamData = {
  certificateId: 'web-developer-pro',
  questions: [
    {
      id: 1,
      question: 'ما هو HTML؟',
      options: [
        'لغة برمجة',
        'لغة ترميز لإنشاء صفحات الويب',
        'قاعدة بيانات',
        'نظام تشغيل'],
      correctAnswer: 1,
      explanation: 'HTML هي لغة ترميز تُستخدم لإنشاء وهيكل صفحات الويب.',
    },
    {
      id: 2,
      question: 'ما الفرق بين CSS و JavaScript؟',
      options: [
        'لا فرق بينهما',
        'CSS للتنسيق و JavaScript للتفاعلية',
        'JavaScript للتنسيق و CSS للتفاعلية',
        'كلاهما للتنسيق'],
      correctAnswer: 1,
      explanation: 'CSS مسؤول عن التنسيق والمظهر، بينما JavaScript مسؤول عن التفاعلية.',
    },
    {
      id: 3,
      question: 'ما هو React؟',
      options: [
        'قاعدة بيانات',
        'مكتبة JavaScript لبناء واجهات المستخدم',
        'لغة برمجة',
        'نظام تشغيل'],
      correctAnswer: 1,
      explanation: 'React هي مكتبة JavaScript مفتوحة المصدر لبناء واجهات المستخدم.',
    },
    {
      id: 4,
      question: 'ما هو الـ DOM؟',
      options: [
        'نوع من قواعد البيانات',
        'نموذج كائن المستند لتمثيل صفحة الويب',
        'لغة برمجة',
        'بروتوكول شبكة'],
      correctAnswer: 1,
      explanation: 'DOM هو نموذج كائن المستند الذي يمثل بنية صفحة الويب.',
    },
    {
      id: 5,
      question: 'ما هو Node.js؟',
      options: [
        'إطار عمل JavaScript للواجهة الأمامية',
        'بيئة تشغيل JavaScript على الخادم',
        'قاعدة بيانات',
        'متصفح ويب'],
      correctAnswer: 1,
      explanation: 'Node.js هي بيئة تشغيل تسمح بتنفيذ JavaScript على الخادم.',
    },
    {
      id: 6,
      question: 'ما هي API؟',
      options: [
        'نظام تشغيل',
        'واجهة برمجة التطبيقات',
        'لغة برمجة',
        'قاعدة بيانات'],
      correctAnswer: 1,
      explanation: 'API هي واجهة برمجة التطبيقات التي تسمح للتطبيقات بالتواصل.',
    },
    {
      id: 7,
      question: 'ما هو Responsive Design؟',
      options: [
        'تصميم ثابت',
        'تصميم يتكيف مع أحجام الشاشات المختلفة',
        'تصميم للطباعة فقط',
        'تصميم للموبايل فقط'],
      correctAnswer: 1,
      explanation: 'Responsive Design هو تصميم يتكيف تلقائياً مع أحجام الشاشات المختلفة.',
    },
    {
      id: 8,
      question: 'ما هو الـ REST API؟',
      options: [
        'نوع من قواعد البيانات',
        'نمط معماري للوصول للموارد عبر HTTP',
        'لغة برمجة',
        'مكتبة JavaScript'],
      correctAnswer: 1,
      explanation: 'REST API هو نمط معماري للوصول للموارد عبر بروتوكول HTTP.',
    },
    {
      id: 9,
      question: 'ما هي أفضل طريقة لتحسين أداء موقع الويب؟',
      options: [
        'زيادة حجم الصور',
        'ضغط الملفات وتقليل طلبات HTTP',
        'إضافة المزيد من الأكواد',
        'استخدام قاعدة بيانات أكبر'],
      correctAnswer: 1,
      explanation: 'تحسين الأداء يتم عبر ضغط الملفات وتقليل طلبات HTTP.',
    },
    {
      id: 10,
      question: 'ما هو الإصدار الحالي من HTML؟',
      options: ['HTML4', 'HTML5', 'HTML6', 'XHTML'],
      correctAnswer: 1,
      explanation: 'HTML5 هو الإصدار الحالي والأحدث من HTML.',
    },
  ],
};

// اختبار محلل بيانات
const dataExam: ExamData = {
  certificateId: 'data-analyst',
  questions: [
    {
      id: 1,
      question: 'ما هو تحليل البيانات؟',
      options: [
        'حذف البيانات',
        'عملية فحص وتنظيف وتحويل البيانات لاستخلاص رؤى',
        'إنشاء البيانات',
        'طباعة البيانات'],
      correctAnswer: 1,
      explanation: 'تحليل البيانات هو عملية فحص وتنظيف وتحويل البيانات لاستخلاص رؤى مفيدة.',
    },
    {
      id: 2,
      question: 'ما هي Python؟',
      options: [
        'نوع من الثعابين',
        'لغة برمجة شائعة في تحليل البيانات',
        'قاعدة بيانات',
        'نظام تشغيل'],
      correctAnswer: 1,
      explanation: 'Python هي لغة برمجة شائعة جداً في تحليل البيانات والذكاء الاصطناعي.',
    },
    {
      id: 3,
      question: 'ما هو SQL؟',
      options: [
        'لغة برمجة ويب',
        'لغة الاستعلام الهيكلية لقواعد البيانات',
        'نظام تشغيل',
        'برنامج تصفح'],
      correctAnswer: 1,
      explanation: 'SQL هي لغة الاستعلام الهيكلية المستخدمة للتعامل مع قواعد البيانات.',
    },
    {
      id: 4,
      question: 'ما هي مكتبة Pandas؟',
      options: [
        'مكتبة للرسومات',
        'مكتبة Python لمعالجة البيانات',
        'قاعدة بيانات',
        'لغة برمجة'],
      correctAnswer: 1,
      explanation: 'Pandas هي مكتبة Python قوية لمعالجة وتحليل البيانات.',
    },
    {
      id: 5,
      question: 'ما هو تصور البيانات Data Visualization؟',
      options: [
        'طباعة البيانات',
        'تمثيل البيانات بشكل مرئي كرسوم بيانية',
        'حذف البيانات',
        'تشفير البيانات'],
      correctAnswer: 1,
      explanation: 'تصور البيانات هو تمثيل البيانات بشكل مرئي مثل الرسوم البيانية.',
    },
    {
      id: 6,
      question: 'ما هو Tableau؟',
      options: [
        'لغة برمجة',
        'أداة تصور بيانات وتحليلها',
        'قاعدة بيانات',
        'نظام تشغيل'],
      correctAnswer: 1,
      explanation: 'Tableau هي أداة قوية لتصور البيانات وتحليلها.',
    },
    {
      id: 7,
      question: 'ما هو المتوسط Mean؟',
      options: [
        'أكبر قيمة',
        'مجموع القيم مقسوماً على عددها',
        'أصغر قيمة',
        'القيمة المتكررة'],
      correctAnswer: 1,
      explanation: 'المتوسط هو مجموع جميع القيم مقسوماً على عددها.',
    },
    {
      id: 8,
      question: 'ما هو الوسيط Median؟',
      options: [
        'مجموع القيم',
        'القيمة الوسطى عند ترتيب البيانات',
        'المتوسط',
        'القيمة الأكثر تكراراً'],
      correctAnswer: 1,
      explanation: 'الوسيط هو القيمة الوسطى عند ترتيب البيانات تصاعدياً.',
    },
    {
      id: 9,
      question: 'ما هو التنظيف Data Cleaning؟',
      options: [
        'حذف جميع البيانات',
        'إزالة الأخطاء والقيم المفقودة من البيانات',
        'نسخ البيانات',
        'تشفير البيانات'],
      correctAnswer: 1,
      explanation: 'تنظيف البيانات هو إزالة الأخطاء والقيم المفقودة والشاذة.',
    },
    {
      id: 10,
      question: 'ما هو الهدف الرئيسي من تحليل البيانات؟',
      options: [
        'تخزين البيانات',
        'استخلاص رؤى تدعم اتخاذ القرارات',
        'طباعة البيانات',
        'حذف البيانات'],
      correctAnswer: 1,
      explanation: 'الهدف الرئيسي هو استخلاص رؤى مفيدة تدعم اتخاذ قرارات أفضل.',
    },
  ],
};

// اختبار خبير أمن سيبراني
const cyberExam: ExamData = {
  certificateId: 'cybersecurity-expert',
  questions: [
    {
      id: 1,
      question: 'ما هو الأمن السيبراني؟',
      options: [
        'حماية الأجهزة فقط',
        'حماية الأنظمة والشبكات من الهجمات الرقمية',
        'تشفير البيانات فقط',
        'تصميم الشبكات'],
      correctAnswer: 1,
      explanation: 'الأمن السيبراني هو حماية الأنظمة والشبكات والبيانات من الهجمات الرقمية.',
    },
    {
      id: 2,
      question: 'ما هو التشفير Encryption؟',
      options: [
        'حذف البيانات',
        'تحويل البيانات لصيغة غير مقروءة لحمايتها',
        'نسخ البيانات',
        'ضغط البيانات'],
      correctAnswer: 1,
      explanation: 'التشفير هو تحويل البيانات لصيغة غير مقروءة لحمايتها من الوصول غير المصرح.',
    },
    {
      id: 3,
      question: 'ما هو الـ Phishing؟',
      options: [
        'نوع من الفيروسات',
        'هجوم احتيالي للحصول على معلومات حساسة',
        'برنامج حماية',
        'نوع من التشفير'],
      correctAnswer: 1,
      explanation: 'Phishing هو هجوم احتيالي يستخدم رسائل مزيفة للحصول على معلومات حساسة.',
    },
    {
      id: 4,
      question: 'ما هو الـ Firewall؟',
      options: [
        'فيروس',
        'جدار حماية يراقب حركة الشبكة',
        'برنامج تصفح',
        'قاعدة بيانات'],
      correctAnswer: 1,
      explanation: 'Firewall هو جدار حماية يراقب ويتحكم في حركة البيانات عبر الشبكة.',
    },
    {
      id: 5,
      question: 'ما هي كلمة المرور القوية؟',
      options: [
        'كلمة من 4 حروف',
        'مزيج من حروف وأرقام ورموز بطول 12+',
        'اسم المستخدم',
        'تاريخ الميلاد'],
      correctAnswer: 1,
      explanation: 'كلمة المرور القوية تحتوي على مزيج من الحروف والأرقام والرموز بطول 12 حرف على الأقل.',
    },
    {
      id: 6,
      question: 'ما هو اختبار الاختراق Penetration Testing؟',
      options: [
        'اختراق حقيقي',
        'محاكاة هجوم لاكتشاف الثغرات الأمنية',
        'تشفير البيانات',
        'تصميم الشبكة'],
      correctAnswer: 1,
      explanation: 'اختبار الاختراق هو محاكاة هجوم لاكتشاف الثغرات الأمنية قبل استغلالها.',
    },
    {
      id: 7,
      question: 'ما هو الـ Malware؟',
      options: [
        'برنامج حماية',
        'برمجيات خبيثة تضر بالنظام',
        'نظام تشغيل',
        'قاعدة بيانات'],
      correctAnswer: 1,
      explanation: 'Malware هي البرمجيات الخبيثة مثل الفيروسات والبرمجيات الخادعة.',
    },
    {
      id: 8,
      question: 'ما هو الـ VPN؟',
      options: [
        'نوع من الفيروسات',
        'شبكة افتراضية خاصة لتأمين الاتصال',
        'برنامج تصفح',
        'قاعدة بيانات'],
      correctAnswer: 1,
      explanation: 'VPN هي شبكة افتراضية خاصة تشفر الاتصال وتحمي الخصوصية.',
    },
    {
      id: 9,
      question: 'ما هو الـ DDoS Attack؟',
      options: [
        'هجوم فيروسي',
        'هجوم يحاول إغراق الخادم بالطلبات',
        'برنامج حماية',
        'نوع من التشفير'],
      correctAnswer: 1,
      explanation: 'DDoS هو هجوم يغرق الخادم بطلبات كثيرة لإيقافه عن العمل.',
    },
    {
      id: 10,
      question: 'ما هي أفضل طريقة للحماية من الهجمات؟',
      options: [
        'عدم استخدام الإنترنت',
        'التحديث المنتظم واستخدام برامج الحماية',
        'مشاركة كلمة المرور',
        'تشفير الأجهزة فقط'],
      correctAnswer: 1,
      explanation: 'أفضل طريقة هي التحديث المنتظم واستخدام برامج الحماية وكلمات مرور قوية.',
    },
  ],
};

export const exams: Record<string, ExamData> = {
  'almarjaa-developer': almarjaaExam,
  'ai-expert-arabic': aiExam,
  'web-developer-pro': webExam,
  'data-analyst': dataExam,
  'cybersecurity-expert': cyberExam,
};

export function getExamById(certificateId: string): ExamData | undefined {
  return exams[certificateId];
}

export function calculateScore(answers: Record<number, number>, certificateId: string): { score: number; percentage: number; passed: boolean; correctCount: number; totalCount: number } {
  const exam = getExamById(certificateId);
  if (!exam) return { score: 0, percentage: 0, passed: false, correctCount: 0, totalCount: 0 };

  const certificate = getCertificateById(certificateId);
  if (!certificate) return { score: 0, percentage: 0, passed: false, correctCount: 0, totalCount: 0 };

  let correctCount = 0;
  exam.questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / exam.questions.length) * 100);
  const passed = percentage >= certificate.passingScore;

  return {
    score: correctCount,
    percentage,
    passed,
    correctCount,
    totalCount: exam.questions.length,
  };
}
