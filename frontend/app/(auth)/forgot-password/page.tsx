'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      setSubmitting(false);
    } catch (err: any) {
      console.error('[Forgot Password] Error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account matches this email address.');
      } else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6 animate-fade-in">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <HeartPulse className="size-6" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Password Recovery
            </h1>
            <p className="text-sm text-muted-foreground text-balance">
              Request a link to reset your DHOP password
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm backdrop-blur">
          {success ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 border border-green-200">
                A password recovery link has been sent to **{email}**. Please check your inbox and spam folder.
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                render={<Link href="/login" />}
              >
                <ArrowLeft className="size-4" /> Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
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

              <Button
                type="submit"
                size="lg"
                className="w-full font-medium"
                disabled={submitting}
              >
                {submitting ? 'Sending Link...' : 'Send Recovery Email'}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                <ArrowLeft className="size-4" /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
