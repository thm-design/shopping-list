import React from 'react';
import { X } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6">
          <div className="text-red-500 mb-4">
            <X size={48} />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-6">
            {this.state.error?.message || 'Failed to initialize the app'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}