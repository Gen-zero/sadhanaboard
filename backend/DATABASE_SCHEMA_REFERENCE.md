# SaadhanaBoard Database Schema Reference

Complete reference guide for all database tables, columns, relationships, and constraints.

**Generated:** 2025-01-07  
**Schema Version:** 1.0  
**Database:** PostgreSQL 12+ (Supabase compatible)

---

## Table of Contents

1. [Core Authentication](#core-authentication)
2. [Spiritual Books](#spiritual-books)
3. [Sadhana Practices](#sadhana-practices)
4. [Groups & Community](#groups--community)
5. [CMS Management](#cms-management)
6. [Admin & Settings](#admin--settings)
7. [Business Intelligence](#business-intelligence)
8. [Helper Functions](#helper-functions)
9. [Indexes Summary](#indexes-summary)
10. [Relationships Diagram](#relationships-diagram)

---

## Core Authentication

### users
Core user account table for authentication.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique user identifier |
| email | TEXT | UNIQUE, NOT NULL | Email address for login |
| password | TEXT | NOT NULL | Bcrypt hashed password |
| display_name | TEXT | NOT NULL | User's display name |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:** `idx_users_email`  
**Referenced by:** profiles, spiritual_books, sadhanas, book_progress, and 10+ other tables

---

### profiles
Extended user profile information with spiritual metadata.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, FK→users(id) ON DELETE CASCADE | Same as user ID |
| display_name | TEXT | NOT NULL | User's display name |
| avatar_url | TEXT | | URL to user's avatar image |
| bio | TEXT | | User biography |
| experience_level | TEXT | | Spiritual experience level |
| traditions | TEXT[] | DEFAULT '{}' | Array of spiritual traditions |
| location | TEXT | | User's location |
| available_for_guidance | BOOLEAN | DEFAULT false | Open to mentoring others |
| date_of_birth | DATE | | User's birth date |
| time_of_birth | TIME | | Birth time for astrology |
| place_of_birth | TEXT | | Birth place for astrology |
| favorite_deity | TEXT | | Preferred deity |
| gotra | TEXT | | Hindu gotra/lineage |
| varna | TEXT | | Hindu varna classification |
| sampradaya | TEXT | | Spiritual tradition/sect |
| onboarding_completed | BOOLEAN | DEFAULT false | Onboarding status |
| settings | JSONB | | User preferences and settings |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Profile creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:** `idx_profiles_id`  
**Related tables:** users, user_followers, group_members

---

### waitlist
Waiting list for application access management.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique waitlist entry ID |
| name | TEXT | NOT NULL | Person's name |
| email | TEXT | UNIQUE, NOT NULL | Email address |
| reason | TEXT | | Reason for joining |
| status | TEXT | DEFAULT 'pending' CHECK(...) | pending, approved, or rejected |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Submission timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Status values:** pending, approved, rejected  
**Indexes:** `idx_waitlist_email`, `idx_waitlist_status`

---

## Spiritual Books

### spiritual_books
Main library of spiritual texts and knowledge resources.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique book ID |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Book creator/owner |
| title | TEXT | NOT NULL | Book title |
| author | TEXT | NOT NULL | Book author |
| traditions | TEXT[] | DEFAULT '{}' | Spiritual traditions (array) |
| content | TEXT | | Full text content |
| storage_url | TEXT | | URL to stored PDF/file |
| is_storage_file | BOOLEAN | DEFAULT false | Whether content is in storage |
| description | TEXT | | Book description/summary |
| year | INTEGER | | Publication year |
| language | TEXT | DEFAULT 'english' | Book language |
| page_count | INTEGER | | Number of pages |
| cover_url | TEXT | | URL to cover image |
| file_size | INTEGER | | File size in bytes |
| deleted_at | TIMESTAMP WITH TIME ZONE | | Soft delete timestamp |
| search_vector | TSVECTOR | | Full-text search index |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:** `idx_spiritual_books_user_id`, `idx_spiritual_books_deleted_at`, `idx_spiritual_books_search_vector`  
**Referenced by:** book_progress, book_bookmarks, book_annotations

---

### book_progress
User's reading progress within books.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Reading user |
| book_id | UUID | FK→spiritual_books(id) ON DELETE CASCADE | Book being read |
| position | JSONB | | Reader's position (flexible format) |
| page | INTEGER | | Current page number |
| percent | NUMERIC | | Percentage read (0-100) |
| time_spent_minutes | INTEGER | DEFAULT 0 | Total time spent reading |
| last_seen_at | TIMESTAMP WITH TIME ZONE | | Last reading session |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | First read timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Unique constraint:** (user_id, book_id)  
**Indexes:** `idx_book_progress_user_id`, `idx_book_progress_book_id`

---

### book_bookmarks
User bookmarks within books.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Bookmark creator |
| book_id | UUID | FK→spiritual_books(id) ON DELETE CASCADE | Bookmarked book |
| label | TEXT | | Bookmark label/name |
| page | INTEGER | | Page number |
| position | JSONB | | Position data (flexible) |
| is_public | BOOLEAN | DEFAULT false | Share bookmark publicly |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:** `idx_book_bookmarks_user_id`, `idx_book_bookmarks_book_id`

---

### book_annotations
User annotations and notes within books.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Annotation author |
| book_id | UUID | FK→spiritual_books(id) ON DELETE CASCADE | Annotated book |
| page | INTEGER | | Page number |
| position | JSONB | | Position data (flexible) |
| content | TEXT | | Annotation text |
| is_private | BOOLEAN | DEFAULT true | Private annotation flag |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:** `idx_book_annotations_user_id`, `idx_book_annotations_book_id`

---

## Sadhana Practices

### sadhanas
Spiritual practice routines and exercises.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique sadhana ID |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Sadhana owner |
| assigned_by | UUID | FK→users(id) ON DELETE SET NULL | Assigned by user (mentor) |
| title | TEXT | NOT NULL | Sadhana title |
| description | TEXT | | Description/instructions |
| completed | BOOLEAN | DEFAULT false | Completion status |
| category | TEXT | DEFAULT 'daily' CHECK(...) | daily, goal |
| due_date | DATE | | Due date |
| due_time | TIME | | Due time |
| priority | TEXT | DEFAULT 'medium' CHECK(...) | low, medium, high |
| tags | TEXT[] | DEFAULT '{}' | Custom tags |
| reflection | TEXT | | Reflection/notes |
| sadhana_id | INTEGER | | Legacy ID field |
| deity | TEXT | | Associated deity |
| duration_minutes | INTEGER | DEFAULT 30 | Typical duration |
| experience_points | INTEGER | DEFAULT 10 | XP reward |
| streak_count | INTEGER | DEFAULT 0 | Completion streak |
| last_completed_at | TIMESTAMP WITH TIME ZONE | | Last completion time |
| spiritual_tags | TEXT[] | DEFAULT '{}' | Spiritual categories |
| practice_type | TEXT | DEFAULT 'general' | Type of practice |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Check constraints:** category IN ('daily', 'goal'), priority IN ('low', 'medium', 'high')  
**Indexes:** `idx_sadhanas_user_id`, `idx_sadhanas_assigned_by`, `idx_sadhanas_created_at`

---

### sadhana_progress
Daily progress tracking for sadhanas.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique progress ID |
| sadhana_id | UUID | FK→sadhanas(id) ON DELETE CASCADE | Tracked sadhana |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Progress tracker |
| progress_date | DATE | DEFAULT CURRENT_DATE | Date of progress |
| completed | BOOLEAN | DEFAULT false | Completion flag |
| notes | TEXT | | Progress notes |
| duration_minutes | INTEGER | | Time spent |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Log timestamp |

**Unique constraint:** (sadhana_id, progress_date)  
**Indexes:** `idx_sadhana_progress_user_id`, `idx_sadhana_progress_sadhana_id`

---

### shared_sadhanas
Sharing and community features for sadhanas.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique share ID |
| sadhana_id | UUID | FK→sadhanas(id) ON DELETE CASCADE | Shared sadhana |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Sharing user |
| privacy_level | TEXT | DEFAULT 'public' CHECK(...) | public, friends, private |
| share_count | INTEGER | DEFAULT 0 | Number of shares |
| view_count | INTEGER | DEFAULT 0 | Number of views |
| shared_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Share timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update |

**Unique constraint:** sadhana_id  
**Indexes:** `idx_shared_sadhanas_user_id`, `idx_shared_sadhanas_privacy_level`

---

### sadhana_likes
Community engagement - likes on shared sadhanas.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| sadhana_id | UUID | FK→sadhanas(id) ON DELETE CASCADE | Liked sadhana |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Liker |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Like timestamp |

**Unique constraint:** (sadhana_id, user_id)  
**Indexes:** `idx_sadhana_likes_user_id`, `idx_sadhana_likes_sadhana_id`

---

### sadhana_comments
Community engagement - comments on shared sadhanas.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique comment ID |
| sadhana_id | UUID | FK→sadhanas(id) ON DELETE CASCADE | Commented sadhana |
| user_id | UUID | FK→users(id) ON DELETE SET NULL | Comment author |
| content | TEXT | NOT NULL | Comment text |
| parent_comment_id | UUID | FK→sadhana_comments(id) ON DELETE CASCADE | Reply to comment |
| is_edited | BOOLEAN | DEFAULT false | Edit flag |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_sadhana_comments_sadhana_id`, `idx_sadhana_comments_user_id`, `idx_sadhana_comments_parent_id`

---

## Groups & Community

### groups
Community groups for collective sadhana practice.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique group ID |
| name | TEXT | NOT NULL | Group name |
| description | TEXT | | Group description |
| avatar_url | TEXT | | Group avatar image URL |
| group_type | TEXT | DEFAULT 'public' CHECK(...) | public, private, secret |
| created_by | UUID | FK→users(id) ON DELETE SET NULL | Group creator |
| tags | TEXT[] | DEFAULT '{}' | Category tags |
| max_members | INTEGER | | Maximum members allowed |
| settings | JSONB | DEFAULT '{}' | Group settings |
| member_count | INTEGER | DEFAULT 0 | Current member count |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:** `idx_groups_created_by`, `idx_groups_group_type`, `idx_groups_created_at`

---

### group_members
Group membership and role management.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique membership ID |
| group_id | UUID | FK→groups(id) ON DELETE CASCADE | Member group |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Group member |
| role | TEXT | DEFAULT 'member' CHECK(...) | owner, moderator, member |
| status | TEXT | DEFAULT 'active' CHECK(...) | active, pending, blocked |
| joined_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Join timestamp |

**Unique constraint:** (group_id, user_id)  
**Indexes:** `idx_group_members_group_id`, `idx_group_members_user_id`, `idx_group_members_status`

---

### group_activity
Activity tracking within groups.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique activity ID |
| group_id | UUID | FK→groups(id) ON DELETE CASCADE | Activity group |
| user_id | UUID | FK→users(id) ON DELETE SET NULL | Activity user |
| activity_type | TEXT | NOT NULL | Type of activity |
| activity_data | JSONB | | Activity details |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Activity timestamp |

**Indexes:** `idx_group_activity_group_id`, `idx_group_activity_user_id`

---

### user_followers
User following relationships for social features.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique relationship ID |
| follower_id | UUID | FK→users(id) ON DELETE CASCADE | Follower user |
| followed_id | UUID | FK→users(id) ON DELETE CASCADE | Followed user |
| status | TEXT | DEFAULT 'active' CHECK(...) | active, blocked |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Follow timestamp |

**Unique constraint:** (follower_id, followed_id)  
**Indexes:** `idx_user_followers_follower_id`, `idx_user_followers_followed_id`

---

### community_activity
General community activity feed.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique activity ID |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | Activity user |
| activity_type | TEXT | NOT NULL | Type of activity |
| activity_data | JSONB | | Activity details |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Activity timestamp |

**Indexes:** `idx_community_activity_user_id`, `idx_community_activity_type`

---

## CMS Management

### cms_themes
UI theme definitions for frontend customization.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| name | TEXT | NOT NULL | Theme name |
| deity | TEXT | | Associated deity |
| description | TEXT | | Theme description |
| color_palette | JSONB | DEFAULT '{}' | Color definitions |
| css_variables | JSONB | DEFAULT '{}' | CSS variables |
| preview_image | TEXT | | Preview image URL |
| status | TEXT | DEFAULT 'draft' CHECK(...) | draft, published, archived |
| version | INTEGER | DEFAULT 1 | Theme version |
| registry_id | VARCHAR | | Frontend registry ID |
| created_by | UUID | | Creator ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_cms_themes_status`, `idx_cms_themes_registry_id`

---

### cms_templates
Reusable content templates.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| title | TEXT | NOT NULL | Template title |
| description | TEXT | | Description |
| type | TEXT | | Template type |
| difficulty_level | TEXT | | Difficulty level |
| duration_minutes | INTEGER | | Duration estimate |
| instructions | JSONB | DEFAULT '[]' | Instructions array |
| components | JSONB | DEFAULT '[]' | Components array |
| tags | TEXT[] | DEFAULT '{}' | Tags |
| category_id | INTEGER | | Category ID |
| status | TEXT | DEFAULT 'draft' | draft, published, archived |
| version | INTEGER | DEFAULT 1 | Version number |
| created_by | UUID | | Creator ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_cms_templates_status`, `idx_cms_templates_created_by`

---

### cms_assets
Digital asset management.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| title | TEXT | NOT NULL | Asset title |
| description | TEXT | | Asset description |
| type | TEXT | | Asset type |
| file_path | TEXT | | File path/URL |
| file_size | INTEGER | | File size bytes |
| mime_type | TEXT | | MIME type |
| metadata | JSONB | DEFAULT '{}' | Additional metadata |
| tags | TEXT[] | DEFAULT '{}' | Tags |
| category_id | INTEGER | | Category ID |
| status | TEXT | DEFAULT 'draft' | draft, published, archived |
| created_by | UUID | | Creator ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_cms_assets_created_by`, `idx_cms_assets_status`

---

### cms_asset_variants
Asset variations and formats.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| asset_id | INTEGER | FK→cms_assets(id) ON DELETE CASCADE | Parent asset |
| variant_type | TEXT | | Variant type |
| file_path | TEXT | | File path/URL |
| file_size | INTEGER | | File size bytes |
| metadata | JSONB | DEFAULT '{}' | Variant metadata |

**Indexes:** `idx_cms_asset_variants_asset_id`

---

### cms_version_history
Content versioning and revision tracking.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| content_type | TEXT | NOT NULL | Type of content |
| content_id | INTEGER | NOT NULL | Content ID |
| version | INTEGER | NOT NULL | Version number |
| payload | JSONB | DEFAULT '{}' | Version data |
| created_by | UUID | | Creator ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |

**Indexes:** `idx_cms_version_history_content_type`

---

### cms_audit_trail
Detailed audit logging for content management.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Sequential ID |
| admin_id | UUID | | Admin user ID |
| action | TEXT | NOT NULL | Action performed |
| content_type | TEXT | | Content type |
| content_id | INTEGER | | Content ID |
| meta | JSONB | DEFAULT '{}' | Additional metadata |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Action timestamp |

**Indexes:** `idx_cms_audit_trail_admin_id`, `idx_cms_audit_trail_created_at`

---

## Admin & Settings

### admin_details
Administrator user accounts.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Admin ID |
| username | VARCHAR(150) | UNIQUE, NOT NULL | Unique username |
| email | VARCHAR(255) | UNIQUE | Email address |
| password_hash | TEXT | NOT NULL | Bcrypt hashed password |
| role | VARCHAR(50) | DEFAULT 'admin' CHECK(...) | admin, superadmin, moderator |
| active | BOOLEAN | DEFAULT TRUE | Account active flag |
| last_login | TIMESTAMP WITH TIME ZONE | | Last login timestamp |
| login_attempts | INTEGER | DEFAULT 0 | Failed login count |
| locked_until | TIMESTAMP WITH TIME ZONE | | Account lock expiration |
| created_by | INTEGER | FK→admin_details(id) | Creator admin ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_admin_details_username`, `idx_admin_details_email`, `idx_admin_details_active`

---

### admin_integrations
Third-party service integrations.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Integration ID |
| name | TEXT | NOT NULL | Integration name |
| provider | TEXT | NOT NULL | Service provider |
| credentials | JSONB | DEFAULT '{}' | OAuth/API credentials |
| enabled | BOOLEAN | DEFAULT false | Enabled flag |
| metadata | JSONB | DEFAULT '{}' | Provider-specific data |
| spreadsheet_id | TEXT | | Google Sheets spreadsheet ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_admin_integrations_provider`, `idx_admin_integrations_enabled`

---

## Business Intelligence

### report_templates
BI report templates.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Template ID |
| name | TEXT | NOT NULL | Template name |
| description | TEXT | | Description |
| owner_id | INTEGER | FK→admin_details(id) ON DELETE SET NULL | Owner admin |
| template | JSONB | NOT NULL | Template definition |
| template_type | TEXT | DEFAULT 'dashboard' CHECK(...) | dashboard, chart, table, mixed |
| default_format | TEXT | DEFAULT 'pdf' CHECK(...) | pdf, csv, json |
| is_public | BOOLEAN | DEFAULT false | Public access flag |
| tags | TEXT[] | DEFAULT '{}' | Tags |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_report_templates_owner_id`, `idx_report_templates_is_public`

---

### scheduled_reports
Scheduled report generation.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Schedule ID |
| template_id | INTEGER | FK→report_templates(id) ON DELETE CASCADE | Report template |
| name | TEXT | | Schedule name |
| description | TEXT | | Description |
| cron_expression | TEXT | NOT NULL | Cron schedule |
| timezone | TEXT | DEFAULT 'UTC' | Timezone |
| next_run | TIMESTAMP WITH TIME ZONE | | Next execution time |
| recipients | JSONB | DEFAULT '[]' | Recipient list |
| output_format | TEXT | DEFAULT 'pdf' CHECK(...) | pdf, csv, json |
| active | BOOLEAN | DEFAULT true | Active flag |
| last_run | TIMESTAMP WITH TIME ZONE | | Last execution |
| retry_policy | JSONB | DEFAULT '{}' | Retry configuration |
| created_by | INTEGER | FK→admin_details(id) ON DELETE SET NULL | Creator |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_scheduled_reports_template_id`, `idx_scheduled_reports_created_by`, `idx_scheduled_reports_active`

---

### report_executions
Individual report execution history.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Execution ID |
| scheduled_id | INTEGER | FK→scheduled_reports(id) ON DELETE SET NULL | Schedule |
| template_id | INTEGER | FK→report_templates(id) ON DELETE SET NULL | Template |
| status | TEXT | DEFAULT 'pending' CHECK(...) | pending, running, completed, failed |
| started_at | TIMESTAMP WITH TIME ZONE | | Start timestamp |
| finished_at | TIMESTAMP WITH TIME ZONE | | End timestamp |
| result_url | TEXT | | Result file URL |
| result_data | JSONB | | Result data |
| logs | TEXT | | Execution logs |
| error | TEXT | | Error message |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |

**Indexes:** `idx_report_executions_template_id`, `idx_report_executions_scheduled_id`, `idx_report_executions_status`, `idx_report_executions_created_at`

---

### spiritual_insights
AI-generated insights about user progress.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Insight ID |
| user_id | UUID | FK→users(id) ON DELETE CASCADE | User |
| sadhana_id | UUID | FK→sadhanas(id) ON DELETE SET NULL | Related sadhana |
| name | TEXT | | Insight name |
| description | TEXT | | Description |
| insight_type | TEXT | DEFAULT 'behavior' CHECK(...) | behavior, community, predictive, custom |
| score | NUMERIC | | Confidence score |
| content | JSONB | NOT NULL | Insight data |
| source | TEXT | | Data source |
| generated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Generation time |
| expires_at | TIMESTAMP WITH TIME ZONE | | Expiration time |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Update timestamp |

**Indexes:** `idx_spiritual_insights_user_id`, `idx_spiritual_insights_type`, `idx_spiritual_insights_generated_at`

---

### report_shares
Sharing and access control for reports.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PK | Share ID |
| execution_id | INTEGER | FK→report_executions(id) ON DELETE CASCADE | Execution |
| shared_with | JSONB | DEFAULT '[]' | Recipients list |
| access_token | TEXT | | Access token |
| link | TEXT | | Share link |
| expires_at | TIMESTAMP WITH TIME ZONE | | Expiration time |
| created_by | INTEGER | FK→admin_details(id) ON DELETE SET NULL | Creator |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |

**Indexes:** `idx_report_shares_execution_id`, `idx_report_shares_access_token`

---

## Helper Functions

### get_follower_count(user_id UUID) → BIGINT
Returns the count of active followers for a user.

```sql
SELECT get_follower_count('user-uuid');
```

### get_following_count(user_id UUID) → BIGINT
Returns the count of users that the user is following.

```sql
SELECT get_following_count('user-uuid');
```

### is_following(follower_id UUID, followed_id UUID) → BOOLEAN
Checks if a user follows another user.

```sql
SELECT is_following('follower-uuid', 'followed-uuid');
```

### can_user_manage_group(group_id UUID, user_id UUID) → BOOLEAN
Checks if a user can manage a group (owner or moderator).

```sql
SELECT can_user_manage_group('group-uuid', 'user-uuid');
```

---

## Indexes Summary

### Performance Indexes
- `idx_users_email` - User email lookups
- `idx_profiles_id` - Profile access
- `idx_waitlist_email` - Waitlist duplicate checks
- `idx_waitlist_status` - Status filtering
- `idx_spiritual_books_user_id` - User's books
- `idx_spiritual_books_deleted_at` - Non-deleted books
- `idx_spiritual_books_search_vector` - Full-text search
- `idx_book_progress_user_id` - User's progress
- `idx_book_progress_book_id` - Book's readers
- `idx_book_bookmarks_*` - Bookmark lookups
- `idx_book_annotations_*` - Annotation lookups
- `idx_sadhanas_user_id` - User's sadhanas
- `idx_sadhana_progress_*` - Progress tracking
- `idx_sadhana_likes_*` - Like tracking
- `idx_sadhana_comments_*` - Comment lookups
- `idx_groups_*` - Group searches and filtering
- `idx_group_members_*` - Membership queries
- `idx_user_followers_*` - Follow relationship lookups
- `idx_community_activity_*` - Activity feed
- `idx_cms_assets_*` - Asset queries
- `idx_cms_themes_*` - Theme queries
- `idx_admin_details_*` - Admin lookups
- `idx_admin_integrations_*` - Integration searches
- `idx_report_*` - Report queries
- `idx_spiritual_insights_*` - Insight lookups

---

## Relationships Diagram

```
users
├── profiles (1:1)
├── spiritual_books (1:N)
│   ├── book_progress (1:N)
│   ├── book_bookmarks (1:N)
│   └── book_annotations (1:N)
├── sadhanas (1:N) [as user_id]
│   ├── sadhana_progress (1:N)
│   ├── shared_sadhanas (1:1)
│   │   ├── sadhana_likes (1:N)
│   │   └── sadhana_comments (1:N)
│   └── sadhanas (1:N) [as assigned_by]
├── groups (1:N) [created_by]
│   ├── group_members (N:N)
│   │   └── users (N:N)
│   └── group_activity (1:N)
├── user_followers (N:N)
│   ├── follower_id → users
│   └── followed_id → users
└── community_activity (1:N)

admin_details
├── admin_integrations (1:N)
├── report_templates (1:N)
├── scheduled_reports (1:N)
├── report_executions (1:N)
└── report_shares (1:N)

CMS (Independent)
├── cms_themes
├── cms_templates
├── cms_assets
│   └── cms_asset_variants (1:N)
├── cms_version_history
└── cms_audit_trail
```

---

## Query Examples

### Get user with profile and follower count
```sql
SELECT u.*, p.*, 
       get_follower_count(u.id) as followers
FROM users u
JOIN profiles p ON u.id = p.id
WHERE u.id = $1;
```

### Get user's sadhanas with progress
```sql
SELECT s.*, sp.completed, sp.progress_date
FROM sadhanas s
LEFT JOIN sadhana_progress sp ON s.id = sp.sadhana_id 
  AND sp.progress_date = CURRENT_DATE
WHERE s.user_id = $1
ORDER BY s.created_at DESC;
```

### Get community feed with engagement metrics
```sql
SELECT ss.*, s.*,
       (SELECT COUNT(*) FROM sadhana_likes WHERE sadhana_id = s.id) as likes,
       (SELECT COUNT(*) FROM sadhana_comments WHERE sadhana_id = s.id) as comments
FROM shared_sadhanas ss
JOIN sadhanas s ON ss.sadhana_id = s.id
WHERE ss.privacy_level = 'public'
ORDER BY ss.shared_at DESC;
```

### Get user's groups with member count
```sql
SELECT g.*, gm.role
FROM groups g
JOIN group_members gm ON g.id = gm.group_id
WHERE gm.user_id = $1 AND gm.status = 'active'
ORDER BY gm.joined_at DESC;
```

---

## Important Notes

1. **UUIDs for Users**: All user IDs use UUID type for security
2. **Timestamps**: All timestamps are in UTC with timezone awareness
3. **Soft Deletes**: spiritual_books uses soft deletes (deleted_at)
4. **JSONB for Flexibility**: Metadata, settings, and complex data use JSONB
5. **Text Arrays**: Tags and multi-select fields use TEXT[] arrays
6. **Check Constraints**: Enum-like fields use CHECK constraints
7. **Foreign Keys**: All relationships have proper CASCADE/SET NULL rules
8. **Indexes**: Strategic indexes on frequently filtered/sorted columns

---

**Last Updated:** 2025-01-07  
**Schema Version:** 1.0  
**Compatibility:** PostgreSQL 12+, Supabase
