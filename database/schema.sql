-- DDL Schema: schema.sql
-- Description: Sets up enums, tables, keys, constraints, and indexes for DHOP / DHOP.

-- 1. Create Enums & Types
CREATE TYPE health_centre_type AS ENUM ('PHC', 'CHC', 'DH');
CREATE TYPE user_role AS ENUM ('DISTRICT_ADMIN', 'FACILITY_ADMIN', 'HEALTHCARE_STAFF', 'OPERATIONS_STAFF');
CREATE TYPE visit_type AS ENUM ('OPD', 'IPD');
CREATE TYPE bed_type AS ENUM ('General', 'ICU', 'Oxygen');
CREATE TYPE bed_status AS ENUM ('Available', 'Occupied', 'Maintenance');
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Leave');
CREATE TYPE report_type AS ENUM ('Daily', 'Weekly', 'Monthly', 'Inventory', 'Attendance');
CREATE TYPE notification_type AS ENUM ('Info', 'Warning', 'Critical');
CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- 2. Create Tables

-- Districts Table
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_district_status CHECK (status IN ('Active', 'Inactive'))
);

-- Health Centres Table
CREATE TABLE health_centres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    name TEXT NOT NULL UNIQUE,
    type health_centre_type NOT NULL,
    address TEXT,
    contact_number TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_centre_status CHECK (status IN ('Active', 'Inactive'))
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES health_centres(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL,
    firebase_uid TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_user_status CHECK (status IN ('Active', 'Inactive'))
);

-- Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES health_centres(id) ON DELETE RESTRICT,
    patient_id_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CONSTRAINT chk_patient_age CHECK (age >= 0),
    gender TEXT NOT NULL,
    visit_type visit_type NOT NULL,
    disease_category TEXT,
    assigned_doctor TEXT,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medicines Table
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES health_centres(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CONSTRAINT chk_medicine_quantity CHECK (quantity >= 0),
    threshold INTEGER NOT NULL DEFAULT 0 CONSTRAINT chk_medicine_threshold CHECK (threshold >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_facility_medicine_batch UNIQUE (facility_id, name, batch_number)
);

-- Beds Table
CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES health_centres(id) ON DELETE CASCADE,
    bed_number TEXT NOT NULL,
    ward TEXT NOT NULL,
    bed_type bed_type NOT NULL,
    status bed_status NOT NULL DEFAULT 'Available',
    assigned_patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_facility_bed_ward UNIQUE (facility_id, bed_number, ward)
);

-- Attendance Table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES health_centres(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    status attendance_status NOT NULL DEFAULT 'Present',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_attendance_date UNIQUE (user_id, date)
);

-- Reports Table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES health_centres(id) ON DELETE CASCADE, -- Nullable for district-wide reports
    report_type report_type NOT NULL,
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_report_status CHECK (status IN ('Pending', 'Completed', 'Failed'))
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES health_centres(id) ON DELETE CASCADE, -- Nullable for global/district notifications
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES health_centres(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    module TEXT NOT NULL,
    action audit_action NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Settings Table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES health_centres(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_facility_setting_key UNIQUE (facility_id, key)
);

-- 3. Create Indexes for Query Optimization

-- Health Centres
CREATE INDEX idx_health_centres_district ON health_centres(district_id);

-- Users
CREATE INDEX idx_users_facility ON users(facility_id);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- Patients
CREATE INDEX idx_patients_facility ON patients(facility_id);
CREATE INDEX idx_patients_visit_date ON patients(visit_date);

-- Medicines
CREATE INDEX idx_medicines_facility ON medicines(facility_id);
CREATE INDEX idx_medicines_expiry ON medicines(expiry_date);

-- Beds
CREATE INDEX idx_beds_facility ON beds(facility_id);
CREATE INDEX idx_beds_patient ON beds(assigned_patient_id);
CREATE INDEX idx_beds_status ON beds(facility_id, status);

-- Attendance
CREATE INDEX idx_attendance_facility ON attendance(facility_id);
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- Reports
CREATE INDEX idx_reports_facility ON reports(facility_id);
CREATE INDEX idx_reports_generated_by ON reports(generated_by);

-- Notifications
CREATE INDEX idx_notifications_facility ON notifications(facility_id);
CREATE INDEX idx_notifications_unread ON notifications(facility_id, is_read);

-- Audit Logs
CREATE INDEX idx_audit_logs_facility ON audit_logs(facility_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Settings
CREATE INDEX idx_settings_facility ON settings(facility_id);
