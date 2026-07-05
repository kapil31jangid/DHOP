# CureSync — Pending Tasks Implementation Checklist

This checklist details all the components, features, and configurations remaining to complete the CureSync (DHOP) MVP. Use this document to track development progress.

---

## 1. Database Setup (Supabase / PostgreSQL)

- [ ] **SQL Schema Definition**: Create SQL DDL migration scripts to define the tables, data types, primary/foreign keys, and constraints as defined in the data model:
  - `districts` (state, name, status)
  - `health_centres` (district_id, name, type, address, contact)
  - `users` (facility_id, name, email, role, firebase_uid, status)
  - `patients` (facility_id, patient_id_code, name, age, gender, visit_type, disease_category, assigned_doctor, visit_date)
  - `medicines` (facility_id, name, category, batch_number, expiry_date, quantity, threshold)
  - `beds` (facility_id, bed_number, ward, bed_type, status, assigned_patient_id)
  - `attendance` (facility_id, user_id, date, check_in, check_out, status)
  - `reports` (facility_id, report_type, generated_by, generated_at)
  - `notifications` (facility_id, type, title, message, is_read, created_at)
  - `audit_logs` (facility_id, user_id, module, action, description, timestamp)
- [ ] **Database Constraints & Indices**: Add indices for faster search (e.g., indexes on `facility_id` for scoping, `firebase_uid` for authentication lookups).
- [ ] **Seed Data Script**: Write a seed SQL or TS script to populate:
  - Default District (e.g., "Central District")
  - 3-4 Health Centres (combination of PHCs, CHCs, and District Hospitals)
  - Test accounts with different roles (District Admin, Facility Admin, Healthcare Staff, Operations Staff).

---

## 2. Backend API Development (NestJS)

### Bootstrapping & Infrastructure
- [ ] **Application Entrypoint (`main.ts`)**:
  - Enable CORS (restricted to frontend dev server domain).
  - Set global prefix `/api/v1`.
  - Bind global validation (Zod validation pipes).
  - Bind global exception filters (formatting error payloads).
  - Bind global response mapping interceptors (wrapping results in `{ success, data, meta }`).
- [ ] **Environment Validation**: Hook up dotenv validation (`env.validation.ts`) to ensure mandatory variables are present at startup:
  - `PORT`, `NODE_ENV`
  - `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### Common Layer Components
- [ ] **Firebase Authentication Guard (`firebase-auth.guard.ts`)**:
  - Parse the Bearer token from the incoming request's `Authorization` header.
  - Call Firebase Admin SDK (`admin.auth().verifyIdToken()`) to validate.
  - Resolve matching user profile from PostgreSQL by `firebase_uid` and attach user metadata (id, email, role, facilityId) to the Request.
- [ ] **Roles Authorization Guard (`roles.guard.ts`)**:
  - Read `@Roles()` metadata attached to the controller method.
  - Assert if the user's role on the request meets the permission requirement.
- [ ] **Audit Logger Interceptor (`audit-log.interceptor.ts`)**:
  - Intercept modifying REST calls (`POST`, `PATCH`, `PUT`, `DELETE`).
  - Capture details (user ID, facility ID, action type, description) and write to `audit_logs` table asynchronously on request success.

### Domain Controllers & Services (CRUD logic)
Flesh out controllers, services, and repositories (Supabase client interface queries) across the following modules:
- [ ] **`auth`**: Route `POST /auth/me` to load active user session profile; `POST /auth/forgot-password` to trigger password reset emails.
- [ ] **`users`**: CRUD routes for managing facility staff.
- [ ] **`districts`**: Manage and view district metadata.
- [ ] **`health-centres`**: Manage list of registered facilities.
- [ ] **`patients`**: Create, edit, and read patient visit listings.
- [ ] **`medicines`**: Track inventories, update stock, check thresholds.
- [ ] **`beds`**: View list, assign patient, change occupancy status.
- [ ] **`attendance`**: Log daily clock-in/out records.
- [ ] **`reports`**: Trigger, fetch, and list operational reports.
- [ ] **`notifications`**: Fetch and flag alerts.
- [ ] **`audit-logs`**: Fetch history of system changes.
- [ ] **`settings`**: View and edit user configurations.

---

## 3. Frontend Integration (Next.js)

### State Management & Security
- [ ] **Firebase Client Setup**:
  - Configure the Firebase Client Web SDK.
  - Create login form component in `/login` path using standard email/password authentication.
- [ ] **Zustand Authentication Store**:
  - Implement an auth store holding current logged-in user profile, access tokens, loading states, and active facility details.
- [ ] **Protected Routing**:
  - Create client-side guards preventing unauthenticated users from reaching dashboard routes.
  - Automatically redirect users to `/login` if their session token expires.

### Data Fetching & Sync (TanStack Query)
- [ ] **Query Client Setup**: Instantiate the React query client and wrap the top layout shell.
- [ ] **Query Hooks**: Create custom React hooks inside features (e.g., `useMedicines`, `useBeds`, `useAttendance`, `usePatients`) to fetch from the NestJS backend instead of rendering local static arrays.
- [ ] **Dynamic Data Mapping**: Bind response payloads directly to custom dashboard tables and charts.
- [ ] **Supabase Realtime Sync**:
  - Initialize Supabase Realtime client connections.
  - Subscribe to table updates for `beds` and `medicines` to trigger live hot-swaps of UI indicators when occupancy or stock levels fluctuate elsewhere.
- [ ] **Mutation Actions**: Connect form submissions (e.g., "Register Patient", "Update Stock", "Submit Attendance") to mutation queries triggering feedback toasts on completion.
