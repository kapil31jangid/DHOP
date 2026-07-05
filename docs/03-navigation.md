# 03-navigation.md

# Application Navigation

---

# Layout Structure

```text
+------------------------------------------------------------------------------+
| Logo                     Page Title                     🔔 Notifications 👤   |
+------------------------------------------------------------------------------+
| Sidebar            |                                                       |
|                    |                                                       |
|                    |                Main Content                           |
|                    |                                                       |
|                    |                                                       |
+------------------------------------------------------------------------------+
```

---

# Sidebar

## District Admin

```text
Dashboard

Health Centres

Reports

Notifications

Audit Logs

Settings
```

---

## Facility Admin

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

---

## Healthcare Staff

```text
Dashboard

Patients

Medicines

Reports
```

---

## Operations Staff

```text
Dashboard

Beds

Attendance

Reports
```

---

# Top Navigation

Always Visible

* Breadcrumb
* Current Page Title
* Global Search *(Future)*
* Notifications
* User Profile

---

# Dashboard Landing

| Role             | Landing Page         |
| ---------------- | -------------------- |
| District Admin   | District Dashboard   |
| Facility Admin   | Facility Dashboard   |
| Healthcare Staff | Healthcare Dashboard |
| Operations Staff | Operations Dashboard |

---

# Common Page Layout

```text
---------------------------------------------------------
Page Title

Page Description

[Primary Action]

---------------------------------------------------------

Filters / Search

---------------------------------------------------------

Statistics (Optional)

---------------------------------------------------------

Table / Cards

---------------------------------------------------------

Pagination
```

---

# Navigation Rules

* Dashboard is always first.
* Settings always last.
* Use icons for every menu item.
* Highlight active page.
* Collapse sidebar on smaller screens.

---

# Breadcrumb Example

```text
Dashboard > Medicines

Dashboard > Reports

Dashboard > Patients > View Patient
```

---

# Quick Actions

Displayed on dashboard only.

Examples:

* Add Patient
* Add Medicine
* Update Bed Status
* Mark Attendance
* Generate Report

---

# Notifications

Bell icon in top navigation.

Click opens a right-side drawer.

Categories:

* Critical
* Warning
* Information

Actions:

* Mark as Read
* View Details
* Clear All

---

# Profile Menu

```text
My Profile

Settings

Logout
```

---

# Responsive Behavior

## Desktop

* Expanded sidebar
* Full tables
* Multi-column cards

## Tablet

* Collapsible sidebar
* Responsive tables

## Mobile

* Drawer navigation
* Stacked cards
* Horizontal scrolling tables if required

---

# Navigation Principles

* Maximum 8–10 sidebar items.
* Keep important actions within 2 clicks.
* Maintain consistent layout across all roles.
* Only show modules permitted for the logged-in role.

---

# Next Document

**04-role-permissions.md**

Defines responsibilities, permissions, and accessible modules for each user role.
