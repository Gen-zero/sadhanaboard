import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedTooltipProps {
  id: string;
  title?: string;
  content: string;
  variant?: 'default' | 'help' | 'info' | 'warning' | 'discovery';
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  id,
  title,
  content,
  variant = 'default',
  position = 'top',
  children,
}) => {
  // Determine styling based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'help':
        return 'bg-primary text-primary-foreground border-primary';
      case 'info':
        return 'bg-secondary text-secondary-foreground border-secondary';
      case 'warning':
        return 'bg-accent text-accent-foreground border-accent';
      default:
        return 'bg-background text-foreground border-border';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div id={id}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={position}
          className={`${getVariantClasses()} px-3 py-2 text-sm rounded-md border shadow-lg max-w-xs`}
        >
          {title && (
            <div className="font-semibold mb-1">
              {title}
            </div>
          )}
          <div>{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { EnhancedTooltip };