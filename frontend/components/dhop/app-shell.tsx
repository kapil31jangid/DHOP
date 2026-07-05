'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, HeartPulse, LogOut, Menu, User, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarNav } from '@/components/dhop/sidebar';
import { StatusBadge } from '@/components/dhop/status-badge';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/dhop/skeleton';

const pageTitles: Record<string, string> = {
  '/dashboard': 'District Dashboard',
  '/facility': 'Facility Dashboard',
  '/health-centres': 'Health Centres',
  '/patients': 'Patients',
  '/medicines': 'Medicines',
  '/beds': 'Beds',
  '/attendance': 'Attendance',
  '/reports': 'Reports',
  '/users': 'Users',
  '/notifications': 'Notifications',
  '/audit-logs': 'Audit Logs',
  '/settings': 'Settings',
};



function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-1">
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <HeartPulse className="size-4" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">CureSync</span>
        <span className="text-[10px] text-muted-foreground">District Health Ops</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Dashboard';

  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery<any[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data?.data || [];
    },
  });

  const unreadNotifications = (notifications || []).filter((n) => !n.is_read);

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification marked as read');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const promises = unreadNotifications.map((n) =>
        api.patch(`/notifications/${n.id}/read`)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark all as read');
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatRole = (role: string) => {
    return role
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userDisplayName = user?.name || 'Authorized User';
  const userRoleLabel = user?.role ? formatRole(user.role) : 'Healthcare Staff';
  const userInitials = getInitials(userDisplayName);

  return (
    <div className="flex min-h-svh">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r bg-sidebar lg:flex print:hidden">
        <div className="flex h-14 items-center border-b px-4">
          <Logo />
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar shadow-xl">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <Logo />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close menu"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md lg:px-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.02)] print:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-4" aria-hidden="true" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="hidden text-muted-foreground sm:inline">Dashboard</span>
            <ChevronRight
              className="hidden size-3.5 text-muted-foreground sm:inline"
              aria-hidden="true"
            />
            <span className="truncate font-medium">{title}</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Notifications"
                onClick={() => {
                  setDrawerOpen((o) => !o);
                  setProfileOpen(false);
                }}
              >
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              {unreadNotifications.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white"
                  aria-hidden="true"
                >
                  {unreadNotifications.length}
                </span>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                onClick={() => {
                  setProfileOpen((o) => !o);
                  setDrawerOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors hover:bg-muted"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {userInitials}
                </span>
                <span className="hidden flex-col items-start leading-tight sm:flex text-left">
                  <span className="text-xs font-medium">{userDisplayName}</span>
                  <span className="text-[10px] text-muted-foreground">{userRoleLabel}</span>
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border bg-popover p-1 shadow-md">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <User className="size-4 text-muted-foreground" aria-hidden="true" />
                    My Profile
                  </button>
                  <div className="my-1 border-t" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 text-left"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Notification drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close notifications"
              className="absolute inset-0 bg-foreground/20"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <h2 className="text-sm font-semibold">Notifications</h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close notifications"
                  onClick={() => setDrawerOpen(false)}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    Failed to load notifications.
                  </div>
                ) : (notifications || []).length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground italic">
                    No announcements or alerts.
                  </div>
                ) : (
                  (notifications || []).slice(0, 5).map((n) => {
                    const tone = n.type === 'Critical' ? 'critical' : n.type === 'Warning' ? 'warning' : 'info';
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          'flex flex-col gap-1.5 px-4 py-3 relative group',
                          !n.is_read && 'bg-primary/5',
                          'border-b'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <StatusBadge tone={tone}>{n.type}</StatusBadge>
                          <span className="text-[10px] text-muted-foreground">
                            {n.created_at ? new Date(n.created_at).toLocaleTimeString() : 'now'}
                          </span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold truncate">{n.title}</h4>
                            <p className="text-xs text-muted-foreground leading-normal mt-0.5 break-words">{n.message}</p>
                          </div>
                          {!n.is_read && (
                            <button
                              onClick={() => markReadMutation.mutate(n.id)}
                              disabled={markReadMutation.isPending}
                              className="opacity-0 group-hover:opacity-100 p-1 text-primary hover:text-green-600 transition-opacity"
                              title="Mark as read"
                            >
                              <Check className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex items-center justify-between border-t p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={unreadNotifications.length === 0 || markAllReadMutation.isPending}
                >
                  Mark all as read
                </Button>
                <Link
                  href="/notifications"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => setDrawerOpen(false)}
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
