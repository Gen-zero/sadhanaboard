# DNS Configuration Guide for Sadhanaboard.com on GoDaddy

This guide provides step-by-step instructions for configuring DNS records for your sadhanaboard.com domain purchased from GoDaddy to work with Netlify (frontend) and your backend hosting provider.

## Overview of Required DNS Records

You'll need to configure the following DNS records:
1. Root domain (sadhanaboard.com) pointing to Netlify
2. API subdomain (api.sadhanaboard.com) pointing to your backend hosting provider
3. WWW subdomain (www.sadhanaboard.com) pointing to Netlify (optional)

## Step 1: Configure Root Domain for Netlify

1. Log in to your GoDaddy account
2. Go to "My Products" and find your domain "sadhanaboard.com"
3. Click "DNS" next to your domain
4. In Netlify, go to your site settings > Domain management
5. Note the DNS records provided by Netlify (usually A records with IP addresses)
6. In GoDaddy DNS management:
   - Delete any existing A records for "@"
   - Add new A records for each IP address provided by Netlify:
     - Type: A
     - Name: @ (this represents the root domain)
     - Value: [Netlify IP address 1]
     - TTL: 1 hour (or default)
   - Repeat for each Netlify IP address

## Step 2: Configure WWW Subdomain for Netlify

1. In GoDaddy DNS management:
   - Add a CNAME record:
     - Type: CNAME
     - Name: www
     - Value: [Your Netlify subdomain].netlify.app
     - TTL: 1 hour (or default)
   - You can find your Netlify subdomain in Netlify site settings

## Step 3: Configure API Subdomain for Backend

1. In your backend hosting provider (e.g., Render, Railway), set up a custom domain:
   - Domain: api.sadhanaboard.com
   - Note the target domain or IP address provided by your hosting provider
2. In GoDaddy DNS management:
   - Add a CNAME record:
     - Type: CNAME
     - Name: api
     - Value: [Your backend hosting domain] (provided by Render/Railway/etc.)
     - TTL: 1 hour (or default)
   - OR if your provider gives IP addresses, add A records:
     - Type: A
     - Name: api
     - Value: [Backend IP address]
     - TTL: 1 hour (or default)

## Example DNS Configuration

Here's what your DNS records should look like:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 1 hour |
| A | @ | 64.68.192.10 | 1 hour |
| CNAME | www | your-site.netlify.app | 1 hour |
| CNAME | api | your-backend.onrender.com | 1 hour |

## Step 4: Verify DNS Configuration

1. Wait for DNS propagation (this can take anywhere from a few minutes to 48 hours)
2. You can check propagation status using tools like:
   - whatsmydns.net
   - dnschecker.org
3. Test that:
   - sadhanaboard.com loads your Netlify site
   - www.sadhanaboard.com loads your Netlify site
   - api.sadhanaboard.com connects to your backend

## Troubleshooting DNS Issues

### Common Problems:

1. **Site not loading after DNS changes**:
   - DNS propagation can take time
   - Check TTL settings (lower TTL means faster updates)
   - Use DNS checking tools to verify records have propagated

2. **SSL Certificate Issues**:
   - Netlify automatically provisions SSL certificates
   - If you see SSL errors, wait for DNS propagation to complete
   - Check that all DNS records are correctly configured

3. **API Subdomain Not Working**:
   - Verify the CNAME record points to the correct backend domain
   - Check your backend hosting provider's documentation for custom domain setup
   - Ensure your backend is configured to respond to requests for api.sadhanaboard.com

### DNS Record Verification Commands:

You can use these commands to verify your DNS records:

```bash
# Check A records for root domain
nslookup sadhanaboard.com

# Check CNAME records
nslookup www.sadhanaboard.com
nslookup api.sadhanaboard.com

# For more detailed information
dig sadhanaboard.com
dig www.sadhanaboard.com
dig api.sadhanaboard.com
```

## Additional Considerations

### Email Setup
If you plan to use email addresses with your domain (e.g., admin@sadhanaboard.com):
1. You'll need to configure MX records
2. Consider using email hosting services like Google Workspace or Microsoft 365
3. Add MX records provided by your email service to GoDaddy DNS

### Security
1. Consider enabling two-factor authentication on your GoDaddy account
2. Regularly review DNS records for unauthorized changes
3. Keep your domain registration information up to date

## Support

If you encounter issues with DNS configuration:
1. Check GoDaddy's DNS management documentation
2. Refer to your hosting provider's custom domain setup guides
3. Contact GoDaddy support for DNS-specific issues
4. Contact your hosting provider for service-specific issues