# 09-data-model.md

# Data Model

This document defines the main entities and their relationships for the MVP.

---

# Overview

```text
District
    │
    ├── Health Centres
    │       │
    │       ├── Users
    │       ├── Patients
    │       ├── Medicines
    │       ├── Beds
    │       ├── Attendance
    │       ├── Reports
    │       └── Audit Logs
```

---

# District

Represents a district that contains multiple Health Centres.

### Fields

* id
* name
* state
* status

---

# Health Centre

Represents a PHC, CHC, or District Hospital.

### Fields

* id
* districtId
* name
* type
* address
* contactNumber
* status

### Relations

* One District → Many Health Centres
* One Health Centre → Many Users
* One Health Centre → Many Patients
* One Health Centre → Many Medicines
* One Health Centre → Many Beds
* One Health Centre → Many Attendance Records

---

# User

System users with role-based access.

### Fields

* id
* facilityId
* name
* email
* role
* status

### Roles

* District Admin
* Facility Admin
* Healthcare Staff
* Operations Staff

---

# Patient

Basic patient information for operational tracking.

### Fields

* id
* facilityId
* patientId
* name
* age
* gender
* visitType
* diseaseCategory
* assignedDoctor
* visitDate

---

# Medicine

Medicine inventory.

### Fields

* id
* facilityId
* name
* category
* batchNumber
* expiryDate
* quantity
* threshold

---

# Bed

Tracks bed availability.

### Fields

* id
* facilityId
* bedNumber
* ward
* bedType
* status
* assignedPatientId *(Optional)*

---

# Attendance

Daily attendance records.

### Fields

* id
* facilityId
* userId
* date
* checkIn
* checkOut
* status

---

# Report

Generated operational reports.

### Fields

* id
* facilityId
* reportType
* generatedBy
* generatedAt

---

# Notification

System alerts.

### Fields

* id
* facilityId *(Optional)*
* type
* title
* message
* isRead
* createdAt

---

# Audit Log

Tracks important actions.

### Fields

* id
* facilityId
* userId
* module
* action
* description
* timestamp

---

# Relationships

```text
District
   │
   └── Health Centre
           │
           ├── Users
           ├── Patients
           ├── Medicines
           ├── Beds
           ├── Attendance
           ├── Reports
           ├── Notifications
           └── Audit Logs
```

---

# Future Entities

Not part of the MVP but planned for future versions.

* AI Forecast
* Medicine Transfer
* Incidents
* Equipment
* Laboratory
* Ambulance
* Department
* Resource Allocation
