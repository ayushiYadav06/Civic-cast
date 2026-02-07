<?php
/**
 * Debug Script - Use this to test backend configuration
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>CMS Backend Debug</h1>";

// Check PHP Version
echo "<h2>PHP Version</h2>";
echo "Version: " . phpversion() . "<br>";

// Check Extensions
echo "<h2>Required Extensions</h2>";
$extensions = ['pdo', 'pdo_mysql', 'json', 'gd', 'mbstring', 'openssl'];
foreach ($extensions as $ext) {
    $loaded = extension_loaded($ext) ? '✓' : '✗';
    echo "$loaded $ext<br>";
}

// Check Composer
echo "<h2>Composer Dependencies</h2>";
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo "✓ vendor/autoload.php exists<br>";
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    echo "✗ vendor/autoload.php NOT FOUND<br>";
}

// Check .env
echo "<h2>Environment Configuration</h2>";
if (file_exists(__DIR__ . '/.env')) {
    echo "✓ .env file exists<br>";
    $env = file_get_contents(__DIR__ . '/.env');
    echo "<pre>" . htmlspecialchars($env) . "</pre>";
} else {
    echo "✗ .env file NOT FOUND<br>";
}

// Load .env if exists
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!empty($name)) {
            $_ENV[$name] = $value;
        }
    }
}

// Test Database Connection
echo "<h2>Database Connection Test</h2>";
try {
    $config = require __DIR__ . '/config/database.php';
    echo "Host: " . $config['host'] . "<br>";
    echo "Database: " . $config['dbname'] . "<br>";
    echo "User: " . $config['username'] . "<br>";
    
    $dsn = sprintf(
        "mysql:host=%s;port=%d;dbname=%s;charset=%s",
        $config['host'],
        $config['port'],
        $config['dbname'],
        $config['charset']
    );
    
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    echo "✓ Database connection successful!<br>";
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admins");
    $result = $stmt->fetch();
    echo "✓ Admins table accessible. Count: " . $result['count'] . "<br>";
    
} catch (PDOException $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "<br>";
}

// Test Autoloader
echo "<h2>Autoloader Test</h2>";
spl_autoload_register(function ($class) {
    $class = str_replace('App\\', '', $class);
    $class = str_replace('\\', '/', $class);
    $file = __DIR__ . '/' . $class . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

try {
    $db = App\Utils\Database::getInstance();
    echo "✓ Database class loaded successfully<br>";
} catch (Exception $e) {
    echo "✗ Database class error: " . $e->getMessage() . "<br>";
}

// Test JWT
echo "<h2>JWT Test</h2>";
try {
    if (class_exists('Firebase\JWT\JWT')) {
        echo "✓ Firebase JWT library loaded<br>";
    } else {
        echo "✗ Firebase JWT library NOT FOUND<br>";
    }
} catch (Exception $e) {
    echo "✗ JWT error: " . $e->getMessage() . "<br>";
}

// Check upload directories
echo "<h2>Upload Directories</h2>";
$dirs = ['uploads', 'uploads/news', 'uploads/advertisements'];
foreach ($dirs as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (is_dir($path)) {
        $writable = is_writable($path) ? '✓' : '✗';
        echo "$writable $dir (writable: " . (is_writable($path) ? 'yes' : 'no') . ")<br>";
    } else {
        echo "✗ $dir NOT FOUND<br>";
    }
}

echo "<h2>Request Info</h2>";
echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "<br>";
echo "SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? 'N/A') . "<br>";
echo "PATH_INFO: " . ($_SERVER['PATH_INFO'] ?? 'N/A') . "<br>";
