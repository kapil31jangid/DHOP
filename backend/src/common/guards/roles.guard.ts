// TODO: RolesGuard
// 1. Read required roles from @Roles() decorator metadata
// 2. Read current user's role from request (attached by FirebaseAuthGuard)
// 3. If user role is not in allowed roles → throw ForbiddenException
// Applied AFTER FirebaseAuthGuard
