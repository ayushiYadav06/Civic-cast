<?php
/**
 * Authentication Controller
 */

namespace App\Controllers;

use App\Models\Admin;
use App\Models\Operator;
use App\Utils\JWT;
use App\Utils\Response;
use App\Utils\Validator;

class AuthController
{
    public function login()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['email_or_username']) || !isset($input['password'])) {
            Response::validationError([
                'email_or_username' => 'Email or username is required',
                'password' => 'Password is required'
            ]);
        }

        $emailOrUsername = trim($input['email_or_username']);
        $password = $input['password'];
        $role = $input['role'] ?? 'admin'; // 'admin' or 'operator'

        if ($role === 'admin') {
            $adminModel = new Admin();
            $user = $adminModel->findByEmailOrUsername($emailOrUsername);

            if (!$user) {
                Response::error('Invalid credentials', 401);
            }

            if (!$adminModel->verifyPassword($password, $user['password'])) {
                Response::error('Invalid credentials', 401);
            }

            $tokenData = [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => 'admin'
            ];
        } else {
            $operatorModel = new Operator();
            $user = $operatorModel->findByLoginId($emailOrUsername);

            if (!$user) {
                Response::error('Invalid credentials', 401);
            }

            if (!$user['is_active']) {
                Response::error('Account is deactivated', 403);
            }

            if (!$operatorModel->verifyPassword($password, $user['password'])) {
                Response::error('Invalid credentials', 401);
            }

            $tokenData = [
                'id' => $user['id'],
                'login_id' => $user['login_id'],
                'name' => $user['name'],
                'area' => $user['area'],
                'post' => $user['post'],
                'role' => 'operator'
            ];
        }

        $token = JWT::encode($tokenData);

        Response::success([
            'token' => $token,
            'user' => $tokenData
        ], 'Login successful');
    }
}

