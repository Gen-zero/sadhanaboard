import { useState, useCallback, useRef, useEffect } from 'react';
import { z } from 'zod';

// Enhanced validation states
export type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid' | 'error';

export interface FieldValidation<T = unknown> {
  value: T;
  state: ValidationState;
  error?: string;
  touched: boolean;
  focused: boolean;
  showSuccess?: boolean;
}

export interface FormValidationConfig {
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  showSuccessStates?: boolean;
  realTimeValidation?: boolean;
  // New configuration options for enhanced validation
  validateOnFocus?: boolean;
  validateOnValueChange?: boolean;
  showErrorImmediately?: boolean;
  successDelayMs?: number;
}

const DEFAULT_CONFIG: FormValidationConfig = {
  debounceMs: 300,
  validateOnChange: true,
  validateOnBlur: true,
  validateOnMount: false,
  showSuccessStates: true,
  realTimeValidation: true,
  validateOnFocus: false,
  validateOnValueChange: true,
  showErrorImmediately: false,
  successDelayMs: 1000
};

export function useFormValidation<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  initialValues: T,
  config: FormValidationConfig = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Form state
  const [values, setValues] = useState<T>(initialValues);
  const [fields, setFields] = useState<Record<keyof T, FieldValidation>>(() => {
    const initialFields: Record<keyof T, FieldValidation> = {} as Record<keyof T, FieldValidation>;
    Object.keys(initialValues).forEach(key => {
      initialFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        state: 'idle',
        touched: false,
        focused: false,
        showSuccess: finalConfig.showSuccessStates
      };
    });
    return initialFields;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const validationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Validate single field
  const validateField = useCallback(async (
    fieldName: keyof T, 
    value: unknown, 
    immediate: boolean = false
  ): Promise<void> => {
    // Clear existing timeout for this field
    if (validationTimeouts.current[fieldName as string]) {
      clearTimeout(validationTimeouts.current[fieldName as string]);
    }

    const runValidation = async () => {
      setFields(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          state: 'validating'
        }
      }));

      try {
        // Create a partial object for validation
        const testData = { ...values, [fieldName]: value };
        
        // Try to validate the specific field using the schema
        // For Zod schemas, attempt to get field schema if it's an object schema
        if (schema instanceof z.ZodObject) {
          const fieldSchema = (schema as z.ZodObject<z.ZodRawShape>).shape?.[fieldName as string];
          if (fieldSchema) {
            await fieldSchema.parseAsync(value);
          } else {
            // Fallback: validate the whole object and check this field
            await schema.parseAsync(testData);
          }
        } else {
          // For non-object schemas, validate the whole object
          await schema.parseAsync(testData);
        }

        // Add delay before showing success state for better UX
        if (finalConfig.successDelayMs && finalConfig.successDelayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, finalConfig.successDelayMs));
        }

        setFields(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            state: 'valid',
            error: undefined
          }
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(e => 
            e.path.includes(fieldName as string)
          );
          
          setFields(prev => ({
            ...prev,
            [fieldName]: {
              ...prev[fieldName],
              state: 'invalid',
              error: fieldError?.message || 'Invalid value'
            }
          }));
        } else {
          setFields(prev => ({
            ...prev,
            [fieldName]: {
              ...prev[fieldName],
              state: 'error',
              error: 'Validation error occurred'
            }
          }));
        }
      }
    };

    if (immediate || !finalConfig.realTimeValidation) {
      await runValidation();
    } else {
      validationTimeouts.current[fieldName as string] = setTimeout(runValidation, finalConfig.debounceMs);
    }
  }, [schema, values, finalConfig.debounceMs, finalConfig.realTimeValidation, finalConfig.successDelayMs]);

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await schema.parseAsync(values);
      
      // Mark all fields as valid
      setFields(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key as keyof T] = {
            ...updated[key as keyof T],
            state: 'valid',
            error: undefined
          };
        });
        return updated;
      });
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Update field states based on errors
        setFields(prev => {
          const updated = { ...prev };
          
          // First, mark all as valid
          Object.keys(updated).forEach(key => {
            updated[key as keyof T] = {
              ...updated[key as keyof T],
              state: 'valid',
              error: undefined
            };
          });
          
          // Then mark errored fields
          error.errors.forEach(err => {
            const fieldName = err.path[0] as keyof T;
            if (fieldName && updated[fieldName]) {
              updated[fieldName] = {
                ...updated[fieldName],
                state: 'invalid',
                error: err.message
              };
            }
          });
          
          return updated;
        });
      }
      return false;
    }
  }, [schema, values]);

  // Update field value
  const updateField = useCallback((fieldName: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        touched: true
      }
    }));

    // Validate on change if enabled
    if (finalConfig.validateOnChange) {
      validateField(fieldName, value);
    }
  }, [finalConfig.validateOnChange, validateField]);

  // Handle field focus
  const handleFocus = useCallback((fieldName: keyof T) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        focused: true
      }
    }));
  }, []);

  // Handle field blur
  const handleBlur = useCallback((fieldName: keyof T) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        focused: false,
        touched: true
      }
    }));

    // Validate on blur if enabled
    if (finalConfig.validateOnBlur) {
      validateField(fieldName, values[fieldName], true);
    }
  }, [finalConfig.validateOnBlur, validateField, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit: (data: T) => void | Promise<void>) => {
    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);
    
    // Mark all fields as touched
    setFields(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key as keyof T] = {
          ...updated[key as keyof T],
          touched: true
        };
      });
      return updated;
    });

    try {
      const isValid = await validateForm();
      if (isValid) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm]);

  // Reset form
  const reset = useCallback((newValues?: Partial<T>) => {
    const resetValues = newValues ? { ...values, ...newValues } : initialValues;
    setValues(resetValues);
    setSubmitCount(0);
    setIsSubmitting(false);
    
    // Clear all validation timeouts
    Object.values(validationTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    validationTimeouts.current = {};
    
    // Reset field states
    setFields(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key as keyof T] = {
          value: resetValues[key as keyof T],
          state: 'idle',
          touched: false,
          focused: false,
          showSuccess: finalConfig.showSuccessStates
        };
      });
      return updated;
    });
  }, [values, initialValues, finalConfig.showSuccessStates]);

  // Set field error manually
  const setFieldError = useCallback((fieldName: keyof T, error: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        state: 'invalid',
        error
      }
    }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((fieldName: keyof T) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        state: 'idle',
        error: undefined
      }
    }));
  }, []);

  // Get field props for easy integration
  const getFieldProps = useCallback((fieldName: keyof T) => {
    const field = fields[fieldName];
    return {
      value: values[fieldName],
      onChange: (value: unknown) => updateField(fieldName, value),
      onFocus: () => handleFocus(fieldName),
      onBlur: () => handleBlur(fieldName),
      error: field?.error,
      isValid: field?.state === 'valid',
      isInvalid: field?.state === 'invalid',
      isValidating: field?.state === 'validating',
      isTouched: field?.touched,
      isFocused: field?.focused,
      showSuccess: field?.showSuccess && field?.state === 'valid' && field?.touched
    };
  }, [values, fields, updateField, handleFocus, handleBlur]);

  // Computed properties
  const isValid = Object.values(fields).every(field => 
    field.state === 'valid' || field.state === 'idle'
  );
  
  const hasErrors = Object.values(fields).some(field => 
    field.state === 'invalid' || field.state === 'error'
  );
  
  const isDirty = Object.values(fields).some(field => field.touched);

  // Validate on mount if enabled
  useEffect(() => {
    if (finalConfig.validateOnMount) {
      validateForm();
    }
  }, [finalConfig.validateOnMount, validateForm]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return {
    // Values and state
    values,
    fields,
    isValid,
    hasErrors,
    isDirty,
    isSubmitting,
    submitCount,
    
    // Actions
    updateField,
    handleFocus,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    reset,
    setFieldError,
    clearFieldError,
    
    // Helpers
    getFieldProps
  };
}

// Hook for individual field validation
export function useFieldValidation<T>(
  validator: (value: T) => Promise<string | undefined> | string | undefined,
  initialValue: T,
  config: Partial<FormValidationConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [field, setField] = useState<FieldValidation<T>>({
    value: initialValue,
    state: 'idle',
    touched: false,
    focused: false,
    showSuccess: finalConfig.showSuccessStates
  });
  
  const validationTimeout = useRef<NodeJS.Timeout>();

  const validate = useCallback(async (value: T, immediate: boolean = false) => {
    if (validationTimeout.current) {
      clearTimeout(validationTimeout.current);
    }

    const runValidation = async () => {
      setField(prev => ({ ...prev, state: 'validating' }));
      
      try {
        const error = await validator(value);
        setField(prev => ({
          ...prev,
          state: error ? 'invalid' : 'valid',
          error
        }));
      } catch (err) {
        setField(prev => ({
          ...prev,
          state: 'error',
          error: 'Validation failed'
        }));
      }
    };

    if (immediate || !finalConfig.realTimeValidation) {
      await runValidation();
    } else {
      validationTimeout.current = setTimeout(runValidation, finalConfig.debounceMs);
    }
  }, [validator, finalConfig.debounceMs, finalConfig.realTimeValidation]);

  const updateValue = useCallback((value: T) => {
    setField(prev => ({ ...prev, value, touched: true }));
    
    if (finalConfig.validateOnChange) {
      validate(value);
    }
  }, [finalConfig.validateOnChange, validate]);

  const handleFocus = useCallback(() => {
    setField(prev => ({ ...prev, focused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setField(prev => ({ ...prev, focused: false, touched: true }));
    
    if (finalConfig.validateOnBlur) {
      validate(field.value, true);
    }
  }, [finalConfig.validateOnBlur, validate, field.value]);

  useEffect(() => {
    return () => {
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
    };
  }, []);

  return {
    ...field,
    updateValue,
    handleFocus,
    handleBlur,
    validate: (immediate?: boolean) => validate(field.value, immediate)
  };
}