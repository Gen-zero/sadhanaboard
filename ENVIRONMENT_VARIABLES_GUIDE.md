# Environment Variables Guide for SaadhanaBoard

This guide explains all the environment variables used in the SaadhanaBoard application and how to configure them properly for different environments.

## Frontend Environment Variables

### Core Configuration

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

#### DB_USER
- **Description**: PostgreSQL database user
- **Required**: Yes (when not using DATABASE_URL)
- **Default**: `postgres`
- **Example**: `postgres`

#### DB_HOST
- **Description**: PostgreSQL database host
- **Required**: Yes (when not using DATABASE_URL)
- **Default**: `localhost`
- **Example**: `localhost`, `127.0.0.1`, `db.server.com`

#### DB_NAME
- **Description**: PostgreSQL database name
- **Required**: Yes (when not using DATABASE_URL)
- **Default**: `saadhanaboard`
- **Example**: `saadhanaboard`

#### DB_PASSWORD
- **Description**: PostgreSQL database password
- **Required**: Yes
- **Example**: `your_secure_password`

#### DB_PORT
- **Description**: PostgreSQL database port
- **Required**: No
- **Default**: `5432`
- **Example**: `5432`

#### DATABASE_URL
- **Description**: Direct PostgreSQL connection string (alternative to individual DB settings)
- **Required**: No (alternative to individual settings)
- **Example**: `postgresql://postgres:password@localhost:5432/saadhanaboard?sslmode=require`
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
- **Description**: Admin username for backend access
- **Required**: Yes
- **Example**: `admin`

#### ADMIN_EMAIL
- **Description**: Admin email for backend access
- **Required**: Yes
- **Example**: `admin@sadhanaboard.com`

#### ADMIN_PASSWORD
- **Description**: Admin password for backend access
- **Required**: Yes
- **Security**: Private - keep secret!
- **Example**: `your_secure_admin_password`

#### ADMIN_TOKEN_EXPIRES_IN
- **Description**: How long admin JWT tokens should be valid
- **Required**: No
- **Default**: `7d`
- **Example**: `7d`, `24h`, `30m`

### Feature Configuration

#### PGSSL
- **Description**: Whether to use SSL for PostgreSQL connections
- **Required**: No
- **Default**: `false`
- **Development**: `false`
- **Production**: `true` (when using SSL-enabled PostgreSQL)
- **Values**: `true` or `false`