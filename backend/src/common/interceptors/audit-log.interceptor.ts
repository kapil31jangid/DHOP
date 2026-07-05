// TODO: AuditLog interceptor
// After each mutating request (POST, PUT, PATCH, DELETE):
// 1. Extract userId, module, action, facilityId from request
// 2. Write record to audit_logs table via AuditLogsService
