'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ScrollText } from 'lucide-react';
import api from '@/lib/api';
import { KpiCard } from '@/components/dhop/kpi-card';
import { StatusBadge } from '@/components/dhop/status-badge';
import { TableSkeleton } from '@/components/dhop/skeleton';

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'CREATE' | 'UPDATE' | 'DELETE'>('ALL');

  // Queries
  const { data: auditLogs, isLoading, error } = useQuery<any[]>({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await api.get('/audit-logs');
      return response.data?.data || [];
    },
  });

  const { data: staffList } = useQuery<any[]>({
    queryKey: ['staff-list-for-audit-logs'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data?.data || [];
    },
  });

  const { data: healthCentres } = useQuery<any[]>({
    queryKey: ['health-centres-list-for-audit-logs'],
    queryFn: async () => {
      const response = await api.get('/health-centres');
      return response.data?.data || [];
    },
  });

  const filteredLogs = (auditLogs || []).filter((l) => {
    const staffName = staffList?.find((s) => s.id === l.user_id)?.name || '';
    const matchesSearch =
      l.module.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      staffName.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalLogsCount = auditLogs?.length || 0;
  const createCount = auditLogs?.filter((l) => l.action === 'CREATE').length || 0;
  const updateCount = auditLogs?.filter((l) => l.action === 'UPDATE').length || 0;
  const deleteCount = auditLogs?.filter((l) => l.action === 'DELETE').length || 0;

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-semibold text-destructive">Database Connection Interrupted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to retrieve audit logs. Please verify backend API status and database configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          View immutable activity logs and database transaction logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KpiCard label="Logs Stored" value={String(totalLogsCount)} icon={ScrollText} />
        <KpiCard label="Creations" value={String(createCount)} icon={ScrollText} tone="success" />
        <KpiCard label="Modifications" value={String(updateCount)} icon={ScrollText} tone="neutral" />
        <KpiCard label="Deletions" value={String(deleteCount)} icon={ScrollText} tone="critical" />
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
                placeholder="Search logs by staff, module..."
                className="h-8 w-full rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'CREATE', 'UPDATE', 'DELETE'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActionFilter(mode)}
                  className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    actionFilter === mode
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
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Facility</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Module</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Action</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Description</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      No transaction history logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((l) => {
                    const staffName = staffList?.find((s) => s.id === l.user_id)?.name || 'System';
                    const facilityName = healthCentres?.find((hc) => hc.id === l.facility_id)?.name || 'Global';
                    return (
                      <tr key={l.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{staffName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">{facilityName}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-xs">{l.module}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge
                            tone={
                              l.action === 'CREATE'
                                ? 'success'
                                : l.action === 'DELETE'
                                ? 'critical'
                                : 'warning'
                            }
                          >
                            {l.action}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-sm truncate">
                          {l.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          {l.timestamp ? new Date(l.timestamp).toLocaleString() : '—'}
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
    </div>
  );
}
