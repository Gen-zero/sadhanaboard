import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

const SkeletonLoader = ({ 
  className = '',
  width = '100%',
  height = '1rem',
  rounded = 'md',
  animate = true
}: SkeletonLoaderProps) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <motion.div 
      className={cn(
        'bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20',
        'border border-purple-500/10',
        'backdrop-blur-sm',
        roundedClasses[rounded],
        animate ? 'animate-pulse' : '',
        'shadow-[0_0_15px_rgba(192,132,252,0.1)]',
        className
      )}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

// Predefined skeleton components for common use cases with premium styling
export const CardSkeleton = ({ className }: { className?: string }) => (
  <motion.div 
    className={cn("space-y-4 p-6 border rounded-2xl bg-gradient-to-br from-background/50 to-purple-900/10 backdrop-blur-sm", className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center space-x-4">
      <SkeletonLoader height="3rem" width="3rem" rounded="full" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader height="1.5rem" rounded="lg" className="w-3/4" />
        <SkeletonLoader height="1rem" rounded="lg" className="w-1/2" />
      </div>
    </div>
    <SkeletonLoader height="1rem" rounded="lg" />
    <SkeletonLoader height="1rem" rounded="lg" className="w-5/6" />
    <div className="flex space-x-2 pt-4">
      <SkeletonLoader height="2.5rem" width="6rem" rounded="lg" />
      <SkeletonLoader height="2.5rem" width="6rem" rounded="lg" />
    </div>
  </motion.div>
);

export const ProfileSkeleton = ({ className }: { className?: string }) => (
  <motion.div 
    className={cn("flex items-center space-x-6 p-6 border rounded-2xl bg-gradient-to-br from-background/50 to-purple-900/10 backdrop-blur-sm", className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <SkeletonLoader width="5rem" height="5rem" rounded="full" />
    <div className="space-y-3 flex-1">
      <SkeletonLoader height="1.75rem" rounded="lg" className="w-1/2" />
      <SkeletonLoader height="1.25rem" rounded="lg" className="w-3/4" />
      <SkeletonLoader height="1rem" rounded="lg" className="w-2/3" />
    </div>
  </motion.div>
);

export const ListSkeleton = ({ count = 3, className }: { count?: number; className?: string }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }).map((_, index) => (
      <motion.div 
        key={index} 
        className="flex items-center space-x-4 p-4 border rounded-xl bg-gradient-to-br from-background/40 to-purple-900/5 backdrop-blur-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <SkeletonLoader width="3.5rem" height="3.5rem" rounded="lg" />
        <div className="space-y-2 flex-1">
          <SkeletonLoader height="1.25rem" rounded="lg" className="w-1/3" />
          <SkeletonLoader height="1rem" rounded="lg" className="w-2/3" />
          <SkeletonLoader height="0.875rem" rounded="lg" className="w-1/2" />
        </div>
        <SkeletonLoader width="2.5rem" height="2.5rem" rounded="full" />
      </motion.div>
    ))}
  </div>
);

export const TextSkeleton = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <motion.div 
    className={cn("space-y-3", className)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader 
        key={index} 
        height="1.125rem" 
        rounded="lg" 
        className={index === 0 ? "w-5/6" : index === lines - 1 ? "w-2/3" : "w-full"} 
      />
    ))}
  </motion.div>
);

// Premium dashboard skeleton
export const DashboardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-6", className)}>
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[1, 2, 3].map((item) => (
        <motion.div
          key={item}
          className="p-5 border rounded-2xl bg-gradient-to-br from-background/50 to-purple-900/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: item * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <SkeletonLoader height="1.5rem" width="3rem" rounded="lg" />
            <SkeletonLoader height="2.5rem" width="2.5rem" rounded="full" />
          </div>
          <SkeletonLoader height="2rem" rounded="lg" className="mt-3 w-3/4" />
          <SkeletonLoader height="1rem" rounded="lg" className="mt-2 w-1/2" />
        </motion.div>
      ))}
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <CardSkeleton />
    </motion.div>
  </div>
);

export default SkeletonLoader;