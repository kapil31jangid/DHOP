# Platform Updates — July 8, 2026

> **Total Commits Today**: 13  
> **Branch**: `main`  
> **Repository**: [Harshitagarwal113/CureSync](https://github.com/Harshitagarwal113/CureSync)

This document is a comprehensive changelog of all architectural, feature, security, and UI/UX updates applied to the CureSync (DHOP) platform on July 8, 2026.

---

## 1. Module Access Fix

**Commit**: `4f97e11`

- Resolved a permission misconfiguration that prevented non-admin roles from accessing certain module endpoints.

---

## 2. Real-Time & Date-Aware Filtering

**Commit**: `c11b903`

### Backend
- **Patients Controller** ([patients.controller.ts](../backend/src/modules/patients/patients.controller.ts)): Added a `@Query('date')` parameter to `getAll()`. Defaults to today's local date (`YYYY-MM-DD`), filtering results dynamically. Pass `date=all` to bypass.
- **Attendance Controller** ([attendance.controller.ts](../backend/src/modules/attendance/attendance.controller.ts)): Added a `@Query('date')` parameter to `getAll()` to return today's attendance logs by default.

### Frontend
- **Dashboard & Facility Overview**: Updated KPI labels to "Patients Registered Today" in both [dashboard/page.tsx](../frontend/app/(dashboard)/dashboard/page.tsx) and [facility/page.tsx](../frontend/app/(dashboard)/facility/page.tsx).
- **Date Pickers**: Integrated date-selection toolbars on the Patients and Attendance directories, allowing quick toggling between "Today", "All Dates", or a specific calendar date.

---

## 3. Unified "Quick Add" Header Dropdown

**Commit**: `aa6907c`

Implemented a unified **Quick Add** dropdown menu in [app-shell.tsx](../frontend/components/dhop/app-shell.tsx):
- Role-based quick-creation links:
  - *Provision Doctor/Staff* (District Admin) → `/users?add=true`
  - *Register Health Centre* (District Admin) → `/health-centres?add=true`
  - *Register Patient* (District/Facility Admin, Healthcare Staff) → `/patients?add=true`
  - *Add Medicine Stock* (District/Facility Admin, Healthcare Staff) → `/medicines?add=true`
  - *Add Bed Unit* (District/Facility Admin, Operations Staff) → `/beds?add=true`
- **Auto-Open Hook**: Each target page detects `?add=true` and auto-opens the creation drawer.

### Health Centres Scope Permissions
- Opened `GET /health-centres` to all authenticated roles (scoped to their `facilityId`) in [health-centres.controller.ts](../backend/src/modules/health-centres/health-centres.controller.ts).
- Fixed a variable hoisting `ReferenceError` in [users/page.tsx](../frontend/app/(dashboard)/users/page.tsx).

---

## 4. Assigned Doctor Dropdown

**Commit**: `5fae203`

- Converted "Assigned Doctor" from a plain text input to a `<select>` dropdown in [patients/page.tsx](../frontend/app/(dashboard)/patients/page.tsx).
- The dropdown dynamically queries staff members (`HEALTHCARE_STAFF` / `FACILITY_ADMIN`) from the database, filtered by the patient's selected facility.

---

## 5. Ward Location Dropdown

**Commit**: `5fae203`

- Converted the "Ward Location" text field on [beds/page.tsx](../frontend/app/(dashboard)/beds/page.tsx) (both Register and Edit drawers) to a `<select>` dropdown with standardized ward options: General Male, General Female, ICU, Oxygen Ward, Maternity, Pediatric Ward, and Emergency.

---

## 6. Release Documentation

**Commit**: `052dc47`

- Created the initial version of this document inside the `docs/` folder.

---

## 7. Row-Level Security (RLS) Enablement

**Commit**: `33b3dec`

- **Migration Script**: Created [02_enable_rls.sql](../backend/src/database/migrations/02_enable_rls.sql) that enables RLS on all 11 core database tables.
- **SELECT Policies**: Defined explicit `SELECT` policies for the `anon` role so the frontend Supabase client can continue receiving WebSocket push events.
- **Write Restriction**: No `INSERT`, `UPDATE`, or `DELETE` policies are defined for `anon`, effectively blocking all direct mutations from client-side keys. All writes are funneled through the NestJS backend using the `service_role` key.

---

## 8. Interactive SVG Analytics Charts

**Commit**: `6500a91`

- Created a custom, lightweight, responsive SVG charting component: [analytics-chart.tsx](../frontend/components/dhop/analytics-chart.tsx).
  - Supports **line** and **bar** chart types.
  - Features: linear gradient fills, hovering tooltip indicators, animated dot transitions, responsive viewBox scaling, and clean grid axes.
- **District Dashboard** ([dashboard/page.tsx](../frontend/app/(dashboard)/dashboard/page.tsx)): Embedded a 7-day Patient Registrations Trend line chart.
- **Facility Dashboard** ([facility/page.tsx](../frontend/app/(dashboard)/facility/page.tsx)): Embedded a 7-day Patient Registrations Trend line chart.

---

## 9. Database Compound Index Optimization

**Commit**: `6500a91`

- Created [03_compound_indexes.sql](../backend/src/database/migrations/03_compound_indexes.sql) with two compound indexes:
  - `idx_patients_facility_visit` on `patients(facility_id, visit_date)`
  - `idx_attendance_facility_date` on `attendance(facility_id, date)`
- These accelerate the most common daily lookup queries as data volume grows.

---

## 10. Real-Time Critical Inventory Alerts

**Commit**: `6500a91`

- Updated [use-realtime-sync.ts](../frontend/hooks/use-realtime-sync.ts) to monitor `INSERT` and `UPDATE` events on the `medicines` table.
- If a medicine's `quantity` drops at or below its `threshold`, an urgent warning toast notification fires instantly across all connected dashboards:
  > `Critical Inventory Alert: [Medicine Name] is running below threshold ([quantity] remaining)`

---

## 11. Extended Operational Analytics

**Commits**: `aec12e6`, `e826e79`

### District Dashboard — 4-Chart Telemetry Grid
1. **Patient Registrations Trend (Last 7 Days)** — Line chart
2. **Bed Utilization by Facility (%)** — Bar chart showing occupied vs total beds per health centre
3. **Medicine Shortages by Facility** — Bar chart counting medicines below threshold at each centre
4. **Staff Attendance Rate Today (%)** — Bar chart showing checked-in staff vs total assigned staff per centre

### Facility Dashboard — 2-Chart Telemetry Grid
1. **Patient Registrations Trend (Last 7 Days)** — Line chart
2. **Critical Medicine Stock Levels** — Bar chart of the 5 lowest-stocked medicines

---

## 12. Dark Mode (Added & Reverted)

**Commits**: `6500a91`, `09f4d1f`, `b0eeed6`

- Implemented a complete dark mode theme system with slate-based CSS variables under `.dark` and a Sun/Moon toggle button in the header.
- After testing, the dark mode feature was **reverted by user request**. The `.dark` CSS block, the `@variant dark` directive, and the header toggle button were all removed.

---

## 13. Chart Layout & Spacing Fixes

**Commits**: `340e7bc`, `da4787a`

- Reduced default chart height from `240px` → `220px` for a more compact dashboard.
- Fixed a critical layout collapse bug where bar charts clipped at the edges. Root cause: bars were using line-chart edge-to-edge point spacing. Fixed by distributing bars evenly in centered columns.
- Added `minHeight` constraints on the SVG wrapper and SVG element to prevent vertical collapse.
- Capped maximum bar width at `28px` to prevent oversized bars on small datasets.
- Adjusted card padding from `p-6` → `p-4` and title sizing from `text-sm` → `text-xs` for tighter, cleaner chart cards.

---

## Files Modified / Created Today

### New Files
| File | Purpose |
|------|---------|
| `backend/src/database/migrations/02_enable_rls.sql` | RLS enablement + anon SELECT policies |
| `backend/src/database/migrations/03_compound_indexes.sql` | Compound indexes for performance |
| `frontend/components/dhop/analytics-chart.tsx` | Reusable SVG line/bar charting component |

### Modified Files
| File | Changes |
|------|---------|
| `backend/src/modules/patients/patients.controller.ts` | Date query filter parameter |
| `backend/src/modules/attendance/attendance.controller.ts` | Date query filter parameter |
| `backend/src/modules/health-centres/health-centres.controller.ts` | Opened read access to all roles |
| `frontend/components/dhop/app-shell.tsx` | Quick Add dropdown |
| `frontend/app/(dashboard)/dashboard/page.tsx` | KPI labels, 4 analytics charts, users query |
| `frontend/app/(dashboard)/facility/page.tsx` | KPI labels, 2 analytics charts, medicine stock data |
| `frontend/app/(dashboard)/patients/page.tsx` | Doctor dropdown, date picker, auto-add hook |
| `frontend/app/(dashboard)/beds/page.tsx` | Ward location dropdown, auto-add hook |
| `frontend/app/(dashboard)/users/page.tsx` | Hoisting fix, auto-add hook |
| `frontend/hooks/use-realtime-sync.ts` | Critical inventory toast alerts |
| `frontend/app/globals.css` | Theme variable cleanup |
| `docs/11-recent-updates.md` | This document |
