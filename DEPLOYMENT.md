# SaadhanaBoard Deployment Guide

This guide provides step-by-step instructions for deploying the SaadhanaBoard application to Netlify with Supabase as the backend database, using your sadhanaboard.com domain from GoDaddy.

## Prerequisites

1. Supabase account
2. Netlify account
3. Domain name (sadhanaboard.com) purchased from GoDaddy
4. Backend hosting service (e.g., Render, Railway, or VPS) for API at api.sadhanaboard.com
5. Node.js and npm installed locally

## Step 1: Set up Supabase

1. Create a new project in Supabase
2. Note down the following credentials:
   - Project URL
   - Anonymous Key
   - Service Role Key

### How to get Supabase credentials:

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Enter project details:
   - Name: SaadhanaBoard
   - Database password: Create a strong password
   - Region: Choose the region closest to your users
4. Click "Create new project"
5. Once your project is created, navigate to the project dashboard
6. Get your credentials from Settings > API:
   - Project URL: The URL shown at the top of the API page
   - Anonymous Key: The `anon` `public` key (safe for frontend use)
   - Service Role Key: The `service_role` `secret` key (keep this secret!)

## Step 2: Configure Environment Variables

### Frontend Production (.env.production file)
```bash
# Supabase Configuration
# Get these from your Supabase project dashboard (Settings > API)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
# This is your backend API URL at api.sadhanaboard.com
VITE_API_BASE_URL=https://api.sadhanaboard.com/api

# Socket base URL
# This is your backend WebSocket URL at api.sadhanaboard.com
VITE_SOCKET_BASE_URL=https://api.sadhanaboard.com
```

### Backend (.env.production file)
```bash
# Supabase Configuration
# Get these from your Supabase project dashboard (Settings > API)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3004
BACKEND_URL=https://api.sadhanaboard.com

# CORS Configuration
CORS_ORIGIN=https://sadhanaboard.com

# JWT Configuration
# Generate a secure random string
# Example: openssl rand -base64 32
JWT_SECRET=your_secure_jwt_secret

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@sadhanaboard.com
ADMIN_PASSWORD=your_secure_admin_password
```

## Step 3: Migrate Database Schema

There are two ways to migrate your database schema to Supabase:

### Option 1: Automated Migration (if RPC functions are enabled)

1. Update the environment variables in your local .env file with Supabase credentials
2. Run the migration script:
   ```bash
   cd backend
   npm run migrate:supabase
   ```

### Option 2: Manual Migration (recommended for most cases)

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select your project
3. Go to SQL Editor in the left sidebar
4. Copy the entire contents of `supabase/migration.sql` from this repository
5. Paste the SQL commands into the editor
6. Click "Run" to execute all commands in one go

This will create all the necessary tables, indexes, and extensions for your SaadhanaBoard application in a single operation. The migration script includes:
- All user management tables
- All book/library related tables
- All sadhana tracking tables
- All CMS/content management tables
- All community and social features tables
- All analytics and system monitoring tables
- All necessary indexes for performance
- Required PostgreSQL extensions

## Step 4: Deploy Backend to Your Hosting Provider

You'll need to host your backend separately. Here's how to do it with Render:

1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the build command to `npm install`
4. Set the start command to `npm start`
5. Add all environment variables from .env.production
6. Set up a custom domain:
   - Go to your Render service dashboard
   - Click on "Settings" tab
   - Scroll to "Custom Domains" section
   - Add your domain: `api.sadhanaboard.com`
   - Follow Render's instructions to configure DNS

## Step 5: Deploy Frontend to Netlify

1. Log in to Netlify
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Set the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Netlify dashboard:
   - VITE_SUPABASE_URL (from Supabase Settings > API)
   - VITE_SUPABASE_ANON_KEY (from Supabase Settings > API)
   - VITE_API_BASE_URL: `https://api.sadhanaboard.com/api`
   - VITE_SOCKET_BASE_URL: `https://api.sadhanaboard.com`
6. Deploy the site

## Step 6: Configure Custom Domain in Netlify

1. In Netlify, go to Site settings > Domain management
2. Click "Add custom domain"
3. Enter your domain: `sadhanaboard.com`
4. Follow Netlify's instructions to configure DNS in GoDaddy:
   - Log in to your GoDaddy account
   - Go to Domain Settings for sadhanaboard.com
   - Click "Manage DNS"
   - Add the DNS records provided by Netlify:
     - A record pointing to Netlify's IP addresses
     - CNAME record for www (if needed)
5. Enable SSL certificate (Netlify does this automatically)

## Step 7: Configure Subdomain for API (api.sadhanaboard.com)

In your backend hosting provider (e.g., Render, Railway):
1. Set up a custom domain for your backend service as `api.sadhanaboard.com`
2. In GoDaddy DNS management:
   - Add a CNAME record:
     - Name: `api`
     - Value: Your backend hosting provider's domain (provided by Render/Railway/etc.)

## Step 8: Test the Deployment

1. Visit https://sadhanaboard.com
2. Test user registration and login
3. Test API endpoints at https://api.sadhanaboard.com/api
4. Test WebSocket connections
5. Verify database operations

## Troubleshooting

### Common Issues

1. **DNS Propagation**: It may take up to 48 hours for DNS changes to propagate
2. **SSL Certificate**: Netlify automatically provisions SSL certificates, but it may take some time
3. **CORS Errors**: Ensure CORS_ORIGIN is set correctly in the backend
4. **Database Connection**: Verify all Supabase credentials are correct
5. **Environment Variables**: Check that all required environment variables are set in both Netlify and your backend provider

### Monitoring

1. Set up logging in your backend provider
2. Use Netlify analytics to monitor site performance
3. Monitor Supabase database performance and usage

## Maintenance

1. Regularly update dependencies
2. Monitor for security vulnerabilities
3. Backup the Supabase database regularly
4. Review and rotate credentials periodically

## Support

For issues with deployment, contact the development team or refer to the documentation for Netlify, Supabase, and your specific backend hosting provider.