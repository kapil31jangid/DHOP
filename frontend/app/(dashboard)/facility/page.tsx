'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UsersRound, BedDouble, AlertTriangle, CalendarCheck, Stethoscope, Pill, FileBarChart } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { KpiCard } from '@/components/dhop/kpi-card';
import { KpiSkeleton } from '@/components/dhop/skeleton';
import { QuickActionCard } from '@/components/dhop/quick-action-card';

export default function FacilityDashboardPage() {
  const { user } = useAuthStore();

  // Queries (backend automatically scopes these endpoints based on user's facilityId)
  const { data: patients, isLoading: isLoadingPatients } = useQuery<any[]>({
    queryKey: ['facility-patients'],
    queryFn: async () => {
      const res = await api.get('/patients');
      return res.data?.data || [];
    },
  });

  const { data: beds, isLoading: isLoadingBeds } = useQuery<any[]>({
    queryKey: ['facility-beds'],
    queryFn: async () => {
      const res = await api.get('/beds');
      return res.data?.data || [];
    },
  });

  const { data: medicines, isLoading: isLoadingMeds } = useQuery<any[]>({
    queryKey: ['facility-medicines'],
    queryFn: async () => {
      const res = await api.get('/medicines');
      return res.data?.data || [];
    },
  });

  const { data: attendance, isLoading: isLoadingAttendance } = useQuery<any[]>({
    queryKey: ['facility-attendance'],
    queryFn: async () => {
      const res = await api.get('/attendance');
      return res.data?.data || [];
    },
  });

  const loading =
    isLoadingPatients ||
    isLoadingBeds ||
    isLoadingMeds ||
    isLoadingAttendance;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facility Dashboard</h1>
          <p className="text-sm text-muted-foreground">Compiling facility stats...</p>
        </div>
        <KpiSkeleton />
      </div>
    );
  }

  // Calculate stats
  const totalPatients = patients?.length || 0;
  const opdCount = patients?.filter((p) => p.visit_type === 'OPD').length || 0;
  const ipdCount = patients?.filter((p) => p.visit_type === 'IPD').length || 0;

  const totalBeds = beds?.length || 0;
  const occupiedBeds = beds?.filter((b) => b.status === 'Occupied').length || 0;
  const availableBeds = beds?.filter((b) => b.status === 'Available').length || 0;

  const lowStockCount = medicines?.filter((m) => m.quantity <= m.threshold).length || 0;
  const presentStaff = attendance?.filter((a) => a.status === 'Present').length || 0;

  const getQuickActions = () => {
    const role = user?.role;
    const actions = [];

    // Register Patient
    if (role === 'FACILITY_ADMIN' || role === 'HEALTHCARE_STAFF') {
      actions.push({
        label: 'Register Patient',
        description: 'Check in or admit a new patient record.',
        href: '/patients',
        icon: UsersRound,
      });
    }

    // Add Medicine / Update stock
    if (role === 'FACILITY_ADMIN' || role === 'HEALTHCARE_STAFF') {
      actions.push({
        label: role === 'FACILITY_ADMIN' ? 'Add Medicine' : 'Update Medicine Stock',
        description: 'Manage medicine quantities and warning thresholds.',
        href: '/medicines',
        icon: Pill,
      });
    }

    // Update Bed Status
    if (role === 'FACILITY_ADMIN' || role === 'OPERATIONS_STAFF') {
      actions.push({
        label: 'Update Bed Status',
        description: 'Allocate beds or set maintenance parameters.',
        href: '/beds',
        icon: BedDouble,
      });
    }

    // Mark Attendance
    if (role === 'FACILITY_ADMIN' || role === 'OPERATIONS_STAFF') {
      actions.push({
        label: 'Mark Attendance',
        description: 'Log daily check-in/out times for duty rosters.',
        href: '/attendance',
        icon: CalendarCheck,
      });
    }

    // Generate Report
    if (role === 'FACILITY_ADMIN') {
      actions.push({
        label: 'Generate Report',
        description: 'Compile daily/weekly health analytics sheets.',
        href: '/reports',
        icon: FileBarChart,
      });
    }

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Facility Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Operational overview for your assigned healthcare facility.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Patients Registered Today" value={String(totalPatients)} icon={UsersRound} />
        <KpiCard
          label="Beds Available"
          value={`${availableBeds} / ${totalBeds}`}
          icon={BedDouble}
          tone={availableBeds === 0 ? 'critical' : availableBeds < 3 ? 'warning' : 'success'}
        />
        <KpiCard
          label="Low Stock Medicines"
          value={String(lowStockCount)}
          icon={AlertTriangle}
          tone={lowStockCount > 0 ? 'critical' : 'neutral'}
        />
        <KpiCard label="Staff Present Today" value={String(presentStaff)} icon={CalendarCheck} tone="success" />
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action, idx) => (
              <QuickActionCard
                key={idx}
                label={action.label}
                description={action.description}
                href={action.href}
                icon={action.icon}
              />
            ))}
          </div>
        </div>
      )}

      {/* Operational highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Register breakdown */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
            Patient Visit Channels
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-info/10 text-info">
                  <Stethoscope className="size-5" />
                </span>
                <div>
                  <h4 className="text-sm font-medium text-foreground">OPD visits</h4>
                  <p className="text-xs text-muted-foreground">Out-patient diagnostics</p>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground">{opdCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-warning/10 text-warning">
                  <BedDouble className="size-5" />
                </span>
                <div>
                  <h4 className="text-sm font-medium text-foreground">IPD admissions</h4>
                  <p className="text-xs text-muted-foreground">In-patient ward occupancy</p>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground">{ipdCount}</span>
            </div>
          </div>
        </div>

        {/* Inventory alerts */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
            Critical Shortage Warnings
          </h3>
          <div className="space-y-3">
            {lowStockCount > 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertTriangle className="size-5 shrink-0" />
                <span>{lowStockCount} medicines are below inventory thresholds. Reorder immediately.</span>
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground italic">
                Medicine inventory is fully stocked.
              </div>
            )}
            {availableBeds === 0 && totalBeds > 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <BedDouble className="size-5 shrink-0" />
                <span>No general or ICU beds currently available.</span>
              </div>
            ) : (
              availableBeds < 3 && totalBeds > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm font-medium">
                  <BedDouble className="size-5 shrink-0" />
                  <span>Bed capacity is low ({availableBeds} available).</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
