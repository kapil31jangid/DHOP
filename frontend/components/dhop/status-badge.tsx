import { cn } from '@/lib/utils'

export type StatusTone = 'success' | 'warning' | 'critical' | 'pending' | 'neutral' | 'info'

const tones: Record<StatusTone, string> = {
  success: 'bg-success-light text-emerald-800 border border-emerald-200/60 shadow-[0_1px_2px_0_rgba(16,185,129,0.03)]',
  warning: 'bg-warning-light text-amber-800 border border-amber-200/60 shadow-[0_1px_2px_0_rgba(245,158,11,0.03)]',
  critical: 'bg-danger-light text-red-800 border border-red-200/60 shadow-[0_1px_2px_0_rgba(239,68,68,0.03)]',
  pending: 'bg-warning-light text-amber-800 border border-amber-200/60 shadow-[0_1px_2px_0_rgba(245,158,11,0.03)]',
  neutral: 'bg-slate-50 text-slate-700 border border-slate-200/70 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]',
  info: 'bg-info-light text-blue-800 border border-blue-200/60 shadow-[0_1px_2px_0_rgba(59,130,246,0.03)]',
}

export function StatusBadge({
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
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}
