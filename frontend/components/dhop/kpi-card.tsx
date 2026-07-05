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
  tone,
}: {
  label: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  href?: string
  tone?: 'default' | 'critical' | 'warning' | 'success' | 'info'
}) {
  const resolvedTone = (tone && tone !== 'default'
    ? tone
    : label.toLowerCase().includes('active') ||
      label.toLowerCase().includes('available') ||
      label.toLowerCase().includes('present') ||
      label.toLowerCase().includes('success') ||
      trendUp === true
      ? 'success'
      : label.toLowerCase().includes('critical') ||
        label.toLowerCase().includes('absent')
      ? 'critical'
      : label.toLowerCase().includes('warning') ||
        label.toLowerCase().includes('occupied') ||
        label.toLowerCase().includes('expiring')
      ? 'warning'
      : 'info') as 'critical' | 'warning' | 'success' | 'info'

  const toneStyles = {
    critical: {
      bg: 'bg-danger-light/50',
      border: 'border-danger/15',
      icon: 'text-danger',
      hoverBg: 'hover:bg-danger-light/85',
      hoverBorder: 'hover:border-danger/30',
    },
    warning: {
      bg: 'bg-warning-light/60',
      border: 'border-warning/15',
      icon: 'text-warning',
      hoverBg: 'hover:bg-warning-light/90',
      hoverBorder: 'hover:border-warning/30',
    },
    success: {
      bg: 'bg-success-light/50',
      border: 'border-success/15',
      icon: 'text-success',
      hoverBg: 'hover:bg-success-light/85',
      hoverBorder: 'hover:border-success/30',
    },
    info: {
      bg: 'bg-info-light/40',
      border: 'border-info/15',
      icon: 'text-info',
      hoverBg: 'hover:bg-info-light/70',
      hoverBorder: 'hover:border-info/30',
    },
    neutral: {
      bg: 'bg-slate-50',
      border: 'border-slate-200/60',
      icon: 'text-slate-500',
      hoverBg: 'hover:bg-slate-100/80',
      hoverBorder: 'hover:border-slate-300/40',
    },
  }

  const style = toneStyles[resolvedTone as keyof typeof toneStyles] || toneStyles.info;

  const card = (
    <div
      className={cn(
        'flex h-full flex-col gap-3 rounded-lg border p-4 transition-all duration-200 shadow-xs',
        style.bg,
        style.border,
        href && cn('cursor-pointer', style.hoverBg, style.hoverBorder),
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <Icon
          className={cn('size-4 shrink-0 transition-colors', style.icon)}
          aria-hidden="true"
        />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold',
              trendUp === false ? 'text-danger' : 'text-success',
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
