<?php
/**
 * Database Setup Script
 * This script will:
 * 1. Create the database if it doesn't exist
 * 2. Import the schema.sql file to create all tables
 */

// Load environment variables
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

// Get database configuration
$host = $_ENV['DB_HOST'] ?? 'localhost';
$port = $_ENV['DB_PORT'] ?? 3306;
$dbname = $_ENV['DB_NAME'] ?? 'civiccast_cms';
$username = $_ENV['DB_USER'] ?? 'root';
$password = $_ENV['DB_PASS'] ?? '';

echo "=== Database Setup Script ===\n\n";
echo "Configuration:\n";
echo "  Host: $host\n";
echo "  Port: $port\n";
echo "  Database: $dbname\n";
echo "  User: $username\n";
echo "  Password: " . (empty($password) ? '(empty)' : '***') . "\n\n";

try {
    // Step 1: Connect to MySQL server (without database)
    echo "Step 1: Connecting to MySQL server...\n";
    $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "  ✓ Connected successfully\n\n";

    // Step 2: Create database if it doesn't exist
    echo "Step 2: Creating database '$dbname' if it doesn't exist...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "  ✓ Database '$dbname' is ready\n\n";

    // Step 3: Select the database
    echo "Step 3: Selecting database '$dbname'...\n";
    $pdo->exec("USE `$dbname`");
    echo "  ✓ Database selected\n\n";

    // Step 4: Read and execute schema.sql
    $schemaFile = __DIR__ . '/database/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: $schemaFile");
    }

    echo "Step 4: Importing schema from database/schema.sql...\n";
    $sql = file_get_contents($schemaFile);
    
    // Remove comments and split by semicolon
    $sql = preg_replace('/--.*$/m', '', $sql);
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
    
    // Split into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && strlen($stmt) > 5;
        }
    );

    $executed = 0;
    foreach ($statements as $statement) {
        try {
            $pdo->exec($statement);
            $executed++;
        } catch (PDOException $e) {
            // Ignore "table already exists" errors
            if (strpos($e->getMessage(), 'already exists') === false && 
                strpos($e->getMessage(), "Table '$dbname") === false) {
                echo "  ⚠ Warning: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "  ✓ Executed $executed SQL statements\n\n";

    // Step 5: Verify tables were created
    echo "Step 5: Verifying tables...\n";
    $requiredTables = ['admins', 'operators', 'categories', 'sub_categories', 'news', 'news_images', 'advertisements', 'notifications'];
    $existingTables = [];
    
    $stmt = $pdo->query("SHOW TABLES");
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $existingTables[] = $row[0];
    }
    
    $missingTables = array_diff($requiredTables, $existingTables);
    
    if (empty($missingTables)) {
        echo "  ✓ All required tables exist:\n";
        foreach ($requiredTables as $table) {
            echo "    - $table\n";
        }
    } else {
        echo "  ✗ Missing tables: " . implode(', ', $missingTables) . "\n";
    }
    
    echo "\n";

    // Step 6: Check for default admin
    echo "Step 6: Checking for default admin user...\n";
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $adminCount = $stmt->fetch()['count'];
    
    if ($adminCount > 0) {
        echo "  ✓ Admin user(s) found ($adminCount)\n";
        $stmt = $pdo->query("SELECT username, email FROM admins LIMIT 1");
        $admin = $stmt->fetch();
        if ($admin) {
            echo "    Default admin: {$admin['username']} ({$admin['email']})\n";
            echo "    Default password: admin123\n";
        }
    } else {
        echo "  ⚠ No admin user found\n";
    }

    echo "\n=== Setup Complete! ===\n";
    echo "You can now start your PHP server and test the API.\n";
    echo "Default admin credentials:\n";
    echo "  Username: admin\n";
    echo "  Password: admin123\n";

} catch (PDOException $e) {
    echo "\n✗ ERROR: Database operation failed\n";
    echo "  " . $e->getMessage() . "\n\n";
    echo "Please check:\n";
    echo "  1. MySQL server is running\n";
    echo "  2. Database credentials in .env file are correct\n";
    echo "  3. User has permission to create databases\n";
    exit(1);
} catch (Exception $e) {
    echo "\n✗ ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
