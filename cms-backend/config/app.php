<?php
/**
 * Application Configuration
 */

return [
    'name' => 'CivicCast CMS API',
    'version' => '1.0.0',
    'timezone' => 'UTC',
    'debug' => $_ENV['APP_DEBUG'] ?? false,
    'base_url' => $_ENV['BASE_URL'] ?? 'http://localhost/cms-backend',
    'frontend_url' => $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000',
    'upload_path' => __DIR__ . '/../uploads',
    'max_upload_size' => 5242880, // 5MB in bytes
    'allowed_image_types' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
];

