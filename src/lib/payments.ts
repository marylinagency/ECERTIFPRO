// ============================================
// نظام الدفع المتكامل - Unified Payment System
// يدعم: Stripe, PayPal, Coinbase Commerce
// ============================================

import crypto from 'crypto';

// ============================================
// الأنواع - Types
// ============================================

export type PaymentProvider = 'stripe' | 'paypal' | 'coinbase';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED';

export interface PaymentConfig {
  // Stripe
  stripePublicKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  
  // PayPal
  paypalClientId: string;
  paypalClientSecret: string;
  paypalWebhookId: string;
  paypalSandbox: boolean;
  
  // Coinbase
  coinbaseApiKey: string;
  coinbaseWebhookSecret: string;
}

export interface PaymentCustomer {
  name: string;
  email: string;
  phone?: string;
  userId?: string;
}

export interface PaymentItem {
  id: string;
  name: string;
  description?: string;
  amount: number;
  quantity: number;
}

export interface CreatePaymentRequest {
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  currency: Currency;
  customer: PaymentCustomer;
  items: PaymentItem[];
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  clientSecret?: string;
  qrCode?: string;
  error?: string;
  errorCode?: string;
}

export interface PaymentStatusResponse {
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  customer: PaymentCustomer;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  transactionId?: string;
}

export interface WebhookEvent {
  provider: PaymentProvider;
  eventType: string;
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  customer?: PaymentCustomer;
  rawEvent: unknown;
}

// ============================================
// إدارة الإعدادات - Settings Manager
// ============================================

// في الذاكرة للتبسيط، في الإنتاج استخدم قاعدة بيانات
let paymentSettings: PaymentConfig = {
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  paypalWebhookId: process.env.PAYPAL_WEBHOOK_ID || '',
  paypalSandbox: process.env.PAYPAL_SANDBOX === 'true',
  
  coinbaseApiKey: process.env.COINBASE_API_KEY || '',
  coinbaseWebhookSecret: process.env.COINBASE_WEBHOOK_SECRET || '',
};

export function updatePaymentSettings(newSettings: Partial<PaymentConfig>): void {
  paymentSettings = { ...paymentSettings, ...newSettings };
}

export function getPaymentSettings(): PaymentConfig {
  return { ...paymentSettings };
}

export function isProviderConfigured(provider: PaymentProvider): boolean {
  switch (provider) {
    case 'stripe':
      return !!(paymentSettings.stripePublicKey && paymentSettings.stripeSecretKey);
    case 'paypal':
      return !!(paymentSettings.paypalClientId && paymentSettings.paypalClientSecret);
    case 'coinbase':
      return !!paymentSettings.coinbaseApiKey;
    default:
      return false;
  }
}

export function getAvailableProviders(): PaymentProvider[] {
  const providers: PaymentProvider[] = [];
  if (isProviderConfigured('stripe')) providers.push('stripe');
  if (isProviderConfigured('paypal')) providers.push('paypal');
  if (isProviderConfigured('coinbase')) providers.push('coinbase');
  return providers;
}

// ============================================
// Stripe Integration
// ============================================

async function createStripePayment(
  request: CreatePaymentRequest
): Promise<PaymentResponse> {
  try {
    const settings = getPaymentSettings();
    
    if (!settings.stripeSecretKey) {
      return { success: false, error: 'Stripe not configured' };
    }
    
    // إنشاء Checkout Session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'mode': 'payment',
        'customer_email': request.customer.email,
        'client_reference_id': request.orderId,
        'success_url': request.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': request.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        'metadata[order_id]': request.orderId,
        'metadata[user_id]': request.customer.userId || '',
        'metadata[customer_name]': request.customer.name,
        ...request.items.flatMap((item, index) => ({
          [`line_items[${index}][price_data][currency]`]: request.currency.toLowerCase(),
          [`line_items[${index}][price_data][unit_amount]`]: Math.round(item.amount * 100).toString(),
          [`line_items[${index}][price_data][product_data][name]`]: item.name,
          [`line_items[${index}][price_data][product_data][description]`]: item.description || '',
          [`line_items[${index}][quantity]`]: item.quantity.toString(),
        })),
      }),
    });
    
    const session = await response.json();
    
    if (!response.ok) {
      console.error('Stripe Error:', session);
      return {
        success: false,
        error: session.error?.message || 'Failed to create Stripe session',
        errorCode: session.error?.code,
      };
    }
    
    return {
      success: true,
      paymentId: session.id,
      checkoutUrl: session.url,
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      success: false,
      error: 'Failed to connect to Stripe',
    };
  }
}

async function getStripePaymentStatus(sessionId: string): Promise<PaymentStatusResponse | null> {
  try {
    const settings = getPaymentSettings();
    
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${settings.stripeSecretKey}`,
      },
    });
    
    const session = await response.json();
    
    if (!response.ok) {
      return null;
    }
    
    const statusMap: Record<string, PaymentStatus> = {
      'open': 'pending',
      'complete': 'completed',
      'expired': 'cancelled',
      'processing': 'processing',
    };
    
    return {
      paymentId: session.id,
      orderId: session.client_reference_id,
      status: statusMap[session.status] || 'pending',
      amount: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
      provider: 'stripe',
      customer: {
        email: session.customer_email || '',
        name: session.metadata?.customer_name || '',
        userId: session.metadata?.user_id,
      },
      createdAt: new Date(session.created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: session.payment_status === 'paid' ? new Date().toISOString() : undefined,
      transactionId: session.payment_intent,
    };
  } catch (error) {
    console.error('Stripe Status Error:', error);
    return null;
  }
}

// ============================================
// PayPal Integration
// ============================================

async function getPayPalAccessToken(): Promise<string | null> {
  try {
    const settings = getPaymentSettings();
    const baseUrl = settings.paypalSandbox 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';
    
    const credentials = Buffer.from(
      `${settings.paypalClientId}:${settings.paypalClientSecret}`
    ).toString('base64');
    
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('PayPal Auth Error:', data);
      return null;
    }
    
    return data.access_token;
  } catch (error) {
    console.error('PayPal Auth Error:', error);
    return null;
  }
}

async function createPayPalPayment(
  request: CreatePaymentRequest
): Promise<PaymentResponse> {
  try {
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return { success: false, error: 'PayPal authentication failed' };
    }
    
    const settings = getPaymentSettings();
    const baseUrl = settings.paypalSandbox 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: request.orderId,
        description: request.items.map(i => i.name).join(', '),
        amount: {
          currency_code: request.currency,
          value: request.amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: request.currency,
              value: request.amount.toFixed(2),
            },
          },
        },
        items: request.items.map(item => ({
          name: item.name,
          description: item.description || '',
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: request.currency,
            value: item.amount.toFixed(2),
          },
        })),
      }],
      payer: {
        email_address: request.customer.email,
        name: {
          given_name: request.customer.name.split(' ')[0],
          surname: request.customer.name.split(' ').slice(1).join(' ') || '',
        },
      },
      application_context: {
        return_url: request.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancel_url: request.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        brand_name: 'ECERTIFPRO',
        user_action: 'PAY_NOW',
      },
    };
    
    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': crypto.randomBytes(16).toString('hex'),
      },
      body: JSON.stringify(orderData),
    });
    
    const order = await response.json();
    
    if (!response.ok) {
      console.error('PayPal Error:', order);
      return {
        success: false,
        error: order.message || 'Failed to create PayPal order',
        errorCode: order.name,
      };
    }
    
    const approveLink = order.links?.find((l: { rel: string; href: string }) => l.rel === 'approve');
    
    return {
      success: true,
      paymentId: order.id,
      checkoutUrl: approveLink?.href,
    };
  } catch (error) {
    console.error('PayPal Error:', error);
    return {
      success: false,
      error: 'Failed to connect to PayPal',
    };
  }
}

async function capturePayPalPayment(orderId: string): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) return false;
    
    const settings = getPaymentSettings();
    const baseUrl = settings.paypalSandbox 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';
    
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    return response.ok && result.status === 'COMPLETED';
  } catch (error) {
    console.error('PayPal Capture Error:', error);
    return false;
  }
}

async function getPayPalPaymentStatus(orderId: string): Promise<PaymentStatusResponse | null> {
  try {
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) return null;
    
    const settings = getPaymentSettings();
    const baseUrl = settings.paypalSandbox 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';
    
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    const order = await response.json();
    
    if (!response.ok) {
      return null;
    }
    
    const statusMap: Record<string, PaymentStatus> = {
      'CREATED': 'pending',
      'SAVED': 'pending',
      'APPROVED': 'processing',
      'VOIDED': 'cancelled',
      'COMPLETED': 'completed',
    };
    
    const purchaseUnit = order.purchase_units?.[0];
    
    return {
      paymentId: order.id,
      orderId: purchaseUnit?.reference_id || order.id,
      status: statusMap[order.status] || 'pending',
      amount: parseFloat(purchaseUnit?.amount?.value || '0'),
      currency: purchaseUnit?.amount?.currency_code || 'USD',
      provider: 'paypal',
      customer: {
        email: order.payer?.email_address || '',
        name: `${order.payer?.name?.given_name || ''} ${order.payer?.name?.surname || ''}`.trim(),
      },
      createdAt: order.create_time || new Date().toISOString(),
      updatedAt: order.update_time || new Date().toISOString(),
      paidAt: order.status === 'COMPLETED' ? order.update_time : undefined,
      transactionId: purchaseUnit?.payments?.captures?.[0]?.id,
    };
  } catch (error) {
    console.error('PayPal Status Error:', error);
    return null;
  }
}

// ============================================
// Coinbase Commerce Integration
// ============================================

async function createCoinbaseCharge(
  request: CreatePaymentRequest
): Promise<PaymentResponse> {
  try {
    const settings = getPaymentSettings();
    
    if (!settings.coinbaseApiKey) {
      return { success: false, error: 'Coinbase not configured' };
    }
    
    const chargeData = {
      name: request.items[0]?.name || 'ECERTIFPRO Certificate',
      description: request.items.map(i => i.name).join(', '),
      pricing_type: 'fixed_price',
      local_price: {
        amount: request.amount.toFixed(2),
        currency: request.currency,
      },
      metadata: {
        order_id: request.orderId,
        customer_email: request.customer.email,
        customer_name: request.customer.name,
        user_id: request.customer.userId || '',
      },
      redirect_url: request.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: request.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    };
    
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'X-CC-Api-Key': settings.coinbaseApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chargeData),
    });
    
    const charge = await response.json();
    
    if (!response.ok) {
      console.error('Coinbase Error:', charge);
      return {
        success: false,
        error: charge.error?.message || 'Failed to create Coinbase charge',
        errorCode: charge.error?.type,
      };
    }
    
    return {
      success: true,
      paymentId: charge.data.id,
      checkoutUrl: charge.data.hosted_url,
      qrCode: charge.data.qr_code_url,
    };
  } catch (error) {
    console.error('Coinbase Error:', error);
    return {
      success: false,
      error: 'Failed to connect to Coinbase',
    };
  }
}

async function getCoinbaseChargeStatus(chargeId: string): Promise<PaymentStatusResponse | null> {
  try {
    const settings = getPaymentSettings();
    
    const response = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}`, {
      headers: {
        'X-CC-Api-Key': settings.coinbaseApiKey,
      },
    });
    
    const charge = await response.json();
    
    if (!response.ok) {
      return null;
    }
    
    const timeline = charge.data.timeline;
    const lastStatus = timeline[timeline.length - 1]?.status;
    
    const statusMap: Record<string, PaymentStatus> = {
      'NEW': 'pending',
      'PENDING': 'pending',
      'CONFIRMED': 'completed',
      'COMPLETED': 'completed',
      'EXPIRED': 'cancelled',
      'UNRESOLVED': 'failed',
      'RESOLVED': 'completed',
      'CANCELED': 'cancelled',
    };
    
    return {
      paymentId: charge.data.id,
      orderId: charge.data.metadata?.order_id || charge.data.id,
      status: statusMap[lastStatus] || 'pending',
      amount: parseFloat(charge.data.pricing?.local?.amount || '0'),
      currency: charge.data.pricing?.local?.currency || 'USD',
      provider: 'coinbase',
      customer: {
        email: charge.data.metadata?.customer_email || '',
        name: charge.data.metadata?.customer_name || '',
        userId: charge.data.metadata?.user_id,
      },
      createdAt: charge.data.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: lastStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
    };
  } catch (error) {
    console.error('Coinbase Status Error:', error);
    return null;
  }
}

// ============================================
// Unified Payment API
// ============================================

export async function createPayment(
  request: CreatePaymentRequest
): Promise<PaymentResponse> {
  // التحقق من تكوين المزود
  if (!isProviderConfigured(request.provider)) {
    return {
      success: false,
      error: `${request.provider} is not configured`,
    };
  }
  
  switch (request.provider) {
    case 'stripe':
      return createStripePayment(request);
    case 'paypal':
      return createPayPalPayment(request);
    case 'coinbase':
      return createCoinbaseCharge(request);
    default:
      return {
        success: false,
        error: 'Unknown payment provider',
      };
  }
}

export async function getPaymentStatus(
  paymentId: string,
  provider: PaymentProvider
): Promise<PaymentStatusResponse | null> {
  switch (provider) {
    case 'stripe':
      return getStripePaymentStatus(paymentId);
    case 'paypal':
      return getPayPalPaymentStatus(paymentId);
    case 'coinbase':
      return getCoinbaseChargeStatus(paymentId);
    default:
      return null;
  }
}

export { capturePayPalPayment };

// ============================================
// تحويل العملات
// ============================================

export const EXCHANGE_RATES: Record<string, number> = {
  USD_EUR: 0.92,
  USD_GBP: 0.79,
  USD_SAR: 3.75,
  USD_AED: 3.67,
  EUR_USD: 1.09,
  GBP_USD: 1.27,
  SAR_USD: 0.27,
  AED_USD: 0.27,
};

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  
  const rateKey = `${from}_${to}` as keyof typeof EXCHANGE_RATES;
  
  if (EXCHANGE_RATES[rateKey]) {
    return amount * EXCHANGE_RATES[rateKey];
  }
  
  // تحويل عبر USD
  const fromUsd = EXCHANGE_RATES[`${from}_USD` as keyof typeof EXCHANGE_RATES];
  const toUsd = EXCHANGE_RATES[`USD_${to}` as keyof typeof EXCHANGE_RATES];
  
  if (fromUsd) {
    return amount * fromUsd;
  }
  
  if (toUsd) {
    return amount * toUsd;
  }
  
  return amount;
}

// ============================================
// أسعار الشهادات
// ============================================

export const CERTIFICATE_PRICES: Record<string, { price: number; originalPrice: number; title: string }> = {
  'almarjaa-beginner': { price: 49, originalPrice: 99, title: 'مبتدئ لغة المرجع' },
  'almarjaa-intermediate': { price: 99, originalPrice: 199, title: 'مطور لغة المرجع' },
  'almarjaa-advanced': { price: 149, originalPrice: 299, title: 'خبير لغة المرجع' },
  'almarjaa-professional': { price: 199, originalPrice: 399, title: 'محترف لغة المرجع المعتمد' },
};

export function getCertificatePrice(certificateId: string): { price: number; originalPrice: number; title: string } {
  return CERTIFICATE_PRICES[certificateId] || { price: 0, originalPrice: 0, title: 'شهادة غير معروفة' };
}

// ============================================
// Webhook Verification
// ============================================

export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string,
  secret: string
): { valid: boolean; event?: unknown; error?: string } {
  try {
    const elements = signature.split(',');
    const timestamp = elements.find(e => e.startsWith('t='))?.slice(2);
    const signatures = elements.filter(e => e.startsWith('v1=')).map(e => e.slice(3));
    
    if (!timestamp || signatures.length === 0) {
      return { valid: false, error: 'Invalid signature format' };
    }
    
    const timestampNum = parseInt(timestamp, 10);
    if (Math.abs(Date.now() / 1000 - timestampNum) > 300) {
      return { valid: false, error: 'Signature timestamp too old' };
    }
    
    const payloadString = typeof payload === 'string' ? payload : payload.toString();
    const signedPayload = `${timestamp}.${payloadString}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');
    
    const isValid = signatures.some(sig => {
      try {
        return crypto.timingSafeEqual(
          Buffer.from(sig),
          Buffer.from(expectedSignature)
        );
      } catch {
        return false;
      }
    });
    
    if (!isValid) {
      return { valid: false, error: 'Signature mismatch' };
    }
    
    const event = JSON.parse(payloadString);
    return { valid: true, event };
  } catch (error) {
    return { valid: false, error: 'Signature verification failed' };
  }
}

export function verifyCoinbaseWebhook(
  payload: string,
  signature: string,
  secret: string
): { valid: boolean; event?: unknown; error?: string } {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    
    if (!isValid) {
      return { valid: false, error: 'Invalid signature' };
    }
    
    const event = JSON.parse(payload);
    return { valid: true, event };
  } catch (error) {
    return { valid: false, error: 'Signature verification failed' };
  }
}
