# How to Enable GD Extension on Windows

## Quick Fix Guide

Your check shows: `✗ gd (MISSING)`. Follow these steps:

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

## Step 3: Enable GD Extension

1. **Press `Ctrl+F`** to open search in your text editor

2. **Search for:** `extension=gd`

3. **You'll find a line like this:**
   ```ini
   ;extension=gd
   ```
   
   Notice the `;` at the beginning - this **disables** the extension.

4. **Remove the semicolon** to enable it:
   ```ini
   extension=gd
   ```

5. **Save the file** (Ctrl+S)

## Step 4: Verify Extension Files Exist

Check if the DLL file exists in your PHP `ext` folder:

```powershell
# Find your PHP extension directory
php -i | Select-String "extension_dir"
```

Then check if this file exists:
```powershell
# Replace C:\php\ext with your actual extension directory
Test-Path "C:\php\ext\php_gd2.dll"
```

**Note:** On PHP 8.x, the file might be named `php_gd.dll` instead of `php_gd2.dll`

**If files are missing:**
- You may need to download PHP with GD extension
- Or use XAMPP/WAMP which includes it
- Or install Visual C++ Redistributable (GD requires it)

## Step 5: Install Visual C++ Redistributable (If Needed)

GD extension requires Visual C++ Redistributable. Download and install:

**For PHP 8.x (64-bit):**
- Download: [Microsoft Visual C++ Redistributable for Visual Studio 2015-2022](https://aka.ms/vs/17/release/vc_redist.x64.exe)

**For PHP 8.x (32-bit):**
- Download: [Microsoft Visual C++ Redistributable for Visual Studio 2015-2022 (x86)](https://aka.ms/vs/17/release/vc_redist.x86.exe)

## Step 6: Restart PHP Server

1. **Stop your current PHP server** (if running):
   - Go to the terminal where `php -S localhost:8000` is running
   - Press `Ctrl+C`

2. **Start it again:**
   ```powershell
   cd cms-backend
   php -S localhost:8000
   ```

## Step 7: Verify It's Enabled

Run the check script again:

```powershell
php setup-check.php
```

You should now see:
```
  ✓ gd
```

Or verify directly:
```powershell
php -m | Select-String "gd"
```

Should output: `gd`

Or check GD functions:
```powershell
php -r "echo function_exists('imagecreatefromjpeg') ? 'GD is enabled' : 'GD is NOT enabled';"
```

## Troubleshooting

### If you can't find `extension=gd` in php.ini:

**Add it manually:**
1. Find the section that has other `extension=` lines (usually around line 900-1000)
2. Add this line:
   ```ini
   extension=gd
   ```
3. Save and restart

### If you get "Unable to load dynamic library":

1. Check the `extension_dir` path is correct:
   ```powershell
   php -i | Select-String "extension_dir"
   ```

2. Make sure the DLL file exists in that directory:
   ```powershell
   # Check for both possible names
   Test-Path "C:\php\ext\php_gd.dll"
   Test-Path "C:\php\ext\php_gd2.dll"
   ```

3. Check the file names match exactly (case-sensitive on some systems)

4. Make sure Visual C++ Redistributable is installed

### If using XAMPP:

1. Edit: `C:\xampp\php\php.ini`
2. Follow the same steps above
3. Restart Apache/XAMPP services

### If using WAMP:

1. Click WAMP icon in system tray
2. Go to: PHP → PHP Extensions
3. Check: `php_gd2` or `php_gd`
4. Restart WAMP services

### If GD is enabled but image functions don't work:

Check which image formats are supported:
```powershell
php -r "print_r(gd_info());"
```

This will show which formats are enabled (JPEG, PNG, GIF, WebP, etc.)

## What GD Extension Does

The GD extension is required for:
- ✅ Image cropping functionality
- ✅ Image resizing
- ✅ Image format conversion
- ✅ Advertisement image processing

**Without GD:** Image uploads will work, but cropping features will fail.

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

4. **Check for conflicting extensions:**
   ```powershell
   php -m
   ```

5. **Test GD functions after enabling:**
   ```powershell
   php -r "var_dump(function_exists('imagecreatefromjpeg'));"
   ```
   Should output: `bool(true)`

Once `gd` shows as `✓` in setup-check.php, your image cropping features will work!
