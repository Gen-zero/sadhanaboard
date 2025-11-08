# Demo Login Quick Start Guide

## What is Demo Login?

Demo login allows you to access the Saadhana Board application without needing a backend server or creating a real account. It's perfect for:
- Testing the UI/UX
- Giving demos to stakeholders
- Exploring features without backend setup
- Development and testing

## How to Use Demo Login

### Option 1: Click "Try Demo" Button (Easiest)
1. Navigate to the login page (`/login`)
2. Click the **"Try Demo"** button with the ⚡ icon
3. You'll be instantly logged in as a demo user
4. Redirected to the dashboard

### Option 2: Manual Demo Login
1. Go to the login page
2. Enter these credentials:
   - **Email**: `demo@sadhanaboard.com`
   - **Password**: `demo123456`
3. Click "Login"
4. You'll be logged in as a demo user

## What Works in Demo Mode

✅ **Works Without Backend:**
- Dashboard access
- All protected routes and pages
- Settings and profile pages
- Navigation and routing
- UI/UX exploration
- Theme switching

⚠️ **Limited Functionality:**
- Data is not persisted (refreshing loses session)
- Can't create/edit real data
- API calls that need backend will fail gracefully
- Sadhana tracking won't be saved

## How to Know You're in Demo Mode

1. **Look for the amber banner** at the top of the page saying "Demo Mode Active"
2. **Check browser localStorage**:
   - Open DevTools (F12)
   - Go to Application → LocalStorage
   - Look for `token` key with `"mode":"demo"` in the value

## Demo User Info

**Display Name**: Demo User  
**Email**: demo@sadhanaboard.com  
**User ID**: demo-user-001

## FAQ

### Can I change the demo credentials?
Yes! Edit `src/lib/demo-auth.ts` or `src/services/api.js` to change the `DEMO_CREDENTIALS` or `isDemoLogin()` function.

### Will demo data be saved?
No. Demo mode doesn't persist any data. Close the app and reopen it to start fresh.

### Can I logout from demo mode?
Yes. Click logout and you'll be logged out. You can login again with either demo or real credentials.

### Can I test real authentication?
Yes. Use real credentials to bypass demo mode and test with the actual backend. Demo login only triggers if you use the exact demo email and password.

### How do I disable demo mode?
Remove the "Try Demo" button from the login page and the demo auth logic from the API service.

### Can multiple people use the same demo account?
Yes! The demo account is shareable and doesn't require a backend, so multiple people can login simultaneously from different devices.

## Environment

- **Backend required**: No ✅
- **Network required**: No (except for assets/images)
- **Database required**: No ✅
- **Configuration required**: No ✅

Just open the app and click "Try Demo"!

## Tips

1. **Use for quick testing**: When you want to quickly test a feature without logging in
2. **Stakeholder demos**: Show off the UI/UX without backend complications
3. **Development**: Test new pages/components before connecting to backend
4. **Training**: Onboard new team members to the application UI
5. **CI/CD**: Useful for visual regression testing

## Troubleshooting

### Demo button not working?
- Check browser console for errors (F12 → Console)
- Make sure you're on the login page (`/login`)
- Try refreshing the page

### Can't access dashboard after demo login?
- Check if the demo banner is showing (indicates successful demo login)
- Check localStorage for the token (DevTools → Application → LocalStorage)
- Clear browser cache and try again

### Banner keeps appearing even after dismissal?
- The banner dismissal is stored in component state, not localStorage
- Refresh the page to reset it
- You can also just close it and continue

## Next Steps

1. ✅ Try the demo by clicking "Try Demo" button
2. 📍 Navigate around and explore the interface
3. 🎨 Try switching themes in settings
4. 🔄 When done, click logout
5. 🔐 Login with real credentials if you have them

---

**Need help?** Check the full documentation in `DEMO_LOGIN_FEATURE.md`
