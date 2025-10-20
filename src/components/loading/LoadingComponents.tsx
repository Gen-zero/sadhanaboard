import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, RefreshCw, Download, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

// Base loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?:
    | 'default'
    | 'spiritual'
    | 'cosmic'
    | 'dots'
    | 'pulse'
    | 'bars';
  className?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  color = 'currentColor'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const sizeClass = sizes[size];

  switch (variant) {
    case 'spiritual':
      return (
        <motion.div
          className={cn('relative', sizeClass, className)}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className={cn(sizeClass)} style={{ color }} />
        </motion.div>
      );

    case 'cosmic':
      return (
        <div className={cn('relative', sizeClass, className)}>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: color,
              borderRightColor: `${color}60`
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: color,
              borderLeftColor: `${color}40`
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      );

    case 'dots':
      return (
        <div className={cn('flex space-x-1', className)}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      );

    case 'pulse':
      return (
        <motion.div
          className={cn('rounded-full', sizeClass, className)}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      );

    case 'bars':
      return (
        <div className={cn('flex items-end space-x-1', className)}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-current"
              style={{ color }}
              animate={{
                height: ['0.5rem', '1.5rem', '0.5rem']
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      );

    default:
      return (
        <Loader2
          className={cn('animate-spin', sizeClass, className)}
          style={{ color }}
        />
      );
  }
};

// Skeleton loader component
interface SkeletonProps {
  className?: string;
  lines?: number;
  width?: string | number;
  height?: string | number;
  animated?: boolean;
  variant?: 'default' | 'rounded' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  lines = 1,
  width = '100%',
  height = '1rem',
  animated = true,
  variant = 'default'
}) => {
  const baseClasses = cn(
    'bg-muted',
    animated && 'animate-pulse',
    variant === 'rounded' && 'rounded-md',
    variant === 'circular' && 'rounded-full',
    variant === 'text' && 'rounded-sm',
    className
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  if (lines === 1) {
    return <div className={baseClasses} style={style} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={baseClasses}
          style={{
            ...style,
            width:
              index === lines - 1
                ? `${Math.random() * 30 + 60}%`
                : style.width
          }}
        />
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className
}) => {
  return (
    <div className={cn('p-6 border rounded-lg space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" height="1rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      </div>
      <Skeleton lines={3} height="0.875rem" />
      <div className="flex justify-between">
        <Skeleton width="30%" height="2rem" variant="rounded" />
        <Skeleton width="20%" height="2rem" variant="rounded" />
      </div>
    </div>
  );
};

// List skeleton loader
export const ListSkeleton: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 5, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height="1rem" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
          <Skeleton width={60} height={24} variant="rounded" />
        </div>
      ))}
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} width="80%" height="1.25rem" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 py-2"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={colIndex === 0 ? '90%' : '70%'}
              height="1rem"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'spinner' | 'spiritual' | 'cosmic';
  backdrop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message,
  variant = 'spinner',
  backdrop = true,
  className,
  children
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            backdrop && 'bg-background/80 backdrop-blur-sm',
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg border shadow-lg"
          >
            <LoadingSpinner
              size="lg"
              variant={variant === 'spinner' ? 'default' : variant}
            />
            {message && (
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {message}
              </p>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Button with loading state
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  loadingText,
  className,
  disabled,
  icon,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'h-10 px-4 py-2',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center space-x-2"
          >
            <LoadingSpinner size="sm" />
            <span>{loadingText || 'Loading...'}</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center space-x-2"
          >
            {icon && <span>{icon}</span>}
            <span>{children}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

// Specialized loading states for different operations
export const UploadingIndicator: React.FC<{ message?: string }> = ({
  message = 'Uploading...'
}) => (
  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Upload className="w-4 h-4 animate-bounce" />
    <span>{message}</span>
  </div>
);

export const DownloadingIndicator: React.FC<{ message?: string }> = ({
  message = 'Downloading...'
}) => (
  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Download className="w-4 h-4 animate-bounce" />
    <span>{message}</span>
  </div>
);

export const SyncingIndicator: React.FC<{ message?: string }> = ({
  message = 'Syncing...'
}) => (
  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <RefreshCw className="w-4 h-4 animate-spin" />
    <span>{message}</span>
  </div>
);

// Page loading skeleton
export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton width="30%" height="2rem" />
        <Skeleton width="60%" height="1rem" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton width="40%" height="1.5rem" />
          <ListSkeleton items={4} />
        </div>
        <div className="space-y-4">
          <Skeleton width="50%" height="1.5rem" />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
};