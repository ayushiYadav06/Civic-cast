# Complete Setup Guide - CMS Backend

This guide will walk you through the complete installation and setup process for the CivicCast CMS Backend API.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: System Requirements Check](#step-1-system-requirements-check)
3. [Step 2: Install PHP and Composer](#step-2-install-php-and-composer)
4. [Step 3: Install MySQL](#step-3-install-mysql)
5. [Step 4: Setup Database](#step-4-setup-database)
6. [Step 5: Install Dependencies](#step-5-install-dependencies)
7. [Step 6: Configure Environment](#step-6-configure-environment)
8. [Step 7: Setup Web Server](#step-7-setup-web-server)
9. [Step 8: Configure Permissions](#step-8-configure-permissions)
10. [Step 9: Test the Installation](#step-9-test-the-installation)
11. [Step 10: Running the Server](#step-10-running-the-server)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- Windows 10/11, Linux, or macOS
- Administrator/root access
- Internet connection
- Text editor (VS Code, Sublime Text, etc.)
- Terminal/Command Prompt access

---

## Step 1: System Requirements Check

### Required PHP Version: 8.0 or Higher

**Check PHP Version:**
```bash
php -v
```

If PHP is not installed or version is below 8.0, proceed to Step 2.

**Required PHP Extensions:**
- PDO
- PDO_MySQL
- JSON
- GD (for image cropping)
- FileInfo (recommended)
- OpenSSL
- MBString
- cURL

**Check PHP Extensions:**
```bash
php -m
```

---

## Step 2: Install PHP and Composer

### Option A: Windows Installation

#### Install PHP 8.x

1. **Download PHP:**
   - Visit: https://windows.php.net/download/
   - Download PHP 8.x Thread Safe (TS) ZIP package
   - Extract to `C:\php`

2. **Configure PHP:**
   - Copy `php.ini-development` to `php.ini` in `C:\php`
   - Edit `php.ini` and uncomment (remove `;`):
     ```ini
     extension=pdo_mysql
     extension=gd
     extension=fileinfo
     extension=openssl
     extension=mbstring
     extension=curl
     extension=json
     ```

3. **Add PHP to PATH:**
   - Open System Properties → Environment Variables
   - Add `C:\php` to System PATH variable
   - Restart terminal/command prompt

4. **Verify Installation:**
   ```cmd
   php -v
   ```

#### Install Composer

1. **Download Composer:**
   - Visit: https://getcomposer.org/download/
   - Download and run `Composer-Setup.exe`
   - Follow the installer wizard
   - Select the PHP executable: `C:\php\php.exe`

2. **Verify Installation:**
   ```cmd
   composer --version
   ```

### Option B: Linux Installation (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install PHP 8.x and required extensions
sudo apt install -y php8.1 php8.1-cli php8.1-common php8.1-mysql php8.1-gd php8.1-mbstring php8.1-curl php8.1-xml php8.1-zip php8.1-json

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Verify installation
php -v
composer --version
```

### Option C: macOS Installation

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PHP
brew install php@8.1

# Add PHP to PATH
echo 'export PATH="/opt/homebrew/opt/php@8.1/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Install Composer
brew install composer

# Verify installation
php -v
composer --version
```

---

## Step 3: Install MySQL

### Option A: Windows

1. **Download MySQL:**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download MySQL Installer for Windows
   - Run installer and select "Developer Default" or "Server only"
   - Follow installation wizard
   - Set root password (remember this for later!)

2. **Add MySQL to PATH (if not done automatically):**
   - Usually installed to: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Add to System PATH

3. **Verify Installation:**
   ```cmd
   mysql --version
   ```

### Option B: Linux (Ubuntu/Debian)

```bash
# Install MySQL Server
sudo apt update
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Verify installation
mysql --version
```

### Option C: macOS

```bash
# Install MySQL using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation

# Verify installation
mysql --version
```

---

## Step 4: Setup Database

### 4.1: Create Database

**Option A: Using MySQL Command Line**

```bash
# Login to MySQL (use the root password you set)
mysql -u root -p

# Once logged in, run these commands:
CREATE DATABASE civiccast_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'civiccast_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON civiccast_cms.* TO 'civiccast_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Option B: Using phpMyAdmin**

1. Open phpMyAdmin in your browser (usually: http://localhost/phpmyadmin)
2. Click "New" to create a database
3. Database name: `civiccast_cms`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

### 4.2: Import Database Schema

**Using Command Line:**

```bash
# Navigate to the backend directory
cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"

# Import schema (replace with your MySQL root password)
mysql -u root -p civiccast_cms < database/schema.sql

# Or if using the created user:
mysql -u civiccast_user -p civiccast_cms < database/schema.sql
```

**Using phpMyAdmin:**

1. Select the `civiccast_cms` database
2. Click "Import" tab
3. Choose file: `database/schema.sql`
4. Click "Go"

**Verify Database Tables:**

```sql
USE civiccast_cms;
SHOW TABLES;
```

You should see these tables:
- admins
- operators
- categories
- sub_categories
- news
- news_images
- advertisements
- notifications

**Verify Default Admin User:**

```sql
SELECT id, username, email, name FROM admins;
```

You should see:
- Username: `admin`
- Email: `admin@civiccast.com`
- Default password: `admin123` (hashed)

---

## Step 5: Install Dependencies

### 5.1: Navigate to Backend Directory

```bash
cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
```

### 5.2: Install PHP Dependencies

```bash
composer install
```

This will install:
- `firebase/php-jwt` - For JWT authentication

**Expected Output:**
```
Loading composer repositories with package information
Installing dependencies (including require-dev) from lock file
Package operations: 1 install, 0 updates, 0 removals
  - Installing firebase/php-jwt (v6.8.0)
Writing lock file
Generating autoload files
```

### 5.3: Verify Installation

Check that `vendor/` directory exists:
```bash
# Windows
dir vendor

# Linux/macOS
ls -la vendor
```

---

## Step 6: Configure Environment

### 6.1: Create .env File

**Windows (Command Prompt):**
```cmd
cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
copy config\.env.example .env
```

**Linux/macOS:**
```bash
cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
cp config/.env.example .env
```

**Or manually create `.env` file** in the `cms-backend` directory with this content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=civiccast_cms
DB_USER=root
DB_PASS=your_mysql_root_password

# Or if you created a separate user:
# DB_USER=civiccast_user
# DB_PASS=your_secure_password

# JWT Configuration
# Generate a strong random string for production
JWT_SECRET=change-this-to-a-random-secret-key-in-production-use-openssl-rand-hex-32

# Application Configuration
APP_DEBUG=true
BASE_URL=http://localhost/cms-backend
FRONTEND_URL=http://localhost:3000
```

### 6.2: Generate JWT Secret (Recommended)

**Windows (PowerShell):**
```powershell
# Generate random hex string
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Linux/macOS:**
```bash
openssl rand -hex 32
```

Copy the generated string and replace `JWT_SECRET` value in `.env` file.

### 6.3: Update Database Credentials

Edit `.env` file and update:
- `DB_PASS` - Your MySQL root password (or the user password you created)
- `DB_USER` - Your MySQL username (root or civiccast_user)
- `BASE_URL` - Your backend URL (adjust port if needed)
- `FRONTEND_URL` - Your React frontend URL

### 6.4: Verify Configuration

**Test Database Connection:**

Create a test file `test-db.php` in `cms-backend` directory:

```php
<?php
require_once 'config/database.php';
$config = require 'config/database.php';

try {
    $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['dbname']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    echo "Database connection successful!\n";
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
}
```

Run the test:
```bash
php test-db.php
```

If successful, delete the test file:
```bash
# Windows
del test-db.php

# Linux/macOS
rm test-db.php
```

---

## Step 7: Setup Web Server

### Option A: Using PHP Built-in Server (Development Only)

This is the simplest option for development and testing.

**Start PHP Development Server:**

```bash
cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
php -S localhost:8000
```

**Access API:**
- Base URL: http://localhost:8000
- Example endpoint: http://localhost:8000/api/auth/login

**Note:** Update `BASE_URL` in `.env` to `http://localhost:8000` if using this option.

### Option B: Using XAMPP (Windows)

1. **Download XAMPP:**
   - Visit: https://www.apachefriends.org/
   - Download and install XAMPP

2. **Copy Backend to htdocs:**
   ```cmd
   xcopy "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend" "C:\xampp\htdocs\cms-backend" /E /I
   ```

3. **Start Apache:**
   - Open XAMPP Control Panel
   - Start Apache service

4. **Access API:**
   - Base URL: http://localhost/cms-backend
   - Example endpoint: http://localhost/cms-backend/api/auth/login

### Option C: Using Apache (Linux/macOS)

1. **Install Apache:**
   ```bash
   # Ubuntu/Debian
   sudo apt install apache2
   
   # macOS (already installed or use Homebrew)
   brew install httpd
   ```

2. **Enable mod_rewrite:**
   ```bash
   # Ubuntu/Debian
   sudo a2enmod rewrite
   
   # macOS
   # Already enabled or edit httpd.conf
   ```

3. **Configure Virtual Host:**
   
   Create file: `/etc/apache2/sites-available/cms-backend.conf` (Ubuntu/Debian)
   
   ```apache
   <VirtualHost *:80>
       ServerName localhost
       DocumentRoot /path/to/cms-backend
       
       <Directory /path/to/cms-backend>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       
       ErrorLog ${APACHE_LOG_DIR}/cms-backend_error.log
       CustomLog ${APACHE_LOG_DIR}/cms-backend_access.log combined
   </VirtualHost>
   ```

4. **Enable Site:**
   ```bash
   sudo a2ensite cms-backend.conf
   sudo systemctl restart apache2
   ```

### Option D: Using Nginx

1. **Install Nginx:**
   ```bash
   # Ubuntu/Debian
   sudo apt install nginx
   
   # macOS
   brew install nginx
   ```

2. **Configure Nginx:**

   Edit: `/etc/nginx/sites-available/cms-backend` (Linux) or `/opt/homebrew/etc/nginx/servers/cms-backend.conf` (macOS)

   ```nginx
   server {
       listen 80;
       server_name localhost;
       root /path/to/cms-backend;
       index index.php;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           include fastcgi_params;
       }

       location ~ /\.ht {
           deny all;
       }
   }
   ```

3. **Start Nginx:**
   ```bash
   # Linux
   sudo systemctl start nginx
   sudo systemctl enable nginx
   
   # macOS
   brew services start nginx
   ```

---

## Step 8: Configure Permissions

### Windows

Make sure the `uploads` directory is writable:

```cmd
# Give full control to users (adjust path as needed)
icacls "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend\uploads" /grant Users:F /T
```

### Linux/macOS

```bash
cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"

# Set proper permissions
chmod -R 755 uploads
chmod -R 755 uploads/news
chmod -R 755 uploads/advertisements

# If using Apache, change ownership (adjust user as needed)
sudo chown -R www-data:www-data uploads
# Or for macOS:
# sudo chown -R _www:_www uploads
```

---

## Step 9: Test the Installation

### 9.1: Test Login Endpoint

**Using cURL:**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email_or_username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@civiccast.com",
      "name": "System Administrator",
      "role": "admin"
    }
  }
}
```

**Using Postman:**

1. Open Postman
2. Create new request
3. Method: POST
4. URL: `http://localhost:8000/api/auth/login`
5. Headers: `Content-Type: application/json`
6. Body (raw JSON):
   ```json
   {
     "email_or_username": "admin",
     "password": "admin123",
     "role": "admin"
   }
   ```
7. Click "Send"

### 9.2: Test Dashboard Endpoint (Requires Authentication)

```bash
# First, get token from login response
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:8000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### 9.3: Test Public Endpoints

```bash
# Get approved news
curl -X GET http://localhost:8000/api/news

# Get active advertisements
curl -X GET http://localhost:8000/api/advertisements
```

---

## Step 10: Running the Server

### Development Mode (PHP Built-in Server)

**Start Server:**
```bash
cd "C:\Users\HP\Desktop\Innobimb\CivicCast Website Design\cms-backend"
php -S localhost:8000
```

**Server will run until you press Ctrl+C**

**To run in background (Linux/macOS):**
```bash
php -S localhost:8000 > server.log 2>&1 &
```

### Production Mode (Apache/Nginx)

**Apache:**
```bash
# Linux
sudo systemctl start apache2
sudo systemctl enable apache2

# macOS
sudo apachectl start
```

**Nginx:**
```bash
# Linux
sudo systemctl start nginx
sudo systemctl enable nginx

# macOS
brew services start nginx
```

### Verify Server is Running

**Check if server is responding:**
```bash
curl http://localhost:8000/api/auth/login
```

You should get an error about missing data (which is expected) or a proper response.

---

## Troubleshooting

### Issue 1: "Class not found" or Autoloader Errors

**Solution:**
```bash
# Regenerate autoload files
composer dump-autoload
```

### Issue 2: Database Connection Failed

**Check:**
1. MySQL service is running:
   ```bash
   # Windows
   sc query MySQL80
   
   # Linux
   sudo systemctl status mysql
   
   # macOS
   brew services list
   ```

2. Database credentials in `.env` are correct
3. Database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. User has permissions

**Test connection manually:**
```php
<?php
$pdo = new PDO('mysql:host=localhost;dbname=civiccast_cms', 'root', 'password');
echo "Connected!";
```

### Issue 3: 500 Internal Server Error

**Enable error display temporarily:**
Edit `index.php` and add at the top:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

**Check PHP error logs:**
- Windows (XAMPP): `C:\xampp\php\logs\php_error_log`
- Linux: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`
- macOS: Check system logs

### Issue 4: CORS Errors in Browser

**Solution:**
1. Check `FRONTEND_URL` in `.env` matches your React app URL exactly
2. Ensure CORS headers are being sent (check browser network tab)
3. Clear browser cache

### Issue 5: File Upload Not Working

**Check:**
1. `uploads/` directory permissions (must be writable)
2. PHP `upload_max_filesize` and `post_max_size` in `php.ini`
3. `uploads/` directory exists

**Fix permissions:**
```bash
chmod -R 755 uploads
```

### Issue 6: Route Not Found (404)

**Check:**
1. `.htaccess` file exists and is readable
2. Apache `mod_rewrite` is enabled
3. Base URL in `.env` is correct
4. Routes file is being loaded (check `routes/api.php`)

**For PHP built-in server, routes might not work. Use:**
```bash
php -S localhost:8000 -t . router.php
```

Create `router.php`:
```php
<?php
// For PHP built-in server
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}
require_once __DIR__ . '/index.php';
```

### Issue 7: JWT Token Invalid/Expired

**Check:**
1. `JWT_SECRET` in `.env` hasn't changed
2. Token is being sent in Authorization header: `Bearer {token}`
3. Token hasn't expired (default 24 hours)

**Generate new token by logging in again**

### Issue 8: Image Upload/Cropping Not Working

**Check:**
1. GD extension is installed: `php -m | grep gd`
2. File permissions on `uploads/` directory
3. PHP `memory_limit` is sufficient (at least 128M)

**Install GD extension:**
```bash
# Ubuntu/Debian
sudo apt install php8.1-gd

# macOS
# Already included or reinstall PHP
```

---

## Quick Start Checklist

- [ ] PHP 8.0+ installed and in PATH
- [ ] Composer installed
- [ ] MySQL installed and running
- [ ] Database `civiccast_cms` created
- [ ] Schema imported (`database/schema.sql`)
- [ ] Composer dependencies installed (`composer install`)
- [ ] `.env` file created and configured
- [ ] Database credentials in `.env` are correct
- [ ] `uploads/` directory has write permissions
- [ ] Web server configured (PHP built-in, Apache, or Nginx)
- [ ] Server is running
- [ ] Login test successful

---

## Next Steps

After successful setup:

1. **Change default admin password:**
   - Log in with default credentials
   - Update password through the API or directly in database

2. **Connect React Frontend:**
   - Update API base URL in your React app
   - Test API endpoints

3. **Configure Production Settings:**
   - Set `APP_DEBUG=false` in `.env`
   - Use strong `JWT_SECRET`
   - Configure proper web server (Apache/Nginx)
   - Set up SSL/HTTPS

4. **Create First Operator:**
   - Use Admin account to create operators
   - Save auto-generated login credentials

---

## Support

If you encounter issues not covered here:
1. Check error logs
2. Verify all prerequisites are met
3. Review the README.md for API documentation
4. Check PHP and MySQL versions are compatible

---

**Setup Complete!** 🎉

Your CMS Backend API should now be running and ready to accept requests from your React frontend.

