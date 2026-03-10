"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, Users, CreditCard, BarChart3, Settings,
  ChevronLeft, LogOut, LayoutDashboard, Shield,
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  Menu, X, MessageSquare, Database, Palette, 
  Globe, Lock
} from "lucide-react";

// Admin user check
const ADMIN_EMAILS = [
  "almarjaa.project@hotmail.com",
  "admin@ecertifpro.com",
  "demo@ecertifpro.com", // للتجربة
];

interface Stat {
  title: string;
  value: string | number;
  change?: string;
  icon: typeof Award;
  color: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // الحصول على المستخدم من localStorage عند التحميل
  const [user] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("ecertifpro_user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  // التحقق من صلاحيات المشرف
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  
  // إذا لم يكن مشرفاً، نعرض رسالة
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">غير مصرح</h2>
            <p className="text-muted-foreground mb-4">
              ليس لديك صلاحية للوصول إلى هذه الصفحة
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              العودة للوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats: Stat[] = [
    {
      title: "إجمالي المستخدمين",
      value: 1247,
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "الشهادات المصدرة",
      value: 389,
      change: "+8%",
      icon: Award,
      color: "text-yellow-500",
    },
    {
      title: "الإيرادات",
      value: "$45,230",
      change: "+23%",
      icon: CreditCard,
      color: "text-green-500",
    },
    {
      title: "معدل النجاح",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  const recentPayments = [
    { id: 1, user: "أحمد محمد", certificate: "مطور Al-Marjaa", amount: 199, status: "completed", date: "2024-03-18" },
    { id: 2, user: "سارة عبدالله", certificate: "خبير AI", amount: 299, status: "completed", date: "2024-03-18" },
    { id: 3, user: "خالد إبراهيم", certificate: "مطور ويب", amount: 249, status: "pending", date: "2024-03-17" },
    { id: 4, user: "نورة سالم", certificate: "محلل بيانات", amount: 279, status: "completed", date: "2024-03-17" },
    { id: 5, user: "محمد علي", certificate: "أمن سيبراني", amount: 349, status: "completed", date: "2024-03-16" },
  ];

  const recentCertificates = [
    { id: "ECERT-2024-ABC123", user: "أحمد محمد", certificate: "مطور Al-Marjaa", score: 92, date: "2024-03-18" },
    { id: "ECERT-2024-DEF456", user: "سارة عبدالله", certificate: "خبير AI", score: 85, date: "2024-03-18" },
    { id: "ECERT-2024-GHI789", user: "خالد إبراهيم", certificate: "مطور ويب", score: 78, date: "2024-03-17" },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin", active: true },
    { icon: Users, label: "المستخدمين", href: "/admin/users" },
    { icon: Award, label: "الشهادات", href: "/admin/certificates" },
    { icon: Palette, label: "تصميم الشهادات", href: "/admin/certificates-config" },
    { icon: CreditCard, label: "المدفوعات", href: "/admin/payments" },
    { icon: Globe, label: "إعدادات الدفع", href: "/admin/payment-settings" },
    { icon: BarChart3, label: "الإحصائيات", href: "/admin/analytics" },
    { icon: Database, label: "النسخ الاحتياطي", href: "/admin/backup" },
    { icon: Lock, label: "الأمان", href: "/admin/security" },
    { icon: MessageSquare, label: "الرسائل", href: "/admin/messages" },
    { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("ecertifpro_user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-primary text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold">ECERTIFPRO</h1>
                <p className="text-xs text-blue-200">لوحة المشرف</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                item.active ? "bg-white/20 text-white" : "text-blue-200 hover:bg-white/10"
              }`}>
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </div>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-bold">م</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.name || "المشرف"}</p>
                  <p className="text-xs text-blue-200">مدير النظام</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg w-full flex justify-center">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-xl font-bold">لوحة تحكم المشرف</h1>
              <p className="text-sm text-muted-foreground">مرحباً، {user?.name || "المشرف"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="w-4 h-4 mr-1" />
                الموقع
              </Link>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      {stat.change && (
                        <p className="text-sm text-green-500 mt-1">{stat.change}</p>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts & Tables */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    آخر المدفوعات
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/payments">عرض الكل</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-white font-bold">
                          {payment.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{payment.user}</p>
                          <p className="text-sm text-muted-foreground">{payment.certificate}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">${payment.amount}</p>
                        <Badge className={payment.status === "completed" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                          {payment.status === "completed" ? "مكتمل" : "قيد الانتظار"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Certificates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    آخر الشهادات المصدرة
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/certificates">عرض الكل</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCertificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gold-accent flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{cert.user}</p>
                          <p className="text-sm text-muted-foreground">{cert.certificate}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-green-500">{cert.score}%</p>
                        <p className="text-xs font-mono text-muted-foreground">{cert.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
              <CardDescription>إدارة سريعة للمنصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link href="/admin/users">
                    <Users className="w-6 h-6" />
                    <span>إدارة المستخدمين</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link href="/admin/certificates">
                    <Award className="w-6 h-6" />
                    <span>إدارة الشهادات</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link href="/admin/payments">
                    <CreditCard className="w-6 h-6" />
                    <span>عرض المدفوعات</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link href="/admin/settings">
                    <Settings className="w-6 h-6" />
                    <span>الإعدادات</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
