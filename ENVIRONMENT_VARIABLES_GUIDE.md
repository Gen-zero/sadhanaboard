# Environment Variables Guide for SaadhanaBoard

This guide explains all the environment variables used in the SaadhanaBoard application and how to configure them properly for different environments.

## Frontend Environment Variables

### Core Configuration

#### VITE_SUPABASE_URL
- **Description**: Your Supabase project URL
- **Required**: Yes
- **Example**: `https://your-project-ref.supabase.co`
- **Security**: Safe for frontend (public)

#### VITE_SUPABASE_ANON_KEY
- **Description**: Your Supabase anonymous key
- **Required**: Yes
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Security**: Safe for frontend (public)

#### VITE_API_BASE_URL
- **Description**: Base URL for backend API endpoints
- **Required**: Yes
- **Development**: `http://localhost:3004/api`
- **Production**: `https://api.sadhanaboard.com/api`

#### VITE_SOCKET_BASE_URL
- **Description**: Base URL for WebSocket connections
- **Required**: Yes
- **Development**: `http://localhost:3004`
- **Production**: `https://api.sadhanaboard.com`

### Feature Configuration

#### VITE_API_USE_CREDENTIALS
- **Description**: Whether to include credentials (cookies) in API requests
- **Required**: No
- **Default**: `true`
- **Values**: `true` or `false`

#### VITE_DEV_MODE
- **Description**: Enable development-specific features
- **Required**: No
- **Development**: `true`
- **Production**: `false`

#### WebSocket Configuration
- **VITE_WS_RECONNECT_ATTEMPTS**: Number of WebSocket reconnection attempts (default: 5)
- **VITE_WS_RECONNECT_DELAY**: Delay between reconnection attempts in ms (default: 1000)

#### Debug Flags
- **VITE_DEBUG_API**: Enable API debugging (default: false)
- **VITE_DEBUG_AUTH**: Enable authentication debugging (default: false)

## Backend Environment Variables

### Database Configuration

#### SUPABASE_URL
- **Description**: Your Supabase project URL
- **Required**: Yes
- **Example**: `https://your-project-ref.supabase.co`
- **Security**: Safe for backend

#### SUPABASE_ANON_KEY
- **Description**: Your Supabase anonymous key
- **Required**: Yes
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Security**: Safe for backend

#### SUPABASE_SERVICE_ROLE_KEY
- **Description**: Your Supabase service role key
- **Required**: Yes
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Security**: Private - keep secret!

#### DATABASE_URL
- **Description**: Direct PostgreSQL connection string
- **Required**: Yes (alternative to individual DB settings)
- **Example**: `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres?sslmode=require`
- **Security**: Private - keep secret!

### Server Configuration

#### PORT
- **Description**: Port for the Node.js server to listen on
- **Required**: Yes
- **Default**: `3004`

#### BACKEND_URL
- **Description**: Full URL where the backend is accessible
- **Required**: Yes
- **Development**: `http://localhost:3004`
- **Production**: `https://api.sadhanaboard.com`

### Security Configuration

#### CORS_ORIGIN
- **Description**: Allowed origins for CORS requests
- **Required**: Yes
- **Development**: `http://localhost:8080,http://localhost:5173`
- **Production**: `https://sadhanaboard.com`

#### JWT_SECRET
- **Description**: Secret key for signing JWT tokens
- **Required**: Yes
- **Development**: Can use a simple string for testing
- **Production**: Must be a secure random string (at least 32 characters)
- **Generation**: `openssl rand -base64 32`

### Admin Configuration

#### ADMIN_USERNAME
- **Description**: Username for the admin user
- **Required**: Yes
- **Example**: `admin`

#### ADMIN_EMAIL
- **Description**: Email for the admin user
- **Required**: Yes
- **Example**: `admin@sadhanaboard.com`

#### ADMIN_PASSWORD
- **Description**: Password for the admin user
- **Required**: Yes
- **Security**: Private - should be strong and changed for production

#### ADMIN_TOKEN_EXPIRES_IN
- **Description**: How long admin tokens should be valid
- **Required**: No
- **Default**: `7d` (7 days)

### Session Configuration

#### ADMIN_SESSION_TIMEOUT_MINUTES
- **Description**: How long admin sessions last before timeout
- **Required**: No
- **Default**: `60` (1 hour)

### Polling Configuration

#### DASHBOARD_POLL_MS
- **Description**: How often to poll for dashboard updates
- **Required**: No
- **Default**: `15000` (15 seconds)

#### BI_POLL_MS
- **Description**: How often to poll for BI reports
- **Required**: No
- **Default**: `20000` (20 seconds)

#### SYSTEM_METRICS_POLL_MS
- **Description**: How often to poll for system metrics
- **Required**: No
- **Default**: `5000` (5 seconds)

### SSL Configuration

#### PGSSL
- **Description**: Whether to use SSL for PostgreSQL connections
- **Required**: No
- **Development**: `false`
- **Production**: `true`

### Admin Security Settings

#### ADMIN_MAX_LOGIN_ATTEMPTS
- **Description**: Maximum failed login attempts before lockout
- **Required**: No
- **Default**: `5`

#### ADMIN_LOCK_MINUTES
- **Description**: How long accounts are locked after failed attempts
- **Required**: No
- **Default**: `30`

#### ADMIN_AUTO_UNLOCK
- **Description**: Whether accounts automatically unlock after lockout period
- **Required**: No
- **Default**: `true`

## Environment Files

### .env.example
Template file showing all available environment variables with placeholder values. Never contains real secrets.

### .env.development
Used when running locally in development mode. Contains development-specific values.

### .env.production
Used when deploying to production. Contains production-specific values.

## Best Practices

### Security
1. Never commit real secrets to source control
2. Use .env.example as a template with placeholder values
3. Generate secure random strings for JWT_SECRET in production
4. Use strong, unique passwords for admin accounts
5. Rotate credentials regularly
6. Use different credentials for development and production

### Deployment
1. Set environment variables through your hosting platform's dashboard
2. Use the correct environment file for each deployment target
3. Verify all URLs and domains match your deployment configuration
4. Test database connections before deploying
5. Ensure CORS settings are correct for your domain

### Verification
1. Test authentication flows in each environment
2. Verify API endpoints are accessible
3. Confirm WebSocket connections work
4. Check database operations function correctly
5. Validate all environment-specific features work as expected

## Troubleshooting

### Common Issues
1. **Connection Errors**: Verify all credentials and URLs are correct
2. **CORS Errors**: Check that CORS_ORIGIN matches your frontend domain
3. **Authentication Failures**: Ensure JWT_SECRET is consistent and correct
4. **Database Issues**: Verify DATABASE_URL or individual DB settings
5. **WebSocket Problems**: Confirm VITE_SOCKET_BASE_URL is correct

### Environment-Specific Issues
- **Development**: Check that localhost URLs and ports are correct
- **Production**: Verify all domains and HTTPS settings
- **Staging**: Ensure staging-specific values are used