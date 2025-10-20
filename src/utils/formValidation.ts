export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class FormValidator {
  private errors: ValidationError[] = [];

  // Validate required fields
  required(value: string | undefined, fieldName: string, customMessage?: string): FormValidator {
    if (!value || value.trim() === '') {
      this.errors.push({
        field: fieldName,
        message: customMessage || `${fieldName} is required`
      });
    }
    return this;
  }

  // Validate email format
  email(value: string | undefined, fieldName: string): FormValidator {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.errors.push({
        field: fieldName,
        message: `Please enter a valid email address`
      });
    }
    return this;
  }

  // Validate minimum length
  minLength(value: string | undefined, fieldName: string, minLength: number): FormValidator {
    if (value && value.length < minLength) {
      this.errors.push({
        field: fieldName,
        message: `${fieldName} must be at least ${minLength} characters long`
      });
    }
    return this;
  }

  // Validate maximum length
  maxLength(value: string | undefined, fieldName: string, maxLength: number): FormValidator {
    if (value && value.length > maxLength) {
      this.errors.push({
        field: fieldName,
        message: `${fieldName} must be no more than ${maxLength} characters long`
      });
    }
    return this;
  }

  // Validate password strength
  password(value: string | undefined, fieldName: string): FormValidator {
    if (value) {
      if (value.length < 8) {
        this.errors.push({
          field: fieldName,
          message: `${fieldName} must be at least 8 characters long`
        });
      }
      
      if (!/[A-Z]/.test(value)) {
        this.errors.push({
          field: fieldName,
          message: `${fieldName} must contain at least one uppercase letter`
        });
      }
      
      if (!/[a-z]/.test(value)) {
        this.errors.push({
          field: fieldName,
          message: `${fieldName} must contain at least one lowercase letter`
        });
      }
      
      if (!/[0-9]/.test(value)) {
        this.errors.push({
          field: fieldName,
          message: `${fieldName} must contain at least one number`
        });
      }
    }
    return this;
  }

  // Validate custom pattern
  pattern(value: string | undefined, fieldName: string, pattern: RegExp, message: string): FormValidator {
    if (value && !pattern.test(value)) {
      this.errors.push({
        field: fieldName,
        message
      });
    }
    return this;
  }

  // Validate equality (e.g., password confirmation)
  equals(value1: string | undefined, value2: string | undefined, fieldName: string, message: string): FormValidator {
    if (value1 !== value2) {
      this.errors.push({
        field: fieldName,
        message
      });
    }
    return this;
  }

  // Get validation result
  getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors]
    };
  }

  // Clear errors
  clear(): FormValidator {
    this.errors = [];
    return this;
  }
}

// Predefined validation functions
export const validateEmail = (email: string): ValidationResult => {
  const validator = new FormValidator();
  validator.required(email, 'Email').email(email, 'Email');
  return validator.getResult();
};

export const validatePassword = (password: string): ValidationResult => {
  const validator = new FormValidator();
  validator.required(password, 'Password').password(password, 'Password');
  return validator.getResult();
};

export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  const validator = new FormValidator();
  validator.required(confirmPassword, 'Password confirmation')
    .equals(password, confirmPassword, 'Password confirmation', 'Passwords do not match');
  return validator.getResult();
};

export const validateRequiredField = (value: string, fieldName: string): ValidationResult => {
  const validator = new FormValidator();
  validator.required(value, fieldName);
  return validator.getResult();
};

export const validateUsername = (username: string): ValidationResult => {
  const validator = new FormValidator();
  validator.required(username, 'Username')
    .minLength(username, 'Username', 3)
    .maxLength(username, 'Username', 20)
    .pattern(username, 'Username', /^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');
  return validator.getResult();
};