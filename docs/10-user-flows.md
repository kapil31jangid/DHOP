# 10-user-flows.md

# User Flows

This document defines the primary user journeys through the platform.

---

# 1. District Admin

```text
Login
   │
   ▼
District Dashboard
   │
   ├── View Health Centres
   │
   ├── Open Centre Details
   │
   ├── Review Alerts
   │
   ├── View Reports
   │
   ├── Review Audit Logs
   │
   └── Logout
```

---

# 2. Facility Admin

```text
Login
   │
   ▼
Facility Dashboard
   │
   ├── Register Patient
   ├── Manage Medicines
   ├── Update Beds
   ├── Manage Attendance
   ├── Manage Users
   ├── Generate Reports
   └── Logout
```

---

# 3. Healthcare Staff

```text
Login
   │
   ▼
Dashboard
   │
   ├── Register Patient
   ├── Update Medicine Stock
   ├── View Reports
   └── Logout
```

---

# 4. Operations Staff

```text
Login
   │
   ▼
Dashboard
   │
   ├── Update Bed Status
   ├── Mark Attendance
   ├── View Reports
   └── Logout
```

---

# Common Flows

## Register Patient

```text
Patients
    │
    ▼
Add Patient
    │
    ▼
Fill Form
    │
    ▼
Save
    │
    ▼
Patient Created
```

---

## Update Medicine

```text
Medicines
     │
     ▼
Select Medicine
     │
     ▼
Update Quantity
     │
     ▼
Save
     │
     ▼
Inventory Updated
```

---

## Update Bed Status

```text
Beds
   │
   ▼
Select Bed
   │
   ▼
Change Status
   │
   ▼
Save
```

---

## Mark Attendance

```text
Attendance
     │
     ▼
Select Staff
     │
     ▼
Mark Attendance
     │
     ▼
Save
```

---

## Generate Report

```text
Reports
   │
   ▼
Choose Report Type
   │
   ▼
Select Date Range
   │
   ▼
Generate
   │
   ▼
Export / Print
```

---

## Notification Flow

```text
Notification
      │
      ▼
View Details
      │
      ▼
Open Related Module
```

---

## Audit Flow

```text
User Action
     │
     ▼
Database Updated
     │
     ▼
Audit Log Created
     │
     ▼
Notification (If Required)
```

---

# Global UX Rules

* Dashboard is the home page after login.
* Every KPI card links to the related module.
* Every notification opens the related record.
* Every successful action shows a toast message.
* Delete actions always require confirmation.
* Forms redirect back to the relevant list after saving.

---

# MVP Demo Flow

```text
District Admin Login
        │
        ▼
View District Dashboard
        │
        ▼
Open Health Centre
        │
        ▼
Check Medicine Inventory
        │
        ▼
Update Stock
        │
        ▼
Notification Generated
        │
        ▼
Dashboard Updated
        │
        ▼
Generate Report
```
