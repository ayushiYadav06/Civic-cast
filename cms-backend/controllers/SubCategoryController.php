<?php
/**
 * Sub-Category Controller
 */

namespace App\Controllers;

use App\Models\SubCategory;
use App\Models\Category;
use App\Utils\Response;
use App\Utils\Validator;

class SubCategoryController
{
    public function create()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                Response::error('Invalid JSON input', 400);
            }

            $errors = Validator::validate($input, [
                'category_id' => 'required',
                'name' => 'required|max:255',
                'slug' => 'required|slug|max:255',
                'description' => 'max:1000'
            ]);

            if (!empty($errors)) {
                Response::validationError($errors);
            }

            // Verify category exists
            $categoryModel = new Category();
            $category = $categoryModel->findById($input['category_id']);
            if (!$category) {
                Response::error('Category not found', 404);
            }

            $subCategoryModel = new SubCategory();

            // Check if slug already exists for this category
            $existing = $subCategoryModel->findByCategoryId($input['category_id']);
            foreach ($existing as $sub) {
                if ($sub['slug'] === $input['slug']) {
                    Response::error('Sub-category with this slug already exists in this category', 409);
                }
            }

            $data = [
                'category_id' => $input['category_id'],
                'name' => $input['name'],
                'slug' => $input['slug'],
                'description' => $input['description'] ?? null,
                'is_active' => $input['is_active'] ?? 1
            ];

            $id = $subCategoryModel->create($data);

            if ($id) {
                $subCategory = $subCategoryModel->findById($id);
                Response::success($subCategory, 'Sub-category created successfully', 201);
            } else {
                Response::error('Failed to create sub-category', 500);
            }
        } catch (\Exception $e) {
            error_log('SubCategoryController::create error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            Response::error('Failed to create sub-category: ' . $e->getMessage(), 500);
        }
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $subCategoryModel = new SubCategory();
        $subCategory = $subCategoryModel->findById($id);

        if (!$subCategory) {
            Response::notFound('Sub-category not found');
        }

        $data = [];

        if (isset($input['category_id'])) {
            // Verify category exists
            $categoryModel = new Category();
            $category = $categoryModel->findById($input['category_id']);
            if (!$category) {
                Response::error('Category not found', 404);
            }
            $data['category_id'] = $input['category_id'];
        }

        if (isset($input['name'])) {
            $data['name'] = $input['name'];
        }

        if (isset($input['slug'])) {
            // Check if slug already exists for this category
            $categoryId = $data['category_id'] ?? $subCategory['category_id'];
            $existing = $subCategoryModel->findByCategoryId($categoryId);
            foreach ($existing as $sub) {
                if ($sub['slug'] === $input['slug'] && $sub['id'] != $id) {
                    Response::error('Sub-category with this slug already exists in this category', 409);
                }
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

        if ($subCategoryModel->update($id, $data)) {
            $updatedSubCategory = $subCategoryModel->findById($id);
            Response::success($updatedSubCategory, 'Sub-category updated successfully');
        } else {
            Response::error('Failed to update sub-category', 500);
        }
    }

    public function getAll()
    {
        $subCategoryModel = new SubCategory();
        $activeOnly = isset($_GET['active_only']) && $_GET['active_only'] == '1';
        
        if (isset($_GET['category_id'])) {
            $subCategories = $subCategoryModel->findByCategoryId($_GET['category_id'], $activeOnly);
        } else {
            $subCategories = $subCategoryModel->getAll($activeOnly);
        }
        
        Response::success($subCategories);
    }

    public function getById($id)
    {
        $subCategoryModel = new SubCategory();
        $subCategory = $subCategoryModel->findById($id);

        if (!$subCategory) {
            Response::notFound('Sub-category not found');
        }

        Response::success($subCategory);
    }

    public function delete($id)
    {
        $subCategoryModel = new SubCategory();
        $subCategory = $subCategoryModel->findById($id);

        if (!$subCategory) {
            Response::notFound('Sub-category not found');
        }

        // Check if sub-category has related news items
        $newsCount = $subCategoryModel->countNewsBySubCategory($id);
        if ($newsCount > 0) {
            Response::error(
                "Cannot delete sub-category '{$subCategory['name']}'. It has $newsCount news item(s) associated with it. Please delete those news items first.",
                409
            );
        }

        if ($subCategoryModel->delete($id)) {
            Response::success(null, 'Sub-category deleted successfully');
        } else {
            Response::error('Failed to delete sub-category', 500);
        }
    }
}

