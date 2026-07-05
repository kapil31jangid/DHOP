# 06-core-modules.md

# Core Modules

These modules handle the daily operations of a Health Centre.

---

# 1. Health Centres

**Purpose**

Manage all PHCs/CHCs in the district.

**Access**

* District Admin

### Fields

* Centre Name
* Centre Type (PHC / CHC / District Hospital)
* Address
* Contact Number
* Facility Admin
* Status (Active / Inactive)

### Actions

* Add Centre
* Edit Centre
* View Details
* Disable Centre

---

# 2. Patients

**Purpose**

Maintain basic patient records for operational tracking.

**Access**

* Facility Admin
* Healthcare Staff

### Fields

* Patient ID (Auto)
* Name
* Age
* Gender
* Contact Number
* Visit Type (OPD / IPD)
* Disease Category
* Assigned Doctor
* Visit Date

### Actions

* Register Patient
* Edit Patient
* View Details

### Dashboard Widget

* Today's Patients
* OPD Count
* IPD Count

---

# 3. Medicines

**Purpose**

Track medicine inventory and stock availability.

**Access**

* Facility Admin
* Healthcare Staff

### Fields

* Medicine Name
* Category
* Batch Number
* Expiry Date
* Available Quantity
* Minimum Threshold
* Supplier *(Optional)*

### Actions

* Add Medicine
* Update Stock
* Edit
* Delete
* View History

### Dashboard Widget

* Total Medicines
* Low Stock
* Expiring Soon

---

# 4. Beds

**Purpose**

Track bed availability inside the Health Centre.

**Access**

* Facility Admin
* Operations Staff

### Fields

* Bed Number
* Ward
* Bed Type
* Status
* Assigned Patient *(Optional)*

### Status

* Available
* Occupied
* Maintenance

### Actions

* Add Bed
* Update Status
* Edit Bed

### Dashboard Widget

* Total Beds
* Occupied
* Available

---

# 5. Attendance

**Purpose**

Track daily attendance of doctors and staff.

**Access**

* Facility Admin
* Operations Staff

### Fields

* Staff Name
* Role
* Date
* Check-In
* Check-Out
* Status

### Status

* Present
* Absent
* Late
* Leave

### Actions

* Mark Attendance
* Edit Attendance
* View Monthly Records

### Dashboard Widget

* Attendance %
* Present
* Absent

---

# Shared Page Layout

Every module follows the same layout.

```text
-------------------------------------------------------

Page Title

Description

[ Primary Action ]

-------------------------------------------------------

Search

Filters

-------------------------------------------------------

Table

-------------------------------------------------------

Pagination
```

---

# Common Table Actions

* View
* Edit
* Delete *(Role Based)*

---

# Common Filters

* Search
* Status
* Date
* Sort

---

# Empty State

Display a helpful message with a primary action.

Example:

"No medicines found."

**Button:** Add Medicine

---

# Future Enhancements

* Barcode Scanning
* QR Code Support
* AI Insights
* Bulk Import/Export
* Smart Recommendations

---

# Next Document

**07-management-modules.md**

Includes:

* Reports
* Notifications
* Audit Logs
* Users
* Settings
