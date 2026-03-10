// بيانات الشهادات المهنية
export interface Certificate {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: 'programming' | 'ai' | 'web' | 'cybersecurity' | 'data';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  duration: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';
  skills: string[];
  image: string;
  passingScore: number;
  totalQuestions: number;
  examDuration: number; // بالدقائق
  featured: boolean;
}

export const categories = [
  { id: 'all', label: 'جميع الشهادات' },
  { id: 'programming', label: 'برمجة' },
  { id: 'ai', label: 'ذكاء اصطناعي' },
  { id: 'web', label: 'تطوير ويب' },
  { id: 'cybersecurity', label: 'أمن سيبراني' },
  { id: 'data', label: 'تحليل بيانات' },
];

export const certificates: Certificate[] = [
  {
    id: 'almarjaa-developer',
    title: 'مطور Al-Marjaa المعتمد',
    titleEn: 'Certified Al-Marjaa Developer',
    description: 'شهادة احترافية في استخدام منصة Al-Marjaa Language لتعلم اللغات. تثبت مهاراتك في الاستفادة من جميع ميزات المنصة وتطبيقها في رحلة التعلم.',
    category: 'programming',
    categoryLabel: 'برمجة',
    price: 199,
    originalPrice: 399,
    duration: '4 أسابيع',
    level: 'متوسط',
    skills: ['استخدام منصة Al-Marjaa', 'تعلم اللغات بفعالية', 'إدارة مسار التعلم', 'التطبيق العملي'],
    image: '/certificates/almarjaa-dev.png',
    passingScore: 70,
    totalQuestions: 30,
    examDuration: 45,
    featured: true,
  },
  {
    id: 'ai-expert-arabic',
    title: 'خبير AI بالعربية',
    titleEn: 'Arabic AI Expert',
    description: 'شهادة متقدمة في الذكاء الاصطناعي باللغة العربية. تغطي أساسيات التعلم الآلي، الشبكات العصبية، ومعالجة اللغة الطبيعية العربية.',
    category: 'ai',
    categoryLabel: 'ذكاء اصطناعي',
    price: 299,
    originalPrice: 599,
    duration: '8 أسابيع',
    level: 'متقدم',
    skills: ['التعلم الآلي', 'الشبكات العصبية', 'معالجة اللغة العربية', 'التعلم العميق', 'NLP'],
    image: '/certificates/ai-expert.png',
    passingScore: 75,
    totalQuestions: 40,
    examDuration: 60,
    featured: true,
  },
  {
    id: 'web-developer-pro',
    title: 'مطور ويب محترف',
    titleEn: 'Professional Web Developer',
    description: 'شهادة شاملة في تطوير الويب الحديث. تشمل HTML5, CSS3, JavaScript, React, Node.js وأفضل الممارسات في التصميم المتجاوب.',
    category: 'web',
    categoryLabel: 'تطوير ويب',
    price: 249,
    originalPrice: 499,
    duration: '6 أسابيع',
    level: 'متوسط',
    skills: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'Node.js', 'APIs', 'Responsive Design'],
    image: '/certificates/web-dev.png',
    passingScore: 70,
    totalQuestions: 35,
    examDuration: 50,
    featured: true,
  },
  {
    id: 'data-analyst',
    title: 'محلل بيانات معتمد',
    titleEn: 'Certified Data Analyst',
    description: 'شهادة في تحليل البيانات باستخدام Python و SQL. تعلم تنظيف البيانات، التحليل الإحصائي، والتصور البياني الاحترافي.',
    category: 'data',
    categoryLabel: 'تحليل بيانات',
    price: 279,
    originalPrice: 559,
    duration: '6 أسابيع',
    level: 'متوسط',
    skills: ['Python', 'SQL', 'تحليل إحصائي', 'تصور البيانات', 'Pandas', 'Tableau'],
    image: '/certificates/data-analyst.png',
    passingScore: 70,
    totalQuestions: 35,
    examDuration: 55,
    featured: false,
  },
  {
    id: 'cybersecurity-expert',
    title: 'خبير أمن سيبراني',
    titleEn: 'Cybersecurity Expert',
    description: 'شهادة متقدمة في الأمن السيبراني. تغطي اختبار الاختراق، التشفير، إدارة المخاطر، والاستجابة للحوادث الأمنية.',
    category: 'cybersecurity',
    categoryLabel: 'أمن سيبراني',
    price: 349,
    originalPrice: 699,
    duration: '10 أسابيع',
    level: 'خبير',
    skills: ['اختبار الاختراق', 'التشفير', 'إدارة المخاطر', 'الاستجابة للحوادث', 'Network Security'],
    image: '/certificates/cybersecurity.png',
    passingScore: 80,
    totalQuestions: 45,
    examDuration: 75,
    featured: false,
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد الغامدي',
    role: 'مطور برمجيات في Google',
    content: 'شهادات ECERTIFPRO غيرت مسيرتي المهنية بالكامل. المحتوى عالي الجودة والاختبارات الاحترافية جعلتني أثق في مهاراتي.',
    avatar: 'أ',
    rating: 5,
  },
  {
    id: 2,
    name: 'سارة عبدالله الفهد',
    role: 'مهندسة ذكاء اصطناعي في Microsoft',
    content: 'الحصول على شهادة خبير AI بالعربية فتح لي أبواباً كثيرة. أنصح بها كل من يريد دخول عالم الذكاء الاصطناعي.',
    avatar: 'س',
    rating: 5,
  },
  {
    id: 3,
    name: 'خالد إبراهيم العتيبي',
    role: 'محلل بيانات في Amazon',
    content: 'منصة رائعة وشهادات معترف بها. عملية التحقق من الشهادة سهلة وموثوقة جداً.',
    avatar: 'خ',
    rating: 5,
  },
  {
    id: 4,
    name: 'نورة سالم الشهري',
    role: 'مديرة تقنية في STC',
    content: 'استثمار ممتاز في تطوير مهاراتي. الشهادات عملية جداً وتعكس معرفة حقيقية.',
    avatar: 'ن',
    rating: 5,
  },
];

export const stats = {
  totalCertificates: 5,
  totalLearners: 15420,
  totalCompanies: 342,
  successRate: 94,
};

export const pricingPlans = [
  {
    id: 'starter',
    name: 'المبتدئ',
    price: 0,
    description: 'للبدء في رحلة التعلم',
    features: [
      'وصول لشهادة واحدة مجانية',
      'مواد تعليمية أساسية',
      'شهادة رقمية',
      'دعم عبر البريد الإلكتروني',
    ],
    recommended: false,
  },
  {
    id: 'professional',
    name: 'المحترف',
    price: 99,
    period: 'شهرياً',
    description: 'للمتقدمين في مسيرتهم المهنية',
    features: [
      'وصول لجميع الشهادات',
      'مواد تعليمية متقدمة',
      'شهادات رقمية ومطبوعة',
      'دعم أولوية 24/7',
      'جلسات إرشادية شهرية',
      'تقارير تقدم مفصلة',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'المؤسسات',
    price: null,
    period: '',
    description: 'للشركات والمؤسسات',
    features: [
      'تراخيص غير محدودة',
      'بوابة إدارة مخصصة',
      'تقارير تحليلية متقدمة',
      'تكامل مع أنظمة HR',
      'دعم مخصص ومدير حساب',
      'شهادات خاصة بالشركة',
    ],
    recommended: false,
  },
];

export function getCertificateById(id: string): Certificate | undefined {
  return certificates.find(c => c.id === id);
}

export function generateCertificateNumber(): string {
  const prefix = 'ECERT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
