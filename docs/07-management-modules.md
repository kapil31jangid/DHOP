# 07-management-modules.md

# Management Modules

These modules support monitoring, administration, and system management.

---

# 1. Reports

**Purpose**

Generate operational reports for monitoring and analysis.

**Access**

* District Admin
* Facility Admin
* View Only (Other Roles)

### Report Types

* Daily Summary
* Weekly Summary
* Monthly Summary
* Medicine Inventory
* Bed Occupancy
* Attendance Report
* Patient Summary

### Actions

* Generate Report
* Export PDF
* Export Excel
* Print

### Filters

* Date Range
* Health Centre
* Report Type

---

# 2. Notifications

**Purpose**

Display important system alerts and updates.

**Access**

All Users

### Notification Types

* Critical
* Warning
* Information
* Success

### Sources

* Low Medicine Stock
* Expiring Medicines
* Attendance Pending
* Report Generated
* System Updates

### Actions

* View
* Mark as Read
* Mark All as Read

---

# 3. Audit Logs

**Purpose**

Track important actions performed in the system.

**Access**

* District Admin
* Facility Admin (Own Centre Only)

### Log Details

* Date & Time
* User
* Module
* Action
* Description
* IP Address *(Future)*

### Actions

* Search
* Filter
* Export

---

# 4. User Management

**Purpose**

Manage platform users and their roles.

**Access**

* District Admin
* Facility Admin (Own Centre)

### Fields

* Name
* Email
* Role
* Assigned Health Centre
* Status

### Actions

* Invite User
* Edit User
* Disable User
* Reset Password

---

# 5. Settings

**Purpose**

Manage profile and application preferences.

---

## Profile

* Name
* Email
* Phone
* Change Password

---

## Facility Settings

* Health Centre Details
* Contact Information
* Operating Hours

---

## System Settings

*(District Admin Only)*

* Notification Preferences
* Default Thresholds
* Report Preferences

---

# Shared Features

All management modules should support:

* Search
* Filters
* Pagination
* Loading Skeleton
* Empty State
* Error State

---

# Deep Linking

The following should open their related modules automatically:

| Source              | Opens                        |
| ------------------- | ---------------------------- |
| Low Stock Alert     | Medicines (Low Stock Filter) |
| Attendance Alert    | Attendance (Today's Records) |
| Report Notification | Generated Report             |
| User Notification   | User Profile                 |
| Audit Entry         | Related Module Record        |

---

# Next Document

**08-design-system-wireframes.md**

This document defines the complete frontend UI foundation, including:

* Layout rules
* Reusable components
* Dashboard templates
* Table templates
* Form templates
* Modal templates
* Status badges
* Page structure
* ASCII wireframes
* UI consistency guidelines
