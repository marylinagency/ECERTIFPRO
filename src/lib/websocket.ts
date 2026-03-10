import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

// تخزين الاتصالات النشطة
const userSockets = new Map<string, Set<string>>();

let io: SocketIOServer | null = null;

// تهيئة خادم WebSocket
export function initializeWebSocket(server: HTTPServer) {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  });

  io.on('connection', (socket: Socket) => {
    console.log('🔌 New WebSocket connection:', socket.id);

    // انضمام المستخدم
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId)!.add(socket.id);
      
      console.log(`👤 User ${userId} joined with socket ${socket.id}`);
      
      // إرسال عدد الإشعارات غير المقروءة
      socket.emit('connected', { message: 'WebSocket connected successfully' });
    });

    // مغادرة المستخدم
    socket.on('leave', (userId: string) => {
      socket.leave(`user:${userId}`);
      
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });

    // قطع الاتصال
    socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected:', socket.id);
      
      // إزالة من جميع المستخدمين
      userSockets.forEach((sockets, userId) => {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(userId);
          }
        }
      });
    });

    // نبضة القلب
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  return io;
}

// الحصول على مثيل IO
export function getIO(): SocketIOServer | null {
  return io;
}

// إرسال إشعار لمستخدم معين
export function emitToUser(userId: string, event: string, data: any) {
  if (!io) {
    console.warn('WebSocket not initialized');
    return false;
  }

  io.to(`user:${userId}`).emit(event, data);
  return true;
}

// إرسال إشعار لعدة مستخدمين
export function emitToUsers(userIds: string[], event: string, data: any) {
  if (!io) {
    console.warn('WebSocket not initialized');
    return false;
  }

  userIds.forEach(userId => {
    io!.to(`user:${userId}`).emit(event, data);
  });
  return true;
}

// إرسال إشعار للجميع
export function emitToAll(event: string, data: any) {
  if (!io) {
    console.warn('WebSocket not initialized');
    return false;
  }

  io.emit(event, data);
  return true;
}

// التحقق من اتصال المستخدم
export function isUserConnected(userId: string): boolean {
  return userSockets.has(userId) && userSockets.get(userId)!.size > 0;
}

// الحصول على عدد المستخدمين المتصلين
export function getConnectedUsersCount(): number {
  return userSockets.size;
}

// أنواع أحداث WebSocket
export const WebSocketEvents = {
  // الإشعارات
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_COUNT: 'notification:count',
  
  // الشهادات
  CERTIFICATE_ISSUED: 'certificate:issued',
  
  // المدفوعات
  PAYMENT_SUCCESS: 'payment:success',
  PAYMENT_FAILED: 'payment:failed',
  
  // الإنجازات
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  LEVEL_UP: 'level:up',
  
  // الاختبارات
  EXAM_STARTED: 'exam:started',
  EXAM_COMPLETED: 'exam:completed',
  
  // النظام
  SYSTEM_ANNOUNCEMENT: 'system:announcement',
  MAINTENANCE: 'system:maintenance',
} as const;

// Helper functions للإشعارات الشائعة

// إرسال إشعار جديد
export function notifyNewNotification(userId: string, notification: any) {
  return emitToUser(userId, WebSocketEvents.NOTIFICATION_NEW, notification);
}

// إرسال إشعار شهادة جديدة
export function notifyCertificateIssued(userId: string, certificate: any) {
  return emitToUser(userId, WebSocketEvents.CERTIFICATE_ISSUED, {
    title: 'شهادة جديدة! 🎉',
    message: `تهانينا! حصلت على شهادة ${certificate.title}`,
    certificate,
  });
}

// إرسال إشعار دفع ناجح
export function notifyPaymentSuccess(userId: string, payment: any) {
  return emitToUser(userId, WebSocketEvents.PAYMENT_SUCCESS, {
    title: 'تم الدفع بنجاح ✅',
    message: `تم تأكيد عملية الدفع بقيمة $${payment.amount}`,
    payment,
  });
}

// إرسال إشعار إنجاز جديد
export function notifyAchievement(userId: string, achievement: any) {
  return emitToUser(userId, WebSocketEvents.ACHIEVEMENT_UNLOCKED, {
    title: 'إنجاز جديد! 🏆',
    message: achievement.message,
    achievement,
  });
}

// إرسال إشعار ترقية مستوى
export function notifyLevelUp(userId: string, newLevel: string, points: number) {
  return emitToUser(userId, WebSocketEvents.LEVEL_UP, {
    title: 'ترقية مستوى! ⬆️',
    message: `وصلت لمستوى ${newLevel}!`,
    newLevel,
    points,
  });
}

// إرسال إعلان للجميع
export function broadcastAnnouncement(title: string, message: string, link?: string) {
  return emitToAll(WebSocketEvents.SYSTEM_ANNOUNCEMENT, {
    title,
    message,
    link,
    timestamp: new Date().toISOString(),
  });
}
