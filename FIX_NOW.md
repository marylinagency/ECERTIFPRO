# إصلاح الأخطاء الحالية

## المشكلات التي تم إصلاحها ✅

### 1. خطأ ExternalLink 
**تم حله**: أضفنا `ExternalLink` import إلى صفحة المؤسس

### 2. الشهادات والأسعار لا تظهر
**السبب**: قاعدة البيانات قد تكون فارغة
**الحل**: تشغيل الخطوات التالية

---

## الخطوات الفورية

### الخطوة 1: تأكد أن DATABASE_URL موجود
```bash
echo $DATABASE_URL
# يجب أن تحصل على: postgresql://postgres:YOUR-PASSWORD@db.dniufjk...
```

### الخطوة 2: تشغيل الـ Migrations
```bash
npx prisma migrate deploy
```

### الخطوة 3: Seed قاعدة البيانات
```bash
npm run db:seed
```

### الخطوة 4: التحقق من الشهادات
```bash
node scripts/check-certificates.js
```

### الخطوة 5: تشغيل الخادم
```bash
npm run dev
```

---

## إذا استمرت المشاكل

### تحقق من الخادم
ستجد أخطاء مفيدة في console:
```
[v0] Error loading certificates: ...
[API] Fetching certificates from database...
```

### أعد تشغيل كل شيء
```bash
# 1. حذف وإنشاء جديد
npx prisma db push --force-reset

# 2. إعادة Seed
npm run db:seed

# 3. تحقق
node scripts/check-certificates.js
```

---

## إذا كانت الشهادات لا تزال لا تظهر

### اختبر الـ API مباشرة
```bash
# اختبر الـ API
curl http://localhost:3000/api/certificates

# يجب أن ترى JSON مثل:
# {
#   "success": true,
#   "data": [
#     { "id": "almarjaa-beginner", "title": "مبتدئ...", "price": 49, ... }
#   ]
# }
```

### إذا لم ترى بيانات في الـ API
- قاعدة البيانات فارغة
- قم بـ `npm run db:seed` مرة أخرى

---

## معلومات مهمة

### بيانات الدخول (بعد Seed)
- **Email**: admin@ecertif.pro
- **Password**: AdminSecure@2024

### الشهادات المتوفرة
1. **مبتدئ** - $49
2. **متوسط** - $99
3. **متقدم** - $149
4. **خبير** - $199

---

## الملفات التي تم تعديلها

✅ `/src/app/founder/page.tsx` - إضافة ExternalLink
✅ `/src/app/page.tsx` - تحسين تحميل الشهادات
✅ `/src/app/api/certificates/route.ts` - تحسين API
✅ `/scripts/check-certificates.js` - جديد: التحقق من الشهادات
✅ `/FIXES_APPLIED.md` - توثيق كامل للإصلاحات

---

**تم الإصلاح! اتبع الخطوات أعلاه وستعود الشهادات مع أسعارها.** 🎓
