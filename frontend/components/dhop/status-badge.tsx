import React from 'react'
import { cn } from '@/lib/utils'

export type StatusTone = 'success' | 'warning' | 'critical' | 'pending' | 'neutral' | 'info'

const tones: Record<StatusTone, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning-foreground',
  critical: 'bg-destructive/10 text-destructive',
  pending: 'bg-warning/10 text-warning-foreground',
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-accent text-accent-foreground',
}

export const StatusBadge = React.memo(function StatusBadge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: StatusTone
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
})
