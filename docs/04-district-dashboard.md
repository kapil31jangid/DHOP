# 04-district-dashboard.md

# District Admin Dashboard

## Purpose

Provide a real-time overview of all Health Centres in the district and quickly identify operational issues.

---

# Dashboard Layout

```text
+--------------------------------------------------------------------------------------+
| Logo                      District Dashboard                    🔔  👤 Admin         |
+--------------------------------------------------------------------------------------+
| Sidebar            | Total  Active  Critical  Patients Today  Low Stock  Attendance |
|                    |---------------------------------------------------------------|
| Dashboard          | Critical Alerts                                             |
| Health Centres     |---------------------------------------------------------------|
| Reports            | Recent Activity                                              |
| Notifications      |---------------------------------------------------------------|
| Audit Logs         | Health Centre Overview Table                                 |
| Settings           |---------------------------------------------------------------|
|                    | Name | Type | Patients | Beds | Stock | Attendance | Status  |
|                    |---------------------------------------------------------------|
+--------------------------------------------------------------------------------------+
```

---

# KPI Cards

Display at the top.

* Total Health Centres
* Active Centres
* Critical Alerts
* Today's Patients
* Low Stock Alerts
* Average Staff Attendance

---

# Section 1 — Critical Alerts

Shows the most important issues first.

Examples:

* Medicine below threshold
* Full bed occupancy
* Low attendance
* Expired medicines
* Centre not updated today

Actions:

* View Centre
* Mark Reviewed

---

# Section 2 — Recent Activity

Latest updates across all centres.

Example:

* PHC A updated medicine stock
* CHC B submitted attendance
* PHC C generated report

---

# Section 3 — Health Centre Overview

Main monitoring table.

Columns

* Centre Name
* Type
* Today's Patients
* Available Beds
* Low Stock Count
* Attendance %
* Last Updated
* Status
* Actions

Actions

* View Details
* View Report

---

# Filters

* Centre Type
* Status
* Date
* Search by Name

---

# Quick Actions

* View Reports
* View Notifications
* Export Summary

---

# Notifications

Top-right notification drawer.

Types

* Critical
* Warning
* Information

---

# Empty State

"No health centres available."

Action:

**Add Health Centre**

---

# Future Features

* District Map
* AI Recommendations
* Predictive Alerts
* Resource Redistribution Suggestions
