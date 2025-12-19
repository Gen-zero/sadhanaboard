# Custom Sadhanas Implementation

## Overview
This document describes the implementation of a backend database storage system for custom sadhanas in the Sadhanaboard application. Previously, custom sadhanas were stored in the browser's localStorage, which meant they were lost when clearing browser data or switching devices. This implementation moves the storage to a centralized PostgreSQL database.

## Changes Made

### 1. Database Schema
- Added a new `custom_sadhanas` table to the PostgreSQL database schema
- Created indexes for efficient querying by user_id, is_draft, and created_at
- Migration file created to apply the schema changes

### 2. Backend Implementation
- Created a new model `CustomSadhana` in `backend/models/CustomSadhana.js`
- Created a service `CustomSadhanaService` in `backend/services/customSadhanaService.js` with methods for:
  - Creating custom sadhanas
  - Retrieving user's custom sadhanas
  - Updating custom sadhanas
  - Deleting custom sadhanas
  - Getting specific custom sadhana by ID
- Created a controller `CustomSadhanaController` in `backend/controllers/customSadhanaController.js`
- Created API routes in `backend/routes/customSadhanas.js`
- Registered the new routes in `server.js`
- Updated API documentation

### 3. Frontend Implementation
- Updated the `useCustomSadhanas` hook to use the backend API instead of localStorage
- Added loading and error states to the UI
- Modified `SadhanaSelection` component to show loading spinner and error messages
- Updated `SaadhanaBoard` component to handle async operations

### 4. Data Structure
The custom sadhanas are stored with the following fields:
- `id`: Unique identifier (UUID)
- `user_id`: Reference to the user who created it
- `name`: Name/title of the custom sadhana
- `description`: Description of the custom sadhana
- `purpose`: The purpose/intention of the practice
- `goal`: The goal/outcome of the practice
- `deity`: The deity or focus of the practice
- `message`: A personal message or note
- `offerings`: Array of offerings/practices
- `duration_days`: Duration of the practice in days
- `is_draft`: Whether the sadhana is a draft or finalized
- `created_at`: Timestamp when created
- `updated_at`: Timestamp when last updated

## Testing Instructions

### Prerequisites
1. Ensure the Supabase PostgreSQL database is accessible
2. Verify the DATABASE_URL is correctly configured in `.env.development`
3. Run the migration to create the `custom_sadhanas` table

### Running the Migration
```bash
cd backend
node run_migration.js
```

### Testing the Implementation
1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Access the Sadhana page in the frontend
3. Create a new custom sadhana and save it as a draft
4. Verify the custom sadhana appears in the "Your Saved Practices" section
5. Refresh the page and verify the custom sadhana persists
6. Try creating multiple custom sadhanas and verify they all appear correctly

### Manual Testing Script
You can also test the backend service directly:
```bash
cd backend
node test_custom_sadhanas.js
```

## Benefits of This Implementation
1. **Persistence Across Devices**: Custom sadhanas are now stored on the server and accessible from any device
2. **Data Durability**: No longer lost when clearing browser data
3. **Scalability**: Can handle large numbers of custom sadhanas per user
4. **Consistency**: Provides a unified data model across the application
5. **Future Extensibility**: Easy to add new features like sharing, collaboration, etc.

## Error Handling
The implementation includes proper error handling for:
- Database connection failures
- Invalid data
- Unauthorized access attempts
- Missing records
- Network issues

Loading and error states are displayed in the UI to provide feedback to users.

## Future Improvements
Potential future enhancements could include:
1. Adding search and filtering capabilities for custom sadhanas
2. Implementing sharing functionality between users
3. Adding categories or tags for better organization
4. Implementing versioning for custom sadhanas
5. Adding export/import functionality