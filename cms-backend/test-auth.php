<?php
/**
 * Test Authentication Endpoint
 * Use this to test if authentication is working
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Autoloader
spl_autoload_register(function ($class) {
    $class = str_replace('App\\', '', $class);
    $class = str_replace('\\', '/', $class);
    $file = __DIR__ . '/' . $class . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

require_once __DIR__ . '/utils/helpers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$result = [
    'success' => true,
    'message' => 'Authentication test',
    'data' => []
];

// Test 1: Check if token is provided
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

if (!$authHeader) {
    $result['data']['token_provided'] = false;
    $result['data']['error'] = 'No Authorization header';
    echo json_encode($result);
    exit;
}

$result['data']['token_provided'] = true;
$result['data']['auth_header'] = substr($authHeader, 0, 20) . '...';

// Test 2: Extract token
if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $token = $matches[1];
    $result['data']['token_extracted'] = true;
    $result['data']['token_length'] = strlen($token);
} else {
    $result['data']['token_extracted'] = false;
    $result['data']['error'] = 'Invalid Bearer format';
    echo json_encode($result);
    exit;
}

// Test 3: Decode token
try {
    $decoded = App\Utils\JWT::decode($token);
    if ($decoded) {
        $result['data']['token_decoded'] = true;
        $result['data']['user_data'] = $decoded['data'] ?? null;
        $result['data']['expires_at'] = isset($decoded['exp']) ? date('Y-m-d H:i:s', $decoded['exp']) : 'N/A';
    } else {
        $result['data']['token_decoded'] = false;
        $result['data']['error'] = 'Token decode returned null';
    }
} catch (\Exception $e) {
    $result['data']['token_decoded'] = false;
    $result['data']['error'] = $e->getMessage();
}

// Test 4: Validate token
$isValid = App\Utils\JWT::validate($token);
$result['data']['token_valid'] = $isValid;

echo json_encode($result, JSON_PRETTY_PRINT);
