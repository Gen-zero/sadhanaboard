import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bug, 
  Wifi, 
  WifiOff, 
  Shield, 
  Clock,
  Server,
  Eye,
  EyeOff
} from 'lucide-react';
import ErrorBoundary, { withErrorBoundary } from './ErrorBoundary';
import ErrorMessage, { 
  NetworkError, 
  AuthenticationError, 
  ValidationError, 
  ServerError, 
  NotFoundError, 
  MaintenanceError,
  ErrorDetails 
} from './ErrorMessage';
import { useRetry, RetryButton } from '../../hooks/useRetry';

// Component that throws errors for testing
const ErrorThrowingComponent: React.FC<{ errorType: string }> = ({ errorType }) => {
  useEffect(() => {
    if (errorType === 'render') {
      throw new Error('Simulated render error');
    }
  }, [errorType]);

  if (errorType === 'immediate') {
    throw new Error('Immediate component error');
  }

  return <div>Component working fine!</div>;
};

// Wrapped component for error boundary testing
const WrappedErrorComponent = withErrorBoundary(ErrorThrowingComponent, {
  context: 'demo-component',
  retryable: true
});

const ErrorDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<string>('overview');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [networkSimulation, setNetworkSimulation] = useState<'online' | 'offline'>('online');
  const [errorComponentKey, setErrorComponentKey] = useState(0);
  
  const {
    executeWithRetry,
    isRetrying,
    attempt,
    remainingAttempts,
    reset: resetRetry
  } = useRetry({
    maxAttempts: 3,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message);
    },
    onMaxAttemptsReached: (error) => {
      console.log('Max attempts reached:', error.message);
    }
  });

  // Simulate API calls for retry testing
  const simulateNetworkRequest = async (shouldFail: boolean = false): Promise<string> => {
    if (networkSimulation === 'offline') {
      throw new Error('Network error: offline');
    }
    
    if (shouldFail) {
      throw new Error('Server error: Internal server error');
    }
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Success!';
  };

  const handleRetryDemo = async () => {
    try {
      const result = await executeWithRetry(() => simulateNetworkRequest(Math.random() > 0.6));
      console.log('Request succeeded:', result);
    } catch (error) {
      console.error('Request failed after retries:', error);
    }
  };

  const resetErrorComponent = () => {
    setErrorComponentKey(prev => prev + 1);
  };

  const sampleErrors: Record<string, ErrorDetails> = {
    network: {
      message: "Network Connection Failed",
      description: "Unable to reach the server. Please check your internet connection.",
      severity: "error",
      type: "network",
      retryable: true,
      suggestions: [
        "Check your internet connection",
        "Try refreshing the page",
        "Check if you're behind a firewall"
      ],
      helpUrl: "/help/network-issues",
      technicalDetails: "Error: ENOTFOUND api.sadhanaboard.com\nHost: api.sadhanaboard.com:443\nTimestamp: 2024-01-15T10:30:00Z",
      context: {
        endpoint: "/api/sadhanas",
        method: "GET",
        userAgent: navigator.userAgent
      }
    },
    validation: {
      message: "Form Validation Failed",
      description: "Please correct the errors below and try again.",
      severity: "warning",
      type: "validation",
      retryable: false,
      suggestions: [
        "Check required fields are filled",
        "Verify email format is correct",
        "Ensure password meets requirements"
      ],
      context: {
        fields: ["email", "password"],
        validationRules: ["required", "email", "minLength"]
      }
    },
    server: {
      message: "Internal Server Error",
      description: "Something went wrong on our end. Our team has been notified.",
      severity: "error",
      type: "server",
      retryable: true,
      code: "500",
      suggestions: [
        "Try again in a few moments",
        "Refresh the page",
        "Contact support if issue persists"
      ],
      helpUrl: "/help/server-errors",
      technicalDetails: "Error ID: ERR_500_15012024_103045\nStack: TypeError: Cannot read property 'id' of undefined\n  at SadhanaController.getSadhana (/app/controllers/sadhana.js:45:12)",
      context: {
        errorId: "ERR_500_15012024_103045",
        service: "sadhana-service",
        version: "1.2.3"
      }
    },
    authentication: {
      message: "Authentication Required",
      description: "Your session has expired. Please log in again.",
      severity: "warning",
      type: "authentication",
      retryable: false,
      code: "401",
      suggestions: [
        "Click the login button to sign in",
        "Check your credentials",
        "Clear browser cache if issues persist"
      ],
      context: {
        sessionExpired: true,
        lastActivity: "2024-01-15T09:30:00Z"
      }
    },
    notFound: {
      message: "Resource Not Found",
      description: "The sadhana you're looking for doesn't exist or has been removed.",
      severity: "warning",
      type: "not-found",
      retryable: false,
      code: "404",
      suggestions: [
        "Check the URL for typos",
        "Go back to the dashboard",
        "Search for the sadhana in the library"
      ],
      context: {
        requestedResource: "/sadhanas/nonexistent-id",
        resourceType: "sadhana"
      }
    },
    maintenance: {
      message: "Scheduled Maintenance",
      description: "We're performing scheduled maintenance. Service will resume shortly.",
      severity: "info",
      type: "maintenance",
      retryable: false,
      suggestions: [
        "Try again in 15-30 minutes",
        "Check our status page for updates",
        "Follow @SadhanaBoard for announcements"
      ],
      helpUrl: "/status",
      context: {
        maintenanceWindow: "2024-01-15T10:00:00Z - 11:00:00Z",
        estimatedDuration: "60 minutes"
      }
    }
  };

  const demos = {
    overview: (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Handling System Demo
          </h2>
          <p className="text-gray-600">
            Comprehensive error handling with user-friendly messages, retry mechanisms, and contextual help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries({
            errorBoundary: null,
            errorMessages: null,
            retryMechanisms: null,
            errorTypes: null,
            interactiveTests: null
          }).map(([key]) => (
            <button
              key={key}
              onClick={() => setCurrentDemo(key)}
              className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <h3 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {key === 'errorBoundary' && 'React error boundary demonstrations'}
                {key === 'errorMessages' && 'User-friendly error message components'}
                {key === 'retryMechanisms' && 'Automatic retry logic and controls'}
                {key === 'errorTypes' && 'Different error types and their handling'}
                {key === 'interactiveTests' && 'Live error simulation and testing'}
              </p>
            </button>
          ))}
        </div>
      </div>
    ),

    errorBoundary: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Error Boundary Demo</h2>
          <button
            onClick={() => setCurrentDemo('overview')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Overview
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Trigger Component Errors</h3>
            
            <button
              onClick={resetErrorComponent}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Component
            </button>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Test different error scenarios:</p>
              
              <ErrorBoundary
                key={errorComponentKey}
                context="demo-error-boundary"
                retryable={true}
                showErrorDetails={showTechnicalDetails}
              >
                <div className="p-4 border rounded bg-gray-50">
                  <WrappedErrorComponent errorType="none" />
                </div>
              </ErrorBoundary>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Error Boundary Features</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Automatic error catching and recovery</li>
              <li>User-friendly fallback UI</li>
              <li>Retry mechanisms with attempt limits</li>
              <li>Error reporting and bug submission</li>
              <li>Contextual error information</li>
              <li>Technical details for debugging</li>
            </ul>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showTechnical"
                checked={showTechnicalDetails}
                onChange={(e) => setShowTechnicalDetails(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showTechnical" className="text-sm">
                Show technical details
              </label>
            </div>
          </div>
        </div>
      </div>
    ),

    errorMessages: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Error Message Components</h2>
          <button
            onClick={() => setCurrentDemo('overview')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Overview
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(sampleErrors).map(([key, error]) => (
            <div key={key} className="space-y-2">
              <h3 className="font-semibold capitalize">{key} Error</h3>
              <ErrorMessage
                error={error}
                showTechnicalDetails={showTechnicalDetails}
                onRetry={() => console.log(`Retrying ${key} operation`)}
                onDismiss={() => console.log(`Dismissed ${key} error`)}
              />
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Specialized Error Components</h3>
          <div className="space-y-4">
            <NetworkError onRetry={() => console.log('Network retry')} />
            <AuthenticationError />
            <ValidationError fields={['email', 'password']} />
            <ServerError onRetry={() => console.log('Server retry')} />
            <NotFoundError resource="sadhana" />
            <MaintenanceError />
          </div>
        </div>
      </div>
    ),

    retryMechanisms: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Retry Mechanisms Demo</h2>
          <button
            onClick={() => setCurrentDemo('overview')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Overview
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Network Simulation</h3>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNetworkSimulation('online')}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  networkSimulation === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}
              >
                <Wifi className="h-4 w-4" />
                Online
              </button>
              <button
                onClick={() => setNetworkSimulation('offline')}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  networkSimulation === 'offline' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                }`}
              >
                <WifiOff className="h-4 w-4" />
                Offline
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRetryDemo}
                disabled={isRetrying}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isRetrying ? 'Testing...' : 'Test Retry Logic'}
              </button>

              <RetryButton
                onRetry={handleRetryDemo}
                isRetrying={isRetrying}
                attemptCount={attempt}
                maxAttempts={3}
              />

              <button
                onClick={resetRetry}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Reset Retry State
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Retry Status</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Current Attempt:</strong> {attempt}</p>
              <p><strong>Remaining Attempts:</strong> {remainingAttempts}</p>
              <p><strong>Is Retrying:</strong> {isRetrying ? 'Yes' : 'No'}</p>
              <p><strong>Network Status:</strong> {networkSimulation}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Retry Features:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Exponential backoff delays</li>
                <li>Maximum attempt limits</li>
                <li>Error type-based retry logic</li>
                <li>Circuit breaker pattern</li>
                <li>Progress tracking</li>
                <li>Manual retry triggers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),

    errorTypes: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Error Types & Handling</h2>
          <button
            onClick={() => setCurrentDemo('overview')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Overview
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { type: 'network', icon: Wifi, color: 'red', description: 'Connection failures, timeouts' },
            { type: 'server', icon: Server, color: 'red', description: '500 errors, internal failures' },
            { type: 'authentication', icon: Shield, color: 'yellow', description: '401 errors, expired sessions' },
            { type: 'authorization', icon: Shield, color: 'yellow', description: '403 errors, permission denied' },
            { type: 'validation', icon: AlertTriangle, color: 'yellow', description: 'Form validation, input errors' },
            { type: 'not-found', icon: Eye, color: 'yellow', description: '404 errors, missing resources' },
            { type: 'rate-limit', icon: Clock, color: 'yellow', description: '429 errors, too many requests' },
            { type: 'maintenance', icon: RefreshCw, color: 'blue', description: 'Scheduled downtime' },
            { type: 'client', icon: Bug, color: 'red', description: 'Client-side errors, bugs' }
          ].map(({ type, icon: Icon, color, description }) => (
            <div key={type} className={`p-4 rounded-lg border-l-4 border-${color}-500 bg-${color}-50`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 text-${color}-600`} />
                <h3 className="font-semibold capitalize">{type}</h3>
              </div>
              <p className="text-sm text-gray-700">{description}</p>
              <div className="mt-2 text-xs text-gray-600">
                Retryable: {['network', 'server', 'timeout'].includes(type) ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    interactiveTests: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Interactive Error Tests</h2>
          <button
            onClick={() => setCurrentDemo('overview')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Overview
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Error Simulation</h3>
            
            <div className="space-y-2">
              {Object.keys(sampleErrors).map(errorType => (
                <button
                  key={errorType}
                  onClick={() => {
                    console.error(`Simulated ${errorType} error:`, sampleErrors[errorType]);
                    // Here you could trigger actual error states in your app
                  }}
                  className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded capitalize"
                >
                  Trigger {errorType} Error
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Test Controls</h3>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showTechnicalDetails}
                  onChange={(e) => setShowTechnicalDetails(e.target.checked)}
                />
                <span className="text-sm">Show technical details</span>
              </label>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showTechnicalDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showTechnicalDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">Testing Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Real-time error simulation</li>
                <li>Interactive retry testing</li>
                <li>Error boundary demonstrations</li>
                <li>Network condition simulation</li>
                <li>Error reporting validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto">
          {Object.keys(demos).map(demo => (
            <button
              key={demo}
              onClick={() => setCurrentDemo(demo)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                currentDemo === demo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {demo === 'overview' ? 'Overview' : demo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {demos[currentDemo]}
      </div>
    </div>
  );
};

export default ErrorDemo;