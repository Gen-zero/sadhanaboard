# SaadhanaBoard — Supabase Migration Guide

This document is a comprehensive migration guide for moving SaadhanaBoard from its current Node.js/Express + self-hosted PostgreSQL architecture to a Supabase-oriented architecture (Supabase Auth, Supabase Realtime, Supabase Storage, Edge Functions and RLS).

IMPORTANT: This guide is intentionally prescriptive and intended to be executed in phases so you can run the old backend and the new Supabase-enabled frontend in parallel while migrating.

---

## Executive summary

- Current architecture: Node.js/Express backend with PostgreSQL (raw queries), Socket.IO real-time features, local filesystem uploads and custom JWT auth.
- Target architecture: Supabase (Postgres + RLS + Realtime + Storage) with Supabase Auth for authentication, Supabase Storage for uploads, Realtime for live features, and Edge Functions for business logic that must run server-side.
- Key benefits: fewer servers to manage, built-in auth/session management, first-class Realtime and Storage, RLS security, faster iteration using Supabase CLI and Edge Functions.
- Estimated timeline: 6–8 weeks for full migration with a small team (1–3 engineers) working incrementally.
- Risk: Data migration, auth mapping, and real-time parity are the main risks. Mitigation: phased migration, parallel operation, and comprehensive testing.

---

## Prerequisites

1. Supabase Project Setup
   - Create a new Supabase project at https://supabase.com and note the project URL and anon/service keys.
   - Install Supabase CLI: `npm install -g supabase`
   - Link local project: `supabase link --project-ref <project-id>`

2. Environment configuration
   - Add Supabase credentials to `.env` (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, etc.)
   - Consider a `.env.staging` and `.env.production` for staging and prod

3. Required tools
   - Supabase CLI
   - psql/pg_dump or pgcli for inspection
   - Node.js + npm for migration scripts
   - Postman/Insomnia for testing

---

## Migration phases (overview)

1. Database schema migration (apply SQL migrations / reconcile current schema)
2. Authentication migration (Supabase Auth + user migration)
3. File storage migration (Supabase Storage + file migration scripts)
4. API layer migration (direct Supabase queries + Edge Functions)
5. Real-time features migration (Supabase Realtime)
6. Admin panel migration (RLS + admin role + Realtime)
7. Testing & validation (unit, integration, security and UAT)
8. Deployment & cutover (parallel run, canary, final cutover and rollback)

Each phase includes concrete steps, AI prompts, and verification suggestions.

---

## Phase 1 — Database schema migration

Goal: Reconcile the current database schema with Supabase and enable Row Level Security (RLS).

1. Review existing migrations:
   - Inspect `supabase/migrations/` and confirm they represent the expected schema.
   - Compare against the live database: `pg_dump --schema-only` or `pg_dump -s`.

2. Apply migrations to Supabase:
```bash
# Push local migrations to Supabase
supabase db push
# Or apply migrations individually
supabase migration up
```

3. Export current schema for comparison:
```bash
pg_dump -h localhost -U postgres -d saadhanaboard --schema-only > current_schema.sql
```

4. Reconcile and create new migrations for missing elements, then apply.

5. Enable RLS and create policies:
   - Enable RLS on user-facing tables and create policies to allow users only to access their own rows where appropriate.
   - Example policies: users can read/update their own profile, sadhanas are user-scoped, public content remains readable.

AI prompts for Phase 1 (examples):

```
I have a Supabase database with the following tables: [list tables].
Generate Row Level Security policies for:
- Users: users can read/update only their own rows
- Sadhanas: users can CRUD their own sadhanas, read public shared sadhanas
- Books: all users can read, only authenticated users can create
- Admin: only admin role can access
Provide SQL to enable RLS and create these policies.
```

Verification:
- Confirm tables are present in Supabase dashboard
- Run sample queries as unauthenticated/authenticated/admin users to verify policies

---

## Phase 2 — Authentication migration

Goal: Replace custom JWT auth with Supabase Auth and migrate users.

1. Enable Supabase Auth in the dashboard. Configure providers, email templates, and redirect URLs.
2. Export user accounts and map fields to Supabase Auth. If passwords are hashed with a non-compatible algorithm, set temporary passwords and force password reset.
3. Use Supabase Admin API (service key) to create users while preserving UUIDs where possible.
4. Update frontend auth wrapper:
   - Create `src/lib/supabase.ts` (or `supabase-client.ts`) to initialize the Supabase client.
   - Replace `src/lib/auth-context.tsx` with a Supabase-based context that listens to session changes.
5. Update API calls: remove manual JWT management and use Supabase session tokens.
6. Implement admin role handling via metadata or a `user_roles` table.

AI prompts for Phase 2 (examples):

```
Create a Supabase client configuration file for a React app with TypeScript.
Requirements:
- Auth persistence
- Automatic session refresh
- Type-safe exports
Provide src/lib/supabase.ts
```

Verification:
- Register/login flows work
- Session persists across reloads
- Admin users have expected metadata/role

---

## Phase 3 — File storage migration

Goal: Move local filesystem uploads to Supabase Storage buckets and update database references.

1. Create Supabase storage buckets (books, cms, avatars, uploads) and configure public/private as required.
2. Create storage policies for each bucket (public read for avatars, authenticated read for books, admin-only for cms, etc.).
3. Create and run a Node migration script:
   - Read files from `backend/uploads/`
   - Upload to matching Supabase bucket
   - Update database references (e.g., `books.file_path` -> storage path or signed URL)
   - Log progress and handle retries
4. Update upload handlers to upload directly to Supabase Storage (Edge Function or client-side signed uploads depending on the use-case).

AI prompts for Phase 3 (examples):

```
Create a Node.js script to migrate files from local storage to Supabase Storage.
- Source: backend/uploads
- Target buckets: books, cms, avatars
- Update DB references
- Provide batched uploads, retries, and progress reporting
```

Verification:
- Files accessible via Supabase signed URLs
- Database references updated
- Old files backed up

---

## Phase 4 — API layer migration

Goal: Move simple CRUD to direct Supabase queries and complex business logic to Edge Functions.

1. Plan the migration of controllers -> direct queries or Edge Functions.
2. Create `src/lib/supabase-client.ts` (typed client) and helper functions.
3. For simple controllers (profile, settings, sadhanas), replace frontend API calls with direct Supabase queries and remove corresponding Express routes once verified.
4. For complex services (analytics, exports, payment, integrations), implement Edge Functions.
5. Create DB functions (stored procedures) for heavy calculations where appropriate.
6. Provide before/after examples for a few controllers and services.

AI prompts for Phase 4 (examples):

```
Migrate this Express controller to Supabase queries: [paste controller]
Provide the frontend code (Supabase queries), Edge Function if needed, RLS policies, and before/after diff.
```

Verification:
- Replace `GET /api/profile` with a direct Supabase query and ensure UI behaves the same
- Deploy and test Edge Functions

---

## Phase 5 — Real-time features migration

Goal: Replace Socket.IO with Supabase Realtime subscriptions and channels.

1. Enable Realtime in the Supabase project and enable broadcasting for required tables.
2. Create subscription hooks in the frontend (e.g., `useRealtimeSubscription`) to subscribe to INSERT/UPDATE/DELETE events.
3. Replace socket emissions with table updates or broadcast channels where needed.
4. Implement presence and custom channels for admin events.

AI prompts for Phase 5 (examples):

```
Create a React hook for Supabase Realtime subscriptions.
Requirements: subscribe to table changes, filter by user ID, cleanup on unmount, TypeScript support.
```

Verification:
- Dashboard stats update in real-time via Supabase Realtime
- Admin logs stream via `admin_logs` table inserts

---

## Phase 6 — Admin panel migration

Goal: Migrate admin flows to Supabase + RLS + Realtime.

1. Implement admin role storage and RLS checks.
2. Migrate admin routes to direct Supabase queries and Edge Functions as needed.
3. Replace Socket.IO features with Realtime subscriptions.
4. Harden RLS policies and add audit logging for admin actions.

AI prompts for Phase 6 (examples):

```
Implement role-based access control in Supabase using RLS and a roles table. Provide SQL for policies and a TypeScript helper to check role.
```

Verification:
- Admin-only pages enforce access correctly
- Audit logs show admin actions

---

## Phase 7 — Testing & validation

- Unit tests for Supabase client and Edge Functions
- Integration tests for user flows
- RLS policy tests to ensure no cross-user data leakage
- Performance/load testing for critical endpoints and realtime

AI prompts for Phase 7 (examples):

```
Create a test suite for Supabase integration covering auth, CRUD, RLS, and realtime subscriptions. Provide CI steps.
```

---

## Phase 8 — Deployment & cutover

- Setup staging and production Supabase projects
- Run incremental data migrations and verify integrity
- Start parallel run and gradually shift traffic using canary releases
- Monitor, then decommission old backend after a safe period

AI prompts for Phase 8 (examples):

```
Create deployment scripts for supabase Edge Functions, migrations and data migration, with rollback steps.
```

---

## File-by-file migration map (high level)

- `backend/controllers/*` → either direct Supabase queries (frontend) or Edge Functions
- `backend/services/*` → Edge Functions (complex) or DB functions (heavy calculations)
- `backend/middleware/*` → replaced by Supabase Auth + RLS checks on the server or client
- `src/services/api.js` → replaced by `src/lib/supabase-client.ts` and helper wrappers
- `backend/utils/initDb.js` / `supabase/migrations/*` → canonical migrations for Supabase

(Use the earlier sections for detailed mapping per controller/service.)

---

## Testing strategy and rollback

- Local dev: run Supabase locally with `supabase start` and test migrations
- Staging: push migrations and run full integration tests
- Production: run final data migration and cutover window
- Rollback: keep old backend accessible for 1–2 weeks; ensure backups and migration logs are available.

---

## AI assistance prompts (collected)

- RLS generation
- Schema migration snippets
- Edge Function templates for common services
- File migration scripts
- Supabase client wrapper
- Realtime subscription hooks

(Examples are included inline in each phase.)

---

## Next steps (practical)

1. Review and adjust the plan with the team.
2. Create a Supabase project and link the repo.
3. Run Phase 1 (schema push) in a staging Supabase project and iterate.
4. Migrate authentication next (Phase 2), then storage (Phase 3), then API (Phase 4) and so on.

---

## Appendix — Useful commands

```bash
# Install Supabase CLI
npm install -g supabase

# Link project
supabase link --project-ref <project-ref>

# Push migrations
supabase db push

# Start local Supabase (dev)
supabase start

# Deploy Edge Functions
supabase functions deploy <name>
```

---

If you want, I can now:
- Generate the `src/lib/supabase-client.ts` starter file and typed `src/types/database.ts` using the current `supabase/migrations` as a source, or
- Create the `src/lib/supabase.ts` auth wrapper and `src/lib/auth-context.tsx` migration for the frontend auth changes, or
- Produce example Edge Function templates for `bookService` and `analyticsExportService`.

Pick one and I will implement it next.