<?php
/**
 * Fix Admin Password Hash
 * This script updates the admin password hash in the database to match 'admin123'
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
    
    // Generate correct password hash for 'admin123'
    $correctHash = password_hash('admin123', PASSWORD_BCRYPT);
    
    echo "Generated password hash for 'admin123':\n";
    echo $correctHash . "\n\n";
    
    // Update the admin password in the database
    $stmt = $db->prepare("UPDATE admins SET password = :password WHERE username = 'admin' OR email = 'admin@civiccast.com'");
    $result = $stmt->execute(['password' => $correctHash]);
    
    if ($result) {
        $affectedRows = $stmt->rowCount();
        if ($affectedRows > 0) {
            echo "✓ Successfully updated admin password hash in database!\n";
            echo "  Affected rows: $affectedRows\n\n";
            
            // Verify the update
            $stmt = $db->prepare("SELECT username, email FROM admins WHERE username = 'admin' LIMIT 1");
            $stmt->execute();
            $admin = $stmt->fetch();
            
            if ($admin) {
                echo "Admin user verified:\n";
                echo "  Username: {$admin['username']}\n";
                echo "  Email: {$admin['email']}\n";
                echo "  Password: admin123\n\n";
            }
            
            echo "You can now login with:\n";
            echo "  Username/Email: admin\n";
            echo "  Password: admin123\n";
        } else {
            echo "⚠ No admin user found to update. Make sure the database is set up.\n";
        }
    } else {
        echo "✗ Failed to update password hash.\n";
    }
    
} catch (Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
