'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  AlertTriangle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  TestTube,
  CheckCircle,
  XCircle,
  DollarSign,
  Bitcoin,
  Globe,
} from 'lucide-react';

interface PaymentSettings {
  stripePublicKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  paypalClientId: string;
  paypalClientSecret: string;
  paypalWebhookId: string;
  paypalSandbox: boolean;
  coinbaseApiKey: string;
  coinbaseWebhookSecret: string;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    stripePublicKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    paypalClientId: '',
    paypalClientSecret: '',
    paypalWebhookId: '',
    paypalSandbox: true,
    coinbaseApiKey: '',
    coinbaseWebhookSecret: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/payment-settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
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
  
  const testProvider = async (provider: string) => {
    setTesting(provider);
    
    try {
      const res = await fetch('/api/admin/payment-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      
      const data = await res.json();
      setTestResults(prev => ({ ...prev, [provider]: data.success }));
    } catch {
      setTestResults(prev => ({ ...prev, [provider]: false }));
    } finally {
      setTesting(null);
    }
  };
  
  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center" dir="rtl">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
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
                <CreditCard className="w-6 h-6" />
                إعدادات الدفع
              </h1>
            </div>
            
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50">
              {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              حفظ الإعدادات
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}
        
        {/* Security Warning */}
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-400 mb-1">تحذير أمني</h3>
            <p className="text-yellow-200/80 text-sm">هذه المفاتيح حساسة جداً. لا تشاركها مع أي شخص. تأكد من استخدام مفاتيح الاختبار في بيئة التطوير.</p>
          </div>
        </div>
        
        {/* Stripe Settings */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Stripe</h2>
                <p className="text-slate-400 text-sm">بطاقات الائتمان والخصم</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {testResults.stripe !== undefined && (
                <span className={`flex items-center gap-1 text-sm ${testResults.stripe ? 'text-green-400' : 'text-red-400'}`}>
                  {testResults.stripe ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testResults.stripe ? 'متصل' : 'فشل'}
                </span>
              )}
              <button onClick={() => testProvider('stripe')} disabled={testing === 'stripe'} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors">
                {testing === 'stripe' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                اختبار
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Public Key (pk_test_...)</label>
              <input type="text" value={settings.stripePublicKey} onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })} placeholder="pk_test_xxxxx" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Secret Key (sk_test_...)</label>
              <div className="relative">
                <input type={showSecrets.stripeSecret ? 'text' : 'password'} value={settings.stripeSecretKey} onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })} placeholder="sk_test_xxxxx" className="w-full px-4 py-3 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <button type="button" onClick={() => toggleSecret('stripeSecret')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showSecrets.stripeSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Webhook Secret (whsec_...)</label>
              <div className="relative">
                <input type={showSecrets.stripeWebhook ? 'text' : 'password'} value={settings.stripeWebhookSecret} onChange={(e) => setSettings({ ...settings, stripeWebhookSecret: e.target.value })} placeholder="whsec_xxxxx" className="w-full px-4 py-3 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <button type="button" onClick={() => toggleSecret('stripeWebhook')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showSecrets.stripeWebhook ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* PayPal Settings */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PayPal</h2>
                <p className="text-slate-400 text-sm">PayPal و بطاقات الائتمان</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-slate-300">
                <input type="checkbox" checked={settings.paypalSandbox} onChange={(e) => setSettings({ ...settings, paypalSandbox: e.target.checked })} className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500" />
                <span className="text-sm">وضع الاختبار (Sandbox)</span>
              </label>
              
              {testResults.paypal !== undefined && (
                <span className={`flex items-center gap-1 text-sm ${testResults.paypal ? 'text-green-400' : 'text-red-400'}`}>
                  {testResults.paypal ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testResults.paypal ? 'متصل' : 'فشل'}
                </span>
              )}
              <button onClick={() => testProvider('paypal')} disabled={testing === 'paypal'} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors">
                {testing === 'paypal' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                اختبار
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client ID</label>
              <input type="text" value={settings.paypalClientId} onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })} placeholder="AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxB" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client Secret</label>
              <div className="relative">
                <input type={showSecrets.paypalSecret ? 'text' : 'password'} value={settings.paypalClientSecret} onChange={(e) => setSettings({ ...settings, paypalClientSecret: e.target.value })} placeholder="ExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxB" className="w-full px-4 py-3 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm" />
                <button type="button" onClick={() => toggleSecret('paypalSecret')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showSecrets.paypalSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Webhook ID</label>
              <input type="text" value={settings.paypalWebhookId} onChange={(e) => setSettings({ ...settings, paypalWebhookId: e.target.value })} placeholder="0Hxxxxxxxxxxxxxxx" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm" />
            </div>
          </div>
        </div>
        
        {/* Coinbase Settings */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Coinbase Commerce</h2>
                <p className="text-slate-400 text-sm">العملات الرقمية (Bitcoin, Ethereum, USDC)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {testResults.coinbase !== undefined && (
                <span className={`flex items-center gap-1 text-sm ${testResults.coinbase ? 'text-green-400' : 'text-red-400'}`}>
                  {testResults.coinbase ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testResults.coinbase ? 'متصل' : 'فشل'}
                </span>
              )}
              <button onClick={() => testProvider('coinbase')} disabled={testing === 'coinbase'} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors">
                {testing === 'coinbase' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                اختبار
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
              <div className="relative">
                <input type={showSecrets.coinbaseKey ? 'text' : 'password'} value={settings.coinbaseApiKey} onChange={(e) => setSettings({ ...settings, coinbaseApiKey: e.target.value })} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="w-full px-4 py-3 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm" />
                <button type="button" onClick={() => toggleSecret('coinbaseKey')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showSecrets.coinbaseKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Webhook Secret</label>
              <div className="relative">
                <input type={showSecrets.coinbaseWebhook ? 'text' : 'password'} value={settings.coinbaseWebhookSecret} onChange={(e) => setSettings({ ...settings, coinbaseWebhookSecret: e.target.value })} placeholder="your-webhook-secret" className="w-full px-4 py-3 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                <button type="button" onClick={() => toggleSecret('coinbaseWebhook')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showSecrets.coinbaseWebhook ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Webhook URLs */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            عناوين Webhook
          </h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Stripe Webhook URL:</p>
              <code className="text-blue-400 text-sm break-all">{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/stripe</code>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">PayPal Webhook URL:</p>
              <code className="text-blue-400 text-sm break-all">{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/paypal</code>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Coinbase Webhook URL:</p>
              <code className="text-blue-400 text-sm break-all">{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/coinbase</code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
