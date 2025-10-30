# Deployment Guide for SaadhanaBoard

This guide provides detailed instructions for deploying the SaadhanaBoard application to production environments.

## Prerequisites

Before deploying, ensure you have:

1. A hosting provider for the backend (e.g., Render, Railway, AWS, DigitalOcean)
2. A hosting provider for the frontend (e.g., Netlify, Vercel, AWS S3)
3. A PostgreSQL database server
4. Domain names for your frontend and backend (optional but recommended)

## Architecture Overview

The SaadhanaBoard application consists of two main components:

1. **Frontend**: A React application that runs in the browser
2. **Backend**: A Node.js/Express server that provides the API and handles business logic

These components can be hosted separately or together, depending on your hosting provider and requirements.

## Step 1: Prepare Your Environment

### Database Setup

1. Set up a PostgreSQL database server
2. Create a database named `saadhanaboard`
3. Note down the database credentials:
   - Host
   - Port
   - Database name
   - Username
   - Password

### Domain Configuration (Optional)

If you plan to use custom domains:
1. Register domain names for your frontend and backend
2. Configure DNS records to point to your hosting providers

## Step 2: Configure Environment Variables

### Frontend Production (.env.production file)
```bash
# API Configuration
# This should point to your backend API server
# If hosting backend separately, use your backend domain
# Example: https://api.sadhanaboard.com/api
VITE_API_BASE_URL=https://api.sadhanaboard.com/api

# Socket base URL for Production
# This should point to your backend WebSocket server
# Example: https://api.sadhanaboard.com
VITE_SOCKET_BASE_URL=https://api.sadhanaboard.com

# When true, the frontend will include credentials (cookies) on requests
VITE_API_USE_CREDENTIALS=true

# Development Configuration (should be false in production)
VITE_DEV_MODE=false

# WebSocket reconnection strategy
VITE_WS_RECONNECT_ATTEMPTS=5
VITE_WS_RECONNECT_DELAY=1000

# Feature-specific debug flags (should be false in production)
VITE_DEBUG_API=false
VITE_DEBUG_AUTH=false
```

### Backend (.env.production file)
```bash
# Database Configuration
DB_USER=your_database_user
DB_HOST=your_database_host
DB_NAME=saadhanaboard
DB_PASSWORD=your_database_password
DB_PORT=5432

# Alternative: Direct Database URL (comment out individual settings above if using this)
# DATABASE_URL=postgresql://user:password@host:port/database

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

# Polling Intervals (in milliseconds)
DASHBOARD_POLL_MS=15000
# How often to poll for BI reports
BI_POLL_MS=20000
# How often to poll for system metrics
SYSTEM_METRICS_POLL_MS=5000

# SSL Configuration (for production)
# Set to true when using HTTPS with PostgreSQL
PGSSL=true
```

## Step 3: Deploy the Backend

The backend can be deployed to various hosting providers. Here are instructions for some popular options:

### Option 1: Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to: `npm install`
4. Set the start command to: `npm start`
5. Add environment variables from your `.env.production` file
6. Set up a PostgreSQL database add-on or use an external database
7. Deploy the service

### Option 2: Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Railway will automatically detect it's a Node.js project
4. Add environment variables from your `.env.production` file
5. Set up a PostgreSQL database plugin or use an external database
6. Deploy the service

### Option 3: DigitalOcean App Platform

1. Create a new app on DigitalOcean App Platform
2. Connect your GitHub repository
3. Select the backend directory
4. Set the run command to: `npm start`
5. Add environment variables from your `.env.production` file
6. Add a PostgreSQL database component
7. Deploy the app

## Step 4: Deploy the Frontend

The frontend can be deployed to various static hosting providers. Here are instructions for some popular options:

### Option 1: Netlify

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set the build command to: `npm run build`
4. Set the publish directory to: `dist`
5. Add environment variables from your `.env.production` file
6. Deploy the site

### Option 2: Vercel

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the build command to: `npm run build`
4. Set the output directory to: `dist`
5. Add environment variables from your `.env.production` file
6. Deploy the project

## Step 5: Initialize the Database

After deploying the backend, you need to initialize the database schema:

1. SSH into your backend server or use the hosting provider's console
2. Run the database initialization script:
   ```bash
   cd backend
   node utils/initDb.js
   ```

Alternatively, you can run this locally if your database is accessible from your local machine.

## Step 6: Set up Admin Account

Create an admin account for managing the application:

1. SSH into your backend server or use the hosting provider's console
2. Run the admin setup script:
   ```bash
   cd backend
   npm run admin:setup
   ```

## Step 7: Configure SSL (Recommended)

For production deployments, it's highly recommended to use HTTPS:

1. Obtain SSL certificates for your domains (Let's Encrypt is a good free option)
2. Configure your hosting providers to use the SSL certificates
3. Update your environment variables to use HTTPS URLs
4. Set `PGSSL=true` in your backend environment variables if using SSL with PostgreSQL

## Step 8: Test the Deployment

After deployment, test the following:

1. Access the frontend at your domain
2. Try to register a new user
3. Try to log in with the new user
4. Test database operations (create, read, update, delete)
5. Verify that all features work as expected
6. Test the admin panel with the admin credentials

## Monitoring and Maintenance

### Logs

Set up log monitoring for both frontend and backend:

- Frontend: Check browser console and network tab for errors
- Backend: Monitor application logs through your hosting provider's interface

### Backups

Set up regular database backups:

- Use your hosting provider's backup features
- Or set up automated backup scripts

### Updates

To update the application:

1. Pull the latest code from your repository
2. Rebuild and redeploy both frontend and backend
3. Run database migrations if needed

## Troubleshooting

### Common Issues

1. **Connection Errors**: 
   - Verify all database credentials are correct
   - Check that your database is accessible from your backend server
   - Ensure your firewall settings allow connections

2. **CORS Issues**: 
   - Verify that your domain is added to the CORS_ORIGIN setting
   - Check additional redirect URLs
   - Ensure your frontend and backend URLs are correctly configured

3. **Auth Errors**: 
   - Ensure JWT_SECRET is set and is the same in both environments
   - Check that your site URLs are correctly configured
   - Verify redirect URLs are properly set

4. **Database Issues**: 
   - Ensure the database schema is properly initialized
   - Check that all required tables exist
   - Verify that database permissions are correctly set

### Getting Help

If you encounter issues that you can't resolve:

1. Check the application logs for error messages
2. Review this documentation
3. File an issue on the GitHub repository
4. Contact the development team for support