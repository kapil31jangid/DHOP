'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarCheck, Users, Clock, AlertTriangle, Plus, Search, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { Drawer } from '@/components/dhop/drawer';
import { TableSkeleton } from '@/components/dhop/skeleton';
import { Button } from '@/components/ui/button';

const attendanceFormSchema = z.object({
  userId: z.string().min(1, 'Staff Member is required'),
  date: z.string().min(1, 'Date is required'),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.enum(['Present', 'Absent', 'Leave']),
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Present' | 'Absent' | 'Leave'>('ALL');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<any | null>(null);

  // Queries
  const { data: attendanceList, isLoading, error } = useQuery<any[]>({
    queryKey: ['attendance'],
    queryFn: async () => {
      const response = await api.get('/attendance');
      return response.data?.data || [];
    },
  });

  const { data: staffList } = useQuery<any[]>({
    queryKey: ['users-list-for-attendance'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data?.data || [];
    },
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (newLog: AttendanceFormData) => {
      const response = await api.post('/attendance', {
        ...newLog,
        checkIn: newLog.checkIn || null,
        checkOut: newLog.checkOut || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance logged successfully');
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to log attendance');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<AttendanceFormData, 'userId'> }) => {
      const response = await api.patch(`/attendance/${id}`, {
        ...data,
        checkIn: data.checkIn || null,
        checkOut: data.checkOut || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance record updated successfully');
      setEditingAttendance(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update attendance');
    },
  });

  // Forms setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      status: 'Present',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00',
      checkOut: '17:00',
      userId: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<Omit<AttendanceFormData, 'userId'>>({
    resolver: zodResolver(attendanceFormSchema.omit({ userId: true })),
  });

  const handleEditClick = (log: any) => {
    setEditingAttendance(log);
    resetEdit({
      date: log.date ? new Date(log.date).toISOString().split('T')[0] : '',
      checkIn: log.check_in || '',
      checkOut: log.check_out || '',
      status: log.status,
    });
  };

  const onSubmitCreate = (data: AttendanceFormData) => {
    createMutation.mutate(data);
  };

  const onSubmitUpdate = (data: Omit<AttendanceFormData, 'userId'>) => {
    if (editingAttendance) {
      updateMutation.mutate({ id: editingAttendance.id, data });
    }
  };

  const filteredAttendance = (attendanceList || []).filter((a) => {
    const staffName = staffList?.find((s) => s.id === a.user_id)?.name || '';
    const matchesSearch =
      staffName.toLowerCase().includes(search.toLowerCase()) ||
      (a.status || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics calculation
  const totalLogsCount = attendanceList?.length || 0;
  const presentCount = attendanceList?.filter((a) => a.status === 'Present').length || 0;
  const leaveCount = attendanceList?.filter((a) => a.status === 'Leave').length || 0;

  const isOps =
    currentUser?.role === 'OPERATIONS_STAFF' ||
    currentUser?.role === 'FACILITY_ADMIN';

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve attendance logs. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage daily staff attendance and duty times.
          </p>
        </div>
        {isOps && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex items-center gap-1.5">
            <Plus className="size-4" /> Log Attendance
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Logs Recorded" value={String(totalLogsCount)} icon={CalendarCheck} />
        <KpiCard label="Present Today" value={String(presentCount)} icon={Users} tone="success" />
        <KpiCard
          label="On Leave"
          value={String(leaveCount)}
          icon={AlertTriangle}
          tone={leaveCount > 0 ? 'warning' : 'neutral'}
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
                placeholder="Search logs by staff name..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'Present', 'Absent', 'Leave'] as const).map((mode) => (
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
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Staff Member</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Check-in</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Check-out</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  {isOps && <th className="w-20 px-4 py-2.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={isOps ? 7 : 6} className="text-center py-12 text-muted-foreground">
                      No attendance logs recorded.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((a) => {
                    const staff = staffList?.find((s) => s.id === a.user_id);
                    const staffName = staff?.name || '—';
                    const staffRole = staff?.role
                      ? staff.role.replace('_', ' ').toLowerCase()
                      : '—';
                    return (
                      <tr key={a.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{staffName}</td>
                        <td className="px-4 py-3 whitespace-nowrap capitalize text-xs text-muted-foreground">
                          {staffRole}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {a.date ? new Date(a.date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                          {a.check_in || '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                          {a.check_out || '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge
                            tone={
                              a.status === 'Present'
                                ? 'success'
                                : a.status === 'Leave'
                                ? 'warning'
                                : 'critical'
                            }
                          >
                            {a.status}
                          </StatusBadge>
                        </td>
                        {isOps && (
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(a)}
                              className="p-1 hover:text-primary transition-colors inline-block"
                              title="Edit log details"
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

      {/* Log Attendance Drawer */}
      <Drawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Log Attendance Record">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Select Staff Member *</label>
            <select
              {...register('userId')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            >
              <option value="">Choose Staff...</option>
              {staffList?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role.replace('_', ' ')})
                </option>
              ))}
            </select>
            {errors.userId && <span className="text-[10px] text-destructive">{errors.userId.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Date *</label>
            <input
              type="date"
              {...register('date')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Check-In Time</label>
              <input
                type="time"
                {...register('checkIn')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Check-Out Time</label>
              <input
                type="time"
                {...register('checkOut')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Attendance Status *</label>
            <select
              {...register('status')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Logging...' : 'Save Log'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Attendance Drawer */}
      <Drawer
        isOpen={!!editingAttendance}
        onClose={() => setEditingAttendance(null)}
        title="Update Attendance Log"
      >
        <form onSubmit={handleSubmitEdit(onSubmitUpdate)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Staff Member</label>
            <input
              type="text"
              value={staffList?.find((s) => s.id === editingAttendance?.user_id)?.name || ''}
              className="h-9 rounded-lg border bg-muted px-3 text-sm outline-none cursor-not-allowed"
              disabled
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Date *</label>
            <input
              type="date"
              {...registerEdit('date')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Check-In Time</label>
              <input
                type="time"
                {...registerEdit('checkIn')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold">Check-Out Time</label>
              <input
                type="time"
                {...registerEdit('checkOut')}
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Attendance Status *</label>
            <select
              {...registerEdit('status')}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setEditingAttendance(null)}>
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
