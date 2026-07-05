'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Pill, AlertTriangle, CheckCircle, Plus, Search, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { Drawer } from '@/components/dhop/drawer';
import { Dialog } from '@/components/dhop/dialog';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

const medicineFormSchema = z.object({
  name: z.string().min(1, 'Medicine Name is required'),
  category: z.string().min(1, 'Category/Type is required'),
  batchNumber: z.string().min(1, 'Batch Number is required'),
  expiryDate: z.string().min(1, 'Expiry Date is required'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be 0 or higher'),
  threshold: z.coerce.number().int().min(0, 'Alert Threshold must be 0 or higher'),
});

type MedicineFormData = z.infer<typeof medicineFormSchema>;

export default function MedicinesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OK'>('ALL');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<any | null>(null);
  const [deletingMedicine, setDeletingMedicine] = useState<any | null>(null);

  const { data: medicines, isLoading, error } = useQuery<any[]>({
    queryKey: ['medicines'],
    queryFn: async () => {
      const response = await api.get('/medicines');
      return response.data?.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newMed: MedicineFormData) => {
      const response = await api.post('/medicines', newMed);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine stock registered successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to add medicine');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MedicineFormData }) => {
      const response = await api.patch(`/medicines/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine stock updated successfully');
      setEditingMedicine(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update medicine');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/medicines/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine entry deleted successfully');
      setDeletingMedicine(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to delete medicine');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      quantity: 0,
      threshold: 10,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineFormSchema),
  });

  const handleEditClick = (med: any) => {
    setEditingMedicine(med);
    resetEdit({
      name: med.name,
      category: med.category || '',
      batchNumber: med.batch_number,
      expiryDate: med.expiry_date ? new Date(med.expiry_date).toISOString().split('T')[0] : '',
      quantity: med.quantity,
      threshold: med.threshold,
    });
  };

  const onSubmitCreate = (data: MedicineFormData) => {
    createMutation.mutate(data);
  };

  const onSubmitUpdate = (data: MedicineFormData) => {
    if (editingMedicine) {
      updateMutation.mutate({ id: editingMedicine.id, data });
    }
  };

  const filteredMedicines = (medicines || []).filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.batch_number.toLowerCase().includes(search.toLowerCase()) ||
      (m.category || '').toLowerCase().includes(search.toLowerCase());

    const isLow = m.quantity <= m.threshold;
    const matchesStock =
      stockFilter === 'ALL' || (stockFilter === 'LOW' && isLow) || (stockFilter === 'OK' && !isLow);

    return matchesSearch && matchesStock;
  });

  const totalMeds = medicines?.length || 0;
  const lowStockMeds = medicines?.filter((m) => m.quantity <= m.threshold).length || 0;
  const expiredMeds =
    medicines?.filter((m) => m.expiry_date && new Date(m.expiry_date) < new Date()).length || 0;

  const isStaff =
    user?.role === 'HEALTHCARE_STAFF' ||
    user?.role === 'FACILITY_ADMIN' ||
    user?.role === 'DISTRICT_ADMIN';

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve medicine stock details. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medicines</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage medical inventory and alert thresholds.
          </p>
        </div>
        {isStaff && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Add Stock Entry
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Medicines Listed" value={String(totalMeds)} icon={Pill} />
        <KpiCard
          label="Low Stock Alerts"
          value={String(lowStockMeds)}
          icon={AlertTriangle}
          tone={lowStockMeds > 0 ? 'critical' : 'neutral'}
        />
        <KpiCard
          label="Expired Batches"
          value={String(expiredMeds)}
          icon={ShieldAlert}
          tone={expiredMeds > 0 ? 'critical' : 'neutral'}
        />
      </div>

      {isLoading ? (
        <TableSkeleton cols={7} />
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
                placeholder="Search stock by name, batch..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'LOW', 'OK'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setStockFilter(mode)}
                  className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    stockFilter === mode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode === 'LOW' ? 'Low Stock' : mode === 'OK' ? 'In Stock' : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Medicine Name</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Category/Type</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Batch Number</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Expiry Date</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground text-right">Quantity</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  {isStaff && <th className="w-20 px-4 py-2.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={isStaff ? 7 : 6} className="text-center py-12 text-muted-foreground">
                      No inventory details found.
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((m) => {
                    const isLow = m.quantity <= m.threshold;
                    const isExpired = m.expiry_date && new Date(m.expiry_date) < new Date();
                    return (
                      <tr key={m.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{m.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{m.category || 'General'}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{m.batch_number}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {m.expiry_date ? new Date(m.expiry_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-semibold">
                          {m.quantity} <span className="text-[10px] text-muted-foreground">/ th: {m.threshold}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isExpired ? (
                            <StatusBadge tone="critical">Expired</StatusBadge>
                          ) : isLow ? (
                            <StatusBadge tone="critical">Low Stock</StatusBadge>
                          ) : (
                            <StatusBadge tone="success">In Stock</StatusBadge>
                          )}
                        </td>
                        {isStaff && (
                          <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(m)}
                              className="p-1 hover:text-primary transition-colors inline-block"
                              title="Update stock details"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            {user?.role === 'FACILITY_ADMIN' && (
                              <button
                                onClick={() => setDeletingMedicine(m)}
                                className="p-1 hover:text-destructive transition-colors inline-block"
                                title="Remove entry"
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

      {/* Add Stock Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register New Stock Batch">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Medicine Name *</label>
            <input
              {...register('name')}
              placeholder="e.g. Paracetamol 500mg"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.name && <span className="text-[10px] text-destructive">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Category/Type *</label>
            <input
              {...register('category')}
              placeholder="e.g. Tablet, Syrup, Injection"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.category && <span className="text-[10px] text-destructive">{errors.category.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Batch Number *</label>
              <input
                {...register('batchNumber')}
                placeholder="e.g. B-993A"
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
              {errors.batchNumber && (
                <span className="text-[10px] text-destructive">{errors.batchNumber.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Expiry Date *</label>
              <input
                type="date"
                {...register('expiryDate')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Initial Quantity *</label>
              <input
                type="number"
                {...register('quantity')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
              {errors.quantity && <span className="text-[10px] text-destructive">{errors.quantity.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Alert Threshold *</label>
              <input
                type="number"
                {...register('threshold')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
              {errors.threshold && (
                <span className="text-[10px] text-destructive">{errors.threshold.message}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Stock Drawer */}
      <Drawer isOpen={!!editingMedicine} onClose={() => setEditingMedicine(null)} title="Update Stock Parameters">
        <form onSubmit={handleSubmitEdit(onSubmitUpdate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Medicine Name *</label>
            <input
              {...registerEdit('name')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.name && (
              <span className="text-[10px] text-destructive">{errorsEdit.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Category/Type *</label>
            <input
              {...registerEdit('category')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.category && (
              <span className="text-[10px] text-destructive">{errorsEdit.category.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Batch Number *</label>
              <input
                {...registerEdit('batchNumber')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Expiry Date *</label>
              <input
                type="date"
                {...registerEdit('expiryDate')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Stock Quantity *</label>
              <input
                type="number"
                {...registerEdit('quantity')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
              {errorsEdit.quantity && (
                <span className="text-[10px] text-destructive">{errorsEdit.quantity.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Alert Threshold *</label>
              <input
                type="number"
                {...registerEdit('threshold')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
              {errorsEdit.threshold && (
                <span className="text-[10px] text-destructive">{errorsEdit.threshold.message}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setEditingMedicine(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Delete batch Dialog */}
      <Dialog isOpen={!!deletingMedicine} onClose={() => setDeletingMedicine(null)} title="Delete Stock Entry">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Are you sure you want to delete the stock batch entry for{' '}
            <strong className="text-foreground">{deletingMedicine?.name}</strong> (batch:{' '}
            {deletingMedicine?.batch_number})? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingMedicine(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingMedicine && deleteMutation.mutate(deletingMedicine.id)}
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
