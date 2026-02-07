# CMS Management System - Setup Guide

Complete setup guide for the CivicCast CMS Management System backend.

## Prerequisites

- PHP 8.0 or higher
- MySQL 5.7 or higher (or MariaDB 10.3+)
- Composer (PHP dependency manager)
- Apache/Nginx web server
- PHP Extensions:
  - PDO
  - PDO_MySQL
  - GD (for image cropping)
  - OpenSSL (for JWT)
  - JSON
  - mbstring

## Installation Steps

### 1. Clone/Download the Project

```bash
cd cms-backend
```

### 2. Install Dependencies

```bash
composer install
```

This will install:
- Firebase JWT library for token generation
- Other required dependencies

### 3. Database Setup

#### Create Database

```sql
CREATE DATABASE civiccast_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Import Schema

```bash
mysql -u root -p civiccast_cms < database/schema.sql
```

Or using MySQL Workbench/phpMyAdmin, import the `database/schema.sql` file.

The schema includes:
- All required tables with proper foreign keys
- Indexes for performance
- Default admin user (username: `admin`, password: `admin123`)

**⚠️ IMPORTANT:** Change the default admin password after first login!

### 4. Environment Configuration

Create a `.env` file in the `cms-backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=civiccast_cms
DB_USER=root
DB_PASS=your_password_here

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production-use-a-strong-random-string

# Application Configuration
APP_DEBUG=false
BASE_URL=http://localhost/cms-backend
FRONTEND_URL=http://localhost:3000
```

**Generate a strong JWT secret:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 5. Web Server Configuration

#### Apache (.htaccess)

Create or update `.htaccess` in the `cms-backend` directory:

```apache
RewriteEngine On
RewriteBase /cms-backend/

# Handle CORS preflight requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Route all requests to index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

#### Nginx Configuration

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
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # CORS headers
    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

### 6. Directory Permissions

Ensure upload directories are writable:

```bash
# Linux/Mac
chmod -R 755 uploads/
chown -R www-data:www-data uploads/

# Windows
# Right-click uploads folder → Properties → Security → Add write permissions
```

### 7. PHP Configuration

Update `php.ini` if needed:

```ini
upload_max_filesize = 10M
post_max_size = 10M
memory_limit = 256M
max_execution_time = 300
```

### 8. Verify Installation

#### Check PHP Extensions

Visit: `http://localhost/cms-backend/check-php-extensions.php`

Or run:
```bash
php check-php-extensions.php
```

#### Test Database Connection

Visit: `http://localhost/cms-backend/setup-check.php`

#### Test API

```bash
# Test login endpoint
curl -X POST http://localhost/cms-backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"admin","password":"admin123","role":"admin"}'
```

## Project Structure

```
cms-backend/
├── config/
│   ├── app.php              # Application configuration
│   ├── database.php         # Database configuration
│   └── jwt.php              # JWT configuration
├── controllers/
│   ├── AdvertisementController.php
│   ├── AuthController.php
│   ├── CategoryController.php
│   ├── DashboardController.php
│   ├── NewsController.php
│   ├── OperatorController.php
│   └── SubCategoryController.php
├── database/
│   └── schema.sql           # Database schema
├── middleware/
│   ├── AuthMiddleware.php   # JWT authentication
│   └── RoleMiddleware.php   # Role-based access control
├── models/
│   ├── Admin.php
│   ├── Advertisement.php
│   ├── Category.php
│   ├── News.php
│   ├── NewsImage.php
│   ├── Notification.php
│   ├── Operator.php
│   └── SubCategory.php
├── routes/
│   └── api.php              # API routes
├── uploads/
│   ├── advertisements/     # Advertisement images
│   └── news/               # News images
├── utils/
│   ├── Database.php        # Database singleton
│   ├── FileUpload.php      # File upload handling
│   ├── helpers.php         # Helper functions
│   ├── JWT.php             # JWT utility
│   ├── Response.php        # Response formatting
│   └── Validator.php        # Input validation
├── vendor/                 # Composer dependencies
├── .env                    # Environment variables (create this)
├── composer.json
├── index.php               # Entry point
└── README.md
```

## Default Credentials

**Admin:**
- Username/Email: `admin` or `admin@civiccast.com`
- Password: `admin123`

**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION!**

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET in .env
- [ ] Set APP_DEBUG=false in production
- [ ] Configure proper CORS origins
- [ ] Use HTTPS in production
- [ ] Set proper file permissions
- [ ] Keep dependencies updated
- [ ] Use prepared statements (already implemented)
- [ ] Validate all inputs (already implemented)
- [ ] Hash all passwords (already implemented)

## Troubleshooting

### Database Connection Error

1. Check database credentials in `.env`
2. Ensure MySQL is running
3. Verify database exists
4. Check user permissions

### JWT Token Invalid

1. Verify JWT_SECRET is set correctly
2. Check token expiration (24 hours)
3. Ensure Authorization header format: `Bearer {token}`

### File Upload Fails

1. Check `uploads/` directory permissions
2. Verify PHP upload_max_filesize
3. Check allowed image types in config/app.php

### CORS Errors

1. Update FRONTEND_URL in `.env`
2. Check CORS headers in routes/api.php
3. Verify web server CORS configuration

### Image Cropping Not Working

1. Ensure GD extension is installed
2. Check PHP version (PHP 7.0+ required for imagecrop)
3. Verify image file permissions

## Development vs Production

### Development
- Set `APP_DEBUG=true`
- Use HTTP
- Enable error display
- Use test data

### Production
- Set `APP_DEBUG=false`
- Use HTTPS
- Disable error display
- Use strong secrets
- Enable logging
- Set proper file permissions
- Configure firewall rules

## API Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost/cms-backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"admin","password":"admin123","role":"admin"}'

# Get dashboard stats (replace TOKEN with actual token)
curl -X GET http://localhost/cms-backend/api/admin/dashboard \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API collection (if available)
2. Set base URL: `http://localhost/cms-backend`
3. Login to get token
4. Set token in Authorization header for protected routes

## Next Steps

1. Review `API_DOCUMENTATION.md` for complete API reference
2. Integrate with React frontend
3. Set up production environment
4. Configure backup strategy
5. Set up monitoring and logging

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check error logs
4. Verify configuration files
