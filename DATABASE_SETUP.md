# eCertifPro Database Setup Guide

## Overview
This document provides complete instructions for setting up the eCertifPro platform with a production-ready PostgreSQL database, Row-Level Security (RLS), and admin authentication.

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database (Supabase recommended)
- Environment variables configured

## Database Connection

### Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to **Project Settings** → **Database**
3. Copy the connection string: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
4. Set the `DATABASE_URL` environment variable

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database Connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REGION.supabase.co:5432/postgres"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-key-change-in-production"

# Node Environment
NODE_ENV="production"
```

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 2: Update Prisma Schema

The schema has been updated to use PostgreSQL. Verify it's set correctly:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
}
```

### Step 3: Run Database Migrations

```bash
npm run db:generate
npm run db:push
```

### Step 4: Setup RLS and Seed Data

Run the complete setup script:

```bash
npm run db:setup
```

This will:
- Run Prisma migrations
- Apply Row-Level Security policies
- Seed admin and test users
- Create all certificates and badges

Alternatively, manually run the SQL scripts:

```bash
# Apply RLS policies
psql $DATABASE_URL < scripts/01-init-rls.sql

# Seed admin user
psql $DATABASE_URL < scripts/02-seed-admin.sql
```

Then seed with Prisma:

```bash
npm run db:seed
```

## Admin Credentials

After setup, use these credentials to login:

### Admin Account
- **Email**: `admin@ecertif.pro`
- **Password**: `AdminSecure@2024`
- **Role**: Admin (full access)

### Test User
- **Email**: `user@test.com`
- **Password**: `TestUser123`
- **Role**: Regular User

## Security Features

### Row-Level Security (RLS)

The database implements RLS policies that ensure:

- **Users** can only view/edit their own data
- **Admins** can manage all users and content
- **Certificates** are readable by all but only editable by admins
- **Payments** are isolated per user
- **Exam Attempts** are private to the user
- **Admin Logs** are only visible to admins

### Password Security

All passwords are hashed using bcryptjs with 10 salt rounds:

```typescript
const hashedPassword = await bcryptjs.hash(password, 10);
```

### Session Management

Sessions are managed via HTTP-only cookies with 24-hour expiration.

## API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ecertif.pro",
  "password": "AdminSecure@2024"
}

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@ecertif.pro",
    "name": "المشرف العام",
    "role": "admin",
    "level": "خبير",
    "points": 1000
  }
}
```

#### Logout
```
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Database Schema

### Main Tables

1. **User** - User accounts with authentication
2. **Certificate** - Course certificates
3. **UserCertificate** - User certificate records
4. **Payment** - Payment records
5. **ExamAttempt** - Exam attempt history
6. **Question** - Exam questions
7. **Coupon** - Discount coupons
8. **Badge** - Achievement badges
9. **UserBadge** - User earned badges
10. **Notification** - User notifications
11. **AdminLog** - Admin activity logs
12. **ContactMessage** - Contact form submissions

## Development

### Running Locally

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### Database Utilities

```bash
# Generate Prisma client
npm run db:generate

# Create new migration
npm run db:migrate

# Reset database (careful!)
npm run db:reset

# Seed database
npm run db:seed
```

## Production Deployment

### Environment Variables

Ensure these are set in your production environment:

```
DATABASE_URL=your_production_database_url
JWT_SECRET=your_strong_production_secret
NODE_ENV=production
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy using `npm run build && npm start`

## Troubleshooting

### Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Migration Errors

```bash
# Reset and retry
npm run db:reset
npm run db:setup
```

### RLS Policy Issues

Check policy status:
```sql
SELECT * FROM pg_policies;
```

Drop and recreate RLS:
```sql
ALTER TABLE "public"."User" DISABLE ROW LEVEL SECURITY;
psql $DATABASE_URL < scripts/01-init-rls.sql
```

## Support

For issues or questions:
1. Check logs: `npm run dev 2>&1 | tee dev.log`
2. Review Prisma documentation: https://www.prisma.io/docs/
3. Check Supabase docs: https://supabase.com/docs

## License

All rights reserved - eCertifPro
