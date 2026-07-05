'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { BedDouble, CheckCircle, AlertTriangle, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { Drawer } from '@/components/dhop/drawer';
import { Dialog } from '@/components/dhop/dialog';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

const bedFormSchema = z.object({
  bedNumber: z.string().min(1, 'Bed Number is required'),
  ward: z.string().min(1, 'Ward Name is required'),
  bedType: z.enum(['General', 'ICU', 'Oxygen']),
  status: z.enum(['Available', 'Occupied', 'Maintenance']).default('Available'),
  assignedPatientId: z.string().nullable().optional(),
});

type BedFormData = z.infer<typeof bedFormSchema>;

export default function BedsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Available' | 'Occupied' | 'Maintenance'>('ALL');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<any | null>(null);
  const [deletingBed, setDeletingBed] = useState<any | null>(null);

  // Queries
  const { data: beds, isLoading, error } = useQuery<any[]>({
    queryKey: ['beds'],
    queryFn: async () => {
      const response = await api.get('/beds');
      return response.data?.data || [];
    },
  });

  const { data: patients } = useQuery<any[]>({
    queryKey: ['patients-list-for-beds'],
    queryFn: async () => {
      const response = await api.get('/patients');
      return response.data?.data || [];
    },
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (newBed: BedFormData) => {
      const response = await api.post('/beds', {
        ...newBed,
        assignedPatientId: newBed.assignedPatientId || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Bed registered successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to add bed');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BedFormData }) => {
      const response = await api.patch(`/beds/${id}`, {
        ...data,
        assignedPatientId: data.assignedPatientId || null,
      });
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing fetches
      await queryClient.cancelQueries({ queryKey: ['beds'] });
      // Snapshot the previous beds list
      const previousBeds = queryClient.getQueryData<any[]>(['beds']);
      // Optimistically update
      if (previousBeds) {
        queryClient.setQueryData<any[]>(
          ['beds'],
          previousBeds.map((b) =>
            b.id === id
              ? {
                  ...b,
                  bed_number: data.bedNumber,
                  ward: data.ward,
                  bed_type: data.bedType,
                  status: data.status,
                  assigned_patient_id: data.assignedPatientId || null,
                }
              : b
          )
        );
      }
      return { previousBeds };
    },
    onError: (err: any, variables, context) => {
      // Rollback on failure
      if (context?.previousBeds) {
        queryClient.setQueryData(['beds'], context.previousBeds);
      }
      toast.error(err.response?.data?.error?.message || 'Failed to update bed');
    },
    onSuccess: () => {
      toast.success('Bed details updated successfully');
      setEditingBed(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/beds/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast.success('Bed record deleted successfully');
      setDeletingBed(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to delete bed');
    },
  });

  // Forms setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BedFormData>({
    resolver: zodResolver(bedFormSchema),
    defaultValues: {
      status: 'Available',
      bedType: 'General',
      assignedPatientId: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<BedFormData>({
    resolver: zodResolver(bedFormSchema),
  });

  const handleEditClick = (bed: any) => {
    setEditingBed(bed);
    resetEdit({
      bedNumber: bed.bed_number,
      ward: bed.ward,
      bedType: bed.bed_type,
      status: bed.status,
      assignedPatientId: bed.assigned_patient_id || '',
    });
  };

  const onSubmitCreate = (data: BedFormData) => {
    createMutation.mutate(data);
  };

  const onSubmitUpdate = (data: BedFormData) => {
    if (editingBed) {
      updateMutation.mutate({ id: editingBed.id, data });
    }
  };

  const filteredBeds = (beds || []).filter((b) => {
    const matchesSearch =
      b.bed_number.toLowerCase().includes(search.toLowerCase()) ||
      b.ward.toLowerCase().includes(search.toLowerCase()) ||
      b.bed_type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Statistics
  const totalBedsCount = beds?.length || 0;
  const availableBedsCount = beds?.filter((b) => b.status === 'Available').length || 0;
  const occupiedBedsCount = beds?.filter((b) => b.status === 'Occupied').length || 0;

  const isOps =
    user?.role === 'OPERATIONS_STAFF' ||
    user?.role === 'FACILITY_ADMIN' ||
    user?.role === 'DISTRICT_ADMIN';

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve beds details. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Beds</h1>
          <p className="text-sm text-muted-foreground">
            Monitor ward occupancy, bed configurations, and patient assignments.
          </p>
        </div>
        {isOps && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Add Bed Unit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Total Beds" value={String(totalBedsCount)} icon={BedDouble} />
        <KpiCard
          label="Available Beds"
          value={String(availableBedsCount)}
          icon={CheckCircle}
          tone="success"
        />
        <KpiCard
          label="Occupied Beds"
          value={String(occupiedBedsCount)}
          icon={AlertTriangle}
          tone={occupiedBedsCount > 0 ? 'warning' : 'neutral'}
        />
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
                placeholder="Search beds by number, ward, type..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'Available', 'Occupied', 'Maintenance'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setStatusFilter(mode)}
                  className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    statusFilter === mode
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
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Bed Number</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Ward</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Bed Type</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Assigned Patient</th>
                  {isOps && <th className="w-20 px-4 py-2.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBeds.length === 0 ? (
                  <tr>
                    <td colSpan={isOps ? 6 : 5} className="text-center py-12 text-muted-foreground">
                      No bed details found.
                    </td>
                  </tr>
                ) : (
                  filteredBeds.map((b) => {
                    const patientName = patients?.find((p) => p.id === b.assigned_patient_id)?.name;
                    const patientCode = patients?.find((p) => p.id === b.assigned_patient_id)?.patient_id_code;
                    return (
                      <tr key={b.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{b.bed_number}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{b.ward}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{b.bed_type}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge
                            tone={
                              b.status === 'Available'
                                ? 'success'
                                : b.status === 'Occupied'
                                ? 'warning'
                                : 'critical'
                            }
                          >
                            {b.status}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {b.assigned_patient_id && patientName ? (
                            <span className="font-medium text-foreground">
                              {patientName} <span className="text-xs text-muted-foreground font-normal">({patientCode})</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">Unassigned</span>
                          )}
                        </td>
                        {isOps && (
                          <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(b)}
                              className="p-1 hover:text-primary transition-colors inline-block"
                              title="Edit bed details"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            {user?.role === 'FACILITY_ADMIN' && (
                              <button
                                onClick={() => setDeletingBed(b)}
                                className="p-1 hover:text-destructive transition-colors inline-block"
                                title="Remove Bed"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
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

      {/* Add Bed Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register Bed Unit">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Bed Number *</label>
            <input
              {...register('bedNumber')}
              placeholder="e.g. Bed-12"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.bedNumber && <span className="text-[10px] text-destructive">{errors.bedNumber.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Ward Location *</label>
            <input
              {...register('ward')}
              placeholder="e.g. Male Medical Ward"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.ward && <span className="text-[10px] text-destructive">{errors.ward.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Bed Type *</label>
              <select
                {...register('bedType')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="General">General</option>
                <option value="ICU">ICU</option>
                <option value="Oxygen">Oxygen</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Status *</label>
              <select
                {...register('status')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Assign Patient</label>
            <select
              {...register('assignedPatientId')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">No Patient Assigned</option>
              {patients?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patient_id_code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Register'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Bed Drawer */}
      <Drawer isOpen={!!editingBed} onClose={() => setEditingBed(null)} title="Update Bed Assignment">
        <form onSubmit={handleSubmitEdit(onSubmitUpdate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Bed Number *</label>
            <input
              {...registerEdit('bedNumber')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.bedNumber && (
              <span className="text-[10px] text-destructive">{errorsEdit.bedNumber.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Ward Location *</label>
            <input
              {...registerEdit('ward')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.ward && (
              <span className="text-[10px] text-destructive">{errorsEdit.ward.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Bed Type *</label>
              <select
                {...registerEdit('bedType')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="General">General</option>
                <option value="ICU">ICU</option>
                <option value="Oxygen">Oxygen</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Status *</label>
              <select
                {...registerEdit('status')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Assign Patient</label>
            <select
              {...registerEdit('assignedPatientId')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">No Patient Assigned</option>
              {patients?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patient_id_code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setEditingBed(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Delete Bed confirmation Dialog */}
      <Dialog isOpen={!!deletingBed} onClose={() => setDeletingBed(null)} title="Delete Bed Unit">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Are you sure you want to remove bed <strong className="text-foreground">{deletingBed?.bed_number}</strong> from{' '}
            {deletingBed?.ward}? This will unassign any active patients.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingBed(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingBed && deleteMutation.mutate(deletingBed.id)}
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
