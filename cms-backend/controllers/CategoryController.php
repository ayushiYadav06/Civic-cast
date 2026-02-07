<?php
/**
 * Category Controller
 */

namespace App\Controllers;

use App\Models\Category;
use App\Utils\Response;
use App\Utils\Validator;

class CategoryController
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
                'slug' => 'required|slug|max:255',
                'description' => 'max:1000'
            ]);

            if (!empty($errors)) {
                Response::validationError($errors);
            }

            $categoryModel = new Category();

            // Check if slug already exists
            $existing = $categoryModel->findBySlug($input['slug']);
            if ($existing) {
                Response::error('Category with this slug already exists', 409);
            }

            $data = [
                'name' => $input['name'],
                'slug' => $input['slug'],
                'description' => $input['description'] ?? null,
                'is_active' => $input['is_active'] ?? 1
            ];

            $id = $categoryModel->create($data);

            if ($id) {
                $category = $categoryModel->findById($id);
                Response::success($category, 'Category created successfully', 201);
            } else {
                Response::error('Failed to create category', 500);
            }
        } catch (\Exception $e) {
            error_log('CategoryController::create error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            Response::error('Failed to create category: ' . $e->getMessage(), 500);
        }
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $categoryModel = new Category();
        $category = $categoryModel->findById($id);

        if (!$category) {
            Response::notFound('Category not found');
        }

        $data = [];

        if (isset($input['name'])) {
            $data['name'] = $input['name'];
        }

        if (isset($input['slug'])) {
            // Check if slug already exists for another category
            $existing = $categoryModel->findBySlug($input['slug']);
            if ($existing && $existing['id'] != $id) {
                Response::error('Category with this slug already exists', 409);
            }
            $data['slug'] = $input['slug'];
        }

        if (isset($input['description'])) {
            $data['description'] = $input['description'];
        }

        if (isset($input['is_active'])) {
            $data['is_active'] = (int)$input['is_active'];
        }

        if (empty($data)) {
            Response::error('No data to update', 400);
        }

        if ($categoryModel->update($id, $data)) {
            $updatedCategory = $categoryModel->findById($id);
            Response::success($updatedCategory, 'Category updated successfully');
        } else {
            Response::error('Failed to update category', 500);
        }
    }

    public function getAll()
    {
        $categoryModel = new Category();
        $activeOnly = isset($_GET['active_only']) && $_GET['active_only'] == '1';
        
        $categories = $categoryModel->getAll($activeOnly);
        
        Response::success($categories);
    }

    public function getById($id)
    {
        $categoryModel = new Category();
        $category = $categoryModel->findById($id);

        if (!$category) {
            Response::notFound('Category not found');
        }

        Response::success($category);
    }

    public function delete($id)
    {
        $categoryModel = new Category();
        $category = $categoryModel->findById($id);

        if (!$category) {
            Response::notFound('Category not found');
        }

        // Check if category has related news items
        $newsCount = $categoryModel->countNewsByCategory($id);
        if ($newsCount > 0) {
            Response::error(
                "Cannot delete category '{$category['name']}'. It has $newsCount news item(s) associated with it. Please delete those news items first.",
                409
            );
        }

        if ($categoryModel->delete($id)) {
            Response::success(null, 'Category deleted successfully');
        } else {
            Response::error('Failed to delete category', 500);
        }
    }
}

