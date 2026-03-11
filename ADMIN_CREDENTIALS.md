# eCertifPro Admin Credentials & Database Setup

## 🚀 Quick Start

The production database has been fully configured with Row-Level Security (RLS), admin authentication, and test data.

---

## 👨‍💼 Admin Credentials

### Primary Admin Account
```
Email: admin@ecertif.pro
Password: AdminSecure@2024
Role: Administrator
Status: Active
```

### Test User Account
```
Email: user@test.com
Password: TestUser123
Role: Regular User
Status: Active
```

---

## 🗄️ Database Configuration

### Connection Details
- **Provider**: PostgreSQL (Supabase)
- **Host**: db.dniufjkeuwfcmvgauxdk.supabase.co
- **Port**: 5432
- **Database**: postgres
- **Connection String**: `postgresql://postgres:[YOUR-PASSWORD]@db.dniufjkeuwfcmvgauxdk.supabase.co:5432/postgres`

### Environment Variable
```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.dniufjkeuwfcmvgauxdk.supabase.co:5432/postgres
```

---

## 🔒 Security Features Implemented

### ✅ Row-Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admins have full access
- Questions visible only to admins
- Admin logs secured

### ✅ Password Security
- Bcrypt hashing with 10 salt rounds
- All passwords encrypted in database
- Strong password validation
- Session management with HTTP-only cookies

### ✅ Authentication
- Login/Logout endpoints secured
- Session tokens with 24-hour expiration
- Admin action logging
- IP address and user agent tracking

---

## 📊 Database Tables Created

| Table | Purpose | Records |
|-------|---------|---------|
| User | User accounts | 2 (admin + test) |
| Certificate | Course certificates | 4 levels |
| UserCertificate | User certificate records | - |
| Payment | Payment transactions | - |
| ExamAttempt | Exam history | - |
| Question | Exam questions | ~100 |
| Coupon | Discount codes | - |
| Badge | Achievement badges | 7 badges |
| UserBadge | User earned badges | - |
| Notification | User notifications | - |
| AdminLog | Admin activity logs | - |
| ContactMessage | Contact submissions | - |

---

## 🎓 Available Certificates

1. **مبتدئ لغة المرجع** (Al-Marjaa Beginner)
   - Price: $49 (originally $99)
   - Duration: 2 weeks
   - Questions: 20
   - Passing Score: 60%

2. **مطور لغة المرجع** (Al-Marjaa Developer)
   - Price: $99 (originally $199)
   - Duration: 4 weeks
   - Questions: 30
   - Passing Score: 70%

3. **خبير لغة المرجع** (Al-Marjaa Expert)
   - Price: $149 (originally $299)
   - Duration: 6 weeks
   - Questions: 40
   - Passing Score: 75%

4. **محترف لغة المرجع** (Al-Marjaa Professional)
   - Price: $199 (originally $399)
   - Duration: 8 weeks
   - Questions: 50
   - Passing Score: 80%

---

## 🏆 Available Badges

- البداية (First Steps)
- المتعلم (Learner)
- الخبير (Expert)
- شامل المستويات (Level Master)
- الدرجة الكاملة (Perfect Score)
- سريع الإنجاز (Speed Achiever)
- رائد المرجع (Al-Marjaa Pioneer)

---

## 🔌 API Endpoints

### Authentication

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ecertif.pro",
  "password": "AdminSecure@2024"
}
```

**Logout**
```
POST /api/auth/logout
```

---

## 📋 Migration Scripts

Two SQL scripts have been created:

### 1. `scripts/01-init-rls.sql`
- Enables Row-Level Security on all tables
- Creates security policies for data access control
- Adds performance indexes
- ~233 lines

### 2. `scripts/02-seed-admin.sql`
- Seeds admin user account
- Seeds test user account
- Can be run manually or via script

---

## ⚙️ Setup Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Run complete setup (RLS + seeding)
npm run db:setup

# Or manually seed
npm run db:seed
```

---

## 🚀 Running the Application

```bash
# Development
npm run dev
# App runs on http://localhost:3000

# Production build
npm run build
npm start
```

---

## 🔑 Important Notes

### ⚠️ Before Production:

1. **Change JWT_SECRET** in environment variables
2. **Change Admin Password** - Use the admin panel to change password
3. **Enable HTTPS** - Required for production
4. **Set up email** - Configure SMTP for notifications
5. **Configure backups** - Set up database backups
6. **Update security headers** - Add CSP, X-Frame-Options, etc.

### 🔐 Security Best Practices:

1. Never commit credentials to git
2. Use environment variables for all secrets
3. Enable database backups
4. Monitor admin logs regularly
5. Use strong, unique passwords
6. Enable 2FA when available
7. Keep dependencies updated

---

## 📞 Support & Documentation

- **Prisma Docs**: https://www.prisma.io/docs/
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## ✨ Next Steps

1. ✅ Database is ready
2. ✅ Admin account created
3. ✅ Security policies configured
4. ✅ Test data seeded

### To Use the Platform:

1. Start development server: `npm run dev`
2. Log in with admin credentials
3. Navigate to admin dashboard
4. Manage certificates, users, and payments
5. Create exam questions
6. Monitor user activity

---

## 📝 Summary

| Item | Status | Details |
|------|--------|---------|
| Database | ✅ Ready | PostgreSQL with RLS |
| Admin Account | ✅ Created | admin@ecertif.pro / AdminSecure@2024 |
| Test User | ✅ Created | user@test.com / TestUser123 |
| Certificates | ✅ Seeded | 4 Al-Marjaa levels |
| Badges | ✅ Created | 7 achievement badges |
| Security | ✅ Enabled | RLS + Bcrypt + Session Auth |
| API Endpoints | ✅ Ready | Login/Logout endpoints |
| Documentation | ✅ Complete | Full setup guide provided |

---

**Last Updated**: 2024
**Platform**: eCertifPro - Certification Management System
