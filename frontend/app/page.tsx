import Link from 'next/link'
import { Eye, HeartPulse } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="size-6" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">DHOP</h1>
            <p className="text-sm text-muted-foreground text-balance">
              District Health Operations Platform
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@district.health"
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-9 w-full rounded-lg border bg-background pr-9 pl-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <button
                type="button"
                aria-label="Show password"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Eye className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5" />
              Remember me
            </label>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            size="lg"
            className="w-full"
            render={<Link href="/dashboard" />}
          >
            Login
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground text-balance">
          Access is provisioned by your district administrator. No public
          registration.
        </p>
      </div>
    </main>
  )
}
