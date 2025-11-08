import React from 'react';

interface RetryButtonProps {
  onRetry: () => void;
  isRetrying: boolean;
  attemptCount: number;
  maxAttempts: number;
  disabled?: boolean;
  className?: string;
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  isRetrying,
  attemptCount,
  maxAttempts,
  disabled = false,
  className = ''
}) => {
  const remainingAttempts = maxAttempts - attemptCount;
  const canRetry = remainingAttempts > 0 && !disabled;

  return (
    <button
      onClick={onRetry}
      disabled={!canRetry || isRetrying}
      className={`retry-button ${className} ${!canRetry ? 'retry-button--disabled' : ''}`}
    >
      {isRetrying ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Retrying...
        </>
      ) : (
        <>
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again {remainingAttempts > 0 && `(${remainingAttempts} left)`}
        </>
      )}
    </button>
  );
};