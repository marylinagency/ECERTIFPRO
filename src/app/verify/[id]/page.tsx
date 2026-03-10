"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, CheckCircle2, XCircle, Shield, Calendar, 
  Clock, User, Hash, ExternalLink, AlertCircle,
  Building, Mail, Globe, Loader2
} from "lucide-react";

interface CertificateData {
  id: string;
  studentName: string;
  certificateTitle: string;
  certificateTitleEn?: string;
  score: number;
  issueDate: string;
  status: string;
  category: string;
  skills: string[];
  founderName: string;
  platformName: string;
  platformUrl: string;
  email: string;
}

const categoryLabels: Record<string, string> = {
  programming: 'برمجة',
  ai: 'ذكاء اصطناعي',
  web: 'تطوير ويب',
  cybersecurity: 'أمن سيبراني',
  data: 'تحليل بيانات',
};

export default function VerifyPage() {
  const params = useParams();
  const certificateId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function verifyCertificate() {
      try {
        const response = await fetch(`/api/verify/${certificateId}`);
        const data = await response.json();
        
        if (data.success) {
          setCertificate(data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    verifyCertificate();
  }, [certificateId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full hero-gradient mx-auto mb-4 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-bold mb-2">جاري التحقق...</h2>
            <p className="text-muted-foreground">
              نتحقق من صحة الشهادة رقم {certificateId}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-destructive">شهادة غير صالحة</h2>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على شهادة بهذا الرقم في سجلاتنا
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              رقم الشهادة: <span className="font-mono font-bold">{certificateId}</span>
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  العودة للرئيسية
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/certificates">
                  استكشف الشهادات
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    valid: { label: 'معتمدة', color: 'text-green-600', bgColor: 'bg-green-500' },
    expired: { label: 'منتهية', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
    revoked: { label: 'ملغاة', color: 'text-red-600', bgColor: 'bg-red-500' },
  };

  const status = statusConfig[certificate.status as keyof typeof statusConfig] || statusConfig.valid;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full hero-gradient mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">التحقق من الشهادة</h1>
          <p className="text-muted-foreground">
            التحقق من صحة الشهادات المهنية
          </p>
        </div>

        {/* Status Banner */}
        <Card className={`mb-6 ${
          certificate.status === "valid" 
            ? "border-green-500 border-2" 
            : certificate.status === "expired"
            ? "border-yellow-500 border-2"
            : "border-destructive border-2"
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4">
              {certificate.status === "valid" ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-green-600">شهادة صالحة وموثقة</h2>
                    <p className="text-muted-foreground">هذه الشهادة صادرة من منصة ECERTIFPRO</p>
                  </div>
                </>
              ) : certificate.status === "expired" ? (
                <>
                  <AlertCircle className="w-12 h-12 text-yellow-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-yellow-600">شهادة منتهية الصلاحية</h2>
                    <p className="text-muted-foreground">انتهت صلاحية هذه الشهادة</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-destructive" />
                  <div>
                    <h2 className="text-2xl font-bold text-destructive">شهادة غير صالحة</h2>
                    <p className="text-muted-foreground">هذه الشهادة ليست صادرة من منصتنا</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certificate Details */}
        <Card className="mb-6">
          <CardHeader className="hero-gradient text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-10 h-10 text-yellow-400" />
                <div>
                  <CardTitle className="text-2xl">{certificate.platformName}</CardTitle>
                  <CardDescription className="text-blue-100">
                    منصة الشهادات المهنية الإلكترونية
                  </CardDescription>
                </div>
              </div>
              <Badge className="gold-accent text-primary font-bold">
                {status.label}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Student Name */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">اسم المتعلم</p>
                  <p className="text-lg font-bold">{certificate.studentName}</p>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عنوان الشهادة</p>
                  <p className="text-lg font-bold">{certificate.certificateTitle}</p>
                  {certificate.certificateTitleEn && (
                    <p className="text-sm text-muted-foreground">{certificate.certificateTitleEn}</p>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full gold-accent flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary text-sm">{certificate.score}%</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">درجة النجاح</p>
                  <p className="text-lg font-bold text-green-600">{certificate.score}%</p>
                </div>
              </div>

              {/* Issue Date */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ الإصدار</p>
                  <p className="text-lg font-bold">
                    {new Date(certificate.issueDate).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">رقم الشهادة</p>
                  <p className="text-lg font-mono font-bold">{certificate.id}</p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التصنيف</p>
                  <Badge variant="outline">{categoryLabels[certificate.category] || certificate.category}</Badge>
                </div>
              </div>

              {/* Skills */}
              {certificate.skills.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">المهارات المكتسبة</p>
                    <div className="flex flex-wrap gap-2">
                      {certificate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Issuer Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              معلومات الجهة المصدرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">المؤسس</p>
                  <p className="font-bold">{certificate.founderName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">المنصة</p>
                  <p className="font-bold">{certificate.platformName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <a href={`mailto:${certificate.email}`} className="font-bold text-primary hover:underline">
                    {certificate.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">الموقع</p>
                  <span className="font-bold">{certificate.platformUrl}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Al-Marjaa Connection */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">مرتبطة بـ Al-Marjaa Language</h3>
                <p className="text-muted-foreground text-sm">
                  منصة تعليمية متكاملة باللغة العربية
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              العودة للرئيسية
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/certificates">
              استكشف الشهادات
            </Link>
          </Button>
          <Button size="lg" className="hero-gradient text-white" asChild>
            <Link href="/dashboard">
              لوحة التحكم
            </Link>
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          هذه الصفحة للتحقق من صحة الشهادات المهنية الصادرة من منصة ECERTIFPRO
          <br />
          للمزيد من المعلومات تواصل معنا على {certificate.email}
        </p>
      </div>
    </div>
  );
}
