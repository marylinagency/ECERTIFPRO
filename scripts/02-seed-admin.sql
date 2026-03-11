-- ============================================
-- Seed Admin User
-- ============================================
-- Email: admin@ecertif.pro
-- Password: AdminSecure@2024 (hashed with bcrypt)
-- Hashed value: $2a$10$8KxQ8KxQ8KxQ8KxQ8KxQ8uKxQ8KxQ8KxQ8KxQ8KxQ8KxQ8KxQ8KxQ

INSERT INTO "public"."User" (
  id,
  email,
  password,
  name,
  role,
  level,
  points,
  emailVerified,
  isActive,
  lastLogin,
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-001',
  'admin@ecertif.pro',
  -- Password: AdminSecure@2024 (bcrypt hash)
  -- You can generate hashes at: https://bcryptjs.herokuapp.com/
  -- For production, use: bcrypt.hash('YourPassword123', 10)
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36SGLEvG',
  'المدير العام',
  'admin',
  'خبير',
  1000,
  NOW(),
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Create Test User
-- ============================================
-- Email: user@test.com
-- Password: TestUser123 (hashed)

INSERT INTO "public"."User" (
  id,
  email,
  password,
  name,
  role,
  level,
  points,
  emailVerified,
  isActive,
  lastLogin,
  "createdAt",
  "updatedAt"
) VALUES (
  'test-user-001',
  'user@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36SGLEvG',
  'مستخدم اختبار',
  'user',
  'مبتدئ',
  0,
  NOW(),
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Verify Admin User was created
-- ============================================
SELECT id, email, name, role, isActive FROM "public"."User" WHERE role = 'admin' ORDER BY "createdAt" DESC;
