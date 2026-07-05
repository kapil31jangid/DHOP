// TODO: MedicinesController — /api/v1/medicines
// All routes protected by FirebaseAuthGuard + RolesGuard
//
// GET    /medicines          → getAll()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// GET    /medicines/:id      → getOne()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// POST   /medicines          → create()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// PATCH  /medicines/:id      → update()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// DELETE /medicines/:id      → remove()       [DISTRICT_ADMIN, FACILITY_ADMIN]
