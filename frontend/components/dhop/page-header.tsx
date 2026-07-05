import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PageHeader({
  title,
  description,
  action,
  secondaryAction,
}: {
  title: string
  description?: string
  action?: string
  secondaryAction?: string
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {secondaryAction && (
          <Button variant="outline" size="sm">
            {secondaryAction}
          </Button>
        )}
        {action && (
          <Button size="sm">
            <Plus className="size-4" aria-hidden="true" />
            {action}
          </Button>
        )}
      </div>
    </div>
  )
}
