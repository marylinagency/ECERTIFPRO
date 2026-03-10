'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  User,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  Users,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  MapPin,
  Globe
} from 'lucide-react';

const categories = [
  { id: 'general', label: 'استفسار عام', icon: HelpCircle },
  { id: 'support', label: 'دعم فني', icon: AlertCircle },
  { id: 'partnership', label: 'شراكة وتعاون', icon: Users },
  { id: 'feedback', label: 'اقتراح أو ملاحظة', icon: Lightbulb },
  { id: 'certificates', label: 'استفسار عن الشهادات', icon: CheckCircle },
];

const faqs = [
  {
    question: 'كيف يمكنني الحصول على شهادة؟',
    answer: 'يمكنك التسجيل في الاختبار المناسب لمستواك، وبعد اجتيازه بنجاح ستحصل على شهادة معتمدة يمكن تحميلها أو مشاركتها.'
  },
  {
    question: 'هل الدروس مجانية؟',
    answer: 'نعم! جميع الدروس التعليمية مجانية تماماً. فقط الاختبارات والشهادات هي التي تتطلب دفع رسوم.'
  },
  {
    question: 'كم تستغرق مدة الاختبار؟',
    answer: 'تختلف مدة الاختبار حسب المستوى، وتتراوح بين 30 إلى 90 دقيقة.'
  },
  {
    question: 'هل يمكنني إعادة الاختبار إذا لم أنجح؟',
    answer: 'نعم، يمكنك إعادة الاختبار بعد فترة انتظار محددة. راجع شروط كل شهادة لمزيد من التفاصيل.'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'general',
          subject: '',
          message: ''
        });
      } else {
        setError(data.error || 'حدث خطأ في إرسال الرسالة');
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">م</span>
              </div>
              <span className="text-xl font-bold">ECERTIFPRO</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-6">
            <MessageSquare className="w-4 h-4" />
            نحن هنا لمساعدتك
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            تواصل معنا
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            هل لديك سؤال أو استفسار؟ فريقنا جاهز للمساعدة. املأ النموذج أدناه وسنتواصل معك في أقرب وقت.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">تم إرسال رسالتك بنجاح!</h2>
                    <p className="text-slate-400 mb-6">
                      شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      إرسال رسالة أخرى
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-xl font-bold mb-6">أرسل لنا رسالة</h2>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        نوع الاستفسار
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat.id })}
                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                              formData.category === cat.id
                                ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <cat.icon className="w-4 h-4" />
                            <span className="text-sm">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          الاسم الكامل *
                        </label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pr-12 pl-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="أدخل اسمك"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          البريد الإلكتروني *
                        </label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pr-12 pl-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="example@email.com"
                            required
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        رقم الهاتف (اختياري)
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pr-12 pl-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="+966 5X XXX XXXX"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        الموضوع *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="ملخص رسالتك"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        الرسالة *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                        placeholder="اكتب رسالتك بالتفصيل..."
                        required
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          إرسال الرسالة
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Response Time */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">وقت الاستجابة</h3>
                    <p className="text-slate-400 text-sm">نرد خلال 24 ساعة</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">
                  نحن نحرص على الرد على جميع الاستفسارات في أسرع وقت ممكن خلال ساعات العمل.
                </p>
              </div>

              {/* Quick Info */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="font-bold mb-4">معلومات سريعة</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-slate-300">العالم بأسره</p>
                      <p className="text-slate-500 text-sm">حيث يوجد كل عربي على الكرة الأرضية</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-slate-300">متاحون عالمياً</p>
                      <p className="text-slate-500 text-sm">ندعم المتحدثين بالعربية</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="font-bold mb-4">أسئلة شائعة</h3>
                <div className="space-y-4">
                  {faqs.slice(0, 3).map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer text-slate-300 hover:text-white transition-colors flex items-center justify-between">
                        <span className="text-sm">{faq.question}</span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="text-slate-400 text-sm mt-2 pr-4">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية</p>
          <p className="mt-2">
            <Link href="/" className="hover:text-blue-400 transition-colors">الرئيسية</Link>
            {' • '}
            <Link href="/certificates" className="hover:text-blue-400 transition-colors">الشهادات</Link>
            {' • '}
            <Link href="/learn" className="hover:text-blue-400 transition-colors">التعلم</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
