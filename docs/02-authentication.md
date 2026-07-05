# 02-authentication.md

# Authentication & Authorization

---

## Authentication Provider

* Firebase Authentication
* Email & Password (MVP)
* No public registration

---

# User Onboarding

```
District Admin
      │
      ▼
Create Health Centre
      │
      ▼
Create Facility Admin
      │
      ▼
Facility Admin creates staff accounts
```

---

# Login Flow

```
Login
   │
   ▼
Firebase Authentication
   │
   ▼
Fetch User Profile (Supabase)
   │
   ▼
Check Role
   │
   ▼
Redirect to Dashboard
```

---

# Roles

| Role             | Redirect     |
| ---------------- | ------------ |
| District Admin   | `/dashboard` |
| Facility Admin   | `/dashboard` |
| Healthcare Staff | `/dashboard` |
| Operations Staff | `/dashboard` |

Dashboard content changes based on role.

---

# Login Page

### Components

* Logo
* Project Name
* Email
* Password
* Show/Hide Password
* Remember Me
* Forgot Password
* Login Button

---

## Layout

```text
+--------------------------------------+
|              DHOP Logo               |
| District Health Operations Platform  |
|--------------------------------------|
| Email                                |
| Password                      👁️      |
| ☑ Remember Me                        |
| Forgot Password                      |
|                                      |
|      [ Login ]                       |
+--------------------------------------+
```

---

# Forgot Password

Flow:

```
Enter Email
      │
      ▼
Firebase Reset Email
      │
      ▼
Success Message
```

---

# Session Rules

* Keep user logged in
* Auto logout on invalid session
* Redirect to Login if unauthorized

---

# Route Protection

* Public Routes

  * Login
  * Forgot Password

* Protected Routes

  * Dashboard
  * Modules
  * Reports
  * Settings

Unauthorized access → **403 Page**

---

# Access Control

Sidebar, pages, and actions are controlled by the user's role.

Example:

| Module         | District | Facility | Healthcare | Operations |
| -------------- | -------- | -------- | ---------- | ---------- |
| Dashboard      | ✅        | ✅        | ✅          | ✅          |
| Health Centres | ✅        | ❌        | ❌          | ❌          |
| Medicines      | View     | Full     | Update     | View       |
| Patients       | View     | Full     | Full       | View       |
| Beds           | View     | Full     | View       | Full       |
| Attendance     | View     | Full     | View       | Update     |
| Reports        | Full     | Full     | View       | View       |
| Audit Logs     | Full     | View     | ❌          | ❌          |

---

# Profile Menu

Top-right menu:

* My Profile
* Change Password
* Logout

---

# Error States

* Invalid email/password
* Account disabled
* Network error
* Session expired

Show friendly error messages with toast notifications.

---

# Future Scope

* OTP Login
* Multi-Factor Authentication
* SSO (Government Login)
* Biometric Login (Mobile)

---

# Next Document

**03-navigation.md**

* Application Layout
* Sidebar
* Top Navigation
* Navigation Tree
* Dashboard Structure
* Responsive Navigation
