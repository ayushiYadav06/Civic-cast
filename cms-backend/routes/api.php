<?php
/**
 * API Routes
 */

use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\CategoryController;
use App\Controllers\SubCategoryController;
use App\Controllers\OperatorController;
use App\Controllers\NewsController;
use App\Controllers\AdvertisementController;
use App\Middleware\RoleMiddleware;

// Helper function to match route and extract parameters
function matchRoute($method, $path, $routeMethod, $routePath, &$params = []) {
    if (strtoupper($method) !== strtoupper($routeMethod)) {
        $params = [];
        return false;
    }
    
    // Reset params
    $params = [];
    $paramNames = [];
    
    // Build regex pattern and capture parameter names
    $pattern = preg_replace_callback('/:(\w+)/', function($matches) use (&$paramNames) {
        $paramNames[] = $matches[1];
        return '(\d+)';
    }, $routePath);
    
    // Escape forward slashes
    $pattern = str_replace('/', '\/', $pattern);
    $pattern = '#^' . $pattern . '$#';
    
    // Match and extract parameters
    if (preg_match($pattern, $path, $matches)) {
        array_shift($matches); // Remove full match
        if (count($paramNames) === count($matches)) {
            $params = array_combine($paramNames, $matches);
            return true;
        }
    }
    
    $params = [];
    return false;
}

// CORS headers
function setCorsHeaders() {
    $appConfig = require __DIR__ . '/../config/app.php';
    $frontendUrl = $appConfig['frontend_url'];
    
    header('Access-Control-Allow-Origin: ' . $frontendUrl);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path if exists (handle different server configurations)
$basePath = '/cms-backend';
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

// Ensure path starts with /
$path = '/' . trim($path, '/');

// If path is empty or just '/', set to '/api' for root API access
if ($path === '/' || $path === '') {
    $path = '/api';
}

setCorsHeaders();

// Test endpoint to verify backend is working
if ($path === '/api/test' || $path === '/test') {
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'Backend is working!',
        'path' => $path,
        'method' => $method,
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A'
    ]);
    exit;
}

$params = [];

// Public routes (no authentication required)
if (matchRoute($method, $path, 'POST', '/api/auth/login', $params)) {
    $controller = new AuthController();
    $controller->login();
    exit;
}

// Public categories (no auth - for frontend)
if (matchRoute($method, $path, 'GET', '/api/categories', $params)) {
    $controller = new CategoryController();
    $_GET['active_only'] = '1';
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/categories/:id', $params)) {
    $controller = new CategoryController();
    $controller->getById($params['id']);
    exit;
}

// Public sub-categories (no auth - for frontend)
if (matchRoute($method, $path, 'GET', '/api/sub-categories', $params)) {
    $controller = new SubCategoryController();
    $_GET['active_only'] = '1';
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/sub-categories/:id', $params)) {
    $controller = new SubCategoryController();
    $controller->getById($params['id']);
    exit;
}

// Get public approved news (for frontend - no auth)
if (matchRoute($method, $path, 'GET', '/api/news', $params)) {
    $controller = new NewsController();
    $controller->getPublicAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/news/:id', $params)) {
    $controller = new NewsController();
    $controller->getById($params['id']);
    exit;
}

// Increment views (public)
if (matchRoute($method, $path, 'POST', '/api/news/:id/views', $params)) {
    $controller = new NewsController();
    $controller->incrementViews($params['id']);
    exit;
}

// Get active advertisements (public)
if (matchRoute($method, $path, 'GET', '/api/advertisements', $params)) {
    $controller = new AdvertisementController();
    $_GET['active_only'] = '1';
    $controller->getAll();
    exit;
}

// Protected routes require authentication

// Dashboard routes (Admin only)
if (matchRoute($method, $path, 'GET', '/api/admin/dashboard', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new DashboardController();
    $controller->getStats();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/notifications', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new DashboardController();
    $controller->getNotifications();
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/admin/notifications/mark-read', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new DashboardController();
    $controller->markNotificationAsRead();
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/admin/notifications/mark-all-read', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new DashboardController();
    $controller->markAllNotificationsAsRead();
    exit;
}

// Category routes (Admin only)
if (matchRoute($method, $path, 'POST', '/api/admin/categories', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new CategoryController();
    $controller->create();
    exit;
}

if (matchRoute($method, $path, 'PUT', '/api/admin/categories/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new CategoryController();
    $controller->update($params['id']);
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/categories', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new CategoryController();
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/categories/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new CategoryController();
    $controller->getById($params['id']);
    exit;
}

if (matchRoute($method, $path, 'DELETE', '/api/admin/categories/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new CategoryController();
    $controller->delete($params['id']);
    exit;
}

// Sub-category routes (Admin only)
if (matchRoute($method, $path, 'POST', '/api/admin/sub-categories', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new SubCategoryController();
    $controller->create();
    exit;
}

if (matchRoute($method, $path, 'PUT', '/api/admin/sub-categories/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new SubCategoryController();
    $controller->update($params['id']);
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/sub-categories', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new SubCategoryController();
    $controller->getAll();
    exit;
}

// Get sub-categories by category ID
if (matchRoute($method, $path, 'GET', '/api/admin/categories/:id/sub-categories', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new SubCategoryController();
    $_GET['category_id'] = $params['id'];
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/sub-categories/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new SubCategoryController();
    $controller->getById($params['id']);
    exit;
}

if (matchRoute($method, $path, 'DELETE', '/api/admin/sub-categories/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new SubCategoryController();
    $controller->delete($params['id']);
    exit;
}

// Operator routes (Admin only)
if (matchRoute($method, $path, 'POST', '/api/admin/operators', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new OperatorController();
    $controller->create();
    exit;
}

if (matchRoute($method, $path, 'PUT', '/api/admin/operators/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new OperatorController();
    $controller->update($params['id']);
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/operators', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new OperatorController();
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/operators/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new OperatorController();
    $controller->getById($params['id']);
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/admin/operators/:id/toggle-active', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new OperatorController();
    $controller->toggleActive($params['id']);
    exit;
}

// News routes (Mixed: operators can create, admin can approve/reject)
if (matchRoute($method, $path, 'POST', '/api/news', $params)) {
    $controller = new NewsController();
    $controller->create();
    exit;
}

if (matchRoute($method, $path, 'PUT', '/api/news/:id', $params)) {
    $controller = new NewsController();
    $controller->update($params['id']);
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/news', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new NewsController();
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/operator/news', $params)) {
    $roleMiddleware = new RoleMiddleware('operator');
    $roleMiddleware->handle();
    $controller = new NewsController();
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/news/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new NewsController();
    $controller->getById($params['id']);
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/admin/news/:id/approve', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new NewsController();
    $controller->approve($params['id']);
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/admin/news/:id/reject', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new NewsController();
    $controller->reject($params['id']);
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/news/:id/images', $params)) {
    $controller = new NewsController();
    $controller->uploadImages($params['id']);
    exit;
}

if (matchRoute($method, $path, 'DELETE', '/api/news/:newsId/images/:imageId', $params)) {
    $controller = new NewsController();
    $controller->deleteImage($params['newsId'], $params['imageId']);
    exit;
}

if (matchRoute($method, $path, 'DELETE', '/api/admin/news/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new NewsController();
    $controller->delete($params['id']);
    exit;
}

// Advertisement routes (Admin can do everything, Operators can create/update)
if (matchRoute($method, $path, 'POST', '/api/admin/advertisements', $params)) {
    $auth = new AuthMiddleware();
    $auth->handle();
    $controller = new AdvertisementController();
    $controller->create();
    exit;
}

if (matchRoute($method, $path, 'PUT', '/api/admin/advertisements/:id', $params)) {
    $auth = new AuthMiddleware();
    $auth->handle();
    $controller = new AdvertisementController();
    $controller->update($params['id']);
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/advertisements', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new AdvertisementController();
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/admin/advertisements/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new AdvertisementController();
    $controller->getById($params['id']);
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/admin/advertisements/:id/crop', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new AdvertisementController();
    $controller->cropImage($params['id']);
    exit;
}

if (matchRoute($method, $path, 'POST', '/api/admin/advertisements/:id/toggle-active', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new AdvertisementController();
    $controller->toggleActive($params['id']);
    exit;
}

if (matchRoute($method, $path, 'DELETE', '/api/admin/advertisements/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('admin');
    $roleMiddleware->handle();
    $controller = new AdvertisementController();
    $controller->delete($params['id']);
    exit;
}

// Advertisement routes for Operators (Read-only)
if (matchRoute($method, $path, 'GET', '/api/operator/advertisements', $params)) {
    $roleMiddleware = new RoleMiddleware('operator');
    $roleMiddleware->handle();
    $controller = new AdvertisementController();
    $controller->getAll();
    exit;
}

if (matchRoute($method, $path, 'GET', '/api/operator/advertisements/:id', $params)) {
    $roleMiddleware = new RoleMiddleware('operator');
    $roleMiddleware->handle();
    $controller = new AdvertisementController();
    $controller->getById($params['id']);
    exit;
}

// 404 Not Found
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'message' => 'Route not found',
    'data' => null
]);
