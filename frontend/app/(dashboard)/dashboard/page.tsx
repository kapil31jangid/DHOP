'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, UsersRound, BedDouble, AlertTriangle, CalendarCheck, FileBarChart, Bell, Download } from 'lucide-react';
import api from '@/lib/api';
import { KpiCard } from '@/components/dhop/kpi-card';
import { KpiSkeleton } from '@/components/dhop/skeleton';
import { QuickActionCard } from '@/components/dhop/quick-action-card';
import { exportToCSV } from '@/utils/export-utils';
import { toast } from 'sonner';

export default function DistrictDashboardPage() {
  // Fetch everything to aggregate district metrics
  const { data: centres, isLoading: isLoadingCentres } = useQuery<any[]>({
    queryKey: ['dashboard-centres'],
    queryFn: async () => {
      const res = await api.get('/health-centres');
      return res.data?.data || [];
    },
  });

  const { data: patients, isLoading: isLoadingPatients } = useQuery<any[]>({
    queryKey: ['dashboard-patients'],
    queryFn: async () => {
      const res = await api.get('/patients');
      return res.data?.data || [];
    },
  });

  const { data: beds, isLoading: isLoadingBeds } = useQuery<any[]>({
    queryKey: ['dashboard-beds'],
    queryFn: async () => {
      const res = await api.get('/beds');
      return res.data?.data || [];
    },
  });

  const { data: medicines, isLoading: isLoadingMeds } = useQuery<any[]>({
    queryKey: ['dashboard-medicines'],
    queryFn: async () => {
      const res = await api.get('/medicines');
      return res.data?.data || [];
    },
  });

  const { data: attendance, isLoading: isLoadingAttendance } = useQuery<any[]>({
    queryKey: ['dashboard-attendance'],
    queryFn: async () => {
      const res = await api.get('/attendance');
      return res.data?.data || [];
    },
  });

  const loading =
    isLoadingCentres ||
    isLoadingPatients ||
    isLoadingBeds ||
    isLoadingMeds ||
    isLoadingAttendance;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">District Dashboard</h1>
          <p className="text-sm text-muted-foreground">Compiling district analytics...</p>
        </div>
        <KpiSkeleton />
      </div>
    );
  }

  // Calculate stats
  const totalCentres = centres?.length || 0;
  const activeCentres = centres?.filter((c) => c.status === 'Active').length || 0;
  const totalPatients = patients?.length || 0;
  
  const totalBeds = beds?.length || 0;
  const occupiedBeds = beds?.filter((b) => b.status === 'Occupied').length || 0;
  const bedUtilization = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const lowStockCount = medicines?.filter((m) => m.quantity <= m.threshold).length || 0;
  const presentStaff = attendance?.filter((a) => a.status === 'Present').length || 0;

  const handleExportSummary = () => {
    if (!centres || centres.length === 0) {
      toast.error('No health centre data available to export');
      return;
    }
    const headers = ['Name', 'Type', 'Address', 'Contact Number', 'Status'];
    const rows = centres.map((c) => [
      c.name,
      c.type,
      c.address || '',
      c.contact_number || '',
      c.status,
    ]);
    exportToCSV('District-Centres-Summary', headers, rows);
    toast.success('Health Centres summary exported successfully');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">District Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Aggregated operations metrics across all health centres.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard label="Active Centres" value={`${activeCentres} / ${totalCentres}`} icon={Building2} />
        <KpiCard label="Patients Registered Today" value={String(totalPatients)} icon={UsersRound} />
        <KpiCard
          label="Bed Utilization"
          value={`${bedUtilization}%`}
          icon={BedDouble}
          tone={bedUtilization > 80 ? 'critical' : bedUtilization > 50 ? 'warning' : 'success'}
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
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickActionCard
            label="View Reports"
            description="Access district-wide periodic health sheets and summaries."
            href="/reports"
            icon={FileBarChart}
          />
          <QuickActionCard
            label="View Notifications"
            description="Check system messages, threshold flags, and broadcast status."
            href="/notifications"
            icon={Bell}
          />
          <QuickActionCard
            label="Export Summary"
            description="Instantly export district center registers as CSV table."
            onClick={handleExportSummary}
            icon={Download}
          />
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Centers distribution */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
            Health Centres Distribution
          </h3>
          <div className="space-y-4">
            {['PHC', 'CHC', 'DH'].map((type) => {
              const count = centres?.filter((c) => c.type === type).length || 0;
              const percent = totalCentres > 0 ? Math.round((count / totalCentres) * 100) : 0;
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{type === 'PHC' ? 'Primary Health Centres (PHC)' : type === 'CHC' ? 'Community Health Centres (CHC)' : 'District Hospitals (DH)'}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
            Critical Alerts Summary
          </h3>
          <div className="space-y-3">
            {lowStockCount > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertTriangle className="size-5 shrink-0" />
                <span>{lowStockCount} medicines are below warning thresholds. Action required.</span>
              </div>
            )}
            {bedUtilization > 80 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <BedDouble className="size-5 shrink-0" />
                <span>Critical bed utilization ({bedUtilization}%) across district.</span>
              </div>
            )}
            {lowStockCount === 0 && bedUtilization <= 80 && (
              <div className="text-center py-8 text-sm text-muted-foreground italic">
                All systems reporting normal. No critical alerts.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
