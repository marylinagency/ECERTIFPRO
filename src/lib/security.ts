// ============================================
// نظام الأمان الشامل - Comprehensive Security System
// ============================================

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// ============================================
// Rate Limiter - تحديد معدل الطلبات
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDuration?: number;
  keyGenerator?: (req: NextRequest) => string;
}

export const rateLimitConfigs = {
  // تسجيل الدخول - حماية من brute force
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, blockDuration: 30 * 60 * 1000 },
  // إنشاء حساب
  register: { windowMs: 60 * 60 * 1000, maxRequests: 3, blockDuration: 24 * 60 * 60 * 1000 },
  // نموذج التواصل
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 5, blockDuration: 2 * 60 * 60 * 1000 },
  // الدفع
  payment: { windowMs: 60 * 60 * 1000, maxRequests: 10 },
  // الاختبارات
  exam: { windowMs: 60 * 60 * 1000, maxRequests: 5 },
  // API عام
  api: { windowMs: 60 * 1000, maxRequests: 100 },
  // Admin
  admin: { windowMs: 60 * 1000, maxRequests: 200 },
  // Webhooks
  webhook: { windowMs: 60 * 1000, maxRequests: 1000 },
};

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; blocked: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // إذا كان محظوراً
  if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blocked: true,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // إذا انتهت النافذة الزمنية
  if (!entry || entry.resetTime <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
      blocked: false,
    };
  }

  // إذا تجاوز الحد الأقصى
  if (entry.count >= config.maxRequests) {
    if (config.blockDuration && !entry.blocked) {
      entry.blocked = true;
      entry.blockedUntil = now + config.blockDuration;
      rateLimitStore.set(identifier, entry);
    }
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil || entry.resetTime,
      blocked: entry.blocked || false,
      retryAfter: Math.ceil(((entry.blockedUntil || entry.resetTime) - now) / 1000),
    };
  }

  // زيادة العداد
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
    blocked: false,
  };
}

// ============================================
// Input Validation & Sanitization
// ============================================

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,
  /eval\s*\(/gi,
  /document\./gi,
  /window\./gi,
  /\.innerHTML/gi,
  /\.outerHTML/gi,
  /INSERT\s+INTO/gi,
  /SELECT\s+.*\s+FROM/gi,
  /UPDATE\s+.*\s+SET/gi,
  /DELETE\s+FROM/gi,
  /DROP\s+TABLE/gi,
  /UNION\s+SELECT/gi,
  /OR\s+1\s*=\s*1/gi,
  /'\s*OR\s*'/gi,
  /--\s*$/gm,
  /;\s*--/gi,
  /\.\.\/\.\.\//g,
  /%2e%2e%2f/gi,
  /%252e%252e%252f/gi,
];

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  let sanitized = input;
  
  // إزالة الأنماط الخطرة
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }
  
  // إزالة الأحرف الخطرة
  sanitized = sanitized
    .replace(/[<>]/g, '')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
  
  return sanitized;
}

export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'البريد الإلكتروني مطلوب' };
  }
  
  if (email.length > 254) {
    return { valid: false, error: 'البريد الإلكتروني طويل جداً' };
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'صيغة البريد الإلكتروني غير صحيحة' };
  }
  
  // فحص النطاقات المؤقتة
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', '10minutemail.com',
    'throwaway.email', 'mailinator.com', 'fakeinbox.com',
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return { valid: false, error: 'لا يُسمح بالبريد الإلكتروني المؤقت' };
  }
  
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; errors: string[]; strength: number } {
  const errors: string[] = [];
  let strength = 0;
  
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['كلمة المرور مطلوبة'], strength: 0 };
  }
  
  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  } else {
    strength += 20;
  }
  
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  
  if (!/[A-Z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  } else {
    strength += 20;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  } else {
    strength += 20;
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('يجب أن تحتوي على رقم واحد على الأقل');
  } else {
    strength += 15;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
  } else {
    strength += 15;
  }
  
  // فحص كلمات المرور الشائعة
  const commonPasswords = [
    'password123', '12345678', 'qwerty123', 'password', 'admin123',
    'letmein', 'welcome', 'monkey', 'dragon', 'master',
  ];
  if (commonPasswords.some(p => password.toLowerCase().includes(p))) {
    errors.push('كلمة المرور تحتوي على كلمة شائعة');
    strength = Math.max(0, strength - 30);
  }
  
  return { valid: errors.length === 0, errors, strength: Math.min(100, strength) };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'الاسم مطلوب' };
  }
  
  const sanitized = name.trim();
  
  if (sanitized.length < 2) {
    return { valid: false, error: 'الاسم قصير جداً' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, error: 'الاسم طويل جداً' };
  }
  
  if (/[<>{}[\]\\\/]/.test(sanitized)) {
    return { valid: false, error: 'الاسم يحتوي على أحرف غير مسموحة' };
  }
  
  return { valid: true };
}

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: true }; // اختياري
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, error: 'رقم الهاتف غير صحيح' };
  }
  
  return { valid: true };
}

// ============================================
// CSRF Protection
// ============================================

const csrfTokens = new Map<string, { token: string; expires: number; used: boolean }>();

export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 2 * 60 * 60 * 1000,
    used: false,
  });
  return token;
}

export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) return false;
  if (stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  if (stored.used) return false; // منع إعادة الاستخدام
  
  stored.used = true;
  csrfTokens.set(sessionId, stored);
  
  return crypto.timingSafeEqual(
    Buffer.from(stored.token),
    Buffer.from(token)
  );
}

// ============================================
// Security Headers
// ============================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.sandbox.paypal.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://api.paypal.com https://api-m.paypal.com https://api.coinbase.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.paypal.com https://www.sandbox.paypal.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
}

export function applySecurityHeaders(response: NextResponse): NextResponse {
  const headers = getSecurityHeaders();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

// ============================================
// IP Address Utilities
// ============================================

export function getClientIP(request: NextRequest): string {
  // ترتيب الأولوية للحصول على IP الحقيقي
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded',
  ];
  
  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      const ip = value.split(',')[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }
  
  return 'unknown';
}

function isValidIP(ip: string): boolean {
  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// ============================================
// Password Utilities
// ============================================

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

// ============================================
// Token Generation
// ============================================

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(24).toString('hex');
  return `${timestamp}-${random}`;
}

export function generateOrderId(prefix: string = 'PAY'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ============================================
// Webhook Signature Verification
// ============================================

export function verifyStripeSignature(
  payload: string | Buffer,
  signature: string,
  secret: string,
  tolerance: number = 300 // 5 دقائق
): { valid: boolean; event?: unknown; error?: string } {
  try {
    const elements = signature.split(',');
    const timestamp = elements.find(e => e.startsWith('t='))?.slice(2);
    const signatures = elements.filter(e => e.startsWith('v1=')).map(e => e.slice(3));
    
    if (!timestamp || signatures.length === 0) {
      return { valid: false, error: 'Invalid signature format' };
    }
    
    const timestampNum = parseInt(timestamp, 10);
    if (Math.abs(Date.now() / 1000 - timestampNum) > tolerance) {
      return { valid: false, error: 'Signature timestamp too old' };
    }
    
    const payloadString = typeof payload === 'string' ? payload : payload.toString();
    const signedPayload = `${timestamp}.${payloadString}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');
    
    const isValid = signatures.some(sig => 
      crypto.timingSafeEqual(
        Buffer.from(sig),
        Buffer.from(expectedSignature)
      )
    );
    
    return { valid: isValid, error: isValid ? undefined : 'Signature mismatch' };
  } catch (error) {
    return { valid: false, error: 'Signature verification failed' };
  }
}

export function verifyPayPalSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export function verifyCoinbaseSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================
// Fraud Detection
// ============================================

export interface FraudCheckResult {
  risk: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  flags: string[];
  recommendation: 'allow' | 'review' | 'block';
}

export function checkPaymentFraud(data: {
  amount: number;
  currency: string;
  email: string;
  ip: string;
  userId?: string;
  userAgent?: string;
}): FraudCheckResult {
  const flags: string[] = [];
  let score = 0;
  
  // فحص المبلغ
  if (data.amount > 500) {
    flags.push('مبلغ مرتفع');
    score += 20;
  }
  if (data.amount > 1000) {
    flags.push('مبلغ مرتفع جداً');
    score += 30;
  }
  
  // فحص البريد الإلكتروني
  const disposableDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com'];
  const emailDomain = data.email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(emailDomain)) {
    flags.push('بريد إلكتروني مؤقت');
    score += 50;
  }
  
  // فحص IP
  if (data.ip === 'unknown') {
    flags.push('IP غير معروف');
    score += 15;
  }
  
  // فحص User Agent
  if (!data.userAgent || data.userAgent.length < 20) {
    flags.push('User Agent مشبوه');
    score += 20;
  }
  
  // تحديد مستوى الخطورة
  let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let recommendation: 'allow' | 'review' | 'block' = 'allow';
  
  if (score >= 80) {
    risk = 'critical';
    recommendation = 'block';
  } else if (score >= 50) {
    risk = 'high';
    recommendation = 'review';
  } else if (score >= 25) {
    risk = 'medium';
    recommendation = 'review';
  }
  
  return { risk, score, flags, recommendation };
}

// ============================================
// Audit Logging
// ============================================

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId?: string;
  ip: string;
  userAgent?: string;
  details: Record<string, unknown>;
  success: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
}

const auditLogs: AuditLogEntry[] = [];
const MAX_LOGS = 10000;

export function logAuditEvent(
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): void {
  const logEntry: AuditLogEntry = {
    ...entry,
    id: generateSecureToken(8),
    timestamp: new Date(),
  };
  
  auditLogs.push(logEntry);
  
  // الاحتفاظ بآخر MAX_LOGS سجل
  if (auditLogs.length > MAX_LOGS) {
    auditLogs.shift();
  }
  
  // تسجيل في console في بيئة التطوير
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', logEntry);
  }
}

export function getAuditLogs(limit: number = 100, filter?: {
  userId?: string;
  action?: string;
  success?: boolean;
}): AuditLogEntry[] {
  let logs = auditLogs.slice(-limit * 10);
  
  if (filter) {
    if (filter.userId) {
      logs = logs.filter(l => l.userId === filter.userId);
    }
    if (filter.action) {
      logs = logs.filter(l => l.action.includes(filter.action!));
    }
    if (filter.success !== undefined) {
      logs = logs.filter(l => l.success === filter.success);
    }
  }
  
  return logs.slice(-limit);
}

// ============================================
// Middleware Helper
// ============================================

export function createSecurityMiddleware(config: {
  rateLimit?: keyof typeof rateLimitConfigs;
  requireAuth?: boolean;
  allowedMethods?: string[];
}) {
  return async function securityMiddleware(
    request: NextRequest
  ): Promise<NextResponse | null> {
    const ip = getClientIP(request);
    
    // فحص Rate Limit
    if (config.rateLimit) {
      const rateLimitResult = checkRateLimit(
        `${config.rateLimit}:${ip}`,
        rateLimitConfigs[config.rateLimit]
      );
      
      if (!rateLimitResult.allowed) {
        logAuditEvent({
          action: 'rate_limit_exceeded',
          ip,
          userAgent: request.headers.get('user-agent') || undefined,
          details: { config: config.rateLimit },
          success: false,
          riskLevel: rateLimitResult.blocked ? 'high' : 'medium',
        });
        
        return NextResponse.json(
          { 
            success: false, 
            error: 'طلبات كثيرة جداً، يرجى المحاولة لاحقاً',
            retryAfter: rateLimitResult.retryAfter 
          },
          { 
            status: 429,
            headers: {
              'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            }
          }
        );
      }
    }
    
    // فحص HTTP Method
    if (config.allowedMethods && !config.allowedMethods.includes(request.method)) {
      logAuditEvent({
        action: 'method_not_allowed',
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
        details: { method: request.method, allowed: config.allowedMethods },
        success: false,
        riskLevel: 'medium',
      });
      
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      );
    }
    
    return null; // متابعة الطلب
  };
}

// ============================================
// Clean up - تنظيف دوري
// ============================================

// تنظيف كل 5 دقائق
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    
    // تنظيف Rate Limiter
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime <= now && !entry.blocked) {
        rateLimitStore.delete(key);
      } else if (entry.blockedUntil && entry.blockedUntil <= now) {
        rateLimitStore.delete(key);
      }
    }
    
    // تنظيف CSRF Tokens
    for (const [key, value] of csrfTokens.entries()) {
      if (value.expires <= now) {
        csrfTokens.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
