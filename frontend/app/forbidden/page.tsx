'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-destructive/5 via-background to-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center animate-fade-in">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-md border border-destructive/20">
          <ShieldAlert className="size-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            403 - Access Forbidden
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm text-balance">
            Your CureSync account role permissions restrict access to this page. Please contact your district administrator if you believe this is in error.
          </p>
        </div>
        <Button
          size="lg"
          className="font-medium"
          render={<Link href="/" />}
        >
          Return to Platform Home
        </Button>
      </div>
    </main>
  );
}
