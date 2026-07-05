# 00-project-overview.md

# District Health Operations Platform (DHOP)

> **Hackathon MVP**
> A centralized platform for monitoring and managing multiple Health Centres (PHCs/CHCs) across a district.

---

# 1. Overview

District Health Operations Platform (DHOP) enables district administrators and health centre staff to monitor daily operations through a single digital platform.

Instead of manually tracking medicine availability, patient load, bed occupancy, and doctor attendance, the platform provides a unified dashboard for every health centre in the district.

The MVP focuses on operational visibility, role-based management, reporting, and real-time updates. AI features are intentionally planned for future phases without affecting the current architecture.

---

# 2. Problem Statement

Health centres often rely on manual tracking and disconnected records.

Common issues include:

* Medicine stock shortages
* Lack of district-wide visibility
* Bed availability uncertainty
* Doctor attendance tracking difficulties
* Delayed reporting
* Slow identification of underperforming centres

District administrators usually receive this information too late to make proactive decisions.

---

# 3. Proposed Solution

Build a web platform where every health centre updates its operational data while district administrators monitor the entire district from one dashboard.

The platform provides:

* Real-time operational monitoring
* Centralized management
* Standardized reporting
* Role-based access
* Audit tracking
* Notification system

The architecture is designed so AI forecasting and recommendations can be added later without major frontend changes.

---

# 4. Project Goals

## Primary Goals

* Digitize health centre operations
* Centralize district monitoring
* Improve operational transparency
* Reduce manual reporting
* Enable faster administrative decisions

## MVP Goals

* Multi-centre management
* Role-based dashboards
* Medicine inventory tracking
* Basic patient records
* Bed management
* Doctor attendance
* Notifications
* Reports
* Audit logs

---

# 5. Target Users

## District Administration

Responsible for monitoring every health centre in the district.

---

## Facility Administration

Responsible for managing one health centre.

---

## Healthcare Staff

Responsible for patient records and medicine-related updates.

---

## Operations Staff

Responsible for operational resources including:

* Beds
* Rooms
* Attendance
* Infrastructure status

---

# 6. User Roles

## District Admin

Scope:
Entire district

Responsibilities:

* Monitor all health centres
* View reports
* Compare facilities
* Review notifications
* View audit logs

---

## Facility Admin

Scope:
Single health centre

Responsibilities:

* Manage staff
* Manage inventory
* Manage patients
* Manage operations
* Generate reports

---

## Healthcare Staff

Responsibilities:

* Register patients
* Update medicine inventory
* View assigned reports

---

## Operations Staff

Responsibilities:

* Update bed availability
* Manage room status
* Record attendance
* Update operational resources

---

# 7. Core MVP Modules

### Authentication

Role-based login using Firebase Authentication.

---

### District Dashboard

District-wide monitoring.

---

### Facility Dashboard

Operational dashboard for a single health centre.

---

### Health Centre Management

Manage all registered PHCs/CHCs.

---

### Medicine Inventory

* Medicines
* Stock
* Batch numbers
* Expiry tracking
* Threshold alerts

---

### Patient Management

Basic patient records.

No EMR in MVP.

---

### Bed Management

* Available beds
* Occupied beds
* Ward overview

---

### Attendance

Doctor and staff attendance tracking.

---

### Notifications

System-wide alerts and important updates.

---

### Reports

Generate operational reports.

Examples:

* Daily
* Weekly
* Monthly
* Inventory
* Attendance

---

### Audit Logs

Track important actions performed inside the platform.

Example:

* User login
* Medicine updated
* Attendance modified
* Patient created

---

### Settings

Application and profile settings.

---

# 8. MVP Scope

## Included

* Responsive web application
* Multiple health centres
* Multiple user roles
* Dashboard analytics
* CRUD operations
* Notifications
* Reports
* Audit logs
* Role-based permissions

---

## Not Included

* AI predictions
* Interactive district map
* Offline mode
* Barcode scanning
* IoT integrations
* Government API integrations
* Mobile application

These are planned for future versions.

---

# 9. High-Level Architecture

```
                    Firebase Authentication
                              │
                              ▼
                      Role Verification
                              │
                              ▼
                        React Frontend
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
          Supabase API               Realtime Updates
                │
                ▼
         PostgreSQL Database
```

Future Architecture

```
React Frontend
        │
        ▼
Backend Services
        │
 ┌──────┴───────────┐
 ▼                  ▼
Database       AI Services
                   │
        Forecasting
        Recommendations
        Smart Alerts
```

---

# 10. Application Flow

```
Login
   │
   ▼
Authentication
   │
   ▼
Detect User Role
   │
   ▼
Open Dashboard
   │
   ▼
Access Modules
   │
   ▼
Update Data
   │
   ▼
Generate Reports
```

---

# 11. Design Principles

The platform should follow these principles throughout development.

* Clean interface
* Fast navigation
* Minimal learning curve
* Executive-style dashboards
* Consistent components
* Mobile-friendly responsive layout
* Accessibility-focused design
* Scalable architecture

---

# 12. Future Expansion

The platform is designed so new capabilities can be added without redesigning the frontend.

Planned enhancements include:

* AI demand forecasting
* Stock-out prediction
* Resource redistribution suggestions
* District map visualization
* SMS/Email notifications
* Offline-first support
* Barcode & QR scanning
* Government health system integrations
* Advanced analytics
* Predictive operational insights

---

# 13. Success Criteria

The MVP is considered successful if it can demonstrate:

* Multiple health centres managed from one platform
* Role-based access for different users
* District-wide operational visibility
* Medicine inventory tracking
* Patient record management
* Bed availability monitoring
* Attendance management
* Report generation
* Notification system
* Audit logging

---

# 14. Next Document

**01-tech-stack.md**

This document will define:

* Frontend architecture
* Technology stack
* Folder structure
* Required libraries
* State management
* API strategy
* Coding conventions
* Project structure
