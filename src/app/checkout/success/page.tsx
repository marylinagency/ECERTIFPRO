"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, Award, Loader2, Download, Share2,
  Home, ExternalLink
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [isLoading, setIsLoading] = useState(!!paymentId);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (!paymentId) return;
    
    fetch(`/api/payments?id=${paymentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPayment(data.data);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [paymentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold mb-2">جاري التحقق من الدفع...</h2>
            <p className="text-muted-foreground">يرجى الانتظار</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Success Banner */}
        <Card className="border-green-500 border-2 mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                تم الدفع بنجاح! 🎉
              </h1>
              <p className="text-muted-foreground text-lg">
                شكراً لك! تم تأكيد عملية الدفع
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        {payment && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                تفاصيل الدفع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">المبلغ</span>
                  <span className="font-bold text-lg">${payment.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الحالة</span>
                  <Badge className="bg-green-500 text-white">مكتمل</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">رقم العملية</span>
                  <span className="font-mono text-sm">{payment.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="hero-gradient text-white mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">الخطوات التالية</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-bold">1</span>
                </div>
                <span>ابدأ الاختبار واحصل على شهادتك</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-bold">2</span>
                </div>
                <span>اجتز الاختبار بنجاح (درجة النجاح 70%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-bold">3</span>
                </div>
                <span>احصل على شهادتك المعتمدة فوراً</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gold-accent text-primary font-bold" asChild>
            <Link href="/certificates">
              <Award className="w-5 h-5 ml-2" />
              ابدأ الاختبار
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">
              <Home className="w-5 h-5 ml-2" />
              لوحة التحكم
            </Link>
          </Button>
        </div>

        {/* Support */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          هل تحتاج مساعدة؟ تواصل معنا على{" "}
          <a href="mailto:almarjaa.project@hotmail.com" className="text-primary hover:underline">
            almarjaa.project@hotmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
