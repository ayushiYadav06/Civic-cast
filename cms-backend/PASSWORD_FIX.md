# Admin Password Fix - "Invalid Credentials" Error

## Problem Identified

You were getting the "Invalid credentials" error because **the password hash in the database schema was incorrect**. The hash stored in `database/schema.sql` did not match the password "admin123".

### Root Cause
The password hash `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi` in the schema.sql file was a placeholder/test hash that doesn't actually correspond to "admin123".

## Solution Applied

### 1. Fixed Schema File
✅ Updated `database/schema.sql` with the correct password hash for "admin123"

### 2. Created Fix Script
✅ Created `fix-admin-password.php` to update existing databases

### 3. Improved Error Handling
✅ Enhanced `models/Admin.php` to ensure proper return values

## How to Fix Your Database

### Option 1: Run the Fix Script (Recommended for Existing Databases)

If your database is already set up, run this script to update the admin password:

```bash
cd "c:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
php fix-admin-password.php
```

This will:
- Generate a correct password hash for "admin123"
- Update the admin user in your database
- Verify the update was successful

### Option 2: Re-run Database Setup

If you haven't set up the database yet, or want to start fresh:

```bash
cd "c:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
php setup-database.php
```

This will create/update the database with the corrected schema.

### Option 3: Manual SQL Update

If you prefer to update manually via MySQL:

```sql
UPDATE admins 
SET password = '$2y$12$H74uX9e8uQGzXxmktQXNtu1pj.mt6I67iPn2jjCWMs5yAYQpurK.W' 
WHERE username = 'admin' OR email = 'admin@civiccast.com';
```

## Default Login Credentials

After applying the fix, you can login with:

- **Username/Email:** `admin` or `admin@civiccast.com`
- **Password:** `admin123`
- **Role:** `admin`

## Testing the Fix

After running the fix script, test the login:

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"admin","password":"admin123","role":"admin"}'
```

You should now receive a successful response with a JWT token instead of "Invalid credentials".

## Files Modified

1. `database/schema.sql` - Updated with correct password hash
2. `models/Admin.php` - Improved error handling
3. `fix-admin-password.php` - New script to fix existing databases
4. `generate-password-hash.php` - Utility script for hash generation

## Important Notes

⚠️ **Security Warning:** The default password "admin123" is for development only. **Change it immediately in production!**

To change the admin password, you can:
1. Use the fix script as a template to create a password change script
2. Manually update the database with a new hash generated using `password_hash()`
