// TODO: AttendanceController — /api/v1/attendance
// All routes protected by FirebaseAuthGuard + RolesGuard
//
// GET    /attendance          → getAll()       [DISTRICT_ADMIN, FACILITY_ADMIN, OPERATIONS_STAFF]
// GET    /attendance/:id      → getOne()       [DISTRICT_ADMIN, FACILITY_ADMIN, OPERATIONS_STAFF]
// POST   /attendance          → create()       [DISTRICT_ADMIN, FACILITY_ADMIN, OPERATIONS_STAFF]
// PATCH  /attendance/:id      → update()       [DISTRICT_ADMIN, FACILITY_ADMIN, OPERATIONS_STAFF]
// DELETE /attendance/:id      → remove()       [DISTRICT_ADMIN, FACILITY_ADMIN]
