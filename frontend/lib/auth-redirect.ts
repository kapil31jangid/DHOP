import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function getHomeRoute(role?: string): string {
  if (role === 'DISTRICT_ADMIN') {
    return '/dashboard';
  }
  if (
    role === 'FACILITY_ADMIN' ||
    role === 'HEALTHCARE_STAFF' ||
    role === 'OPERATIONS_STAFF'
  ) {
    return '/facility';
  }
  return '/login';
}

export function redirectHome(role: string | undefined, router: AppRouterInstance) {
  const target = getHomeRoute(role);
  router.replace(target);
}
export default redirectHome;
