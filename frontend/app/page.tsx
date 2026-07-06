'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { redirectHome } from '@/lib/auth-redirect';

export default function RootPage() {
  const { user, loading, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        redirectHome(user.role, router);
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading DHOP Platform...
        </p>
      </div>
    </div>
  );
}
