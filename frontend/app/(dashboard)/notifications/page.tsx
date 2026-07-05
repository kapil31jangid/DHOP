'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Bell, Plus, Search, Check, MailOpen } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { Drawer } from '@/components/dhop/drawer';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

const notificationFormSchema = z.object({
  facilityId: z.string().nullable().optional(),
  type: z.enum(['Info', 'Warning', 'Critical']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Detailed description is required'),
});

type NotificationFormData = z.infer<typeof notificationFormSchema>;

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Info' | 'Warning' | 'Critical'>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Queries
  const { data: notifications, isLoading, error } = useQuery<any[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data?.data || [];
    },
  });

  const { data: healthCentres } = useQuery<any[]>({
    queryKey: ['health-centres-list-for-notifications'],
    queryFn: async () => {
      const response = await api.get('/health-centres');
      return response.data?.data || [];
    },
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (newNotify: NotificationFormData) => {
      const response = await api.post('/notifications', {
        ...newNotify,
        facilityId: newNotify.facilityId || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification broadcasted successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to dispatch alert');
    },
  });

  const readMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Alert marked as read');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to toggle alert status');
    },
  });

  // Forms setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      type: 'Info',
      facilityId: '',
    },
  });

  const onSubmitCreate = (data: NotificationFormData) => {
    createMutation.mutate(data);
  };

  const filteredNotifications = (notifications || []).filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || n.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Statistics calculation
  const totalAlertsCount = notifications?.length || 0;
  const unreadAlertsCount = notifications?.filter((n) => !n.is_read).length || 0;

  const isOps =
    currentUser?.role === 'DISTRICT_ADMIN' || currentUser?.role === 'FACILITY_ADMIN';

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve notifications. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            View system alerts, threshold limits, and broadcast communications.
          </p>
        </div>
        {isOps && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Dispatch Alert
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <KpiCard label="Notifications Recorded" value={String(totalAlertsCount)} icon={Bell} />
        <KpiCard
          label="Unread Alerts"
          value={String(unreadAlertsCount)}
          icon={MailOpen}
          tone={unreadAlertsCount > 0 ? 'critical' : 'neutral'}
        />
      </div>

      {isLoading ? (
        <TableSkeleton cols={5} />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alerts by details..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'Info', 'Warning', 'Critical'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTypeFilter(mode)}
                  className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    typeFilter === mode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Scope</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Alert Details</th>
                  <th className="w-20 px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredNotifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                      No notifications broadcasted.
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((n) => {
                    const facilityName = healthCentres?.find((hc) => hc.id === n.facility_id)?.name;
                    return (
                      <tr
                        key={n.id}
                        className={`transition-colors hover:bg-muted/40 ${
                          !n.is_read ? 'font-medium bg-primary/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-xs whitespace-nowrap">
                          {n.facility_id ? (
                            facilityName || 'Facility Scoped'
                          ) : (
                            <span className="text-primary/70 font-semibold italic">Global Broadcast</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge
                            tone={
                              n.type === 'Critical'
                                ? 'critical'
                                : n.type === 'Warning'
                                ? 'warning'
                                : 'info'
                            }
                          >
                            {n.type}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{n.title}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                          {n.message}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {!n.is_read ? (
                            <button
                              onClick={() => readMutation.mutate(n.id)}
                              disabled={readMutation.isPending}
                              className="p-1 text-primary hover:text-green-600 transition-colors inline-block"
                              title="Mark as read"
                            >
                              <Check className="size-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Read</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadcast alert Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Broadcast System Alert">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Priority Level *</label>
            <select
              {...register('type')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="Info">Info (General Announcement)</option>
              <option value="Warning">Warning (Caution / Low Inventory)</option>
              <option value="Critical">Critical (Action Required)</option>
            </select>
          </div>

          {currentUser?.role === 'DISTRICT_ADMIN' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Target Facility Scope</label>
              <select
                {...register('facilityId')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Global Broadcast (All Centres)</option>
                {healthCentres?.map((hc) => (
                  <option key={hc.id} value={hc.id}>
                    {hc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Alert Title *</label>
            <input
              {...register('title')}
              placeholder="e.g. Server Maintenance"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.title && <span className="text-[10px] text-destructive">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Detailed Description *</label>
            <textarea
              {...register('message')}
              placeholder="Provide a description of the event or notification details."
              rows={4}
              className="rounded-lg border bg-background p-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              required
            />
            {errors.message && <span className="text-[10px] text-destructive">{errors.message.message}</span>}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Broadcasting...' : 'Broadcast Alert'}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
