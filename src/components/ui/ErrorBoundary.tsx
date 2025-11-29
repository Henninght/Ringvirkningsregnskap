"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  error,
  onRetry,
  title = "Noe gikk galt",
  description = "En uventet feil oppstod. Vennligst prov igjen.",
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-coral-50/50 border border-coral-200 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-coral-100 flex items-center justify-center mb-4">
        <AlertTriangle size={24} className="text-coral-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 text-center mb-4 max-w-md">
        {description}
      </p>
      {error && (
        <details className="mb-4 w-full max-w-md">
          <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
            Vis tekniske detaljer
          </summary>
          <pre className="mt-2 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} />
          Prov igjen
        </button>
      )}
    </div>
  );
}

interface AsyncBoundaryProps {
  children: ReactNode;
  loading?: boolean;
  error?: Error | null;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  onRetry?: () => void;
}

export function AsyncBoundary({
  children,
  loading,
  error,
  loadingFallback,
  errorFallback,
  onRetry,
}: AsyncBoundaryProps) {
  if (loading) {
    return <>{loadingFallback || <DefaultLoadingFallback />}</>;
  }

  if (error) {
    return <>{errorFallback || <ErrorFallback error={error} onRetry={onRetry} />}</>;
  }

  return <>{children}</>;
}

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-mint-500 animate-spin" />
    </div>
  );
}
