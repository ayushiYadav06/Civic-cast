# Troubleshooting 500 Internal Server Errors

## Quick Fixes

### 1. Enable Error Display (Temporary)

I've updated `index.php` to show errors. Now when you make an API call, you should see the actual error message in the response.

### 2. Check Debug Page

Visit: `http://localhost:8000/debug.php` (or your backend URL)

This will show:
- PHP version
- Required extensions
- Database connection status
- Environment configuration
- Upload directory permissions

### 3. Common Issues

#### Issue: Database Connection Failed

**Symptoms:**
- All API calls return 500
- Error mentions "Database connection failed"

**Solution:**
1. Check if MySQL is running
2. Verify `.env` file exists in `cms-backend/` directory
3. Check database credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=civiccast_cms
   DB_USER=root
   DB_PASS=your_password
   ```
4. Verify database exists:
   ```sql
   SHOW DATABASES;
   ```

#### Issue: Missing .env File

**Symptoms:**
- 500 errors on all endpoints
- Database connection errors

**Solution:**
1. Create `.env` file in `cms-backend/` directory
2. Add:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=civiccast_cms
   DB_USER=root
   DB_PASS=
   
   JWT_SECRET=your-secret-key-here
   APP_DEBUG=true
   BASE_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:3000
   ```

#### Issue: Missing Composer Dependencies

**Symptoms:**
- "Class not found" errors
- Firebase JWT errors

**Solution:**
```bash
cd cms-backend
composer install
```

#### Issue: Path Routing Problems

**Symptoms:**
- 404 or 500 errors
- Routes not matching

**Solution:**
1. Test endpoint: `http://localhost:8000/api/test`
2. Should return: `{"success": true, "message": "Backend is working!"}`
3. If this works, routing is fine
4. If not, check your server configuration

#### Issue: Missing PHP Extensions

**Symptoms:**
- "Call to undefined function" errors
- Database connection issues

**Solution:**
Check required extensions:
- PDO
- PDO_MySQL
- JSON
- GD (for image cropping)
- mbstring
- OpenSSL

Enable in `php.ini`:
```ini
extension=pdo_mysql
extension=gd
extension=mbstring
extension=openssl
```

### 4. Check Error Logs

**Windows (XAMPP):**
- `C:\xampp\php\logs\php_error_log`
- `C:\xampp\apache\logs\error.log`

**Linux:**
- `/var/log/apache2/error.log`
- `/var/log/nginx/error.log`
- `/var/log/php/error.log`

**macOS:**
- Check system logs or PHP error log location

### 5. Test Database Connection Manually

Create `test-db.php` in `cms-backend/`:

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';

// Load .env
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

$config = require __DIR__ . '/config/database.php';

try {
    $dsn = sprintf(
        "mysql:host=%s;port=%d;dbname=%s;charset=%s",
        $config['host'],
        $config['port'],
        $config['dbname'],
        $config['charset']
    );
    
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    echo "✓ Database connection successful!\n";
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $result = $stmt->fetch();
    echo "✓ Admins table accessible. Count: " . $result['count'] . "\n";
    
} catch (PDOException $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
    echo "Host: " . $config['host'] . "\n";
    echo "Database: " . $config['dbname'] . "\n";
    echo "User: " . $config['username'] . "\n";
}
```

Run: `php test-db.php`

### 6. Verify Backend is Running

**Test with curl:**
```bash
curl http://localhost:8000/api/test
```

**Expected response:**
```json
{
  "success": true,
  "message": "Backend is working!",
  "path": "/api/test",
  "method": "GET"
}
```

### 7. Check CORS Configuration

If you see CORS errors in browser console:
1. Verify `FRONTEND_URL` in `.env` matches React app URL
2. Should be: `FRONTEND_URL=http://localhost:3000`
3. Restart PHP server after changing `.env`

### 8. Step-by-Step Debugging

1. **Visit debug.php:**
   ```
   http://localhost:8000/debug.php
   ```
   Check all items show ✓

2. **Test API endpoint:**
   ```
   http://localhost:8000/api/test
   ```
   Should return success message

3. **Test login endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email_or_username":"admin","password":"admin123","role":"admin"}'
   ```

4. **Check browser console:**
   - Open DevTools → Network tab
   - Make an API call
   - Click on the failed request
   - Check "Response" tab for error details

### 9. Common Error Messages

**"Database connection failed"**
→ Check MySQL is running and credentials are correct

**"Class 'App\Utils\Database' not found"**
→ Run `composer install` or check autoloader

**"Call to undefined function"**
→ Missing PHP extension, enable in php.ini

**"Route not found"**
→ Check path handling in routes/api.php

**"JWT secret not set"**
→ Add JWT_SECRET to .env file

### 10. Production vs Development

For development, ensure `.env` has:
```env
APP_DEBUG=true
```

This enables detailed error messages.

For production:
```env
APP_DEBUG=false
```

## Still Having Issues?

1. Check `debug.php` output
2. Check PHP error logs
3. Check browser console for actual error messages
4. Verify all steps in SETUP_GUIDE.md
5. Test database connection manually
6. Verify all dependencies are installed
