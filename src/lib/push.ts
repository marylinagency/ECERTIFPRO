// Web Push Notifications Service

// VAPID Keys (يجب إنشاؤها مرة واحدة)
// يمكن إنشاؤها عبر: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

// واجهة Push Subscription
interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// واجهة إشعار Push
interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

// تخزين الاشتراكات (في الإنتاج استخدم قاعدة البيانات)
const subscriptions = new Map<string, PushSubscriptionData[]>();

// إضافة اشتراك جديد
export function addSubscription(userId: string, subscription: PushSubscriptionData) {
  if (!subscriptions.has(userId)) {
    subscriptions.set(userId, []);
  }
  subscriptions.get(userId)!.push(subscription);
  return true;
}

// إزالة اشتراك
export function removeSubscription(userId: string, endpoint: string) {
  const userSubs = subscriptions.get(userId);
  if (userSubs) {
    const index = userSubs.findIndex(sub => sub.endpoint === endpoint);
    if (index > -1) {
      userSubs.splice(index, 1);
    }
  }
  return true;
}

// الحصول على اشتراكات المستخدم
export function getUserSubscriptions(userId: string): PushSubscriptionData[] {
  return subscriptions.get(userId) || [];
}

// التحقق من دعم Push Notifications
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'PushManager' in window;
}

// التحقق من دعم Service Worker
export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

// طلب إذن الإشعارات
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

// الاشتراك في Push Notifications
export async function subscribeToPush(userId: string): Promise<PushSubscriptionData | null> {
  if (!isPushSupported() || !isServiceWorkerSupported()) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      if (!VAPID_PUBLIC_KEY) {
        console.warn('VAPID public key not configured');
        return null;
      }
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
      },
    };

    // حفظ في الخادم
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscription: subscriptionData }),
    });

    return subscriptionData;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
}

// إلغاء الاشتراك
export async function unsubscribeFromPush(userId: string): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      // إزالة من الخادم
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, endpoint: subscription.endpoint }),
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
}

// إرسال إشعار محلي (من المتصفح)
export function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isPushSupported()) {
    console.warn('Notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  return new Notification(title, {
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    dir: 'rtl',
    lang: 'ar',
    ...options,
  });
}

// تحويل VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// إرسال Push Notification للمستخدم
export async function sendPushToUser(
  userId: string,
  notification: PushNotification
): Promise<{ success: boolean; sent: number; failed: number }> {
  const userSubs = getUserSubscriptions(userId);
  
  if (userSubs.length === 0) {
    return { success: false, sent: 0, failed: 0 };
  }

  // في الإنتاج، استخدم web-push library
  // const webPush = require('web-push');
  // webPush.setVapidDetails('mailto:almarjaa.project@hotmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  let sent = 0;
  let failed = 0;

  for (const sub of userSubs) {
    try {
      // إرسال عبر API
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: sub,
          notification: {
            ...notification,
            icon: notification.icon || '/icon-192x192.png',
            badge: notification.badge || '/badge-72x72.png',
          },
        }),
      });

      if (response.ok) {
        sent++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
    }
  }

  return { success: sent > 0, sent, failed };
}

// Helper functions للإشعارات الشائعة

export function pushCertificateNotification(
  userId: string,
  certificateTitle: string,
  score: number
) {
  return sendPushToUser(userId, {
    title: '🏆 شهادة جديدة!',
    body: `تهانينا! حصلت على شهادة ${certificateTitle} بدرجة ${score}%`,
    tag: 'certificate',
    data: { type: 'certificate', score },
    actions: [
      { action: 'view', title: 'عرض الشهادة' },
      { action: 'share', title: 'مشاركة' },
    ],
  });
}

export function pushPaymentNotification(
  userId: string,
  amount: number,
  certificateTitle: string
) {
  return sendPushToUser(userId, {
    title: '✅ تم الدفع بنجاح',
    body: `تم تأكيد دفع $${amount} لشهادة ${certificateTitle}`,
    tag: 'payment',
    data: { type: 'payment', amount },
  });
}

export function pushAchievementNotification(
  userId: string,
  achievementTitle: string,
  points: number
) {
  return sendPushToUser(userId, {
    title: '🏆 إنجاز جديد!',
    body: `${achievementTitle} - حصلت على ${points} نقطة!`,
    tag: 'achievement',
    data: { type: 'achievement', points },
  });
}

export function pushReminderNotification(
  userId: string,
  certificateTitle: string,
  daysLeft: number
) {
  return sendPushToUser(userId, {
    title: '⏰ تذكير',
    body: `اختبار ${certificateTitle} ينتظرك - متبقي ${daysLeft} أيام`,
    tag: 'reminder',
    requireInteraction: true,
    actions: [
      { action: 'start', title: 'ابدأ الاختبار' },
      { action: 'dismiss', title: 'تجاهل' },
    ],
  });
}

// Service Worker registration
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Check if notifications are enabled
export function areNotificationsEnabled(): boolean {
  return isPushSupported() && Notification.permission === 'granted';
}

// Get notification permission status
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}
