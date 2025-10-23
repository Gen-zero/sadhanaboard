// Custom URL validation function to replace vulnerable validator.isURL
function isValidURL(string, options = {}) {
  try {
    const url = new URL(string);
    
    // Check if protocol is required and present
    if (options.require_protocol && !url.protocol) {
      return false;
    }
    
    // Check if protocol is in allowed list
    if (options.protocols && options.protocols.length > 0) {
      const protocol = url.protocol.slice(0, -1); // Remove the trailing ':'
      if (!options.protocols.includes(protocol)) {
        return false;
      }
    }
    
    // Basic URL structure validation
    if (!url.hostname || url.hostname.length === 0) {
      return false;
    }
    
    // Check for valid hostname (not localhost/127.0.0.1 in our specific use case)
    // This will be handled separately in our validation logic
    
    return true;
  } catch (e) {
    // Invalid URL
    return false;
  }
}

// Custom escape function to replace validator.escape
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Custom email validation function
function isValidEmail(email) {
  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Custom email normalization function
function normalizeEmail(email) {
  if (typeof email !== 'string') return email;
  return email.toLowerCase().trim();
}

class ValidationMiddleware {
  // Validate and sanitize string inputs
  static validateString(field, options = {}) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        // If required and missing
        if (options.required && (value === undefined || value === null || value === '')) {
          return res.status(400).json({ 
            message: `Missing required field: ${field}`,
            field: field,
            code: 'MISSING_FIELD'
          });
        }
        
        // If not required and empty, skip validation
        if (!options.required && (value === undefined || value === null || value === '')) {
          return next();
        }
        
        // Convert to string
        value = String(value);
        
        // Trim whitespace
        if (options.trim !== false) {
          value = value.trim();
        }
        
        // Check minimum length
        if (options.minLength && value.length < options.minLength) {
          return res.status(400).json({ 
            message: `${field} must be at least ${options.minLength} characters long`,
            field: field,
            code: 'MIN_LENGTH_VIOLATION'
          });
        }
        
        // Check maximum length
        if (options.maxLength && value.length > options.maxLength) {
          return res.status(400).json({ 
            message: `${field} must be no more than ${options.maxLength} characters long`,
            field: field,
            code: 'MAX_LENGTH_VIOLATION'
          });
        }
        
        // Check for valid characters
        if (options.alphaOnly && !/^[a-zA-Z]+$/.test(value)) {
          return res.status(400).json({ 
            message: `${field} must contain only alphabetic characters`,
            field: field,
            code: 'INVALID_CHARACTERS'
          });
        }
        
        if (options.alphanumericOnly && !/^[a-zA-Z0-9]+$/.test(value)) {
          return res.status(400).json({ 
            message: `${field} must contain only alphanumeric characters`,
            field: field,
            code: 'INVALID_CHARACTERS'
          });
        }
        
        // Check for prohibited patterns (SQL injection, XSS, etc.)
        if (options.noSqlInjection && /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b|--|\/\*|\*\/|;)/gi.test(value)) {
          return res.status(400).json({ 
            message: `${field} contains prohibited SQL keywords`,
            field: field,
            code: 'SQL_INJECTION_ATTEMPT'
          });
        }
        
        if (options.noXss && /(<script|javascript:|on\w+\s*=)/gi.test(value)) {
          return res.status(400).json({ 
            message: `${field} contains prohibited scripting elements`,
            field: field,
            code: 'XSS_ATTEMPT'
          });
        }
        
        // Sanitize
        if (options.sanitize !== false) {
          value = escapeHTML(value);
        }
        
        // Update the request with sanitized value
        if (req.body[field] !== undefined) {
          req.body[field] = value;
        } else if (req.query[field] !== undefined) {
          req.query[field] = value;
        } else if (req.params[field] !== undefined) {
          req.params[field] = value;
        }
        
        next();
      } catch (error) {
        console.error(`Validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'Validation error occurred',
          code: 'VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate email
  static validateEmail(field) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        if (!value) {
          return res.status(400).json({ 
            message: `Missing required field: ${field}`,
            field: field,
            code: 'MISSING_FIELD'
          });
        }
        
        value = String(value).trim().toLowerCase();
        
        if (!isValidEmail(value)) {
          return res.status(400).json({ 
            message: 'Invalid email format',
            field: field,
            code: 'INVALID_EMAIL'
          });
        }
        
        // Additional check for disposable email addresses
        const disposableDomains = [
          '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
          'mailinator.com', 'yopmail.com', 'temp-mail.org'
        ];
        const emailDomain = value.split('@')[1];
        if (disposableDomains.includes(emailDomain)) {
          return res.status(400).json({ 
            message: 'Disposable email addresses are not allowed',
            field: field,
            code: 'DISPOSABLE_EMAIL'
          });
        }
        
        // Sanitize and normalize
        value = escapeHTML(normalizeEmail(value));
        
        // Update the request with sanitized value
        if (req.body[field] !== undefined) {
          req.body[field] = value;
        } else if (req.query[field] !== undefined) {
          req.query[field] = value;
        } else if (req.params[field] !== undefined) {
          req.params[field] = value;
        }
        
        next();
      } catch (error) {
        console.error(`Email validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'Email validation error occurred',
          code: 'EMAIL_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate number
  static validateNumber(field, options = {}) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        // If required and missing
        if (options.required && (value === undefined || value === null || value === '')) {
          return res.status(400).json({ 
            message: `Missing required field: ${field}`,
            field: field,
            code: 'MISSING_FIELD'
          });
        }
        
        // If not required and empty, skip validation
        if (!options.required && (value === undefined || value === null || value === '')) {
          return next();
        }
        
        // Convert to number
        const numValue = Number(value);
        
        if (isNaN(numValue)) {
          return res.status(400).json({ 
            message: `${field} must be a valid number`,
            field: field,
            code: 'INVALID_NUMBER'
          });
        }
        
        // Check min value
        if (options.min !== undefined && numValue < options.min) {
          return res.status(400).json({ 
            message: `${field} must be at least ${options.min}`,
            field: field,
            code: 'NUMBER_TOO_SMALL'
          });
        }
        
        // Check max value
        if (options.max !== undefined && numValue > options.max) {
          return res.status(400).json({ 
            message: `${field} must be no more than ${options.max}`,
            field: field,
            code: 'NUMBER_TOO_LARGE'
          });
        }
        
        // Check for integer
        if (options.integer && !Number.isInteger(numValue)) {
          return res.status(400).json({ 
            message: `${field} must be an integer`,
            field: field,
            code: 'NOT_INTEGER'
          });
        }
        
        // Update the request with validated value
        if (req.body[field] !== undefined) {
          req.body[field] = numValue;
        } else if (req.query[field] !== undefined) {
          req.query[field] = numValue;
        } else if (req.params[field] !== undefined) {
          req.params[field] = numValue;
        }
        
        next();
      } catch (error) {
        console.error(`Number validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'Number validation error occurred',
          code: 'NUMBER_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate URL (modified to use custom function)
  static validateUrl(field, options = {}) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        if (!value) {
          if (options.required) {
            return res.status(400).json({ 
              message: `Missing required field: ${field}`,
              field: field,
              code: 'MISSING_FIELD'
            });
          } else {
            return next();
          }
        }
        
        value = String(value).trim();
        
        // Check if URL is valid using our custom function
        if (!isValidURL(value, { protocols: ['http','https'], require_protocol: true })) {
          return res.status(400).json({ 
            message: 'Invalid URL format',
            field: field,
            code: 'INVALID_URL'
          });
        }
        
        // Check for prohibited domains
        const prohibitedDomains = ['localhost', '127.0.0.1'];
        const urlObj = new URL(value);
        if (prohibitedDomains.includes(urlObj.hostname)) {
          return res.status(400).json({ 
            message: 'URL points to a prohibited domain',
            field: field,
            code: 'PROHIBITED_DOMAIN'
          });
        }
        
        // Update the request with validated value
        if (req.body[field] !== undefined) {
          req.body[field] = value;
        } else if (req.query[field] !== undefined) {
          req.query[field] = value;
        } else if (req.params[field] !== undefined) {
          req.params[field] = value;
        }
        
        next();
      } catch (error) {
        console.error(`URL validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'URL validation error occurred',
          code: 'URL_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate array
  static validateArray(field, options = {}) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        // If required and missing
        if (options.required && (value === undefined || value === null)) {
          return res.status(400).json({ 
            message: `Missing required field: ${field}`,
            field: field,
            code: 'MISSING_FIELD'
          });
        }
        
        // If not required and empty, skip validation
        if (!options.required && (value === undefined || value === null)) {
          return next();
        }
        
        // Convert to array if it's a string
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // If it's not JSON, treat as comma-separated
            value = value.split(',').map(item => item.trim());
          }
        }
        
        // Ensure it's an array
        if (!Array.isArray(value)) {
          return res.status(400).json({ 
            message: `${field} must be an array`,
            field: field,
            code: 'NOT_ARRAY'
          });
        }
        
        // Check minimum length
        if (options.minLength && value.length < options.minLength) {
          return res.status(400).json({ 
            message: `${field} must contain at least ${options.minLength} items`,
            field: field,
            code: 'ARRAY_TOO_SHORT'
          });
        }
        
        // Check maximum length
        if (options.maxLength && value.length > options.maxLength) {
          return res.status(400).json({ 
            message: `${field} must contain no more than ${options.maxLength} items`,
            field: field,
            code: 'ARRAY_TOO_LONG'
          });
        }
        
        // Validate each item if itemValidator is provided
        if (options.itemValidator) {
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const validationResult = options.itemValidator(item);
            if (validationResult !== true) {
              return res.status(400).json({ 
                message: `Invalid item at position ${i}: ${validationResult}`,
                field: field,
                code: 'INVALID_ARRAY_ITEM',
                index: i
              });
            }
          }
        }
        
        // Update the request with validated value
        if (req.body[field] !== undefined) {
          req.body[field] = value;
        } else if (req.query[field] !== undefined) {
          req.query[field] = value;
        } else if (req.params[field] !== undefined) {
          req.params[field] = value;
        }
        
        next();
      } catch (error) {
        console.error(`Array validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'Array validation error occurred',
          code: 'ARRAY_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate boolean
  static validateBoolean(field) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        // If not provided, skip
        if (value === undefined || value === null) {
          return next();
        }
        
        // Convert to boolean
        if (typeof value === 'string') {
          if (value.toLowerCase() === 'true') {
            value = true;
          } else if (value.toLowerCase() === 'false') {
            value = false;
          } else {
            return res.status(400).json({ 
              message: `${field} must be a boolean value (true/false)`,
              field: field,
              code: 'INVALID_BOOLEAN'
            });
          }
        } else if (typeof value === 'number') {
          value = value === 1;
        } else if (typeof value !== 'boolean') {
          return res.status(400).json({ 
            message: `${field} must be a boolean value`,
            field: field,
            code: 'INVALID_BOOLEAN'
          });
        }
        
        // Update the request with validated value
        if (req.body[field] !== undefined) {
          req.body[field] = value;
        } else if (req.query[field] !== undefined) {
          req.query[field] = value;
        } else if (req.params[field] !== undefined) {
          req.params[field] = value;
        }
        
        next();
      } catch (error) {
        console.error(`Boolean validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'Boolean validation error occurred',
          code: 'BOOLEAN_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate date
  static validateDate(field, options = {}) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        // If required and missing
        if (options.required && (value === undefined || value === null || value === '')) {
          return res.status(400).json({ 
            message: `Missing required field: ${field}`,
            field: field,
            code: 'MISSING_FIELD'
          });
        }
        
        // If not required and empty, skip validation
        if (!options.required && (value === undefined || value === null || value === '')) {
          return next();
        }
        
        // Parse date
        const dateValue = new Date(value);
        
        if (isNaN(dateValue.getTime())) {
          return res.status(400).json({ 
            message: `${field} must be a valid date`,
            field: field,
            code: 'INVALID_DATE'
          });
        }
        
        // Check if date is in the future
        if (options.futureOnly && dateValue < new Date()) {
          return res.status(400).json({ 
            message: `${field} must be a future date`,
            field: field,
            code: 'DATE_NOT_FUTURE'
          });
        }
        
        // Check if date is in the past
        if (options.pastOnly && dateValue > new Date()) {
          return res.status(400).json({ 
            message: `${field} must be a past date`,
            field: field,
            code: 'DATE_NOT_PAST'
          });
        }
        
        // Update the request with validated value
        if (req.body[field] !== undefined) {
          req.body[field] = dateValue.toISOString();
        } else if (req.query[field] !== undefined) {
          req.query[field] = dateValue.toISOString();
        } else if (req.params[field] !== undefined) {
          req.params[field] = dateValue.toISOString();
        }
        
        next();
      } catch (error) {
        console.error(`Date validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'Date validation error occurred',
          code: 'DATE_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate enum
  static validateEnum(field, enumValues, options = {}) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        // If required and missing
        if (options.required && (value === undefined || value === null || value === '')) {
          return res.status(400).json({ 
            message: `Missing required field: ${field}`,
            field: field,
            code: 'MISSING_FIELD'
          });
        }
        
        // If not required and empty, skip validation
        if (!options.required && (value === undefined || value === null || value === '')) {
          return next();
        }
        
        // Convert to string
        value = String(value);
        
        // Check if value is in enum
        if (!enumValues.includes(value)) {
          return res.status(400).json({ 
            message: `${field} must be one of: ${enumValues.join(', ')}`,
            field: field,
            code: 'INVALID_ENUM_VALUE',
            allowedValues: enumValues
          });
        }
        
        // Update the request with validated value
        if (req.body[field] !== undefined) {
          req.body[field] = value;
        } else if (req.query[field] !== undefined) {
          req.query[field] = value;
        } else if (req.params[field] !== undefined) {
          req.params[field] = value;
        }
        
        next();
      } catch (error) {
        console.error(`Enum validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'Enum validation error occurred',
          code: 'ENUM_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Validate JSON
  static validateJson(field, options = {}) {
    return (req, res, next) => {
      try {
        let value = req.body[field] || req.query[field] || req.params[field];
        
        // If required and missing
        if (options.required && (value === undefined || value === null || value === '')) {
          return res.status(400).json({ 
            message: `Missing required field: ${field}`,
            field: field,
            code: 'MISSING_FIELD'
          });
        }
        
        // If not required and empty, skip validation
        if (!options.required && (value === undefined || value === null || value === '')) {
          return next();
        }
        
        // Parse JSON
        let jsonValue;
        if (typeof value === 'string') {
          try {
            jsonValue = JSON.parse(value);
          } catch (e) {
            return res.status(400).json({ 
              message: `${field} must be valid JSON`,
              field: field,
              code: 'INVALID_JSON'
            });
          }
        } else {
          jsonValue = value;
        }
        
        // Check max depth
        if (options.maxDepth) {
          const depth = ValidationMiddleware.getJsonDepth(jsonValue);
          if (depth > options.maxDepth) {
            return res.status(400).json({ 
              message: `${field} JSON exceeds maximum depth of ${options.maxDepth}`,
              field: field,
              code: 'JSON_DEPTH_EXCEEDED'
            });
          }
        }
        
        // Update the request with validated value
        if (req.body[field] !== undefined) {
          req.body[field] = jsonValue;
        } else if (req.query[field] !== undefined) {
          req.query[field] = jsonValue;
        } else if (req.params[field] !== undefined) {
          req.params[field] = jsonValue;
        }
        
        next();
      } catch (error) {
        console.error(`JSON validation error for field ${field}:`, error);
        return res.status(500).json({ 
          message: 'JSON validation error occurred',
          code: 'JSON_VALIDATION_ERROR',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }
  
  // Helper function to get JSON depth
  static getJsonDepth(obj) {
    if (obj === null || typeof obj !== 'object') {
      return 0;
    }
    
    if (Array.isArray(obj)) {
      return 1 + Math.max(...obj.map(item => ValidationMiddleware.getJsonDepth(item)), 0);
    }
    
    return 1 + Math.max(...Object.values(obj).map(value => ValidationMiddleware.getJsonDepth(value)), 0);
  }
  
  // Combined validation for login
  static validateLogin() {
    return [
      ValidationMiddleware.validateString('usernameOrEmail', { required: true, minLength: 1, maxLength: 100, noSqlInjection: true, noXss: true }),
      ValidationMiddleware.validateString('password', { required: true, minLength: 1, maxLength: 100, noSqlInjection: true })
    ];
  }
  
  // Combined validation for user updates
  static validateUserUpdate() {
    return [
      ValidationMiddleware.validateString('display_name', { required: false, minLength: 1, maxLength: 100, noSqlInjection: true, noXss: true }),
      ValidationMiddleware.validateEmail('email'),
      ValidationMiddleware.validateBoolean('active'),
      ValidationMiddleware.validateBoolean('is_admin')
    ];
  }
  
  // Combined validation for content
  static validateContent() {
    return [
      ValidationMiddleware.validateString('title', { required: true, minLength: 1, maxLength: 200, noSqlInjection: true, noXss: true }),
      ValidationMiddleware.validateString('content', { required: true, minLength: 1, maxLength: 10000, noSqlInjection: true, noXss: true }),
      ValidationMiddleware.validateEnum('status', ['draft', 'pending', 'published', 'rejected'], { required: true }),
      ValidationMiddleware.validateArray('tags', { required: false, maxLength: 10 })
    ];
  }
  
  // Combined validation for backup operations
  static validateBackup() {
    return [
      ValidationMiddleware.validateString('name', { required: false, minLength: 1, maxLength: 100, alphanumericOnly: true }),
      ValidationMiddleware.validateBoolean('includeLogs')
    ];
  }
}

module.exports = ValidationMiddleware;