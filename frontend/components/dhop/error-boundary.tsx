'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Error Boundary caught rendering failure]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center border rounded-xl bg-card shadow-sm max-w-lg mx-auto mt-12 space-y-4">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              An unexpected rendering error occurred. Please check network logs or try reloading the section.
            </p>
            {this.state.error && (
              <pre className="p-3 rounded bg-muted text-xs font-mono overflow-auto max-h-32 text-left border">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button onClick={this.handleReset} size="sm" className="flex items-center gap-1.5">
            <RotateCcw className="size-4" /> Reload Section
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
