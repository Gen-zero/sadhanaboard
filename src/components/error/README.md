# Error Handling System

A comprehensive error handling system that provides user-friendly error messages, retry mechanisms, and contextual help for the Sadhana Board application.

## 🌟 Features

### ✅ Implemented
- **Error Boundaries**: React error boundaries with retry mechanisms
- **User-Friendly Messages**: Clear, actionable error messages with contextual help
- **Retry Logic**: Automatic retry with exponential backoff for failed requests
- **Error Types**: Comprehensive error categorization and handling
- **Standardized Styling**: Consistent error UI with animations and accessibility
- **Interactive Demo**: Complete testing and demonstration interface

## 📁 File Structure

```
src/components/error/
├── ErrorBoundary.tsx     # React error boundary with retry logic
├── ErrorMessage.tsx      # User-friendly error message components
├── ErrorDemo.tsx         # Interactive demo and testing interface
├── index.ts              # Export file
└── README.md            # This file

src/hooks/
└── useRetry.tsx         # Retry mechanisms and API client

src/styles/
└── error.css           # Error handling styles and animations
```

## 🚀 Quick Start

### Basic Error Boundary Usage

```tsx
import { ErrorBoundary } from '@/components/error';

function App() {
  return (
    <ErrorBoundary 
      context="main-app" 
      retryable={true}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Error Message Components

```tsx
import { 
  ErrorMessage, 
  NetworkError, 
  ServerError, 
  ValidationError 
} from '@/components/error';

// Generic error message
<ErrorMessage
  error={{
    message: "Something went wrong",
    description: "Please try again later",
    severity: "error",
    type: "server",
    retryable: true
  }}
  onRetry={() => retryOperation()}
  onDismiss={() => dismissError()}
/>

// Specialized error components
<NetworkError onRetry={() => retryRequest()} />
<ServerError onRetry={() => retryRequest()} />
<ValidationError fields={['email', 'password']} />
```

### Retry Hook Usage

```tsx
import { useRetry } from '@/components/error';

function MyComponent() {
  const { executeWithRetry, isRetrying, attempt, remainingAttempts } = useRetry({
    maxAttempts: 3,
    onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error),
    onMaxAttemptsReached: (error) => console.log('Failed after all retries')
  });

  const handleApiCall = async () => {
    try {
      const result = await executeWithRetry(() => api.fetchData());
      console.log('Success:', result);
    } catch (error) {
      console.error('Failed after retries:', error);
    }
  };

  return (
    <div>
      <button onClick={handleApiCall} disabled={isRetrying}>
        {isRetrying ? `Retrying... (${attempt}/${maxAttempts})` : 'Fetch Data'}
      </button>
      <p>Remaining attempts: {remainingAttempts}</p>
    </div>
  );
}
```

### API Client with Retry

```tsx
import { RetryableApiClient } from '@/components/error';

const apiClient = new RetryableApiClient('/api', {
  maxAttempts: 3,
  baseDelay: 1000,
  retryableErrors: ['network', 'server', 'timeout']
});

// Automatic retry on network/server errors
const data = await apiClient.get('/sadhanas');
const result = await apiClient.post('/sadhanas', { name: 'New Sadhana' });
```

## 🎯 Error Types

| Type | Description | Retryable | Use Case |
|------|-------------|-----------|----------|
| `network` | Connection failures, timeouts | ✅ | API calls, fetch requests |
| `server` | 500 errors, internal failures | ✅ | Backend errors |
| `authentication` | 401 errors, expired sessions | ❌ | Login required |
| `authorization` | 403 errors, permission denied | ❌ | Access denied |
| `validation` | Form validation, input errors | ❌ | User input errors |
| `not-found` | 404 errors, missing resources | ❌ | Missing data |
| `rate-limit` | 429 errors, too many requests | ✅ | API rate limiting |
| `maintenance` | Scheduled downtime | ❌ | System maintenance |
| `client` | Client-side errors, bugs | ❌ | Application bugs |

## 🎨 Error Severity Levels

- **Error** (red): Critical failures requiring immediate attention
- **Warning** (yellow): Issues that need user action but don't break functionality
- **Info** (blue): Informational messages about system state
- **Success** (green): Positive confirmations and successful operations

## 🔄 Retry Configuration

```tsx
interface RetryConfig {
  maxAttempts: number;        // Maximum retry attempts (default: 3)
  baseDelay: number;          // Initial delay in ms (default: 1000)
  maxDelay: number;           // Maximum delay in ms (default: 10000)
  backoffFactor: number;      // Exponential backoff factor (default: 2)
  retryableErrors: ErrorType[]; // Which error types to retry
  onRetry?: (attempt: number, error: Error) => void;
  onMaxAttemptsReached?: (error: Error) => void;
}
```

## 🎭 Error Demo

Access the interactive error demo at `/error-demo` to test all error handling features:

- Error boundary demonstrations
- Error message component examples
- Retry mechanism testing
- Error type simulations
- Interactive error scenarios

## 🛠️ Advanced Features

### Circuit Breaker Pattern

```tsx
import { CircuitBreaker } from '@/components/error';

const circuitBreaker = new CircuitBreaker(5, 60000); // 5 failures, 60s timeout

try {
  const result = await circuitBreaker.execute(() => apiCall());
} catch (error) {
  console.log('Circuit breaker is open:', circuitBreaker.getState());
}
```

### Higher-Order Component

```tsx
import { withErrorBoundary } from '@/components/error';

const SafeComponent = withErrorBoundary(MyComponent, {
  context: 'my-component',
  retryable: true
});
```

### Error Reporting

```tsx
import { useErrorReporting } from '@/components/error';

function MyComponent() {
  const { reportError } = useErrorReporting();

  const handleManualReport = () => {
    try {
      // Some operation
    } catch (error) {
      reportError(error, 'manual-operation');
    }
  };
}
```

## 🎨 Styling and Animations

The error system includes comprehensive CSS animations and styling:

- **Fade-in animations** for error messages
- **Shake animations** for form field errors
- **Pulse animations** for retry buttons
- **Slide transitions** for error toasts
- **Dark mode support**
- **High contrast mode support**
- **Reduced motion accessibility**

## ♿ Accessibility Features

- **WCAG AAA compliance**
- **Screen reader support** with proper ARIA labels
- **Keyboard navigation** for all interactive elements
- **Focus management** for error states
- **Reduced motion** support for users with vestibular disorders
- **High contrast** mode support
- **Clear error descriptions** and contextual help

## 🧪 Testing

### Manual Testing
1. Visit `/error-demo` to test all error scenarios
2. Use network simulation to test retry logic
3. Trigger component errors to test error boundaries
4. Test keyboard navigation and screen reader compatibility

### Automated Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '@/components/error';

test('displays error message with retry button', () => {
  const onRetry = jest.fn();
  render(
    <ErrorMessage
      error={{
        message: "Test error",
        severity: "error",
        type: "network",
        retryable: true
      }}
      onRetry={onRetry}
    />
  );

  expect(screen.getByText('Test error')).toBeInTheDocument();
  
  const retryButton = screen.getByRole('button', { name: /retry/i });
  fireEvent.click(retryButton);
  
  expect(onRetry).toHaveBeenCalled();
});
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Shows technical details in development mode
- `REACT_APP_ERROR_REPORTING_URL`: Error reporting service endpoint

### Global Configuration
```tsx
import { DEFAULT_RETRY_CONFIG } from '@/components/error';

// Override default retry configuration
const customRetryConfig = {
  ...DEFAULT_RETRY_CONFIG,
  maxAttempts: 5,
  baseDelay: 2000
};
```

## 📊 Error Analytics

The system automatically logs errors for analytics:

```tsx
{
  message: "Error message",
  stack: "Error stack trace",
  context: "Component context",
  timestamp: "2024-01-15T10:30:00Z",
  userAgent: "Browser info",
  url: "Current page URL"
}
```

## 🔄 Integration with Existing Code

The error handling system is designed to integrate seamlessly:

1. **Wrap main app** in ErrorBoundary
2. **Replace console.error** with ErrorMessage components
3. **Use useRetry** for API calls
4. **Apply error styles** to existing components

## 🚨 Emergency Recovery

In case of critical errors:

1. **Error boundaries** prevent complete app crashes
2. **Retry mechanisms** attempt automatic recovery
3. **Fallback UI** provides alternative content
4. **Manual recovery** options for users
5. **Bug reporting** for developers

## 📱 Mobile Support

- Touch-friendly error interfaces
- Responsive error message layouts
- Mobile-optimized retry buttons
- Gesture support for error dismissal
- Safe area support for iOS devices

## 🌐 Internationalization

Ready for i18n integration:

```tsx
<ErrorMessage
  error={{
    message: t('errors.network.title'),
    description: t('errors.network.description'),
    // ... other properties
  }}
/>
```

## 🔮 Future Enhancements

- Integration with error monitoring services (Sentry, LogRocket)
- Machine learning for error prediction
- User behavior analytics for error patterns
- Voice assistance for error recovery
- Automated error resolution suggestions

---

## 📞 Support

For questions or issues with the error handling system:

1. Check the interactive demo at `/error-demo`
2. Review error logs in browser console
3. Consult this documentation
4. Report bugs through the error reporting system

---

*Built with ❤️ for the Sadhana Board spiritual practice platform*