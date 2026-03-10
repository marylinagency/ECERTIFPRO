'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Palette,
  Type,
  Image as ImageIcon,
  QrCode,
  Save,
  RotateCcw,
  Eye,
  Download,
  Settings,
  CheckCircle,
} from 'lucide-react';

interface CertificateTemplate {
  id: string;
  name: string;
  preview: string;
  layout: 'classic' | 'modern' | 'minimal' | 'elegant';
}

interface CertificateConfig {
  // الألوان
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // الخطوط
  titleFont: string;
  bodyFont: string;
  titleSize: number;
  bodySize: number;
  
  // الشعار
  logoUrl: string;
  logoPosition: 'left' | 'center' | 'right';
  logoSize: number;
  
  // التوقيع
  showSignature: boolean;
  signatureText: string;
  signatureImageUrl: string;
  
  // QR Code
  showQrCode: boolean;
  qrPosition: 'bottom-left' | 'bottom-right' | 'top-right';
  qrSize: number;
  qrColor: string;
  
  // الحدود والزخرفة
  borderWidth: number;
  borderColor: string;
  borderStyle: 'solid' | 'double' | 'dashed' | 'ornate';
  showCornerDecorations: boolean;
  cornerStyle: 'classic' | 'modern' | 'floral';
  
  // الخلفية
  backgroundType: 'solid' | 'gradient' | 'pattern' | 'image';
  backgroundImage: string;
  patternType: 'dots' | 'lines' | 'grid' | 'custom';
  
  // محتوى إضافي
  showIssueDate: boolean;
  showExpiryDate: boolean;
  showScore: boolean;
  showCertificateId: boolean;
  customFooterText: string;
  showSeal: boolean;
  sealPosition: 'bottom-center' | 'bottom-left' | 'bottom-right';
}

const defaultConfig: CertificateConfig = {
  primaryColor: '#1e40af',
  secondaryColor: '#7c3aed',
  accentColor: '#d4af37',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  
  titleFont: 'Amiri',
  bodyFont: 'Cairo',
  titleSize: 36,
  bodySize: 14,
  
  logoUrl: '/logo.png',
  logoPosition: 'center',
  logoSize: 80,
  
  showSignature: true,
  signatureText: 'رضوان دالي حمدوني\nمؤسس لغة المرجع',
  signatureImageUrl: '',
  
  showQrCode: true,
  qrPosition: 'bottom-right',
  qrSize: 80,
  qrColor: '#1e40af',
  
  borderWidth: 4,
  borderColor: '#d4af37',
  borderStyle: 'double',
  showCornerDecorations: true,
  cornerStyle: 'classic',
  
  backgroundType: 'solid',
  backgroundImage: '',
  patternType: 'dots',
  
  showIssueDate: true,
  showExpiryDate: false,
  showScore: true,
  showCertificateId: true,
  customFooterText: 'الشهادة الوحيدة المعتمدة من مؤسس لغة المرجع',
  showSeal: true,
  sealPosition: 'bottom-center',
};

const templates: CertificateTemplate[] = [
  { id: 'classic', name: 'كلاسيكي', preview: '/templates/classic.png', layout: 'classic' },
  { id: 'modern', name: 'عصري', preview: '/templates/modern.png', layout: 'modern' },
  { id: 'minimal', name: 'بسيط', preview: '/templates/minimal.png', layout: 'minimal' },
  { id: 'elegant', name: 'أنيق', preview: '/templates/elegant.png', layout: 'elegant' },
];

export default function CertificatesConfigPage() {
  const [config, setConfig] = useState<CertificateConfig>(defaultConfig);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'qr' | 'preview'>('design');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  useEffect(() => {
    // تحميل الإعدادات المحفوظة
    fetchConfig();
  }, []);
  
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/certificates-config');
      const data = await res.json();
      if (data.success && data.config) {
        setConfig({ ...defaultConfig, ...data.config });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };
  
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/admin/certificates-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ في الحفظ' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleReset = () => {
    setConfig(defaultConfig);
    setSelectedTemplate('classic');
  };
  
  const updateConfig = (key: keyof CertificateConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
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
                <Award className="w-6 h-6" />
                إعدادات الشهادات
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                استعادة الافتراضي
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <CheckCircle className="w-5 h-5" />
            {message.text}
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700 pb-4">
          {[
            { id: 'design', label: 'التصميم', icon: Palette },
            { id: 'content', label: 'المحتوى', icon: Type },
            { id: 'qr', label: 'QR Code', icon: QrCode },
            { id: 'preview', label: 'معاينة', icon: Eye },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'design' && (
              <>
                {/* Templates */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    اختر القالب
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="aspect-[1.4] bg-slate-700 rounded-lg mb-2 flex items-center justify-center">
                          <Award className="w-12 h-12 text-slate-500" />
                        </div>
                        <p className="text-white text-sm font-medium">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Colors */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-lg font-bold text-white mb-4">الألوان</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">اللون الأساسي</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">اللون الثانوي</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">لون الذهبي</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => updateConfig('accentColor', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.accentColor}
                          onChange={(e) => updateConfig('accentColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Border */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-lg font-bold text-white mb-4">الحدود والزخرفة</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">سمك الحد</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={config.borderWidth}
                        onChange={(e) => updateConfig('borderWidth', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-slate-400 text-sm">{config.borderWidth}px</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">نمط الحد</label>
                      <select
                        value={config.borderStyle}
                        onChange={(e) => updateConfig('borderStyle', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      >
                        <option value="solid">متصل</option>
                        <option value="double">مزدوج</option>
                        <option value="dashed">متقطع</option>
                        <option value="ornate">زخرفي</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">لون الحد</label>
                      <input
                        type="color"
                        value={config.borderColor}
                        onChange={(e) => updateConfig('borderColor', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="cornerDecorations"
                        checked={config.showCornerDecorations}
                        onChange={(e) => updateConfig('showCornerDecorations', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="cornerDecorations" className="text-slate-300">إظهار زخارف الأركان</label>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'content' && (
              <>
                {/* Logo */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    الشعار
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">رابط الشعار</label>
                      <input
                        type="text"
                        value={config.logoUrl}
                        onChange={(e) => updateConfig('logoUrl', e.target.value)}
                        placeholder="/logo.png"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">موضع الشعار</label>
                      <select
                        value={config.logoPosition}
                        onChange={(e) => updateConfig('logoPosition', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      >
                        <option value="left">يسار</option>
                        <option value="center">وسط</option>
                        <option value="right">يمين</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">حجم الشعار</label>
                      <input
                        type="range"
                        min="40"
                        max="150"
                        value={config.logoSize}
                        onChange={(e) => updateConfig('logoSize', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-slate-400 text-sm">{config.logoSize}px</span>
                    </div>
                  </div>
                </div>
                
                {/* Signature */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-lg font-bold text-white mb-4">التوقيع</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showSignature"
                        checked={config.showSignature}
                        onChange={(e) => updateConfig('showSignature', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="showSignature" className="text-slate-300">إظهار التوقيع</label>
                    </div>
                    
                    {config.showSignature && (
                      <div>
                        <label className="block text-sm text-slate-300 mb-2">نص التوقيع</label>
                        <textarea
                          value={config.signatureText}
                          onChange={(e) => updateConfig('signatureText', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content Options */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-lg font-bold text-white mb-4">خيارات المحتوى</h2>
                  <div className="space-y-3">
                    {[
                      { key: 'showIssueDate', label: 'إظهار تاريخ الإصدار' },
                      { key: 'showExpiryDate', label: 'إظهار تاريخ الانتهاء' },
                      { key: 'showScore', label: 'إظهار الدرجة' },
                      { key: 'showCertificateId', label: 'إظهار رقم الشهادة' },
                      { key: 'showSeal', label: 'إظهار الختم' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={item.key}
                          checked={config[item.key as keyof CertificateConfig] as boolean}
                          onChange={(e) => updateConfig(item.key as keyof CertificateConfig, e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={item.key} className="text-slate-300">{item.label}</label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm text-slate-300 mb-2">نص التذييل</label>
                    <input
                      type="text"
                      value={config.customFooterText}
                      onChange={(e) => updateConfig('customFooterText', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'qr' && (
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  إعدادات QR Code
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showQrCode"
                      checked={config.showQrCode}
                      onChange={(e) => updateConfig('showQrCode', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="showQrCode" className="text-slate-300">إظهار QR Code على الشهادة</label>
                  </div>
                  
                  {config.showQrCode && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-300 mb-2">موضع QR Code</label>
                        <select
                          value={config.qrPosition}
                          onChange={(e) => updateConfig('qrPosition', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                        >
                          <option value="bottom-left">أسفل اليسار</option>
                          <option value="bottom-right">أسفل اليمين</option>
                          <option value="top-right">أعلى اليمين</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-300 mb-2">حجم QR Code</label>
                        <input
                          type="range"
                          min="40"
                          max="120"
                          value={config.qrSize}
                          onChange={(e) => updateConfig('qrSize', Number(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-slate-400 text-sm">{config.qrSize}px</span>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-300 mb-2">لون QR Code</label>
                        <input
                          type="color"
                          value={config.qrColor}
                          onChange={(e) => updateConfig('qrColor', e.target.value)}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-slate-700/50 rounded-lg p-4 mt-4">
                    <p className="text-slate-300 text-sm">
                      <strong>ملاحظة:</strong> QR Code سيحتوي على رابط للتحقق من صحة الشهادة.
                      <br />
                      عند مسح الكود، سينتقل المستخدم إلى صفحة التحقق.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'preview' && (
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  معاينة الشهادة
                </h2>
                
                {/* Certificate Preview */}
                <div 
                  className="aspect-[1.414] bg-white rounded-lg p-8 relative overflow-hidden"
                  style={{
                    borderWidth: `${config.borderWidth}px`,
                    borderColor: config.borderColor,
                    borderStyle: config.borderStyle === 'ornate' ? 'double' : config.borderStyle,
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                      backgroundImage: `radial-gradient(${config.primaryColor} 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}></div>
                  </div>
                  
                  {/* Corner Decorations */}
                  {config.showCornerDecorations && (
                    <>
                      <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4" style={{ borderColor: config.accentColor }}></div>
                      <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4" style={{ borderColor: config.accentColor }}></div>
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4" style={{ borderColor: config.accentColor }}></div>
                      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4" style={{ borderColor: config.accentColor }}></div>
                    </>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-between text-center">
                    {/* Logo */}
                    <div className={`w-full flex ${config.logoPosition === 'left' ? 'justify-start' : config.logoPosition === 'right' ? 'justify-end' : 'justify-center'}`}>
                      <div 
                        className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
                        style={{ width: config.logoSize, height: config.logoSize * 0.6 }}
                      >
                        <Award className="w-1/2 h-1/2 text-white" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <div>
                      <h1 
                        className="font-bold"
                        style={{ 
                          color: config.primaryColor, 
                          fontSize: `${config.titleSize}px`,
                          fontFamily: config.titleFont,
                        }}
                      >
                        شهادة احتراف
                      </h1>
                      <h2 
                        className="mt-2"
                        style={{ 
                          color: config.secondaryColor, 
                          fontSize: `${config.titleSize * 0.6}px` 
                        }}
                      >
                        لغة المرجع
                      </h2>
                    </div>
                    
                    {/* Recipient */}
                    <div>
                      <p style={{ color: config.textColor, fontSize: `${config.bodySize}px` }}>
                        تشهد منصة ECERTIFPRO بأن
                      </p>
                      <p 
                        className="font-bold text-2xl mt-2"
                        style={{ color: config.primaryColor }}
                      >
                        أحمد محمد الخالدي
                      </p>
                    </div>
                    
                    {/* Details */}
                    <div className="flex gap-8 text-sm" style={{ color: config.textColor }}>
                      {config.showScore && (
                        <div>
                          <p className="font-bold">الدرجة</p>
                          <p style={{ color: config.accentColor }}>95%</p>
                        </div>
                      )}
                      {config.showIssueDate && (
                        <div>
                          <p className="font-bold">تاريخ الإصدار</p>
                          <p>{new Date().toLocaleDateString('ar-SA')}</p>
                        </div>
                      )}
                      {config.showCertificateId && (
                        <div>
                          <p className="font-bold">رقم الشهادة</p>
                          <p className="font-mono">ECERT-XXXX-XXXX</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-end justify-between w-full">
                      {/* Signature */}
                      {config.showSignature && (
                        <div className="text-center">
                          <div className="border-t border-gray-400 pt-2 px-4">
                            <p className="text-sm font-bold" style={{ color: config.primaryColor }}>
                              {config.signatureText.split('\n')[0]}
                            </p>
                            <p className="text-xs" style={{ color: config.textColor }}>
                              {config.signatureText.split('\n')[1]}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* QR Code */}
                      {config.showQrCode && (
                        <div 
                          className="bg-gray-100 rounded flex items-center justify-center"
                          style={{ 
                            width: config.qrSize, 
                            height: config.qrSize,
                          }}
                        >
                          <QrCode style={{ color: config.qrColor }} className="w-3/4 h-3/4" />
                        </div>
                      )}
                      
                      {/* Seal */}
                      {config.showSeal && (
                        <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: config.accentColor }}>
                          <Award style={{ color: config.accentColor }} className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-4 mt-6 justify-center">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-5 h-5" />
                    تحميل PDF
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                    <Eye className="w-5 h-5" />
                    عرض بحجم كامل
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Settings Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات سريعة
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">حجم عنوان الشهادة</label>
                  <input
                    type="range"
                    min="24"
                    max="48"
                    value={config.titleSize}
                    onChange={(e) => updateConfig('titleSize', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-slate-400 text-sm">{config.titleSize}px</span>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">حجم النص</label>
                  <input
                    type="range"
                    min="10"
                    max="18"
                    value={config.bodySize}
                    onChange={(e) => updateConfig('bodySize', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-slate-400 text-sm">{config.bodySize}px</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">روابط سريعة</h3>
              <div className="space-y-2">
                <Link href="/admin/certificates" className="block p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                  إدارة الشهادات
                </Link>
                <Link href="/admin/exams" className="block p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                  إدارة الاختبارات
                </Link>
                <Link href="/verify" className="block p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                  صفحة التحقق
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
