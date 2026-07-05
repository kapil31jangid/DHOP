'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Building2, Plus, Search, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { Drawer } from '@/components/dhop/drawer';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

const healthCentreFormSchema = z.object({
  districtId: z.string().uuid('Please select a valid district'),
  name: z.string().min(1, 'Centre Name is required'),
  type: z.enum(['PHC', 'CHC', 'DH']),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

type HealthCentreFormData = z.infer<typeof healthCentreFormSchema>;

export default function HealthCentresPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PHC' | 'CHC' | 'DH'>('ALL');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<any | null>(null);

  // Queries
  const { data: centres, isLoading, error } = useQuery<any[]>({
    queryKey: ['health-centres'],
    queryFn: async () => {
      const response = await api.get('/health-centres');
      return response.data?.data || [];
    },
  });

  const { data: districts } = useQuery<any[]>({
    queryKey: ['districts-list-for-centres'],
    queryFn: async () => {
      const response = await api.get('/districts');
      return response.data?.data || [];
    },
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (newCentre: HealthCentreFormData) => {
      const response = await api.post('/health-centres', newCentre);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-centres'] });
      toast.success('Health centre registered successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to register health centre');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: HealthCentreFormData }) => {
      const response = await api.patch(`/health-centres/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-centres'] });
      toast.success('Health centre details updated successfully');
      setEditingCentre(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update health centre');
    },
  });

  // Forms setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthCentreFormData>({
    resolver: zodResolver(healthCentreFormSchema),
    defaultValues: {
      type: 'PHC',
      status: 'Active',
      districtId: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<HealthCentreFormData>({
    resolver: zodResolver(healthCentreFormSchema),
  });

  const handleEditClick = (centre: any) => {
    setEditingCentre(centre);
    resetEdit({
      districtId: centre.district_id,
      name: centre.name,
      type: centre.type,
      address: centre.address || '',
      contactNumber: centre.contact_number || '',
      status: centre.status,
    });
  };

  const onSubmitCreate = (data: HealthCentreFormData) => {
    createMutation.mutate(data);
  };

  const onSubmitUpdate = (data: HealthCentreFormData) => {
    if (editingCentre) {
      updateMutation.mutate({ id: editingCentre.id, data });
    }
  };

  const filteredCentres = (centres || []).filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.address || '').toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // KPI statistics calculation
  const totalCentresCount = centres?.length || 0;
  const phcCount = centres?.filter((c) => c.type === 'PHC').length || 0;
  const chcCount = centres?.filter((c) => c.type === 'CHC').length || 0;
  const dhCount = centres?.filter((c) => c.type === 'DH').length || 0;

  const isDistrictAdmin = user?.role === 'DISTRICT_ADMIN';

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve health centre records. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Centres</h1>
          <p className="text-sm text-muted-foreground">
            Register and monitor primary, community, and district healthcare facilities.
          </p>
        </div>
        {isDistrictAdmin && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Register Centre
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KpiCard label="Health Centres" value={String(totalCentresCount)} icon={Building2} />
        <KpiCard label="Primary (PHC)" value={String(phcCount)} icon={Building2} />
        <KpiCard label="Community (CHC)" value={String(chcCount)} icon={Building2} />
        <KpiCard label="District (DH)" value={String(dhCount)} icon={Building2} />
      </div>

      {isLoading ? (
        <TableSkeleton cols={6} />
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
                placeholder="Search centres by name, address..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'PHC', 'CHC', 'DH'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTypeFilter(mode)}
                  className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    typeFilter === mode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode === 'ALL' ? 'All Types' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Centre Name</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">District</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  {isDistrictAdmin && <th className="w-20 px-4 py-2.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCentres.length === 0 ? (
                  <tr>
                    <td colSpan={isDistrictAdmin ? 6 : 5} className="text-center py-12 text-muted-foreground">
                      No health centres registered.
                    </td>
                  </tr>
                ) : (
                  filteredCentres.map((c) => {
                    const districtName = districts?.find((d) => d.id === c.district_id)?.name || '—';
                    return (
                      <tr key={c.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{c.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge tone="info">{c.type}</StatusBadge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{districtName}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{c.contact_number || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge tone={c.status === 'Active' ? 'success' : 'critical'}>
                            {c.status}
                          </StatusBadge>
                        </td>
                        {isDistrictAdmin && (
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(c)}
                              className="p-1 hover:text-primary transition-colors inline-block"
                              title="Modify registration"
                            >
                              <Edit2 className="size-4" />
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

      {/* Register Centre Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register Health Centre">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Centre Name *</label>
            <input
              {...register('name')}
              placeholder="e.g. PHC Rampur"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.name && <span className="text-[10px] text-destructive">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Type *</label>
              <select
                {...register('type')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="PHC">PHC (Primary)</option>
                <option value="CHC">CHC (Community)</option>
                <option value="DH">DH (District Hospital)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Status *</label>
              <select
                {...register('status')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">District Scope *</label>
            <select
              {...register('districtId')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            >
              <option value="">Select District...</option>
              {districts?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
            {errors.districtId && <span className="text-[10px] text-destructive">{errors.districtId.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Address</label>
            <input
              {...register('address')}
              placeholder="e.g. Ward 4, Main Road, Rampur"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Contact Number</label>
            <input
              {...register('contactNumber')}
              placeholder="e.g. +91 98765 43210"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Registering...' : 'Register Centre'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Centre Drawer */}
      <Drawer isOpen={!!editingCentre} onClose={() => setEditingCentre(null)} title="Update Registration Info">
        <form onSubmit={handleSubmitEdit(onSubmitUpdate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Centre Name *</label>
            <input
              {...registerEdit('name')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.name && (
              <span className="text-[10px] text-destructive">{errorsEdit.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Type *</label>
              <select
                {...registerEdit('type')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="PHC">PHC</option>
                <option value="CHC">CHC</option>
                <option value="DH">DH</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Status *</label>
              <select
                {...registerEdit('status')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">District Scope *</label>
            <select
              {...registerEdit('districtId')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            >
              <option value="">Select District...</option>
              {districts?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Address</label>
            <input
              {...registerEdit('address')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Contact Number</label>
            <input
              {...registerEdit('contactNumber')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setEditingCentre(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
