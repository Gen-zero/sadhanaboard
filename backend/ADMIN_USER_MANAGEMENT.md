# Admin User Management

This document explains how to create new admin users for the SādhanaBoard application.

## Methods to Create Admin Users

### 1. Using the Node.js Script (Recommended)

The easiest and most secure way to create a new admin user is to use the provided Node.js script:

```bash
cd backend
node create_admin_user.js <username> <email> <password> [role]
```

Example:
```bash
node create_admin_user.js newadmin admin@example.com mypassword admin
```

This script will:
- Check if the username already exists
- Hash the password using bcrypt (10 rounds)
- Insert the new user into the admin_details table
- Return the created user details

### 2. Using SQL Query (Advanced)

If you prefer to use a direct SQL query, you can use the template provided in `sql_insert_admin_user.sql`. However, you must manually hash the password first.

To generate a bcrypt hash for your password, use the provided script:

```bash
cd backend
node generate_password_hash.js <password>
```

Example:
```bash
node generate_password_hash.js mypassword
```

This will output the bcrypt hash that you can use in your SQL query.

## Database Table Structure

The `admin_details` table has the following structure:

- `id` (integer) - Primary key, auto-incremented
- `username` (character varying) - Unique username
- `email` (character varying) - Email address
- `password_hash` (character varying) - Bcrypt hashed password
- `role` (character varying) - User role (typically 'admin')
- `active` (boolean) - Whether the account is active
- `last_login` (timestamp with time zone) - Last login timestamp
- `login_attempts` (integer) - Number of failed login attempts
- `locked_until` (timestamp with time zone) - Account lock expiration
- `created_by` (integer) - ID of admin who created this user
- `created_at` (timestamp with time zone) - Account creation timestamp
- `updated_at` (timestamp with time zone) - Last update timestamp

## Security Notes

1. Always use strong passwords for admin accounts
2. Never store plain text passwords in the database
3. The bcrypt hashing ensures passwords are securely stored
4. Passwords are hashed with 10 rounds of bcrypt by default
5. The `created_by` field can be used to track who created admin accounts

## Example Usage

To create a new admin user with username "superadmin", email "superadmin@example.com", and password "securepassword123":

```bash
cd backend
node create_admin_user.js superadmin superadmin@example.com securepassword123 admin
```

This will create a new admin user with the specified credentials.

## Verification

To verify that an admin user was created successfully, you can check the database:

```sql
SELECT id, username, email, role, active FROM admin_details WHERE username = 'superadmin';
```

This should return the user details if the user was created successfully.