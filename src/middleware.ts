// ============================================
// Security Middleware - طبقة حماية شاملة
// ============================================

import { NextRequest, NextResponse } from 'next/server';

// المسارات المحمية
const protectedPaths = [
  '/api/admin',
  '/api/payments',
  '/api/exam',
  '/api/auth',
];

// المسارات العامة
const publicPaths = [
  '/api/certificates',
  '/api/verify',
  '/api/webhooks',
];

// المسارات التي تحتاج مصادقة
const authRequiredPaths = [
  '/api/admin',
  '/api/exam/session',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // تخطي الملفات الثابتة والموارد
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/_next/static') ||
    pathname.includes('favicon.ico') ||
    pathname.includes('robots.txt') ||
    pathname.includes('sitemap.xml') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|css|js|map)$/)
  ) {
    return NextResponse.next();
  }
  
  // إنشاء response أساسي
  const response = NextResponse.next();
  
  // إضافة Security Headers أساسية فقط
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // حماية API Routes فقط
  if (pathname.startsWith('/api/')) {
    // تسجيل الطلبات المشبوهة
    const suspiciousPatterns = [
      /\.\./,  // Path traversal
      /<script/i,  // XSS
      /union.*select/i,  // SQL Injection
      /eval\s*\(/i,  // Code injection
    ];
    
    const fullPath = pathname + request.nextUrl.search;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(fullPath));
    
    if (isSuspicious) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }
    
    // حماية Admin Routes
    if (pathname.startsWith('/api/admin')) {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        return NextResponse.json(
          { success: false, error: 'غير مصرح' },
          { status: 401 }
        );
      }
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // تطبيق على جميع المسارات ما عدا الملفات الثابتة
    '/((?!_next/static|_next/image|favicon.ico|public|images|fonts).*)',
  ],
};
