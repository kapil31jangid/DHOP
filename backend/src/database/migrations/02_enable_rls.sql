-- SQL Migration: 02_enable_rls.sql
-- Description: Enables Row-Level Security (RLS) on all PostgreSQL tables and creates SELECT policies for the 'anon' role to support frontend realtime subscriptions while preventing raw unauthorized mutations.

-- 1. Enable RLS on all tables
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing SELECT policies if any
DROP POLICY IF EXISTS "Allow anon select" ON districts;
DROP POLICY IF EXISTS "Allow anon select" ON health_centres;
DROP POLICY IF EXISTS "Allow anon select" ON users;
DROP POLICY IF EXISTS "Allow anon select" ON patients;
DROP POLICY IF EXISTS "Allow anon select" ON medicines;
DROP POLICY IF EXISTS "Allow anon select" ON beds;
DROP POLICY IF EXISTS "Allow anon select" ON attendance;
DROP POLICY IF EXISTS "Allow anon select" ON reports;
DROP POLICY IF EXISTS "Allow anon select" ON notifications;
DROP POLICY IF EXISTS "Allow anon select" ON audit_logs;
DROP POLICY IF EXISTS "Allow anon select" ON settings;

-- 3. Create SELECT policies for anon role (Frontend Realtime WebSocket client calls)
CREATE POLICY "Allow anon select" ON districts FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON health_centres FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON patients FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON medicines FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON beds FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON attendance FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON reports FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON notifications FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON audit_logs FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select" ON settings FOR SELECT TO anon USING (true);

-- Note: No INSERT, UPDATE, or DELETE policies are defined for the 'anon' role.
-- This effectively blocks all direct data mutation requests from client-side keys.
-- The NestJS backend uses the Supabase 'service_role' key, which bypasses RLS policies automatically.
