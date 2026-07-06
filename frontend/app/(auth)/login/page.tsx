'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error('[Login] Error:', err);
      // Friendly messages for common Firebase Auth issues
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Access temporarily locked.');
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <HeartPulse className="size-6 animate-pulse" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              DHOP
            </h1>
            <p className="text-sm text-muted-foreground text-balance">
              District Health Operations Platform
            </p>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm backdrop-blur"
        >
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@district.health"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 transition-shadow"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full rounded-lg border bg-background pr-9 pl-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 transition-shadow"
                required
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground select-none cursor-pointer">
              <input type="checkbox" className="size-3.5 rounded border-gray-300" />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full font-medium"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Login'}
          </Button>
        </form>

        {/* Demo Credentials Panel */}
        <div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-sm backdrop-blur">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
            Demo Credentials (Click to Autofill)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('district.admin@dhop.gov.in');
                setPassword('Password@123');
              }}
              className="flex flex-col items-start rounded-lg border bg-background/50 p-2 text-left hover:border-primary/50 transition-colors"
            >
              <span className="text-[10px] font-bold text-primary">District Admin</span>
              <span className="text-[9px] text-muted-foreground truncate w-full">
                district.admin@dhop...
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin.rampur@dhop.gov.in');
                setPassword('Password@123');
              }}
              className="flex flex-col items-start rounded-lg border bg-background/50 p-2 text-left hover:border-primary/50 transition-colors"
            >
              <span className="text-[10px] font-bold text-primary">Facility Admin</span>
              <span className="text-[9px] text-muted-foreground truncate w-full">
                admin.rampur@dhop...
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('staff.healthcare.rampur@dhop.gov.in');
                setPassword('Password@123');
              }}
              className="flex flex-col items-start rounded-lg border bg-background/50 p-2 text-left hover:border-primary/50 transition-colors"
            >
              <span className="text-[10px] font-bold text-primary">Healthcare Staff</span>
              <span className="text-[9px] text-muted-foreground truncate w-full">
                staff.healthcare.rampur...
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('staff.ops.rampur@dhop.gov.in');
                setPassword('Password@123');
              }}
              className="flex flex-col items-start rounded-lg border bg-background/50 p-2 text-left hover:border-primary/50 transition-colors"
            >
              <span className="text-[10px] font-bold text-primary">Operations Staff</span>
              <span className="text-[9px] text-muted-foreground truncate w-full">
                staff.ops.rampur...
              </span>
            </button>
          </div>
          <p className="text-[9px] text-muted-foreground text-center">
            Password: <code className="bg-muted px-1 rounded">Password@123</code>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground text-balance">
          Access is provisioned by your district administrator. No public
          registration.
        </p>
      </div>
    </main>
  );
}
