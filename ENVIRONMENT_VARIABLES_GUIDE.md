# Environment Variables Guide

## Overview
This guide explains how to use the different environment files in the SaadhanaBoard project for both development and production environments.

## Environment Files

### Frontend Environment Files

1. **[.env](file:///D:/sadhanaboard/.env)** (Default Development)
   - Used for local development by default
   - Configured to work with localhost backend
   - Supabase connection remains the same as production
   - Debug flags enabled for development

2. **[.env.development](file:///D:/sadhanaboard/.env.development)**
   - Alternative development configuration
   - Explicitly configured for local development
   - Same Supabase credentials as production

3. **[.env.production](file:///D:/sadhanaboard/.env.production)**
   - Production configuration for Netlify deployment
   - Points to production backend URLs
   - Debug flags disabled for security

### Backend Environment Files

1. **[backend/.env](file:///D:/sadhanaboard/backend/.env)** (Default Development)
   - Used for local development by default
   - Configured to work on localhost:3004
   - Supabase connection remains the same as production
   - CORS configured for local frontend development

2. **[backend/.env.development](file:///D:/sadhanaboard/backend/.env.development)**
   - Alternative development configuration
   - Explicitly configured for local development
   - Same Supabase credentials as production

3. **[backend/.env.production](file:///D:/sadhanaboard/backend/.env.production)**
   - Production configuration for backend deployment
   - Points to production URLs
   - CORS configured for production domain

## How to Use

### For Local Development

1. **Frontend Development**:
   ```bash
   # The .env file is automatically used
   npm run dev
   ```

2. **Backend Development**:
   ```bash
   # Navigate to backend directory
   cd backend
   
   # The .env file is automatically used
   npm run dev
   ```

3. **Full Stack Development**:
   ```bash
   # In one terminal, start the backend
   cd backend
   npm run dev
   
   # In another terminal, start the frontend
   npm run dev
   ```

### For Production Deployment

1. **Frontend (Netlify)**:
   - Netlify automatically uses [.env.production](file:///D:/sadhanaboard/.env.production) when deploying
   - Ensure environment variables are set in Netlify dashboard

2. **Backend (Hosting Provider)**:
   - Set environment variables in your hosting provider's dashboard
   - Or ensure [.env.production](file:///D:/sadhanaboard/backend/.env.production) is used

## Key Points

### Supabase Connection
- All environment files maintain the same Supabase connection credentials
- This ensures data consistency between development and production
- Never commit actual Supabase service keys to version control in real projects

### CORS Configuration
- Development: Allows localhost origins (8080, 5173)
- Production: Restricts to production domain only

### API URLs
- Development: Points to localhost:3004
- Production: Points to api.sadhanaboard.com

## Security Notes

1. **Never commit sensitive credentials** to version control
2. **Use different keys for development and production** in real applications
3. **Environment files are gitignored** in production applications
4. **Use secret management** in production deployments

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure CORS_ORIGIN matches your frontend URL
   - Check that the backend is running on the expected port

2. **API Connection Issues**:
   - Verify VITE_API_BASE_URL points to the correct backend
   - Check that the backend server is running

3. **Supabase Connection Issues**:
   - Verify SUPABASE_URL and keys are correct
   - Check network connectivity to Supabase

### Environment Not Loading

1. **Check file names** - ensure they match expected names exactly
2. **Restart development servers** after changing environment files
3. **Check for syntax errors** in environment files