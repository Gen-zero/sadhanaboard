import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, BookOpen, Lightbulb, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHelp } from '@/contexts/HelpContext';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: string;
  title?: string;
  id: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'default' | 'help' | 'info' | 'discovery';
  showCloseButton?: boolean;
  persistent?: boolean;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  title,
  id,
  position = 'top',
  variant = 'default',
  showCloseButton = false,
  persistent = false,
  className,
  onOpen,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { showTooltip, hideTooltip, activeTooltip, showTooltips } = useHelp();

  // Handle tooltip visibility based on context
  useEffect(() => {
    if (showTooltips && activeTooltip === id) {
      setIsOpen(true);
      onOpen?.();
    } else if (!persistent) {
      setIsOpen(false);
      onClose?.();
    }
  }, [activeTooltip, id, showTooltips, persistent, onOpen, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        hideTooltip();
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, hideTooltip, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        hideTooltip();
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, hideTooltip, onClose]);

  const handleTriggerClick = () => {
    if (isOpen) {
      setIsOpen(false);
      hideTooltip();
      onClose?.();
    } else {
      setIsOpen(true);
      showTooltip(id);
      onOpen?.();
    }
  };

  const handleTriggerHover = (hoverState: boolean) => {
    setIsHovered(hoverState);
    if (hoverState && !isOpen) {
      showTooltip(id);
    } else if (!hoverState && !isOpen) {
      hideTooltip();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    hideTooltip();
    onClose?.();
  };

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3'
  };

  // Arrow position classes
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t border-l border-popover bg-popover',
    right: 'left-full top-1/2 transform -translate-y-1/2 border-t border-r border-popover bg-popover',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b border-r border-popover bg-popover',
    left: 'right-full top-1/2 transform -translate-y-1/2 border-b border-l border-popover bg-popover'
  };

  // Variant styling
  const variantStyles = {
    default: 'bg-popover text-popover-foreground border border-border',
    help: 'bg-blue-500 text-white border border-blue-600',
    info: 'bg-purple-500 text-white border border-purple-600',
    discovery: 'bg-yellow-500 text-gray-900 border border-yellow-600'
  };

  // Variant icons
  const variantIcons = {
    default: null,
    help: <HelpCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
    discovery: <Lightbulb className="w-4 h-4" />
  };

  return (
    <div className="relative inline-block">
      {/* Tooltip Trigger */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={() => handleTriggerHover(true)}
        onMouseLeave={() => handleTriggerHover(false)}
        className={cn(
          'inline-flex items-center justify-center border-0 bg-transparent p-0 cursor-pointer',
          variant === 'discovery' && 'relative',
          className
        )}
      >
        {children}
        {variant === 'discovery' && !isHovered && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-64 p-4 rounded-lg shadow-lg',
              'max-w-xs text-sm',
              variantStyles[variant],
              positionClasses[position],
              className
            )}
          >
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-3 h-3 rotate-45',
                arrowClasses[position]
              )}
            />

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Content */}
            <div className="space-y-2">
              {title && (
                <div className="flex items-start gap-2">
                  {variantIcons[variant] && (
                    <div className={cn(
                      'mt-0.5',
                      variant === 'help' && 'text-white',
                      variant === 'info' && 'text-white',
                      variant === 'discovery' && 'text-gray-900'
                    )}>
                      {variantIcons[variant]}
                    </div>
                  )}
                  <h4 className={cn(
                    'font-semibold',
                    variant === 'help' && 'text-white',
                    variant === 'info' && 'text-white',
                    variant === 'discovery' && 'text-gray-900'
                  )}>
                    {title}
                  </h4>
                </div>
              )}
              <p className={cn(
                variant === 'help' && 'text-blue-100',
                variant === 'info' && 'text-purple-100',
                variant === 'discovery' && 'text-yellow-100',
                !title && 'pt-1'
              )}>
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Help Button Component
interface HelpButtonProps {
  topicId: string;
  className?: string;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ topicId, className }) => {
  const { helpTopics, showTooltip } = useHelp();
  const topic = helpTopics[topicId];

  if (!topic) return null;

  return (
    <button
      onClick={() => showTooltip(topicId)}
      className={cn(
        'inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors',
        className
      )}
      aria-label={`Help for ${topic.title}`}
    >
      <HelpCircle className="w-3 h-3" />
    </button>
  );
};

export default EnhancedTooltip;