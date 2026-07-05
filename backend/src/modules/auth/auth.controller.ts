// TODO: AuthController — POST /auth/me
// POST /auth/me
//   - Protected by FirebaseAuthGuard
//   - Verifies token, fetches user profile from Supabase
//   - Returns: { uid, email, role, facilityId, name }
//
// POST /auth/forgot-password
//   - Public route
//   - Sends Firebase password reset email
