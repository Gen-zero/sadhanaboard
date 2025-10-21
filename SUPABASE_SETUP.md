# Supabase Setup Guide for SaadhanaBoard

This guide provides detailed instructions for setting up Supabase for the SaadhanaBoard application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Enter project details:
   - Name: SaadhanaBoard
   - Database password: Create a strong password (at least 12 characters with mixed case, numbers, and symbols)
   - Region: Choose the region closest to your users for best performance
4. Click "Create new project"
5. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Project Credentials

Once your project is created, navigate to the project dashboard and find your credentials:

1. In the left sidebar, click "Settings" (gear icon)
2. Click "API" in the settings menu
3. Note down the following credentials:
   - **Project URL**: The URL shown at the top of the API page (e.g., `https://your-project-ref.supabase.co`)
   - **Anonymous Key**: The `anon` `public` key (safe for frontend use, looks like a long string of characters)
   - **Service Role Key**: The `service_role` `secret` key (keep this secret! Never expose it in frontend code)

**Important**: 
- The Anonymous Key is safe to use in frontend applications
- The Service Role Key has full access to your project and should only be used in backend applications
- Never commit these keys to version control

## Step 3: Enable Auth Providers

1. In the left sidebar, go to "Authentication" > "Providers"
2. Enable the Email provider by clicking on it and toggling the switch to "Active"
3. Optionally enable other providers (Google, GitHub, etc.) based on your needs
4. For each provider you enable, configure the required settings (client IDs, secrets, etc.)

## Step 4: Configure Auth Settings

1. Go to "Authentication" > "Settings" in the left sidebar
2. Update the Site URL to your Netlify domain:
   - For production: `https://sadhanaboard.com`
   - For staging: `https://staging.sadhanaboard.com` or your Netlify preview URL
3. Add your domain to Additional Redirect URLs (separate multiple URLs with commas)
4. Configure other settings as needed for your application

## Step 5: Set up Database Schema

You can set up the database schema in two ways:

### Option 1: Run the Migration Script (Recommended)

1. Update your local .env file with Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_from_step_2
   VITE_SUPABASE_ANON_KEY=your_anon_key_from_step_2
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_step_2
   ```
2. Run the migration script:
   ```bash
   cd backend
   npm run migrate:supabase
   ```

### Option 2: Manual Setup

1. Go to "Table Editor" in the Supabase dashboard
2. Create tables using the SQL schema from `backend/utils/initDb.js`

## Step 6: Configure Row Level Security (RLS)

For each table, you'll need to set up RLS policies. Here are examples for key tables:

### Users Table
```sql
-- Enable RLS
alter table users enable row level security;

-- Users can view their own profile
create policy "Users can view own profile" on users
  for select using (id = auth.uid());

-- Users can update their own profile
create policy "Users can update own profile" on users
  for update using (id = auth.uid());
```

### Profiles Table
```sql
-- Enable RLS
alter table profiles enable row level security;

-- Profiles are viewable by everyone
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);

-- Users can insert their own profile
create policy "Users can insert own profile" on profiles
  for insert with check (id = auth.uid());

-- Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (id = auth.uid());
```

### Spiritual Books Table
```sql
-- Enable RLS
alter table spiritual_books enable row level security;

-- Users can view their own books
create policy "Users can view own books" on spiritual_books
  for select using (user_id = auth.uid());

-- Users can insert their own books
create policy "Users can insert own books" on spiritual_books
  for insert with check (user_id = auth.uid());

-- Users can update their own books
create policy "Users can update own books" on spiritual_books
  for update using (user_id = auth.uid());

-- Users can delete their own books
create policy "Users can delete own books" on spiritual_books
  for delete using (user_id = auth.uid());
```

Apply similar policies to other tables as needed.

## Step 7: Set up Storage (if needed)

If your application uses file storage:

1. Go to "Storage" in the Supabase dashboard
2. Create buckets for different types of files (e.g., "avatars", "books", "themes")
3. Set up access policies for each bucket
4. Configure CORS settings if needed

## Step 8: Configure Environment Variables

Update your environment variables with the Supabase credentials:

### Frontend (.env)
```bash
VITE_SUPABASE_URL=your_supabase_project_url  # From Step 2
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  # From Step 2
```

### Backend (.env.production)
```bash
SUPABASE_URL=your_supabase_project_url  # From Step 2
SUPABASE_ANON_KEY=your_supabase_anon_key  # From Step 2
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # From Step 2
```

## Step 9: Test the Connection

1. Restart your development server
2. Test authentication:
   - Try to register a new user
   - Try to log in with the new user
3. Test database operations:
   - Create a new item (book, sadhana, etc.)
   - Retrieve the item
   - Update the item
   - Delete the item
4. Verify that all features work as expected

## Troubleshooting

### Common Issues

1. **Connection Errors**: 
   - Verify all credentials are correct
   - Check that you're using the right keys (anon vs service_role)
   - Ensure your Supabase project is not paused

2. **RLS Errors**: 
   - Check that policies are properly configured
   - Verify that auth.uid() is working correctly
   - Test queries in the SQL editor

3. **Auth Errors**: 
   - Ensure auth providers are enabled and configured correctly
   - Check that your site URLs are correctly configured
   - Verify redirect URLs are properly set

4. **CORS Issues**: 
   - Verify that your domain is added to the Supabase settings
   - Check additional redirect URLs
   - Ensure your frontend and backend URLs are correctly configured

### Useful Supabase SQL Commands

```sql
-- Check current user
select auth.uid();

-- View all tables
select * from pg_tables where schemaname = 'public';

-- View RLS status for tables
select tablename, rowsecurity from pg_tables where schemaname = 'public';

-- Disable RLS for testing (do not do this in production!)
alter table users disable row level security;
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Supabase JavaScript Client Library](https://supabase.com/docs/reference/javascript/start)