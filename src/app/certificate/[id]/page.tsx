"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ChevronRight, Home, Share2, CheckCircle2, Loader2 } from "lucide-react";
import { CertificateTemplate } from "@/components/CertificateTemplate";

interface Certificate {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  skills: string[];
  passingScore: number;
}

export default function CertificatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const certificateNumber = params.id as string;
  
  const studentName = searchParams.get("name") || "المتعلم";
  const certId = searchParams.get("certId") || "almarjaa-developer";
  const score = parseInt(searchParams.get("score") || "85");
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  
  const issueDate = new Date().toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const verifyUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/verify/${certificateNumber}` 
    : "";

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const response = await fetch('/api/certificates');
        const data = await response.json();
        if (data.success) {
          const cert = data.data.find((c: Certificate) => c.id === certId);
          if (cert) {
            setCertificate(cert);
          }
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificate();
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">الشهادة غير موجودة</h2>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على بيانات الشهادة
            </p>
            <Button asChild>
              <Link href="/certificates">
                <ChevronRight className="w-4 h-4 ml-2" />
                العودة للشهادات
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link href="/certificates">
              <ChevronRight className="w-4 h-4 ml-2" />
              العودة للشهادات
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge className="gold-accent text-primary font-bold">
              <CheckCircle2 className="w-4 h-4 ml-1" />
              شهادة معتمدة
            </Badge>
          </div>
        </div>
        
        {/* Success Message */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="hero-gradient text-white overflow-hidden">
            <CardContent className="py-6 px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">🎉 مبروك! تم إصدار شهادتك</h1>
                  <p className="text-blue-100">
                    تهانينا على إتمامك بنجاح لشهادة {certificate.title}
                  </p>
                </div>
                <div className="hidden md:block">
                  <Award className="w-16 h-16 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Certificate */}
        <div className="max-w-4xl mx-auto mb-8">
          <CertificateTemplate
            studentName={studentName}
            certificateTitle={certificate.title}
            certificateId={certificateNumber}
            issueDate={issueDate}
            score={score}
            verifyUrl={verifyUrl}
          />
        </div>
        
        {/* Info Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">رقم الشهادة</p>
                  <p className="font-mono font-bold text-sm">{certificateNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-accent flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الحالة</p>
                  <p className="font-bold text-green-600">معتمدة ✓</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">صلاحية الشهادة</p>
                  <p className="font-bold">مدى الحياة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        {certificate.skills.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  المهارات المكتسبة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Actions */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">
              <Home className="w-4 h-4 ml-2" />
              لوحة التحكم
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`/verify/${certificateNumber}`}>
              <CheckCircle2 className="w-4 h-4 ml-2" />
              صفحة التحقق
            </Link>
          </Button>
          <Button size="lg" className="gold-accent text-primary font-bold" asChild>
            <Link href="/certificates">
              <Award className="w-4 h-4 ml-2" />
              استكشف شهادات أخرى
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
