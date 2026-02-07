<?php
/**
 * Authentication Middleware
 */

namespace App\Middleware;

use App\Utils\JWT;
use App\Utils\Response;

class AuthMiddleware
{
    public function handle()
    {
        try {
            // Get headers - handle both getallheaders() and manual extraction
            $headers = [];
            if (function_exists('getallheaders')) {
                $headers = getallheaders();
            } else {
                // Fallback for servers that don't support getallheaders()
                foreach ($_SERVER as $key => $value) {
                    if (strpos($key, 'HTTP_') === 0) {
                        $headerName = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
                        $headers[$headerName] = $value;
                    }
                }
            }
            
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

            if (!$authHeader) {
                Response::unauthorized('Authorization header is missing');
            }

            // Extract token from "Bearer {token}" format
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                $token = $matches[1];
            } else {
                Response::unauthorized('Invalid authorization header format. Expected: Bearer {token}');
            }

            $decoded = JWT::decode($token);

            if (!$decoded) {
                Response::unauthorized('Invalid token. Unable to decode.');
            }

            if (!JWT::validate($token)) {
                Response::unauthorized('Invalid or expired token');
            }

            // Store user data in request - convert stdClass to array if needed
            $userData = $decoded['data'] ?? null;
            if ($userData instanceof \stdClass) {
                $userData = json_decode(json_encode($userData), true);
            }
            $_REQUEST['auth_user'] = $userData;
            $_REQUEST['auth_token'] = $token;

            return true;
        } catch (\Exception $e) {
            error_log('AuthMiddleware error: ' . $e->getMessage());
            Response::unauthorized('Authentication failed: ' . $e->getMessage());
        }
    }

    public static function getUser()
    {
        return $_REQUEST['auth_user'] ?? null;
    }
}

