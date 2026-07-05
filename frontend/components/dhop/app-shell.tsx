'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronRight, HeartPulse, LogOut, Menu, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarNav } from '@/components/dhop/sidebar'
import { StatusBadge } from '@/components/dhop/status-badge'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, string> = {
  '/dashboard': 'District Dashboard',
  '/facility': 'Facility Dashboard',
  '/health-centres': 'Health Centres',
  '/patients': 'Patients',
  '/medicines': 'Medicines',
  '/beds': 'Beds',
  '/attendance': 'Attendance',
  '/reports': 'Reports',
  '/users': 'Users',
  '/notifications': 'Notifications',
  '/audit-logs': 'Audit Logs',
  '/settings': 'Settings',
}

const drawerNotifications = [
  { tone: 'critical' as const, label: 'Critical', title: 'Paracetamol below threshold at PHC Rampur', time: '5m ago' },
  { tone: 'warning' as const, label: 'Warning', title: 'Attendance not submitted — CHC Bhairavi', time: '32m ago' },
  { tone: 'critical' as const, label: 'Critical', title: 'Full bed occupancy at CHC Sundarpur', time: '1h ago' },
  { tone: 'info' as const, label: 'Info', title: 'Weekly report generated for PHC Lakshmi Nagar', time: '2h ago' },
]

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-1">
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <HeartPulse className="size-4" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">DHOP</span>
        <span className="text-[10px] text-muted-foreground">
          District Health Ops
        </span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Dashboard'

  return (
    <div className="flex min-h-svh">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Logo />
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar shadow-xl">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <Logo />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close menu"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur lg:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-4" aria-hidden="true" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              Dashboard
            </span>
            <ChevronRight
              className="hidden size-3.5 text-muted-foreground sm:inline"
              aria-hidden="true"
            />
            <span className="truncate font-medium">{title}</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Notifications"
                onClick={() => {
                  setDrawerOpen((o) => !o)
                  setProfileOpen(false)
                }}
              >
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <span
                className="absolute top-0.5 right-0.5 size-2 rounded-full bg-destructive"
                aria-hidden="true"
              />
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                onClick={() => {
                  setProfileOpen((o) => !o)
                  setDrawerOpen(false)
                }}
                className="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors hover:bg-muted"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  DA
                </span>
                <span className="hidden flex-col items-start leading-tight sm:flex">
                  <span className="text-xs font-medium">Dr. A. Sharma</span>
                  <span className="text-[10px] text-muted-foreground">
                    District Admin
                  </span>
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border bg-popover p-1 shadow-md">
                  {[
                    { icon: User, label: 'My Profile' },
                    { icon: Bell, label: 'Change Password' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <item.icon
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {item.label}
                    </button>
                  ))}
                  <div className="my-1 border-t" />
                  <Link
                    href="/"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Notification drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close notifications"
              className="absolute inset-0 bg-foreground/20"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-card shadow-xl">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <h2 className="text-sm font-semibold">Notifications</h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close notifications"
                  onClick={() => setDrawerOpen(false)}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {drawerNotifications.map((n, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex flex-col gap-1.5 px-4 py-3',
                      i < drawerNotifications.length - 1 && 'border-b',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge tone={n.tone}>{n.label}</StatusBadge>
                      <span className="text-xs text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-sm text-pretty">{n.title}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t p-3">
                <Button variant="ghost" size="sm">
                  Mark all as read
                </Button>
                <Link
                  href="/notifications"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => setDrawerOpen(false)}
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
