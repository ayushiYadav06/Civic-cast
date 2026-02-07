# Quick Fix: Enable GD Extension

## Your PHP Configuration
- **PHP Version:** 8.4.16
- **php.ini Location:** `C:\Program Files\php-8.4.16\php.ini`

## Steps to Enable GD Extension

### Step 1: Open php.ini File

**Run PowerShell as Administrator** and execute:

```powershell
notepad "C:\Program Files\php-8.4.16\php.ini"
```

Or open it in VS Code:
```powershell
code "C:\Program Files\php-8.4.16\php.ini"
```

### Step 2: Find and Enable GD Extension

1. Press `Ctrl+F` to search
2. Search for: `extension=gd`
3. You'll find a line like: `;extension=gd`
4. **Remove the semicolon** (`;`) at the beginning:
   - Change: `;extension=gd`
   - To: `extension=gd`
5. **Save the file** (Ctrl+S)

### Step 3: Check Extension File Exists

Run this command to verify the GD DLL file exists:

```powershell
Test-Path "C:\Program Files\php-8.4.16\ext\php_gd.dll"
```

If it returns `True`, the file exists. If `False`, you may need to:
- Download PHP with GD extension included
- Or install Visual C++ Redistributable

### Step 4: Restart PHP Server

1. Stop your current server (Ctrl+C in the terminal running `php -S localhost:8000`)
2. Start it again:
   ```powershell
   cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
   php -S localhost:8000
   ```

### Step 5: Verify GD is Enabled

Run the setup check:
```powershell
php setup-check.php
```

You should now see: `✓ gd` instead of `✗ gd (MISSING)`

## Alternative: Quick Test

Test if GD is working:
```powershell
php -r "echo function_exists('imagecreatefromjpeg') ? 'GD Enabled ✓' : 'GD NOT Enabled ✗';"
```

## If Extension File is Missing

If `php_gd.dll` doesn't exist in `C:\Program Files\php-8.4.16\ext\`:

1. **Download PHP with extensions:**
   - Visit: https://windows.php.net/download/
   - Download PHP 8.4 Thread Safe (TS) x64
   - Extract and copy `php_gd.dll` to your `ext` folder

2. **Or install Visual C++ Redistributable:**
   - Download: https://aka.ms/vs/17/release/vc_redist.x64.exe
   - Install it
   - Restart your computer

## What GD Extension Does

GD is required for:
- ✅ Image cropping (advertisement images)
- ✅ Image resizing
- ✅ Image format conversion
- ✅ Image manipulation features

**Without GD:** Your API will work, but image cropping features will fail.

## Summary

1. ✅ Edit: `C:\Program Files\php-8.4.16\php.ini`
2. ✅ Change: `;extension=gd` → `extension=gd`
3. ✅ Save the file
4. ✅ Restart PHP server
5. ✅ Run `php setup-check.php` to verify

Once enabled, all checks should pass! 🎉
