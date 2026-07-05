-- DML Seed Data: seed_data.sql
-- Description: Seeds the database with 1 District, 4 Health Centres, role-based users, patients, beds, medicines, attendance logs, and notifications.

-- Disable triggers temporarily if needed, but not necessary for fresh inserts.
-- Delete any existing records to allow re-seeding (optional, but good for clean state)
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE attendance CASCADE;
TRUNCATE TABLE beds CASCADE;
TRUNCATE TABLE medicines CASCADE;
TRUNCATE TABLE patients CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE health_centres CASCADE;
TRUNCATE TABLE districts CASCADE;

-- 1. Insert District (1 District)
INSERT INTO districts (id, name, state, status) VALUES
('d74f2603-4b62-436d-9276-f831b64227f4', 'Central District', 'Bihar', 'Active');

-- 2. Insert Health Centres (4 Centres)
INSERT INTO health_centres (id, district_id, name, type, address, contact_number, status) VALUES
('a1111111-1111-1111-1111-111111111111', 'd74f2603-4b62-436d-9276-f831b64227f4', 'PHC Rampur', 'PHC', 'Rampur Main Road, Ward 4', '+91 98765 43210', 'Active'),
('a2222222-2222-2222-2222-222222222222', 'd74f2603-4b62-436d-9276-f831b64227f4', 'CHC Sundarpur', 'CHC', 'Sundarpur Block Complex', '+91 98765 43211', 'Active'),
('a3333333-3333-3333-3333-333333333333', 'd74f2603-4b62-436d-9276-f831b64227f4', 'CHC Bhairavi', 'CHC', 'Bhairavi Crossing Highway', '+91 98765 43212', 'Active'),
('a4444444-4444-4444-4444-444444444444', 'd74f2603-4b62-436d-9276-f831b64227f4', 'PHC Lakshmi Nagar', 'PHC', 'Lakshmi Nagar Market area', '+91 98765 43213', 'Active');

-- 3. Insert Users (District Admin, Facility Admins, Staff)
INSERT INTO users (id, facility_id, name, email, role, firebase_uid, status) VALUES
-- District Admin (no facility_id)
('u0000000-0000-0000-0000-000000000000', NULL, 'Dr. Rajendra Prasad', 'district.admin@curesync.gov.in', 'DISTRICT_ADMIN', 'fb-uid-district-admin', 'Active'),

-- PHC Rampur Users
('u1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Dr. Ramesh Sharma', 'admin.rampur@curesync.gov.in', 'FACILITY_ADMIN', 'fb-uid-admin-rampur', 'Active'),
('u1111111-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Dr. S. Verma', 'staff.healthcare.rampur@curesync.gov.in', 'HEALTHCARE_STAFF', 'fb-uid-staff-healthcare-rampur', 'Active'),
('u1111111-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Amit Kumar', 'staff.ops.rampur@curesync.gov.in', 'OPERATIONS_STAFF', 'fb-uid-staff-ops-rampur', 'Active'),

-- CHC Sundarpur Users
('u2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Dr. Sunita Patil', 'admin.sundarpur@curesync.gov.in', 'FACILITY_ADMIN', 'fb-uid-admin-sundarpur', 'Active'),
('u2222222-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'Suresh Bind', 'staff.ops.sundarpur@curesync.gov.in', 'OPERATIONS_STAFF', 'fb-uid-staff-ops-sundarpur', 'Active'),

-- CHC Bhairavi Users
('u3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Dr. Prem Kumar', 'admin.bhairavi@curesync.gov.in', 'FACILITY_ADMIN', 'fb-uid-admin-bhairavi', 'Active'),

-- PHC Lakshmi Nagar Users
('u4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'Dr. Neha Gupta', 'admin.lakshmi@curesync.gov.in', 'FACILITY_ADMIN', 'fb-uid-admin-lakshmi', 'Active');

-- 4. Insert Patients
INSERT INTO patients (id, facility_id, patient_id_code, name, age, gender, visit_type, disease_category, assigned_doctor, visit_date) VALUES
-- Patients in PHC Rampur
('p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'PT-1042', 'Ramesh Kumar', 46, 'Male', 'OPD', 'Hypertension', 'Dr. S. Verma', CURRENT_DATE),
('p1111111-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'PT-1040', 'Arjun Yadav', 8, 'Male', 'OPD', 'Fever / Viral', 'Dr. T. Roy', CURRENT_DATE),

-- Patients in CHC Sundarpur
('p2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'PT-1041', 'Sunita Devi', 34, 'Female', 'IPD', 'Maternity', 'Dr. P. Singh', CURRENT_DATE),

-- Patients in PHC Lakshmi Nagar
('p4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'PT-1039', 'Meena Kumari', 61, 'Female', 'IPD', 'Diabetes', 'Dr. S. Verma', CURRENT_DATE - 1);

-- 5. Insert Medicines
INSERT INTO medicines (id, facility_id, name, category, batch_number, expiry_date, quantity, threshold) VALUES
-- PHC Rampur Medicines
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'Paracetamol 500mg', 'Analgesic', 'P-802', CURRENT_DATE + 365, 80, 200), -- Critical Alert (Quantity < Threshold)
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'Amoxicillin 250mg', 'Antibiotic', 'A-102', CURRENT_DATE + 180, 500, 100),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'Ibuprofen 400mg', 'Analgesic', 'I-304', CURRENT_DATE + 90, 450, 150),

-- CHC Sundarpur Medicines
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'Paracetamol 500mg', 'Analgesic', 'P-803', CURRENT_DATE + 300, 1200, 300),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'Amoxicillin 500mg', 'Antibiotic', 'A-204', CURRENT_DATE + 7, 340, 150), -- Warning: Expiring soon

-- CHC Bhairavi Medicines
(gen_random_uuid(), 'a3333333-3333-3333-3333-333333333333', 'Metformin 500mg', 'Antidiabetic', 'M-401', CURRENT_DATE + 270, 800, 200),

-- PHC Lakshmi Nagar Medicines
(gen_random_uuid(), 'a4444444-4444-4444-4444-444444444444', 'Amlodipine 5mg', 'Antihypertensive', 'AD-501', CURRENT_DATE + 400, 1200, 200);

-- 6. Insert Beds (20 per PHC, 40 per CHC)
-- Seed a selection of beds for PHC Rampur (Facility 1)
INSERT INTO beds (id, facility_id, bed_number, ward, bed_type, status, assigned_patient_id) VALUES
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'B-101', 'General Male', 'General', 'Available', NULL),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'B-102', 'General Male', 'General', 'Available', NULL),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'B-103', 'General Female', 'General', 'Available', NULL),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'B-104', 'ICU', 'ICU', 'Available', NULL),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'B-105', 'Oxygen Ward', 'Oxygen', 'Available', NULL);

-- Seed a selection of beds for CHC Sundarpur (Facility 2)
-- Sunita Devi (p2222222-2222-2222-2222-222222222222) occupies B-201 in Maternity ward
INSERT INTO beds (id, facility_id, bed_number, ward, bed_type, status, assigned_patient_id) VALUES
('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'B-201', 'Maternity', 'General', 'Occupied', 'p2222222-2222-2222-2222-222222222222'),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'B-202', 'Maternity', 'General', 'Available', NULL),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'B-203', 'ICU', 'ICU', 'Maintenance', NULL),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'B-204', 'General Male', 'General', 'Available', NULL);

-- Seed a selection of beds for PHC Lakshmi Nagar (Facility 4)
-- Meena Kumari (p4444444-4444-4444-4444-444444444444) occupies B-401 in General Female ward
INSERT INTO beds (id, facility_id, bed_number, ward, bed_type, status, assigned_patient_id) VALUES
('b4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'B-401', 'General Female', 'General', 'Occupied', 'p4444444-4444-4444-4444-444444444444'),
(gen_random_uuid(), 'a4444444-4444-4444-4444-444444444444', 'B-402', 'General Female', 'General', 'Available', NULL);

-- 7. Insert Attendance (Today's check-ins)
INSERT INTO attendance (id, facility_id, user_id, date, check_in, check_out, status) VALUES
-- Rampur Staff: Dr. Ramesh Sharma, Dr. S. Verma check in
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', CURRENT_DATE, '09:00:00', NULL, 'Present'),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'u1111111-2222-2222-2222-222222222222', CURRENT_DATE, '08:45:00', NULL, 'Present'),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'u1111111-3333-3333-3333-333333333333', CURRENT_DATE, '09:15:00', NULL, 'Present'),

-- Sundarpur Staff
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', CURRENT_DATE, '09:05:00', NULL, 'Present'),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'u2222222-3333-3333-3333-333333333333', CURRENT_DATE, NULL, NULL, 'Absent'); -- Absent today

-- 8. Insert Notifications
INSERT INTO notifications (id, facility_id, type, title, message, is_read) VALUES
-- District Warning
(gen_random_uuid(), NULL, 'Warning', 'System database maintenance', 'CureSync system database will undergo maintenance at 11:59 PM today.', false),

-- PHC Rampur Notification: Medicine running low
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'Critical', 'Paracetamol 500mg below threshold', 'PHC Rampur stock for Paracetamol 500mg is currently 80, which is below the threshold of 200.', false),

-- CHC Sundarpur Notification: Medicine expiring soon
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'Warning', 'Amoxicillin batch A-204 expiring soon', 'Amoxicillin 500mg (Batch A-204) expires in 7 days on ' || (CURRENT_DATE + 7)::TEXT, false);

-- 9. Seed Audit Logs
INSERT INTO audit_logs (id, facility_id, user_id, module, action, description, timestamp) VALUES
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'auth', 'CREATE', 'User admin.rampur@curesync.gov.in logged in successfully.', now() - INTERVAL '1 hour'),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'u1111111-3333-3333-3333-333333333333', 'attendance', 'CREATE', 'Daily attendance marked for operations staff Amit Kumar.', now() - INTERVAL '30 minutes');
