'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Award,
  CreditCard,
  MessageSquare,
  Settings,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Shield,
  Globe,
  TrendingUp,
  Database,
  Zap
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Stats {
  users: number;
  certificates: number;
  payments: number;
  revenue: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<Stats>({ users: 0, certificates: 0, payments: 0, revenue: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user || data.user.role !== 'admin') {
        router.push('/auth/login');
        return;
      }
      setUser(data.user);
    } catch {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'لوحة التحكم', href: '/admin', active: true },
    { icon: Users, label: 'المستخدمين', href: '/admin/users' },
    { icon: Award, label: 'الشهادات', href: '/admin/certificates' },
    { icon: CreditCard, label: 'المدفوعات', href: '/admin/payments' },
    { icon: MessageSquare, label: 'الرسائل', href: '/admin/messages' },
    { icon: Globe, label: 'SEO محركات البحث', href: '/admin/seo' },
    { icon: Settings, label: 'الإعدادات', href: '/admin/settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-l border-slate-700 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg">ECERTIFPRO</span>
            )}
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="font-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div className="hidden md:block">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.users}</h3>
              <p className="text-slate-400">المستخدمين</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8%
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.certificates}</h3>
              <p className="text-slate-400">شهادة صادرة</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +23%
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.payments}</h3>
              <p className="text-slate-400">عملية دفع</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15%
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">${stats.revenue.toLocaleString()}</h3>
              <p className="text-slate-400">إجمالي الإيرادات</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold mb-6">إجراءات سريعة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/users"
                className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-sm">إدارة المستخدمين</span>
              </Link>
              <Link
                href="/admin/certificates"
                className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Award className="w-8 h-8 text-purple-400" />
                <span className="text-sm">إدارة الشهادات</span>
              </Link>
              <Link
                href="/admin/seo"
                className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Globe className="w-8 h-8 text-green-400" />
                <span className="text-sm">SEO محركات البحث</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Settings className="w-8 h-8 text-yellow-400" />
                <span className="text-sm">الإعدادات</span>
              </Link>
            </div>
          </div>

          {/* AI & SEO Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
                <h2 className="text-xl font-bold">الذكاء الاصطناعي</h2>
              </div>
              <p className="text-slate-300 mb-4">
                الموقع مُحسّن للظهور في ردود الذكاء الاصطناعي (AI Overviews) مع بيانات منظمة JSON-LD.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  ChatGPT ✓
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Claude ✓
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Google AI ✓
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-green-400" />
                <h2 className="text-xl font-bold">محركات البحث</h2>
              </div>
              <p className="text-slate-300 mb-4">
                الموقع مُجهز بـ sitemap و robots.txt و Open Graph للتواصل الاجتماعي.
              </p>
              <Link
                href="/admin/seo"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                إدارة SEO
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
