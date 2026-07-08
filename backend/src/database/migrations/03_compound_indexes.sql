-- SQL Migration: 03_compound_indexes.sql
-- Description: Creates compound indexes on performance-critical query paths (patients and attendance) to optimize facility daily operational lookups.

-- Create compound index for daily patient facility records lookup
CREATE INDEX IF NOT EXISTS idx_patients_facility_visit ON patients(facility_id, visit_date);

-- Create compound index for daily staff attendance records lookup
CREATE INDEX IF NOT EXISTS idx_attendance_facility_date ON attendance(facility_id, date);
