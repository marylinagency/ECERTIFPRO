'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  Menu,
  X,
  Filter,
  Search,
  Target
} from 'lucide-react';

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

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    fetch('/api/certificates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCertificates(data.data);
          setFilteredCertificates(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = certificates;

    if (searchTerm) {
      filtered = filtered.filter(cert => 
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cert => cert.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(cert => cert.level === selectedLevel);
    }

    // Use requestAnimationFrame to avoid synchronous setState
    requestAnimationFrame(() => {
      setFilteredCertificates(filtered);
    });
  }, [searchTerm, selectedCategory, selectedLevel, certificates]);

  const categories = [
    { id: 'all', name: 'الكل', icon: Filter },
    { id: 'برمجة', name: 'برمجة', icon: Code },
    { id: 'ذكاء اصطناعي', name: 'ذكاء اصطناعي', icon: Brain },
    { id: 'تطوير ويب', name: 'تطوير ويب', icon: Globe },
    { id: 'أمن سيبراني', name: 'أمن سيبراني', icon: Shield },
    { id: 'تحليل بيانات', name: 'تحليل بيانات', icon: BarChart3 },
  ];

  const levels = [
    { id: 'all', name: 'جميع المستويات' },
    { id: 'مبتدئ', name: 'مبتدئ' },
    { id: 'متوسط', name: 'متوسط' },
    { id: 'متقدم', name: 'متقدم' },
    { id: 'خبير', name: 'خبير' },
  ];

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

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">الرئيسية</Link>
              <Link href="/certificates" className="text-blue-600 font-medium">الشهادات</Link>
              <Link href="/verify" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">التحقق</Link>
            </div>

            <Link
              href="/?auth=true"
              className="hidden md:flex px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              تسجيل الدخول
            </Link>

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
              <Link href="/certificates" className="text-blue-600 py-2 font-medium">الشهادات</Link>
              <Link href="/verify" className="text-slate-600 dark:text-slate-300 py-2">التحقق</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              جميع الشهادات المتاحة
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              استكشف شهاداتنا المهنية المعتمدة
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن شهادة..."
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-slate-600 dark:text-slate-400">
            عرض {filteredCertificates.length} من {certificates.length} شهادة
          </div>

          {/* Certificates Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                لا توجد شهادات مطابقة للبحث
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Level Bar */}
                  <div className={`h-2 bg-gradient-to-r ${levelColors[cert.level]}`}></div>

                  <div className="p-6">
                    {/* Level Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{levelIcons[cert.level]}</span>
                        <span className="text-sm text-slate-500">{cert.level}</span>
                      </div>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                        {cert.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{cert.titleEn}</p>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                      {cert.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {cert.examDuration} دقيقة
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {cert.totalQuestions} سؤال
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {cert.passingScore}%
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">${cert.price}</span>
                        {cert.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">${cert.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/exam/${cert.id}`}
                      className={`block w-full text-center py-3 rounded-xl font-medium text-white bg-gradient-to-r ${levelColors[cert.level]} hover:shadow-lg transition-all`}
                    >
                      ابدأ الاختبار الآمن
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} ECERTIFPRO. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
