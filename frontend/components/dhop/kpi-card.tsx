import React from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const KpiCard = React.memo(function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  href,
  tone = 'default',
}: {
  label: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  href?: string
  tone?: 'default' | 'critical' | 'warning'
}) {
  const card = (
    <div
      className={cn(
        'flex h-full flex-col gap-3 rounded-lg border bg-card p-4 transition-colors',
        href && 'hover:border-primary/40 hover:bg-accent/30',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon
          className={cn(
            'size-4 shrink-0',
            tone === 'critical'
              ? 'text-destructive'
              : tone === 'warning'
                ? 'text-warning'
                : 'text-primary',
          )}
          aria-hidden="true"
        />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {trend && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              trendUp === false ? 'text-destructive' : 'text-success',
            )}
          >
            {trendUp === false ? (
              <ArrowDownRight className="size-3" aria-hidden="true" />
            ) : (
              <ArrowUpRight className="size-3" aria-hidden="true" />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {card}
      </Link>
    )
  }
  return card
})
