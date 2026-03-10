// ============================================
// تكامل بوابة فرسال للدفع - Versal Payment Gateway
// ============================================

import crypto from 'crypto';

// ============================================
// التكوين
// ============================================

export const VERSAL_CONFIG = {
  // API URLs
  baseUrl: process.env.VERSAL_BASE_URL || 'https://api.versal.io/v1',
  checkoutUrl: process.env.VERSAL_CHECKOUT_URL || 'https://checkout.versal.io',
  
  // Credentials
  apiKey: process.env.VERSAL_API_KEY || '',
  secretKey: process.env.VERSAL_SECRET_KEY || '',
  merchantId: process.env.VERSAL_MERCHANT_ID || '',
  
  // Callback URLs
  webhookSecret: process.env.VERSAL_WEBHOOK_SECRET || '',
  successUrl: process.env.VERSAL_SUCCESS_URL || '',
  cancelUrl: process.env.VERSAL_CANCEL_URL || '',
  callbackUrl: process.env.VERSAL_CALLBACK_URL || '',
};

// ============================================
// الأنواع
// ============================================

export interface VersalCustomer {
  name: string;
  email: string;
  phone?: string;
  reference?: string;
}

export interface VersalOrderItem {
  name: string;
  description?: string;
  amount: number;
  quantity: number;
  currency: string;
}

export interface VersalPaymentRequest {
  orderId: string;
  amount: number;
  currency: 'SAR' | 'USD' | 'AED' | 'KWD' | 'BHD' | 'QAR';
  customer: VersalCustomer;
  items: VersalOrderItem[];
  description?: string;
  metadata?: Record<string, string>;
}

export interface VersalPaymentResponse {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  qrCode?: string;
  error?: string;
  errorCode?: string;
}

export interface VersalWebhookEvent {
  event: string;
  paymentId: string;
  orderId: string;
  status: 'completed' | 'failed' | 'cancelled' | 'pending';
  amount: number;
  currency: string;
  customer: VersalCustomer;
  paidAt?: string;
  metadata?: Record<string, string>;
  signature: string;
}

export interface VersalPaymentStatus {
  paymentId: string;
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  customer: VersalCustomer;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  paymentMethod?: string;
  transactionId?: string;
}

// ============================================
// إنشاء التوقيع - Signature Generation
// ============================================

export function generateVersalSignature(
  payload: Record<string, unknown>,
  timestamp: number
): string {
  const dataToSign = `${JSON.stringify(payload)}${timestamp}${VERSAL_CONFIG.secretKey}`;
  return crypto
    .createHmac('sha256', VERSAL_CONFIG.secretKey)
    .update(dataToSign)
    .digest('hex');
}

export function verifyVersalWebhookSignature(
  payload: string,
  signature: string,
  timestamp: number
): boolean {
  const dataToSign = `${payload}${timestamp}${VERSAL_CONFIG.webhookSecret}`;
  const expectedSignature = crypto
    .createHmac('sha256', VERSAL_CONFIG.webhookSecret)
    .update(dataToSign)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================
// إنشاء جلسة دفع - Create Payment Session
// ============================================

export async function createVersalPaymentSession(
  paymentData: VersalPaymentRequest
): Promise<VersalPaymentResponse> {
  try {
    const timestamp = Date.now();
    const payload = {
      merchant_id: VERSAL_CONFIG.merchantId,
      order_id: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      customer: {
        name: paymentData.customer.name,
        email: paymentData.customer.email,
        phone: paymentData.customer.phone,
        reference: paymentData.customer.reference,
      },
      items: paymentData.items.map(item => ({
        name: item.name,
        description: item.description,
        amount: item.amount,
        quantity: item.quantity,
        currency: item.currency,
      })),
      description: paymentData.description,
      metadata: paymentData.metadata,
      success_url: VERSAL_CONFIG.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: VERSAL_CONFIG.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      callback_url: VERSAL_CONFIG.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/versal`,
      timestamp,
    };
    
    const signature = generateVersalSignature(payload, timestamp);
    
    const response = await fetch(`${VERSAL_CONFIG.baseUrl}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VERSAL_CONFIG.apiKey}`,
        'X-Signature': signature,
        'X-Timestamp': timestamp.toString(),
      },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Versal API Error:', result);
      return {
        success: false,
        error: result.message || 'فشل في إنشاء جلسة الدفع',
        errorCode: result.code,
      };
    }
    
    return {
      success: true,
      paymentId: result.data.payment_id,
      checkoutUrl: result.data.checkout_url,
      qrCode: result.data.qr_code,
    };
  } catch (error) {
    console.error('Versal Payment Error:', error);
    return {
      success: false,
      error: 'حدث خطأ في الاتصال ببوابة الدفع',
    };
  }
}

// ============================================
// التحقق من حالة الدفع - Check Payment Status
// ============================================

export async function getVersalPaymentStatus(
  paymentId: string
): Promise<{ success: boolean; data?: VersalPaymentStatus; error?: string }> {
  try {
    const timestamp = Date.now();
    const signature = generateVersalSignature({ payment_id: paymentId }, timestamp);
    
    const response = await fetch(`${VERSAL_CONFIG.baseUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERSAL_CONFIG.apiKey}`,
        'X-Signature': signature,
        'X-Timestamp': timestamp.toString(),
      },
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'فشل في الحصول على حالة الدفع',
      };
    }
    
    return {
      success: true,
      data: {
        paymentId: result.data.payment_id,
        orderId: result.data.order_id,
        status: result.data.status,
        amount: result.data.amount,
        currency: result.data.currency,
        customer: {
          name: result.data.customer.name,
          email: result.data.customer.email,
          phone: result.data.customer.phone,
        },
        createdAt: result.data.created_at,
        updatedAt: result.data.updated_at,
        paidAt: result.data.paid_at,
        cancelledAt: result.data.cancelled_at,
        refundedAt: result.data.refunded_at,
        paymentMethod: result.data.payment_method,
        transactionId: result.data.transaction_id,
      },
    };
  } catch (error) {
    console.error('Versal Status Check Error:', error);
    return {
      success: false,
      error: 'حدث خطأ في التحقق من حالة الدفع',
    };
  }
}

// ============================================
// إلغاء الدفع - Cancel Payment
// ============================================

export async function cancelVersalPayment(
  paymentId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = Date.now();
    const payload = {
      payment_id: paymentId,
      reason: reason || 'Requested by customer',
    };
    const signature = generateVersalSignature(payload, timestamp);
    
    const response = await fetch(`${VERSAL_CONFIG.baseUrl}/payments/${paymentId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VERSAL_CONFIG.apiKey}`,
        'X-Signature': signature,
        'X-Timestamp': timestamp.toString(),
      },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'فشل في إلغاء الدفع',
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Versal Cancel Error:', error);
    return {
      success: false,
      error: 'حدث خطأ في إلغاء الدفع',
    };
  }
}

// ============================================
// الاسترداد - Refund Payment
// ============================================

export async function refundVersalPayment(
  paymentId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const payload: Record<string, unknown> = {
      payment_id: paymentId,
      reason: reason || 'Customer request',
    };
    
    if (amount) {
      payload.amount = amount;
    }
    
    const signature = generateVersalSignature(payload, timestamp);
    
    const response = await fetch(`${VERSAL_CONFIG.baseUrl}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VERSAL_CONFIG.apiKey}`,
        'X-Signature': signature,
        'X-Timestamp': timestamp.toString(),
      },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'فشل في الاسترداد',
      };
    }
    
    return {
      success: true,
      refundId: result.data.refund_id,
    };
  } catch (error) {
    console.error('Versal Refund Error:', error);
    return {
      success: false,
      error: 'حدث خطأ في الاسترداد',
    };
  }
}

// ============================================
// تحويل العملات - Currency Conversion
// ============================================

export const EXCHANGE_RATES: Record<string, number> = {
  USD_SAR: 3.75,
  USD_AED: 3.67,
  USD_KWD: 0.31,
  USD_BHD: 0.38,
  USD_QAR: 3.64,
};

export function convertCurrency(
  amount: number,
  from: string,
  to: string
): number {
  if (from === to) return amount;
  
  const rateKey = `${from}_${to}`;
  const reverseRateKey = `${to}_${from}`;
  
  if (EXCHANGE_RATES[rateKey]) {
    return amount * EXCHANGE_RATES[rateKey];
  }
  
  if (EXCHANGE_RATES[reverseRateKey]) {
    return amount / EXCHANGE_RATES[reverseRateKey];
  }
  
  // تحويل عبر USD
  if (from !== 'USD' && to !== 'USD') {
    const usdRate = EXCHANGE_RATES[`USD_${from}`];
    const targetRate = EXCHANGE_RATES[`USD_${to}`];
    if (usdRate && targetRate) {
      const usdAmount = amount / usdRate;
      return usdAmount * targetRate;
    }
  }
  
  return amount;
}

// ============================================
// تكاليف الشهادات بالريال السعودي
// ============================================

export const CERTIFICATE_PRICES_SAR: Record<string, { price: number; originalPrice: number; title: string }> = {
  'almarjaa-beginner': { price: 184, originalPrice: 371, title: 'مبتدئ لغة المرجع' },
  'almarjaa-intermediate': { price: 371, originalPrice: 746, title: 'مطور لغة المرجع' },
  'almarjaa-advanced': { price: 559, originalPrice: 1121, title: 'خبير لغة المرجع' },
  'almarjaa-professional': { price: 746, originalPrice: 1496, title: 'محترف لغة المرجع المعتمد' },
};

export function getCertificatePrice(certificateId: string, currency: 'SAR' | 'USD' = 'SAR'): { price: number; originalPrice: number; title: string } {
  const prices = CERTIFICATE_PRICES_SAR[certificateId];
  
  if (!prices) {
    return { price: 0, originalPrice: 0, title: 'شهادة غير معروفة' };
  }
  
  if (currency === 'USD') {
    return {
      price: Math.round(prices.price / 3.75),
      originalPrice: Math.round(prices.originalPrice / 3.75),
      title: prices.title,
    };
  }
  
  return prices;
}
