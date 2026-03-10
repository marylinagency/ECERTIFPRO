import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description: 'تواصل مع فريق ECERTIFPRO - المنصة الرسمية لشهادات لغة المرجع. نحن هنا للإجابة على استفساراتك.',
  keywords: ['تواصل ECERTIFPRO', 'اتصل بنا', 'دعم فني', 'استفسار شهادات'],
  authors: [{ name: 'رضوان دالي حمدوني' }],
  openGraph: {
    title: 'تواصل معنا | ECERTIFPRO',
    description: 'تواصل مع فريق ECERTIFPRO - المنصة الرسمية لشهادات لغة المرجع',
    url: 'https://ecertifpro.com/contact',
    siteName: 'ECERTIFPRO',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary',
    title: 'تواصل معنا | ECERTIFPRO',
    description: 'تواصل مع فريق ECERTIFPRO',
    creator: '@almarjaa_lang',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
