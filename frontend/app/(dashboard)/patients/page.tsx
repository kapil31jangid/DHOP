'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Stethoscope, UsersRound, Activity, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { PageHeader } from '@/components/dhop/page-header';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { Drawer } from '@/components/dhop/drawer';
import { Dialog } from '@/components/dhop/dialog';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

// Form validation schema
const patientFormSchema = z.object({
  patientIdCode: z.string().min(1, 'Patient ID Code is required (e.g. PT-1001)'),
  name: z.string().min(1, 'Full Name is required'),
  age: z.coerce.number().int().min(0, 'Age must be 0 or higher'),
  gender: z.string().min(1, 'Gender is required'),
  visitType: z.enum(['OPD', 'IPD']),
  diseaseCategory: z.string().optional(),
  assignedDoctor: z.string().optional(),
  visitDate: z.string().optional(),
  facilityId: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

export default function PatientsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [visitFilter, setVisitFilter] = useState<'ALL' | 'OPD' | 'IPD'>('ALL');
  
  // Dialog & Drawer state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<any | null>(null);

  // TanStack Query to fetch patients
  const { data: patients, isLoading, error } = useQuery<any[]>({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await api.get('/patients');
      return response.data?.data || [];
    },
  });

  // Fetch health centres for District Admin role
  const { data: healthCentres } = useQuery<any[]>({
    queryKey: ['health-centres-list'],
    queryFn: async () => {
      const response = await api.get('/health-centres');
      return response.data?.data || [];
    },
    enabled: user?.role === 'DISTRICT_ADMIN',
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (newPatient: PatientFormData) => {
      const response = await api.post('/patients', newPatient);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient registered successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to register patient');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PatientFormData }) => {
      const response = await api.patch(`/patients/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient details updated successfully');
      setEditingPatient(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update patient');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/patients/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient record deleted successfully');
      setDeletingPatient(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to delete patient');
    },
  });

  // React Hook Form setups
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      visitType: 'OPD',
      gender: 'Male',
      visitDate: new Date().toISOString().split('T')[0],
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
  });

  const handleEditClick = (patient: any) => {
    setEditingPatient(patient);
    resetEdit({
      patientIdCode: patient.patient_id_code,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      visitType: patient.visit_type,
      diseaseCategory: patient.disease_category || '',
      assignedDoctor: patient.assigned_doctor || '',
      visitDate: patient.visit_date ? new Date(patient.visit_date).toISOString().split('T')[0] : '',
      facilityId: patient.facility_id || '',
    });
  };

  const onSubmitCreate = (data: PatientFormData) => {
    createMutation.mutate(data);
  };

  const onSubmitUpdate = (data: PatientFormData) => {
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data });
    }
  };

  // Filter and search computation
  const filteredPatients = (patients || []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patient_id_code.toLowerCase().includes(search.toLowerCase()) ||
      (p.disease_category || '').toLowerCase().includes(search.toLowerCase());

    const matchesVisit = visitFilter === 'ALL' || p.visit_type === visitFilter;
    return matchesSearch && matchesVisit;
  });

  // Calculate statistics
  const totalPatientsCount = patients?.length || 0;
  const opdCount = patients?.filter((p) => p.visit_type === 'OPD').length || 0;
  const ipdCount = patients?.filter((p) => p.visit_type === 'IPD').length || 0;

  const isStaff = user?.role === 'HEALTHCARE_STAFF' || user?.role === 'FACILITY_ADMIN' || user?.role === 'DISTRICT_ADMIN';

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve patient records. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Register and manage patient records for this center.
          </p>
        </div>
        {isStaff && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Register Patient
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Registered Patients" value={String(totalPatientsCount)} icon={UsersRound} />
        <KpiCard label="OPD Patients" value={String(opdCount)} icon={Stethoscope} />
        <KpiCard label="IPD Patients" value={String(ipdCount)} icon={Activity} />
      </div>

      {isLoading ? (
        <TableSkeleton cols={8} />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Search toolbar */}
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
                placeholder="Search patients by code, name..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'OPD', 'IPD'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setVisitFilter(mode)}
                  className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    visitFilter === mode
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
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Patient ID</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Age</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Gender</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Visit Type</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Disease Category</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Assigned Doctor</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Visit Date</th>
                  {isStaff && <th className="w-20 px-4 py-2.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={isStaff ? 9 : 8} className="text-center py-12 text-muted-foreground">
                      No patient records found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{p.patient_id_code}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{p.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{p.age}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{p.gender}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge tone={p.visit_type === 'OPD' ? 'info' : 'warning'}>
                          {p.visit_type}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{p.disease_category || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{p.assigned_doctor || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {p.visit_date ? new Date(p.visit_date).toLocaleDateString() : '—'}
                      </td>
                      {isStaff && (
                        <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-1 hover:text-primary transition-colors inline-block"
                            title="Edit details"
                          >
                            <Edit2 className="size-4" />
                          </button>
                          {user?.role === 'FACILITY_ADMIN' && (
                            <button
                              onClick={() => setDeletingPatient(p)}
                              className="p-1 hover:text-destructive transition-colors inline-block"
                              title="Delete profile"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Patient Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register New Patient">
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
            <label className="text-xs font-semibold">Patient ID Code *</label>
            <input
              {...register('patientIdCode')}
              placeholder="e.g. PT-1001"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.patientIdCode && (
              <span className="text-[10px] text-destructive">{errors.patientIdCode.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Full Name *</label>
            <input
              {...register('name')}
              placeholder="e.g. Ramesh Kumar"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.name && <span className="text-[10px] text-destructive">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Age *</label>
              <input
                type="number"
                {...register('age')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {errors.age && <span className="text-[10px] text-destructive">{errors.age.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Gender *</label>
              <select
                {...register('gender')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="text-[10px] text-destructive">{errors.gender.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Visit Type *</label>
              <select
                {...register('visitType')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="OPD">OPD</option>
                <option value="IPD">IPD</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Visit Date</label>
              <input
                type="date"
                {...register('visitDate')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Disease Category</label>
            <input
              {...register('diseaseCategory')}
              placeholder="e.g. Viral Fever"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Assigned Doctor</label>
            <input
              {...register('assignedDoctor')}
              placeholder="Dr. S. Verma"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
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

      {/* Edit Patient Drawer */}
      <Drawer isOpen={!!editingPatient} onClose={() => setEditingPatient(null)} title="Modify Patient Profile">
        <form onSubmit={handleSubmitEdit(onSubmitUpdate)} className="flex flex-col gap-4">
          {user?.role === 'DISTRICT_ADMIN' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Assigned Health Centre *</label>
              <select
                {...registerEdit('facilityId')}
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
              {errorsEdit.facilityId && (
                <span className="text-[10px] text-destructive">{errorsEdit.facilityId.message}</span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Patient ID Code *</label>
            <input
              {...registerEdit('patientIdCode')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.patientIdCode && (
              <span className="text-[10px] text-destructive">{errorsEdit.patientIdCode.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Full Name *</label>
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
              <label className="text-xs font-semibold">Age *</label>
              <input
                type="number"
                {...registerEdit('age')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
              {errorsEdit.age && (
                <span className="text-[10px] text-destructive">{errorsEdit.age.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Gender *</label>
              <select
                {...registerEdit('gender')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Visit Type *</label>
              <select
                {...registerEdit('visitType')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="OPD">OPD</option>
                <option value="IPD">IPD</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Visit Date</label>
              <input
                type="date"
                {...registerEdit('visitDate')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Disease Category</label>
            <input
              {...registerEdit('diseaseCategory')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Assigned Doctor</label>
            <input
              {...registerEdit('assignedDoctor')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setEditingPatient(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Delete Patient confirmation Dialog */}
      <Dialog isOpen={!!deletingPatient} onClose={() => setDeletingPatient(null)} title="Delete Patient Record">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Are you sure you want to delete the patient record for{' '}
            <strong className="text-foreground">{deletingPatient?.name}</strong> ({deletingPatient?.patient_id_code})?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingPatient(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingPatient && deleteMutation.mutate(deletingPatient.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Record'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
