"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Award, CreditCard, AlertCircle, Trophy, Clock,
  ChevronLeft, ChevronRight, Trash2, Check, CheckCheck,
  MoreVertical, X, Filter, Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// أنواع الإشعارات
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// بيانات وهمية للإشعارات
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "شهادة جديدة 🎉",
    message: "تهانينا! حصلت على شهادة مطور Al-Marjaa المعتمد بدرجة 92%. يمكنك الآن تحميل شهادتك ومشاركتها على LinkedIn.",
    type: "certificate",
    link: "/certificate/ECERT-2024-ABC123",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "2",
    title: "تم الدفع بنجاح",
    message: "تم تأكيد عملية الدفع بقيمة $199 لشهادة خبير AI بالعربية. يمكنك الآن البدء في الاختبار.",
    type: "payment",
    link: "/dashboard",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "3",
    title: "تذكير بالاختبار",
    message: "لديك اختبار غير مكتمل: مطور ويب محترف. أكمل الاختبار خلال 7 أيام للحصول على شهادتك.",
    type: "reminder",
    link: "/exam/web-developer-pro",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "4",
    title: "إنجاز جديد 🏆",
    message: "حصلت على 100 نقطة إضافية! وصلت لمستوى محترف. استمر في التعلم للحصول على المزيد من المكافآت.",
    type: "achievement",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "5",
    title: "عرض خاص 🔥",
    message: "خصم 50% على جميع الشهادات! استخدم كود LAUNCH50 عند الدفع. العرض ساري حتى نهاية الشهر.",
    type: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "6",
    title: "شهادة جديدة 🎉",
    message: "تهانينا! حصلت على شهادة محلل بيانات معتمد بدرجة 85%.",
    type: "certificate",
    link: "/certificate/ECERT-2024-DEF456",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "7",
    title: "نقاط إضافية ⭐",
    message: "حصلت على 50 نقطة لإكمالك أول اختبار بنجاح!",
    type: "achievement",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // فلترة الإشعارات
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.isRead;
    return n.type === activeTab;
  });

  // تحديد الكل كمقروء
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // تحديد إشعار كمقروء
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // حذف إشعار
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // حذف المحدد
  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  // تحديد/إلغاء تحديد
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // تحديد الكل
  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  // أيقونة حسب النوع
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certificate':
        return <Award className="w-6 h-6 text-yellow-500" />;
      case 'payment':
        return <CreditCard className="w-6 h-6 text-green-500" />;
      case 'reminder':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'achievement':
        return <Trophy className="w-6 h-6 text-purple-500" />;
      case 'system':
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  // لون حسب النوع
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'certificate': return 'bg-yellow-100 border-yellow-300';
      case 'payment': return 'bg-green-100 border-green-300';
      case 'reminder': return 'bg-blue-100 border-blue-300';
      case 'achievement': return 'bg-purple-100 border-purple-300';
      case 'system': return 'bg-orange-100 border-orange-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  // تنسيق الوقت
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} أيام`;
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ChevronRight className="w-4 h-4 ml-1" />
                  لوحة التحكم
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              الإشعارات
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount} غير مقروء</Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              تابع آخر التحديثات والإشعارات
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 ml-2" />
                تحديد الكل كمقروء
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="unread">
              غير مقروء
              {unreadCount > 0 && (
                <Badge className="mr-2 px-1.5 py-0.5 text-xs bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="certificate">الشهادات</TabsTrigger>
            <TabsTrigger value="achievement">الإنجازات</TabsTrigger>
            <TabsTrigger value="system">النظام</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <Card className="mb-4 border-primary">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  تم تحديد {selectedIds.length} إشعار
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
                    إلغاء التحديد
                  </Button>
                  <Button variant="destructive" size="sm" onClick={deleteSelected}>
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف المحدد
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد إشعارات</h3>
                <p className="text-muted-foreground">
                  {activeTab !== "all"
                    ? "لا توجد إشعارات في هذا التصنيف"
                    : "ستظهر الإشعارات هنا عندما يتم إرسالها لك"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? "border-primary/50 bg-primary/5" : ""
                } ${selectedIds.includes(notification.id) ? "ring-2 ring-primary" : ""}`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.link) {
                    window.location.href = notification.link;
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div
                      className="flex-shrink-0 pt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(notification.id);
                      }}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                        selectedIds.includes(notification.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}>
                        {selectedIds.includes(notification.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold flex items-center gap-2">
                            {notification.title}
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </h3>
                          <p className="text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.createdAt)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}>
                                  <Check className="w-4 h-4 ml-2" />
                                  تحديد كمقروء
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {notification.link && (
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2 text-primary"
                          onClick={(e) => e.stopPropagation()}
                          asChild
                        >
                          <Link href={notification.link}>
                            عرض التفاصيل
                            <ChevronLeft className="w-4 h-4 mr-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Select All */}
        {filteredNotifications.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={selectAll}>
              {selectedIds.length === filteredNotifications.length
                ? "إلغاء تحديد الكل"
                : "تحديد الكل"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
