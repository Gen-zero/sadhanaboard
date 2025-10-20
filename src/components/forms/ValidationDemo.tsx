import React, { useState } from 'react';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  Globe, 
  Settings,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { EnhancedFormField } from './EnhancedFormField';
import { 
  SuccessIndicator,
  ValidationBadge,
  FieldValidationSummary,
  InlineValidation,
  ValidationFeedback,
  FormSectionStatus
} from './ValidationComponents';

// Demo form schema
const demoFormSchema = z.object({
  // Personal Information
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  
  dateOfBirth: z.string()
    .refine(date => {
      const birth = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      return age >= 13 && age <= 120;
    }, 'You must be between 13 and 120 years old'),
  
  // Account Information
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  confirmPassword: z.string(),
  
  // Preferences
  website: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type DemoFormData = z.infer<typeof demoFormSchema>;

const ValidationDemo: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'basic' | 'advanced' | 'realtime' | 'testing'>('basic');
  
  // Initialize form validation
  const {
    values,
    fields,
    isValid,
    hasErrors,
    isDirty,
    isSubmitting,
    updateField,
    handleSubmit,
    reset,
    getFieldProps
  } = useFormValidation(demoFormSchema, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    username: '',
    password: '',
    confirmPassword: '',
    website: '',
    bio: ''
  }, {
    debounceMs: 300,
    validateOnChange: true,
    validateOnBlur: true,
    showSuccessStates: true,
    realTimeValidation: true
  });

  // Password strength rules
  const passwordRules = [
    {
      label: 'At least 8 characters',
      test: (value: string) => value.length >= 8,
      message: 'Minimum 8 characters'
    },
    {
      label: 'Contains uppercase letter',
      test: (value: string) => /[A-Z]/.test(value),
      message: 'One uppercase letter (A-Z)'
    },
    {
      label: 'Contains lowercase letter',
      test: (value: string) => /[a-z]/.test(value),
      message: 'One lowercase letter (a-z)'
    },
    {
      label: 'Contains number',
      test: (value: string) => /\d/.test(value),
      message: 'One number (0-9)'
    },
    {
      label: 'Contains special character',
      test: (value: string) => /[@$!%*?&]/.test(value),
      message: 'One special character (@$!%*?&)'
    }
  ];

  // Handle form submission
  const onSubmit = async (data: DemoFormData) => {
    console.log('Form submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Form submitted successfully!');
  };

  // Get field validation status for summary
  const fieldStatuses = Object.entries(fields).map(([name, field]) => ({
    name,
    label: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
    state: field.state,
    error: field.error
  }));

  const tabs = {
    basic: (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Basic Form Validation</h2>
          <p className="text-gray-600">
            Demonstrates enhanced form fields with real-time validation, error positioning, and success indicators.
          </p>
        </div>

        <form className="max-w-2xl mx-auto space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedFormField
                id="firstName"
                name="firstName"
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                required
                icon={<User />}
                maxLength={50}
                showCharCount
                clearable
                {...getFieldProps('firstName')}
              />
              
              <EnhancedFormField
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
                required
                icon={<User />}
                maxLength={50}
                showCharCount
                clearable
                {...getFieldProps('lastName')}
              />
            </div>
            
            <EnhancedFormField
              id="email"
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              required
              icon={<Mail />}
              maxLength={100}
              showCharCount
              clearable
              helpText="We'll never share your email with anyone else"
              {...getFieldProps('email')}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedFormField
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                icon={<Phone />}
                helpText="Optional - for account recovery"
                {...getFieldProps('phone')}
              />
              
              <EnhancedFormField
                id="dateOfBirth"
                name="dateOfBirth"
                label="Date of Birth"
                type="text"
                placeholder="YYYY-MM-DD"
                required
                icon={<Calendar />}
                helpText="You must be at least 13 years old"
                {...getFieldProps('dateOfBirth')}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Form'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    ),

    advanced: (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Advanced Validation Features</h2>
          <p className="text-gray-600">
            Explore advanced validation components and patterns.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Validation Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Form Validation Summary</h3>
            <FieldValidationSummary fields={fieldStatuses} />
          </div>

          {/* Success Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Success Indicators</h3>
            <div className="space-y-2">
              <SuccessIndicator message="Valid email format" />
              <SuccessIndicator message="Password meets requirements" size="sm" />
              <SuccessIndicator message="All fields completed successfully" size="lg" />
            </div>
          </div>
        </div>
      </div>
    ),

    realtime: (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Real-time Validation Demo</h2>
          <p className="text-gray-600">
            Watch validation happen in real-time as you type.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="font-medium">Form Status</div>
              <div className="space-y-0.5">
                <div>Valid: <span className={isValid ? 'text-green-600' : 'text-red-600'}>{isValid ? 'Yes' : 'No'}</span></div>
                <div>Has Errors: <span className={hasErrors ? 'text-red-600' : 'text-green-600'}>{hasErrors ? 'Yes' : 'No'}</span></div>
                <div>Is Dirty: <span className={isDirty ? 'text-blue-600' : 'text-gray-600'}>{isDirty ? 'Yes' : 'No'}</span></div>
                <div>Submitting: <span className={isSubmitting ? 'text-yellow-600' : 'text-gray-600'}>{isSubmitting ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="font-medium">Field States</div>
              <div className="space-y-0.5 text-xs">
                {Object.entries(fields).map(([name, field]) => (
                  <div key={name} className="flex justify-between">
                    <span className="truncate">{name}:</span>
                    <ValidationBadge state={field.state} size="sm" showText={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time validation examples */}
          <div className="space-y-4">
            <EnhancedFormField
              id="realtimeEmail"
              name="email"
              label="Email (Real-time validation)"
              type="email"
              placeholder="Type an email to see real-time validation"
              icon={<Mail />}
              {...getFieldProps('email')}
            />
            
            <div className="space-y-2">
              <EnhancedFormField
                id="realtimePassword"
                name="password"
                label="Password (Real-time validation)"
                type="password"
                placeholder="Type a password to see real-time validation"
                icon={<Lock />}
                {...getFieldProps('password')}
              />
              
              {values.password && (
                <ValidationFeedback
                  rules={passwordRules}
                  value={values.password}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    ),

    testing: (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Validation Testing Interface</h2>
          <p className="text-gray-600">
            Test different validation scenarios and edge cases.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                updateField('email', 'invalid-email');
                updateField('password', '123');
                updateField('firstName', '');
              }}
              className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-left"
            >
              <h3 className="font-medium text-red-600 mb-1">Test Invalid States</h3>
              <p className="text-sm text-gray-600">Fill form with invalid data to test error states</p>
            </button>
            
            <button
              onClick={() => {
                updateField('email', 'user@example.com');
                updateField('password', 'SecurePass123!');
                updateField('confirmPassword', 'SecurePass123!');
                updateField('firstName', 'John');
                updateField('lastName', 'Doe');
                updateField('username', 'johndoe');
                updateField('dateOfBirth', '1990-01-01');
              }}
              className="p-4 border border-green-300 rounded-lg hover:bg-green-50 text-left"
            >
              <h3 className="font-medium text-green-600 mb-1">Test Valid States</h3>
              <p className="text-sm text-gray-600">Fill form with valid data to test success states</p>
            </button>
            
            <button
              onClick={() => reset()}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
            >
              <h3 className="font-medium text-gray-600 mb-1">Reset Form</h3>
              <p className="text-sm text-gray-600">Clear all form data and reset validation states</p>
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(fields).length}</div>
                <div className="text-sm text-gray-600">Total Fields</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(fields).filter(f => f.state === 'valid').length}
                </div>
                <div className="text-sm text-gray-600">Valid Fields</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(fields).filter(f => f.state === 'invalid' || f.state === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Invalid Fields</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Object.values(fields).filter(f => f.state === 'validating').length}
                </div>
                <div className="text-sm text-gray-600">Validating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-4 overflow-x-auto">
          {Object.keys(tabs).map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab as any)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                currentTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Demo
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {tabs[currentTab]}
      </div>
    </div>
  );
};

export default ValidationDemo;