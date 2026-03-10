"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, Search, Plus, Edit, Trash2, Eye, MoreVertical,
  Shield, ChevronRight, Download, Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// بيانات وهمية للمستخدمين
const mockUsers = [
  { id: "1", name: "أحمد محمد الغامدي", email: "ahmed@example.com", level: "محترف", points: 450, certificates: 3, joinDate: "2024-01-15", status: "active" },
  { id: "2", name: "سارة عبدالله الفهد", email: "sara@example.com", level: "متقدم", points: 320, certificates: 2, joinDate: "2024-02-20", status: "active" },
  { id: "3", name: "خالد إبراهيم العتيبي", email: "khaled@example.com", level: "متوسط", points: 180, certificates: 1, joinDate: "2024-03-10", status: "active" },
  { id: "4", name: "نورة سالم الشهري", email: "noura@example.com", level: "مبتدئ", points: 50, certificates: 0, joinDate: "2024-03-18", status: "active" },
  { id: "5", name: "محمد علي الحربي", email: "mohammed@example.com", level: "متقدم", points: 280, certificates: 2, joinDate: "2024-01-25", status: "inactive" },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.includes(searchQuery) || user.email.includes(searchQuery)
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "محترف": return "bg-purple-500 text-white";
      case "متقدم": return "bg-blue-500 text-white";
      case "متوسط": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
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
            <h1 className="text-xl font-bold">إدارة المستخدمين</h1>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">نشط</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.level === "محترف").length}</p>
                  <p className="text-sm text-muted-foreground">محترفين</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">جدد هذا الشهر</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>قائمة المستخدمين</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pr-10 w-64"
                    placeholder="بحث عن مستخدم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 ml-1" />
                  فلترة
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>المستوى</TableHead>
                  <TableHead>النقاط</TableHead>
                  <TableHead>الشهادات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(user.level)}>{user.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">{user.points}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.certificates}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                        {user.status === "active" ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString("ar-SA")}
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
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
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
