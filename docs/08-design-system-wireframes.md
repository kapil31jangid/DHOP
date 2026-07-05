# 08-design-system-wireframes.md

# Design System & Wireframes

---

# Design Style

**Theme**

* Clean
* Modern
* Professional
* Government / Healthcare Friendly

**Dashboard Style**

Executive Dashboard

Avoid clutter and unnecessary charts.

---

# Page Layout

All pages follow the same structure.

```text
+------------------------------------------------------------------------------+
| Sidebar | Header (Title, Breadcrumb, Notifications, Profile)                |
|---------+--------------------------------------------------------------------|
|         | Page Header + Actions                                              |
|         |--------------------------------------------------------------------|
|         | Filters / Search                                                   |
|         |--------------------------------------------------------------------|
|         | Main Content                                                       |
|         |--------------------------------------------------------------------|
|         | Pagination                                                         |
+------------------------------------------------------------------------------+
```

---

# Dashboard Layout

```text
+------------------------------------------------------------------------------+
| Header                                                                       |
+------------------------------------------------------------------------------+
| KPI Cards                                                                    |
+------------------------------------------------------------------------------+
| Critical Alerts                                                              |
+------------------------------------------------------------------------------+
| Operational Summary                                                          |
+------------------------------------------------------------------------------+
| Recent Activity                 | Quick Actions                              |
+------------------------------------------------------------------------------+
| Main Table / Overview                                               View All |
+------------------------------------------------------------------------------+
```

---

# KPI Card

```text
+---------------------------+
| Total Patients            |
|                           |
| 1,284                     |
| ↑ +12 Today               |
+---------------------------+
```

Rules

* Entire card clickable
* Opens related module
* Show icon
* Show trend (if available)

---

# Module Page

```text
--------------------------------------------------------

Title

Description

                 [+ Primary Action]

--------------------------------------------------------

Search

Filters

--------------------------------------------------------

Table

--------------------------------------------------------

Pagination
```

---

# Table Design

Every table supports:

* Search
* Sorting
* Filters
* Pagination
* Status Badge
* Row Actions

Example

```text
---------------------------------------------------------------------------
Medicine        Batch      Expiry      Qty      Status      Actions
---------------------------------------------------------------------------

Paracetamol     A102       12-09-26    250      Low         View Edit

Ibuprofen       B203       18-11-26    820      Good        View Edit
```

---

# Forms

```text
---------------------------------------------------

Field

Field

Dropdown

Date Picker

Textarea

---------------------------------------------------

Cancel

Save
```

Rules

* Required fields marked *
* Validation below field
* Save button disabled while submitting

---

# Confirmation Dialog

```text
+--------------------------------------+

Delete Medicine?

This action cannot be undone.

[Cancel]        [Delete]

+--------------------------------------+
```

---

# Notification Drawer

```text
+--------------------------------+

Notifications

---------------------------------

🔴 Low Medicine Stock

🟡 Attendance Pending

🔵 Report Generated

---------------------------------

View All

+--------------------------------+
```

---

# Status Badges

| Status   | Badge  |
| -------- | ------ |
| Active   | Green  |
| Warning  | Orange |
| Critical | Red    |
| Pending  | Yellow |
| Inactive | Gray   |

Use the same colors throughout the application.

---

# Empty State

```text
📦

No Records Found

[ Add New ]
```

---

# Loading State

* Skeleton Cards
* Skeleton Table Rows
* Disabled Buttons

Avoid full-screen loaders.

---

# Sidebar

Desktop

```text
Dashboard

Health Centres

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

Mobile

* Hidden by default
* Opens as drawer

---

# Header

Always contains

* Breadcrumb
* Page Title
* Notifications
* User Profile

Optional

* Refresh
* Export
* Primary Action

---

# Reusable Components

## Cards

* KPI Card
* Summary Card
* Alert Card

---

## Tables

* Data Table
* Compact Table

---

## Inputs

* Text Field
* Select
* Date Picker
* Search Input
* Textarea

---

## Feedback

* Toast
* Dialog
* Empty State
* Loading Skeleton

---

## Navigation

* Sidebar
* Top Bar
* Breadcrumb
* Profile Menu
* Notification Drawer

---

# UX Rules

* Maximum 2 clicks to reach any major action.
* Keep forms short.
* Use drawers for quick edits.
* Use dialogs only for confirmation.
* Every dashboard card should open its related module.
* Keep spacing and button placement consistent across all pages.

---

# Final Deliverables

The frontend should provide:

* Responsive dashboards
* Consistent layouts
* Reusable components
* Clear navigation
* Role-based UI
* Executive-style experience
* Scalable foundation for future AI features
