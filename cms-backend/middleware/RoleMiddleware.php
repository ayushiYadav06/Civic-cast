<?php
/**
 * Role-based Access Control Middleware
 */

namespace App\Middleware;

use App\Middleware\AuthMiddleware;
use App\Utils\Response;

class RoleMiddleware
{
    private $allowedRoles;

    public function __construct($allowedRoles)
    {
        $this->allowedRoles = is_array($allowedRoles) ? $allowedRoles : [$allowedRoles];
    }

    public function handle()
    {
        // First check authentication
        $authMiddleware = new AuthMiddleware();
        $authMiddleware->handle();

        $user = AuthMiddleware::getUser();

        if (!$user) {
            Response::unauthorized('User not authenticated');
        }

        // Handle both array and object access
        if (is_object($user)) {
            $userRole = $user->role ?? null;
        } else {
            $userRole = $user['role'] ?? null;
        }

        if (!$userRole || !in_array($userRole, $this->allowedRoles)) {
            Response::forbidden('Access denied. Required role: ' . implode(' or ', $this->allowedRoles));
        }

        return true;
    }
}

