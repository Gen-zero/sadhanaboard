# Demo Login Feature - Integration & Troubleshooting Guide

## Integration Checklist

### Files to Review
- [x] `src/lib/demo-auth.ts` - Core demo utilities
- [x] `src/services/api.js` - API service with demo support
- [x] `src/pages/landing/LoginPage.tsx` - Login UI with demo button
- [x] `src/hooks/useDemoMode.ts` - Demo mode detection hook
- [x] `src/components/DemoBanner.tsx` - Banner component
- [x] `src/lib/auth-context.tsx` - Auth context with demo handling
- [x] `src/App.tsx` - App-level integration

### Pre-deployment Checklist
- [ ] All files compiled without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Demo button visible on login page
- [ ] Demo credentials displayed correctly
- [ ] Demo login works end-to-end
- [ ] Demo banner appears on dashboard
- [ ] Logout works properly
- [ ] Can re-login after logout
- [ ] Works on desktop browsers
- [ ] Works on mobile browsers
- [ ] No console errors in development
- [ ] Performance is acceptable

## Troubleshooting Guide

### Issue: "Try Demo" button not appearing

**Symptoms**: Button missing from login page

**Troubleshooting**:
1. Check `LoginPage.tsx` imports - verify `DEMO_CREDENTIALS` is imported
2. Check `demo-auth.ts` file exists at `src/lib/demo-auth.ts`
3. Look for compilation errors in console
4. Verify button code is between line 205-225 in LoginPage.tsx
5. Clear browser cache and hard refresh (Ctrl+Shift+R)

**Solution**:
```bash
# Rebuild the project
npm run build

# Or for development
npm run dev
```

### Issue: Demo login not working / staying on login page

**Symptoms**: Clicking "Try Demo" doesn't log in or redirect

**Troubleshooting**:
1. Check browser console for errors (F12 → Console)
2. Verify API service has demo login logic
3. Check `isDemoLogin()` function in `api.js` (around line 5-9)
4. Verify credentials match exactly: `demo@sadhanaboard.com` and `demo123456`
5. Check localStorage has token after clicking
   ```javascript
   console.log(localStorage.getItem('token'));
   ```

**Solution**:
```javascript
// In browser console, manually test:
const token = localStorage.getItem('token');
if (token) {
  const parts = token.split('.');
  console.log('Token payload:', JSON.parse(atob(parts[1])));
}
```

### Issue: Demo banner not showing

**Symptoms**: No amber banner at top after demo login

**Troubleshooting**:
1. Verify `DemoBanner.tsx` exists at `src/components/DemoBanner.tsx`
2. Check `App.tsx` imports `DemoBanner` (line ~46)
3. Verify `<DemoBanner />` is rendered (around line 312)
4. Check that `useDemoMode` hook returns `isDemoMode = true`
5. Verify token in localStorage has `mode: 'demo'`

**Solution**:
```typescript
// In browser console:
import { useDemoMode } from '@/hooks/useDemoMode';
const { isDemoMode } = useDemoMode();
console.log('Is demo mode:', isDemoMode);
```

### Issue: Onboarding redirect after demo login

**Symptoms**: Logged in as demo but redirected to `/onboarding` instead of dashboard

**Troubleshooting**:
1. Check `auth-context.tsx` `checkOnboardingStatus()` function
2. Verify demo mode detection in onboarding check
3. Check profile API response includes `onboarding_completed: true` for demo
4. Look for errors in fetching profile

**Solution**:
```javascript
// Force reload after demo login
window.location.href = '/dashboard';
```

### Issue: Token not persisting

**Symptoms**: Logged out immediately or token cleared

**Troubleshooting**:
1. Check localStorage quota not exceeded
   ```javascript
   console.log(localStorage.length); // Should show token
   ```
2. Verify token is being set: `api.setToken(token)` in login method
3. Check browser allows localStorage
4. Check for clear on navigation

**Solution**:
```javascript
// Verify in console:
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test')); // Should log 'value'
```

### Issue: Can't login with real credentials after demo

**Symptoms**: Regular authentication fails

**Troubleshooting**:
1. Verify real backend is running
2. Check API base URL is correct
3. Verify non-demo credentials are correct
4. Check network tab shows API calls

**Solution**:
```javascript
// Check API URL:
console.log(import.meta.env.VITE_API_BASE_URL);
```

### Issue: Console errors about missing files

**Symptoms**: Module not found or import errors

**Troubleshooting**:
1. Verify all new files were created:
   - `src/lib/demo-auth.ts`
   - `src/hooks/useDemoMode.ts`
   - `src/components/DemoBanner.tsx`
2. Check file paths match imports exactly
3. Verify no typos in import statements

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: TypeScript errors in modified files

**Symptoms**: Compilation errors during build

**Troubleshooting**:
1. Check for typos in type definitions
2. Verify imports are correct
3. Check for missing dependencies
4. Run type check:
   ```bash
   npx tsc --noEmit
   ```

**Solution**:
```bash
# Fix type errors:
npm run build # Will show specific errors
# Fix errors in editor using error messages
```

### Issue: Performance issues / slow demo login

**Symptoms**: Delay when clicking "Try Demo"

**Troubleshooting**:
1. Check for heavy computations in login handler
2. Verify no extra API calls in network tab
3. Check React component re-renders
4. Test in incognito mode to eliminate extensions

**Solution**:
```javascript
// Add timing
console.time('demo-login');
// ... login code ...
console.timeEnd('demo-login');
```

## Common Configuration Issues

### Issue: Wrong API Base URL

**Problem**: Demo login works but other features fail

**Solution**:
```bash
# Check .env files
cat .env
cat .env.development
cat .env.production

# Ensure VITE_API_BASE_URL is set correctly
VITE_API_BASE_URL=http://localhost:3000/api
# or
VITE_API_BASE_URL=/api
```

### Issue: CORS errors with backend

**Problem**: API calls fail even after proper login

**Solution**:
- Demo login bypasses this (no API call)
- For real authentication, ensure backend CORS is configured
- Check backend is running and accessible

### Issue: Environment variables not loading

**Problem**: Demo mode not detecting correctly

**Solution**:
```typescript
// Verify environment setup in vite.config.ts
console.log(import.meta.env); // Should show all vars
```

## Performance Optimization

### Token Parsing
```javascript
// Current implementation is already optimized
// Token parsing is fast (< 1ms)
// Caching is not needed
```

### API Calls
```javascript
// Demo mode completely bypasses API calls
// For demo login:
// - No HTTP request
// - No network latency
// - Instant response
```

## Testing Fixes

### Test in Development
```bash
npm run dev
# Visit http://localhost:5173/login
# Click "Try Demo"
```

### Test Production Build
```bash
npm run build
npm run preview
# Visit http://localhost:4173/login
# Click "Try Demo"
```

## Rollback Procedure

If you need to remove demo login:

### Option 1: Disable Demo Mode
```javascript
// In src/services/api.js, comment out:
// if (isDemoLogin(email, password)) {
//   ... demo logic ...
// }
```

### Option 2: Remove Demo Files
```bash
# Remove new files
rm src/lib/demo-auth.ts
rm src/hooks/useDemoMode.ts
rm src/components/DemoBanner.tsx

# Remove imports from App.tsx
# Remove button from LoginPage.tsx
```

### Option 3: Git Revert
```bash
git revert <commit-hash>
```

## Version Compatibility

### Node.js
- Minimum: 14.x
- Recommended: 18.x+
- Required: 22.x (per package.json)

### Browser Support
- Chrome: ✅ All versions
- Firefox: ✅ All versions
- Safari: ✅ 11+
- Edge: ✅ All versions

## Database/Backend Impact

**No changes required to backend!**
- Demo login is completely client-side
- No database modifications needed
- No backend configuration needed
- Existing API calls still work for non-demo users

## Security Considerations

⚠️ **Demo Mode Security**:
- Not for production use
- Credentials are visible by design
- Mock tokens are not validated
- Anyone can access demo account
- Use environment variables to disable in production

**Production Checklist**:
- [ ] Disable demo mode for production
- [ ] Remove demo button from production build
- [ ] Remove demo credentials from code
- [ ] Use environment variable to control demo mode

Example:
```javascript
const enableDemo = import.meta.env.VITE_ENABLE_DEMO === 'true';
if (enableDemo) {
  // Show demo button
}
```

## Support Resources

1. **Documentation**:
   - `DEMO_LOGIN_FEATURE.md` - Complete feature documentation
   - `DEMO_LOGIN_QUICK_START.md` - User guide
   - `DEMO_LOGIN_TESTING_GUIDE.md` - Testing procedures

2. **Code References**:
   - Check inline comments in each modified file
   - Review function documentation in `.ts` files
   - Look at JSDoc comments for API methods

3. **Debugging**:
   - Browser DevTools (F12)
   - Network tab for API calls
   - Console for errors
   - LocalStorage inspector

4. **Contact**:
   - Check project README
   - Review git history for changes
   - Check other documentation files

## Quick Reference

### Demo Credentials
```
Email: demo@sadhanaboard.com
Password: demo123456
```

### Key Files
```
- Core Logic: src/services/api.js
- UI: src/pages/landing/LoginPage.tsx
- Banner: src/components/DemoBanner.tsx
- Utilities: src/lib/demo-auth.ts
- Hook: src/hooks/useDemoMode.ts
```

### Key Functions
```
- isDemoLogin(): Check if credentials match demo
- generateDemoToken(): Create mock JWT
- isDemoMode(): Detect demo session
- useDemoMode(): React hook for detection
```

### Testing Command
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run test     # Run tests
```

## Success Indicators

✅ **Demo login is working if**:
1. "Try Demo" button appears on login page
2. Clicking button redirects to dashboard
3. Demo banner shows at top
4. Token exists in localStorage
5. Can navigate around app
6. Logout works
7. Can re-login

## Next Steps

1. Follow the troubleshooting steps if you encounter issues
2. Test thoroughly using the testing guide
3. Deploy to your desired environment
4. Monitor for issues
5. Provide feedback for improvements

---

For detailed information, see the main documentation files.
