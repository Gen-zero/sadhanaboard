import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
}

const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className,
  rows = 3
}: FormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Mark as touched when field loses focus
  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
  };

  // Mark as touched when value changes after first blur
  useEffect(() => {
    if (isTouched && value !== undefined) {
      setIsTouched(true);
    }
  }, [value, isTouched]);

  const hasError = isTouched && error;

  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={id} 
        className={cn(
          'text-sm font-medium',
          hasError ? 'text-destructive' : 'text-foreground'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className={cn(
            'resize-none',
            hasError ? 'border-destructive focus-visible:ring-destructive' : ''
          )}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className={cn(
            hasError ? 'border-destructive focus-visible:ring-destructive' : ''
          )}
        />
      )}
      
      {hasError && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
      
      {isFocused && !hasError && placeholder && (
        <p className="text-xs text-muted-foreground mt-1">{placeholder}</p>
      )}
    </div>
  );
};

export default FormField;