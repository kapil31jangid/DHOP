'use client';

import React from 'react';
import Link from 'next/link';
import { EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center animate-fade-in">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-md border border-accent/20">
          <EyeOff className="size-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            404 - Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm text-balance">
            The page you are looking for does not exist, or has been moved to another URL.
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
