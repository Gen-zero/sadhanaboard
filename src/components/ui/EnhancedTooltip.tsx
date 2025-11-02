import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedTooltipProps {
  id: string;
  title?: string;
  content: string;
  variant?: 'default' | 'help' | 'info' | 'warning';
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
        return 'bg-blue-500 text-white border-blue-600';
      case 'info':
        return 'bg-purple-500 text-white border-purple-600';
      case 'warning':
        return 'bg-yellow-500 text-black border-yellow-600';
      default:
        return 'bg-gray-800 text-white border-gray-700';
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