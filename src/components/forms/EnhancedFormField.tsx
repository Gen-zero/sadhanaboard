import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  HelpCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ValidationState } from '@/hooks/useFormValidation';

export interface EnhancedFormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' | 'textarea';
  value: string | number;
  onChange: (value: string | number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  
  // Validation props
  validationState?: ValidationState;
  error?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  isValidating?: boolean;
  isTouched?: boolean;
  isFocused?: boolean;
  showSuccess?: boolean;
  
  // Styling props
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  
  // Additional features
  helpText?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  rows?: number; // for textarea
  showCharCount?: boolean;
  clearable?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Accessibility
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
}

export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  
  // Validation props
  validationState = 'idle',
  error,
  isValid = false,
  isInvalid = false,
  isValidating = false,
  isTouched = false,
  isFocused = false,
  showSuccess = true,
  
  // Styling props
  size = 'md',
  variant = 'default',
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  successClassName,
  
  // Additional features
  helpText,
  maxLength,
  minLength,
  pattern,
  rows = 3,
  showCharCount = false,
  clearable = false,
  icon,
  rightIcon,
  
  // Accessibility
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalFocused, setInternalFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  const focused = isFocused || internalFocused;
  
  // Character count
  const charCount = String(value).length;
  const isOverLimit = maxLength ? charCount > maxLength : false;
  
  // Determine validation display state
  const shouldShowError = (isTouched || focused) && (isInvalid || error);
  const shouldShowSuccess = showSuccess && isTouched && !shouldShowError && isValid;
  const shouldShowValidating = isValidating;
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };
  
  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInternalFocused(true);
    onFocus?.();
  };
  
  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInternalFocused(false);
    onBlur?.();
  };
  
  // Clear value
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      input: 'h-8 px-2 text-sm',
      label: 'text-xs',
      icon: 'h-3 w-3'
    },
    md: {
      input: 'h-10 px-3 text-sm',
      label: 'text-sm',
      icon: 'h-4 w-4'
    },
    lg: {
      input: 'h-12 px-4 text-base',
      label: 'text-base',
      icon: 'h-5 w-5'
    }
  };
  
  // Base input classes
  const inputBaseClasses = cn(
    'w-full rounded-md border transition-all duration-200',
    'placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[size].input,
    
    // Variant styles
    variant === 'default' && 'border-input bg-background',
    variant === 'outline' && 'border-2 border-input bg-transparent',
    variant === 'ghost' && 'border-0 bg-muted/50',
    
    // Validation states
    shouldShowError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
    shouldShowSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
    shouldShowValidating && 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20',
    
    // Focus states
    !shouldShowError && !shouldShowSuccess && !shouldShowValidating && 
    'focus:border-primary focus:ring-primary/20',
    
    // Icon padding
    icon && 'pl-10',
    (rightIcon || type === 'password' || clearable || shouldShowValidating || shouldShowSuccess || shouldShowError) && 'pr-10',
    
    inputClassName
  );
  
  // Label classes
  const labelClasses = cn(
    'block font-medium mb-1.5 transition-colors duration-200',
    sizeClasses[size].label,
    shouldShowError && 'text-destructive',
    shouldShowSuccess && 'text-green-600',
    required && "after:content-['*'] after:text-destructive after:ml-1",
    labelClassName
  );
  
  // Error classes
  const errorClasses = cn(
    'text-sm text-destructive mt-1.5 flex items-center gap-1',
    'animate-in slide-in-from-top-1 duration-200',
    errorClassName
  );
  
  // Success classes
  const successClasses = cn(
    'text-sm text-green-600 mt-1.5 flex items-center gap-1',
    'animate-in slide-in-from-top-1 duration-200',
    successClassName
  );
  
  // Generate unique IDs
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  const charCountId = `${id}-char-count`;
  
  // Aria describedby
  const describedBy = [
    ariaDescribedBy,
    error && errorId,
    helpText && helpId,
    showCharCount && charCountId
  ].filter(Boolean).join(' ');
  
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className={cn('space-y-1', className)}>
      {/* Label */}
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {React.cloneElement(icon as React.ReactElement, {
              className: cn(sizeClasses[size].icon, (icon as any)?.props?.className)
            })}
          </div>
        )}
        
        {/* Input/Textarea */}
        <InputComponent
          ref={inputRef as any}
          id={id}
          name={name}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          rows={type === 'textarea' ? rows : undefined}
          className={inputBaseClasses}
          aria-describedby={describedBy || undefined}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid ?? (shouldShowError ? true : false)}
        />
        
        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Validation States */}
          {shouldShowValidating && (
            <Loader2 className={cn(sizeClasses[size].icon, 'text-blue-500 animate-spin')} />
          )}
          
          {shouldShowSuccess && (
            <CheckCircle2 className={cn(sizeClasses[size].icon, 'text-green-500')} />
          )}
          
          {shouldShowError && (
            <AlertCircle className={cn(sizeClasses[size].icon, 'text-destructive')} />
          )}
          
          {/* Clear Button */}
          {clearable && value && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              <X className={sizeClasses[size].icon} />
            </button>
          )}
          
          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className={sizeClasses[size].icon} />
              ) : (
                <Eye className={sizeClasses[size].icon} />
              )}
            </button>
          )}
          
          {/* Custom Right Icon */}
          {rightIcon && (
            <div className="text-muted-foreground">
              {React.cloneElement(rightIcon as React.ReactElement, {
                className: cn(sizeClasses[size].icon, (rightIcon as any)?.props?.className)
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="flex justify-between items-start gap-2 mt-1">
        <div className="flex-1 space-y-1">
          {/* Error Message */}
          {shouldShowError && error && (
            <div 
              id={errorId} 
              className={errorClasses} 
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Success Message */}
          {shouldShowSuccess && (
            <div className={successClasses}>
              <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>Valid</span>
            </div>
          )}
          
          {/* Help Text */}
          {helpText && !shouldShowError && (
            <div id={helpId} className="text-sm text-muted-foreground flex items-start gap-1.5">
              <HelpCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>{helpText}</span>
            </div>
          )}
        </div>
        
        {/* Character Count */}
        {showCharCount && maxLength && (
          <div
            id={charCountId}
            className={cn(
              'text-xs tabular-nums self-end',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedFormField;