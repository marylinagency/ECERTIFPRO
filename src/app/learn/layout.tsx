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
    'تعلم البرمجة',
    'Al-Marjaa tutorial',
    'Arabic programming course',
  ],
  authors: [{ name: 'رضوان دالي حمدوني' }],
  openGraph: {
    title: 'تعلم لغة المرجع | ECERTIFPRO',
    description: 'منصة تعليمية شاملة لتعلم لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. دروس تفاعلية وشهادات معتمدة.',
    url: 'https://ecertifpro.com/learn',
    siteName: 'ECERTIFPRO',
    type: 'website',
    locale: 'ar_SA',
    images: [
      {
        url: '/learn-og.png',
        width: 1200,
        height: 630,
        alt: 'تعلم لغة المرجع - منصة ECERTIFPRO التعليمية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تعلم لغة المرجع | ECERTIFPRO',
    description: 'منصة تعليمية شاملة لتعلم لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية',
    images: ['/learn-og.png'],
    creator: '@almarjaa_lang',
  },
  alternates: {
    canonical: '/learn',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
