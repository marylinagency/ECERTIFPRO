'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  Search,
  Bot,
  Code,
  FileText,
  Image,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Zap,
  Settings,
  Shield,
  Menu,
  X,
  ChevronLeft,
  Users,
  Award,
  CreditCard,
  MessageSquare,
  LogOut,
  Bell
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SEOSettings {
  // معلومات أساسية
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  siteUrl: string;
  
  // أكواد التحقق
  googleVerification: string;
  bingVerification: string;
  yandexVerification: string;
  
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  
  // Twitter
  twitterHandle: string;
  twitterCardType: string;
  
  // Schema.org
  organizationName: string;
  organizationLogo: string;
  founderName: string;
  founderBio: string;
  
  // robots.txt
  allowAllBots: boolean;
  allowGPTBot: boolean;
  allowClaudeBot: boolean;
  disallowPaths: string;
  
  // sitemap
  sitemapEnabled: boolean;
  lastSitemapUpdate: string;
}

const defaultSettings: SEOSettings = {
  siteName: 'ECERTIFPRO',
  siteDescription: 'المنصة الرسمية والوحيدة المرخصة لتقديم شهادات معتمدة في لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية',
  siteKeywords: 'لغة المرجع, Al-Marjaa Language, شهادات معتمدة, برمجة عربية, ذكاء اصطناعي, رضوان دالي حمدوني',
  siteUrl: 'https://ecertifpro.com',
  
  googleVerification: '',
  bingVerification: '',
  yandexVerification: '',
  
  ogTitle: 'ECERTIFPRO - المنصة الرسمية لشهادات لغة المرجع',
  ogDescription: 'احصل على شهادات معتمدة في لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية',
  ogImage: '/og-image.png',
  
  twitterHandle: '@almarjaa_lang',
  twitterCardType: 'summary_large_image',
  
  organizationName: 'ECERTIFPRO',
  organizationLogo: '/logo.svg',
  founderName: 'رضوان دالي حمدوني',
  founderBio: 'مخترع لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية',
  
  allowAllBots: true,
  allowGPTBot: true,
  allowClaudeBot: true,
  disallowPaths: '/admin/, /api/, /checkout/, /profile/',
  
  sitemapEnabled: true,
  lastSitemapUpdate: new Date().toISOString(),
};

export default function AdminSEOPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [settings, setSettings] = useState<SEOSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'verification' | 'social' | 'schema' | 'robots'>('basic');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadSettings();
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

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      if (data.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || 'حدث خطأ في الحفظ');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateMetaTag = (name: string, content: string) => {
    return `<meta name="${name}" content="${content}" />`;
  };

  const generateVerificationTags = () => {
    const tags: string[] = [];
    if (settings.googleVerification) {
      tags.push(generateMetaTag('google-site-verification', settings.googleVerification));
    }
    if (settings.bingVerification) {
      tags.push(generateMetaTag('msvalidate.01', settings.bingVerification));
    }
    if (settings.yandexVerification) {
      tags.push(generateMetaTag('yandex-verification', settings.yandexVerification));
    }
    return tags.join('\n');
  };

  const menuItems = [
    { icon: Settings, label: 'لوحة التحكم', href: '/admin' },
    { icon: Users, label: 'المستخدمين', href: '/admin/users' },
    { icon: Award, label: 'الشهادات', href: '/admin/certificates' },
    { icon: CreditCard, label: 'المدفوعات', href: '/admin/payments' },
    { icon: MessageSquare, label: 'الرسائل', href: '/admin/messages' },
    { icon: Globe, label: 'SEO محركات البحث', href: '/admin/seo', active: true },
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
      <aside className="w-64 bg-slate-800 border-l border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">ECERTIFPRO</span>
          </Link>
        </div>

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
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Globe className="w-7 h-7 text-green-400" />
                SEO محركات البحث والذكاء الاصطناعي
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                sitemap.xml
              </Link>
              <Link
                href="/robots.txt"
                target="_blank"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                robots.txt
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="font-bold text-green-400">Sitemap</p>
                <p className="text-sm text-slate-400">مُفعّل وتحديث تلقائي</p>
              </div>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-blue-400">AI Crawlers</p>
                <p className="text-sm text-slate-400">ChatGPT, Claude, Google AI</p>
              </div>
            </div>
            
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-purple-400">JSON-LD</p>
                <p className="text-sm text-slate-400">بيانات منظمة مُفعّلة</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700 overflow-x-auto">
              {[
                { id: 'basic', label: 'معلومات أساسية', icon: Globe },
                { id: 'verification', label: 'أكواد التحقق', icon: Shield },
                { id: 'social', label: 'الشبكات الاجتماعية', icon: Image },
                { id: 'schema', label: 'Schema.org', icon: Code },
                { id: 'robots', label: 'Robots & AI', icon: Bot },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      اسم الموقع
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      وصف الموقع (Meta Description)
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">{settings.siteDescription.length} / 160 حرف</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      الكلمات المفتاحية (Keywords)
                    </label>
                    <textarea
                      value={settings.siteKeywords}
                      onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      placeholder="كلمة1, كلمة2, كلمة3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      رابط الموقع (URL)
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              {/* Verification Tab */}
              {activeTab === 'verification' && (
                <div className="space-y-6">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-blue-400 font-medium">كيفية الحصول على أكواد التحقق</p>
                        <p className="text-sm text-slate-400 mt-1">
                          سجّل موقعك في أدوات مشرفي المحركات ثم انسخ كود التحقق والصقه هنا
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Google Search Verification
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.googleVerification}
                        onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })}
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="abc123def456..."
                        dir="ltr"
                      />
                      <a
                        href="https://search.google.com/search-console"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Bing Webmaster Verification
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.bingVerification}
                        onChange={(e) => setSettings({ ...settings, bingVerification: e.target.value })}
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="ABC123DEF456..."
                        dir="ltr"
                      />
                      <a
                        href="https://www.bing.com/webmasters"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Yandex Webmaster Verification
                    </label>
                    <input
                      type="text"
                      value={settings.yandexVerification}
                      onChange={(e) => setSettings({ ...settings, yandexVerification: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="abc123def456..."
                      dir="ltr"
                    />
                  </div>

                  {(settings.googleVerification || settings.bingVerification || settings.yandexVerification) && (
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">أكواد Meta الناتجة</h3>
                        <button
                          onClick={() => copyToClipboard(generateVerificationTags(), 'verification')}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          {copied === 'verification' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied === 'verification' ? 'تم النسخ' : 'نسخ'}
                        </button>
                      </div>
                      <pre className="bg-slate-900 rounded-lg p-4 text-sm overflow-x-auto" dir="ltr">
                        <code className="text-green-400">{generateVerificationTags()}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Social Tab */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Image className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-purple-400 font-medium">Open Graph و Twitter Cards</p>
                        <p className="text-sm text-slate-400 mt-1">
                          هذه الإعدادات تتحكم في كيفية ظهور موقعك عند مشاركته على وسائل التواصل
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      عنوان المشاركة (OG Title)
                    </label>
                    <input
                      type="text"
                      value={settings.ogTitle}
                      onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      وصف المشاركة (OG Description)
                    </label>
                    <textarea
                      value={settings.ogDescription}
                      onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      صورة المشاركة (OG Image)
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={settings.ogImage}
                        onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        dir="ltr"
                      />
                      {settings.ogImage && (
                        <div className="w-20 h-20 bg-slate-700 rounded-lg overflow-hidden">
                          <img
                            src={settings.ogImage}
                            alt="OG Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">الحجم المثالي: 1200x630 بيكسل</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      حساب تويتر (Twitter Handle)
                    </label>
                    <input
                      type="text"
                      value={settings.twitterHandle}
                      onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="@username"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              {/* Schema Tab */}
              {activeTab === 'schema' && (
                <div className="space-y-6">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-green-400 font-medium">البيانات المنظمة (Structured Data)</p>
                        <p className="text-sm text-slate-400 mt-1">
                          تساعد محركات البحث والذكاء الاصطناعي على فهم محتوى موقعك بشكل أفضل
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      اسم المنظمة
                    </label>
                    <input
                      type="text"
                      value={settings.organizationName}
                      onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      رابط الشعار
                    </label>
                    <input
                      type="text"
                      value={settings.organizationLogo}
                      onChange={(e) => setSettings({ ...settings, organizationLogo: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      اسم المؤسس
                    </label>
                    <input
                      type="text"
                      value={settings.founderName}
                      onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      نبذة عن المؤسس
                    </label>
                    <textarea
                      value={settings.founderBio}
                      onChange={(e) => setSettings({ ...settings, founderBio: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="font-medium mb-3">معاينة JSON-LD</h3>
                    <pre className="bg-slate-900 rounded-lg p-4 text-xs overflow-x-auto" dir="ltr">
                      <code className="text-green-400">{JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": settings.organizationName,
                        "url": settings.siteUrl,
                        "logo": `${settings.siteUrl}${settings.organizationLogo}`,
                        "founder": {
                          "@type": "Person",
                          "name": settings.founderName,
                          "description": settings.founderBio
                        }
                      }, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Robots Tab */}
              {activeTab === 'robots' && (
                <div className="space-y-6">
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Bot className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-cyan-400 font-medium">إعدادات الزحف والذكاء الاصطناعي</p>
                        <p className="text-sm text-slate-400 mt-1">
                          تحكم في كيفية زحف المحركات وروبوتات الذكاء الاصطناعي إلى موقعك
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Search className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">محركات البحث</p>
                            <p className="text-xs text-slate-400">Google, Bing, etc.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.allowAllBots}
                            onChange={(e) => setSettings({ ...settings, allowAllBots: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">ChatGPT / GPTBot</p>
                            <p className="text-xs text-slate-400">OpenAI</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.allowGPTBot}
                            onChange={(e) => setSettings({ ...settings, allowGPTBot: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="font-medium">Claude / Anthropic</p>
                            <p className="text-xs text-slate-400">Claude AI</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.allowClaudeBot}
                            onChange={(e) => setSettings({ ...settings, allowClaudeBot: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium">Sitemap</p>
                            <p className="text-xs text-slate-400">خريطة الموقع</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.sitemapEnabled}
                            onChange={(e) => setSettings({ ...settings, sitemapEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      المسارات المحظورة (Disallow Paths)
                    </label>
                    <textarea
                      value={settings.disallowPaths}
                      onChange={(e) => setSettings({ ...settings, disallowPaths: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono"
                      placeholder="/admin/, /api/, /private/"
                      dir="ltr"
                    />
                    <p className="text-xs text-slate-500 mt-1">افصل بين المسارات بفاصلة</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">معاينة robots.txt</h3>
                      <button
                        onClick={() => copyToClipboard(`User-agent: *
${settings.allowAllBots ? 'Allow: /' : 'Disallow: /'}
${settings.disallowPaths.split(',').map(p => `Disallow: ${p.trim()}`).join('\n')}

${settings.allowGPTBot ? `User-agent: GPTBot\nAllow: /` : `User-agent: GPTBot\nDisallow: /`}

${settings.allowClaudeBot ? `User-agent: Claude-Web\nAllow: /` : `User-agent: Claude-Web\nDisallow: /`}

Sitemap: ${settings.siteUrl}/sitemap.xml`, 'robots')}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {copied === 'robots' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied === 'robots' ? 'تم النسخ' : 'نسخ'}
                      </button>
                    </div>
                    <pre className="bg-slate-900 rounded-lg p-4 text-xs overflow-x-auto" dir="ltr">
                      <code className="text-cyan-400">{`User-agent: *
${settings.allowAllBots ? 'Allow: /' : 'Disallow: /'}
${settings.disallowPaths.split(',').map(p => `Disallow: ${p.trim()}`).join('\n')}

${settings.allowGPTBot ? `User-agent: GPTBot\nAllow: /` : `User-agent: GPTBot\nDisallow: /`}

${settings.allowClaudeBot ? `User-agent: Claude-Web\nAllow: /` : `User-agent: Claude-Web\nDisallow: /`}

Sitemap: ${settings.siteUrl}/sitemap.xml`}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}
                
                {saved && (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    تم حفظ الإعدادات بنجاح
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      حفظ الإعدادات
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
