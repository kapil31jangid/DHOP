# Recent Platform Updates (July 2026)

This document provides a summary of the architectural and feature updates applied to the CureSync platform to enable real-time tracking, unified resource provisioning, automated drawers, and data integrity dropdowns.

---

## 1. Upstream Merge & Sync
- Merged the upstream commits from remote `origin/main` into local `main` to align with the latest backend and database schemas.

---

## 2. Real-Time & Date-Aware Filtering
To solve data persistency issues and ensure stats represent daily real-time metrics, the following modifications were introduced:

### Backend
- **Patients Controller** ([patients.controller.ts](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/backend/src/modules/patients/patients.controller.ts)): Added a `@Query('date')` parameter to `getAll()`. It defaults to today's local date (`YYYY-MM-DD`), filtering results dynamically. If `date=all` is specified, filtering is bypassed.
- **Attendance Controller** ([attendance.controller.ts](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/backend/src/modules/attendance/attendance.controller.ts)): Introduced a `@Query('date')` parameter to `getAll()` to return today's attendance logs by default.

### Frontend
- **Dashboard & Facility Overview**: Updated main KPI labels from "Registered Patients" / "Patients Registered" to "Patients Registered Today" in [dashboard/page.tsx](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/frontend/app/(dashboard)/dashboard/page.tsx) and [facility/page.tsx](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/frontend/app/(dashboard)/facility/page.tsx) to clarify the scope of daily registrations.
- **Date Pickers**: Integrated date-selection toolbars allowing quick swaps between "Today", "All Dates", or specific calendar dates on Patients and Attendance directories.

---

## 3. Unified "Quick Add" Header Dropdown
Implemented a unified **Quick Add** dropdown menu in the header ([app-shell.tsx](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/frontend/components/dhop/app-shell.tsx)):
- Offers instant creation access based on user role:
  - *Provision Doctor/Staff* (District Admin) -> `/users?add=true`
  - *Register Health Centre* (District Admin) -> `/health-centres?add=true`
  - *Register Patient* (District Admin, Facility Admin, Healthcare Staff) -> `/patients?add=true`
  - *Add Medicine Stock* (District Admin, Facility Admin, Healthcare Staff) -> `/medicines?add=true`
  - *Add Bed Unit* (District Admin, Facility Admin, Operations Staff) -> `/beds?add=true`
- **Auto-Open Hook**: Added a client-side `useEffect` on each of these 5 pages to detect the `?add=true` query parameter on mount and automatically pop open the corresponding creation drawer.

---

## 4. Health Centres Read-Access & Layout Fixes
- **Permissions update** ([health-centres.controller.ts](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/backend/src/modules/health-centres/health-centres.controller.ts)): Opened `GET /health-centres` and `GET /health-centres/:id` to other authenticated roles (Facility Admin, Healthcare/Operations Staff) instead of restricting to District Admin only.
- **Secure Scoping**: For non-district admin roles, the endpoints automatically scope return data to the user's assigned `facilityId`. This prevents 403 Forbidden errors, populates active dropdowns, and correctly renders the facility name (instead of "None") on the Users directory table.
- **Hoisting Fix**: Resolved a variable hoisting ReferenceError in the Users page component lifecycle.

---

## 5. Assigned Doctor Dropdown
- **Patients Page** ([patients.page.tsx](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/frontend/app/(dashboard)/patients/page.tsx)): Converted the "Assigned Doctor" plain text field to a `<select>` dropdown.
- **Smart Filtering**: Fetches the list of active staff members with the role `HEALTHCARE_STAFF` or `FACILITY_ADMIN` from the database. It filters the doctors list dynamically to only list staff members assigned to the patient's selected facility.

---

## 6. Ward Location Dropdown
- **Beds Page** ([beds/page.tsx](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/frontend/app/(dashboard)/beds/page.tsx)): Converted the "Ward Location" text input fields (in both the Register and Edit drawers) to a `<select>` dropdown containing standardized clinical ward options (General Male, General Female, ICU, Oxygen Ward, Maternity, Pediatric Ward, and Emergency).
