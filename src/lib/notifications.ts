// أنواع الإشعارات
export type NotificationType = 
  | 'certificate'   // شهادة جديدة
  | 'payment'       // دفع
  | 'reminder'      // تذكير
  | 'achievement'   // إنجاز
  | 'system';       // نظام

// واجهة الإشعار
export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  data?: Record<string, any>;
}

// إنشاء إشعار جديد
export async function createNotification(params: CreateNotificationParams): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

// إرسال إشعار شهادة جديدة
export async function notifyCertificateIssued(
  userId: string,
  certificateTitle: string,
  score: number,
  certificateNumber: string
) {
  return createNotification({
    userId,
    title: 'شهادة جديدة 🎉',
    message: `تهانينا! حصلت على شهادة ${certificateTitle} بدرجة ${score}%. يمكنك الآن تحميل شهادتك ومشاركتها.`,
    type: 'certificate',
    link: `/certificate/${certificateNumber}`,
    data: { certificateNumber, score },
  });
}

// إرسال إشعار دفع ناجح
export async function notifyPaymentSuccess(
  userId: string,
  amount: number,
  certificateTitle: string,
  paymentId: string
) {
  return createNotification({
    userId,
    title: 'تم الدفع بنجاح ✅',
    message: `تم تأكيد عملية الدفع بقيمة $${amount} لشهادة ${certificateTitle}. يمكنك الآن البدء في الاختبار.`,
    type: 'payment',
    link: '/dashboard',
    data: { amount, certificateTitle, paymentId },
  });
}

// إرسال تذكير بالاختبار
export async function notifyExamReminder(
  userId: string,
  certificateTitle: string,
  certificateId: string,
  daysLeft: number
) {
  return createNotification({
    userId,
    title: 'تذكير بالاختبار ⏰',
    message: `لديك اختبار غير مكتمل: ${certificateTitle}. أكمل الاختبار خلال ${daysLeft} أيام.`,
    type: 'reminder',
    link: `/exam/${certificateId}`,
    data: { certificateId, daysLeft },
  });
}

// إرسال إشعار إنجاز
export async function notifyAchievement(
  userId: string,
  achievementTitle: string,
  points: number,
  newLevel?: string
) {
  return createNotification({
    userId,
    title: 'إنجاز جديد 🏆',
    message: newLevel
      ? `${achievementTitle}! وصلت لمستوى ${newLevel}. استمر في التعلم!`
      : `${achievementTitle}! حصلت على ${points} نقطة إضافية.`,
    type: 'achievement',
    data: { achievementTitle, points, newLevel },
  });
}

// إرسال إشعار نظام
export async function notifySystem(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  return createNotification({
    userId,
    title,
    message,
    type: 'system',
    link,
  });
}

// إرسال إشعار جماعي
export async function sendBulkNotifications(
  userIds: string[],
  title: string,
  message: string,
  type: NotificationType = 'system',
  link?: string
) {
  const results = await Promise.all(
    userIds.map(userId =>
      createNotification({ userId, title, message, type, link })
    )
  );

  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;

  return {
    total: results.length,
    successful,
    failed,
  };
}

// الحصول على إشعارات المستخدم
export async function getUserNotifications(
  userId: string,
  options?: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }
) {
  const params = new URLSearchParams({
    userId,
    ...(options?.unreadOnly && { unreadOnly: 'true' }),
    ...(options?.limit && { limit: options.limit.toString() }),
    ...(options?.offset && { offset: options.offset.toString() }),
  });

  const response = await fetch(`/api/notifications?${params}`);
  return response.json();
}

// تحديد الكل كمقروء
export async function markAllNotificationsRead(userId: string) {
  const response = await fetch('/api/notifications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ markAllRead: true, userId }),
  });
  return response.json();
}

// حذف إشعار
export async function deleteNotification(notificationId: string) {
  const response = await fetch(`/api/notifications?id=${notificationId}`, {
    method: 'DELETE',
  });
  return response.json();
}

// حذف جميع الإشعارات
export async function clearAllNotifications(userId: string) {
  const response = await fetch(`/api/notifications?clearAll=true&userId=${userId}`, {
    method: 'DELETE',
  });
  return response.json();
}
