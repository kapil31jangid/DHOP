'use client'

import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  ListFilter,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge, type StatusTone } from '@/components/dhop/status-badge'
import { cn } from '@/lib/utils'

export type Cell =
  | string
  | { badge: string; tone: StatusTone }

export function DataTable({
  columns,
  rows,
  filters = ['Status', 'Date'],
  searchPlaceholder = 'Search...',
  emptyLabel = 'No records found.',
  emptyAction,
  pageSize = 8,
}: {
  columns: string[]
  rows: Cell[][]
  filters?: string[]
  searchPlaceholder?: string
  emptyLabel?: string
  emptyAction?: string
  pageSize?: number
}) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!query.trim()) return rows
    const q = query.toLowerCase()
    return rows.filter((row) =>
      row.some((cell) =>
        (typeof cell === 'string' ? cell : cell.badge)
          .toLowerCase()
          .includes(q),
      ),
    )
  }, [rows, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder={searchPlaceholder}
            className="h-8 w-full rounded-lg border bg-white pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground transition-all focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/20"
            aria-label={searchPlaceholder}
          />
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <Button key={f} variant="outline" size="sm">
              <ListFilter className="size-3.5" aria-hidden="true" />
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2.5 font-semibold whitespace-nowrap text-slate-600"
                >
                  {col}
                </th>
              ))}
              <th className="w-10 px-4 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <Inbox
                      className="size-8 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-muted-foreground">
                      {emptyLabel}
                    </p>
                    {emptyAction && <Button size="sm">{emptyAction}</Button>}
                  </div>
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    'transition-all duration-150 hover:bg-primary-light/15 hover:text-slate-900',
                    i < visible.length - 1 && 'border-b',
                  )}
                >
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 whitespace-nowrap">
                      {typeof cell === 'string' ? (
                        <span className={j === 0 ? 'font-medium' : undefined}>
                          {cell}
                        </span>
                      ) : (
                        <StatusBadge tone={cell.tone}>{cell.badge}</StatusBadge>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Row actions"
                    >
                      <MoreHorizontal className="size-4" aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Showing {visible.length} of {filtered.length} records
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <span className="px-2 text-xs text-muted-foreground">
            Page {safePage + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
