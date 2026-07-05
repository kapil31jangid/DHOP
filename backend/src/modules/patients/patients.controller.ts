// TODO: PatientsController — /api/v1/patients
// All routes protected by FirebaseAuthGuard + RolesGuard
//
// GET    /patients          → getAll()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF]
// GET    /patients/:id      → getOne()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF]
// POST   /patients          → create()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF]
// PATCH  /patients/:id      → update()       [DISTRICT_ADMIN, FACILITY_ADMIN, HEALTHCARE_STAFF]
// DELETE /patients/:id      → remove()       [DISTRICT_ADMIN, FACILITY_ADMIN]
