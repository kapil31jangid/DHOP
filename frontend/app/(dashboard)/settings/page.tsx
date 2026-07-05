'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Settings, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Drawer } from '@/components/dhop/drawer';
import { Dialog } from '@/components/dhop/dialog';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

const settingFormSchema = z.object({
  key: z.string().min(1, 'Setting Key is required'),
  value: z.string().min(1, 'Setting Value is required'),
  facilityId: z.string().optional(),
});

type SettingFormData = z.infer<typeof settingFormSchema>;

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any | null>(null);
  const [deletingSetting, setDeletingSetting] = useState<any | null>(null);

  // Queries
  const { data: settings, isLoading, error } = useQuery<any[]>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data?.data || [];
    },
  });

  const { data: healthCentres } = useQuery<any[]>({
    queryKey: ['health-centres-list-for-settings'],
    queryFn: async () => {
      const response = await api.get('/health-centres');
      return response.data?.data || [];
    },
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (newSetting: SettingFormData) => {
      const response = await api.post('/settings', newSetting);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuration saved successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to save configuration');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SettingFormData }) => {
      const response = await api.patch(`/settings/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuration updated successfully');
      setEditingSetting(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update configuration');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/settings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuration parameter deleted');
      setDeletingSetting(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to delete configuration');
    },
  });

  // Forms setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingFormSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingFormSchema),
  });

  const handleEditClick = (setting: any) => {
    setEditingSetting(setting);
    resetEdit({
      key: setting.key,
      value: setting.value,
    });
  };

  const onSubmitCreate = (data: SettingFormData) => {
    createMutation.mutate(data);
  };

  const onSubmitUpdate = (data: SettingFormData) => {
    if (editingSetting) {
      updateMutation.mutate({ id: editingSetting.id, data });
    }
  };

  const filteredSettings = (settings || []).filter((s) => {
    return (
      s.key.toLowerCase().includes(search.toLowerCase()) ||
      s.value.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isAuthorized = user?.role === 'FACILITY_ADMIN' || user?.role === 'DISTRICT_ADMIN';

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve facility configurations. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure system rules, alert limits, and facility parameter bounds.
          </p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Add Parameter
          </Button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton cols={3} />
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
                placeholder="Search settings..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-card max-w-2xl">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  {user?.role === 'DISTRICT_ADMIN' && (
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Scope / Facility</th>
                  )}
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Configuration Key</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Value</th>
                  {isAuthorized && <th className="w-20 px-4 py-2.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan={isAuthorized ? 3 : 2} className="text-center py-12 text-muted-foreground">
                      No custom configurations defined for this facility.
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((s) => {
                    const facilityName = healthCentres?.find((hc) => hc.id === s.facility_id)?.name || 'System / District-Wide';
                    return (
                      <tr key={s.id} className="transition-colors hover:bg-muted/40">
                        {user?.role === 'DISTRICT_ADMIN' && (
                          <td className="px-4 py-3 text-xs font-semibold text-muted-foreground">{facilityName}</td>
                        )}
                        <td className="px-4 py-3 font-mono text-xs font-semibold">{s.key}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-foreground">{s.value}</td>
                        {isAuthorized && (
                          <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(s)}
                              className="p-1 hover:text-primary transition-colors inline-block"
                              title="Edit parameter"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              onClick={() => setDeletingSetting(s)}
                              className="p-1 hover:text-destructive transition-colors inline-block"
                              title="Delete parameter"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Setting Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Configuration Key">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-4">
          {user?.role === 'DISTRICT_ADMIN' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Assigned Health Centre *</label>
              <select
                {...register('facilityId')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              >
                <option value="">Select a Health Centre</option>
                {(healthCentres || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
              {errors.facilityId && (
                <span className="text-[10px] text-destructive">{errors.facilityId.message}</span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Configuration Key *</label>
            <input
              {...register('key')}
              placeholder="e.g. bed_critical_threshold"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none font-mono focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.key && <span className="text-[10px] text-destructive">{errors.key.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Value *</label>
            <input
              {...register('value')}
              placeholder="e.g. 5"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.value && <span className="text-[10px] text-destructive">{errors.value.message}</span>}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Add Parameter'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Setting Drawer */}
      <Drawer isOpen={!!editingSetting} onClose={() => setEditingSetting(null)} title="Update Configuration Value">
        <form onSubmit={handleSubmitEdit(onSubmitUpdate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Configuration Key</label>
            <input
              {...registerEdit('key')}
              className="h-9 rounded-lg border bg-muted px-3 text-sm outline-none font-mono cursor-not-allowed"
              disabled
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Value *</label>
            <input
              {...registerEdit('value')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.value && (
              <span className="text-[10px] text-destructive">{errorsEdit.value.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setEditingSetting(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Delete Setting confirmation Dialog */}
      <Dialog isOpen={!!deletingSetting} onClose={() => setDeletingSetting(null)} title="Delete Parameter">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Are you sure you want to delete the configuration parameter{' '}
            <strong className="text-foreground font-mono text-xs">{deletingSetting?.key}</strong>? This may disrupt linked checks.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingSetting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingSetting && deleteMutation.mutate(deletingSetting.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
