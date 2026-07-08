'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Users, Shield, Plus, Search, Trash2, Edit2, Key } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { Drawer } from '@/components/dhop/drawer';
import { Dialog } from '@/components/dhop/dialog';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

const userFormSchema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  role: z.enum(['DISTRICT_ADMIN', 'FACILITY_ADMIN', 'HEALTHCARE_STAFF', 'OPERATIONS_STAFF']),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  facilityId: z.string().nullable().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const isDistrictAdmin = currentUser?.role === 'DISTRICT_ADMIN';

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'DISTRICT_ADMIN' | 'FACILITY_ADMIN' | 'HEALTHCARE_STAFF' | 'OPERATIONS_STAFF'>('ALL');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('add') === 'true' && isDistrictAdmin) {
        setIsCreateOpen(true);
      }
    }
  }, [isDistrictAdmin]);

  // Queries
  const { data: users, isLoading, error } = useQuery<any[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data?.data || [];
    },
  });

  const { data: healthCentres } = useQuery<any[]>({
    queryKey: ['health-centres-list-for-users'],
    queryFn: async () => {
      const response = await api.get('/health-centres');
      return response.data?.data || [];
    },
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (newUser: UserFormData) => {
      const response = await api.post('/users', {
        ...newUser,
        facilityId: newUser.role === 'DISTRICT_ADMIN' ? null : newUser.facilityId || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User registered successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to register user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<UserFormData, 'password'> }) => {
      const response = await api.patch(`/users/${id}`, {
        ...data,
        facilityId: data.role === 'DISTRICT_ADMIN' ? null : data.facilityId || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User profile updated successfully');
      setEditingUser(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update user profile');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User account deleted successfully');
      setDeletingUser(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to delete user');
    },
  });

  // Forms setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: 'HEALTHCARE_STAFF',
      status: 'Active',
      facilityId: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    watch: watchEdit,
    formState: { errors: errorsEdit },
  } = useForm<Omit<UserFormData, 'password'>>({
    resolver: zodResolver(userFormSchema.omit({ password: true })),
  });

  const selectedRole = watch('role');
  const selectedRoleEdit = watchEdit('role');

  const handleEditClick = (userRecord: any) => {
    setEditingUser(userRecord);
    resetEdit({
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role,
      status: userRecord.status,
      facilityId: userRecord.facility_id || '',
    });
  };

  const onSubmitCreate = (data: UserFormData) => {
    if (!data.password) {
      toast.error('Password is required to create a new user account');
      return;
    }
    createMutation.mutate(data);
  };

  const onSubmitUpdate = (data: Omit<UserFormData, 'password'>) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    }
  };

  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // KPI statistics
  const totalUsersCount = users?.length || 0;
  const adminCount = users?.filter((u) => u.role === 'DISTRICT_ADMIN' || u.role === 'FACILITY_ADMIN').length || 0;
  const staffCount = users?.filter((u) => u.role === 'HEALTHCARE_STAFF' || u.role === 'OPERATIONS_STAFF').length || 0;



  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve staff user profiles. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage system access accounts, roles, and facility configurations.
          </p>
        </div>
        {isDistrictAdmin && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Provision User
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Staff Registered" value={String(totalUsersCount)} icon={Users} />
        <KpiCard label="Administrators" value={String(adminCount)} icon={Shield} />
        <KpiCard label="Operations/Healthcare Staff" value={String(staffCount)} icon={Users} />
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
                placeholder="Search users by name, email..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['ALL', 'DISTRICT_ADMIN', 'FACILITY_ADMIN', 'HEALTHCARE_STAFF', 'OPERATIONS_STAFF'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`h-8 px-3 rounded-lg border text-[11px] font-medium whitespace-nowrap transition-colors ${
                    roleFilter === role
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Assigned Facility</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  {isDistrictAdmin && <th className="w-20 px-4 py-2.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={isDistrictAdmin ? 6 : 5} className="text-center py-12 text-muted-foreground">
                      No user profiles found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const facilityName = healthCentres?.find((hc) => hc.id === u.facility_id)?.name;
                    return (
                      <tr key={u.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{u.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{u.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap capitalize text-xs text-muted-foreground">
                          {u.role.replace('_', ' ').toLowerCase()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          {u.role === 'DISTRICT_ADMIN' ? (
                            <span className="text-primary/70 font-semibold italic">District-Wide</span>
                          ) : facilityName ? (
                            facilityName
                          ) : (
                            <span className="text-muted-foreground italic">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge tone={u.status === 'Active' ? 'success' : 'critical'}>
                            {u.status}
                          </StatusBadge>
                        </td>
                        {isDistrictAdmin && (
                          <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(u)}
                              className="p-1 hover:text-primary transition-colors inline-block"
                              title="Edit user profile"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            {currentUser?.id !== u.id && (
                              <button
                                onClick={() => setDeletingUser(u)}
                                className="p-1 hover:text-destructive transition-colors inline-block"
                                title="Remove User"
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

      {/* Provision User Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Provision Staff Account">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Full Name *</label>
            <input
              {...register('name')}
              placeholder="e.g. Dr. Ramesh Kumar"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.name && <span className="text-[10px] text-destructive">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Email Address *</label>
            <input
              type="email"
              {...register('email')}
              placeholder="ramesh@district.health"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errors.email && <span className="text-[10px] text-destructive">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Temporal Password *</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.password && <span className="text-[10px] text-destructive">{errors.password.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Role *</label>
              <select
                {...register('role')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="HEALTHCARE_STAFF">Healthcare Staff</option>
                <option value="OPERATIONS_STAFF">Operations Staff</option>
                <option value="FACILITY_ADMIN">Facility Admin</option>
                <option value="DISTRICT_ADMIN">District Admin</option>
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

          {selectedRole !== 'DISTRICT_ADMIN' && (
            <div className="flex flex-col gap-1 animate-fade-in">
              <label className="text-xs font-semibold">Assigned Health Centre *</label>
              <select
                {...register('facilityId')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              >
                <option value="">Choose Centre...</option>
                {healthCentres?.map((hc) => (
                  <option key={hc.id} value={hc.id}>
                    {hc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Provisioning...' : 'Provision Account'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit User Drawer */}
      <Drawer isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Modify User Account">
        <form onSubmit={handleSubmitEdit(onSubmitUpdate)} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Email Address *</label>
            <input
              type="email"
              {...registerEdit('email')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            {errorsEdit.email && (
              <span className="text-[10px] text-destructive">{errorsEdit.email.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Role *</label>
              <select
                {...registerEdit('role')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="HEALTHCARE_STAFF">Healthcare Staff</option>
                <option value="OPERATIONS_STAFF">Operations Staff</option>
                <option value="FACILITY_ADMIN">Facility Admin</option>
                <option value="DISTRICT_ADMIN">District Admin</option>
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

          {selectedRoleEdit !== 'DISTRICT_ADMIN' && isDistrictAdmin && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Assigned Health Centre *</label>
              <select
                {...registerEdit('facilityId')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              >
                <option value="">Choose Centre...</option>
                {healthCentres?.map((hc) => (
                  <option key={hc.id} value={hc.id}>
                    {hc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Delete User Confirmation Dialog */}
      <Dialog isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title="Delete Staff Account">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Are you sure you want to delete the user account for{' '}
            <strong className="text-foreground">{deletingUser?.name}</strong> ({deletingUser?.email})? This will permanently
            revoke access and remove their profile.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingUser && deleteMutation.mutate(deletingUser.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
