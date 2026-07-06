# Role-Based Access Control (RBAC) & Operations Guide

This document outlines the **Role-Based Access Control (RBAC)** architecture of the **DHOP (District Health Operations Platform)**. It specifies the access bounds, UI controls, and API endpoint scopes for all user roles.

---

## 📋 High-Level Permission Matrix

| Functional Module | Operations | District Admin (`DISTRICT_ADMIN`) | Facility Admin (`FACILITY_ADMIN`) | Healthcare Staff (`HEALTHCARE_STAFF`) | Operations Staff (`OPERATIONS_STAFF`) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Dashboard** | View Aggregated District KPIs | **🟢 YES** | 🔴 NO | 🔴 NO | 🔴 NO |
| | View Local Facility Metrics | **🟢 YES** | **🟢 YES** | **🟢 YES** | **🟢 YES** |
| **Health Centres** | View Centres List / Profiles | **🟢 YES** | 🔴 NO | 🔴 NO | 🔴 NO |
| | Create / Edit Health Centres | **🟢 YES** (Exclusive) | 🔴 NO | 🔴 NO | 🔴 NO |
| **Patients** | View Patient Records | **🟢 YES** (District-wide) | **🟢 YES** (Local PHC) | **🟢 YES** (Local PHC) | 🔴 NO |
| | Register / Update Patients | **🟢 YES** | **🟢 YES** | **🟢 YES** | 🔴 NO |
| | Delete Patient Profile | 🔴 NO | **🟢 YES** | 🔴 NO | 🔴 NO |
| **Medicines** | View Stock Inventory | **🟢 YES** (District-wide) | **🟢 YES** (Local PHC) | **🟢 YES** (Local PHC) | 🔴 NO |
| | Stock Intake / Quantity Adjust | 🔴 NO | **🟢 YES** | **🟢 YES** | 🔴 NO |
| | Remove Medicine Record | 🔴 NO | **🟢 YES** | 🔴 NO | 🔴 NO |
| **Beds** | View Bed Occupancy Status | **🟢 YES** (District-wide) | **🟢 YES** (Local PHC) | 🔴 NO | **🟢 YES** (Local PHC) |
| | Register / Edit Beds / Assigns | 🔴 NO | **🟢 YES** | 🔴 NO | **🟢 YES** |
| | Delete Bed Record | 🔴 NO | **🟢 YES** | 🔴 NO | 🔴 NO |
| **Attendance** | View Attendance Registers | **🟢 YES** (District-wide) | **🟢 YES** (Local PHC) | 🔴 NO | **🟢 YES** (Local PHC) |
| | Log Check-In/Check-Out | 🔴 NO | **🟢 YES** | 🔴 NO | **🟢 YES** |
| **Reports** | View Generated PDF Reports | **🟢 YES** (District-wide) | **🟢 YES** (Local PHC) | **🟢 YES** (Local PHC) | **🟢 YES** (Local PHC) |
| | Compile/Generate PDF Reports | **🟢 YES** | **🟢 YES** | 🔴 NO | 🔴 NO |
| **Users** | View User Directory | **🟢 YES** (District-wide) | **🟢 YES** (Local PHC) | 🔴 NO | 🔴 NO |
| | Register / Modify Accounts | **🟢 YES** (Exclusive) | 🔴 NO | 🔴 NO | 🔴 NO |
| **Audit Logs** | View System Operation History | **🟢 YES** (Exclusive) | 🔴 NO | 🔴 NO | 🔴 NO |
| **Settings** | Configure Alert Thresholds | **🟢 YES** | **🟢 YES** | 🔴 NO | 🔴 NO |

---

## 👤 Detailed Role Specifications & Workflows

### 1. District Admin (`DISTRICT_ADMIN`)
* **Role Summary**: High-level administrative auditor and coordinator representing the District Health Authority (e.g. CMO or DM Office).
* **Workspaces & Scope**: Has unrestricted access to **all facilities** in the district.
* **Key Features**:
  * **Unified District Dashboard**: Displays real-time consolidated numbers (e.g., active centers, combined bed occupancy rate, critical low stock counts, and check-in roster metrics across the entire district).
  * **System Control & Provisioning**: The only role allowed to onboard new health centres or create accounts for facility managers and clinicians.
  * **System Integrity Audits**: Monopolizes access to **Audit Logs** to monitor security threats or account manipulations.
  * **Global Settings**: Fine-tunes default threshold settings for the district.

> [!NOTE]
> Since District Admins are not bound to a single facility on onboarding, their registration actions (such as patient registration and system settings) are augmented with a **Health Centre Selector dropdown** in the UI, mapping the transaction to the chosen target facility.

---

### 2. Facility Admin (`FACILITY_ADMIN`)
* **Role Summary**: The local administrative manager of a specific Primary Health Centre (PHC), Community Health Centre (CHC), or District Hospital.
* **Workspaces & Scope**: Restricted strictly to their own assigned facility.
* **Key Features**:
  * **Roster & Operations Management**: Oversees patient directories, bed assignments, medicine stock, and user rosters within their own facility.
  * **Deletion Rights**: The only role with authority to remove medicine records, cancel bed nodes, or purge patient intake rows for the facility.
  * **Report Compilations**: Generates local summaries and ledger reports.

---

### 3. Healthcare Staff (`HEALTHCARE_STAFF`)
* **Role Summary**: Clinic workers, doctors, and nurses responsible for diagnosing, checking in, and treating patients.
* **Workspaces & Scope**: Restricted strictly to clinical scopes inside their assigned facility.
* **Key Features**:
  * **Patient Registration**: Enters patient records (e.g., age, gender, disease categories, assigned doctors, and visit types like OPD/IPD).
  * **Medicine Inventory Checks**: Performs inventory logs and adjusts stock levels upon prescribing medicines.

---

### 4. Operations Staff (`OPERATIONS_STAFF`)
* **Role Summary**: Desk managers, ward boys, and administrative assistants handling logistics, roster details, and facilities.
* **Workspaces & Scope**: Restricted strictly to operational duties inside their assigned facility.
* **Key Features**:
  * **Bed Roster Allocation**: Assigns patients to available ward beds and updates bed nodes (e.g., Available, Occupied, Cleaning).
  * **Attendance Ledger Logging**: Marks staff roster attendance check-ins and check-outs for shift rosters.

---

## 🔒 Security & Data Isolation Architecture

All API endpoints are protected using two NestJS guards in series:
1. **`FirebaseAuthGuard`**: Verifies the Bearer JWT supplied by the frontend. If invalid, throws `401 Unauthorized`.
2. **`RolesGuard`**: Checks if the user's role is listed within the resource's `@Roles(...)` metadata. If mismatch, throws `403 Forbidden`.

```typescript
// Example: Patients Controller Protection
@Controller('patients')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class PatientsController {
  @Post()
  @Roles(Role.DISTRICT_ADMIN, Role.FACILITY_ADMIN, Role.HEALTHCARE_STAFF)
  async create(@Body() dto: CreatePatientDto, @CurrentUser() currentUser: any) {
    // District Admin chooses facilityId from form, others inherit their profile facilityId
    const facilityId = currentUser.role === Role.DISTRICT_ADMIN ? dto.facilityId : currentUser.facilityId;
    ...
  }
}
```

* **Data Isolation**: Non-District Admin users automatically have their queries filtered by their profile `facilityId`. Any attempt to retrieve, update, or delete a record belonging to another facility throws a `ForbiddenException` via the backend's `assertFacilityScope()` check.
