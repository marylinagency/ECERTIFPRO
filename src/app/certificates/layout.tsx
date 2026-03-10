import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الشهادات المعتمدة',
  description: 'احصل على شهادات معتمدة في لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. شهادات تحمل التوقيع الرقمي للمؤسس ومعترف بها عالمياً. مستويات متعددة من المبتدئ إلى الخبير.',
  keywords: [
    'شهادات لغة المرجع',
    'شهادات معتمدة',
    'شهادات برمجية',
    'شهادة مبرمج',
    'اعتماد مهني',
    'شهادة AI',
    'شهادة برمجة عربية',
    'Al-Marjaa certification',
    'professional certificate',
  ],
  authors: [{ name: 'رضوان دالي حمدوني' }],
  openGraph: {
    title: 'الشهادات المعتمدة | ECERTIFPRO',
    description: 'احصل على شهادات معتمدة في لغة المرجع - شهادات تحمل التوقيع الرقمي للمؤسس ومعترف بها عالمياً',
    url: 'https://ecertifpro.com/certificates',
    siteName: 'ECERTIFPRO',
    type: 'website',
    locale: 'ar_SA',
    images: [
      {
        url: '/certificates-og.png',
        width: 1200,
        height: 630,
        alt: 'شهادات لغة المرجع المعتمدة - ECERTIFPRO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الشهادات المعتمدة | ECERTIFPRO',
    description: 'احصل على شهادات معتمدة في لغة المرجع - معترف بها عالمياً',
    images: ['/certificates-og.png'],
    creator: '@almarjaa_lang',
  },
  alternates: {
    canonical: '/certificates',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
