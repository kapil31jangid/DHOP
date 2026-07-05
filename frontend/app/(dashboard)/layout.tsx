'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useRealtimeSync } from '@/hooks/use-realtime-sync';
import { AppShell } from '@/components/dhop/app-shell';
import { ErrorBoundary } from '@/components/dhop/error-boundary';

const routePermissions: Record<string, string[]> = {
  '/dashboard': ['DISTRICT_ADMIN'],
  '/facility': ['FACILITY_ADMIN', 'HEALTHCARE_STAFF', 'OPERATIONS_STAFF'],
  '/health-centres': ['DISTRICT_ADMIN'],
  '/users': ['DISTRICT_ADMIN', 'FACILITY_ADMIN'],
  '/audit-logs': ['DISTRICT_ADMIN', 'FACILITY_ADMIN'],
  '/settings': ['DISTRICT_ADMIN', 'FACILITY_ADMIN'],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, initialize, initialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize Postgres realtime change channels
  useRealtimeSync();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  useEffect(() => {
    if (!loading && initialized) {
      if (!user) {
        router.replace('/login');
      } else {
        const allowedRoles = routePermissions[pathname];
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.replace('/forbidden');
        }
      }
    }
  }, [user, loading, initialized, pathname, router]);

  if (loading || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading dashboard session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  );
}
