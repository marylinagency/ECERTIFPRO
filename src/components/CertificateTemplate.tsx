"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Calendar, Shield, CheckCircle2, Download, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QRCode from "qrcode";

interface CertificateTemplateProps {
  studentName: string;
  certificateTitle: string;
  certificateId: string;
  issueDate: string;
  score: number;
  verifyUrl: string;
  founderName?: string;
  platformName?: string;
  platformUrl?: string;
}

export function CertificateTemplate({
  studentName,
  certificateTitle,
  certificateId,
  issueDate,
  score,
  verifyUrl,
  founderName = "رضوان دالي حمدوني",
  platformName = "ECERTIFPRO",
  platformUrl = "ECERTIFPRO.COM",
}: CertificateTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(verifyUrl, {
          width: 150,
          margin: 2,
          color: {
            dark: "#1a365d",
            light: "#ffffff",
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };
    generateQR();
  }, [verifyUrl]);

  const handleDownload = async () => {
    // Create a new canvas for the certificate
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = "#1a365d";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner border
    ctx.strokeStyle = "#d69e2e";
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);
    
    // Header background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#1a365d");
    gradient.addColorStop(0.5, "#2a4a7d");
    gradient.addColorStop(1, "#1a365d");
    ctx.fillStyle = gradient;
    ctx.fillRect(50, 50, canvas.width - 100, 120);
    
    // Platform name
    ctx.fillStyle = "#d69e2e";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(platformName, canvas.width / 2, 110);
    
    // Subtitle
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText("منصة الشهادات المهنية الإلكترونية", canvas.width / 2, 145);
    
    // Certificate title
    ctx.fillStyle = "#1a365d";
    ctx.font = "bold 36px Arial";
    ctx.fillText("شهادة إتمام مهنية", canvas.width / 2, 230);
    
    // Student name
    ctx.fillStyle = "#666666";
    ctx.font = "24px Arial";
    ctx.fillText("تشهد المنصة بأن", canvas.width / 2, 290);
    
    ctx.fillStyle = "#1a365d";
    ctx.font = "bold 48px Arial";
    ctx.fillText(studentName, canvas.width / 2, 350);
    
    // Certificate title
    ctx.fillStyle = "#666666";
    ctx.font = "24px Arial";
    ctx.fillText("قد أكمل بنجاح متطلبات الحصول على", canvas.width / 2, 410);
    
    ctx.fillStyle = "#d69e2e";
    ctx.font = "bold 32px Arial";
    ctx.fillText(certificateTitle, canvas.width / 2, 460);
    
    // Score
    ctx.fillStyle = "#1a365d";
    ctx.font = "24px Arial";
    ctx.fillText(`بدرجة ${score}%`, canvas.width / 2, 510);
    
    // Date and ID
    ctx.fillStyle = "#666666";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`تاريخ الإصدار: ${issueDate}`, canvas.width - 100, 580);
    ctx.fillText(`رقم الشهادة: ${certificateId}`, canvas.width - 100, 610);
    
    // Founder signature
    ctx.textAlign = "left";
    ctx.fillText("المؤسس والمدير التنفيذي", 100, 580);
    ctx.fillStyle = "#1a365d";
    ctx.font = "bold 24px Arial";
    ctx.fillText(founderName, 100, 615);
    
    // QR Code
    if (qrDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, canvas.width - 180, 650, 120, 120);
        
        // Verify text
        ctx.fillStyle = "#666666";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("مسح للتحقق", canvas.width - 120, 790);
        
        // Footer
        ctx.fillStyle = "#1a365d";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(platformUrl, canvas.width / 2, 800);
        
        // Download
        const link = document.createElement("a");
        link.download = `certificate-${certificateId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = qrDataUrl;
    }
  };

  return (
    <div className="relative">
      {/* Certificate Preview */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-primary">
        {/* Header */}
        <div className="hero-gradient text-white py-6 px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Award className="w-10 h-10 text-yellow-400" />
              <h1 className="text-3xl font-bold">{platformName}</h1>
            </div>
            <p className="text-blue-100">منصة الشهادات المهنية الإلكترونية</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 certificate-pattern">
          {/* Certificate Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">شهادة إتمام مهنية</h2>
            <div className="w-32 h-1 gold-accent mx-auto rounded-full" />
          </div>
          
          {/* Student Name */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg mb-2">تشهد المنصة بأن</p>
            <h3 className="text-4xl font-bold text-primary">{studentName}</h3>
          </div>
          
          {/* Certificate Title */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg mb-2">قد أكمل بنجاح متطلبات الحصول على</p>
            <h4 className="text-2xl font-bold text-yellow-600">{certificateTitle}</h4>
          </div>
          
          {/* Score */}
          <div className="text-center mb-8">
            <Badge className="gold-accent text-primary text-lg px-6 py-2">
              <CheckCircle2 className="w-5 h-5 ml-2" />
              بدرجة {score}%
            </Badge>
          </div>
          
          {/* Footer Info */}
          <div className="flex items-start justify-between mt-12 pt-6 border-t">
            {/* Founder */}
            <div className="text-right">
              <p className="text-muted-foreground text-sm">المؤسس والمدير التنفيذي</p>
              <p className="font-bold text-lg text-primary">{founderName}</p>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">تاريخ الإصدار</p>
                <p className="font-medium">{issueDate}</p>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="text-center">
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR Code" className="w-28 h-28 mx-auto mb-2" />
              )}
              <p className="text-xs text-muted-foreground">مسح للتحقق من الشهادة</p>
              <p className="text-xs font-mono text-primary">{certificateId}</p>
            </div>
            
            {/* Platform Info */}
            <div className="text-left">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-bold">{platformUrl}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                شهادة معتمدة وموثقة
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                مرتبطة بـ Al-Marjaa Language
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative Border */}
        <div className="h-2 gold-accent" />
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button onClick={handleDownload} className="hero-gradient text-white">
          <Download className="w-4 h-4 ml-2" />
          تحميل الشهادة
        </Button>
        <Button variant="outline">
          <Printer className="w-4 h-4 ml-2" />
          طباعة
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 ml-2" />
          مشاركة
        </Button>
      </div>
    </div>
  );
}
