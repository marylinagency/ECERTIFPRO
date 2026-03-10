'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Safari,
  Eye,
  MousePointer,
  RefreshCw,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface VisitorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  change: number;
}

interface CountryStat {
  country: string;
  code: string;
  visitors: number;
  percentage: number;
  flag: string;
}

interface TimeStat {
  hour: number;
  visitors: number;
}

interface DeviceStat {
  device: 'desktop' | 'mobile' | 'tablet';
  count: number;
  percentage: number;
}

interface BrowserStat {
  browser: string;
  count: number;
  percentage: number;
}

interface UserStats {
  registered: number;
  guests: number;
  newToday: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    total: 24580,
    today: 342,
    thisWeek: 2156,
    thisMonth: 8432,
    change: 12.5,
  });
  
  const [countryStats, setCountryStats] = useState<CountryStat[]>([
    { country: 'السعودية', code: 'SA', visitors: 8542, percentage: 34.7, flag: '🇸🇦' },
    { country: 'مصر', code: 'EG', visitors: 5234, percentage: 21.3, flag: '🇪🇬' },
    { country: 'الإمارات', code: 'AE', visitors: 3215, percentage: 13.1, flag: '🇦🇪' },
    { country: 'الكويت', code: 'KW', visitors: 2156, percentage: 8.8, flag: '🇰🇼' },
    { country: 'المغرب', code: 'MA', visitors: 1892, percentage: 7.7, flag: '🇲🇦' },
    { country: 'الجزائر', code: 'DZ', visitors: 1245, percentage: 5.1, flag: '🇩🇿' },
    { country: 'الأردن', code: 'JO', visitors: 986, percentage: 4.0, flag: '🇯🇴' },
    { country: 'أخرى', code: 'XX', visitors: 1310, percentage: 5.3, flag: '🌍' },
  ]);
  
  const [timeStats, setTimeStats] = useState<TimeStat[]>([
    { hour: 0, visitors: 45 },
    { hour: 1, visitors: 32 },
    { hour: 2, visitors: 28 },
    { hour: 3, visitors: 22 },
    { hour: 4, visitors: 18 },
    { hour: 5, visitors: 25 },
    { hour: 6, visitors: 42 },
    { hour: 7, visitors: 68 },
    { hour: 8, visitors: 95 },
    { hour: 9, visitors: 125 },
    { hour: 10, visitors: 148 },
    { hour: 11, visitors: 162 },
    { hour: 12, visitors: 185 },
    { hour: 13, visitors: 178 },
    { hour: 14, visitors: 165 },
    { hour: 15, visitors: 152 },
    { hour: 16, visitors: 145 },
    { hour: 17, visitors: 158 },
    { hour: 18, visitors: 172 },
    { hour: 19, visitors: 195 },
    { hour: 20, visitors: 188 },
    { hour: 21, visitors: 165 },
    { hour: 22, visitors: 125 },
    { hour: 23, visitors: 78 },
  ]);
  
  const [deviceStats, setDeviceStats] = useState<DeviceStat[]>([
    { device: 'desktop', count: 12345, percentage: 50.2 },
    { device: 'mobile', count: 10234, percentage: 41.7 },
    { device: 'tablet', count: 2001, percentage: 8.1 },
  ]);
  
  const [browserStats, setBrowserStats] = useState<BrowserStat[]>([
    { browser: 'Chrome', count: 14745, percentage: 60.0 },
    { browser: 'Safari', count: 5156, percentage: 21.0 },
    { browser: 'Firefox', count: 2458, percentage: 10.0 },
    { browser: 'Edge', count: 1475, percentage: 6.0 },
    { browser: 'أخرى', count: 746, percentage: 3.0 },
  ]);
  
  const [userStats, setUserStats] = useState<UserStats>({
    registered: 1247,
    guests: 23333,
    newToday: 23,
  });
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, [dateRange]);
  
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };
  
  const maxVisitors = Math.max(...timeStats.map(t => t.visitors));
  
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
                <BarChart3 className="w-6 h-6" />
                إحصائيات الزيارات
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="year">هذا العام</option>
              </select>
              
              <button
                onClick={() => setLoading(true)}
                className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${visitorStats.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {visitorStats.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {Math.abs(visitorStats.change)}%
                  </div>
                </div>
                <p className="text-slate-400 text-sm">إجمالي الزيارات</p>
                <p className="text-3xl font-bold text-white">{visitorStats.total.toLocaleString('ar-SA')}</p>
              </div>
              
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">زيارات اليوم</p>
                <p className="text-3xl font-bold text-white">{visitorStats.today.toLocaleString('ar-SA')}</p>
              </div>
              
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">المستخدمون المسجلون</p>
                <p className="text-3xl font-bold text-white">{userStats.registered.toLocaleString('ar-SA')}</p>
              </div>
              
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <UserX className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">زوار غير مسجلين</p>
                <p className="text-3xl font-bold text-white">{userStats.guests.toLocaleString('ar-SA')}</p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
              <h2 className="text-lg font-bold text-white mb-4">توزيع المستخدمين</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">مسجلون</span>
                    <span className="text-slate-400">{userStats.registered.toLocaleString('ar-SA')}</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${(userStats.registered / (userStats.registered + userStats.guests)) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">غير مسجلين</span>
                    <span className="text-slate-400">{userStats.guests.toLocaleString('ar-SA')}</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                      style={{ width: `${(userStats.guests / (userStats.registered + userStats.guests)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Countries */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    الزيارات حسب الدولة
                  </h2>
                </div>
                
                <div className="p-4">
                  {countryStats.map((country, index) => (
                    <div key={country.code} className="flex items-center gap-4 p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                      <span className="text-2xl">{country.flag}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{country.country}</span>
                          <span className="text-slate-400 text-sm">{country.visitors.toLocaleString('ar-SA')}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm w-12 text-left">{country.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Time Distribution */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    توزيع الزيارات حسب الوقت
                  </h2>
                </div>
                
                <div className="p-4">
                  <div className="h-48 flex items-end gap-1">
                    {timeStats.map((time) => (
                      <div
                        key={time.hour}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer group relative"
                        style={{ height: `${(time.visitors / maxVisitors) * 100}%` }}
                        title={`${time.hour}:00 - ${time.visitors} زائر`}
                      >
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-700 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {time.visitors} زائر
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Devices and Browsers */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              {/* Devices */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-lg font-bold text-white">الأجهزة</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="#334155" strokeWidth="20" />
                        {deviceStats.map((device, index) => {
                          const prevPercentage = deviceStats.slice(0, index).reduce((sum, d) => sum + d.percentage, 0);
                          const circumference = 2 * Math.PI * 70;
                          const colors = ['#3B82F6', '#10B981', '#F59E0B'];
                          
                          return (
                            <circle
                              key={device.device}
                              cx="80"
                              cy="80"
                              r="70"
                              fill="none"
                              stroke={colors[index]}
                              strokeWidth="20"
                              strokeDasharray={`${(device.percentage / 100) * circumference} ${circumference}`}
                              strokeDashoffset={-(prevPercentage / 100) * circumference}
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {deviceStats.map((device, index) => (
                      <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            index === 0 ? 'bg-blue-500/20 text-blue-400' :
                            index === 1 ? 'bg-green-500/20 text-green-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {getDeviceIcon(device.device)}
                          </div>
                          <span className="text-white">
                            {device.device === 'desktop' ? 'كمبيوتر' : device.device === 'mobile' ? 'جوال' : 'تابلت'}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-white font-bold">{device.count.toLocaleString('ar-SA')}</span>
                          <span className="text-slate-400 text-sm mr-2">({device.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Browsers */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-lg font-bold text-white">المتصفحات</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {browserStats.map((browser, index) => (
                    <div key={browser.browser}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white">{browser.browser}</span>
                        <span className="text-slate-400">{browser.percentage}%</span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${browser.percentage}%`,
                            backgroundColor: index === 0 ? '#4285F4' : index === 1 ? '#FF9500' : index === 2 ? '#FF6611' : index === 3 ? '#0078D7' : '#6B7280'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Add missing imports
function UserCheck(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  );
}

function UserX(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="17" y1="11" x2="22" y2="11"/>
    </svg>
  );
}
