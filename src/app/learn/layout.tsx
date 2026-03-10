import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تعلم لغة المرجع',
  description: 'تعلم لغة المرجع من الصفر إلى الاحتراف - منصة تعليمية شاملة تحتوي على دروس تفاعلية، أمثلة برمجية، وتمارين عملية. احصل على شهادات معتمدة بعد إكمال كل مستوى.',
  keywords: [
    'تعلم لغة المرجع',
    'دورة لغة المرجع',
    'تعلم البرمجة بالعربية',
    'برمجة عربية',
    'دروس برمجة',
    'شهادات برمجية',
  ],
  authors: [{ name: 'رضوان دالي حمدوني' }],
  openGraph: {
    title: 'تعلم لغة المرجع | ECERTIFPRO',
    description: 'منصة تعليمية شاملة لتعلم لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية',
    url: 'https://ecertifpro.com/learn',
    siteName: 'ECERTIFPRO',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تعلم لغة المرجع | ECERTIFPRO',
    description: 'منصة تعليمية شاملة لتعلم لغة المرجع',
    creator: '@almarjaa_lang',
  },
  alternates: {
    canonical: '/learn',
  },
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
