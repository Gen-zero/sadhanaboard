# Demo Login Feature - Testing Guide

## Quick Test (2 minutes)

### Test 1: Try Demo Button
1. Navigate to `http://localhost:5173/login` (or your dev server URL)
2. Locate the "Try Demo" button (has a ⚡ Zap icon)
3. Click the "Try Demo" button
4. **Expected**: Should be redirected to `/dashboard` immediately

### Test 2: Manual Demo Credentials
1. Go back to login page
2. Enter these credentials:
   - Email: `demo@sadhanaboard.com`
   - Password: `demo123456`
3. Click "Login"
4. **Expected**: Should login successfully without backend

### Test 3: Demo Banner
1. After logging in, check the top of the page
2. **Expected**: Should see amber-colored banner saying "Demo Mode Active"
3. Click X button to dismiss
4. **Expected**: Banner should disappear

## Comprehensive Test Suite

### Authentication Tests

#### Test A: Demo Login Flow
```javascript
Steps:
1. Open login page
2. Click "Try Demo"
3. Wait for redirect
4. Check URL changed to /dashboard
5. Check localStorage for token

Expected Results:
✅ Redirect to /dashboard
✅ Token stored in localStorage
✅ Token contains "mode":"demo" in payload
```

#### Test B: Credentials Validation
```javascript
Steps:
1. Try with wrong email: wrong@example.com / demo123456
2. Try with wrong password: demo@sadhanaboard.com / wrong
3. Try with correct demo credentials

Expected Results:
✅ Wrong email: Login fails with error
✅ Wrong password: Login fails with error
✅ Demo credentials: Login succeeds
```

#### Test C: Token Inspection
```javascript
In Browser Console:
1. After demo login, run:
   const token = localStorage.getItem('token');
   const parts = token.split('.');
   console.log(JSON.parse(atob(parts[1])));

Expected Results:
✅ Should show payload with:
   - mode: "demo"
   - sub: "demo-user-001"
   - email: "demo@sadhanaboard.com"
   - display_name: "Demo User"
```

### UI/UX Tests

#### Test D: Login Page Display
```
Visual Checks:
1. "Try Demo" button is visible
2. Divider text reads "Or try demo"
3. Demo credentials box is visible with:
   - Email: demo@sadhanaboard.com
   - Password: demo123456
4. Text: "Backend connection not required for demo mode"

Expected Results:
✅ All elements visible
✅ Proper styling/colors
✅ Responsive on mobile
```

#### Test E: Demo Banner Display
```
Visual Checks:
1. Banner appears at top of page
2. Background color is amber/yellow
3. Shows "Demo Mode Active" text
4. Shows explanation text
5. Has X button to dismiss
6. Banner stays until dismissed or page refresh

Expected Results:
✅ All elements visible
✅ Banner styled correctly
✅ Dismiss button works
✅ Returns when page is refreshed
```

### Navigation Tests

#### Test F: Protected Routes Access
```
Steps:
1. After demo login, visit:
   - /dashboard
   - /settings
   - /profile
   - /sadhana
   - /library
   - /analytics

Expected Results:
✅ All routes load successfully
✅ No redirect to login
✅ Content displays correctly
```

#### Test G: Logout Flow
```
Steps:
1. While logged in as demo user
2. Click logout button (in settings or profile)
3. Should be redirected to login page
4. Try accessing /dashboard
5. Should redirect to login

Expected Results:
✅ Logout works
✅ Token is cleared from localStorage
✅ Protected routes redirect to login
```

#### Test H: Re-login After Logout
```
Steps:
1. Logout from demo session
2. Go to login page
3. Click "Try Demo" again
4. Should login successfully again

Expected Results:
✅ Can login multiple times
✅ Each login creates new token
✅ Session is independent
```

### API Response Tests

#### Test I: Profile API Call
```
Steps:
1. After demo login
2. Open DevTools Network tab
3. Navigate to /profile or /settings
4. Look for API calls

Expected Results:
✅ No /auth/me call (should use cached token)
✅ No /profile call for onboarding check
   (should detect demo mode and skip)
```

#### Test J: Onboarding Status
```
Steps:
1. After demo login
2. Check that dashboard loads (not redirected to onboarding)
3. This means onboarding_completed was set to true

Expected Results:
✅ Dashboard is default page
✅ /onboarding page is accessible but not auto-redirected
```

### Browser/Device Tests

#### Test K: Desktop Browser
```
Browsers to test:
- Chrome/Chromium
- Firefox
- Safari
- Edge

Steps:
1. Test full login flow
2. Check banner display
3. Test responsive layout

Expected Results:
✅ Works in all modern browsers
✅ UI looks correct
✅ No console errors
```

#### Test L: Mobile Browser
```
Devices to test:
- iPhone
- Android
- Tablet

Steps:
1. Open login page
2. Click "Try Demo"
3. Check responsive layout
4. Test banner on small screen

Expected Results:
✅ Button is tappable
✅ Text is readable
✅ Layout adapts to screen
✅ Banner doesn't overflow
```

#### Test M: Responsive Design
```
Breakpoints to test:
- 320px (mobile)
- 640px (small tablet)
- 1024px (tablet)
- 1920px (desktop)

Expected Results:
✅ Elements adjust for each breakpoint
✅ Text is always readable
✅ Buttons are always tappable
```

### Performance Tests

#### Test N: Login Speed
```
Steps:
1. Open DevTools Performance tab
2. Click "Try Demo"
3. Measure time to reach dashboard

Expected Results:
✅ Should be instant (no API call)
✅ < 500ms redirect time
✅ No loading spinner needed
```

#### Test O: Token Parsing Performance
```
In Console:
1. console.time('token-parse');
   const token = localStorage.getItem('token');
   const parts = token.split('.');
   const payload = JSON.parse(atob(parts[1]));
   console.timeEnd('token-parse');

Expected Results:
✅ Should be < 1ms
✅ Very fast operation
```

### Error Handling Tests

#### Test P: Invalid Credentials
```
Steps:
1. Try login with wrong email/password
2. Check error message displays
3. Try demo login - should work

Expected Results:
✅ Clear error message
✅ Form stays on page
✅ Can retry
```

#### Test Q: Token Expiration (if implemented)
```
Steps:
1. Login with demo
2. Wait for token expiration time (24 hours or as set)
3. Try to access protected route

Expected Results:
✅ Either auto-refresh or redirect to login
✅ Graceful handling of expired token
```

### Security Tests

#### Test R: Credential Visibility
```
Steps:
1. Check login page source
2. Credentials should be visible for demo purposes
3. Check browser DevTools

Expected Results:
✅ Credentials are visible
✅ Clear indication it's demo mode
✅ Warning about demo mode in banner
```

#### Test S: Token Security
```
Steps:
1. Inspect demo token in localStorage
2. Token should not contain sensitive data
3. Should have expiration time

Expected Results:
✅ No passwords in token
✅ Contains expiration (exp claim)
✅ Mode marked as 'demo'
```

## Test Automation

### Example Jest/Testing Library Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '@/pages/landing/LoginPage';

describe('Demo Login', () => {
  test('Try Demo button redirects to dashboard', async () => {
    render(<LoginPage />);
    const demoButton = screen.getByRole('button', { name: /try demo/i });
    fireEvent.click(demoButton);
    
    // Check for redirect (may need mocking)
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });

  test('Demo credentials display is visible', () => {
    render(<LoginPage />);
    expect(screen.getByText('demo@sadhanaboard.com')).toBeInTheDocument();
    expect(screen.getByText('demo123456')).toBeInTheDocument();
  });

  test('Demo banner appears after login', async () => {
    // After navigating to dashboard in demo mode
    render(<DashboardPage />);
    expect(screen.getByText(/demo mode active/i)).toBeInTheDocument();
  });
});
```

### Example E2E Test (Cypress/Playwright)
```javascript
describe('Demo Login E2E', () => {
  it('should complete demo login flow', () => {
    cy.visit('/login');
    cy.contains('Try Demo').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Demo Mode Active').should('be.visible');
  });

  it('should allow manual demo login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('demo@sadhanaboard.com');
    cy.get('input[name="password"]').type('demo123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Test Checklist

- [ ] Demo button click works
- [ ] Manual credential login works
- [ ] Correct redirect to dashboard
- [ ] Token stored in localStorage
- [ ] Token has demo flag
- [ ] Demo banner displays
- [ ] Banner can be dismissed
- [ ] Protected routes accessible
- [ ] Logout works
- [ ] Can re-login after logout
- [ ] Onboarding marked complete
- [ ] UI responsive on mobile
- [ ] No console errors
- [ ] Performance is fast
- [ ] Works in multiple browsers
- [ ] Error handling works
- [ ] Credentials display visible

## Reporting Issues

If you find any issues during testing, please document:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/device info
5. Console errors (if any)
6. Screenshots (if applicable)

## Support

For more information:
- See `DEMO_LOGIN_FEATURE.md` for detailed documentation
- See `DEMO_LOGIN_QUICK_START.md` for user guide
- Check inline code comments in implementation files
