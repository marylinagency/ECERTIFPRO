// ============================================
// Payment Settings API - إعدادات الدفع
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  checkRateLimit, 
  rateLimitConfigs, 
  getClientIP, 
  logAuditEvent, 
  sanitizeInput,
  getSecurityHeaders,
} from '@/lib/security';
import { 
  getPaymentSettings, 
  updatePaymentSettings, 
  isProviderConfigured,
  getAvailableProviders,
} from '@/lib/payments';

// الحصول على الإعدادات
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    // Rate limiting
    const rateLimit = checkRateLimit(`admin-payment-get:${ip}`, rateLimitConfigs.admin);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'طلبات كثيرة' },
        { status: 429 }
      );
    }
    
    // جلب الإعدادات من قاعدة البيانات
    const savedSettings = await db.setting.findMany({
      where: { key: { startsWith: 'payment_' } },
    });
    
    const settingsMap = Object.fromEntries(
      savedSettings.map(s => [s.key.replace('payment_', ''), s.value])
    );
    
    const settings = {
      stripePublicKey: settingsMap.stripePublicKey || process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
      stripeSecretKey: settingsMap.stripeSecretKey || '',
      stripeWebhookSecret: settingsMap.stripeWebhookSecret || '',
      paypalClientId: settingsMap.paypalClientId || '',
      paypalClientSecret: settingsMap.paypalClientSecret || '',
      paypalWebhookId: settingsMap.paypalWebhookId || '',
      paypalSandbox: settingsMap.paypalSandbox === 'true',
      coinbaseApiKey: settingsMap.coinbaseApiKey || '',
      coinbaseWebhookSecret: settingsMap.coinbaseWebhookSecret || '',
    };
    
    return NextResponse.json({
      success: true,
      settings,
      providers: {
        stripe: !!(settings.stripePublicKey && settings.stripeSecretKey),
        paypal: !!(settings.paypalClientId && settings.paypalClientSecret),
        coinbase: !!settings.coinbaseApiKey,
      },
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// حفظ الإعدادات
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    // Rate limiting
    const rateLimit = checkRateLimit(`admin-payment-post:${ip}`, rateLimitConfigs.admin);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'طلبات كثيرة' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    
    // قائمة المفاتيح المسموح بها
    const allowedKeys = [
      'stripePublicKey',
      'stripeSecretKey',
      'stripeWebhookSecret',
      'paypalClientId',
      'paypalClientSecret',
      'paypalWebhookId',
      'paypalSandbox',
      'coinbaseApiKey',
      'coinbaseWebhookSecret',
    ];
    
    // حفظ الإعدادات
    for (const key of allowedKeys) {
      if (body[key] !== undefined && body[key] !== '') {
        // لا نحفظ القيم المقنعة
        if (typeof body[key] === 'string' && body[key].includes('•')) {
          continue;
        }
        
        const value = key === 'paypalSandbox' 
          ? String(body[key]) 
          : sanitizeInput(String(body[key]));
        
        await db.setting.upsert({
          where: { key: `payment_${key}` },
          create: { key: `payment_${key}`, value },
          update: { value },
        });
      }
    }
    
    logAuditEvent({
      action: 'payment_settings_updated',
      ip,
      details: { 
        providers: Object.keys(body).filter(k => body[k] && !body[k].includes('•'))
      },
      success: true,
    });
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'تم حفظ الإعدادات بنجاح' 
    });
    
    // إضافة headers أمنية
    for (const [key, value] of Object.entries(getSecurityHeaders())) {
      response.headers.set(key, value);
    }
    
    return response;
  } catch (error) {
    console.error('Error saving payment settings:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الحفظ' },
      { status: 500 }
    );
  }
}
