<?php
/**
 * Main Entry Point
 * CMS Management System API
 */

// Enable error reporting in development
error_reporting(E_ALL);
ini_set('display_errors', 1); // Enable for debugging
ini_set('log_errors', 1);

// Set error handler to return JSON errors
set_error_handler(function($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Set exception handler
set_exception_handler(function($exception) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error',
        'error' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine(),
        'trace' => $exception->getTraceAsString()
    ], JSON_PRETTY_PRINT);
    exit;
});

// Set timezone
date_default_timezone_set('UTC');

// Load Composer autoloader (for vendor dependencies like Firebase JWT)
require_once __DIR__ . '/vendor/autoload.php';

// Load environment variables if .env file exists
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Skip empty lines and comments
        if (empty($line) || strpos($line, '#') === 0) {
            continue;
        }
        // Skip lines without equals sign
        if (strpos($line, '=') === false) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!empty($name) && !array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Autoloader
spl_autoload_register(function ($class) {
    // Remove App\ namespace prefix
    $class = str_replace('App\\', '', $class);
    
    // Convert namespace separators to directory separators
    $class = str_replace('\\', '/', $class);
    
    // Build file path
    $file = __DIR__ . '/' . $class . '.php';
    
    // Include the file if it exists
    if (file_exists($file)) {
        require $file;
    }
});

// Include helper functions
require_once __DIR__ . '/utils/helpers.php';

// Include routes
require_once __DIR__ . '/routes/api.php';

