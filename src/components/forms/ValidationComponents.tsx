import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Info, 
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ValidationState } from '@/hooks/useFormValidation';

// Success Indicator Component
interface SuccessIndicatorProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const SuccessIndicator: React.FC<SuccessIndicatorProps> = ({
  message = 'Valid',
  size = 'md',
  className,
  showIcon = true,
  position = 'right'
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const positionClasses = {
    top: 'mb-1',
    bottom: 'mt-1',
    left: 'mr-2',
    right: 'ml-2'
  };

  if (position === 'top' || position === 'bottom') {
    return (
      <div className={cn(
        'flex flex-col items-start gap-1',
        position === 'top' ? 'mb-1' : 'mt-1',
        className
      )}>
        {showIcon && (
          <CheckCircle2 className={cn(iconSize[size], 'text-green-500 animate-in zoom-in-50 duration-300')} />
        )}
        <span className={cn(
          'text-green-600 font-medium',
          sizeClasses[size],
          'animate-in slide-in-from-top-1 duration-200'
        )}>
          {message}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 text-green-600',
      'animate-in slide-in-from-top-1 duration-200',
      sizeClasses[size],
      positionClasses[position],
      className
    )}>
      {showIcon && (
        <CheckCircle2 className={cn(iconSize[size], 'text-green-500 animate-in zoom-in-50 duration-300')} />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Validation Status Badge
interface ValidationBadgeProps {
  state: ValidationState;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
  state,
  size = 'md',
  showText = true,
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 text-xs',
    md: 'h-5 w-5 text-sm',
    lg: 'h-6 w-6 text-base'
  };

  const getStateDisplay = () => {
    switch (state) {
      case 'valid':
        return {
          icon: <CheckCircle2 className={sizeClasses[size]} />,
          text: 'Valid',
          color: 'text-green-600 bg-green-50 border-green-200'
        };
      case 'invalid':
        return {
          icon: <AlertCircle className={sizeClasses[size]} />,
          text: 'Invalid',
          color: 'text-red-600 bg-red-50 border-red-200'
        };
      case 'validating':
        return {
          icon: <Loader2 className={cn(sizeClasses[size], 'animate-spin')} />,
          text: 'Validating',
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'error':
        return {
          icon: <AlertTriangle className={sizeClasses[size]} />,
          text: 'Error',
          color: 'text-orange-600 bg-orange-50 border-orange-200'
        };
      default:
        return {
          icon: <Info className={sizeClasses[size]} />,
          text: 'Idle',
          color: 'text-gray-600 bg-gray-50 border-gray-200'
        };
    }
  };

  const { icon, text, color } = getStateDisplay();

  return (
    <div className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-full border',
      'transition-all duration-200',
      color,
      className
    )}>
      {icon}
      {showText && <span className="font-medium">{text}</span>}
    </div>
  );
};

// Field Validation Summary
interface FieldValidationSummaryProps {
  fields: Array<{
    name: string;
    label: string;
    state: ValidationState;
    error?: string;
  }>;
  className?: string;
}

export const FieldValidationSummary: React.FC<FieldValidationSummaryProps> = ({
  fields,
  className
}) => {
  const validCount = fields.filter(f => f.state === 'valid').length;
  const invalidCount = fields.filter(f => f.state === 'invalid' || f.state === 'error').length;
  const validatingCount = fields.filter(f => f.state === 'validating').length;
  const totalCount = fields.length;

  const progress = totalCount > 0 ? (validCount / totalCount) * 100 : 0;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Validation Progress</span>
          <span className="text-muted-foreground">
            {validCount}/{totalCount} fields valid
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Counts */}
      <div className="flex gap-4 text-sm">
        {validCount > 0 && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>{validCount} valid</span>
          </div>
        )}
        {invalidCount > 0 && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{invalidCount} invalid</span>
          </div>
        )}
        {validatingCount > 0 && (
          <div className="flex items-center gap-1 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{validatingCount} validating</span>
          </div>
        )}
      </div>

      {/* Invalid Fields List */}
      {invalidCount > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-red-600">Issues to Fix:</h4>
          <ul className="space-y-1 text-sm">
            {fields
              .filter(f => f.state === 'invalid' || f.state === 'error')
              .map((field, index) => (
                <li key={index} className="flex items-start gap-2 text-red-600">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>{field.label}:</strong> {field.error || 'Invalid value'}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Inline Validation Message
interface InlineValidationProps {
  state: ValidationState;
  error?: string;
  successMessage?: string;
  validatingMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom' | 'right' | 'top' | 'left';
  className?: string;
  showIcon?: boolean;
  animation?: 'slide' | 'fade' | 'bounce' | 'none';
}

export const InlineValidation: React.FC<InlineValidationProps> = ({
  state,
  error,
  successMessage = 'Valid',
  validatingMessage = 'Validating...',
  size = 'md',
  position = 'bottom',
  className,
  showIcon = true,
  animation = 'slide'
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const positionClasses = {
    top: 'mb-1',
    bottom: 'mt-1',
    left: 'mr-2',
    right: 'ml-2'
  };

  const animationClasses = {
    slide: 'animate-in slide-in-from-top-1 duration-200',
    fade: 'animate-in fade-in duration-200',
    bounce: 'animate-in bounce-in duration-300',
    none: ''
  };

  if (state === 'idle') return null;

  const animationClass = animationClasses[animation];

  return (
    <div className={cn(
      'flex items-center gap-1.5',
      sizeClasses[size],
      positionClasses[position],
      animationClass,
      className
    )}>
      {state === 'valid' && (
        <>
          {showIcon && <CheckCircle2 className={cn(iconSize[size], 'text-green-500 animate-in zoom-in-50 duration-300')} />}
          <span className="text-green-600 font-medium">{successMessage}</span>
        </>
      )}
      
      {(state === 'invalid' || state === 'error') && error && (
        <>
          {showIcon && <AlertCircle className={cn(iconSize[size], 'text-red-500 animate-in zoom-in-50 duration-300')} />}
          <span className="text-red-600 font-medium">{error}</span>
        </>
      )}
      
      {state === 'validating' && (
        <>
          {showIcon && <Loader2 className={cn(iconSize[size], 'text-blue-500 animate-spin')} />}
          <span className="text-blue-600 font-medium">{validatingMessage}</span>
        </>
      )}
    </div>
  );
};

// Real-time Validation Feedback
interface ValidationFeedbackProps {
  rules: Array<{
    label: string;
    test: (value: string) => boolean;
    message?: string;
  }>;
  value: string;
  className?: string;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  rules,
  value,
  className
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {rules.map((rule, index) => {
        const isValid = rule.test(value);
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 text-sm transition-all duration-200',
              isValid ? 'text-green-600' : 'text-gray-500'
            )}
          >
            <div className={cn(
              'flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-200',
              isValid 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300'
            )}>
              {isValid ? (
                <Check className="w-2.5 h-2.5" />
              ) : (
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              )}
            </div>
            <span>{rule.message || rule.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// Form Section Validation Status
interface FormSectionStatusProps {
  title: string;
  fields: Array<{
    name: string;
    state: ValidationState;
  }>;
  collapsible?: boolean;
  className?: string;
}

export const FormSectionStatus: React.FC<FormSectionStatusProps> = ({
  title,
  fields,
  collapsible = false,
  className
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const allValid = fields.every(f => f.state === 'valid');
  const hasInvalid = fields.some(f => f.state === 'invalid' || f.state === 'error');
  const isValidating = fields.some(f => f.state === 'validating');

  const getSectionStatus = () => {
    if (isValidating) return { icon: Loader2, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (hasInvalid) return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
    if (allValid) return { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' };
    return { icon: Info, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  };

  const { icon: Icon, color, bgColor } = getSectionStatus();

  return (
    <div className={cn('rounded-lg border p-3', bgColor, className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', color, isValidating && 'animate-spin')} />
          <h3 className={cn('font-medium', color)}>{title}</h3>
          <span className="text-sm text-muted-foreground">
            ({fields.filter(f => f.state === 'valid').length}/{fields.length})
          </span>
        </div>
        
        {collapsible && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn('text-sm', color)}
          >
            {isCollapsed ? 'Show' : 'Hide'}
          </button>
        )}
      </div>
      
      {!isCollapsed && fields.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-1">
              <ValidationBadge state={field.state} size="sm" showText={false} />
              <span className="truncate">{field.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default {
  SuccessIndicator,
  ValidationBadge,
  FieldValidationSummary,
  InlineValidation,
  ValidationFeedback,
  FormSectionStatus
};