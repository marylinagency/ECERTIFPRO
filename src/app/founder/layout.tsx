import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'المؤسس - رضوان دالي حمدوني',
  description: 'رضوان دالي حمدوني - مخترع لغة المرجع، أول لغة برمجة AI-أصيلة بالعربية. رائد أعمال تونسي، خبير في الذكاء الاصطناعي والتحول الرقمي، يحمل ماجستير في الأنظمة الميكاترونية. كاتب وأديب يجمع بين التقنية والأدب.',
  keywords: [
    'رضوان دالي حمدوني',
    'Radhwen Daly Hamdouni',
    'مخترع لغة المرجع',
    'لغة المرجع',
    'Al-Marjaa Language',
    'رائد أعمال تونسي',
    'خبير ذكاء اصطناعي',
    'مهندس ميكاترونكس',
    'كاتب وأديب',
  ],
  authors: [{ name: 'رضوان دالي حمدوني' }],
  openGraph: {
    title: 'المؤسس - رضوان دالي حمدوني | ECERTIFPRO',
    description: 'مخترع لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. رائد أعمال تونسي يجمع بين التقنية والأدب.',
    url: 'https://ecertifpro.com/founder',
    siteName: 'ECERTIFPRO',
    type: 'profile',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المؤسس - رضوان دالي حمدوني | ECERTIFPRO',
    description: 'مخترع لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية',
    creator: '@almarjaa_lang',
  },
  alternates: {
    canonical: '/founder',
  },
}

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
