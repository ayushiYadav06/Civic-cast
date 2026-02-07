<?php
/**
 * Check Admin Password Hash
 * This script checks the current admin password hash in the database
 */

// Load environment variables from .env file
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) {
            continue;
        }
        if (strpos($line, '=') === false) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!empty($name)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
        }
    }
}

require_once __DIR__ . '/vendor/autoload.php';

use App\Utils\Database;

try {
    $db = Database::getInstance()->getConnection();
    
    echo "=== Checking Admin Password Hash ===\n\n";
    
    // Get admin user
    $stmt = $db->prepare("SELECT id, username, email, password, name FROM admins WHERE username = 'admin' OR email = 'admin@civiccast.com' LIMIT 1");
    $stmt->execute();
    $admin = $stmt->fetch();
    
    if (!$admin) {
        echo "✗ No admin user found in database!\n";
        echo "  You need to run setup-database.php first.\n";
        exit(1);
    }
    
    echo "Admin user found:\n";
    echo "  ID: {$admin['id']}\n";
    echo "  Username: {$admin['username']}\n";
    echo "  Email: {$admin['email']}\n";
    echo "  Name: {$admin['name']}\n";
    echo "  Password Hash: {$admin['password']}\n\n";
    
    // Test if current hash works with 'admin123'
    $testPassword = 'admin123';
    $hashWorks = password_verify($testPassword, $admin['password']);
    
    echo "Testing password 'admin123' against stored hash:\n";
    if ($hashWorks) {
        echo "  ✓ Password hash is CORRECT - login should work!\n";
    } else {
        echo "  ✗ Password hash is INCORRECT - this is why you're getting 'Invalid credentials'\n\n";
        echo "To fix this, run:\n";
        echo "  php fix-admin-password.php\n";
        echo "Or manually update the database with the SQL in fix-password.sql\n";
    }
    
} catch (Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
    echo "\nMake sure:\n";
    echo "  1. .env file exists with correct database credentials\n";
    echo "  2. MySQL server is running\n";
    echo "  3. Database 'civiccast_cms' exists\n";
    exit(1);
}
