import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Loader2, Upload, Save, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLoadingState, LOADING_KEYS } from '@/hooks/useLoadingState';
import { LoadingButton, LoadingSpinner } from './LoadingComponents';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Enhanced input with loading states
interface LoadingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  loading?: boolean;
  loadingText?: string;
  validating?: boolean;
  onValidate?: (value: string) => Promise<boolean>;
  icon?: React.ReactNode;
}

export const LoadingInput: React.FC<LoadingInputProps> = ({
  label,
  error,
  success,
  loading = false,
  loadingText = 'Processing...',
  validating = false,
  onValidate,
  icon,
  className,
  onChange,
  ...props
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    
    if (onValidate) {
      // Clear previous validation timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      
      // Debounce validation
      validationTimeoutRef.current = setTimeout(async () => {
        setIsValidating(true);
        setValidationResult(null);
        
        try {
          const result = await onValidate(e.target.value);
          setValidationResult(result);
        } catch (error) {
          setValidationResult(false);
        } finally {
          setIsValidating(false);
        }
      }, 500);
    }
  };

  const getStatusIcon = () => {
    if (loading || isValidating || validating) {
      return <LoadingSpinner size="sm" />;
    }
    if (error) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (success || validationResult === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (validationResult === false) {
      return <X className="h-4 w-4 text-destructive" />;
    }
    return icon;
  };

  const getStatusMessage = () => {
    if (loading) return loadingText;
    if (isValidating || validating) return 'Validating...';
    if (error) return error;
    if (success) return success;
    if (validationResult === true) return 'Valid';
    if (validationResult === false) return 'Invalid';
    return null;
  };

  const statusMessage = getStatusMessage();
  const statusIcon = getStatusIcon();

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          className={cn(
            'transition-all duration-200',
            statusIcon && 'pr-10',
            error || validationResult === false
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : success || validationResult === true
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
              : (loading || isValidating || validating)
              ? 'border-primary focus:border-primary focus:ring-primary/20'
              : '',
            className
          )}
          onChange={handleChange}
          disabled={loading}
          {...props}
        />
        {statusIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {statusIcon}
          </div>
        )}
      </div>
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'text-sm flex items-center space-x-1',
              error || validationResult === false
                ? 'text-destructive'
                : success || validationResult === true
                ? 'text-green-500'
                : (loading || isValidating || validating)
                ? 'text-muted-foreground'
                : 'text-muted-foreground'
            )}
          >
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced textarea with loading states
interface LoadingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  loading?: boolean;
  loadingText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const LoadingTextarea: React.FC<LoadingTextareaProps> = ({
  label,
  error,
  success,
  loading = false,
  loadingText = 'Processing...',
  maxLength,
  showCharCount = false,
  className,
  value,
  ...props
}) => {
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">
            {label}
          </Label>
          {showCharCount && maxLength && (
            <span className="text-xs text-muted-foreground">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      <Textarea
        className={cn(
          'transition-all duration-200 min-h-[100px]',
          error
            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
            : success
            ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
            : loading
            ? 'border-primary focus:border-primary focus:ring-primary/20'
            : '',
          className
        )}
        value={value}
        maxLength={maxLength}
        disabled={loading}
        {...props}
      />
      <div className="flex justify-between items-center">
        <AnimatePresence>
          {(error || success || loading) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'text-sm flex items-center space-x-1',
                error
                  ? 'text-destructive'
                  : success
                  ? 'text-green-500'
                  : 'text-muted-foreground'
              )}
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>
                {loading ? loadingText : error || success}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {!showCharCount && maxLength && (
          <span className="text-xs text-muted-foreground">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// File upload with loading states
interface LoadingFileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onUpload?: (files: File[]) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: string;
  progress?: number;
  className?: string;
}

export const LoadingFileUpload: React.FC<LoadingFileUploadProps> = ({
  label,
  accept,
  multiple = false,
  maxSize,
  onUpload,
  loading = false,
  error,
  success,
  progress,
  className
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: File[]) => {
    if (!onUpload) return;

    // Validate file sizes
    if (maxSize) {
      const oversizedFiles = files.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        return;
      }
    }

    await onUpload(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    handleFileSelect(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      handleFileSelect(files);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <button
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
          dragOver
            ? 'border-primary bg-primary/5'
            : loading
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-destructive bg-destructive/5'
            : success
            ? 'border-green-500 bg-green-500/5'
            : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5',
          loading && 'pointer-events-none',
          className
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload files by clicking or dragging and dropping"
        type="button"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFileInputChange}
          disabled={loading}
        />
        
        <div className="flex flex-col items-center space-y-2 text-center">
          {loading ? (
            <LoadingSpinner size="lg" variant="spiritual" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {loading
                ? 'Uploading...'
                : dragOver
                ? 'Drop files here'
                : 'Click to upload or drag and drop'
              }
            </p>
            {!loading && (
              <p className="text-xs text-muted-foreground">
                {accept || 'Any file type'}
                {maxSize && ` • Max ${Math.round(maxSize / (1024 * 1024))}MB`}
              </p>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        {loading && typeof progress === 'number' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-lg overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </button>
      
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'text-sm flex items-center space-x-1',
              error ? 'text-destructive' : 'text-green-500'
            )}
          >
            {error ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Complete form with loading states
interface LoadingFormProps {
  title?: string;
  description?: string;
  onSubmit?: (data: Record<string, unknown>) => Promise<void>;
  submitText?: string;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LoadingForm: React.FC<LoadingFormProps> = ({
  title,
  description,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  children,
  className
}) => {
  const { isLoading } = useLoadingState();
  const formLoading = loading || isLoading(LOADING_KEYS.FORM_SUBMIT);

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (onSubmit && !formLoading) {
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              await onSubmit(data);
            }
          }}
          className="space-y-6"
        >
          <fieldset disabled={formLoading} className="space-y-4">
            {children}
          </fieldset>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" disabled={formLoading}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              loading={formLoading}
              loadingText="Submitting..."
              icon={formLoading ? undefined : <Send className="h-4 w-4" />}
            >
              {submitText}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Form field wrapper with consistent styling
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  success,
  loading = false,
  children
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground flex items-center">
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
        {loading && (
          <LoadingSpinner size="sm" />
        )}
      </Label>
      {children}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'text-sm flex items-center space-x-1',
              error ? 'text-destructive' : 'text-green-500'
            )}
          >
            {error ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};