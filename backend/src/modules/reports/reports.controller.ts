// TODO: ReportsController — /api/v1/reports
// All routes protected by FirebaseAuthGuard + RolesGuard
//
// GET    /reports          → getAll()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// GET    /reports/:id      → getOne()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// POST   /reports          → create()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// PATCH  /reports/:id      → update()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF, OPERATIONS_STAFF]
// DELETE /reports/:id      → remove()       [DISTRICT_ADMIN, FACILITY_ADMIN]
