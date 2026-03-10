'use client';

import { useEffect, useState } from 'react';
import {
  Award,
  Trophy,
  Star,
  Clock,
  BookOpen,
  Download,
  Eye,
  ExternalLink,
  User,
  Mail,
  Calendar,
  Target,
  TrendingUp,
  Layers,
  Crown,
  Zap,
  Menu,
  X,
  LogOut,
  Home,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  level: string;
  points: number;
  avatar?: string;
  createdAt?: string;
}

interface Certificate {
  id: string;
  certificateNumber: string;
  score: number;
  status: string;
  issueDate: string;
  certificate: {
    id: string;
    title: string;
    titleEn: string;
    level: string;
    category: string;
  };
}

interface Badge {
  id: string;
  earnedAt: string;
  badge: {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    icon: string;
    color: string;
    points: number;
  };
}

interface Stats {
  totalCertificates: number;
  totalBadges: number;
  totalAttempts: number;
  passedAttempts: number;
  averageScore: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      window.location.href = '/';
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadProfileData(userData.id);
    } catch {
      window.location.href = '/';
    }
  }, []);

  const loadProfileData = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/profile?userId=${userId}`);
      const data = await res.json();
      
      if (data.success) {
        setCertificates(data.data.certificates);
        setBadges(data.data.badges);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Award,
      BookOpen,
      Trophy,
      Star,
      Layers,
      Crown,
      Zap,
      Target,
    };
    return icons[iconName] || Award;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ECERTIFPRO
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600">
                <Home className="w-4 h-4" />
                الرئيسية
              </Link>
              <Link href="#certificates" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600">
                <FileCheck className="w-4 h-4" />
                شهاداتي
              </Link>
              <Link href="#badges" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600">
                <Trophy className="w-4 h-4" />
                بادجي
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </div>

            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
            <div className="flex flex-col gap-4 px-4">
              <Link href="/" className="text-slate-600 dark:text-slate-300 py-2">الرئيسية</Link>
              <a href="#certificates" className="text-slate-600 dark:text-slate-300 py-2">شهاداتي</a>
              <a href="#badges" className="text-slate-600 dark:text-slate-300 py-2">بادجي</a>
              <button onClick={handleLogout} className="text-red-600 py-2">تسجيل الخروج</button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="text-center md:text-right flex-1">
                <h1 className="text-3xl font-bold mb-2">{user?.name || 'المستخدم'}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    عضو منذ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl px-6 py-4">
                <span className="text-sm text-white/70">المستوى</span>
                <span className="text-2xl font-bold">{user?.level || 'مبتدئ'}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <Award className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats?.totalCertificates || 0}</div>
              <div className="text-slate-500 text-sm">شهادة</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats?.totalBadges || 0}</div>
              <div className="text-slate-500 text-sm">بادج</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <Target className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats?.averageScore || 0}%</div>
              <div className="text-slate-500 text-sm">متوسط الدرجات</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <Star className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{user?.points || 0}</div>
              <div className="text-slate-500 text-sm">نقطة</div>
            </div>
          </div>

          {/* Certificates Section */}
          <section id="certificates" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-500" />
              شهاداتي
            </h2>

            {certificates.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center">
                <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mb-4">لم تحصل على أي شهادة بعد</p>
                <Link
                  href="/#pricing"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  ابدأ الآن
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-2xl">{levelIcons[cert.certificate.level]}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'valid' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {cert.status === 'valid' ? 'صالحة' : 'ملغاة'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                      {cert.certificate.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">{cert.certificate.titleEn}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {cert.score}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(cert.issueDate).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" />
                        عرض
                      </button>
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1">
                        <Download className="w-4 h-4" />
                        تحميل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Badges Section */}
          <section id="badges">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              بادجي
            </h2>

            {badges.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">اجمع النقاط واحصل على بادج الإنجاز!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge) => {
                  const IconComponent = getIconComponent(badge.badge.icon);
                  return (
                    <div 
                      key={badge.id} 
                      className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div 
                        className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${badge.badge.color}20` }}
                      >
                        <IconComponent className="w-8 h-8" style={{ color: badge.badge.color }} />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white mb-1">{badge.badge.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{badge.badge.description}</p>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${badge.badge.color}20`, color: badge.badge.color }}
                      >
                        +{badge.badge.points} نقطة
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
