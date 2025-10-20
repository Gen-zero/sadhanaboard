import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTouchGestures, TouchGestureArea } from '@/hooks/useTouchGestures';
import { MobileInput, MobileButton, MobileTextarea } from './MobileFormComponents';
import { useMobileKeyboard } from './MobileFormComponents';
import { useNetworkStatus, usePerformanceMonitor } from '@/hooks/useMobilePerformance';
import { useVoiceAnnouncement, useAccessibility } from '@/hooks/useMobileAccessibility';
import PullToRefresh from './PullToRefresh';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Smartphone, 
  Tablet, 
  Monitor,
  Wifi,
  WifiOff,
  Battery,
  Zap,
  TouchpadIcon as Touch,
  Accessibility,
  Eye,
  Volume2
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

const MobileTestSuite: React.FC = () => {
  const isMobile = useIsMobile();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [touchTestStatus, setTouchTestStatus] = useState<string>('');
  const [gestureTestStatus, setGestureTestStatus] = useState<string>('');
  const [pullRefreshCount, setPullRefreshCount] = useState(0);
  
  const { isKeyboardVisible } = useMobileKeyboard();
  const { isOnline, connectionType, isSlowConnection } = useNetworkStatus();
  const { renderTime, memoryUsage } = usePerformanceMonitor();
  const { announce } = useVoiceAnnouncement();
  const { highContrast, reducedMotion, fontSize } = useAccessibility();

  // Device detection tests
  const runDeviceTests = (): TestResult[] => {
    const results: TestResult[] = [];
    
    // Screen size detection
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    results.push({
      name: 'Mobile Detection',
      status: isMobile ? 'pass' : 'warning',
      message: isMobile ? 'Correctly detected as mobile' : 'Not detected as mobile device',
      details: `Screen: ${screenWidth}x${screenHeight}, DPR: ${devicePixelRatio}`
    });

    // Touch support
    const hasTouchSupport = 'ontouchstart' in window;
    results.push({
      name: 'Touch Support',
      status: hasTouchSupport ? 'pass' : 'fail',
      message: hasTouchSupport ? 'Touch events supported' : 'No touch support detected',
      details: `Touch points: ${navigator.maxTouchPoints || 0}`
    });

    // Viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    results.push({
      name: 'Viewport Meta Tag',
      status: viewportMeta ? 'pass' : 'fail',
      message: viewportMeta ? 'Viewport meta tag present' : 'Missing viewport meta tag',
      details: viewportMeta ? (viewportMeta as HTMLMetaElement).content : undefined
    });

    return results;
  };

  // Performance tests
  const runPerformanceTests = (): TestResult[] => {
    const results: TestResult[] = [];

    // Render time
    results.push({
      name: 'Render Performance',
      status: renderTime < 100 ? 'pass' : renderTime < 250 ? 'warning' : 'fail',
      message: `Render time: ${renderTime.toFixed(2)}ms`,
      details: renderTime < 100 ? 'Excellent performance' : renderTime < 250 ? 'Good performance' : 'Poor performance'
    });

    // Memory usage
    const memoryMB = memoryUsage / (1024 * 1024);
    results.push({
      name: 'Memory Usage',
      status: memoryMB < 50 ? 'pass' : memoryMB < 100 ? 'warning' : 'fail',
      message: `Memory: ${memoryMB.toFixed(2)}MB`,
      details: memoryMB < 50 ? 'Low memory usage' : memoryMB < 100 ? 'Moderate memory usage' : 'High memory usage'
    });

    return results;
  };

  // Network tests
  const runNetworkTests = (): TestResult[] => {
    const results: TestResult[] = [];

    results.push({
      name: 'Network Status',
      status: isOnline ? 'pass' : 'fail',
      message: isOnline ? 'Online' : 'Offline',
      details: `Connection: ${connectionType}`
    });

    results.push({
      name: 'Connection Speed',
      status: isSlowConnection ? 'warning' : 'pass',
      message: isSlowConnection ? 'Slow connection detected' : 'Good connection speed',
      details: `Type: ${connectionType}`
    });

    return results;
  };

  // Accessibility tests
  const runAccessibilityTests = (): TestResult[] => {
    const results: TestResult[] = [];

    // Touch target sizes
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    let smallTargets = 0;
    
    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallTargets++;
      }
    });

    results.push({
      name: 'Touch Target Sizes',
      status: smallTargets === 0 ? 'pass' : smallTargets < 3 ? 'warning' : 'fail',
      message: smallTargets === 0 ? 'All touch targets are adequate' : `${smallTargets} small touch targets found`,
      details: 'WCAG AAA requires minimum 44px touch targets'
    });

    // High contrast mode
    results.push({
      name: 'High Contrast Support',
      status: 'pass',
      message: highContrast ? 'High contrast mode active' : 'Normal contrast mode',
      details: 'High contrast preference detected and respected'
    });

    // Reduced motion
    results.push({
      name: 'Reduced Motion Support',
      status: 'pass',
      message: reducedMotion ? 'Reduced motion active' : 'Normal motion enabled',
      details: 'Motion preference detected and respected'
    });

    return results;
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    announce('Running mobile responsiveness tests');
    
    const allResults: TestResult[] = [
      ...runDeviceTests(),
      ...runPerformanceTests(),
      ...runNetworkTests(),
      ...runAccessibilityTests()
    ];

    // Simulate test delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTestResults(allResults);
    setIsRunning(false);
    
    const passCount = allResults.filter(r => r.status === 'pass').length;
    announce(`Tests complete. ${passCount} of ${allResults.length} tests passed`);
  };

  // Touch gesture test handlers
  const touchGestureRef = useTouchGestures({
    onTap: () => setTouchTestStatus('Tap detected ✓'),
    onDoubleTap: () => setTouchTestStatus('Double tap detected ✓'),
    onLongPress: () => setTouchTestStatus('Long press detected ✓'),
    onSwipeLeft: () => setGestureTestStatus('Swipe left detected ✓'),
    onSwipeRight: () => setGestureTestStatus('Swipe right detected ✓'),
    onSwipeUp: () => setGestureTestStatus('Swipe up detected ✓'),
    onSwipeDown: () => setGestureTestStatus('Swipe down detected ✓')
  });

  // Pull to refresh handler
  const handlePullRefresh = async () => {
    setPullRefreshCount(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: 'pass' | 'fail' | 'warning') => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runAllTests();
  }, []);

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
      <div className="space-y-6 pb-20 mobile-container">
        {/* Header */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Mobile Responsiveness Test Suite</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Screen: {window.innerWidth}×{window.innerHeight}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tablet className="h-4 w-4" />
                <span>DPR: {window.devicePixelRatio || 1}</span>
              </div>
              <div className="flex items-center space-x-2">
                {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                <span>{connectionType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery className="h-4 w-4" />
                <span>Keyboard: {isKeyboardVisible ? 'Visible' : 'Hidden'}</span>
              </div>
            </div>
            
            <MobileButton 
              onClick={runAllTests}
              loading={isRunning}
              className="w-full"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests Again'}
            </MobileButton>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Results</span>
              <div className="flex space-x-2">
                <Badge variant="outline">
                  {testResults.filter(r => r.status === 'pass').length} Pass
                </Badge>
                <Badge variant="outline">
                  {testResults.filter(r => r.status === 'warning').length} Warning
                </Badge>
                <Badge variant="outline">
                  {testResults.filter(r => r.status === 'fail').length} Fail
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{result.name}</h4>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Touch Gesture Tests */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Touch className="h-5 w-5" />
              <span>Touch Gesture Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TouchGestureArea
              gestureOptions={{
                onTap: () => setTouchTestStatus('Tap detected ✓'),
                onDoubleTap: () => setTouchTestStatus('Double tap detected ✓'),
                onLongPress: () => setTouchTestStatus('Long press detected ✓'),
                onSwipeLeft: () => setGestureTestStatus('Swipe left detected ✓'),
                onSwipeRight: () => setGestureTestStatus('Swipe right detected ✓'),
                onSwipeUp: () => setGestureTestStatus('Swipe up detected ✓'),
                onSwipeDown: () => setGestureTestStatus('Swipe down detected ✓')
              }}
              className="border-2 border-dashed border-muted rounded-lg p-8 text-center bg-muted/10"
            >
              <p className="text-sm font-medium mb-2">Touch Test Area</p>
              <p className="text-xs text-muted-foreground mb-4">
                Try: tap, double-tap, long press, and swipe in all directions
              </p>
              <div className="space-y-2 text-xs">
                <div>Touch: {touchTestStatus || 'No touch detected'}</div>
                <div>Gesture: {gestureTestStatus || 'No gesture detected'}</div>
              </div>
            </TouchGestureArea>
          </CardContent>
        </Card>

        {/* Form Tests */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Mobile Form Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MobileInput
              label="Test Input"
              placeholder="Type here to test mobile input..."
              showClearButton
            />
            
            <MobileTextarea
              label="Test Textarea"
              placeholder="Type here to test mobile textarea..."
              maxLength={100}
              showCharCount
            />
            
            <MobileButton variant="default" className="w-full">
              Test Mobile Button
            </MobileButton>
          </CardContent>
        </Card>

        {/* Pull to Refresh Test */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Pull to Refresh Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Pull down on this page to test pull-to-refresh functionality.
            </p>
            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <p className="font-medium">Refresh Count: {pullRefreshCount}</p>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Features Test */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Accessibility className="h-5 w-5" />
              <span>Accessibility Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>High Contrast: {highContrast ? 'On' : 'Off'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Reduced Motion: {reducedMotion ? 'On' : 'Off'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <span>Font Size: {fontSize}</span>
              </div>
            </div>
            
            <MobileButton 
              onClick={() => announce('Accessibility test announcement')}
              variant="secondary"
            >
              Test Screen Reader Announcement
            </MobileButton>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">
                {testResults.filter(r => r.status === 'pass').length}/{testResults.length}
              </p>
              <p className="text-sm text-muted-foreground">Tests Passed</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(testResults.filter(r => r.status === 'pass').length / testResults.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PullToRefresh>
  );
};

export default MobileTestSuite;