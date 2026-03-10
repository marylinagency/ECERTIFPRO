import type { Metadata } from "next";
import { Noto_Kufi_Arabic, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // العنوان والوصف الأساسي
  title: {
    default: "ECERTIFPRO - المنصة الرسمية لشهادات لغة المرجع",
    template: "%s | ECERTIFPRO",
  },
  description: "ECERTIFPRO هي المنصة الرسمية والوحيدة المرخصة لتقديم شهادات معتمدة في لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. شهادات تحمل التوقيع الرقمي للمؤسس ومعترف بها عالمياً.",
  
  // الكلمات المفتاحية
  keywords: [
    "لغة المرجع",
    "Al-Marjaa Language",
    "لغة برمجة عربية",
    "برمجة بالعربية",
    "أول لغة برمجة عربية",
    "لغة برمجة AI-أصيلة",
    "ECERTIFPRO",
    "شهادات معتمدة",
    "شهادات مهنية",
    "شهادات إلكترونية",
    "تصديق الشهادات",
    "التحقق من الشهادات",
    "الذكاء الاصطناعي",
    "تعلم البرمجة",
    "تطوير البرمجيات",
    "Rust",
    "برمجة أنظمة",
    "رضوان دالي حمدوني",
    "Radhwen Daly Hamdouni",
    "تعلم البرمجة بالعربية",
    "دورات برمجة عربية",
    "شهادات برمجية عربية",
  ],
  
  // المؤلفين
  authors: [{ 
    name: "رضوان دالي حمدوني",
    url: "https://github.com/radhwendalyhamdouni",
  }],
  
  // المالك والناشر
  creator: "رضوان دالي حمدوني",
  publisher: "ECERTIFPRO",
  
  // الروابط الأساسية
  metadataBase: new URL("https://ecertifpro.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ar": "/",
    },
  },
  
  // الأيقونات
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Open Graph - فيسبوك ولينكدإن
  openGraph: {
    title: "ECERTIFPRO - المنصة الرسمية لشهادات لغة المرجع",
    description: "المنصة الرسمية والوحيدة المرخصة لتقديم شهادات معتمدة في لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. شهادات تحمل التوقيع الرقمي للمؤسس رضوان دالي حمدوني.",
    url: "https://ecertifpro.com",
    siteName: "ECERTIFPRO",
    type: "website",
    locale: "ar_SA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ECERTIFPRO - شهادات لغة المرجع المعتمدة",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "ECERTIFPRO - المنصة الرسمية لشهادات لغة المرجع",
    description: "احصل على شهادات معتمدة في لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية",
    images: ["/og-image.png"],
    creator: "@almarjaa_lang",
    site: "@almarjaa_lang",
  },
  
  // الفئات
  category: "Education",
  classification: "Professional Certification Platform",
  
  // الإعدادات التقنية
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // التطبيق
  applicationName: "ECERTIFPRO",
  
  // التنسيق
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // أخرى
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ecertifpro.com/#website",
      "url": "https://ecertifpro.com",
      "name": "ECERTIFPRO",
      "description": "المنصة الرسمية لشهادات لغة المرجع المعتمدة",
      "inLanguage": "ar",
      "publisher": {
        "@id": "https://ecertifpro.com/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://ecertifpro.com/#organization",
      "name": "ECERTIFPRO",
      "alternateName": "منصة الشهادات المهنية",
      "url": "https://ecertifpro.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ecertifpro.com/logo.svg",
        "width": 200,
        "height": 60,
      },
      "description": "المنصة الرسمية والوحيدة المرخصة لتقديم شهادات معتمدة في لغة المرجع",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "@id": "https://ecertifpro.com/#founder",
      },
      "sameAs": [
        "https://github.com/radhwendalyhamdouni/ECERTIFPRO",
        "https://github.com/radhwendalyhamdouni/Al-Marjaa-Language",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://ecertifpro.com/#founder",
      "name": "رضوان دالي حمدوني",
      "alternateName": "Radhwen Daly Hamdouni",
      "jobTitle": "مخترع لغة المرجع",
      "description": "مخترع لغة المرجع - أول لغة برمجة AI-أصيلة بالعربية. رائد أعمال تونسي، خبير في الذكاء الاصطناعي والتحول الرقمي، يحمل ماجستير في الأنظمة الميكاترونية.",
      "url": "https://ecertifpro.com/founder",
      "sameAs": [
        "https://github.com/radhwendalyhamdouni",
      ],
      "knowsAbout": [
        "الذكاء الاصطناعي",
        "تصميم لغات البرمجة",
        "Rust",
        "الميكاترونكس",
        "التحول الرقمي",
        "الأدب العربي",
      ],
      "nationality": "تونسية",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ecertifpro.com/#almarjaa-language",
      "name": "لغة المرجع",
      "alternateName": "Al-Marjaa Language",
      "description": "أول لغة برمجة AI-أصيلة بالعربية، مبنية من الصفر باستخدام Rust. تدمج الذكاء الاصطناعي في صميمها وتدعم البنية التحتية للحوسبة منخفضة الموارد.",
      "url": "https://github.com/radhwendalyhamdouni/Al-Marjaa-Language",
      "applicationCategory": "ProgrammingLanguage",
      "operatingSystem": "Cross-platform",
      "programmingLanguage": "Rust",
      "author": {
        "@id": "https://ecertifpro.com/#founder",
      },
      "inLanguage": "ar",
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://ecertifpro.com/#education",
      "name": "ECERTIFPRO Learning Platform",
      "description": "منصة تعليمية للحصول على شهادات معتمدة في لغة المرجع",
      "url": "https://ecertifpro.com/learn",
      "educationalLevel": "Beginner to Advanced",
    },
  ],
};

// BreadcrumbList for AI understanding
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "الرئيسية",
      "item": "https://ecertifpro.com",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "تعلم لغة المرجع",
      "item": "https://ecertifpro.com/learn",
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "المؤسس",
      "item": "https://ecertifpro.com/founder",
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "تواصل معنا",
      "item": "https://ecertifpro.com/contact",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        
        {/* Additional Meta Tags for AI */}
        <meta name="ai-platform" content="ECERTIFPRO - Official certification platform for Al-Marjaa Language" />
        <meta name="ai-language" content="Arabic programming language certification" />
        <meta name="ai-founder" content="Radhwen Daly Hamdouni - Inventor of Al-Marjaa Language" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        
        {/* Geographic Meta */}
        <meta name="geo.region" content="AR" />
        <meta name="geo.placename" content="العالم العربي" />
        
        {/* Language */}
        <meta httpEquiv="content-language" content="ar" />
      </head>
      <body
        className={`${tajawal.variable} ${notoKufi.variable} font-sans antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Tajawal', 'Noto Kufi Arabic', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
