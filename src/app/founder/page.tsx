'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import {
  Award,
  Brain,
  Code,
  Rocket,
  Globe,
  Lightbulb,
  Target,
  Trophy,
  Star,
  Heart,
  BookOpen,
  Users,
  BadgeCheck,
  Sparkles,
  Zap,
  ChevronLeft,
  Quote,
  Github,
  Mail,
  Calendar,
  GraduationCap,
  Briefcase,
  Flame,
  ExternalLink,
  Crown,
  Cpu,
  Settings,
  PenTool,
  Layers,
  Database,
  Cog,
  Network,
  BookMarked,
  MessageSquare,
  Languages
} from 'lucide-react';

// ============================================
// Animated Counter
// ============================================
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count.toLocaleString('en-US')}{suffix}</span>;
}

// ============================================
// Timeline Item
// ============================================
function TimelineItem({ year, title, description, icon: Icon, isLast = false }: { 
  year: string; 
  title: string; 
  description: string; 
  icon: typeof Lightbulb;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-4 md:gap-8">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500 to-purple-600 my-2" />
        )}
      </div>
      
      <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-bold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
              {year}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Achievement Card
// ============================================
function AchievementCard({ icon: Icon, title, description, color }: { 
  icon: typeof Award; 
  title: string; 
  description: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 group hover:transform hover:scale-105">
      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================
// Skill Bar
// ============================================
function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(level), 200);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [level]);

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-300 font-medium">{name}</span>
        <span className="text-slate-500 text-sm">{level}%</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// JSON-LD Structured Data for Founder
// ============================================
const founderJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "رضوان دالي حمدوني",
  "alternateName": "Radhwen Daly Hamdouni",
  "jobTitle": "مخترع لغة المرجع",
  "description": "مخترع لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. رائد أعمال تونسي، خبير في الذكاء الاصطناعي والتحول الرقمي، يحمل ماجستير في الأنظمة الميكاترونية. كاتب وأديب يجمع بين التقنية والأدب.",
  "url": "https://ecertifpro.com/founder",
  "image": "https://ecertifpro.com/founder.png",
  "nationality": "تونسية",
  "knowsAbout": [
    "تصميم لغات البرمجة",
    "الذكاء الاصطناعي",
    "Rust",
    "الميكاترونكس",
    "التحول الرقمي",
    "الأدب العربي",
    "ريادة الأعمال"
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "جامعة تونسية",
    "description": "ماجستير في الأنظمة الميكاترونية"
  },
  "founder": {
    "@type": "Organization",
    "name": "لغة المرجع",
    "url": "https://github.com/radhwendalyhamdouni/Al-Marjaa-Language"
  },
  "sameAs": [
    "https://github.com/radhwendalyhamdouni"
  ]
};

const languageJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "لغة المرجع",
  "alternateName": "Al-Marjaa Language",
  "description": "أول لغة برمجة AI-أصيلة بالعربية، مبنية من الصفر باستخدام Rust. تدمج الذكاء الاصطناعي في صميمها وتدعم البنية التحتية للحوسبة منخفضة الموارد.",
  "url": "https://github.com/radhwendalyhamdouni/Al-Marjaa-Language",
  "applicationCategory": "ProgrammingLanguage",
  "operatingSystem": "Cross-platform",
  "programmingLanguage": "Rust",
  "inLanguage": "ar",
  "author": {
    "@type": "Person",
    "name": "رضوان دالي حمدوني"
  }
};

// ============================================
// Main Page
// ============================================
export default function FounderPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const achievements = [
    {
      icon: BadgeCheck,
      title: 'مخترع لغة المرجع',
      description: 'أول لغة برمجة AI-أصيلة بالعربية، مبنية من الصفر باستخدام Rust بمجهود فردي بحت',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-600'
    },
    {
      icon: Brain,
      title: 'خبير الذكاء الاصطناعي',
      description: 'خبرة عميقة في AI وتطبيقاته، مؤسس SearchGenPro AI و BookGenPro AI',
      color: 'bg-gradient-to-br from-purple-500 to-pink-600'
    },
    {
      icon: Cpu,
      title: 'مهندس ميكاترونكس',
      description: 'ماجستير في الأنظمة الميكاترونية، دمج الهندسة الميكانيكية مع البرمجيات',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600'
    },
    {
      icon: PenTool,
      title: 'أديب وكاتب متعدد',
      description: 'مؤلف شعري وفكري وروائي، نادر في عصرنا من يجمع بين التقنية والأدب',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: 'رائد أعمال ومؤسس',
      description: 'مؤسس ECPMind و Master Cup، ريادة أعمال في مجالات صناعية ورقمية متنوعة',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    },
    {
      icon: Trophy,
      title: 'مرجع علمي نادر',
      description: 'اسمه المرجع - اسم أطلقه على لغته، فهو مرجع في علوم متعددة نادرة في عصرنا',
      color: 'bg-gradient-to-br from-red-500 to-rose-600'
    }
  ];

  const skills = [
    { name: 'تصميم اللغات البرمجية', level: 95, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { name: 'Rust & Systems Programming', level: 92, color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { name: 'الذكاء الاصطناعي وتعلم الآلة', level: 93, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { name: 'هندسة الميكاترونكس', level: 90, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { name: 'إدارة المشاريع التقنية', level: 88, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { name: 'التحول الرقمي', level: 91, color: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { name: 'الكتابة الأدبية والعلمية', level: 85, color: 'bg-gradient-to-r from-rose-500 to-pink-500' }
  ];

  const specializations = [
    { icon: Brain, title: 'الذكاء الاصطناعي', description: 'حلول AI متقدمة واستشارات تقنية' },
    { icon: Cpu, title: 'الميكاترونكس', description: 'تصميم أنظمة ميكانيكية وبرمجية متكاملة' },
    { icon: Code, title: 'تطوير البرمجيات', description: 'بناء لغات برمجة وأنظمة معقدة' },
    { icon: Settings, title: 'الأتمتة الصناعية', description: 'حلول أتمتة للقطاع الصناعي' },
    { icon: Layers, title: 'التحول الرقمي', description: 'استراتيجيات تحول رقمي شاملة' },
    { icon: PenTool, title: 'الكتابة والأدب', description: 'شعر، روائية، وكتابات فكرية' },
  ];

  const companies = [
    { name: 'ECPMind', description: 'منصة الشهادات المهنية والتدريب المتخصص', icon: Award },
    { name: 'Master Cup', description: 'حلول تغليف ذكية ومستدامة', icon: Globe },
    { name: 'لغة المرجع', description: 'أول لغة برمجة AI-أصيلة بالعربية', icon: Code },
  ];

  const timeline = [
    {
      year: 'البداية',
      title: 'شغف بالعلم والابتكار',
      description: 'بدأ رضوان رحلته مع العلم والمعرفة منذ الصغر، مدفوعاً بشغف عميق لفهم كيفية عمل الأنظمة والحاسوب. قضى سنوات في التعلم الذاتي والبحث، متنقلاً بين مجالات علمية متعددة - من الهندسة إلى البرمجة، من الفيزياء إلى الذكاء الاصطناعي.',
      icon: Flame
    },
    {
      year: 'التخصص',
      title: 'ماجستير في الميكاترونكس',
      description: 'حصل رضوان على درجة الماجستير في الأنظمة الميكاترونية، حيث تعلم دمج الهندسة الميكانيكية مع الإلكترونيات والبرمجيات. هذه الخلفية متعددة التخصصات كانت الأساس لفهمه العميق للأنظمة المعقدة.',
      icon: GraduationCap
    },
    {
      year: 'الريادة',
      title: 'تأسيس المشاريع الريادية',
      description: 'أسس رضوان عدة مشاريع ريادية: ECPMind للشهادات المهنية، و Master Cup للحلول المستدامة. كل مشروع كان فرصة لتطبيق معرفته المتنوعة في حل مشاكل واقعية.',
      icon: Rocket
    },
    {
      year: 'الإبداع',
      title: 'رحلة الكتابة والأدب',
      description: 'بالإضافة إلى مساره التقني، كان رضوان دائماً كاتباً في جوهره. ألف أعمالاً شعرية وروائية وفكرية. هذا الجمع بين التقنية والأدب نادر في عصرنا، وهو ما يميز منهجه في الحياة والعمل.',
      icon: PenTool
    },
    {
      year: 'الثورة',
      title: 'إنشاء لغة المرجع',
      description: 'بمجهود فردي بحت، ومن خلفية علمية متنوعة تشمل البرمجة والذكاء الاصطناعي والهندسة واللغة، أسس رضوان لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. اللغة مبنية على Rust وتدمج الذكاء الاصطناعي في صميمها.',
      icon: Code
    },
    {
      year: 'المستقبل',
      title: 'بناء منظومة تقنية عربية',
      description: 'يعمل رضوان الآن على تطوير المنظومة التقنية العربية الشاملة: لغة المرجع، بيئات التطوير، المكتبات، والمجتمع. هدفه تمكين جيل كامل من المبرمجين العرب من الابتكار بلغتهم.',
      icon: Crown
    }
  ];

  const stats = [
    { value: 10, suffix: '+', label: 'سنوات خبرة', icon: Calendar },
    { value: 50, suffix: '+', label: 'مشروع مكتمل', icon: Briefcase },
    { value: 20, suffix: 'K+', label: 'مستفيد', icon: Users },
    { value: 7, suffix: '+', label: 'تخصصات متنوعة', icon: Lightbulb }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'الابتكار',
      description: 'يؤمن رضوان بأن الابتكار يأتي من تداخل العلوم. خبرته المتنوعة سمحت له برؤية حلول لا يراها المتخصصون في مجال واحد.'
    },
    {
      icon: Heart,
      title: 'العطاء',
      description: 'من واجبنا تجاه أمتنا أن نشارك ما نعرفه. أسس رضوان لغة المرجع لتمكين الملاي��ن من الناطقين بالعربية.'
    },
    {
      icon: Target,
      title: 'التميز',
      description: 'لا يقبل رضوان بالقليل. يسعى دائماً للتميز في كل ما يقوم به، سواء في التقنية أو الأدب أو ريادة الأعمال.'
    },
    {
      icon: Users,
      title: 'المجتمع',
      description: 'اللغة ليست مجرد كود، بل منظومة متكاملة. يبني رضوان مجتمعاً من المبرمجين العرب الذين يدعمون بعضهم.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden" dir="rtl">
      {/* JSON-LD Structured Data */}
      <Script
        id="founder-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }}
      />
      <Script
        id="language-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(languageJsonLd) }}
      />
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"
          style={{ 
            transform: `translate(${Math.sin(scrollY * 0.001) * 100}px, ${scrollY * 0.1}px)`,
            top: '-200px',
            right: '-200px'
          }} 
        />
        <div 
          className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
          style={{ 
            transform: `translate(${Math.cos(scrollY * 0.001) * 100}px, ${scrollY * 0.05}px)`,
            bottom: '200px',
            left: '-200px'
          }} 
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ECERTIFPRO
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">الرئيسية</Link>
              <Link href="/learn" className="text-slate-400 hover:text-white transition-colors">التعلم</Link>
              <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">تواصل معنا</Link>
              <Link href="/founder" className="text-white font-medium">المؤسس</Link>
            </div>

            <Link 
              href="/" 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">العودة</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 border border-blue-500/20 rounded-full animate-pulse" />
          <div className="absolute bottom-40 left-20 w-24 h-24 border border-purple-500/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
          <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center md:text-right order-2 md:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full text-yellow-400 text-sm mb-6 backdrop-blur-sm border border-yellow-500/30">
                <Crown className="w-4 h-4" />
                <span>المؤسس والمخترع</span>
              </div>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  رضوان دالي حمدوني
                </span>
              </h1>

              {/* Title Tags */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium border border-blue-500/30">
                  مخترع لغة المرجع
                </span>
                <span className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
                  رائد أعمال
                </span>
                <span className="px-4 py-2 bg-green-500/20 rounded-full text-green-300 text-sm font-medium border border-green-500/30">
                  كاتب وأديب
                </span>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 relative mb-8">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-500/30" />
                <p className="text-lg text-slate-200 leading-relaxed font-medium">
                  &quot;المرجع - اسم اخترته لتمثيل لغتي، لأنه في جوهره يعكس إيماني العميق بأن من يجمع بين علوم متعددة يصبح بحق مرجعاً لأمته. في عصرنا، أصبح هذا الأمر نادراً، لكنني على يقين بأن هذا هو الطريق إلى الريادة. لغة المرجع ليست مجرد لغة برمجة، بل هي امتداد حيوي للحضارة العربية، وسلّم يعزز إرثنا الثقافي ويسهم في إثرائه، متخطياً حدود الزمان والمكان. هي بمثابة إحياء لمجدنا الذي لطالما كان سباقاً في مجالات العلم والتكنولوجيا، مجد عريق يعيد اليوم بصمته في الثورة المعرفية والتكنولوجية التي نشهدها.&quot;
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link
                  href="/learn"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span>تعلم لغة المرجع</span>
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <a
                  href="https://github.com/radhwendalyhamdouni/Al-Marjaa-Language"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  <span>لغة المرجع على GitHub</span>
                </a>
                <a
                  href="https://www.academia.edu/165043017/Al_Marjaa_An_AI_Native_Arabic_Programming_Language_for_Modern_Software_Development_%D9%84%D8%AA%D8%B7%D9%88%D9%8A%D8%B1_%D8%A7%D8%AA%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A_%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1_%D9%85%D8%B9_%D9%85%D8%AA%D9%83%D8%A7%D9%85%D9%84%D8%A9_%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9_%D8%A8%D8%B1%D9%85%D8%AC%D8%A9_%D9%84%D8%BA%D8%A9_%D8%A7%D9%84%D9%85%D8%B1%D8%AC%D8%B9_%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AB%D8%A9_%D8%A7%D9%84%D8%A8%D8%B1%D9%85%D8%AC%D9%8A%D8%A7%D8%AA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>الورقة البحثية</span>
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                
                {/* Image Container */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30">
                  <Image
                    src="/founder.png"
                    alt="رضوان دالي حمدوني - مؤسس لغة المرجع"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                </div>
                
                {/* Floating Badges */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-yellow-500/50 animate-bounce">
                  <Star className="w-4 h-4 inline ml-1" />
                  مخترع
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/50">
                  <Languages className="w-4 h-4 inline ml-1" />
                  مؤسس اللغة
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-500 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center hover:border-blue-500/50 transition-all duration-300 group"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                نبوغ نادر في عصرنا
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              جمع بين التقنية والهندسة والأدب - مسيرة فريدة
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bio */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                السيرة الذاتية
              </h3>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">رضوان دالي حمدوني</strong>، رائد أعمال تونسي شغوف وخبير في 
                  <strong className="text-blue-400"> الذكاء الاصطناعي</strong> و
                  <strong className="text-purple-400"> التحول الرقمي</strong>. يحمل درجة الماجستير في 
                  <strong className="text-green-400"> الأنظمة الميكاترونية</strong> مع خبرة قوية في إدارة المشاريع.
                </p>
                <p>
                  يؤمن رضوان بأن الحلول التقنية الحقيقية تأتي من <strong className="text-white">تداخل العلوم</strong>. خبرته المتنوعة سمحت له ببناء لغة برمجة كاملة من الصفر بمجهود فردي - وهو ما نادراً ما يحدث في عصرنا.
                </p>
                <p>
                  بصفته مؤسس <strong className="text-blue-400">ECPMind</strong>، يقدم حلولاً تدمج بين الهندسة الميكانيكية والبرمجيات المتقدمة. فريقه يجمع بين التصميم ثلاثي الأبعاد والأتمتة الصناعية والذكاء الاصطناعي.
                </p>
                <p className="border-t border-slate-700 pt-4">
                  <strong className="text-yellow-400">ولكن ما يميزه حقاً</strong> - أنه ليس مهندساً ومبرمجاً فحسب، بل هو أيضاً 
                  <strong className="text-pink-400"> كاتب وأديب</strong>. لديه مؤلفات شعرية وفكرية وروائية. هذا الجمع بين 
                  <strong className="text-white"> التقنية والأدب</strong> نادر في عصرنا، وهو ما جعله قادراً على فهم اللغة العربية عميقاً وبناء لغة برمجة تحترم تراكيبها.
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                المهارات والخبرات
              </h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <SkillBar key={index} {...skill} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                تخصصات متنوعة - نادرة في عصرنا
              </span>
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              الجمع بين هذه المجالات المتعددة هو ما مكّ��ه من إنشاء لغة برمجة كاملة بمجهود فردي
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <div 
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <spec.icon className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{spec.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                الإنجازات والابتكارات
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              بصمة تقنية وأدبية تمتد لتشمل مجالات متعددة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} {...achievement} />
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                المشاريع المؤسسة
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {companies.map((company, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex items-center gap-6 hover:border-blue-500/50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <company.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{company.name}</h3>
                  <p className="text-slate-400">{company.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                مسيرة النبوغ
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              محطات فارقة في رحلة جمعت بين العلوم المتعددة
            </p>
          </div>

          <div className="space-y-4">
            {timeline.map((item, index) => (
              <TimelineItem 
                key={index} 
                {...item} 
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                القيم والمبادئ
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              مبادئ توجه كل خطوة في الطريق
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center hover:border-green-500/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-blue-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5" />
            <div className="relative z-10 text-center">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                المرجع - اسم ورسالة
              </h2>
              <p className="text-xl text-slate-200 leading-relaxed mb-8">
                اختار رضوان اسم &quot;المرجع&quot; للغته لأنه آمن أن من يجمع بين علوم متنوعة - التقنية والهندسة والأدب واللغة - 
                يمكن أن يكون مرجعاً لأمته. في عصرنا، نادر من يمتلك هذا التعدد. 
                لغة المرجع ليست مجرد أداة برمجية، بل هي جسر بين تراثنا اللغوي ومستقبلنا التقني.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300">لغة عربية أصيلة</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300">علوم متعددة</span>
                </div>
                <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                  <Rocket className="w-5 h-5 text-green-400" />
                  <span className="text-green-300">مجهود فردي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ابدأ رحلتك مع لغة المرجع
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            انضم إلى الآلاف من المتعلمين الذين بدأوا رحلتهم في عالم البرمجة بلغة المرجع
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learn"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>ابدأ التعلم مجاناً</span>
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span>تواصل معنا</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">ECERTIFPRO</span>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-500 text-sm">
            <Link href="/" className="hover:text-blue-400 transition-colors">الرئيسية</Link>
            <Link href="/learn" className="hover:text-blue-400 transition-colors">التعلم</Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">تواصل معنا</Link>
          </div>
          <p className="text-slate-600 text-xs mt-6">
            جميع الحقوق محفوظة © {new Date().getFullYear()} رضوان دالي حمدوني
          </p>
        </div>
      </footer>
    </div>
  );
}
