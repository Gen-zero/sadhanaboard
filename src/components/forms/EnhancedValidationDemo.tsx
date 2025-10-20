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
  EyeOff,
  Info
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

// Enhanced demo form schema with more complex validation
const enhancedFormSchema = z.object({
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

type EnhancedFormData = z.infer<typeof enhancedFormSchema>;

const EnhancedValidationDemo: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'basic' | 'advanced' | 'realtime' | 'testing'>('basic');
  
  // Initialize form validation with enhanced configuration
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
  } = useFormValidation<EnhancedFormData>(enhancedFormSchema, {
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
    realTimeValidation: true,
    validateOnFocus: false,
    validateOnValueChange: true,
    showErrorImmediately: false,
    successDelayMs: 1000
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
  const onSubmit = async (data: EnhancedFormData) => {
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
          <h2 className="text-2xl font-bold mb-2">Enhanced Form Validation</h2>
          <p className="text-gray-600">
            Demonstrates improved real-time validation, enhanced error positioning, and success indicators.
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
              {...getFieldProps('email')}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedFormField
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                icon={<Phone />}
                helpText="Optional: Include country code for international numbers"
                {...getFieldProps('phone')}
              />
              
              <EnhancedFormField
                id="dateOfBirth"
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                icon={<Calendar />}
                helpText="You must be at least 13 years old"
                {...getFieldProps('dateOfBirth')}
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Information
            </h3>
            
            <EnhancedFormField
              id="username"
              name="username"
              label="Username"
              type="text"
              placeholder="Choose a username"
              required
              icon={<User />}
              maxLength={20}
              showCharCount
              helpText="Can contain letters, numbers, and underscores"
              {...getFieldProps('username')}
            />
            
            <EnhancedFormField
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              required
              icon={<Lock />}
              helpText="Must contain uppercase, lowercase, number, and special character"
              {...getFieldProps('password')}
            />
            
            {/* Password strength feedback */}
            {values.password && (
              <div className="ml-1">
                <ValidationFeedback 
                  rules={passwordRules} 
                  value={values.password} 
                  className="mt-2" 
                />
              </div>
            )}
            
            <EnhancedFormField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
              icon={<Lock />}
              {...getFieldProps('confirmPassword')}
            />
            
            {/* Inline validation for password confirmation */}
            <InlineValidation
              state={fields.confirmPassword?.state || 'idle'}
              error={fields.confirmPassword?.error}
              successMessage="Passwords match"
              position="bottom"
              animation="bounce"
            />
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences
            </h3>
            
            <EnhancedFormField
              id="website"
              name="website"
              label="Personal Website"
              type="url"
              placeholder="https://example.com"
              icon={<Globe />}
              helpText="Optional: Your personal or professional website"
              {...getFieldProps('website')}
            />
            
            <EnhancedFormField
              id="bio"
              name="bio"
              label="Bio"
              type="textarea"
              placeholder="Tell us about yourself"
              rows={4}
              maxLength={500}
              showCharCount
              helpText="Optional: Share a brief description of yourself (max 500 characters)"
              {...getFieldProps('bio')}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              onClick={reset}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded-md transition-colors"
            >
              Reset Form
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
            Advanced validation components and real-time feedback systems.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Validation Summary */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Form Validation Summary
            </h3>
            <FieldValidationSummary fields={fieldStatuses} />
          </div>
          
          {/* Section Status */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Section Validation Status</h3>
            <div className="space-y-4">
              <FormSectionStatus 
                title="Personal Information" 
                fields={[
                  { name: 'firstName', state: fields.firstName?.state || 'idle' },
                  { name: 'lastName', state: fields.lastName?.state || 'idle' },
                  { name: 'email', state: fields.email?.state || 'idle' }
                ]} 
              />
              <FormSectionStatus 
                title="Account Security" 
                fields={[
                  { name: 'username', state: fields.username?.state || 'idle' },
                  { name: 'password', state: fields.password?.state || 'idle' },
                  { name: 'confirmPassword', state: fields.confirmPassword?.state || 'idle' }
                ]} 
              />
            </div>
          </div>
          
          {/* Validation Badges */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Validation State Badges</h3>
            <div className="flex flex-wrap gap-3">
              <ValidationBadge state="idle" showText={true} />
              <ValidationBadge state="validating" showText={true} />
              <ValidationBadge state="valid" showText={true} />
              <ValidationBadge state="invalid" showText={true} />
              <ValidationBadge state="error" showText={true} />
            </div>
          </div>
          
          {/* Success Indicators */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Success Indicators</h3>
            <div className="space-y-3">
              <SuccessIndicator message="Field validated successfully" position="right" />
              <SuccessIndicator message="All requirements met" position="bottom" size="md" />
              <SuccessIndicator message="Strong password" position="right" size="sm" />
            </div>
          </div>
        </div>
      </div>
    ),
    
    realtime: (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Real-time Validation Monitoring</h2>
          <p className="text-gray-600">
            Live monitoring of form validation states and performance.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Field States</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(fields).map(([name, field]) => (
              <div key={name} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{name}</span>
                  <ValidationBadge state={field.state} size="sm" />
                </div>
                <div className="text-sm text-gray-600">
                  {field.error && <span className="text-red-600">{field.error}</span>}
                  {!field.error && field.state === 'valid' && <span className="text-green-600">Valid</span>}
                  {field.state === 'idle' && <span className="text-gray-500">Not validated</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Form Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{Object.keys(fields).length}</div>
              <div className="text-sm text-gray-600">Total Fields</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(fields).filter(f => f.state === 'valid').length}
              </div>
              <div className="text-sm text-gray-600">Valid Fields</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(fields).filter(f => f.state === 'invalid' || f.state === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Invalid Fields</div>
            </div>
          </div>
        </div>
      </div>
    ),
    
    testing: (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Validation Testing</h2>
          <p className="text-gray-600">
            Test various validation scenarios and edge cases.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Test Scenarios</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Password Strength Testing</h4>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Type a password to test strength"
                  className="w-full border rounded-md px-3 py-2"
                  onChange={(e) => updateField('password', e.target.value)}
                />
                {values.password && (
                  <ValidationFeedback 
                    rules={passwordRules} 
                    value={values.password} 
                  />
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Email Validation Testing</h4>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Type an email to test validation"
                  className="w-full border rounded-md px-3 py-2"
                  onChange={(e) => updateField('email', e.target.value)}
                />
                <InlineValidation
                  state={fields.email?.state || 'idle'}
                  error={fields.email?.error}
                  successMessage="Valid email address"
                  position="bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b">
        {(['basic', 'advanced', 'realtime', 'testing'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={cn(
              'px-4 py-2 font-medium rounded-t-md transition-colors',
              currentTab === tab
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Demo
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {tabs[currentTab]}
      </div>
      
      {/* Form Status Footer */}
      <div className="mt-8 bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isValid ? 'Form Valid' : 'Form Invalid'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isDirty ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium">
                {isDirty ? 'Form Modified' : 'Form Unchanged'}
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {Object.values(fields).filter(f => f.state === 'valid').length} of {Object.keys(fields).length} fields validated
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for class names (since cn might not be available in this context)
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default EnhancedValidationDemo;