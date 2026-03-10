"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, RefreshCw, Home, Award } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <Card className="border-yellow-500 border-2">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 rounded-full bg-yellow-100 mx-auto mb-4 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-yellow-500" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">تم إلغاء العملية</h1>
            <p className="text-muted-foreground mb-6">
              لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button className="w-full hero-gradient text-white" asChild>
                <Link href="/certificates">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  حاول مرة أخرى
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 ml-2" />
                  العودة للرئيسية
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
