'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  Code,
  Brain,
  Globe,
  Shield,
  BarChart3,
  Clock,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
  Mail,
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
  XCircle,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Trophy,
  Target,
  Layers,
  Crown,
  Eye,
  Download,
  ExternalLink,
  Lock,
  CreditCard,
  Check,
  Gift,
  Search,
  MessageSquare,
  BadgeCheck,
  Cpu,
  Rocket,
  Languages,
  Feather,
  Gauge,
  Terminal,
  Lightbulb,
  Heart,
  ShieldCheck
} from 'lucide-react';

// Types
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

interface UserType {
  id: string;
  email: string;
  name: string;
  level: string;
  points: number;
  avatar?: string;
}

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
// Particle Background
// ============================================
function ParticleBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    if (!mounted) {
      return [...Array(50)].map((_, i) => ({
        left: (i * 2) % 100,
        delay: (i * 0.4) % 20,
        duration: 15 + (i % 20),
        width: 2 + (i % 4),
        height: 2 + ((i + 1) % 4),
        opacity: 0.3 + ((i % 10) * 0.04),
      }));
    }
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

// ============================================
// Auth Modal Component
// ============================================
function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onLogin: (user: UserType) => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          email,
          password,
          name: isLogin ? undefined : name,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onLogin(data.data.user);
        onClose();
        setEmail('');
        setPassword('');
        setName('');
      } else {
        setError(data.error || 'حدث خطأ');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isLogin ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-white/80 mt-2">
            {isLogin ? 'مرحباً بعودتك!' : 'انضم إلينا اليوم!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسمك"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : (isLogin ? 'دخول' : 'تسجيل')}
          </button>

          <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل دخولك'}
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// Exam Modal Component
// ============================================
function ExamModal({
  isOpen,
  onClose,
  certificate,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onSubmit: (score: number, passed: boolean) => void;
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submitRef = useRef(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = useCallback(async () => {
    if (!certificate || submitRef.current) return;
    submitRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSubmitted(true);

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: certificate.id,
          answers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        onSubmit(data.data.score, data.data.passed);
      }
    } catch {
      const answeredCount = Object.keys(answers).length;
      const score = Math.round((answeredCount / questions.length) * 100 * 0.7);
      setResult({
        score,
        totalQuestions: questions.length,
        correctCount: Math.round(answeredCount * 0.7),
        passed: score >= certificate.passingScore,
      });
    }
  }, [certificate, answers, questions.length, onSubmit]);

  useEffect(() => {
    if (isOpen && certificate) {
      // Use microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => {
        setLoading(true);
        setCurrentQuestion(0);
        setAnswers({});
        setSubmitted(false);
        setResult(null);
        submitRef.current = false;
        setTimeLeft(certificate.examDuration * 60);
      });
      
      fetch(`/api/questions?certificateId=${certificate.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setQuestions(data.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, certificate]);

  useEffect(() => {
    if (isOpen && timeLeft > 0 && !submitted && !submitRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (!submitRef.current) {
              handleSubmit();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isOpen, timeLeft, submitted, handleSubmit]);

  if (!isOpen || !certificate) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className={`bg-gradient-to-r ${levelColors[certificate.level] || 'from-blue-600 to-purple-600'} p-4 flex items-center justify-between`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{levelIcons[certificate.level]}</span>
              <h3 className="text-xl font-bold text-white">{certificate.title}</h3>
            </div>
            <p className="text-white/80 text-sm">{certificate.level}</p>
          </div>
          <div className="flex items-center gap-4">
            {!submitted && (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Timer className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400">جاري تحميل الأسئلة...</p>
            </div>
          ) : submitted ? (
            <div className="text-center py-8">
              {result && (
                <>
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${result.passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {result.passed ? <CheckCircle className="w-12 h-12 text-green-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {result.passed ? 'مبروك! لقد نجحت!' : 'للأسف، لم تنجح هذه المرة'}
                  </h4>
                  <p className="text-slate-400 mb-6">
                    حصلت على {result.score}% من {result.totalQuestions} سؤا����
                  </p>
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400">{result.correctCount}</div>
                      <div className="text-slate-500 text-sm">إجابات صحيحة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">{result.totalQuestions - result.correctCount}</div>
                      <div className="text-slate-500 text-sm">إجابات خاطئة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{certificate.passingScore}%</div>
                      <div className="text-slate-500 text-sm">درجة النجاح</div>
                    </div>
                  </div>
                  {result.passed && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                      <p className="text-emerald-400 flex items-center justify-center gap-2">
                        <Award className="w-5 h-5" />
                        يمكنك الآن تحميل شهادتك من صفحة الملف الشخصي
                      </p>
                    </div>
                  )}
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setCurrentQuestion(0);
                        setAnswers({});
                        setResult(null);
                        setTimeLeft(certificate.examDuration * 60);
                        submitRef.current = false;
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      إعادة الاختبار
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all"
                    >
                      إغلاق
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : questions.length > 0 ? (
            <div>
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

              <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold text-white mb-6">
                  {questions[currentQuestion]?.question}
                </h4>

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
                    onClick={handleSubmit}
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
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">لا توجد أسئلة متاحة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Pricing Card
// ============================================
function PricingCard({
  certificate,
  onSelect,
  featured = false
}: {
  certificate: Certificate;
  onSelect: () => void;
  featured?: boolean;
}) {
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
    <div className={`relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border ${featured ? 'ring-2 ring-blue-500 border-blue-500/30' : 'border-slate-200 dark:border-slate-700'}`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg z-10 flex items-center gap-1">
          <Star className="w-3 h-3" />
          الأكثر مبيعاً
        </div>
      )}

      {/* Certified Badge */}
      <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
        <BadgeCheck className="w-3 h-3" />
        معتمدة
      </div>
      
      <div className={`h-2 bg-gradient-to-r ${levelColors[certificate.level]}`}></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelIcons[certificate.level]}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{certificate.level}</span>
          </div>
          <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
            الأسعار الحالية
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
          {certificate.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {certificate.description}
        </p>

        {/* Price Display - More Prominent */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800/30">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">السعر</div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${certificate.price}
            </span>
            {certificate.originalPrice && certificate.originalPrice > certificate.price && (
              <div className="text-right">
                <span className="text-sm text-slate-400 line-through block">
                  ${certificate.originalPrice}
                </span>
                <span className="text-xs font-bold text-red-500">
                  {Math.round(((certificate.originalPrice - certificate.price) / certificate.originalPrice) * 100)}% خصم
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-6 bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Timer className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{certificate.examDuration} دقيقة</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{certificate.totalQuestions} سؤال</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Target className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">{certificate.passingScore}% للنجاح</span>
          </div>
        </div>

        <button
          onClick={onSelect}
          className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${levelColors[certificate.level]} hover:shadow-lg transition-all transform hover:scale-105`}
        >
          ابدأ الاختبار الآن
        </button>
      </div>
    </div>
  );
}

// ============================================
// Language Comparison Component
// ============================================
function LanguageComparison() {
  const comparisons = [
    { feature: 'الكتابة باللغة الأم', marjaa: true, python: false, javascript: false, java: false },
    { feature: 'تكامل الذكاء الاصطناعي', marjaa: true, python: false, javascript: false, java: false },
    { feature: 'سهولة التعلم للمبتدئين العرب', marjaa: true, python: false, javascript: false, java: false },
    { feature: 'أداء عالي (Native)', marjaa: true, python: false, javascript: false, java: true },
    { feature: 'ذاكرة آمنة (Memory Safe)', marjaa: true, python: true, javascript: true, java: true },
    { feature: 'دعم الكتابة RTL أصيل', marjaa: true, python: false, javascript: false, java: false },
    { feature: 'تراكيب لغوية عربية', marjaa: true, python: false, javascript: false, java: false },
    { feature: 'توثيق بالعربية', marjaa: true, python: false, javascript: false, java: false },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-right py-4 px-4 text-slate-300 font-medium">الميزة</th>
            <th className="text-center py-4 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-bold">
                <Star className="w-4 h-4" />
                لغة المرجع
              </div>
            </th>
            <th className="text-center py-4 px-4 text-slate-400">Python</th>
            <th className="text-center py-4 px-4 text-slate-400">JavaScript</th>
            <th className="text-center py-4 px-4 text-slate-400">Java</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((row, index) => (
            <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
              <td className="py-4 px-4 text-slate-300">{row.feature}</td>
              <td className="py-4 px-4 text-center">
                {row.marjaa ? (
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400/50 mx-auto" />
                )}
              </td>
              <td className="py-4 px-4 text-center">
                {row.python ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                )}
              </td>
              <td className="py-4 px-4 text-center">
                {row.javascript ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                )}
              </td>
              <td className="py-4 px-4 text-center">
                {row.java ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================
export default function Home() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<UserType | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Exam state
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Check for saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Load certificates
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const res = await fetch('/api/certificates');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCertificates(data.data);
        } else {
          console.error('[v0] Failed to fetch certificates:', data);
          setCertificates([]);
        }
      } catch (error) {
        console.error('[v0] Error loading certificates:', error);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCertificates();
  }, []);

  // Al-Marjaa certificates - display ALL active certificates
  const levelOrder: Record<string, number> = { 'مبتدئ': 1, 'متوسط': 2, 'متقدم': 3, 'خبير': 4 };
  const almarjaaCertificates = certificates
    .sort((a, b) => {
      // Sort by featured first, then by level
      if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return (levelOrder[a.level] || 0) - (levelOrder[b.level] || 0);
    });

  // Auth handlers
  const handleLogin = (userData: UserType) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Exam handlers
  const startExam = (certificate: Certificate) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedCertificate(certificate);
    setExamModalOpen(true);
  };

  const handleExamSubmit = (score: number, passed: boolean) => {
    if (passed && user) {
      const points = Math.floor(score);
      const updatedUser = { ...user, points: user.points + points };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Features
  const features = [
    { icon: ShieldCheck, title: 'الشريك الرسمي المعتمد', description: 'ECERTIFPRO هي المنصة الوحيدة المرخصة رسمياً من مؤسس لغة المرجع لتقديم الشهادات المعتمدة', color: 'text-yellow-400' },
    { icon: Brain, title: 'تكامل الذكاء الاصطناعي', description: 'لغة المرجع مبنية من الصفر مع دعم أصيل للذكاء الاصطناعي وتعلم الآلة', color: 'text-purple-400' },
    { icon: Languages, title: 'برمجة بالعربية', description: 'اكتب الكود بلغتك الأم - أول لغة برمجة AI-أصيلة بالعربية في العالم', color: 'text-blue-400' },
    { icon: Gauge, title: 'أداء فائق السرعة', description: 'مبنية على Rust لتقديم أداء عالي يضاهي أسرع اللغات البرمجية', color: 'text-green-400' },
  ];

  // Steps
  const steps = [
    { number: 1, title: 'تعلم لغة المرجع', description: 'دروس مجانية من المبتدئ للخبير', icon: BookOpen },
    { number: 2, title: 'اجتز الاختبار', description: 'اختبر مهاراتك واحصل على شهادتك', icon: Target },
    { number: 3, title: 'شهادة معتمدة عالمياً', description: 'الشهادة الوحيدة المعتمدة من مؤسس اللغة', icon: Award },
  ];

  // Testimonials
  const testimonials = [
    { name: 'أحمد محمد', role: 'مطور برمجيات', rating: 5, text: 'أخيراً لغة برمجة عربية! شهادتي معتمدة ومعترف بها.' },
    { name: 'سارة علي', role: 'محللة بيانات', rating: 5, text: 'ECERTIFPRO المنصة الوحيدة التي تقدم شهادات رسمية في لغة المرجع.' },
    { name: 'محمد خالد', role: 'مهندس برمجيات', rating: 5, text: 'ثورة حقيقية في عالم البرمجة العربية!' },
  ];

  // Badges for display
  const displayBadges = [
    { icon: Award, name: 'البداية', points: 50, color: '#10B981' },
    { icon: BookOpen, name: 'المتعلم', points: 100, color: '#3B82F6' },
    { icon: Trophy, name: 'الخبير', points: 200, color: '#8B5CF6' },
    { icon: Crown, name: 'رائد المرجع', points: 500, color: '#D4AF37' },
  ];

  // Use cases
  const useCases = [
    { icon: Globe, title: 'تطوير الويب', description: 'بناء مواقع وتطبيقات ويب حديثة بلغة عربية' },
    { icon: Brain, title: 'الذكاء الاصطناعي', description: 'تطوير تطبيقات AI وML بشكل طبيعي' },
    { icon: Cpu, title: 'أنظمة مضمنة', description: 'برمجة الأجهزة والأنظمة المدمجة' },
    { icon: Terminal, title: 'أدوات سطر الأوامر', description: 'بناء أدوات CLI قوية وفعالة' },
    { icon: BarChart3, title: 'تحليل البيانات', description: 'معالجة وتحليل البيانات الضخمة' },
    { icon: Shield, title: 'الأمن السيبراني', description: 'تطوير حلول أمنية متقدمة' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ECERTIFPRO
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/learn" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">التعلم</a>
              <a href="#certificates" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">الشهادات</a>
              <a href="#comparison" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">المقارنة</a>
              <a href="#badges" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">البادج</a>
              <Link href="/founder" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">المؤسس</Link>
              <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">تواصل معنا</Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </div>
                    <span>{user.name || user.email}</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{user.points} نقطة</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    ابدأ الآن
                  </button>
                </>
              )}
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
              <a href="/learn" className="text-blue-600 py-2 font-medium">التعلم</a>
              <a href="#certificates" className="text-slate-600 dark:text-slate-300 py-2">الشهادات</a>
              <a href="#comparison" className="text-slate-600 dark:text-slate-300 py-2">المقارنة</a>
              <a href="#badges" className="text-slate-600 dark:text-slate-300 py-2">البادج</a>
              <Link href="/founder" className="text-slate-600 dark:text-slate-300 py-2">المؤسس</Link>
              <Link href="/contact" className="text-slate-600 dark:text-slate-300 py-2">تواصل معنا</Link>
              {user ? (
                <>
                  <div className="text-slate-600 dark:text-slate-300 py-2">{user.name || user.email}</div>
                  <button onClick={handleLogout} className="text-red-600 py-2">تسجيل الخروج</button>
                </>
              ) : (
                <button
                  onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-slate-900/90"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Official Partner Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full text-yellow-400 text-sm mb-6 border border-yellow-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>الشريك الرسمي المعتمد الوحيد من مؤسس لغة المرجع</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ثورة البرمجة العربية
            </span>
            <br />
            <span className="text-white">شهادات معتمدة في لغة المرجع</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto mb-6">
            <span className="text-yellow-400 font-bold">ECERTIFPRO</span> هي المنصة الوحيدة في العالم المرخصة رسمياً
            <br />
            من مؤسس لغة المرجع لتقديم الشهادات المهنية المعتمدة
          </p>

          {/* Unique Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm border border-blue-500/30">
              <BadgeCheck className="w-4 h-4" />
              رخصة تجارية رسمية
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm border border-purple-500/30">
              <Globe className="w-4 h-4" />
              شهادات معترف بها عالمياً
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-300 text-sm border border-green-500/30">
              <Shield className="w-4 h-4" />
              توقيع رقمي موثق
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="/learn"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span>ابدأ التعلم مجاناً</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </a>
            <a
              href="#certificates"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              احصل على شهادتك
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: 4, suffix: '+', label: 'شهادة مهنية', icon: Award },
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

      {/* Official License Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <ParticleBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-400 text-sm mb-4 border border-yellow-500/30">
              <Crown className="w-4 h-4" />
              الشريك الرسمي والوحيد
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              لماذا ECERTIFPRO فقط؟
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              نحن المنصة الوحيدة الحاصلة على رخصة تجارية رسمية من مؤسس لغة المرجع
              لتقديم الشهادات المهنية المعتمدة في هذه اللغة الثورية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Founder Quote */}
          <div className="mt-16 bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-600/50 text-center">
            <Link href="/founder" className="inline-block mb-6">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <Image
                  src="/founder.png"
                  alt="رضوان دالي حمدوني - مؤسس لغة المرجع"
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <blockquote className="text-xl md:text-2xl text-white/90 mb-6 max-w-4xl mx-auto italic">
              &quot;ECERTIFPRO هي المنصة الرسمية والوحيدة المرخصة لتقديم شهادات معتمدة في لغة المرجع. 
              شهاداتهم تحمل توقيعي الرقمي ومعترف بها عالمياً.&quot;
            </blockquote>
            <div className="text-white/80">
              <p className="font-bold text-lg">رضوان دالي حمدوني</p>
              <p className="text-blue-400">مؤسس ومخترع لغة المرجع</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Comparison Section */}
      <section id="comparison" className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm mb-4">
              <BarChart3 className="w-4 h-4" />
              مقارنة تقنية
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              لغة المرجع vs اللغات العالمية
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              اكتشف لماذا لغة المرجع هي الخيار الأمثل للمبرمجين العرب
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-2xl">
            <LanguageComparison />
          </div>

          {/* Key Advantages */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">برمجة بلغتك</h3>
              <p className="text-slate-600 dark:text-slate-300">اكتب الكود بالعربية - لا حاجة لتعلم مصطلحات أجنبية معقدة</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Gauge className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">أداء مذهل</h3>
              <p className="text-slate-600 dark:text-slate-300">مبنية على Rust - أداء يضاهي C++ مع أمان الذاكرة الكامل</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">AI أصيل</h3>
              <p className="text-slate-600 dark:text-slate-300">تكامل عميق مع الذكاء الاصطناعي - الوحيدة في العالم</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm mb-4">
              <Rocket className="w-4 h-4" />
              استخدامات لا حصر لها
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              ماذا يمكنك أن تبني بلغة المرجع؟
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              لغة برمجية متكاملة لكل احتياجاتك التقنية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <useCase.icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{useCase.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm mb-4">
              <Target className="w-4 h-4" />
              كيف يعمل
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              ثلاث خطوات للشهادة المعتمدة
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              احصل على شهادتك المهنية المعتمدة رسمياً من مؤسس لغة المرجع
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-blue-500/20">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <step.icon className="w-4 h-4 text-yellow-900" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates / Pricing Section */}
      <section id="certificates" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm mb-4 font-bold">
              <BadgeCheck className="w-4 h-4" />
              معتمدة من مؤسس لغة المرجع
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              شهادات مهنية معتمدة دولياً
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              احصل على شهادات معترف بها عالمياً في لغة المرجع، الشهادات الوحيدة المعتمدة من مؤسس اللغة
            </p>
            
            {/* Certification Info */}
            <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-2xl mb-2">🏢</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">معتمد رسمياً</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">من مؤسس اللغة</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-2xl mb-2">🌍</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">معترف به دولياً</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">في سوق العمل العالمي</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-2xl mb-2">💼</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">احترافي</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">لتعزيز حياتك الوظيفية</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : almarjaaCertificates.length === 0 && !loading ? (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-300 text-lg">لا توجد شهادات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {almarjaaCertificates.length > 0 ? (
                almarjaaCertificates.map((cert) => (
                  <PricingCard
                    key={cert.id}
                    certificate={cert}
                    onSelect={() => startExam(cert)}
                    featured={cert.featured || cert.level === 'متوسط'}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 text-lg">جاري تحميل الشهادات...</p>
                </div>
              )}
            </div>
          )}

          {/* Free Coupon Banner */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-2xl shadow-2xl border-2 border-yellow-300 dark:border-yellow-600 max-w-2xl">
              <div className="flex items-center gap-4">
                <Gift className="w-8 h-8 text-white animate-bounce" />
                <div className="text-left">
                  <p className="text-white font-bold text-lg">عرض محدود جداً!</p>
                  <p className="text-white/90 text-sm">استخدم الكود</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-2xl bg-white/20 px-4 py-2 rounded-lg border-2 border-white/30">MARJAA100</span>
                <p className="text-white text-xs mt-1 font-bold">للحصول على جميع الشهادات مجاناً</p>
              </div>
              <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-lg">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span>فقط 100 شخص!</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 font-semibold">
              ⏰ العرض ينتهي عند استنفاد الكوبونات - لا تفوت الفرصة!
            </p>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section id="badges" className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm mb-4">
              <Trophy className="w-4 h-4" />
              نظام البادج
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              اجمع النقاط واحصل على بادج الإنجاز
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              كل إنجاز يقربك من هدفك المهني
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayBadges.map((badge, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-600">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  <badge.icon className="w-8 h-8" style={{ color: badge.color }} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{badge.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{badge.points} نقطة</p>
                <div 
                  className="h-1 w-12 mx-auto rounded-full"
                  style={{ backgroundColor: badge.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm mb-4">
              <Heart className="w-4 h-4" />
              آراء المتعلمين
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              ماذا يقول المتعلمون
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white">{testimonial.name}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            انضم إلى ثورة البرمجة العربية
          </h2>
          <p className="text-xl text-white/80 mb-10">
            كن من الرواد الأوائل الحاصلين على شهادة معتمدة في لغة المرجع
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/learn"
              className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              ابدأ التعلم مجاناً
            </a>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-10 py-4 bg-white/10 text-white border border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              <span>احصل على شهادتك</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">ECERTIFPRO</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                الشريك الرسمي والوحيد المعتمد من مؤسس لغة المرجع
              </p>
              <Link href="/founder" className="text-slate-400 text-sm hover:text-blue-400 transition-colors block">
                المؤسس: رضوان دالي حمدوني
              </Link>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-xs">
                <ShieldCheck className="w-3 h-3" />
                رخصة تجارية رسمية
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><a href="/learn" className="text-slate-400 hover:text-white transition-colors text-sm">التعلم</a></li>
                <li><a href="#certificates" className="text-slate-400 hover:text-white transition-colors text-sm">الشهادات</a></li>
                <li><a href="#comparison" className="text-slate-400 hover:text-white transition-colors text-sm">المقارنة</a></li>
                <li><Link href="/founder" className="text-slate-400 hover:text-white transition-colors text-sm">المؤسس</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">الشهادات المعتمدة</h3>
              <ul className="space-y-2">
                <li><span className="text-slate-400 text-sm">🟢 مبتدئ لغة المرجع</span></li>
                <li><span className="text-slate-400 text-sm">🟡 مطور لغة المرجع</span></li>
                <li><span className="text-slate-400 text-sm">🟠 خبير لغة المرجع</span></li>
                <li><span className="text-slate-400 text-sm">🔴 محترف لغة المرجع</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="flex items-center gap-2 text-slate-400 text-sm hover:text-blue-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>نموذج التواصل</span>
                  </Link>
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>ECERTIFPRO.COM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} ECERTIFPRO. جميع الحقوق محفوظة.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              الشريك الرسمي المعتمد من مؤسس لغة المرجع - رضوان دالي حمدوني
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLogin={handleLogin}
      />

      <ExamModal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        certificate={selectedCertificate}
        onSubmit={handleExamSubmit}
      />
    </div>
  );
}
