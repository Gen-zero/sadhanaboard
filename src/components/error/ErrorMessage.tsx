import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  X,
  RotateCcw,
  HelpCircle,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Home,
  Bug
} from 'lucide-react';

// Error severity levels
export type ErrorSeverity = 'error' | 'warning' | 'info' | 'success';

// Error types for different contexts
export type ErrorType = 
  | 'network' 
  | 'authentication' 
  | 'authorization' 
  | 'validation' 
  | 'server' 
  | 'client' 
  | 'timeout'
  | 'not-found'
  | 'rate-limit'
  | 'maintenance';

export interface ErrorDetails {
  code?: string;
  message: string;
  description?: string;
  severity: ErrorSeverity;
  type: ErrorType;
  timestamp?: Date;
  retryable?: boolean;
  helpUrl?: string;
  technicalDetails?: string;
  suggestions?: string[];
  context?: Record<string, unknown>;
}

interface ErrorMessageProps {
  error: ErrorDetails;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showTechnicalDetails?: boolean;
  compact?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
  showTechnicalDetails = false,
  compact = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const getIcon = () => {
    switch (error.severity) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityStyles = () => {
    switch (error.severity) {
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const copyErrorDetails = async () => {
    const details = {
      code: error.code,
      message: error.message,
      type: error.type,
      timestamp: error.timestamp?.toISOString(),
      technicalDetails: error.technicalDetails,
      context: error.context
    };
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(details, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  if (compact) {
    return (
      <div className={`error-message error-message--compact ${getSeverityStyles()} ${className}`}>
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium">{error.message}</span>
          {onRetry && error.retryable && (
            <button
              onClick={onRetry}
              className="ml-auto text-xs underline hover:no-underline"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRetry();
                }
              }}
              tabIndex={0}
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button 
              onClick={onDismiss} 
              className="ml-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onDismiss();
                }
              }}
              tabIndex={0}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`error-message ${getSeverityStyles()} ${className}`} role="alert" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {error.code ? `${error.code}: ${error.message}` : error.message}
            </h3>
            
            <div className="flex items-center gap-2">
              {onRetry && error.retryable && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-white/50 hover:bg-white/80 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRetry();
                    }
                  }}
                  tabIndex={0}
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </button>
              )}
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-current/60 hover:text-current transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onDismiss();
                    }
                  }}
                  tabIndex={0}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </button>
              )}
            </div>
          </div>

          {error.description && (
            <p className="mt-1 text-sm opacity-90">
              {error.description}
            </p>
          )}

          {error.suggestions && error.suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Try these solutions:</p>
              <ul className="list-disc list-inside text-xs space-y-0.5 opacity-90">
                {error.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs">
            {error.helpUrl && (
              <a
                href={error.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline hover:no-underline"
              >
                <HelpCircle className="h-3 w-3" />
                Get Help
                <ExternalLink className="h-3 w-3" />
                <span className="sr-only">Opens in new window</span>
              </a>
            )}

            {(showTechnicalDetails || error.technicalDetails) && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1 underline hover:no-underline"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowDetails(!showDetails);
                  }
                }}
                tabIndex={0}
              >
                Technical Details
                {showDetails ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}

            <button
              onClick={copyErrorDetails}
              className="inline-flex items-center gap-1 underline hover:no-underline"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  copyErrorDetails();
                }
              }}
              tabIndex={0}
            >
              <Copy className="h-3 w-3" />
              {copied ? 'Copied!' : 'Copy Details'}
            </button>

            {error.timestamp && (
              <span className="opacity-60">
                {error.timestamp.toLocaleString()}
              </span>
            )}
          </div>

          {showDetails && (error.technicalDetails || error.context) && (
            <div className="mt-3 p-2 bg-black/10 rounded text-xs">
              {error.technicalDetails && (
                <div className="mb-2">
                  <strong>Technical Details:</strong>
                  <pre className="mt-1 whitespace-pre-wrap font-mono">
                    {error.technicalDetails}
                  </pre>
                </div>
              )}
              
              {error.context && Object.keys(error.context).length > 0 && (
                <div>
                  <strong>Context:</strong>
                  <pre className="mt-1 whitespace-pre-wrap font-mono">
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Specialized error components for common scenarios
export const NetworkError: React.FC<{ onRetry?: () => void; onDismiss?: () => void }> = ({ onRetry, onDismiss }) => (
  <ErrorMessage
    error={{
      message: "Connection Failed",
      description: "Unable to connect to the server. Please check your internet connection.",
      severity: "error",
      type: "network",
      retryable: true,
      suggestions: [
        "Check your internet connection",
        "Try refreshing the page",
        "Contact support if the problem persists"
      ]
    }}
    onRetry={onRetry}
    onDismiss={onDismiss}
  />
);

export const AuthenticationError: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <ErrorMessage
    error={{
      message: "Authentication Required",
      description: "Your session has expired. Please log in again to continue.",
      severity: "warning",
      type: "authentication",
      retryable: false,
      suggestions: [
        "Click the login button to sign in again",
        "Make sure you're using the correct credentials"
      ]
    }}
    onDismiss={onDismiss}
  />
);

export const ValidationError: React.FC<{ 
  fields: string[]; 
  onDismiss?: () => void;
}> = ({ fields, onDismiss }) => (
  <ErrorMessage
    error={{
      message: "Validation Failed",
      description: "Please check the highlighted fields and try again.",
      severity: "warning",
      type: "validation",
      retryable: false,
      suggestions: fields.map(field => `Check the ${field} field`)
    }}
    onDismiss={onDismiss}
  />
);

export const ServerError: React.FC<{ onRetry?: () => void; onDismiss?: () => void }> = ({ onRetry, onDismiss }) => (
  <ErrorMessage
    error={{
      message: "Server Error",
      description: "Something went wrong on our end. Our team has been notified.",
      severity: "error",
      type: "server",
      retryable: true,
      suggestions: [
        "Try again in a few moments",
        "Refresh the page",
        "Contact support if the issue persists"
      ],
      helpUrl: "/support"
    }}
    onRetry={onRetry}
    onDismiss={onDismiss}
  />
);

export const NotFoundError: React.FC<{ resource?: string; onDismiss?: () => void }> = ({ 
  resource = "resource", 
  onDismiss 
}) => (
  <ErrorMessage
    error={{
      message: "Not Found",
      description: `The ${resource} you're looking for doesn't exist or has been moved.`,
      severity: "warning",
      type: "not-found",
      retryable: false,
      suggestions: [
        "Check the URL for typos",
        "Go back to the previous page",
        "Use the search function to find what you're looking for"
      ]
    }}
    onDismiss={onDismiss}
  />
);

export const MaintenanceError: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <ErrorMessage
    error={{
      message: "Maintenance Mode",
      description: "We're currently performing scheduled maintenance. Please check back soon.",
      severity: "info",
      type: "maintenance",
      retryable: false,
      suggestions: [
        "Try again in a few minutes",
        "Follow our status page for updates"
      ],
      helpUrl: "/status"
    }}
    onDismiss={onDismiss}
  />
);

export default ErrorMessage;