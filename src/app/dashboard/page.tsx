"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, Clock, BookOpen, TrendingUp, Calendar, 
  ChevronLeft, Download, Share2, CheckCircle2, 
  Play, BarChart3, Target, Zap, Star, Loader2,
  Brain, Code, Globe, Lock, LogIn
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

interface Certificate {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  duration: string;
  level: string;
  skills: string[];
  passingScore: number;
  totalQuestions: number;
  examDuration: number;
  featured: boolean;
}

interface UserCertificate {
  id: string;
  certificateId: string;
  certificateNumber: string;
  score: number;
  status: string;
  issueDate: string;
  certificate?: Certificate;
}

interface ExamAttempt {
  id: string;
  certificateId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  certificate?: Certificate;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  level: string;
  points: number;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  programming: 'برمجة',
  ai: 'ذكاء اصطناعي',
  web: 'تطوير ويب',
  cybersecurity: 'أمن سيبراني',
  data: 'تحليل بيانات',
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [userCertificates, setUserCertificates] = useState<UserCertificate[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Check if user is logged in
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userStr);
        setUser(userData);

        // Fetch all certificates
        const certsRes = await fetch('/api/certificates');
        const certsData = await certsRes.json();
        if (certsData.success) {
          setCertificates(certsData.data);
        }

        // Fetch user certificates
        const userCertsRes = await fetch(`/api/users/${userData.id}/certificates`);
        if (userCertsRes.ok) {
          const userCertsData = await userCertsRes.json();
          if (userCertsData.success) {
            setUserCertificates(userCertsData.data);
          }
        }

        // Fetch exam attempts
        const attemptsRes = await fetch(`/api/exams?userId=${userData.id}`);
        if (attemptsRes.ok) {
          const attemptsData = await attemptsRes.json();
          if (attemptsData.success) {
            setExamAttempts(attemptsData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, typeof Code> = {
      programming: Code,
      ai: Brain,
      web: Globe,
      cybersecurity: Lock,
      data: BarChart3,
    };
    return icons[categoryId] || Code;
  };

  const stats = [
    { label: "الشهادات المكتملة", value: userCertificates.length, icon: Award, color: "text-yellow-500" },
    { label: "قيد التقدم", value: examAttempts.filter(a => !a.passed).length, icon: Clock, color: "text-blue-500" },
    { label: "نقاط الخبرة", value: user?.points || 0, icon: Zap, color: "text-purple-500" },
    { label: "المستوى", value: user?.level || "مبتدئ", icon: Star, color: "text-orange-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-20 h-20 rounded-full hero-gradient mx-auto mb-4 flex items-center justify-center">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">تسجيل الدخول مطلوب</CardTitle>
            <CardDescription>
              يجب تسجيل الدخول للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full hero-gradient text-white" asChild>
              <Link href="/auth/login">
                تسجيل الدخول
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/auth/register">
                إنشاء حساب جديد
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get in-progress certificates (attempts without passing)
  const inProgressIds = [...new Set(
    examAttempts
      .filter(a => !a.passed)
      .map(a => a.certificateId)
      .filter(id => !userCertificates.some(uc => uc.certificateId === id))
  )];
  
  const inProgressCertificates = certificates.filter(c => inProgressIds.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="hero-gradient text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">مرحباً، {user.name}! 👋</h1>
              <p className="text-blue-100">
                تابع تقدمك واحصل على شهاداتك المهنية
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Badge className="gold-accent text-primary font-bold px-4 py-2">
                <Star className="w-4 h-4 ml-1" />
                {user.level}
              </Badge>
              <Button className="hero-gradient text-white" asChild>
                <Link href="/certificates">
                  استكشف الشهادات
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="certificates">شهاداتي</TabsTrigger>
            <TabsTrigger value="progress">قيد التقدم</TabsTrigger>
            <TabsTrigger value="available">المتاحة</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  أحدث الشهادات
                </CardTitle>
                <CardDescription>شهاداتك المهنية المكتملة</CardDescription>
              </CardHeader>
              <CardContent>
                {userCertificates.length > 0 ? (
                  <div className="space-y-4">
                    {userCertificates.slice(0, 3).map((cert) => {
                      const certInfo = certificates.find(c => c.id === cert.certificateId);
                      return (
                        <div key={cert.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold">{certInfo?.title || 'شهادة'}</h4>
                              <p className="text-sm text-muted-foreground">
                                درجة: {cert.score}% • {new Date(cert.issueDate).toLocaleDateString("ar-SA")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/certificate/${cert.certificateNumber}?certId=${cert.certificateId}&name=${user.name}&score=${cert.score}`}>
                                عرض
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لم تحصل على أي شهادات بعد</p>
                    <Button className="mt-4 hero-gradient text-white" asChild>
                      <Link href="/certificates">ابدأ الآن</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="hero-gradient text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                      <Target className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">أكمل رحلتك</h3>
                      <p className="text-blue-100">لديك {inProgressCertificates.length} شهادات قيد التقدم</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 gold-accent text-primary font-bold" asChild>
                    <Link href="/certificates">
                      متابعة التعلم
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-yellow-500 border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full gold-accent flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">تطور مهاراتك</h3>
                      <p className="text-muted-foreground">احصل على شهادات جديدة</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 hero-gradient text-white" asChild>
                    <Link href="/certificates">
                      استكشف الشهادات
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">شهاداتي المكتملة</h2>
              <Badge className="gold-accent text-primary font-bold">
                {userCertificates.length} شهادة
              </Badge>
            </div>

            {userCertificates.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCertificates.map((cert) => {
                  const certInfo = certificates.find(c => c.id === cert.certificateId);
                  const Icon = certInfo ? getCategoryIcon(certInfo.category) : Award;
                  
                  return (
                    <Card key={cert.id} className="overflow-hidden">
                      <div className="hero-gradient text-white p-4">
                        <div className="flex items-center justify-between">
                          <Icon className="w-10 h-10 text-yellow-400" />
                          <Badge className="bg-white/20 text-white">
                            {cert.score}%
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{certInfo?.title || 'شهادة'}</CardTitle>
                        <CardDescription>
                          رقم الشهادة: {cert.certificateNumber}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="w-4 h-4" />
                          {new Date(cert.issueDate).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <Progress value={cert.score} className="h-2" />
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="flex items-center gap-2 w-full">
                          <Button className="flex-1 hero-gradient text-white" asChild>
                            <Link href={`/certificate/${cert.certificateNumber}?certId=${cert.certificateId}&name=${user.name}&score=${cert.score}`}>
                              عرض الشهادة
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">لا توجد شهادات حتى الآن</h3>
                  <p className="text-muted-foreground mb-4">
                    ابدأ رحلتك التعليمية واحصل على شهادتك الأولى
                  </p>
                  <Button className="hero-gradient text-white" asChild>
                    <Link href="/certificates">
                      استكشف الشهادات
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* In Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">الشهادات قيد التقدم</h2>
              <Badge variant="secondary">
                {inProgressCertificates.length} شهادة
              </Badge>
            </div>

            {inProgressCertificates.length > 0 ? (
              <div className="space-y-4">
                {inProgressCertificates.map((cert) => {
                  const Icon = getCategoryIcon(cert.category);
                  const lastAttempt = examAttempts
                    .filter(a => a.certificateId === cert.id && !a.passed)
                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

                  return (
                    <Card key={cert.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center">
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">{cert.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {cert.totalQuestions} سؤال • درجة النجاح: {cert.passingScore}%
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {lastAttempt && (
                              <span className="text-sm text-muted-foreground">
                                آخر محاولة: {lastAttempt.score}%
                              </span>
                            )}
                            <Button className="hero-gradient text-white" asChild>
                              <Link href={`/exam/${cert.id}`}>
                                <Play className="w-4 h-4 ml-1" />
                                إعادة المحاولة
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">لا توجد شهادات قيد التقدم</h3>
                  <p className="text-muted-foreground mb-4">
                    ابدأ رحلة تعلم جديدة
                  </p>
                  <Button className="hero-gradient text-white" asChild>
                    <Link href="/certificates">
                      استكشف الشهادات
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Available Tab */}
          <TabsContent value="available" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">الشهادات المتاحة</h2>
              <Button variant="outline" asChild>
                <Link href="/certificates">
                  عرض الكل
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => {
                const isCompleted = userCertificates.some(uc => uc.certificateId === cert.id);
                const isInProgress = inProgressIds.includes(cert.id);
                const Icon = getCategoryIcon(cert.category);

                return (
                  <Card
                    key={cert.id}
                    className={`relative ${
                      isCompleted
                        ? "border-green-500 border-2"
                        : isInProgress
                        ? "border-blue-500 border-2"
                        : ""
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle2 className="w-3 h-3 ml-1" />
                          مكتملة
                        </Badge>
                      </div>
                    )}
                    {isInProgress && !isCompleted && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-blue-500 text-white">
                          <Clock className="w-3 h-3 ml-1" />
                          قيد التقدم
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{cert.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[cert.category] || cert.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {cert.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-primary">${cert.price}</span>
                        <span className="text-muted-foreground">
                          {cert.totalQuestions} سؤال
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button
                        className={`w-full ${
                          isCompleted ? "bg-green-500 hover:bg-green-600 text-white" : "hero-gradient text-white"
                        }`}
                        asChild
                      >
                        <Link href={`/exam/${cert.id}`}>
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 ml-1" />
                              إعادة الاختبار
                            </>
                          ) : isInProgress ? (
                            <>
                              <Play className="w-4 h-4 ml-1" />
                              متابعة الاختبار
                            </>
                          ) : (
                            <>
                              ابدأ الاختبار
                              <ChevronLeft className="w-4 h-4 mr-1" />
                            </>
                          )}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
