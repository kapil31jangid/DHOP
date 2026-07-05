import Link from 'next/link'
import {
  AlertTriangle,
  Building2,
  CalendarCheck,
  CircleCheck,
  Pill,
  UsersRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type Cell } from '@/components/dhop/data-table'
import { KpiCard } from '@/components/dhop/kpi-card'
import { PageHeader } from '@/components/dhop/page-header'
import { StatusBadge } from '@/components/dhop/status-badge'

const alerts = [
  {
    tone: 'critical' as const,
    title: 'Paracetamol 500mg below threshold',
    centre: 'PHC Rampur',
    time: '5m ago',
  },
  {
    tone: 'critical' as const,
    title: 'Full bed occupancy — general ward',
    centre: 'CHC Sundarpur',
    time: '1h ago',
  },
  {
    tone: 'warning' as const,
    title: 'Attendance not submitted today',
    centre: 'CHC Bhairavi',
    time: '2h ago',
  },
  {
    tone: 'warning' as const,
    title: 'Amoxicillin batch A-204 expires in 7 days',
    centre: 'PHC Lakshmi Nagar',
    time: '3h ago',
  },
]

const activity = [
  { text: 'PHC Rampur updated medicine stock', time: '10m ago' },
  { text: 'CHC Bhairavi submitted attendance', time: '25m ago' },
  { text: 'PHC Lakshmi Nagar generated weekly report', time: '1h ago' },
  { text: 'CHC Sundarpur registered 12 new patients', time: '2h ago' },
  { text: 'PHC Devgarh updated bed availability', time: '3h ago' },
]

const columns = [
  'Centre Name',
  'Type',
  "Today's Patients",
  'Available Beds',
  'Low Stock',
  'Attendance',
  'Last Updated',
  'Status',
]

const rows: Cell[][] = [
  ['PHC Rampur', 'PHC', '64', '8 / 20', '3', '92%', '10m ago', { badge: 'Critical', tone: 'critical' }],
  ['CHC Sundarpur', 'CHC', '118', '0 / 40', '1', '88%', '32m ago', { badge: 'Critical', tone: 'critical' }],
  ['CHC Bhairavi', 'CHC', '96', '12 / 40', '0', '71%', '2h ago', { badge: 'Warning', tone: 'warning' }],
  ['PHC Lakshmi Nagar', 'PHC', '48', '11 / 20', '2', '95%', '1h ago', { badge: 'Warning', tone: 'warning' }],
  ['PHC Devgarh', 'PHC', '39', '14 / 20', '0', '97%', '3h ago', { badge: 'Active', tone: 'success' }],
  ['District Hospital Central', 'DH', '284', '36 / 120', '0', '94%', '15m ago', { badge: 'Active', tone: 'success' }],
  ['PHC Kishanpur', 'PHC', '41', '9 / 20', '0', '90%', '45m ago', { badge: 'Active', tone: 'success' }],
  ['CHC Motihari', 'CHC', '87', '18 / 40', '0', '93%', '1h ago', { badge: 'Active', tone: 'success' }],
  ['PHC Shantipur', 'PHC', '0', '20 / 20', '0', '0%', '2d ago', { badge: 'Inactive', tone: 'neutral' }],
]

export default function DistrictDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="District Dashboard"
        description="Real-time overview of all health centres in the district."
        secondaryAction="Export Summary"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Centres" value="24" icon={Building2} href="/health-centres" />
        <KpiCard label="Active Centres" value="22" icon={CircleCheck} href="/health-centres" />
        <KpiCard label="Critical Alerts" value="4" icon={AlertTriangle} tone="critical" href="/notifications" />
        <KpiCard label="Patients Today" value="1,284" icon={UsersRound} trend="+12" trendUp href="/patients" />
        <KpiCard label="Low Stock Alerts" value="6" icon={Pill} tone="warning" href="/medicines" />
        <KpiCard label="Avg Attendance" value="91%" icon={CalendarCheck} trend="+2%" trendUp href="/attendance" />
      </div>

      {/* Alerts + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Critical Alerts</h2>
            <Link
              href="/notifications"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  i < alerts.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <StatusBadge tone={alert.tone} className="mt-0.5 shrink-0">
                    {alert.tone === 'critical' ? 'Critical' : 'Warning'}
                  </StatusBadge>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {alert.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {alert.centre} · {alert.time}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="xs">
                    View Centre
                  </Button>
                  <Button variant="ghost" size="xs">
                    Mark Reviewed
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
          <ul className="flex flex-col">
            {activity.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-2.5 py-2.5 ${
                  i < activity.length - 1 ? 'border-b' : ''
                }`}
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm leading-snug">{item.text}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Overview table */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Health Centre Overview</h2>
        <DataTable
          columns={columns}
          rows={rows}
          filters={['Centre Type', 'Status', 'Date']}
          searchPlaceholder="Search centres..."
          emptyLabel="No health centres available."
          emptyAction="Add Health Centre"
        />
      </section>
    </div>
  )
}
