-- ============================================================================
-- SaadhanaBoard Database Setup Guide
-- ============================================================================
-- This guide explains how to set up the SaadhanaBoard database in Supabase
--
-- Created: 2025-01-07
-- ============================================================================

## Overview

The SaadhanaBoard database schema consists of three main SQL files:

1. **supabase_complete_schema.sql** - Main database schema with all tables
2. **supabase_rls_policies.sql** - Row Level Security policies for authentication
3. **SETUP_INSTRUCTIONS.md** - This file (setup and configuration guide)

## Quick Start

### Step 1: Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Choose your region and database password
3. Wait for the project to be initialized

### Step 2: Access SQL Editor

1. In Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"

### Step 3: Execute Main Schema

1. Open `supabase_complete_schema.sql`
2. Copy the entire content
3. Paste into the SQL editor
4. Click "Run" to execute

This will create all 30+ tables with proper:
- Primary keys and constraints
- Foreign key relationships
- Indexes for performance
- Default values and CHECK constraints
- Comments and documentation

### Step 4: Apply RLS Policies (Optional)

If you're using Supabase Auth:

1. Open `supabase_rls_policies.sql`
2. Copy the entire content
3. Paste into a new SQL query
4. Click "Run" to execute

This enables Row Level Security on relevant tables.

## Database Tables

### Core Authentication (3 tables)
- **users** - User accounts with email and password
- **profiles** - Extended user profiles with spiritual information
- **waitlist** - Join waiting list feature

### Spiritual Books (4 tables)
- **spiritual_books** - Main book/text library
- **book_progress** - Reading progress tracking
- **book_bookmarks** - User bookmarks within books
- **book_annotations** - User notes and annotations

### Sadhana Practices (6 tables)
- **sadhanas** - Spiritual practice routines
- **sadhana_progress** - Daily progress tracking
- **shared_sadhanas** - Sharing functionality
- **sadhana_likes** - Community engagement (likes)
- **sadhana_comments** - Community engagement (comments)

### Groups & Community (4 tables)
- **groups** - Community groups for collective practice
- **group_members** - Group membership and roles
- **group_activity** - Activity tracking in groups
- **user_followers** - Social following relationships
- **community_activity** - General activity feed

### CMS (Content Management) (6 tables)
- **cms_themes** - UI theme definitions
- **cms_templates** - Reusable content templates
- **cms_assets** - Digital asset management
- **cms_asset_variants** - Asset variations/formats
- **cms_version_history** - Content versioning
- **cms_audit_trail** - Audit logging

### Admin & Settings (2 tables)
- **admin_details** - Administrator accounts
- **admin_integrations** - Third-party integrations (Google Sheets, etc.)

### Business Intelligence (5 tables)
- **report_templates** - BI report templates
- **scheduled_reports** - Scheduled report generation
- **report_executions** - Report execution history
- **spiritual_insights** - AI-generated insights
- **report_shares** - Report sharing and access control

## Key Features

### Performance
- ✅ Optimized indexes on frequently queried columns
- ✅ Foreign key constraints for data integrity
- ✅ Check constraints for enum-like fields
- ✅ Unique constraints where appropriate
- ✅ JSONB support for flexible structured data

### Security
- ✅ Row Level Security (RLS) policies for user data
- ✅ UUID primary keys for users (cannot be guessed)
- ✅ Hashed passwords in auth
- ✅ Privacy levels for shared content
- ✅ Role-based access control for groups

### Data Integrity
- ✅ Foreign key relationships with CASCADE/SET NULL
- ✅ CHECK constraints for valid enum values
- ✅ UNIQUE constraints where needed
- ✅ NOT NULL constraints for required fields
- ✅ Proper timezone handling (all timestamps in UTC)

### Scalability
- ✅ Efficient indexes for pagination
- ✅ JSONB columns for flexible metadata
- ✅ Text arrays for tagging systems
- ✅ Views for common queries
- ✅ Helper functions for frequent operations

## Configuration

### Environment Variables

Set these in your .env file:

```
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:6543/postgres
```

### Database Connection

The application uses Supabase's pooled connection on port 6543:

```
postgresql://postgres:[password]@db.[project-id].supabase.co:6543/postgres?sslmode=require
```

### Migrations

To run migrations:

1. Place migration files in `backend/migrations/`
2. Use the provided migration runner script
3. Or execute directly in Supabase SQL editor

## Using the Database

### From Backend Code

```javascript
const db = require('../config/db');

// Query example
const result = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Insert example
const inserted = await db.query(
  'INSERT INTO sadhanas (user_id, title) VALUES ($1, $2) RETURNING *',
  [userId, title]
);
```

### Query Patterns

```sql
-- Pagination
SELECT * FROM books LIMIT 20 OFFSET 0;

-- Filtering by array
SELECT * FROM spiritual_books 
WHERE traditions && ARRAY['hinduism', 'yoga'];

-- Full-text search
SELECT * FROM spiritual_books 
WHERE search_vector @@ plainto_tsquery('english', 'meditation');

-- JSON filtering
SELECT * FROM admin_integrations 
WHERE metadata ->> 'provider' = 'google-sheets';
```

## Maintenance

### Backup

Supabase automatically backs up your data. Access backups in:
Project Settings → Backups

### Monitoring

Monitor database performance in:
Project Settings → Database → Performance

### Optimization

Key optimization tips:

1. **Add indexes** for frequently filtered columns
2. **Use EXPLAIN** to analyze slow queries
3. **Archive old data** to maintain performance
4. **Update statistics** regularly with ANALYZE

```sql
-- Analyze query plan
EXPLAIN ANALYZE SELECT * FROM spiritual_books WHERE user_id = '...';

-- Update table statistics
ANALYZE spiritual_books;
```

## Troubleshooting

### Connection Issues

Check DATABASE_URL format:
```
postgresql://postgres:PASSWORD@db.PROJECTID.supabase.co:6543/postgres?sslmode=require
```

### Port Issues

- Standard port: 5432
- Pooled port (recommended): 6543
- Use 6543 for better connection pooling

### Migrations Failed

1. Check Supabase SQL editor for errors
2. Verify all dependencies exist
3. Drop table and recreate if necessary:

```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

## Advanced Features

### Custom Functions

The schema includes helper functions:

```sql
-- Get follower count
SELECT get_follower_count(user_id);

-- Check if user follows another
SELECT is_following(follower_id, followed_id);

-- Check group management permission
SELECT can_user_manage_group(group_id, user_id);
```

### Views

```sql
-- Get recent report executions
SELECT * FROM recent_report_executions;
```

### Full-Text Search

Books can be searched using full-text search:

```sql
SELECT * FROM spiritual_books
WHERE search_vector @@ plainto_tsquery('english', 'krishna');
```

## Best Practices

1. **Always use parameterized queries** to prevent SQL injection
2. **Use UUIDs** for user IDs (not auto-increment integers)
3. **Set timezone awareness** - store timestamps in UTC
4. **Index strategically** - don't index everything
5. **Use RLS policies** for client-side data protection
6. **Keep foreign keys** for data integrity
7. **Document changes** - add comments to tables
8. **Test migrations** - always test on dev first
9. **Monitor performance** - watch slow queries
10. **Plan scaling** - think about sharding/partitioning

## Support Resources

### Supabase Documentation
- https://supabase.com/docs
- https://supabase.com/docs/guides/auth/overview
- https://supabase.com/docs/guides/database/postgres/quickstart

### PostgreSQL Documentation
- https://www.postgresql.org/docs/
- https://www.postgresql.org/docs/current/sql-syntax.html

### Common Issues
Check Supabase Status Page: https://status.supabase.com

## Next Steps

1. ✅ Create the schema using `supabase_complete_schema.sql`
2. ✅ Apply RLS policies using `supabase_rls_policies.sql`
3. ✅ Set up environment variables in `.env`
4. ✅ Test database connection with `npm run test:db`
5. ✅ Run application migrations if needed
6. ✅ Test API endpoints with sample data
7. ✅ Set up backups and monitoring

## File Locations

All SQL files are located in:
```
backend/
├── supabase_complete_schema.sql
├── supabase_rls_policies.sql
├── supabase_setup_instructions.md (this file)
└── migrations/
    ├── 0001_add_registry_id_to_cms_themes.sql
    ├── 0002_add_time_spent_minutes_to_book_progress.sql
    ├── 0003_add_storage_columns_to_spiritual_books.sql
    ├── 0004_add_deleted_at_to_spiritual_books.sql
    ├── 0005_add_google_sheets_columns_to_integrations.sql
    └── create_bi_tables.js
```

## Version History

- **2025-01-07** - Initial schema creation with 30+ tables
- Includes full documentation and RLS policies

---

For questions or issues, refer to the inline comments in the SQL files or
check the Supabase documentation.
