"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award, Search, Plus, Edit, Trash2, Eye, MoreVertical,
  ChevronRight, Download, Filter, Code, Brain, Globe, Lock, BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { certificates } from "@/lib/certificates";

const getCategoryIcon = (category: string) => {
  const icons: Record<string, typeof Code> = {
    programming: Code,
    ai: Brain,
    web: Globe,
    cybersecurity: Lock,
    data: BarChart3,
  };
  return icons[category] || Code;
};

// إحصائيات وهمية للشهادات
const certStats = [
  { id: "almarjaa-developer", issued: 156, revenue: 31044 },
  { id: "ai-expert-arabic", issued: 89, revenue: 26611 },
  { id: "web-developer-pro", issued: 124, revenue: 30876 },
  { id: "data-analyst", issued: 67, revenue: 18693 },
  { id: "cybersecurity-expert", issued: 43, revenue: 15007 },
];

export default function AdminCertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCertificates = certificates.filter(cert =>
    cert.title.includes(searchQuery) || cert.categoryLabel.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ChevronRight className="w-4 h-4 ml-1" />
                لوحة التحكم
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-xl font-bold">إدارة الشهادات</h1>
          </div>
          <Button className="hero-gradient text-white">
            <Plus className="w-4 h-4 ml-2" />
            إضافة شهادة جديدة
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-muted-foreground">شهادات متاحة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certStats.reduce((a, b) => a + b.issued, 0)}</p>
                  <p className="text-sm text-muted-foreground">شهادات مصدرة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificates.filter(c => c.featured).length}</p>
                  <p className="text-sm text-muted-foreground">شهادات مميزة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${certStats.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>الشهادات المتاحة</CardTitle>
                <CardDescription>إدارة وتعديل الشهادات المهنية</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pr-10 w-64"
                    placeholder="بحث عن شهادة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 ml-1" />
                  فلترة
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCertificates.map((cert) => {
                const Icon = getCategoryIcon(cert.category);
                const stats = certStats.find(s => s.id === cert.id) || { issued: 0, revenue: 0 };

                return (
                  <Card key={cert.id} className={`overflow-hidden ${cert.featured ? "border-yellow-500 border-2" : ""}`}>
                    <div className="hero-gradient text-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold">{cert.title}</h3>
                            <Badge className="bg-white/20 text-white">{cert.categoryLabel}</Badge>
                          </div>
                        </div>
                        {cert.featured && (
                          <Badge className="gold-accent text-primary">مميز</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {cert.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">السعر</span>
                          <div>
                            <span className="font-bold text-primary">${cert.price}</span>
                            <span className="text-muted-foreground line-through mr-1">${cert.originalPrice}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">المستوى</span>
                          <Badge variant="outline">{cert.level}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">درجة النجاح</span>
                          <span className="font-bold">{cert.passingScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">شهادات مصدرة</span>
                          <span className="font-bold text-green-500">{stats.issued}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">الإيرادات</span>
                          <span className="font-bold">${stats.revenue.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 ml-1" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 ml-1" />
                          تعديل
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
