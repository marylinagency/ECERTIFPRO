'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Reply,
  Filter,
  Search,
  ChevronRight,
  ArrowRight,
  User,
  Calendar,
  Tag,
  X,
  Send
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  category: string;
  status: string;
  adminNotes: string | null;
  readAt: string | null;
  repliedAt: string | null;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  general: 'استفسار عام',
  support: 'دعم فني',
  partnership: 'شراكة وتعاون',
  feedback: 'اقتراح أو ملاحظة',
  certificates: 'استفسار عن الشهادات',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'جديد', color: 'bg-blue-500/20 text-blue-400' },
  read: { label: 'مقروء', color: 'bg-yellow-500/20 text-yellow-400' },
  replied: { label: 'تم الرد', color: 'bg-green-500/20 text-green-400' },
  archived: { label: 'مؤرشف', color: 'bg-gray-500/20 text-gray-400' },
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      
      const response = await fetch(`/api/contact?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data.messages);
        
        // Calculate stats
        const total = data.data.pagination.total;
        const newCount = data.data.messages.filter((m: ContactMessage) => m.status === 'new').length;
        const readCount = data.data.messages.filter((m: ContactMessage) => m.status === 'read').length;
        const repliedCount = data.data.messages.filter((m: ContactMessage) => m.status === 'replied').length;
        setStats({ total, new: newCount, read: readCount, replied: repliedCount });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.includes(search) ||
    m.email.includes(search) ||
    m.subject.includes(search)
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5" />
                لوحة التحكم
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <h1 className="text-xl font-bold">رسائل التواصل</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                {stats.new} جديد
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-slate-400 text-sm">إجمالي الرسائل</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.new}</p>
                <p className="text-slate-400 text-sm">رسائل جديدة</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.read}</p>
                <p className="text-slate-400 text-sm">تمت القراءة</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Reply className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.replied}</p>
                <p className="text-slate-400 text-sm">تم الرد عليها</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              {/* Search & Filter */}
              <div className="p-4 border-b border-slate-700">
                <div className="relative mb-3">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="بحث..."
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pr-10 pl-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {['all', 'new', 'read', 'replied'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        filter === s
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {s === 'all' ? 'الكل' : statusLabels[s]?.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-slate-500 border-t-white rounded-full animate-spin mx-auto mb-3" />
                    جاري التحميل...
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    لا توجد رسائل
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === 'new') {
                          updateStatus(msg.id, 'read');
                        }
                      }}
                      className={`w-full p-4 text-right border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                        selectedMessage?.id === msg.id ? 'bg-slate-700/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium truncate">{msg.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusLabels[msg.status]?.color}`}>
                          {statusLabels[msg.status]?.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate mb-1">{msg.subject}</p>
                      <p className="text-xs text-slate-500">{formatDate(msg.createdAt)}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {selectedMessage.name}
                        </span>
                        <span className="flex items-center gap-1" dir="ltr">
                          <Mail className="w-4 h-4" />
                          {selectedMessage.email}
                        </span>
                        {selectedMessage.phone && (
                          <span className="flex items-center gap-1" dir="ltr">
                            <Phone className="w-4 h-4" />
                            {selectedMessage.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${statusLabels[selectedMessage.status]?.color}`}>
                        {statusLabels[selectedMessage.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">محتوى الرسالة</h3>
                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Meta */}
                <div className="p-6 border-b border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">النوع:</span>
                      <p className="text-slate-300 mt-1">
                        <Tag className="w-4 h-4 inline ml-1" />
                        {categoryLabels[selectedMessage.category] || selectedMessage.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">تاريخ الإرسال:</span>
                      <p className="text-slate-300 mt-1">
                        <Calendar className="w-4 h-4 inline ml-1" />
                        {formatDate(selectedMessage.createdAt)}
                      </p>
                    </div>
                    {selectedMessage.readAt && (
                      <div>
                        <span className="text-slate-500">تاريخ القراءة:</span>
                        <p className="text-slate-300 mt-1">{formatDate(selectedMessage.readAt)}</p>
                      </div>
                    )}
                    {selectedMessage.repliedAt && (
                      <div>
                        <span className="text-slate-500">تاريخ الرد:</span>
                        <p className="text-slate-300 mt-1">{formatDate(selectedMessage.repliedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-800/30">
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=رد: ${selectedMessage.subject}`}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      الرد بالبريد
                    </a>
                    <button
                      onClick={() => updateStatus(selectedMessage.id, 'replied')}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      تحديد كمُجاب
                    </button>
                    <button
                      onClick={() => updateStatus(selectedMessage.id, 'archived')}
                      className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      أرشفة
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors mr-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-medium text-slate-400 mb-2">اختر رسالة للعرض</h3>
                <p className="text-slate-500">اختر رسالة من القائمة لعرض تفاصيلها</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Archive icon component
function Archive({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  );
}
