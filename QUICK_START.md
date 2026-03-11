# eCertifPro - Quick Start Guide

## 🎯 5-Minute Setup

### Step 1: Set Environment Variable
```bash
# Add to your .env.local or Vercel environment variables:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.dniufjkeuwfcmvgauxdk.supabase.co:5432/postgres
```

### Step 2: Install & Setup
```bash
npm install
npm run db:setup
```

### Step 3: Start Development
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔐 Login Credentials

### Admin Account
- **Email**: `admin@ecertif.pro`
- **Password**: `AdminSecure@2024`

### Test Account
- **Email**: `user@test.com`
- **Password**: `TestUser123`

---

## ✨ What's Included

✅ PostgreSQL Database with RLS  
✅ Admin Authentication System  
✅ 4 Certification Levels  
✅ 7 Achievement Badges  
✅ Exam Questions & Scoring  
✅ Payment Management  
✅ Admin Activity Logging  
✅ User Dashboard  

---

## 📊 Database Features

- **Row-Level Security**: Users see only their data
- **Admin Access**: Full platform management
- **Encrypted Passwords**: Bcrypt hashing
- **Session Management**: 24-hour token expiration
- **Activity Logging**: All admin actions tracked

---

## 🚀 Key Features Ready

1. **Authentication**
   - Login/Logout
   - Session management
   - Admin verification

2. **Certificates**
   - 4 levels of Al-Marjaa Language
   - Pricing: $49-$199
   - Exam questions included

3. **Admin Dashboard**
   - User management
   - Certificate management
   - Payment tracking
   - Activity logs

4. **Security**
   - Password hashing
   - Session cookies
   - RLS policies
   - Admin logging

---

## 📱 API Endpoints

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecertif.pro",
    "password": "AdminSecure@2024"
  }'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout
```

---

## 📝 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Reset database
npm run db:reset

# Seed data again
npm run db:seed

# Generate Prisma client
npm run db:generate

# View database
npm run db:push

# Run linting
npm run lint
```

---

## 🔄 Database Sync

```bash
# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Reset to fresh state
npm run db:reset
```

---

## 🌍 Production Deployment

### Via Vercel:
1. Connect GitHub repository
2. Set `DATABASE_URL` environment variable
3. Deploy with `npm run build && npm start`

### Manual Deployment:
```bash
npm run build
NODE_ENV=production npm start
```

---

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Seed Failed
```bash
# Reset and retry
npm run db:reset
npm run db:setup
```

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

---

## 📚 Full Documentation

- **Database Setup**: See `DATABASE_SETUP.md`
- **Admin Credentials**: See `ADMIN_CREDENTIALS.md`
- **SQL Scripts**: See `scripts/` directory

---

## ✅ Verification Checklist

- [ ] DATABASE_URL set
- [ ] npm install completed
- [ ] npm run db:setup completed
- [ ] npm run dev started
- [ ] Login page loads at localhost:3000
- [ ] Admin login works
- [ ] Dashboard loads

---

## 📞 Need Help?

1. Check logs: `npm run dev 2>&1 | tee dev.log`
2. Verify DATABASE_URL is correct
3. Ensure PostgreSQL connection
4. Review DATABASE_SETUP.md
5. Check Prisma documentation

---

**Ready to go!** 🚀 Your eCertifPro platform is production-ready with:
- Real database (PostgreSQL)
- Secure authentication
- Row-level security
- Admin capabilities
