# Quick Start Guide - 5 Minute Setup

This is a condensed version of the setup guide for experienced developers.

## Prerequisites Check

```bash
php -v        # Must be 8.0+
mysql --version
composer --version
php check-php-extensions.php  # Check required PHP extensions
```

**Important:** If `check-php-extensions.php` shows missing extensions (especially `pdo_mysql`), fix them before proceeding. See **Section 7: Troubleshooting** for details.

## 1. Install Dependencies

```bash
cd cms-backend
composer install
```

## 2. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE civiccast_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

```bash
mysql -u root -p civiccast_cms < database/schema.sql
```

## 3. Configure Environment

Create `.env` file in `cms-backend` directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=civiccast_cms
DB_USER=root
DB_PASS=your_mysql_password
JWT_SECRET=your-secret-key-here
APP_DEBUG=true
BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

## 4. Set Permissions

**Windows:**
```cmd
icacls uploads /grant Users:F /T
```

**Linux/macOS:**
```bash
chmod -R 755 uploads
```

## 5. Start Server

```bash
php -S localhost:8000
```

## 6. Test

### Where to Test the API

You can test the curl command in any of these terminals (open a **new terminal window** while keeping the server running):

- **PowerShell** (Windows default)
- **Command Prompt (cmd)**
- **Git Bash** (if installed)
- **Windows Terminal**

### Steps to Test

1. **Keep the server running** - Make sure `php -S localhost:8000` is still running in one terminal window.

2. **Open a new terminal window** - Open PowerShell, Command Prompt, or Git Bash.

3. **Run the curl command:**

   **For PowerShell:**
   ```powershell
   curl.exe -X POST http://localhost:8000/api/auth/login `
     -H "Content-Type: application/json" `
     -d '{\"email_or_username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}'
   ```
   
   **For Command Prompt (cmd):**
   ```cmd
   curl -X POST http://localhost:8000/api/auth/login ^
     -H "Content-Type: application/json" ^
     -d "{\"email_or_username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}"
   ```
   
   **For Git Bash / Linux / macOS:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"email_or_username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}"
   ```

4. **Expected Response:**
   - Success: You should receive a JSON response with a `token` and user information
   - Error: Check that the server is running and the database is properly configured

### Alternative: Using Postman or Browser Extensions

If curl doesn't work, you can also test using:
- **Postman** - Import the request or create manually
- **Thunder Client** (VS Code extension)
- **REST Client** (VS Code extension)

**Request Details:**
- **Method:** POST
- **URL:** `http://localhost:8000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email_or_username": "admin",
    "password": "admin123",
    "role": "admin"
  }
  ```

**Default Login:**
- Username: `admin`
- Password: `admin123`
- Role: `admin`

## 7. Troubleshooting Database Connection Errors

If you see **"Database connection failed"** error, follow these steps:

### ⚠️ Priority: "Could not find driver" Error

If you see **"could not find driver"** in the error message, this means PHP's PDO MySQL extension is not enabled. This must be fixed first!

**Check if PDO MySQL is enabled:**
```bash
php -m | findstr pdo_mysql
```

**Or use the provided check script:**
```bash
php check-php-extensions.php
```

This will show all required extensions and their status.

**Or create a test file manually:**
```php
<?php
echo "PDO available: " . (extension_loaded('pdo') ? 'Yes' : 'No') . "\n";
echo "PDO MySQL available: " . (extension_loaded('pdo_mysql') ? 'Yes' : 'No') . "\n";
echo "\nAll loaded extensions:\n";
print_r(get_loaded_extensions());
```

Run it:
```bash
php check-extensions.php
```

**Enable PDO MySQL Extension on Windows:**

**📖 For detailed step-by-step instructions, see [ENABLE_PDO_MYSQL.md](./ENABLE_PDO_MYSQL.md)**

**Quick Steps:**

1. **Find your PHP configuration file:**
   
   **Option A: Use the helper script:**
   ```powershell
   .\find-php-config.ps1
   ```
   This will show php.ini location, extension directory, and check if files exist.
   
   **Option B: Manual check:**
   ```powershell
   php --ini
   ```
   Note the path to `php.ini` (e.g., `C:\php\php.ini`)

2. **Open `php.ini` file** in a text editor (run as Administrator if needed):
   ```powershell
   notepad C:\php\php.ini
   ```
   (Replace `C:\php\php.ini` with your actual path)

3. **Search for** `extension=pdo_mysql` (Press Ctrl+F)

4. **Find the line:**
   ```ini
   ;extension=pdo_mysql
   ```
   **Remove the semicolon** (`;`) at the beginning:
   ```ini
   extension=pdo_mysql
   ```

5. **Also enable mysqli** (search for `extension=mysqli` and remove `;`):
   ```ini
   extension=mysqli
   ```

6. **Save the file** (Ctrl+S)

7. **Restart PHP server** (stop with Ctrl+C and start again)

8. **Verify it's enabled:**
   ```powershell
   php check-php-extensions.php
   ```
   Should now show: `✓ pdo_mysql`

**Alternative: If using XAMPP/WAMP:**
- XAMPP: Edit `C:\xampp\php\php.ini`
- WAMP: Use WAMP menu → PHP → PHP Extensions → Enable `php_pdo_mysql`

**If extension file is missing:**
- Download PHP from [php.net](https://windows.php.net/download/)
- Or reinstall XAMPP/WAMP with MySQL extensions included

### Step 1: Verify .env File Exists

Check if `.env` file exists in `cms-backend` directory:

**Windows PowerShell:**
```powershell
cd cms-backend
Test-Path .env
```

**Windows CMD:**
```cmd
cd cms-backend
dir .env
```

**Linux/macOS:**
```bash
cd cms-backend
ls -la .env
```

If the file doesn't exist, create it with the content from **Step 3** above.

### Step 2: Verify .env File Content

Open `.env` file and ensure it has correct values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=civiccast_cms
DB_USER=root
DB_PASS=your_actual_mysql_password
JWT_SECRET=your-secret-key-here
APP_DEBUG=true
BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `your_actual_mysql_password` with your real MySQL root password!

### Step 3: Verify MySQL is Running

**Windows:**
```cmd
# Check if MySQL service is running
sc query MySQL80
# Or check in Services (services.msc)
```

**Linux:**
```bash
sudo systemctl status mysql
# Or
sudo service mysql status
```

**macOS:**
```bash
brew services list | grep mysql
```

### Step 4: Test Database Connection Manually

Test if you can connect to MySQL:

```bash
mysql -u root -p
```

Enter your password. If this fails, MySQL is not running or credentials are wrong.

### Step 5: Verify Database Exists

Check if the database was created:

```sql
mysql -u root -p
SHOW DATABASES;
```

You should see `civiccast_cms` in the list. If not, create it:

```sql
CREATE DATABASE civiccast_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Then import the schema:

```bash
mysql -u root -p civiccast_cms < database/schema.sql
```

### Step 6: Check Error Details

With `APP_DEBUG=true` in your `.env` file, you'll see detailed error messages. Common issues:

- **"could not find driver"** → PDO MySQL extension not enabled (see Priority section above)
- **"Access denied"** → Wrong password in `.env` file
- **"Unknown database"** → Database doesn't exist (run Step 5)
- **"Connection refused"** → MySQL service is not running (run Step 3)
- **"Can't connect to MySQL server"** → Wrong host/port in `.env` file

### Step 7: Restart PHP Server

After fixing `.env` file, restart the PHP server:

1. Stop the current server (Ctrl+C)
2. Start it again:
   ```bash
   php -S localhost:8000
   ```

## Done! 🎉

For detailed instructions, see [SETUP.md](./SETUP.md)

