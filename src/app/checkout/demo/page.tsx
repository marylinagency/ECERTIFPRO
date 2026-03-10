"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, Lock, Shield, CheckCircle2, Loader2,
  ChevronRight, Award, Mail, User
} from "lucide-react";
import { certificates } from "@/lib/certificates";

function DemoCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("paymentId");
  const certificateId = searchParams.get("certificateId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "المتعلم التجريبي",
    email: "demo@ecertifpro.com",
    cardNumber: "4242 4242 4242 4242",
    expiry: "12/25",
    cvv: "123",
  });

  const certificate = certificates.find(c => c.id === certificateId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // محاكاة عملية الدفع
    await new Promise(resolve => setTimeout(resolve, 2000));

    // تحديث حالة الدفع
    if (paymentId) {
      await fetch("/api/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          status: "completed",
          stripePaymentId: `demo_${Date.now()}`,
        }),
      });
    }

    // إنشاء مستخدم
    const userRes = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
      }),
    });
    const userData = await userRes.json();

    setIsLoading(false);
    setIsSuccess(true);

    // التوجيه لصفحة النجاح بعد 2 ثانية
    setTimeout(() => {
      router.push("/checkout/success?paymentId=" + paymentId);
    }, 2000);
  };

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">الشهادة غير موجودة</p>
            <Button className="mt-4" asChild>
              <Link href="/certificates">عرض الشهادات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="max-w-md w-full border-green-500 border-2">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</h2>
            <p className="text-muted-foreground">جاري التحويل...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/certificates">
            <ChevronRight className="w-4 h-4 ml-2" />
            العودة للشهادات
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{certificate.title}</h3>
                    <p className="text-sm text-muted-foreground">{certificate.categoryLabel}</p>
                    <Badge variant="outline" className="mt-1">{certificate.level}</Badge>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">السعر الأصلي</span>
                    <span className="line-through text-muted-foreground">${certificate.originalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الخصم</span>
                    <span className="text-green-500">
                      -${(certificate.originalPrice - certificate.price).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>المجموع</span>
                    <span className="text-primary">${certificate.price}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">ضمان استرداد 30 يوم</span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">
                    إذا لم تكن راضياً، يمكنك طلب استرداد كامل المبلغ خلال 30 يوم
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  بيانات الدفع
                </CardTitle>
                <CardDescription>
                  هذه صفحة دفع تجريبية للاختبار
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Demo Notice */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm text-blue-700">
                      <strong>وضع تجريبي:</strong> هذه صفحة دفع تجريبية. لن يتم خصم أي مبلغ حقيقي.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الاسم الكامل</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pr-10"
                        placeholder="الاسم كما سيظهر في الشهادة"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        className="pr-10"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">رقم البطاقة</label>
                    <div className="relative">
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pr-10"
                        placeholder="4242 4242 4242 4242"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ الانتهاء</label>
                      <Input
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <Input
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full gold-accent text-primary font-bold py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 ml-2" />
                        ادفع ${certificate.price}
                      </>
                    )}
                  </Button>
                </form>

                {/* Security */}
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>دفع آمن</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>SSL مشفر</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <DemoCheckoutContent />
    </Suspense>
  );
}
