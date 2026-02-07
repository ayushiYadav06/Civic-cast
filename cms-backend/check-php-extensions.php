<?php
/**
 * PHP Extensions Checker
 * Run this to verify all required PHP extensions are installed
 */

echo "=== PHP Extensions Check ===\n\n";

$required = [
    'pdo' => 'PDO (PHP Data Objects)',
    'pdo_mysql' => 'PDO MySQL Driver',
    'json' => 'JSON Support',
    'mbstring' => 'Multibyte String Support',
    'openssl' => 'OpenSSL (for JWT)',
];

$optional = [
    'gd' => 'GD Library (for image processing)',
    'fileinfo' => 'FileInfo (for file validation)',
];

echo "Required Extensions:\n";
echo str_repeat("-", 50) . "\n";
$allRequiredOk = true;
foreach ($required as $ext => $name) {
    $loaded = extension_loaded($ext);
    $status = $loaded ? "✓" : "✗";
    $color = $loaded ? "" : "";
    echo sprintf("%s %-20s %s\n", $status, $ext, $name);
    if (!$loaded) {
        $allRequiredOk = false;
    }
}

echo "\nOptional Extensions:\n";
echo str_repeat("-", 50) . "\n";
foreach ($optional as $ext => $name) {
    $loaded = extension_loaded($ext);
    $status = $loaded ? "✓" : "○";
    echo sprintf("%s %-20s %s\n", $status, $ext, $name);
}

echo "\n" . str_repeat("=", 50) . "\n";

if ($allRequiredOk) {
    echo "✓ All required extensions are loaded!\n";
    exit(0);
} else {
    echo "✗ Some required extensions are missing!\n";
    echo "\nTo fix on Windows:\n";
    echo "1. Find php.ini: php --ini\n";
    echo "2. Edit php.ini and uncomment (remove ;) these lines:\n";
    echo "   extension=pdo_mysql\n";
    echo "   extension=mysqli\n";
    echo "3. Restart PHP server\n";
    exit(1);
}
