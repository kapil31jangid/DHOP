import Link from 'next/link'
import {
  BedDouble,
  CalendarCheck,
  FileBarChart,
  Pill,
  Plus,
  UsersRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/dhop/kpi-card'
import { PageHeader } from '@/components/dhop/page-header'
import { StatusBadge } from '@/components/dhop/status-badge'

const todaysAlerts = [
  { tone: 'critical' as const, text: '2 medicines below threshold', href: '/medicines' },
  { tone: 'warning' as const, text: 'Only 4 beds remaining in general ward', href: '/beds' },
  { tone: 'warning' as const, text: 'Attendance not submitted for 3 staff', href: '/attendance' },
  { tone: 'info' as const, text: 'Amoxicillin batch A-204 expires tomorrow', href: '/medicines' },
]

const quickActions = [
  { label: 'Add Patient', href: '/patients' },
  { label: 'Add Medicine', href: '/medicines' },
  { label: 'Update Bed Status', href: '/beds' },
  { label: 'Mark Attendance', href: '/attendance' },
  { label: 'Generate Report', href: '/reports' },
]

const activity = [
  { text: 'Patient Ramesh Kumar registered (OPD)', time: '8m ago' },
  { text: 'Paracetamol stock updated to 250 units', time: '30m ago' },
  { text: 'Attendance submitted for morning shift', time: '1h ago' },
  { text: 'Bed B-12 marked available', time: '2h ago' },
]

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export default function FacilityDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="PHC Rampur — Facility Dashboard"
        description="Daily operations overview for this health centre."
        secondaryAction="Generate Report"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Today's Patients" value="64" icon={UsersRound} trend="+9" trendUp href="/patients" />
        <KpiCard label="Available Beds" value="8 / 20" icon={BedDouble} href="/beds" />
        <KpiCard label="Low Stock" value="3" icon={Pill} tone="critical" href="/medicines" />
        <KpiCard label="Staff Attendance" value="92%" icon={CalendarCheck} trend="+3%" trendUp href="/attendance" />
        <KpiCard label="Pending Reports" value="1" icon={FileBarChart} tone="warning" href="/reports" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Today's alerts */}
        <section className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Today&apos;s Alerts</h2>
          <div className="flex flex-col">
            {todaysAlerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 py-2.5 ${
                  i < todaysAlerts.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <StatusBadge tone={alert.tone} className="shrink-0">
                    {alert.tone === 'critical'
                      ? 'Critical'
                      : alert.tone === 'warning'
                        ? 'Warning'
                        : 'Info'}
                  </StatusBadge>
                  <span className="truncate text-sm">{alert.text}</span>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  render={<Link href={alert.href} />}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="justify-start"
                render={<Link href={action.href} />}
              >
                <Plus className="size-4 text-primary" aria-hidden="true" />
                {action.label}
              </Button>
            ))}
          </div>
        </section>
      </div>

      {/* Summary widgets + activity */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section className="flex flex-col gap-1 rounded-lg border bg-card p-4">
          <h2 className="pb-1 text-sm font-semibold">Medicine Status</h2>
          <SummaryRow label="Total Medicines" value="148" />
          <SummaryRow label="Low Stock" value="3" />
          <SummaryRow label="Expiring Soon" value="5" />
        </section>
        <section className="flex flex-col gap-1 rounded-lg border bg-card p-4">
          <h2 className="pb-1 text-sm font-semibold">Bed Summary</h2>
          <SummaryRow label="Total Beds" value="20" />
          <SummaryRow label="Occupied" value="12" />
          <SummaryRow label="Available" value="8" />
        </section>
        <section className="flex flex-col gap-1 rounded-lg border bg-card p-4">
          <h2 className="pb-1 text-sm font-semibold">Attendance Summary</h2>
          <SummaryRow label="Present" value="23" />
          <SummaryRow label="Absent" value="2" />
          <SummaryRow label="Attendance %" value="92%" />
        </section>
        <section className="flex flex-col gap-2 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
          <ul className="flex flex-col">
            {activity.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 py-1.5 ${
                  i < activity.length - 1 ? 'border-b' : ''
                }`}
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span className="text-xs leading-snug">
                  {item.text}
                  <span className="text-muted-foreground"> · {item.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
