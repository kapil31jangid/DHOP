# DHOP Backend — Structure Reference

Framework: **NestJS (TypeScript)**
Database: **Supabase (PostgreSQL)**
Auth: **Firebase Admin SDK** (token verification only)

---

## Top-Level Layout

```
backend/
├── src/
│   ├── main.ts                   ← App bootstrap
│   ├── app.module.ts             ← Root module
│   ├── config/                   ← Env & SDK config
│   ├── common/                   ← Shared guards, decorators, utils
│   ├── modules/                  ← One folder per domain module
│   └── database/                 ← Supabase provider + migrations
├── .env.example
└── package.json
```

---

## Config Layer (`src/config/`)

| File                  | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `app.config.ts`       | PORT, NODE_ENV, API prefix                      |
| `supabase.config.ts`  | Supabase URL + service role key                 |
| `firebase.config.ts`  | Firebase Admin SDK credentials                  |
| `env.validation.ts`   | Fail-fast env validation at startup             |

---

## Common Layer (`src/common/`)

Everything reused across ALL modules lives here.

### Guards
| File                      | Purpose                                                  |
| ------------------------- | -------------------------------------------------------- |
| `firebase-auth.guard.ts`  | Verifies Firebase ID token → attaches user to request    |
| `roles.guard.ts`          | Checks user's role against @Roles() metadata             |

### Decorators
| File                        | Usage                                          |
| --------------------------- | ---------------------------------------------- |
| `@Roles(...roles)`          | Mark which roles can access a route            |
| `@CurrentUser()`            | Extract authenticated user from request        |
| `@FacilityId()`             | Extract facilityId from authenticated user     |

### Interceptors
| File                              | Purpose                                         |
| --------------------------------- | ----------------------------------------------- |
| `response-transform.interceptor`  | Wrap all responses: `{ success, data, meta }`   |
| `audit-log.interceptor`           | Auto-write audit log on every mutating request  |

### Filters & Pipes
| File                        | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `http-exception.filter`     | Global error formatter                          |
| `zod-validation.pipe`       | Validates DTOs against Zod schemas              |

### Constants
| File                    | Content                                          |
| ----------------------- | ------------------------------------------------ |
| `roles.constants.ts`    | `enum Role { DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF }` |
| `permissions.constants` | Role × Module permission matrix from docs       |

---

## Module Pattern

Every domain module follows the **same 4-layer pattern**:

```
module-name/
├── module-name.module.ts      ← NestJS module wiring
├── module-name.controller.ts  ← HTTP routes + guards
├── module-name.service.ts     ← Business logic
├── module-name.repository.ts  ← Supabase queries (only place DB is touched)
├── dto/
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── schemas/
│   └── *.schema.ts            ← Zod validation schemas
└── types/
    └── *.types.ts             ← TypeScript types matching DB columns
```

---

## Modules

| Module            | Route Prefix         | Allowed Roles                                        |
| ----------------- | -------------------- | ---------------------------------------------------- |
| `auth`            | `/auth`              | Public + All authenticated                           |
| `users`           | `/users`             | DISTRICT_ADMIN, FACILITY_ADMIN                       |
| `districts`       | `/districts`         | DISTRICT_ADMIN                                       |
| `health-centres`  | `/health-centres`    | DISTRICT_ADMIN                                       |
| `patients`        | `/patients`          | DISTRICT_ADMIN (view), FACILITY_ADMIN, HEALTHCARE_STAFF |
| `medicines`       | `/medicines`         | All roles (different permission levels)              |
| `beds`            | `/beds`              | DISTRICT_ADMIN (view), FACILITY_ADMIN, OPERATIONS_STAFF |
| `attendance`      | `/attendance`        | DISTRICT_ADMIN (view), FACILITY_ADMIN, OPERATIONS_STAFF |
| `reports`         | `/reports`           | All roles (view/generate varies)                     |
| `notifications`   | `/notifications`     | All roles                                            |
| `audit-logs`      | `/audit-logs`        | DISTRICT_ADMIN (full), FACILITY_ADMIN (view)         |
| `settings`        | `/settings`          | FACILITY_ADMIN                                       |

---

## Auth Flow (Backend Role)

```
Frontend Firebase Login
      │
      ▼
Frontend sends: Authorization: Bearer <Firebase ID Token>
      │
      ▼
FirebaseAuthGuard.canActivate()
   → firebase-admin.verifyIdToken(token)
   → Attaches { uid, email } to request
      │
      ▼
AuthService.getMe(uid)
   → SELECT * FROM users WHERE firebase_uid = uid
   → Returns { id, name, email, role, facilityId }
      │
      ▼
RolesGuard.canActivate()
   → Checks request.user.role against @Roles() metadata
   → 403 if not allowed
      │
      ▼
Controller proceeds with @CurrentUser() and @FacilityId()
```

---

## Data Scoping Rules

- **District Admin** → Can access data across ALL facilities
- **Facility Admin / Healthcare Staff / Operations Staff** → Data always scoped to `facilityId` from their profile
- **Repository layer** enforces this — never done in the controller

---

## API Response Envelope

```json
// Success
{ "success": true, "data": {}, "meta": { "total": 100, "page": 1 } }

// Error
{ "success": false, "error": { "code": "FORBIDDEN", "message": "Access denied." } }
```

---

## Audit Log Auto-Capture

The `AuditLogInterceptor` (applied globally) writes a record after every:
- `POST` → action: `CREATE`
- `PATCH / PUT` → action: `UPDATE`
- `DELETE` → action: `DELETE`

Fields captured automatically: `userId`, `facilityId`, `module`, `action`, `timestamp`.
