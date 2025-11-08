# Demo Login Feature Documentation

## Overview

The demo login feature allows users to access the application without requiring backend authentication. This is useful for:
- **Testing**: Quickly access the application to test UI/UX features
- **Demonstrations**: Show off the application to stakeholders without backend setup
- **Development**: Test the frontend without needing a running backend server
- **Onboarding**: Let new users explore the application without creating an account

## Demo Credentials

### Default Demo Account
- **Email**: `demo@sadhanaboard.com`
- **Password**: `demo123456`

These credentials are hardcoded in the application and can be modified in the relevant files.

## Files Modified/Created

### 1. **`src/lib/demo-auth.ts`** (New)
Contains all demo authentication utilities including:
- `DEMO_CREDENTIALS`: Object with email and password
- `isDemoLogin()`: Checks if provided credentials match demo credentials
- `generateDemoToken()`: Creates a mock JWT token with demo flag
- `createDemoUser()`: Creates a demo user object
- `isDemoMode()`: Checks if current session is in demo mode
- `getDemoUserFromToken()`: Extracts demo user info from token

### 2. **`src/services/api.js`** (Modified)
Added demo authentication support to the API service:
- `isDemoLogin()`: Helper to identify demo login attempts
- `generateDemoToken()`: Generates a mock JWT token
- `isDemoMode()`: Checks if the session is in demo mode
- Modified `login()` method: Intercepts demo login and bypasses backend call
- Modified `getCurrentUser()`: Returns demo user info without backend call
- Modified `getProfile()`: Returns mock profile for demo users with `onboarding_completed: true`

### 3. **`src/pages/landing/LoginPage.tsx`** (Modified)
Enhanced login page with:
- Demo button with "Try Demo" text and Zap icon
- `handleDemoLogin()` function that triggers demo login flow
- Visual divider between regular login and demo login
- Demo credentials display box showing email and password
- Message indicating "Backend connection not required for demo mode"

### 4. **`src/hooks/useDemoMode.ts`** (New)
React hook for demo mode detection:
- `useDemoMode()`: Hook that returns `isDemoMode` and `isLoading` state
- `isDemoModeSync()`: Synchronous helper to check demo mode

### 5. **`src/components/DemoBanner.tsx`** (New)
Visual banner component that:
- Displays when user is in demo mode
- Shows warning/info about demo mode being active
- Can be dismissed by the user
- Appears at the top of the page with amber styling

### 6. **`src/lib/auth-context.tsx`** (Modified)
Updated the auth context to:
- Handle demo mode in `checkOnboardingStatus()`
- Automatically set onboarding as completed for demo users
- Gracefully handle API errors for demo accounts

### 7. **`src/App.tsx`** (Modified)
Added import and usage of `DemoBanner` component to display banner when in demo mode

## How It Works

### Demo Login Flow

1. **User clicks "Try Demo" button** on the login page
2. **`handleDemoLogin()` is triggered** with demo credentials
3. **Auth context's `login()` method is called** with demo credentials
4. **API service checks if credentials match demo credentials**
5. **If matched**: 
   - Generates a mock JWT token with `mode: 'demo'` flag
   - Stores token in localStorage
   - Returns user data without making backend API call
6. **User is authenticated as demo user**
7. **`checkOnboardingStatus()` detects demo mode and sets onboarding as complete**
8. **User is redirected to dashboard**
9. **DemoBanner appears** to remind user they're in demo mode

### Demo Mode Detection

The system detects demo mode by:
1. Checking if a token exists in localStorage
2. Parsing the JWT token (split by '.' to get payload)
3. Base64 decoding the payload
4. Checking if `payload.mode === 'demo'`

### Key Features

- **No Backend Required**: Demo login completely bypasses backend API calls
- **Full App Access**: Demo users can access all protected routes
- **Onboarding Bypass**: Demo users are automatically marked as onboarding complete
- **Visual Indicator**: Demo banner reminds users they're in test mode
- **Demo Data**: API calls return mock data for demo users:
  - Profile with `onboarding_completed: true`
  - Demo user information
  - Default settings

## Customizing Demo Credentials

To change demo credentials, modify these locations:

### Option 1: Modify `src/lib/demo-auth.ts`
```typescript
export const DEMO_CREDENTIALS = {
  email: 'your-email@example.com',
  password: 'your-password-here',
  displayName: 'Your Display Name',
};
```

### Option 2: Modify `src/services/api.js`
Update the `isDemoLogin()` function:
```javascript
const isDemoLogin = (email, password) => {
  return (
    email.toLowerCase() === 'your-email@example.com' &&
    password === 'your-password-here'
  );
};
```

### Option 3: Modify `src/pages/landing/LoginPage.tsx`
Import and use the credentials from `demo-auth.ts`:
```typescript
import { DEMO_CREDENTIALS } from "@/lib/demo-auth";
```

## Environment Variables

No additional environment variables are required for the demo feature. It works out of the box.

## Disabling Demo Mode

To disable the demo feature:

1. **Remove "Try Demo" button from LoginPage.tsx**
2. **Remove demo login logic from `api.js`**
3. **Remove DemoBanner from App.tsx**

Alternatively, comment out the demo credentials check in the `login()` method to fall through to regular authentication.

## API Method Overrides

When in demo mode, these API methods return mock data without making backend calls:

| Method | Demo Response |
|--------|---|
| `api.login()` | Returns demo user with token (no backend call) |
| `api.getCurrentUser()` | Returns demo user from token payload |
| `api.getProfile()` | Returns mock profile with `onboarding_completed: true` |
| `api.logout()` | Works normally (clears token) |
| Other methods | Fall through to regular API (may fail if backend unavailable) |

## User Experience

### Demo Login Flow
1. User lands on login page
2. Sees "Try Demo" button with Zap icon
3. Clicks button and is immediately logged in
4. Redirected to dashboard
5. Sees amber banner saying "Demo Mode Active"
6. Can explore application freely
7. Can dismiss banner with X button

### Credentials Display
The login page displays:
```
Demo Access
Email: demo@sadhanaboard.com
Password: demo123456

Backend connection not required for demo mode
```

## Security Considerations

**Important**: The demo feature is for **testing and demonstration purposes only**:

1. **Mock Tokens**: Demo tokens are not validated by any backend
2. **Mock Data**: Profile data is hardcoded, not from a real database
3. **No Persistence**: Demo data is not saved anywhere
4. **Not for Production**: This feature should only be used in development/demo environments
5. **Visible Credentials**: Demo credentials are visible in the UI to make it easy for users to test

## Testing

To test the demo feature:

1. Navigate to the login page
2. Click "Try Demo" button
3. Should be redirected to dashboard
4. Amber banner should appear at top
5. Check browser console - should see token with `mode: 'demo'` in payload
6. Logout should work normally
7. Logging in again should work as expected

## Future Enhancements

Potential improvements to the demo feature:

1. **Demo Data Persistence**: Store demo data in localStorage for the session
2. **Multiple Demo Accounts**: Support multiple demo user profiles
3. **Feature Toggles**: Allow/disable demo mode via environment variable
4. **Time Limit**: Add session timeout for demo users
5. **Demo-specific Content**: Show different content/CTAs for demo vs. real users
6. **Analytics**: Track demo logins separately from real users
7. **API Mocking**: Expand API mocking to cover more endpoints
