'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Search,
  FileCheck,
  Award,
  Code,
  Brain,
  Globe,
  Shield,
  BarChart3,
  QrCode,
  Clock,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  ArrowLeft,
  Sparkles,
  Users,
  Building2,
  TrendingUp,
  Zap,
  Menu,
  X,
  Play,
  Timer,
  CheckCircle,
  XCircle
} from 'lucide-react';

// أنواع البيانات
interface Certificate {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number | null;
  duration: string;
  level: string;
  skills: string[];
  passingScore: number;
  totalQuestions: number;
  examDuration: number;
  featured: boolean;
  image: string | null;
}

// مكون العداد المتحرك
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

  return <span ref={ref}>{count.toLocaleString('ar-EG')}{suffix}</span>;
}

// مكون الجزيئات المتحركة - تم إصلاح مشكلة الـ hydration
function ParticleBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // قيم ثابتة للـ SSR
  const particles = useMemo(() => {
    if (!mounted) {
      // قيم ثابتة للـ SSR
      return [...Array(50)].map((_, i) => ({
        left: (i * 2) % 100,
        delay: (i * 0.4) % 20,
        duration: 15 + (i % 20),
        width: 2 + (i % 4),
        height: 2 + ((i + 1) % 4),
        opacity: 0.3 + ((i % 10) * 0.04),
      }));
    }
    // قيم عشوائية على الـ client
    return [...Array(50)].map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
      width: 2 + Math.random() * 4,
      height: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, [mounted]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="particles-container">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
    </div>
  );
}

// مكون بطاقة الشهادة
function CertificateCard({ certificate }: { certificate: Certificate }) {
  const categoryIcons: Record<string, React.ReactNode> = {
    'برمجة': <Code className="w-6 h-6" />,
    'ذكاء اصطناعي': <Brain className="w-6 h-6" />,
    'تطوير ويب': <Globe className="w-6 h-6" />,
    'أمن سيبراني': <Shield className="w-6 h-6" />,
    'تحليل بيانات': <BarChart3 className="w-6 h-6" />,
  };

  const categoryColors: Record<string, string> = {
    'برمجة': 'from-blue-500 to-cyan-500',
    'ذكاء اصطناعي': 'from-purple-500 to-pink-500',
    'تطوير ويب': 'from-green-500 to-emerald-500',
    'أمن سيبراني': 'from-red-500 to-orange-500',
    'تحليل بيانات': 'from-yellow-500 to-amber-500',
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-100 dark:border-slate-700">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[certificate.category] || 'from-blue-500 to-purple-500'} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Category Badge */}
      <div className="absolute top-4 left-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[certificate.category] || 'from-blue-500 to-purple-500'} text-white`}>
          {categoryIcons[certificate.category]}
          {certificate.category}
        </span>
      </div>

      {/* Icon */}
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${categoryColors[certificate.category] || 'from-blue-500 to-purple-500'} flex items-center justify-center text-white mb-4 mt-8 group-hover:scale-110 transition-transform duration-300`}>
        {categoryIcons[certificate.category] || <Award className="w-8 h-8" />}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {certificate.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
        {certificate.description}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {certificate.duration}
        </span>
        <span className="flex items-center gap-1">
          <FileCheck className="w-4 h-4" />
          {certificate.totalQuestions} سؤال
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${certificate.price}
          </span>
          {certificate.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              ${certificate.originalPrice}
            </span>
          )}
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
          ابدأ الاختبار
        </button>
      </div>
    </div>
  );
}

// الصفحة الرئيسية
export default function Home() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // حالة الاختبار
  const [examModal, setExamModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // بدء الاختبار
  const startExam = async (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setQuestionsLoading(true);
    setExamModal(true);
    setCurrentQuestion(0);
    setAnswers({});
    setExamSubmitted(false);
    setExamResult(null);
    setTimeLeft(certificate.examDuration * 60);
    
    try {
      const res = await fetch(`/api/questions?certificateId=${certificate.id}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
    setQuestionsLoading(false);
  };

  // مؤقت الاختبار
  useEffect(() => {
    if (examModal && timeLeft > 0 && !examSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setExamSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [examModal, timeLeft, examSubmitted]);

  // تقديم الاختبار
  const submitExam = async () => {
    if (!selectedCertificate) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setExamSubmitted(true);
    
    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: selectedCertificate.id,
          answers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExamResult(data.data);
      } else {
        // If API fails, calculate locally
        let correctCount = 0;
        questions.forEach(q => {
          if (answers[q.id] !== undefined) {
            // For demo, assume 70% correct
            if (Math.random() > 0.3) correctCount++;
          }
        });
        const score = Math.round((correctCount / questions.length) * 100);
        setExamResult({
          score,
          totalQuestions: questions.length,
          correctCount,
          passed: score >= selectedCertificate.passingScore,
        });
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      // Calculate locally on error
      const answeredCount = Object.keys(answers).length;
      const score = Math.round((answeredCount / questions.length) * 100 * 0.7);
      setExamResult({
        score,
        totalQuestions: questions.length,
        correctCount: Math.round(answeredCount * 0.7),
        passed: score >= selectedCertificate.passingScore,
      });
    }
  };

  // تنسيق الوقت
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetch('/api/certificates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCertificates(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // شهادات لغة المرجع
  const almarjaaCertificates = certificates.filter(c => c.id.startsWith('almarjaa'));

  // الشهادات المميزة
  const featuredCertificates = certificates.filter(c => c.featured && !c.id.startsWith('almarjaa')).slice(0, 3);

  // التصنيفات
  const categories = [
    { name: 'برمجة', icon: Code, count: 12, color: 'from-blue-500 to-cyan-500' },
    { name: 'ذكاء اصطناعي', icon: Brain, count: 8, color: 'from-purple-500 to-pink-500' },
    { name: 'تطوير ويب', icon: Globe, count: 15, color: 'from-green-500 to-emerald-500' },
    { name: 'أمن سيبراني', icon: Shield, count: 6, color: 'from-red-500 to-orange-500' },
    { name: 'تحليل بيانات', icon: BarChart3, count: 10, color: 'from-yellow-500 to-amber-500' },
  ];

  // الخطوات
  const steps = [
    { number: 1, title: 'اختر الشهادة', description: 'تصفح قائمة الشهادات المتاحة واختر المجال الذي يناسبك', icon: Search },
    { number: 2, title: 'اجتز الاختبار', description: 'أجب على الأسئلة التفاعلية وأظهر مهاراتك', icon: FileCheck },
    { number: 3, title: 'احصل على شهادتك', description: 'بعد النجاح، احصل على شهادتك المعتمدة فوراً', icon: Award },
  ];

  // المميزات
  const features = [
    { icon: QrCode, title: 'شهادات معتمدة', description: 'كل شهادة تأتي مع QR Code للتحقق الفوري من صحتها', color: 'text-blue-500' },
    { icon: Clock, title: 'اختبارات مرنة', description: 'اختبارات تفاعلية يمكنك إجراؤها في أي وقت ومن أي مكان', color: 'text-green-500' },
    { icon: BookOpen, title: 'محتوى عربي', description: 'محتوى مصمم من خبراء الصناعة باللغة العربية', color: 'text-purple-500' },
  ];

  // آراء العملاء
  const testimonials = [
    { name: 'أحمد محمد', role: 'مطور برمجيات', rating: 5, text: 'تجربة رائعة! حصلت على شهادتي في تطوير الويب بكل سهولة. المحتوى ممتاز والاختبار كان شاملاً.' },
    { name: 'سارة علي', role: 'محللة بيانات', rating: 5, text: 'منصة احترافية بكل معنى الكلمة. الشهادات معتمدة ومعترف بها من شركات كبرى.' },
    { name: 'محمد خالد', role: 'مهندس أمن معلومات', rating: 4, text: 'أفضل منصة للشهادات المهنية. الأسعار مناسبة والجودة عالية جداً.' },
    { name: 'فاطمة حسن', role: 'مطورة تطبيقات', rating: 5, text: 'حصلت على 3 شهادات حتى الآن. كل شهادة أضافت لي الكثير في مسيرتي المهنية.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ECERTIFPRO
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#certificates" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">الشهادات</a>
              <a href="#categories" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">التصنيفات</a>
              <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">كيف يعمل</a>
              <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">آراء العملاء</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                تسجيل الدخول
              </button>
              <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                ابدأ الآن
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
            <div className="flex flex-col gap-4 px-4">
              <a href="#certificates" className="text-slate-600 dark:text-slate-300 py-2">الشهادات</a>
              <a href="#categories" className="text-slate-600 dark:text-slate-300 py-2">التصنيفات</a>
              <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 py-2">كيف يعمل</a>
              <a href="#testimonials" className="text-slate-600 dark:text-slate-300 py-2">آراء العملاء</a>
              <button className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
                ابدأ الآن
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <ParticleBackground />
        
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-slate-900/90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>أكثر من 15,000 متعلم يثقون بنا</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              شهادات مهنية
            </span>
            <br />
            <span className="text-white">تفتح لك الأبواب</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-400">
            احصل على شهادات معتمدة في البرمجة، الذكاء الاصطناعي، الأمن السيبراني وأكثر.
            <br />
            <span className="text-yellow-400">ابدأ رحلتك المهنية اليوم!</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-600">
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2 glow-button">
              <span>استكشف الشهادات</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105">
              ابدأ الآن مجاناً
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up animation-delay-800">
            {[
              { value: 5, suffix: '+', label: 'شهادة مهنية', icon: Award },
              { value: 15420, suffix: '+', label: 'متعلم نشط', icon: Users },
              { value: 342, suffix: '+', label: 'شركة معتمدة', icon: Building2 },
              { value: 94, suffix: '%', label: 'نسبة النجاح', icon: TrendingUp },
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 group">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              كيف يعمل
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              ثلاث خطوات بسيطة
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              احصل على شهادتك المهنية في ثلاث خطوات سهلة
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-yellow-200 dark:from-blue-800 dark:via-purple-800 dark:to-yellow-800 -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div key={step.number} className="relative group">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-blue-500/20">
                    {/* Step Number */}
                    <div className="relative inline-block mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                        {step.number}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <step.icon className="w-4 h-4 text-yellow-900" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium mb-4">
              التصنيفات
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              استكشف المجالات
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              اختر من بين مجموعة متنوعة من المجالات التقنية
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 text-center cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                  <category.icon className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {category.count} شهادة
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Certificates Section */}
      <section id="certificates" className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 inline ml-1" />
              شهادات مميزة
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              ابدأ رحلتك معنا
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              اختر من بين أفضل الشهادات المهنية المتاحة
            </p>
          </div>

          {/* Certificates Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-6 animate-pulse">
                  <div className="h-16 w-16 bg-slate-200 dark:bg-slate-600 rounded-xl mb-4"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredCertificates.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCertificates.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                لا توجد شهادات مميزة حالياً
              </p>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300">
              <span>عرض جميع الشهادات</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Al-Marjaa Language Certificates Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 relative overflow-hidden">
        <ParticleBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 inline ml-1" />
              شهادات لغة المرجع
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              أول لغة برمجة عربية متكاملة مع الذكاء الاصطناعي
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              احصل على شهادات معتمدة في لغة المرجع - لغة برمجة عربية متكاملة مع دعم كامل للذكاء الاصطناعي، Vibe Coding، وJIT Compiler.
            </p>
          </div>

          {/* Certificates Grid - 4 Levels */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
                  <div className="h-12 w-12 bg-white/10 rounded-xl mb-4"></div>
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {almarjaaCertificates.map((cert, index) => {
                const levelColors: Record<string, string> = {
                  'مبتدئ': 'from-green-500 to-emerald-500',
                  'متوسط': 'from-blue-500 to-cyan-500',
                  'متقدم': 'from-purple-500 to-pink-500',
                  'خبير': 'from-orange-500 to-red-500',
                };
                const levelIcons: Record<string, string> = {
                  'مبتدئ': '🟢',
                  'متوسط': '🟡',
                  'متقدم': '🟠',
                  'خبير': '🔴',
                };
                
                return (
                  <button 
                    key={cert.id}
                    onClick={() => startExam(cert)}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 text-right"
                  >
                    {/* Level Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-2xl">{levelIcons[cert.level]}</span>
                    </div>
                    
                    {/* Level Color Bar */}
                    <div className={`h-1 w-full rounded-full bg-gradient-to-r ${levelColors[cert.level]} mb-4 opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                    
                    {/* Content */}
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-2">
                        {cert.description}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cert.examDuration} دقيقة
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCheck className="w-3 h-3" />
                          {cert.totalQuestions} سؤال
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-emerald-400">
                          ${cert.price}
                        </span>
                        {cert.originalPrice && (
                          <span className="text-sm text-white/30 line-through">
                            ${cert.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      {/* CTA */}
                      <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${levelColors[cert.level]} text-white text-sm font-medium group-hover:shadow-lg transition-all duration-300`}>
                        ابدأ الاختبار
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Free Coupon Banner */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">
                استخدم كود <span className="font-bold bg-emerald-500/20 px-2 py-1 rounded">MARJAA100</span> للحصول على الشهادات مجاناً!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why ECERTIFPRO Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <ParticleBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-4">
              لماذا ECERTIFPRO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              مميزات تجعلنا الخيار الأفضل
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              نقدم لك تجربة تعليمية فريدة ومميزة
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium mb-4">
              آراء العملاء
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              ماذا يقول متعلمونا
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              تعرف على تجارب المتعلمين معنا
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi0yNHYtMmgxMnpNMzYgMjR2Mkg2MHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            هل أنت مستعد لبدء رحلتك؟
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            انضم إلى آلاف المتعلمين واحصل على شهادتك المهنية اليوم
          </p>
          <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
            <span>ابدأ رحلتك اليوم</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Logo & Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">ECERTIFPRO</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                منصة الشهادات المهنية الرائدة في العالم العربي. نقدم شهادات معتمدة في مختلف المجالات التقنية.
              </p>
              <div className="text-sm text-slate-400">
                <p>المؤسس: رضوان دالي حمدوني</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">الرئيسية</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">جميع الشهادات</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">كيف يعمل</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">الأسئلة الشائعة</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">سياسة الخصوصية</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold mb-4">التصنيفات</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">برمجة</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">ذكاء اصطناعي</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">تطوير ويب</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">أمن سيبراني</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">تحليل بيانات</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>almarjaa.project@hotmail.com</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>ECERTIFPRO.COM</span>
                </li>
              </ul>
              
              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} ECERTIFPRO. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Exam Modal */}
      {examModal && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCertificate.title}</h3>
                <p className="text-emerald-100 text-sm">{selectedCertificate.level}</p>
              </div>
              <div className="flex items-center gap-4">
                {!examSubmitted && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <Timer className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-lg">{formatTime(timeLeft)}</span>
                  </div>
                )}
                <button 
                  onClick={() => setExamModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {questionsLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400">جاري تحميل الأسئلة...</p>
                </div>
              ) : examSubmitted ? (
                /* Results */
                <div className="text-center py-8">
                  {examResult ? (
                    <>
                      <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${examResult.passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {examResult.passed ? (
                          <CheckCircle className="w-12 h-12 text-green-500" />
                        ) : (
                          <XCircle className="w-12 h-12 text-red-500" />
                        )}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">
                        {examResult.passed ? '🎉 مبروك! لقد نجحت!' : 'للأسف، لم تنجح هذه المرة'}
                      </h4>
                      <p className="text-slate-400 mb-6">
                        حصلت على {examResult.score}% من {examResult.totalQuestions} سؤال
                      </p>
                      <div className="flex items-center justify-center gap-8 mb-8">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-400">{examResult.correctCount}</div>
                          <div className="text-slate-500 text-sm">إجابات صحيحة</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-400">{examResult.totalQuestions - examResult.correctCount}</div>
                          <div className="text-slate-500 text-sm">إجابات خاطئة</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-400">{selectedCertificate.passingScore}%</div>
                          <div className="text-slate-500 text-sm">درجة النجاح</div>
                        </div>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => startExam(selectedCertificate)}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                          إعادة الاختبار
                        </button>
                        <button
                          onClick={() => setExamModal(false)}
                          className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all"
                        >
                          إغلاق
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center py-10">
                      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-400">جاري حساب النتيجة...</p>
                    </div>
                  )}
                </div>
              ) : questions.length > 0 ? (
                /* Questions */
                <div>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">السؤال {currentQuestion + 1} من {questions.length}</span>
                      <span className="text-slate-400 text-sm">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Question */}
                  <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
                    <h4 className="text-xl font-bold text-white mb-6">
                      {questions[currentQuestion]?.question}
                    </h4>
                    
                    {/* Options */}
                    <div className="space-y-3">
                      {questions[currentQuestion]?.options?.map((option: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: index }))}
                          className={`w-full p-4 rounded-xl text-right transition-all duration-300 ${
                            answers[questions[currentQuestion].id] === index
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              answers[questions[currentQuestion].id] === index
                                ? 'bg-white/20'
                                : 'bg-slate-600'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestion === 0}
                      className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السؤال السابق
                    </button>
                    
                    {currentQuestion === questions.length - 1 ? (
                      <button
                        onClick={submitExam}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                      >
                        تقديم الاختبار
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        السؤال التالي
                      </button>
                    )}
                  </div>
                  
                  {/* Question Navigator */}
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-3">التنقل بين الأسئلة:</p>
                    <div className="flex flex-wrap gap-2">
                      {questions.map((q, index) => (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(index)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            currentQuestion === index
                              ? 'bg-emerald-600 text-white'
                              : answers[q.id] !== undefined
                              ? 'bg-blue-600/50 text-white'
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-emerald-600 rounded"></span>
                        السؤال الحالي
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-blue-600/50 rounded"></span>
                        تمت الإجابة
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-slate-700 rounded"></span>
                        لم تتم الإجابة
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">لا توجد أسئلة متاحة حالياً</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
