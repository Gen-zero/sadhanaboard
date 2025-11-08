import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ErrorDetails, ErrorType } from '../components/error/ErrorMessage';

// Retry configuration options
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors: ErrorType[];
  onRetry?: (attempt: number, error: Error) => void;
  onMaxAttemptsReached?: (error: Error) => void;
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryableErrors: ['network', 'server', 'timeout'],
  onRetry: undefined,
  onMaxAttemptsReached: undefined
};

// Retry state
interface RetryState {
  attempt: number;
  isRetrying: boolean;
  lastError: Error | null;
  canRetry: boolean;
}

// Hook for handling retries
export function useRetry(config: Partial<RetryConfig> = {}) {
  const finalConfig = useMemo(() => ({ ...DEFAULT_RETRY_CONFIG, ...config }), [config]);
  const [retryState, setRetryState] = useState<RetryState>({
    attempt: 0,
    isRetrying: false,
    lastError: null,
    canRetry: true
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate delay with exponential backoff
  const calculateDelay = useCallback((attempt: number): number => {
    const delay = finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt - 1);
    return Math.min(delay, finalConfig.maxDelay);
  }, [finalConfig.baseDelay, finalConfig.backoffFactor, finalConfig.maxDelay]);

  // Check if error is retryable
  const isRetryableError = useCallback((error: Error | ErrorDetails): boolean => {
    const errorType = 'type' in error ? error.type : getErrorType(error);
    return finalConfig.retryableErrors.includes(errorType);
  }, [finalConfig.retryableErrors]);

  // Reset retry state
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setRetryState({
      attempt: 0,
      isRetrying: false,
      lastError: null,
      canRetry: true
    });
  }, []);

  // Execute function with retry logic
  const executeWithRetry = useCallback(
    async function<T>(asyncFn: () => Promise<T>, errorContext?: string): Promise<T> {
    const attemptExecution = async (currentAttempt: number): Promise<T> => {
      try {
        setRetryState(prev => ({ 
          ...prev, 
          attempt: currentAttempt,
          isRetrying: currentAttempt > 1 
        }));

        const result = await asyncFn();
        
        // Success - reset state
        setRetryState({
          attempt: 0,
          isRetrying: false,
          lastError: null,
          canRetry: true
        });
        
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        
        setRetryState(prev => ({
          ...prev,
          lastError: err,
          isRetrying: false
        }));

        // Check if we should retry
        const shouldRetry = currentAttempt < finalConfig.maxAttempts && 
                           isRetryableError(err);

        if (shouldRetry) {
          // Call retry callback
          if (finalConfig.onRetry) {
            finalConfig.onRetry(currentAttempt, err);
          }

          const delay = calculateDelay(currentAttempt);
          
          return new Promise((resolve, reject) => {
            timeoutRef.current = setTimeout(async () => {
              try {
                const result = await attemptExecution(currentAttempt + 1);
                resolve(result);
              } catch (retryError) {
                reject(retryError);
              }
            }, delay);
          });
        } else {
          // Max attempts reached or non-retryable error
          setRetryState(prev => ({
            ...prev,
            canRetry: false
          }));

          if (currentAttempt >= finalConfig.maxAttempts && finalConfig.onMaxAttemptsReached) {
            finalConfig.onMaxAttemptsReached(err);
          }

          throw err;
        }
      }
    };

    return attemptExecution(1);
    },
    [finalConfig, isRetryableError, calculateDelay]
  );

  // Manual retry function
  const retry = useCallback(
    async function<T>(asyncFn: () => Promise<T>): Promise<T> {
    if (!retryState.canRetry || retryState.attempt >= finalConfig.maxAttempts) {
      throw new Error('Cannot retry: max attempts reached or error not retryable');
    }

    return executeWithRetry(asyncFn);
    },
    [retryState, finalConfig.maxAttempts, executeWithRetry]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...retryState,
    executeWithRetry,
    retry,
    reset,
    remainingAttempts: Math.max(0, finalConfig.maxAttempts - retryState.attempt),
    maxAttempts: finalConfig.maxAttempts
  };
}

// Utility function to determine error type
function getErrorType(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) return 'network';
  if (message.includes('timeout')) return 'timeout';
  if (message.includes('401') || message.includes('unauthorized')) return 'authentication';
  if (message.includes('403') || message.includes('forbidden')) return 'authorization';
  if (message.includes('404') || message.includes('not found')) return 'not-found';
  if (message.includes('400') || message.includes('validation')) return 'validation';
  if (message.includes('429') || message.includes('rate limit')) return 'rate-limit';
  if (message.includes('503') || message.includes('maintenance')) return 'maintenance';
  if (message.includes('500') || message.includes('server')) return 'server';
  
  return 'client';
}

// Enhanced API client with built-in retry logic
export class RetryableApiClient {
  private baseURL: string;
  private defaultConfig: RetryConfig;

  constructor(baseURL: string, defaultRetryConfig?: Partial<RetryConfig>) {
    this.baseURL = baseURL;
    this.defaultConfig = { ...DEFAULT_RETRY_CONFIG, ...defaultRetryConfig };
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retryConfig?: Partial<RetryConfig>
  ): Promise<T> {
    const config = { ...this.defaultConfig, ...retryConfig };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });

        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          (error as Error & { status?: number }).status = response.status;
          throw error;
        }

        const data = await response.json();
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        lastError = err;

        // Check if we should retry
        const shouldRetry = attempt < config.maxAttempts && 
                           config.retryableErrors.includes(getErrorType(err));

        if (shouldRetry) {
          // Call retry callback
          if (config.onRetry) {
            config.onRetry(attempt, err);
          }

          // Calculate delay and wait
          const delay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
          const finalDelay = Math.min(delay, config.maxDelay);
          
          await new Promise(resolve => setTimeout(resolve, finalDelay));
          continue;
        } else {
          // Max attempts reached or non-retryable error
          if (attempt >= config.maxAttempts && config.onMaxAttemptsReached) {
            config.onMaxAttemptsReached(err);
          }
          throw err;
        }
      }
    }

    throw lastError || new Error('Retry failed');
  }

  async get<T>(endpoint: string, retryConfig?: Partial<RetryConfig>): Promise<T> {
    return this.fetchWithRetry(endpoint, { method: 'GET' }, retryConfig);
  }

  async post<T, D = unknown>(
    endpoint: string, 
    data?: D, 
    retryConfig?: Partial<RetryConfig>
  ): Promise<T> {
    return this.fetchWithRetry(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      },
      retryConfig
    );
  }

  async put<T, D = unknown>(
    endpoint: string, 
    data?: D, 
    retryConfig?: Partial<RetryConfig>
  ): Promise<T> {
    return this.fetchWithRetry(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
      },
      retryConfig
    );
  }

  async delete<T>(endpoint: string, retryConfig?: Partial<RetryConfig>): Promise<T> {
    return this.fetchWithRetry(endpoint, { method: 'DELETE' }, retryConfig);
  }
}

// Circuit breaker pattern for advanced error handling
export class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private failureThreshold: number = 5,
    private resetTimeout: number = 60000, // 1 minute
    private retryTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failures;
  }

  reset(): void {
    this.failures = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = 0;
  }
}

// Export types and utilities
export type { RetryState };
export { DEFAULT_RETRY_CONFIG, getErrorType };