# 01-tech-stack.md

# Frontend Tech Stack & Architecture

> Defines the frontend architecture, libraries, coding standards, and project structure for the District Health Operations Platform (DHOP).

---

# 1. Frontend Stack

| Technology              | Purpose             |
| ----------------------- | ------------------- |
| React 19                | Frontend Framework  |
| TypeScript              | Type Safety         |
| Vite                    | Build Tool          |
| Tailwind CSS            | Styling             |
| shadcn/ui               | UI Components       |
| Lucide React            | Icons               |
| React Router DOM        | Routing             |
| TanStack Query          | Server State        |
| Zustand                 | Global State        |
| React Hook Form         | Forms               |
| Zod                     | Form Validation     |
| TanStack Table          | Data Tables         |
| Recharts                | Charts & Analytics  |
| Sonner                  | Toast Notifications |
| Firebase Authentication | Authentication      |
| Supabase                | Database & Realtime |
| PostgreSQL              | Data Storage        |

---

# 2. Why This Stack?

### React + TypeScript

* Large ecosystem
* AI-friendly
* Easy maintenance
* Strong type safety

---

### Tailwind CSS

* Rapid development
* Consistent UI
* Responsive by default
* Easy customization

---

### shadcn/ui

* Modern UI
* Accessible components
* Fully customizable
* Production-ready

---

### TanStack Query

Used for:

* API calls
* Caching
* Background refresh
* Loading states
* Realtime synchronization

---

### Zustand

Used only for frontend state.

Examples:

* Current User
* Sidebar State
* Theme
* Selected Health Centre
* Notification Drawer

Do NOT store server data here.

---

### React Hook Form + Zod

Used for:

* All Forms
* Validation
* Error Handling

---

# 3. Folder Structure

```text
src/

app/
components/
features/
layouts/
pages/
hooks/
services/
store/
routes/
types/
utils/
constants/
assets/
```

---

# 4. Feature Structure

Each major feature should remain self-contained.

Example:

```text
features/

patients/
medicines/
beds/
attendance/
reports/
notifications/
users/
health-centres/
```

Each feature contains:

```text
feature-name/

components/
pages/
hooks/
services/
types/
schemas/
```

---

# 5. Layout Structure

Three primary layouts.

```text
Auth Layout

Dashboard Layout

Error Layout
```

---

## Auth Layout

Used for

* Login
* Forgot Password
* Reset Password

No Sidebar

---

## Dashboard Layout

Contains

* Sidebar
* Top Navigation
* Page Header
* Main Content
* Notification Panel

Used by every authenticated user.

---

## Error Layout

Used for

* 403
* 404
* Session Expired

---

# 6. Routing Strategy

```text
/

login

/dashboard

/health-centres

/patients

/medicines

/beds

/attendance

/reports

/notifications

/audit-logs

/settings
```

Routes remain identical.

Permissions decide visibility.

---

# 7. Role-Based Access

After login

↓

Firebase Authentication

↓

Get User Profile

↓

Read Role

↓

Redirect

District Admin

Facility Admin

Healthcare Staff

Operations Staff

Unauthorized routes return

403 Forbidden

---

# 8. Data Flow

```text
React Component

↓

TanStack Query

↓

API Service

↓

Supabase

↓

PostgreSQL
```

Never access Supabase directly inside UI components.

Always use service functions.

---

# 9. State Management

## TanStack Query

Use for

* API Data
* Reports
* Tables
* Dashboard Stats
* Health Centres
* Patients

---

## Zustand

Use for

* Sidebar Open/Close
* Current User
* Selected Centre
* UI Preferences
* Notification Drawer

---

## React Hook Form

Use for

Every Form.

---

# 10. Naming Convention

Components

```text
MedicineTable.tsx

PatientCard.tsx

DashboardStats.tsx
```

---

Pages

```text
DashboardPage.tsx

MedicinePage.tsx

AttendancePage.tsx
```

---

Hooks

```text
useMedicines()

usePatients()

useAttendance()
```

---

Services

```text
medicine.service.ts

patient.service.ts

attendance.service.ts
```

---

# 11. Design Rules

Use

* Cards
* Tables
* Status Badges
* Progress Bars
* Drawers
* Dialogs

Avoid

* Nested Modals
* Crowded Pages
* Too Many Charts
* Long Forms

Executive dashboard style.

---

# 12. Theme

Primary

Blue

Success

Green

Warning

Orange

Danger

Red

Neutral

Slate / Gray

Use color only to indicate status.

Avoid decorative gradients across dashboards.

---

# 13. Responsive Breakpoints

Desktop

Primary Target

Laptop

Fully Supported

Tablet

Supported

Mobile

Usable

The application should remain responsive but prioritize desktop experience.

---

# 14. Tables

Every data table should support

* Search
* Sorting
* Pagination
* Filters
* Status Badge
* Empty State
* Loading Skeleton

Optional

Export

---

# 15. Forms

Every form should include

* Validation
* Required Field Indicator
* Cancel Button
* Save Button
* Error Messages
* Success Toast

Never use browser alert dialogs.

---

# 16. Notifications

Use Sonner Toasts for

* Success
* Error
* Warning
* Information

Persistent notifications appear inside the Notification Center.

---

# 17. Loading States

Never leave blank pages.

Use

* Skeleton Loaders
* Spinner (small actions only)
* Disabled Buttons during submission

---

# 18. Error Handling

Show user-friendly messages.

Example

Instead of

> Database Error

Display

> Unable to load medicine inventory. Please try again.

---

# 19. Realtime Strategy

Supabase Realtime will be enabled for:

* Notifications
* Medicine Inventory
* Bed Availability
* Attendance Updates
* Dashboard Statistics

This keeps dashboards synchronized across multiple users.

---

# 20. Future Ready

Architecture should allow future additions without restructuring.

Planned integrations:

* AI Services
* Maps
* Barcode Scanner
* Offline Sync
* Government APIs

Frontend should consume these through service layers only.

---

# 21. Development Principles

* Build reusable components.
* Keep pages lightweight.
* Prefer composition over duplication.
* One responsibility per component.
* Use feature-based architecture.
* Keep UI consistent across all roles.
* Every new module should follow the same structure.

---

# Next Document

**02-authentication.md**

Defines:

* Authentication Flow
* Login UI
* Route Protection
* Role Detection
* Session Management
* User Invitation Flow
* Password Reset
