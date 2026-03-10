import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'التحقق من الشهادة',
  description: 'تحقق من صحة شهادات لغة المرجع - أدخل رقم الشهادة للتحقق من صحتها ومطابقتها للسجلات الرسمية. نظام تحقق آمن وموثوق.',
  keywords: [
    'تحقق من الشهادة',
    'التحقق من الشهادات',
    'التصديق على الشهادة',
    'شهادة موثقة',
    'verify certificate',
    'certificate verification',
    'لغة المرجع تحقق',
  ],
  authors: [{ name: 'رضوان دالي حمدوني' }],
  openGraph: {
    title: 'التحقق من الشهادة | ECERTIFPRO',
    description: 'تحقق من صحة شهادات لغة المرجع - نظام تحقق آمن وموثوق',
    url: 'https://ecertifpro.com/verify',
    siteName: 'ECERTIFPRO',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary',
    title: 'التحقق من الشهادة | ECERTIFPRO',
    description: 'تحقق من صحة شهادات لغة المرجع',
    creator: '@almarjaa_lang',
  },
  alternates: {
    canonical: '/verify',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
