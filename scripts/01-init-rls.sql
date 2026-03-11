-- Enable RLS and create a role for authenticated users
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Row Level Security Setup
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Certificate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."UserCertificate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ExamAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."AdminLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Badge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."UserBadge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ContactMessage" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- User Table Policies
-- ============================================
CREATE POLICY user_select_self ON "public"."User" 
  FOR SELECT 
  USING (
    id::text = current_setting('app.current_user_id', true)::text 
    OR current_setting('app.is_admin', true)::boolean = true
  );

CREATE POLICY user_select_public ON "public"."User" 
  FOR SELECT 
  USING (true);

CREATE POLICY user_update_self ON "public"."User" 
  FOR UPDATE 
  USING (
    id::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

CREATE POLICY user_insert_admin ON "public"."User" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY user_delete_admin ON "public"."User" 
  FOR DELETE 
  USING (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- Certificate Table Policies
-- ============================================
CREATE POLICY certificate_select_all ON "public"."Certificate" 
  FOR SELECT 
  USING (true);

CREATE POLICY certificate_insert_admin ON "public"."Certificate" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY certificate_update_admin ON "public"."Certificate" 
  FOR UPDATE 
  USING (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY certificate_delete_admin ON "public"."Certificate" 
  FOR DELETE 
  USING (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- UserCertificate Table Policies
-- ============================================
CREATE POLICY user_certificate_select_own ON "public"."UserCertificate" 
  FOR SELECT 
  USING (
    "userId"::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

CREATE POLICY user_certificate_insert_admin ON "public"."UserCertificate" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY user_certificate_update_admin ON "public"."UserCertificate" 
  FOR UPDATE 
  USING (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- Payment Table Policies
-- ============================================
CREATE POLICY payment_select_own ON "public"."Payment" 
  FOR SELECT 
  USING (
    "userId"::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

CREATE POLICY payment_insert_own ON "public"."Payment" 
  FOR INSERT 
  WITH CHECK (
    "userId"::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

CREATE POLICY payment_update_admin ON "public"."Payment" 
  FOR UPDATE 
  USING (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- ExamAttempt Table Policies
-- ============================================
CREATE POLICY exam_attempt_select_own ON "public"."ExamAttempt" 
  FOR SELECT 
  USING (
    "userId"::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

CREATE POLICY exam_attempt_insert_own ON "public"."ExamAttempt" 
  FOR INSERT 
  WITH CHECK (
    "userId"::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

-- ============================================
-- Notification Table Policies
-- ============================================
CREATE POLICY notification_select_own ON "public"."Notification" 
  FOR SELECT 
  USING (
    "userId"::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

CREATE POLICY notification_insert_admin ON "public"."Notification" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- AdminLog Table Policies
-- ============================================
CREATE POLICY admin_log_select_admin ON "public"."AdminLog" 
  FOR SELECT 
  USING (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY admin_log_insert_admin ON "public"."AdminLog" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- Question Table Policies
-- ============================================
CREATE POLICY question_select_admin ON "public"."Question" 
  FOR SELECT 
  USING (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY question_insert_admin ON "public"."Question" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY question_update_admin ON "public"."Question" 
  FOR UPDATE 
  USING (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- Coupon Table Policies
-- ============================================
CREATE POLICY coupon_select_all ON "public"."Coupon" 
  FOR SELECT 
  USING (true);

CREATE POLICY coupon_insert_admin ON "public"."Coupon" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY coupon_update_admin ON "public"."Coupon" 
  FOR UPDATE 
  USING (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- Badge Table Policies
-- ============================================
CREATE POLICY badge_select_all ON "public"."Badge" 
  FOR SELECT 
  USING (true);

CREATE POLICY badge_insert_admin ON "public"."Badge" 
  FOR INSERT 
  WITH CHECK (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- UserBadge Table Policies
-- ============================================
CREATE POLICY user_badge_select_own ON "public"."UserBadge" 
  FOR SELECT 
  USING (
    "userId"::text = current_setting('app.current_user_id', true)::text
    OR current_setting('app.is_admin', true)::boolean = true
  );

-- ============================================
-- ContactMessage Table Policies
-- ============================================
CREATE POLICY contact_message_select_admin ON "public"."ContactMessage" 
  FOR SELECT 
  USING (current_setting('app.is_admin', true)::boolean = true);

CREATE POLICY contact_message_insert_all ON "public"."ContactMessage" 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY contact_message_update_admin ON "public"."ContactMessage" 
  FOR UPDATE 
  USING (current_setting('app.is_admin', true)::boolean = true);

-- ============================================
-- Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_email ON "public"."User"(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON "public"."User"(role);
CREATE INDEX IF NOT EXISTS idx_user_certificate_user_id ON "public"."UserCertificate"("userId");
CREATE INDEX IF NOT EXISTS idx_user_certificate_certificate_id ON "public"."UserCertificate"("certificateId");
CREATE INDEX IF NOT EXISTS idx_payment_user_id ON "public"."Payment"("userId");
CREATE INDEX IF NOT EXISTS idx_payment_status ON "public"."Payment"(status);
CREATE INDEX IF NOT EXISTS idx_exam_attempt_user_id ON "public"."ExamAttempt"("userId");
CREATE INDEX IF NOT EXISTS idx_exam_attempt_certificate_id ON "public"."ExamAttempt"("certificateId");
CREATE INDEX IF NOT EXISTS idx_notification_user_id ON "public"."Notification"("userId");
CREATE INDEX IF NOT EXISTS idx_admin_log_admin_id ON "public"."AdminLog"("adminId");
CREATE INDEX IF NOT EXISTS idx_user_badge_user_id ON "public"."UserBadge"("userId");
