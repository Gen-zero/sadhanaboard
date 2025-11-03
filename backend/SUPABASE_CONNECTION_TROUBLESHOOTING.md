# Supabase Connection Troubleshooting Guide

## Current Status

Your database configuration is correctly set up with:
- ✅ **Connection String Format:** Correct
- ✅ **DATABASE_URL:** Set in `.env.development`
- ✅ **Application Code:** Configured to use connection string
- ❌ **Network Connectivity:** IPv6 network unreachable (ENETUNREACH)

## The Problem

**Error:** `ENETUNREACH 2406:da1c:f42:ae09:1bf2:22bd:e968:b671:6543`

Your system can resolve the Supabase hostname to an IPv6 address, but cannot establish a network connection to that IPv6 address. This is a **network-level issue**, not a database configuration issue.

### Root Causes (Common)

1. **IPv6 not fully enabled** on your ISP/network
2. **Firewall blocking IPv6** traffic to international IPs
3. **VPN or proxy** interfering with IPv6
4. **Network driver** not supporting IPv6 connections
5. **Windows Firewall** blocking IPv6

## Solutions to Try

### Solution 1: Use IPv4 (Recommended for now)

Supabase also has IPv4 availability. Try adding this to your `.env.development`:

```
# Use the standard (non-pooled) connection which may have better IPv4 support
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.papgfhcvgzwcdujsbafg.supabase.co:5432/postgres?sslmode=require
```

However, note that this may also resolve to IPv6, so it might not help.

### Solution 2: Enable IPv6 on Windows

1. Open Command Prompt (Admin)
2. Run: `netsh int ipv6 set state enabled`
3. Run: `netsh int ipv6 set state interface=* enabled`
4. Restart your computer
5. Try connecting again

### Solution 3: Disable IPv6 and Use IPv4 Only

If you can't get IPv6 working, disable IPv6 on Windows:

1. Open Command Prompt (Admin)
2. Run: `netsh int ipv6 set state disabled`
3. Restart your computer
4. The connection should try IPv4

### Solution 4: Update .env to Force IPv4

Add this to explicitly avoid IPv6:

```bash
# Try connection without IPv6
NODE_OPTIONS=--dns-result-order=ipv4first
```

Then run your app with:
```bash
set NODE_OPTIONS=--dns-result-order=ipv4first
npm run dev
```

### Solution 5: Use VPN or Different Network

- Try connecting through a **VPN** (which might route IPv4 better)
- Try connecting from a **different network** (mobile hotspot, work network)
- This helps identify if it's your ISP/network

### Solution 6: Contact Supabase Support

If none of the above works, contact Supabase support with:
- Your project ID: `papgfhcvgzwcdujsbafg`
- Error message: `ENETUNREACH on IPv6`
- Ask if they can provide IPv4-only endpoint

## Verification Steps

Once you make changes:

1. **Clear DNS cache:**
   ```bash
   ipconfig /flushdns
   ```

2. **Test connection:**
   ```bash
   cd backend
   node test-db-connection.js
   ```

3. **Check what IP is being used:**
   ```bash
   nslookup db.papgfhcvgzwcdujsbafg.supabase.co
   ```

## Your Current Configuration

### `.env.development`
```
DATABASE_URL=postgresql://postgres:KaliVaibhav@db.papgfhcvgzwcdujsbafg.supabase.co:6543/postgres?sslmode=require
```

### `config/db.js`
- Uses connection string directly ✅
- No manual SSL config needed ✅
- Handles timeout properly ✅

## Using the Database Without Direct Connection

While you troubleshoot network issues, you can:

1. **Use Supabase REST API** (no direct PostgreSQL needed):
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env`
   - Use Supabase JavaScript client

2. **Use Supabase Cloud functions** to run queries server-side

3. **Keep developing** - set up error handling for when DB is unreachable:

```javascript
// In your route handlers
try {
  // Database query
} catch (error) {
  if (error.message.includes('ENETUNREACH') || error.message.includes('ENOTFOUND')) {
    console.error('Database temporarily unavailable');
    // Fallback gracefully
  } else {
    throw error;
  }
}
```

## Files to Reference

- **Connection Test:** `test-db-connection.js` (run this to diagnose)
- **IPv6 Direct Test:** `test-ipv6-direct.js` (advanced diagnostics)
- **Configuration:** `config/db.js`
- **Environment:** `.env.development`

## Quick Checklist

- [ ] Try disabling IPv6 on Windows
- [ ] Try using a VPN
- [ ] Try on different network (mobile hotspot)
- [ ] Run `ipconfig /flushdns`
- [ ] Update Node.js to latest version
- [ ] Contact Supabase support if issue persists

## Notes

- The configuration code itself is correct ✅
- The issue is network/environment, not code ❌
- This is often temporary and resolves after network changes
- Many developers face IPv6 issues on certain networks

---

**Last Updated:** 2025-01-07  
**Tested Environment:** Windows with Supabase Postgres
