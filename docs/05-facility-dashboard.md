# 05-facility-dashboard.md

# Facility Dashboard

## Purpose

Provide a single operational dashboard for a Health Centre. The displayed data and available actions depend on the logged-in user's role.

---

# Layout

```text
+--------------------------------------------------------------------------------------+
| Logo                     Health Centre Dashboard                  🔔  👤 Profile     |
+--------------------------------------------------------------------------------------+
| Sidebar            | Patients | Beds | Medicines | Attendance | Reports             |
|                    |-----------------------------------------------------------------|
| Dashboard          | Today's Alerts                                                  |
| Patients           |-----------------------------------------------------------------|
| Medicines          | Quick Actions                                                   |
| Beds               |-----------------------------------------------------------------|
| Attendance         | Recent Activity                                                 |
| Reports            |-----------------------------------------------------------------|
| Users              | Medicine Status | Bed Summary | Attendance Summary              |
| Settings           |-----------------------------------------------------------------|
+--------------------------------------------------------------------------------------+
```

---

# KPI Cards

* Today's Patients
* Available Beds
* Low Stock Medicines
* Staff Attendance
* Pending Reports

---

# Today's Alerts

Examples

* 2 medicines below threshold
* 4 beds remaining
* Attendance not submitted
* Medicine batch expires tomorrow

Actions

* View
* Resolve

---

# Quick Actions

Facility Admin

* Add Patient
* Add Medicine
* Update Bed Status
* Mark Attendance
* Generate Report

Healthcare Staff

* Register Patient
* Update Medicine Stock

Operations Staff

* Update Beds
* Mark Attendance

---

# Recent Activity

Latest updates within this Health Centre.

Examples

* Patient registered
* Medicine stock updated
* Attendance submitted
* Bed status changed

---

# Summary Widgets

### Medicine Status

* Total Medicines
* Low Stock
* Expiring Soon

---

### Bed Summary

* Total Beds
* Occupied
* Available

---

### Attendance Summary

* Present
* Absent
* Attendance %

---

# Sidebar

```text
Dashboard

Patients

Medicines

Beds

Attendance

Reports

Users

Notifications

Audit Logs

Settings
```

Items are shown based on user role.

---

# Module Visibility

| Module        | Facility Admin | Healthcare | Operations |
| ------------- | -------------- | ---------- | ---------- |
| Dashboard     | ✅              | ✅          | ✅          |
| Patients      | ✅              | ✅          | 👁️ View   |
| Medicines     | ✅              | ✅          | 👁️ View   |
| Beds          | ✅              | 👁️ View   | ✅          |
| Attendance    | ✅              | 👁️ View   | ✅          |
| Reports       | ✅              | 👁️ View   | 👁️ View   |
| Users         | ✅              | ❌          | ❌          |
| Notifications | ✅              | ✅          | ✅          |
| Audit Logs    | ✅              | 👁️ View   | ❌          |
| Settings      | ✅              | ❌          | ❌          |

---

# Future Widgets

* AI Recommendations
* Patient Footfall Prediction
* Stock Forecast
* Department Performance
* Weekly Trends

---

# Next Document

**06-modules.md**

Defines every application module:

* Health Centres
* Patients
* Medicines
* Beds
* Attendance
* Reports
* Notifications
* Audit Logs
* Users
* Settings
