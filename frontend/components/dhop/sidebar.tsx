'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  BedDouble,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  Pill,
  ScrollText,
  Settings,
  Users,
  UsersRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  {
    section: 'Overview',
    items: [
      { label: 'District Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Facility Dashboard', href: '/facility', icon: Activity },
    ],
  },
  {
    section: 'Operations',
    items: [
      { label: 'Health Centres', href: '/health-centres', icon: Building2 },
      { label: 'Patients', href: '/patients', icon: UsersRound },
      { label: 'Medicines', href: '/medicines', icon: Pill },
      { label: 'Beds', href: '/beds', icon: BedDouble },
      { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
    ],
  },
  {
    section: 'Management',
    items: [
      { label: 'Reports', href: '/reports', icon: FileBarChart },
      { label: 'Users', href: '/users', icon: Users },
      { label: 'Notifications', href: '/notifications', icon: ClipboardList },
      { label: 'Audit Logs', href: '/audit-logs', icon: ScrollText },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
      {nav.map((group) => (
        <div key={group.section} className="flex flex-col gap-1">
          <span className="px-2 pb-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {group.section}
          </span>
          {group.items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-all duration-200',
                  active
                    ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-xs'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-primary',
                )}
              >
                <item.icon
                  className={cn(
                    'size-4 transition-colors',
                    active ? 'text-primary' : 'text-sidebar-foreground/65 group-hover:text-primary',
                  )}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
