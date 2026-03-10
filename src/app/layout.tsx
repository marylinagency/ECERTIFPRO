import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ECERTIFPRO - شهادات مهنية معتمدة",
  description: "منصة الشهادات المهنية الرائدة في العالم العربي. احصل على شهادات معتمدة في البرمجة، الذكاء الاصطناعي، الأمن السيبراني، تطوير الويب وتحليل البيانات.",
  keywords: ["شهادات مهنية", "شهادات معتمدة", "برمجة", "ذكاء اصطناعي", "أمن سيبراني", "تطوير ويب", "تحليل بيانات", "ECERTIFPRO"],
  authors: [{ name: "رضوان دالي حمدوني" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ECERTIFPRO - شهادات مهنية معتمدة",
    description: "احصل على شهادات مهنية معتمدة في مختلف المجالات التقنية",
    url: "https://ecertifpro.com",
    siteName: "ECERTIFPRO",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECERTIFPRO - شهادات مهنية معتمدة",
    description: "احصل على شهادات مهنية معتمدة في مختلف المجالات التقنية",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
