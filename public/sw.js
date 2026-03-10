/// <reference lib="webworker" />

// ECERTIFPRO Service Worker for Push Notifications

const CACHE_NAME = 'ecertifpro-v1';
const OFFLINE_URL = '/offline';

// تثبيت Service Worker
self.addEventListener('install', (event: any) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline',
        '/icon-192x192.png',
        '/icon-512x512.png',
        '/badge-72x72.png',
      ]);
    })
  );
  
  (self as any).skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (event: any) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  
  (self as any).clients.claim();
});

// استقبال Push Notification
self.addEventListener('push', (event: any) => {
  console.log('📱 Push received');
  
  let notification: any = {
    title: 'ECERTIFPRO',
    body: 'لديك إشعار جديد',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    dir: 'rtl',
    lang: 'ar',
    vibrate: [200, 100, 200],
    tag: 'general',
    requireInteraction: false,
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notification = {
        ...notification,
        ...data,
      };
    } catch (e) {
      notification.body = event.data.text();
    }
  }

  event.waitUntil(
    (self as any).registration.showNotification(notification.title, notification)
  );
});

// النقر على الإشعار
self.addEventListener('notificationclick', (event: any) => {
  console.log('🖱️ Notification clicked');
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};
  const link = data.link || '/';

  // التعامل مع الأفعال
  if (action === 'view') {
    event.waitUntil(
      (self as any).clients.openWindow(link)
    );
  } else if (action === 'share') {
    // فتح نافذة المشاركة
    event.waitUntil(
      (self as any).clients.openWindow(link + '?share=true')
    );
  } else if (action === 'dismiss') {
    // إغلاق فقط
    return;
  } else {
    // النقر العادي - فتح الرابط
    event.waitUntil(
      (self as any).clients.matchAll({ type: 'window' }).then((clientList: any[]) => {
        // التحقق من وجود نافذة مفتوحة
        for (const client of clientList) {
          if (client.url === link && 'focus' in client) {
            return client.focus();
          }
        }
        // فتح نافذة جديدة
        return (self as any).clients.openWindow(link);
      })
    );
  }
});

// إغلاق الإشعار
self.addEventListener('notificationclose', (event: any) => {
  console.log('❌ Notification closed');
  
  // يمكن إرسال تحليلات هنا
  event.waitUntil(
    fetch('/api/push/analytics', {
      method: 'POST',
      body: JSON.stringify({
        event: 'notification_closed',
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {})
  );
});

// Fetch مع Cache
self.addEventListener('fetch', (event: any) => {
  // فقط GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // تحديث الكاش في الخلفية
        fetch(event.request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response);
            });
          }
        }).catch(() => {});

        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // إذا فشل الطلب، عرض صفحة offline
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Background Sync
self.addEventListener('sync', (event: any) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      fetch('/api/notifications/sync').catch(() => {})
    );
  }
});

// Periodic Background Sync (للأجهزة المدعومة)
self.addEventListener('periodicsync', (event: any) => {
  console.log('⏰ Periodic sync:', event.tag);
  
  if (event.tag === 'check-notifications') {
    event.waitUntil(
      fetch('/api/notifications/check').catch(() => {})
    );
  }
});

// Message from main thread
self.addEventListener('message', (event: any) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    (self as any).skipWaiting();
  }
});

console.log('🚀 ECERTIFPRO Service Worker loaded');
