'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Award,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Target,
  QrCode,
  Shield,
  ArrowLeft,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface CertificateInfo {
  certificateNumber: string;
  score: number;
  status: string;
  issueDate: string;
  user: {
    name: string;
    email: string;
  };
  certificate: {
    title: string;
    titleEn: string;
    level: string;
    category: string;
    passingScore: number;
  };
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificate, setCertificate] = useState<CertificateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setCertificateNumber(id);
      verifyCertificate(id);
    }
  }, [searchParams]);

  const verifyCertificate = async (certNumber?: string) => {
    const number = certNumber || certificateNumber;
    if (!number.trim()) {
      setError('الرجاء إدخال رقم الشهادة');
      return;
    }

    setLoading(true);
    setError('');
    setCertificate(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(number)}`);
      const data = await res.json();

      if (data.success) {
        setCertificate(data.data);
      } else {
        setError(data.error || 'الشهادة غير موجودة');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
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
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            التحقق من الشهادة
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            أدخل رقم الشهادة للتحقق من صحتها
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && verifyCertificate()}
              placeholder="أدخل رقم الشهادة (مثال: MRJ-XXXXX-XXXX)"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => verifyCertificate()}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">تحقق</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="font-bold text-red-800 dark:text-red-200">شهادة غير صالحة</h3>
                <p className="text-red-600 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Info */}
        {certificate && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-300" />
                <div>
                  <h2 className="text-xl font-bold">شهادة صالحة</h2>
                  <p className="text-white/80">تم التحقق بنجاح</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Certificate Details */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    معلومات الشهادة
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 text-sm w-20">العنوان:</span>
                      <div>
                        <span className="text-slate-800 dark:text-white font-medium">{certificate.certificate.title}</span>
                        <p className="text-slate-500 text-sm">{certificate.certificate.titleEn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-sm w-20">المستوى:</span>
                      <span className="flex items-center gap-1">
                        <span>{levelIcons[certificate.certificate.level]}</span>
                        <span className="text-slate-800 dark:text-white">{certificate.certificate.level}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-sm w-20">الدرجة:</span>
                      <span className="text-slate-800 dark:text-white font-bold">{certificate.score}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-sm w-20">الحالة:</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        certificate.status === 'valid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {certificate.status === 'valid' ? 'صالحة' : 'ملغاة'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-500" />
                    معلومات الحاصل
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-sm w-20">الاسم:</span>
                      <span className="text-slate-800 dark:text-white">{certificate.user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-sm w-20">تاريخ:</span>
                      <span className="text-slate-800 dark:text-white">
                        {new Date(certificate.issueDate).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Number */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">رقم الشهادة</p>
                    <p className="font-mono text-lg text-slate-800 dark:text-white">{certificate.certificateNumber}</p>
                  </div>
                  <div className="text-left">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  تم التحقق في {new Date().toLocaleDateString('ar-EG')}
                </p>
                <div className="flex items-center gap-1 text-green-500 text-sm">
                  <Shield className="w-4 h-4" />
                  شهادة موثقة من ECERTIFPRO
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!certificate && !error && !loading && (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              أدخل رقم الشهادة للتحقق منها
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center" dir="rtl">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
