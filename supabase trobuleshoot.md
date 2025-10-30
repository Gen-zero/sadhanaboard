# Supabase Connection Troubleshooting Guide

## STEP 1: Verify Environment Variables

Check that your `.env` file has these variables correctly set:

```bash
SUPABASE_URL=https://bhasogcwwjsjzjkckzeh.supabase.co
DATABASE_URL=postgresql://postgres:ZS6q89bgySB1NmZR@db.bhasogcwwjsjzjkckzeh.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## STEP 2: Try Using Connection Pooling URL

Replace the DATABASE_URL in `.env` files with the pooled connection URL (port 6543 instead of 5432):

**Old URL:**
```
postgresql://postgres:ZS6q89bgySB1NmZR@bhasogcwwjsjzjkckzeh.supabase.co:5432/postgres?sslmode=require
```

**New URL (Recommended):**
```
postgresql://postgres:ZS6q89bgySB1NmZR@db.bhasogcwwjsjzjkckzeh.supabase.co:6543/postgres
```

This helps with connection pooling and can avoid timeout issues.

---

## STEP 3: Test Without SSL (for local development)

Try removing the SSL requirement for local development:

```
postgresql://postgres:ZS6q89bgySB1NmZR@db.bhasogcwwjsjzjkckzeh.supabase.co:5432/postgres
```

(Remove the `?sslmode=require` part)

---

## STEP 4: Check Supabase Dashboard

1. Go to **Supabase Dashboard** > Your Project
2. Click **Settings** (gear icon) > **Database**
3. Look for:
   - **Database Status**: Should show "Healthy" with green indicator
   - **Connection String**: Verify it matches your DATABASE_URL
   - **IP Whitelist**: Check if your IP is whitelisted (or if it's open to all)

4. If needed, regenerate the database password:
   - Go to **Settings** > **Database** > **Users & Roles**
   - Click **postgres** user
   - Click **Reset Password**
   - Copy the new password and update your `.env` file

---

## STEP 5: Check Network Connectivity

Test if your machine can reach Supabase. Open PowerShell and run:

```powershell
# Test DNS resolution
[System.Net.Dns]::GetHostAddresses("db.bhasogcwwjsjzjkckzeh.supabase.co")

# Test HTTPS connectivity (should return status 200 or error, not timeout)
Invoke-WebRequest -Uri "https://bhasogcwwjsjzjkckzeh.supabase.co/health" -TimeoutSec 10
```

---

## STEP 6: Check Your Network/Firewall

- **Firewall**: Check if your local firewall is blocking outbound connections to port 5432 or 6543
- **ISP**: Some ISPs block direct database connections. If so, use port 6543 (pooling)
- **VPN**: If using VPN, try disabling it or checking if it's restricting connections
- **Corporate Network**: If on company network, ask IT if database ports are blocked

---

## STEP 7: Update Backend Configuration

Based on what works, update all three `.env` files:
- `backend/.env`
- `backend/.env.development`
- `backend/.env.production`

### Option A (With Pooling - Recommended):
```
DATABASE_URL=postgresql://postgres:ZS6q89bgySB1NmZR@db.bhasogcwwjsjzjkckzeh.supabase.co:6543/postgres
```

### Option B (Direct with SSL):
```
DATABASE_URL=postgresql://postgres:ZS6q89bgySB1NmZR@db.bhasogcwwjsjzjkckzeh.supabase.co:5432/postgres?sslmode=require
```

### Option C (Direct without SSL - Local Dev Only):
```
DATABASE_URL=postgresql://postgres:ZS6q89bgySB1NmZR@db.bhasogcwwjsjzjkckzeh.supabase.co:5432/postgres
```

---

## STEP 8: Restart Backend

After updating `.env` files, restart the backend server:

```powershell
# Stop the current server (Ctrl+C in the terminal running npm run dev)
# Then restart:
cd backend
npm run dev
```

---

## STEP 9: Verify Connection

Check the server logs. You should see one of:

- ✅ `Database connection successful` - Connection is working
- ⚠️ `Database connection not available` - Using fallback data (can still use app)

---

## If Still Not Working

### Check password encoding:
If password has special characters, they might need URL encoding.

Example:
- `@` becomes `%40`
- `#` becomes `%23`
- `:` becomes `%3A`

### Contact Supabase Support with these details:
- Connection string (masked)
- Network environment (home, office, etc.)
- Error message from logs
- Whether DNS resolution works
- Whether HTTPS connectivity works

---

## Quick Status Check

✅ **Current Configuration:**
- Host: `db.bhasogcwwjsjzjkckzeh.supabase.co`
- Port: `5432` (or `6543` for pooling)
- User: `postgres`
- Database: `postgres`
- Password: Set in `.env` files