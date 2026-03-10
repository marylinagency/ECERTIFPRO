'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Clock,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Trash2,
  FileJson,
  Server,
  Shield,
  Settings,
} from 'lucide-react';

interface BackupRecord {
  id: string;
  type: 'full' | 'database' | 'files';
  size: string;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  downloadUrl?: string;
}

interface BackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  includeUploads: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupRecord[]>([
    { id: '1', type: 'full', size: '45.2 MB', createdAt: new Date().toISOString(), status: 'completed' },
    { id: '2', type: 'database', size: '12.8 MB', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
    { id: '3', type: 'full', size: '44.9 MB', createdAt: new Date(Date.now() - 172800000).toISOString(), status: 'completed' },
  ]);
  
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackup: true,
    frequency: 'daily',
    retentionDays: 30,
    includeUploads: true,
    compressionLevel: 'medium',
  });
  
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const createBackup = async (type: 'full' | 'database' | 'files') => {
    setCreating(type);
    setMessage(null);
    
    try {
      const res = await fetch('/api/admin/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setBackups(prev => [{
          id: data.backupId,
          type,
          size: data.size || '0 MB',
          createdAt: new Date().toISOString(),
          status: 'completed',
          downloadUrl: data.downloadUrl,
        }, ...prev]);
        
        setMessage({ type: 'success', text: 'تم إنشاء النسخة الاحتياطية بنجاح!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ في إنشاء النسخة' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setCreating(null);
    }
  };
  
  const restoreBackup = async (backupId: string) => {
    if (!confirm('هل أنت متأكد من استعادة هذه النسخة؟ سيتم استبدال البيانات الحالية.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'تم استعادة النسخة الاحتياطية بنجاح!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ في الاستعادة' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setLoading(false);
    }
  };
  
  const deleteBackup = async (backupId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
      return;
    }
    
    try {
      await fetch(`/api/admin/backup/${backupId}`, { method: 'DELETE' });
      setBackups(prev => prev.filter(b => b.id !== backupId));
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الحذف' });
    }
  };
  
  const saveSettings = async () => {
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/backup/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setLoading(false);
    }
  };
  
  const formatType = (type: string) => {
    switch (type) {
      case 'full': return 'كاملة';
      case 'database': return 'قاعدة البيانات';
      case 'files': return 'الملفات';
      default: return type;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-slate-400 hover:text-white">لوحة التحكم</Link>
              <span className="text-slate-600">/</span>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-6 h-6" />
                النسخ الاحتياطي
              </h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {message.text}
          </div>
        )}
        
        {/* Storage Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">المساحة المستخدمة</p>
                <p className="text-2xl font-bold text-white">58.0 MB</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">قاعدة البيانات</p>
                <p className="text-2xl font-bold text-white">12.8 MB</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">عدد النسخ</p>
                <p className="text-2xl font-bold text-white">{backups.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Create Backup */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">إنشاء نسخة احتياطية</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => createBackup('full')}
              disabled={creating !== null}
              className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50"
            >
              {creating === 'full' ? (
                <RefreshCw className="w-8 h-8 text-white mx-auto animate-spin" />
              ) : (
                <Download className="w-8 h-8 text-white mx-auto" />
              )}
              <p className="text-white font-bold mt-3">نسخة كاملة</p>
              <p className="text-blue-200 text-sm mt-1">قاعدة البيانات + الملفات</p>
            </button>
            
            <button
              onClick={() => createBackup('database')}
              disabled={creating !== null}
              className="p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-xl hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50"
            >
              {creating === 'database' ? (
                <RefreshCw className="w-8 h-8 text-white mx-auto animate-spin" />
              ) : (
                <Database className="w-8 h-8 text-white mx-auto" />
              )}
              <p className="text-white font-bold mt-3">قاعدة البيانات</p>
              <p className="text-green-200 text-sm mt-1">Prisma + Supabase</p>
            </button>
            
            <button
              onClick={() => createBackup('files')}
              disabled={creating !== null}
              className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50"
            >
              {creating === 'files' ? (
                <RefreshCw className="w-8 h-8 text-white mx-auto animate-spin" />
              ) : (
                <FileJson className="w-8 h-8 text-white mx-auto" />
              )}
              <p className="text-white font-bold mt-3">الملفات</p>
              <p className="text-purple-200 text-sm mt-1">التحميلات + الإعدادات</p>
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Backup List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-lg font-bold text-white">النسخ الاحتياطية</h2>
              </div>
              
              <div className="divide-y divide-slate-700">
                {backups.map((backup) => (
                  <div key={backup.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        backup.type === 'full' ? 'bg-blue-500/20' :
                        backup.type === 'database' ? 'bg-green-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {backup.type === 'database' ? (
                          <Database className="w-5 h-5 text-green-400" />
                        ) : (
                          <FileJson className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      
                      <div>
                        <p className="text-white font-medium">نسخة {formatType(backup.type)}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span>{backup.size}</span>
                          <span>•</span>
                          <span>{new Date(backup.createdAt).toLocaleString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {backup.status === 'completed' && (
                        <>
                          <button
                            onClick={() => window.open(`/api/admin/backup/download/${backup.id}`, '_blank')}
                            className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                            title="تحميل"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => restoreBackup(backup.id)}
                            className="p-2 bg-slate-700 text-blue-400 rounded-lg hover:bg-slate-600 transition-colors"
                            title="استعادة"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBackup(backup.id)}
                            className="p-2 bg-slate-700 text-red-400 rounded-lg hover:bg-slate-600 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {backup.status === 'failed' && (
                        <span className="text-red-400 text-sm">فشل</span>
                      )}
                      
                      {backup.status === 'in_progress' && (
                        <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                      )}
                    </div>
                  </div>
                ))}
                
                {backups.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    لا توجد نسخ احتياطية
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Settings */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              إعدادات النسخ التلقائي
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-slate-300">النسخ التلقائي</label>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.autoBackup ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.autoBackup ? 'translate-x-1' : 'translate-x-6'}`} />
                </button>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">التكرار</label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="daily">يومياً</option>
                  <option value="weekly">أسبوعياً</option>
                  <option value="monthly">شهرياً</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">الاحتفاظ (أيام)</label>
                <input
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings(prev => ({ ...prev, retentionDays: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-slate-300">تضمين الملفات المرفوعة</label>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, includeUploads: !prev.includeUploads }))}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.includeUploads ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.includeUploads ? 'translate-x-1' : 'translate-x-6'}`} />
                </button>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">مستوى الضغط</label>
                <select
                  value={settings.compressionLevel}
                  onChange={(e) => setSettings(prev => ({ ...prev, compressionLevel: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="low">منخفض (سريع)</option>
                  <option value="medium">متوسط</option>
                  <option value="high">عالي (أصغر حجم)</option>
                </select>
              </div>
              
              <button
                onClick={saveSettings}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </div>
            
            {/* Supabase Info */}
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Supabase Integration
              </h3>
              <p className="text-slate-400 text-sm">
                النسخ الاحتياطية متوافقة مع Supabase PostgreSQL. 
                يمكن استعادتها مباشرة أو تصديرها بصيغة SQL.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
