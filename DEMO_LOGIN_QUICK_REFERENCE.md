# Demo Login - Quick Reference Card

## 🚀 Quick Start (30 seconds)

1. Go to login page: `http://localhost:5173/login`
2. Click **"Try Demo"** button (⚡ icon)
3. Done! You're logged in

## 📝 Demo Credentials

| Field | Value |
|-------|-------|
| **Email** | demo@sadhanaboard.com |
| **Password** | demo123456 |
| **Display Name** | Demo User |
| **User ID** | demo-user-001 |

## 📁 Key Files

### Implementation Files
- `src/lib/demo-auth.ts` - Demo utilities
- `src/services/api.js` - API service with demo support
- `src/pages/landing/LoginPage.tsx` - Login page with demo button
- `src/hooks/useDemoMode.ts` - Demo mode detection
- `src/components/DemoBanner.tsx` - Demo banner
- `src/lib/auth-context.tsx` - Auth context updates
- `src/App.tsx` - App-level integration

### Documentation Files
- `START_HERE_DEMO_LOGIN.md` ← **Read this first**
- `DEMO_LOGIN_QUICK_START.md` - User guide
- `DEMO_LOGIN_FEATURE.md` - Full documentation
- `DEMO_LOGIN_TESTING_GUIDE.md` - Testing procedures
- `DEMO_LOGIN_INTEGRATION_GUIDE.md` - Troubleshooting
- `DEMO_LOGIN_IMPLEMENTATION_SUMMARY.md` - Technical details

## ✨ What's New

### UI Changes
- ✅ "Try Demo" button on login page
- ✅ Demo credentials display box
- ✅ Visual divider between login methods
- ✅ Amber demo banner at top of page

### Features
- ✅ One-click demo access
- ✅ No backend required
- ✅ Full app access
- ✅ Session persistence
- ✅ Logout support

## 🔑 How It Works

```
Click "Try Demo"
    ↓
Login with demo credentials
    ↓
Backend is bypassed (client-side auth)
    ↓
Mock JWT token generated
    ↓
Token stored in localStorage
    ↓
Redirect to /dashboard
    ↓
Demo banner appears
```

## ⚙️ Configuration

### Customize Credentials
Edit `src/lib/demo-auth.ts`:
```typescript
export const DEMO_CREDENTIALS = {
  email: 'your-email@example.com',
  password: 'your-password',
  displayName: 'Your Name',
};
```

### Disable Demo Mode
Comment out demo login check in `src/services/api.js` (line ~161)

## 🧪 Testing

### Quick Test (2 minutes)
```bash
npm run dev
# Visit http://localhost:5173/login
# Click "Try Demo"
# Verify redirect to /dashboard
# Check demo banner appears
```

### Full Testing
See `DEMO_LOGIN_TESTING_GUIDE.md`

## 🐛 Troubleshooting

### Button not appearing?
- Clear browser cache (Ctrl+Shift+R)
- Rebuild project: `npm run build`

### Demo login not working?
- Check browser console (F12)
- Verify token in localStorage: `localStorage.getItem('token')`
- Check credentials match exactly

### Banner not showing?
- Verify `DemoBanner` imported in App.tsx
- Check `useDemoMode` hook returns true
- Clear cache and refresh

See `DEMO_LOGIN_INTEGRATION_GUIDE.md` for more help

## 📊 What Works

### ✅ In Demo Mode
- Login/Logout
- Dashboard access
- Settings page
- Profile page
- Theme switching
- Navigation
- All protected routes

### ⚠️ Limited In Demo
- No data persistence
- No backend sync
- Mock profile data
- Some API calls may fail

## 🔐 Important Notes

⚠️ **Demo Mode is:**
- For testing only
- Client-side only
- Not secure (by design)
- Not for production
- Visible credentials (intentional)

## 📱 Browser Support

Works in:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎯 Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Run tests
npm run test

# Lint
npm run lint
```

## 📚 Documentation Order

1. **START_HERE_DEMO_LOGIN.md** ← Start here!
2. **DEMO_LOGIN_QUICK_START.md** ← User guide
3. **DEMO_LOGIN_TESTING_GUIDE.md** ← Testing
4. **DEMO_LOGIN_FEATURE.md** ← Full docs
5. **DEMO_LOGIN_INTEGRATION_GUIDE.md** ← Troubleshooting
6. **DEMO_LOGIN_IMPLEMENTATION_SUMMARY.md** ← Technical

## 💡 Tips & Tricks

### Check if in Demo Mode
```javascript
// In browser console:
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Demo mode:', payload.mode === 'demo');
```

### Clear Demo Session
```javascript
// In browser console:
localStorage.removeItem('token');
location.href = '/login';
```

### View Token Info
```javascript
// In browser console:
const token = localStorage.getItem('token');
console.log(JSON.parse(atob(token.split('.')[1])));
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Button not showing | Clear cache, rebuild |
| Login fails | Check credentials exact match |
| Banner missing | Verify imports in App.tsx |
| Performance slow | Check network tab |
| Console errors | See troubleshooting guide |

## 📞 Support

**Need help?** Check these files in order:
1. This file (Quick Reference)
2. `DEMO_LOGIN_QUICK_START.md` (User guide)
3. `DEMO_LOGIN_INTEGRATION_GUIDE.md` (Troubleshooting)
4. `DEMO_LOGIN_FEATURE.md` (Full documentation)

## ✅ Verification Checklist

- [ ] Demo button visible on login page
- [ ] Demo credentials displayed
- [ ] "Try Demo" button works
- [ ] Redirects to dashboard
- [ ] Demo banner appears
- [ ] Can navigate pages
- [ ] Logout works
- [ ] Can re-login
- [ ] No console errors

## 🎉 Done!

You're all set! The demo login feature is:
- ✅ Fully implemented
- ✅ Well documented
- ✅ Ready to test
- ✅ Ready to deploy

**Next step**: Click "Try Demo" on login page!

---

**Quick Links**:
- 📖 Full Docs: `START_HERE_DEMO_LOGIN.md`
- 🧪 Testing: `DEMO_LOGIN_TESTING_GUIDE.md`
- 🔧 Troubleshooting: `DEMO_LOGIN_INTEGRATION_GUIDE.md`
- 💻 Code: Check files listed in "Key Files" section
