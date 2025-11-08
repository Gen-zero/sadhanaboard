# Production Deployment Guide for SadhanaBoard

This guide outlines the configuration and deployment process for SadhanaBoard to production with the domain www.sadhanaboard.com.

## Environment Configuration

### Backend Environment (.env.production)
The backend uses the following environment variables for production:

- `NODE_ENV=production`
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `PORT=3004`
- `BACKEND_URL=https://api.sadhanaboard.com`
- `CORS_ORIGIN=https://www.sadhanaboard.com`
- Secure JWT secret
- Production admin credentials

### Frontend Environment (.env.production)
The frontend uses the following environment variables for production:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_BASE_URL=https://api.sadhanaboard.com/api`
- `VITE_SOCKET_BASE_URL=https://api.sadhanaboard.com`
- `VITE_DEV_MODE=false`
- Debug flags set to false

## Domain Configuration

### Primary Domain
- Frontend: https://www.sadhanaboard.com
- Backend API: https://api.sadhanaboard.com

### CORS Configuration
CORS is configured to allow requests only from https://www.sadhanaboard.com to ensure security.

## Deployment Platforms

### Vercel (Frontend)
- Builds the frontend using `npm run build`
- Serves static files from the `dist` directory
- Routes API calls to the backend via proxy
- Configured with proper security headers

### Netlify (Alternative Frontend)
- Similar configuration to Vercel
- Uses the same build process and routing

### Backend Deployment
The backend should be deployed to a Node.js hosting service (e.g., Render, Railway, or VPS) with the following considerations:

1. Environment variables properly configured
2. SSL/TLS enabled (HTTPS)
3. Proper firewall settings
4. Supabase database connectivity
5. WebSocket support enabled

## Security Considerations

1. All communication uses HTTPS
2. CORS is restricted to the production domain
3. Content Security Policy implemented
4. Security headers configured
5. Secure JWT secret rotation recommended
6. Admin credentials should be strong and rotated regularly

## Build Process

1. Frontend is built with `npm run build`
2. Backend runs with `npm start` or `node server.js`
3. Environment variables are loaded from .env.production files

## Monitoring and Health Checks

- `/health` endpoint for overall system health
- `/api/health/db` endpoint for database connectivity
- Logging configured for both frontend and backend
- Error tracking and monitoring recommended

## Deployment Steps

1. Configure environment variables in deployment platform
2. Set up domain DNS records
3. Deploy backend to hosting service
4. Deploy frontend to Vercel/Netlify
5. Verify API connectivity
6. Test all functionality
7. Monitor for errors