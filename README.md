# CureSync (DHOP — District Health Operations Platform)

CureSync is a centralized operational hub designed to digitize, monitor, and streamline the daily operations of multiple health centres (Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals) across a district.

---

## 1. What is CureSync?

CureSync (District Health Operations Platform) provides real-time operational visibility for district health administrators and facility managers. Instead of relying on manual paper registers, phone calls, or disjointed spreadsheets, health centres submit their operational parameters directly into CureSync. 

The platform monitors:
*   **Medicine Inventory**: Current stock, low-stock thresholds, batch numbers, and upcoming expiries.
*   **Bed Availability**: Live status of general, ICU, and specialized ward beds.
*   **Staff Attendance**: Daily check-in/out records for doctors, nurses, and operational staff.
*   **Patient Admissions & OPD/IPD registration**: Essential demographic and visit trends.
*   **Audit Logging**: Automatic action logs for all mutations to ensure accountability.

---

## 2. Why CureSync? (The Problem & Solution)

### The Problem
Traditional district health systems suffer from critical information gaps:
1.  **Stockouts**: Critical medicines run out at a PHC before the district store is even notified.
2.  **Referral Delays**: Healthcare staff refer patients to community hospitals without knowing if beds are actually available.
3.  **Absenteeism**: Lack of transparent daily attendance records for doctors and staff in rural centres.
4.  **Delayed Reports**: Compiling monthly reports manually takes weeks, meaning administrative decisions are always reactive rather than proactive.

### The Solution
CureSync digitizes operations at the source. It introduces a role-based structure where facility staff perform rapid daily updates, and district administrators receive immediate warnings about low stock, full beds, and understaffed centres, enabling them to make proactive resource distribution decisions.

---

## 3. How It Works

### High-Level Architecture
```text
                  +--------------------------------+
                  |         React Client           |
                  |     (Next.js 16 App Router)    |
                  +---------------+----------------+
                                  |
            1. Authenticate       |  2. API Requests
            & Verify Tokens       |  (TanStack Query)
                  |               v
      +-----------v----------+   +-----------------+
      |  Firebase Auth SDK   |   |   NestJS API    |
      |                      |   |                 |
      +----------------------+   +--------+--------+
                                          |
                                          | 3. SQL / Realtime
                                          v
                                 +-----------------+
                                 |    Supabase     |
                                 |  (PostgreSQL)   |
                                 +-----------------+
```

### User Roles & Scopes
The platform scopes access control at two distinct levels:
1.  **District Scope (District Admin)**: Can view, compare, and audit all facilities across the entire district.
2.  **Facility Scope (Facility Admin, Healthcare Staff, Operations Staff)**: Read and write permissions are strictly limited to the specific health centre (`facilityId`) they are assigned to.

| Role | Target Users | Key Capabilities |
| :--- | :--- | :--- |
| **District Admin** | District CMOs, officers | View district metrics, compare PHCs/CHCs, export reports, view audit logs |
| **Facility Admin** | Hospital Superintends, MOs | Manage center staff, audit inventory, view facility analytics |
| **Healthcare Staff** | Doctors, Nurses, Pharmacists | Register patients (OPD/IPD), update medicine quantities & batch expiries |
| **Operations Staff** | Ward Managers, Clerks | Record daily staff attendance, update live bed capacity |

---

## 4. Current Development Progress (Completed vs. Pending)

Below is the implementation status of the MVP features as of the current build:

| Component | Feature / Module | Status | Details |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Reusable Component Library | 🟢 Completed | [dhop/ components](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/frontend/components/dhop) (`app-shell.tsx`, `data-table.tsx`, `kpi-card.tsx`, etc.) are built and responsive. |
| **Frontend UI** | Dashboard Layouts & Pages | 🟡 Partially Completed | All 12 page routes (`/dashboard`, `/medicines`, `/beds`, etc.) display beautiful mock tables and statistics, but use static arrays. |
| **Frontend Logic**| State Management & APIs | 🔴 Pending | Hooking up Zustand stores and TanStack Query requests. |
| **Frontend Logic**| Firebase Auth Client | 🔴 Pending | Implementing login forms and redirect routes based on role metadata. |
| **Database** | Schemas & Migrations | 🔴 Pending | Creating tables (`districts`, `health_centres`, `users`, `medicines`, etc.) and setting up foreign keys. |
| **Backend API** | Bootstrapping & Config | 🔴 Pending | Instantiating [main.ts](file:///c:/Users/lenov/OneDrive/Desktop/HARSHIT/build%20with%20ai/CureSync/backend/src/main.ts) & setting up NestJS environment validation. |
| **Backend API** | Firebase Auth Guard | 🔴 Pending | Verifying incoming request Bearer tokens against Firebase Admin SDK. |
| **Backend API** | Business Logic Modules | 🔴 Pending | Implementing controller/service CRUD routers for all 12 modules. |

---

## 5. Local Setup & Execution Guide

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at [http://localhost:3000](http://localhost:3000).

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (refer to `.env.example`).
4. Boot the server:
   ```bash
   npm run start:dev
   ```
