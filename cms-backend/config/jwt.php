<?php
/**
 * JWT Configuration
 */

return [
    'secret' => $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-this-in-production',
    'algorithm' => 'HS256',
    'expiration' => 86400, // 24 hours in seconds
    'issuer' => 'civiccast-cms',
];

