<?php
/**
 * Operator Controller (Admin Only)
 */

namespace App\Controllers;

use App\Models\Operator;
use App\Utils\Response;
use App\Utils\Validator;

require_once __DIR__ . '/../utils/helpers.php';

class OperatorController
{
    public function create()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                Response::error('Invalid JSON input', 400);
            }

            $errors = Validator::validate($input, [
                'name' => 'required|max:255',
                'area' => 'required|max:255',
                'post' => 'required|max:255'
            ]);

            if (!empty($errors)) {
                Response::validationError($errors);
            }

            $operatorModel = new Operator();

            // Generate login ID
            $loginId = generateLoginId($input['name'], $input['area']);
            
            // Check if login ID already exists (unlikely but possible)
            $existing = $operatorModel->findByLoginId($loginId);
            $attempts = 0;
            while ($existing && $attempts < 10) {
                $loginId = generateLoginId($input['name'], $input['area']);
                $existing = $operatorModel->findByLoginId($loginId);
                $attempts++;
            }

            if ($existing) {
                Response::error('Failed to generate unique login ID. Please try again.', 500);
            }

            // Generate password
            $password = generatePassword(10);
            $hashedPassword = hashPassword($password);

            $data = [
                'login_id' => $loginId,
                'password' => $hashedPassword,
                'name' => $input['name'],
                'area' => $input['area'],
                'post' => $input['post'],
                'user_id' => $input['user_id'] ?? null,
                'is_active' => 1
            ];

            $id = $operatorModel->create($data);

            if ($id) {
                $operator = $operatorModel->findById($id);
                // Return credentials (only on creation)
                $operator['generated_password'] = $password; // Only shown once
                Response::success($operator, 'Operator created successfully', 201);
            } else {
                Response::error('Failed to create operator', 500);
            }
        } catch (\Exception $e) {
            error_log('OperatorController::create error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            Response::error('Failed to create operator: ' . $e->getMessage(), 500);
        }
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $operatorModel = new Operator();
        $operator = $operatorModel->findById($id);

        if (!$operator) {
            Response::notFound('Operator not found');
        }

        $data = [];

        if (isset($input['name'])) {
            $data['name'] = $input['name'];
        }

        if (isset($input['area'])) {
            $data['area'] = $input['area'];
        }

        if (isset($input['post'])) {
            $data['post'] = $input['post'];
        }

        if (isset($input['user_id'])) {
            $data['user_id'] = $input['user_id'];
        }

        if (isset($input['password']) && !empty($input['password'])) {
            $data['password'] = hashPassword($input['password']);
        }

        if (isset($input['is_active'])) {
            $data['is_active'] = (int)$input['is_active'];
        }

        if (empty($data)) {
            Response::error('No data to update', 400);
        }

        if ($operatorModel->update($id, $data)) {
            $updatedOperator = $operatorModel->findById($id);
            // Remove password from response
            unset($updatedOperator['password']);
            Response::success($updatedOperator, 'Operator updated successfully');
        } else {
            Response::error('Failed to update operator', 500);
        }
    }

    public function getAll()
    {
        try {
            $operatorModel = new Operator();
            $activeOnly = isset($_GET['active_only']) && $_GET['active_only'] == '1';
            
            $operators = $operatorModel->getAll($activeOnly);
            
            // Remove passwords from response
            foreach ($operators as &$operator) {
                unset($operator['password']);
            }
            
            Response::success($operators);
        } catch (\Exception $e) {
            error_log('OperatorController::getAll error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            Response::error('Failed to load operators: ' . $e->getMessage(), 500);
        }
    }

    public function getById($id)
    {
        $operatorModel = new Operator();
        $operator = $operatorModel->findById($id);

        if (!$operator) {
            Response::notFound('Operator not found');
        }

        // Remove password from response
        unset($operator['password']);

        Response::success($operator);
    }

    public function toggleActive($id)
    {
        $operatorModel = new Operator();
        $operator = $operatorModel->findById($id);

        if (!$operator) {
            Response::notFound('Operator not found');
        }

        if ($operatorModel->toggleActive($id)) {
            $updatedOperator = $operatorModel->findById($id);
            unset($updatedOperator['password']);
            Response::success($updatedOperator, 'Operator status updated successfully');
        } else {
            Response::error('Failed to update operator status', 500);
        }
    }
}

