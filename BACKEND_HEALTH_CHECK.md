# Backend Health Check Report

Generated: 2025-11-02T19:55:14.559Z

**Summary:** 1 Errors | 0 Warnings

## Environment Configuration

- ✓ Passed: 7

### ✓ DATABASE_URL configured

### ✓ PORT configured

### ✓ JWT_SECRET configured

### ✓ SUPABASE_URL configured

### ✓ SUPABASE_ANON_KEY configured

### ✓ JWT_SECRET strength

### ✓ NODE_ENV configured

Mode: development

## Database Connection

- ✓ Passed: 1
- ✗ Failed: 1

### ✗ PostgreSQL connection

Failed to establish database connection

**Details:** getaddrinfo ENOTFOUND db.bhasogcwwjsjzjkckzeh.supabase.co

### ✓ Connection pool status

Total: 0 | Idle: 0 | Waiting: 0

## File Structure

- ✓ Passed: 10

### ✓ config/ directory

Contains 2 files

### ✓ controllers/ directory

Contains 10 files

### ✓ middleware/ directory

Contains 6 files

### ✓ routes/ directory

Contains 11 files

### ✓ services/ directory

Contains 46 files

### ✓ models/ directory

Contains 3 files

### ✓ utils/ directory

Contains 8 files

### ✓ package.json exists

Size: 2319 bytes

### ✓ config/db.js exists

Size: 2235 bytes

### ✓ config/db-supabase.js exists

Size: 2032 bytes

## Dependencies

- ✓ Passed: 7

### ✓ package.json readable

23 dependencies, 7 dev dependencies

### ✓ express installed

Version: ^4.21.2

### ✓ pg installed

Version: ^8.12.0

### ✓ jsonwebtoken installed

Version: ^9.0.2

### ✓ bcrypt installed

Version: ^5.1.1

### ✓ cors installed

Version: ^2.8.5

### ✓ dotenv installed

Version: ^16.6.1

## Routes Configuration

- ✓ Passed: 12

### ✓ Route files found

11 route files

### ✓ routes/auth.js

### ✓ routes/biReports.js

### ✓ routes/bookReading.js

### ✓ routes/books.js

### ✓ routes/cms.js

### ✓ routes/csvExport.js

### ✓ routes/googleSheets.js

### ✓ routes/groups.js

### ✓ routes/profile.js

### ✓ routes/sadhanas.js

### ✓ routes/settings.js

## Middleware

- ✓ Passed: 2

### ✓ auth.js

Size: 794 bytes

### ✓ errorHandler.js

Size: 3836 bytes

## Services

- ✓ Passed: 3

### ✓ Service files count

46 service files

### ✓ authService.js

### ✓ adminAuthService.js

## Controllers

- ✓ Passed: 2

### ✓ Controller files count

10 controller files

### ✓ authController.js

## Server Setup

- ✓ Passed: 2

### ✓ server.js initialization

### ✓ .env file exists

