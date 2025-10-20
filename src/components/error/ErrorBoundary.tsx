import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  isolate?: boolean;
  retryable?: boolean;
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error reporting service (if available)
    this.logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Here you would integrate with error reporting services like Sentry, LogRocket, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.props.context || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // For now, just log to console
    console.error('Error Report:', errorData);
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;

    if (retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1
      });

      // Auto-reset retry count after 30 seconds
      this.retryTimeoutId = setTimeout(() => {
        this.setState({ retryCount: 0 });
      }, 30000);
    }
  };

  private handleReportBug = () => {
    const { error, errorInfo } = this.state;
    const bugReport = {
      error: error?.message,
      stack: error?.stack,
      component: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      context: this.props.context
    };

    // Open bug reporting form or email client
    const subject = encodeURIComponent(`Bug Report: ${error?.message || 'Unknown Error'}`);
    const body = encodeURIComponent(`
Error Details:
${JSON.stringify(bugReport, null, 2)}

Steps to reproduce:
1. 
2. 
3. 

Expected behavior:


Actual behavior:


Additional context:

    `);
    
    window.open(`mailto:support@sadhanaboard.com?subject=${subject}&body=${body}`);
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { 
      children, 
      fallback, 
      showErrorDetails = false, 
      isolate = false,
      retryable = true 
    } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      const maxRetries = 3;
      const canRetry = retryable && retryCount < maxRetries;

      return (
        <div className={`error-boundary ${isolate ? 'error-boundary--isolated' : 'error-boundary--full'}`}>
          <div className="error-boundary__container">
            <div className="error-boundary__icon">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            
            <div className="error-boundary__content">
              <h2 className="error-boundary__title">
                Something went wrong
              </h2>
              
              <p className="error-boundary__description">
                We encountered an unexpected error. Don't worry, we're here to help you get back on track.
              </p>

              {showErrorDetails && error && (
                <details className="error-boundary__details">
                  <summary className="error-boundary__details-summary">
                    Technical Details
                  </summary>
                  <div className="error-boundary__details-content">
                    <p><strong>Error:</strong> {error.message}</p>
                    {error.stack && (
                      <pre className="error-boundary__stack">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="error-boundary__actions">
                {canRetry && (
                  <button
                    onClick={this.handleRetry}
                    className="error-boundary__button error-boundary__button--primary"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again ({maxRetries - retryCount} attempts left)
                  </button>
                )}

                <button
                  onClick={this.handleGoHome}
                  className="error-boundary__button error-boundary__button--secondary"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </button>

                <button
                  onClick={this.handleReportBug}
                  className="error-boundary__button error-boundary__button--outline"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Issue
                </button>
              </div>

              {retryCount > 0 && (
                <p className="error-boundary__retry-info">
                  Attempt {retryCount} of {maxRetries}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

// Higher-order component for easy error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for programmatic error reporting
export function useErrorReporting() {
  const reportError = React.useCallback((error: Error, context?: string) => {
    console.error('Manual error report:', error, { context });
    
    // Here you would send to error reporting service
    const errorData = {
      message: error.message,
      stack: error.stack,
      context: context || 'manual-report',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('Error Report:', errorData);
  }, []);

  return { reportError };
}