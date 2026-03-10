"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard, Search, Plus, Edit, Trash2, Eye, MoreVertical,
  ChevronRight, Download, Filter, DollarSign, TrendingUp,
  AlertCircle, CheckCircle2, Clock, XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// بيانات وهمية للمدفوعات
const mockPayments = [
  { id: "PAY001", user: "أحمد محمد", email: "ahmed@example.com", certificate: "مطور Al-Marjaa", amount: 199, status: "completed", method: "stripe", date: "2024-03-18" },
  { id: "PAY002", user: "سارة عبدالله", email: "sara@example.com", certificate: "خبير AI", amount: 299, status: "completed", method: "stripe", date: "2024-03-18" },
  { id: "PAY003", user: "خالد إبراهيم", email: "khaled@example.com", certificate: "مطور ويب", amount: 249, status: "pending", method: "paypal", date: "2024-03-17" },
  { id: "PAY004", user: "نورة سالم", email: "noura@example.com", certificate: "محلل بيانات", amount: 279, status: "completed", method: "stripe", date: "2024-03-17" },
  { id: "PAY005", user: "محمد علي", email: "mohammed@example.com", certificate: "أمن سيبراني", amount: 349, status: "failed", method: "stripe", date: "2024-03-16" },
  { id: "PAY006", user: "فاطمة أحمد", email: "fatima@example.com", certificate: "مطور Al-Marjaa", amount: 199, status: "completed", method: "paypal", date: "2024-03-16" },
  { id: "PAY007", user: "عمر حسن", email: "omar@example.com", certificate: "خبير AI", amount: 299, status: "refunded", method: "stripe", date: "2024-03-15" },
  { id: "PAY008", user: "ليلى محمد", email: "layla@example.com", certificate: "مطور ويب", amount: 249, status: "completed", method: "stripe", date: "2024-03-15" },
];

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.user.includes(searchQuery) || 
                         payment.email.includes(searchQuery) ||
                         payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockPayments.length,
    completed: mockPayments.filter(p => p.status === "completed").length,
    pending: mockPayments.filter(p => p.status === "pending").length,
    failed: mockPayments.filter(p => p.status === "failed").length,
    refunded: mockPayments.filter(p => p.status === "refunded").length,
    totalRevenue: mockPayments.filter(p => p.status === "completed").reduce((a, b) => a + b.amount, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white"><CheckCircle2 className="w-3 h-3 ml-1" />مكتمل</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 ml-1" />قيد الانتظار</Badge>;
      case "failed":
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 ml-1" />فشل</Badge>;
      case "refunded":
        return <Badge className="bg-gray-500 text-white"><AlertCircle className="w-3 h-3 ml-1" />مسترد</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
            <h1 className="text-xl font-bold">إدارة المدفوعات</h1>
          </div>
          <Button className="hero-gradient text-white">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">إجمالي العمليات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">مكتملة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">قيد الانتظار</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                  <p className="text-sm text-muted-foreground">فاشلة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">الإيرادات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>سجل المدفوعات</CardTitle>
                <CardDescription>جميع عمليات الدفع في المنصة</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pr-10 w-64"
                    placeholder="بحث عن عملية..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="border rounded-lg px-4 py-2 bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="completed">مكتملة</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="failed">فاشلة</option>
                  <option value="refunded">مستردة</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم العملية</TableHead>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>الشهادة</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <span className="font-mono font-bold">{payment.id}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user}</p>
                        <p className="text-sm text-muted-foreground">{payment.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{payment.certificate}</TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">${payment.amount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {payment.method === "stripe" ? "Stripe" : "PayPal"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString("ar-SA")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {payment.status === "completed" && (
                            <DropdownMenuItem>
                              <AlertCircle className="w-4 h-4 ml-2" />
                              استرداد المبلغ
                            </DropdownMenuItem>
                          )}
                          {payment.status === "pending" && (
                            <DropdownMenuItem>
                              <CheckCircle2 className="w-4 h-4 ml-2" />
                              تأكيد الدفع
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
