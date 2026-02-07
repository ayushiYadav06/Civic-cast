<?php
/**
 * Advertisement Controller (Admin Only)
 */

namespace App\Controllers;

use App\Models\Advertisement;
use App\Utils\Response;
use App\Utils\FileUpload;
use App\Utils\Validator;
use App\Middleware\AuthMiddleware;

class AdvertisementController
{
    public function create()
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        // Allow both admin and operator to create advertisements
        if ($user['role'] !== 'admin' && $user['role'] !== 'operator') {
            Response::forbidden('Only admins and operators can create advertisements');
        }

        // Handle both JSON and multipart/form-data
        $input = [];
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'multipart/form-data') !== false) {
            // Handle multipart/form-data (for file uploads)
            $input = $_POST;
        } else {
            // Handle JSON
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            if (!$input) {
                $input = [];
            }
        }

        $errors = Validator::validate($input, [
            'title' => 'max:255'
        ]);

        if (!empty($errors)) {
            Response::validationError($errors);
        }

        if (!isset($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) {
            Response::error('Image file is required', 400);
        }

        // Upload image
        $uploadResult = FileUpload::uploadImage($_FILES['image'], 'advertisements', 'ad');

        if (!$uploadResult || isset($uploadResult['error'])) {
            $error = $uploadResult['error'] ?? 'Failed to upload image';
            Response::error($error, 500);
        }

        $adModel = new Advertisement();

        $data = [
            'title' => isset($input['title']) && !empty($input['title']) ? $input['title'] : null,
            'image_path' => $uploadResult['path'],
            'image_url' => $uploadResult['url'],
            'cropped_image_path' => null,
            'cropped_image_url' => null,
            'link_url' => isset($input['link_url']) && !empty($input['link_url']) ? $input['link_url'] : null,
            'is_active' => isset($input['is_active']) ? (int)$input['is_active'] : 1
        ];

        $id = $adModel->create($data);

        if ($id) {
            $advertisement = $adModel->findById($id);
            Response::success($advertisement, 'Advertisement created successfully', 201);
        } else {
            // Delete uploaded file if database insert failed
            FileUpload::deleteFile($uploadResult['path']);
            Response::error('Failed to create advertisement', 500);
        }
    }

    public function update($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        // Allow both admin and operator to update advertisements
        if ($user['role'] !== 'admin' && $user['role'] !== 'operator') {
            Response::forbidden('Only admins and operators can update advertisements');
        }

        // Handle both JSON and multipart/form-data
        $input = [];
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'multipart/form-data') !== false) {
            // Handle multipart/form-data (for file uploads)
            $input = $_POST;
        } else {
            // Handle JSON
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            if (!$input) {
                $input = [];
            }
        }

        $adModel = new Advertisement();
        $advertisement = $adModel->findById($id);

        if (!$advertisement) {
            Response::notFound('Advertisement not found');
        }

        $data = [];

        if (isset($input['section'])) {
            $data['section'] = $input['section'];
        }

        if (isset($input['title'])) {
            $data['title'] = $input['title'];
        }

        if (isset($input['link_url'])) {
            $data['link_url'] = $input['link_url'];
        }

        if (isset($input['is_active'])) {
            $data['is_active'] = (int)$input['is_active'];
        }

        if (isset($input['display_order'])) {
            $data['display_order'] = (int)$input['display_order'];
        }

        // Handle new image upload if provided
        if (isset($_FILES['image']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
            $uploadResult = FileUpload::uploadImage($_FILES['image'], 'advertisements', 'ad');

            if ($uploadResult && !isset($uploadResult['error'])) {
                // Delete old image
                FileUpload::deleteFile($advertisement['image_path']);
                if ($advertisement['cropped_image_path']) {
                    FileUpload::deleteFile($advertisement['cropped_image_path']);
                }

                $data['image_path'] = $uploadResult['path'];
                $data['image_url'] = $uploadResult['url'];
                $data['cropped_image_path'] = null;
                $data['cropped_image_url'] = null;
            }
        }

        if (empty($data)) {
            Response::error('No data to update', 400);
        }

        if ($adModel->update($id, $data)) {
            $updatedAd = $adModel->findById($id);
            Response::success($updatedAd, 'Advertisement updated successfully');
        } else {
            Response::error('Failed to update advertisement', 500);
        }
    }

    public function cropImage($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        if ($user['role'] !== 'admin') {
            Response::forbidden('Only admins can crop advertisement images');
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $errors = Validator::validate($input, [
            'x' => 'required',
            'y' => 'required',
            'width' => 'required',
            'height' => 'required'
        ]);

        if (!empty($errors)) {
            Response::validationError($errors);
        }

        $adModel = new Advertisement();
        $advertisement = $adModel->findById($id);

        if (!$advertisement) {
            Response::notFound('Advertisement not found');
        }

        if (!$advertisement['image_path']) {
            Response::error('No image to crop', 400);
        }

        // Crop image
        $croppedResult = FileUpload::cropImage(
            $advertisement['image_path'],
            $input['x'],
            $input['y'],
            $input['width'],
            $input['height']
        );

        if (!$croppedResult || isset($croppedResult['error'])) {
            $error = $croppedResult['error'] ?? 'Failed to crop image';
            Response::error($error, 500);
        }

        // Update advertisement with cropped image path
        $data = [
            'cropped_image_path' => $croppedResult['path'],
            'cropped_image_url' => $croppedResult['url']
        ];

        if ($adModel->update($id, $data)) {
            $updatedAd = $adModel->findById($id);
            Response::success($updatedAd, 'Image cropped successfully');
        } else {
            // Delete cropped file if update failed
            FileUpload::deleteFile($croppedResult['path']);
            Response::error('Failed to update advertisement with cropped image', 500);
        }
    }

    public function getAll()
    {
        $adModel = new Advertisement();
        
        $filters = [];

        if (isset($_GET['section'])) {
            $filters['section'] = $_GET['section'];
        }

        if (isset($_GET['active_only']) && $_GET['active_only'] == '1') {
            $filters['active_only'] = true;
        }

        $advertisements = $adModel->getAll($filters);
        
        Response::success($advertisements);
    }

    public function getById($id)
    {
        $adModel = new Advertisement();
        $advertisement = $adModel->findById($id);

        if (!$advertisement) {
            Response::notFound('Advertisement not found');
        }

        Response::success($advertisement);
    }

    public function toggleActive($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        if ($user['role'] !== 'admin') {
            Response::forbidden('Only admins can toggle advertisement status');
        }

        $adModel = new Advertisement();
        $advertisement = $adModel->findById($id);

        if (!$advertisement) {
            Response::notFound('Advertisement not found');
        }

        if ($adModel->toggleActive($id)) {
            $updatedAd = $adModel->findById($id);
            Response::success($updatedAd, 'Advertisement status updated successfully');
        } else {
            Response::error('Failed to update advertisement status', 500);
        }
    }

    public function delete($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        if ($user['role'] !== 'admin') {
            Response::forbidden('Only admins can delete advertisements');
        }

        $adModel = new Advertisement();
        $advertisement = $adModel->findById($id);

        if (!$advertisement) {
            Response::notFound('Advertisement not found');
        }

        if ($adModel->delete($id)) {
            Response::success(null, 'Advertisement deleted successfully');
        } else {
            Response::error('Failed to delete advertisement', 500);
        }
    }
}

