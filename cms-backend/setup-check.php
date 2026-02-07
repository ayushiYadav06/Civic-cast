<?php
/**
 * Setup Verification Script
 * Run this to check if your installation is properly configured
 */

echo "=== CMS Backend Setup Verification ===\n\n";

$errors = [];
$warnings = [];
$success = [];

// Check PHP Version
echo "1. Checking PHP version... ";
$phpVersion = phpversion();
if (version_compare($phpVersion, '8.0.0', '>=')) {
    echo "✓ PHP $phpVersion\n";
    $success[] = "PHP version: $phpVersion";
} else {
    echo "✗ PHP $phpVersion (Required: 8.0+)\n";
    $errors[] = "PHP version must be 8.0 or higher";
}

// Check Required Extensions
echo "\n2. Checking required PHP extensions...\n";
$requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'gd', 'mbstring', 'curl', 'openssl'];
foreach ($requiredExtensions as $ext) {
    if (extension_loaded($ext)) {
        echo "  ✓ $ext\n";
        $success[] = "Extension $ext is loaded";
    } else {
        echo "  ✗ $ext (MISSING)\n";
        $errors[] = "Required extension '$ext' is not installed";
    }
}

// Check FileInfo (recommended)
if (extension_loaded('fileinfo')) {
    echo "  ✓ fileinfo\n";
} else {
    echo "  ⚠ fileinfo (RECOMMENDED - not critical)\n";
    $warnings[] = "FileInfo extension is recommended but not critical";
}

// Check Composer dependencies
echo "\n3. Checking Composer dependencies...\n";
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo "  ✓ vendor/autoload.php exists\n";
    $success[] = "Composer dependencies installed";
    
    // Check firebase/jwt
    if (file_exists(__DIR__ . '/vendor/firebase')) {
        echo "  ✓ firebase/php-jwt package found\n";
    } else {
        echo "  ✗ firebase/php-jwt package not found\n";
        $errors[] = "Required package firebase/php-jwt is missing. Run 'composer install'";
    }
} else {
    echo "  ✗ vendor/autoload.php not found\n";
    $errors[] = "Composer dependencies not installed. Run 'composer install'";
}

// Check .env file
echo "\n4. Checking configuration...\n";
if (file_exists(__DIR__ . '/.env')) {
    echo "  ✓ .env file exists\n";
    $success[] = ".env file exists";
    
    // Try to load config
    try {
        if (file_exists(__DIR__ . '/config/database.php')) {
            // Load environment variables
            if (file_exists(__DIR__ . '/.env')) {
                $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos(trim($line), '#') === 0) continue;
                    if (strpos($line, '=') === false) continue;
                    list($name, $value) = explode('=', $line, 2);
                    $name = trim($name);
                    $value = trim($value);
                    if (!array_key_exists($name, $_ENV)) {
                        $_ENV[$name] = $value;
                        putenv("$name=$value");
                    }
                }
            }
            
            $config = require __DIR__ . '/config/database.php';
            echo "  ✓ Database configuration loaded\n";
        }
    } catch (Exception $e) {
        echo "  ✗ Error loading configuration: " . $e->getMessage() . "\n";
        $errors[] = "Configuration error: " . $e->getMessage();
    }
} else {
    echo "  ✗ .env file not found\n";
    $errors[] = ".env file not found. Create one based on .env.example";
}

// Check Database Connection
echo "\n5. Checking database connection...\n";
try {
    if (file_exists(__DIR__ . '/config/database.php')) {
        $config = require __DIR__ . '/config/database.php';
        
        $dsn = sprintf(
            "mysql:host=%s;port=%d;dbname=%s;charset=%s",
            $config['host'],
            $config['port'],
            $config['dbname'],
            $config['charset']
        );
        
        $pdo = new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        
        echo "  ✓ Database connection successful\n";
        $success[] = "Database connection successful";
        
        // Check if tables exist
        $tables = ['admins', 'operators', 'categories', 'sub_categories', 'news', 'news_images', 'advertisements', 'notifications'];
        $missingTables = [];
        
        foreach ($tables as $table) {
            $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() == 0) {
                $missingTables[] = $table;
            }
        }
        
        if (empty($missingTables)) {
            echo "  ✓ All required tables exist\n";
            $success[] = "All database tables exist";
        } else {
            echo "  ✗ Missing tables: " . implode(', ', $missingTables) . "\n";
            $errors[] = "Database tables missing. Import database/schema.sql";
        }
        
        // Check for default admin
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
        $adminCount = $stmt->fetch()['count'];
        if ($adminCount > 0) {
            echo "  ✓ Admin user exists\n";
            $success[] = "Default admin user found";
        } else {
            echo "  ⚠ No admin user found\n";
            $warnings[] = "No admin user in database. Run database/schema.sql";
        }
        
    } else {
        echo "  ✗ Database configuration file not found\n";
        $errors[] = "config/database.php not found";
    }
} catch (PDOException $e) {
    echo "  ✗ Database connection failed: " . $e->getMessage() . "\n";
    $errors[] = "Database connection failed: " . $e->getMessage();
}

// Check Upload Directories
echo "\n6. Checking upload directories...\n";
$uploadDirs = ['uploads', 'uploads/news', 'uploads/advertisements'];
foreach ($uploadDirs as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (is_dir($path)) {
        if (is_writable($path)) {
            echo "  ✓ $dir exists and is writable\n";
            $success[] = "$dir is writable";
        } else {
            echo "  ✗ $dir exists but is NOT writable\n";
            $errors[] = "$dir is not writable. Fix permissions";
        }
    } else {
        echo "  ✗ $dir does not exist\n";
        $errors[] = "$dir directory missing";
    }
}

// Check .htaccess
echo "\n7. Checking .htaccess file...\n";
if (file_exists(__DIR__ . '/.htaccess')) {
    echo "  ✓ .htaccess file exists\n";
    $success[] = ".htaccess file exists";
} else {
    echo "  ⚠ .htaccess file not found (optional for PHP built-in server)\n";
    $warnings[] = ".htaccess file missing (required for Apache)";
}

// Summary
echo "\n" . str_repeat("=", 50) . "\n";
echo "SUMMARY\n";
echo str_repeat("=", 50) . "\n\n";

if (empty($errors) && empty($warnings)) {
    echo "✓ All checks passed! Your setup looks good.\n";
} else {
    if (!empty($success)) {
        echo "✓ Successful checks: " . count($success) . "\n";
    }
    
    if (!empty($warnings)) {
        echo "⚠ Warnings: " . count($warnings) . "\n";
        foreach ($warnings as $warning) {
            echo "  - $warning\n";
        }
    }
    
    if (!empty($errors)) {
        echo "\n✗ Errors: " . count($errors) . "\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
        echo "\nPlease fix the errors above before running the application.\n";
        exit(1);
    }
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "You can now start the server with:\n";
echo "  php -S localhost:8000\n";
echo "\nOr test the login endpoint:\n";
echo "  curl -X POST http://localhost:8000/api/auth/login \\\n";
echo "    -H \"Content-Type: application/json\" \\\n";
echo "    -d '{\"email_or_username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}'\n";
echo str_repeat("=", 50) . "\n";

