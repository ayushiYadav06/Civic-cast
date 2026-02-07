# How to Enable PDO MySQL Extension on Windows

## Quick Fix Guide

Your check shows: `✗ pdo_mysql` is missing. Follow these steps:

## Step 1: Find Your PHP Configuration File

Open PowerShell and run:

```powershell
php --ini
```

This will show output like:
```
Configuration File (php.ini) Path: C:\php
Loaded Configuration File:         C:\php\php.ini
```

**Note the path** - you'll need to edit this file.

## Step 2: Open php.ini File

**Option A: Using Notepad (as Administrator)**
```powershell
# Right-click PowerShell and "Run as Administrator", then:
notepad C:\php\php.ini
```

**Option B: Using VS Code**
```powershell
code C:\php\php.ini
```

**Option C: Using any text editor**
- Navigate to the path shown in Step 1
- Open `php.ini` file

## Step 3: Enable PDO MySQL Extension

1. **Press `Ctrl+F`** to open search in your text editor

2. **Search for:** `extension=pdo_mysql`

3. **You'll find a line like this:**
   ```ini
   ;extension=pdo_mysql
   ```
   
   Notice the `;` at the beginning - this **disables** the extension.

4. **Remove the semicolon** to enable it:
   ```ini
   extension=pdo_mysql
   ```

5. **Also enable mysqli** (search for `extension=mysqli`):
   ```ini
   ;extension=mysqli
   ```
   Change to:
   ```ini
   extension=mysqli
   ```

6. **Save the file** (Ctrl+S)

## Step 4: Verify Extension Files Exist

Check if the DLL files exist in your PHP `ext` folder:

```powershell
# Find your PHP extension directory
php -i | Select-String "extension_dir"
```

Then check if these files exist:
```powershell
# Replace C:\php\ext with your actual extension directory
Test-Path "C:\php\ext\php_pdo_mysql.dll"
Test-Path "C:\php\ext\php_mysqli.dll"
```

**If files are missing:**
- You may need to download PHP with MySQL extensions
- Or use XAMPP/WAMP which includes them

## Step 5: Restart PHP Server

1. **Stop your current PHP server** (if running):
   - Go to the terminal where `php -S localhost:8000` is running
   - Press `Ctrl+C`

2. **Start it again:**
   ```powershell
   cd cms-backend
   php -S localhost:8000
   ```

## Step 6: Verify It's Enabled

Run the check script again:

```powershell
php check-php-extensions.php
```

You should now see:
```
✓ pdo_mysql            PDO MySQL Driver
```

Or verify directly:
```powershell
php -m | Select-String "pdo_mysql"
```

Should output: `pdo_mysql`

## Troubleshooting

### If you can't find `extension=pdo_mysql` in php.ini:

**Add it manually:**
1. Find the section that has other `extension=` lines (usually around line 900-1000)
2. Add these lines:
   ```ini
   extension=pdo_mysql
   extension=mysqli
   ```
3. Save and restart

### If you get "Unable to load dynamic library":

1. Check the `extension_dir` path is correct:
   ```powershell
   php -i | Select-String "extension_dir"
   ```

2. Make sure the DLL files exist in that directory

3. Check the file names match exactly (case-sensitive on some systems)

### If using XAMPP:

1. Edit: `C:\xampp\php\php.ini`
2. Follow the same steps above
3. Restart Apache/XAMPP services

### If using WAMP:

1. Click WAMP icon in system tray
2. Go to: PHP → PHP Extensions
3. Check: `php_pdo_mysql` and `php_mysqli`
4. Restart WAMP services

## Still Having Issues?

1. **Check PHP version:**
   ```powershell
   php -v
   ```
   Must be PHP 8.0 or higher

2. **Check if you have multiple PHP installations:**
   ```powershell
   where.exe php
   ```
   Make sure you're editing the correct php.ini

3. **Verify extension directory:**
   ```powershell
   php -r "echo ini_get('extension_dir');"
   ```

4. **Test database connection after enabling:**
   ```powershell
   php check-php-extensions.php
   ```

Once `pdo_mysql` shows as `✓`, your database connection should work!
