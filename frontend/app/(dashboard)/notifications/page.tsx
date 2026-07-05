import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/dhop/page-header'
import { StatusBadge, type StatusTone } from '@/components/dhop/status-badge'
import { cn } from '@/lib/utils'

const notifications: {
  tone: StatusTone
  label: string
  title: string
  source: string
  time: string
  unread: boolean
}[] = [
  { tone: 'critical', label: 'Critical', title: 'Paracetamol 500mg below threshold', source: 'PHC Rampur · Medicines', time: '5m ago', unread: true },
  { tone: 'critical', label: 'Critical', title: 'Full bed occupancy in general ward', source: 'CHC Sundarpur · Beds', time: '1h ago', unread: true },
  { tone: 'warning', label: 'Warning', title: 'Attendance not submitted for today', source: 'CHC Bhairavi · Attendance', time: '2h ago', unread: true },
  { tone: 'warning', label: 'Warning', title: 'Amoxicillin batch A-204 expiring in 7 days', source: 'PHC Lakshmi Nagar · Medicines', time: '3h ago', unread: false },
  { tone: 'info', label: 'Info', title: 'Weekly report generated successfully', source: 'PHC Rampur · Reports', time: '5h ago', unread: false },
  { tone: 'success', label: 'Success', title: 'Medicine stock updated — 12 items restocked', source: 'CHC Motihari · Medicines', time: 'Yesterday', unread: false },
  { tone: 'info', label: 'Info', title: 'New user J. Thomas invited to CHC Bhairavi', source: 'District Admin · Users', time: 'Yesterday', unread: false },
]

const tabs = ['All', 'Critical', 'Warning', 'Information']

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="System alerts and important updates across the district."
        secondaryAction="Mark all as read"
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={cn(
              'border-b-2 px-3 py-2 text-sm transition-colors',
              i === 0
                ? 'border-primary font-medium text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-lg border bg-card">
        {notifications.map((n, i) => (
          <div
            key={i}
            className={cn(
              'flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
              i < notifications.length - 1 && 'border-b',
              n.unread && 'bg-accent/30',
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <StatusBadge tone={n.tone} className="mt-0.5 shrink-0">
                {n.label}
              </StatusBadge>
              <div className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    'truncate text-sm',
                    n.unread ? 'font-medium' : undefined,
                  )}
                >
                  {n.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {n.source} · {n.time}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="xs">
                View
              </Button>
              {n.unread && (
                <Button variant="ghost" size="xs">
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
