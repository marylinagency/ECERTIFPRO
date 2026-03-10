import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الشهادات المعتمدة',
  description: 'احصل على شهادات معتمدة في لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. شهادات تحمل التوقيع الرقمي للمؤسس ومعترف بها عالمياً.',
  keywords: ['شهادات لغة المرجع', 'شهادات معتمدة', 'شهادات برمجية', 'شهادة مبرمج'],
  authors: [{ name: 'رضوان دالي حمدوني' }],
  openGraph: {
    title: 'الشهادات المعتمدة | ECERTIFPRO',
    description: 'احصل على شهادات معتمدة في لغة المرجع - معترف بها عالمياً',
    url: 'https://ecertifpro.com/certificates',
    siteName: 'ECERTIFPRO',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الشهادات المعتمدة | ECERTIFPRO',
    description: 'احصل على شهادات معتمدة في لغة المرجع',
    creator: '@almarjaa_lang',
  },
  alternates: {
    canonical: '/certificates',
  },
}

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
