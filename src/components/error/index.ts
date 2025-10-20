// Error Handling Components Export
export { default as ErrorBoundary, withErrorBoundary, useErrorReporting } from './ErrorBoundary';
export { 
  default as ErrorMessage,
  NetworkError,
  AuthenticationError,
  ValidationError,
  ServerError,
  NotFoundError,
  MaintenanceError
} from './ErrorMessage';
export { default as ErrorDemo } from './ErrorDemo';

// Types
export type { ErrorSeverity, ErrorType, ErrorDetails } from './ErrorMessage';

// Hooks
export { 
  useRetry, 
  RetryableApiClient, 
  CircuitBreaker, 
  RetryButton,
  getErrorType,
  DEFAULT_RETRY_CONFIG
} from '../../hooks/useRetry';
export type { RetryConfig, RetryState } from '../../hooks/useRetry';