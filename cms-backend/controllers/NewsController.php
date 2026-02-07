<?php
/**
 * News Controller
 */

namespace App\Controllers;

use App\Models\News;
use App\Models\NewsImage;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Operator;
use App\Models\Notification;
use App\Utils\Response;
use App\Utils\FileUpload;
use App\Utils\Validator;
use App\Middleware\AuthMiddleware;

require_once __DIR__ . '/../utils/helpers.php';

class NewsController
{
    public function create()
    {
        // Get authenticated user
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        // Allow both admin and operator to create news
        if ($user['role'] !== 'operator' && $user['role'] !== 'admin') {
            Response::forbidden('Only operators and admins can create news');
        }

        // Handle both JSON and multipart/form-data
        $input = [];
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        // Check if it's multipart/form-data (may include boundary like: multipart/form-data; boundary=----WebKitFormBoundary...)
        if (strpos($contentType, 'multipart/form-data') !== false || !empty($_FILES)) {
            // Handle multipart/form-data
            $input = $_POST;
        } else {
            // Handle JSON
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            if (!$input) {
                $input = [];
            }
        }
        
        // Debug logging
        error_log('Content-Type: ' . $contentType);
        error_log('Request Method: ' . $_SERVER['REQUEST_METHOD']);
        error_log('Input data keys: ' . print_r(array_keys($input), true));
        error_log('FILES keys: ' . print_r(array_keys($_FILES), true));
        if (!empty($_FILES)) {
            error_log('FILES structure: ' . print_r($_FILES, true));
        }

        $errors = Validator::validate($input, [
            'title' => 'required|max:500',
            'content' => 'required',
        ]);

        if (!empty($errors)) {
            Response::validationError($errors);
        }

        // Generate slug
        $slug = generateSlug($input['title']);
        $baseSlug = $slug;
        $counter = 1;
        $maxAttempts = 100; // Safety limit to prevent infinite loops

        $newsModel = new News();
        // Check if slug exists
        $existing = $newsModel->getAll(['slug' => $slug, 'limit' => 1]);
        while (!empty($existing) && $counter < $maxAttempts) {
            $slug = $baseSlug . '-' . $counter;
            $existing = $newsModel->getAll(['slug' => $slug, 'limit' => 1]);
            $counter++;
        }
        
        if ($counter >= $maxAttempts) {
            Response::error('Unable to generate unique slug after multiple attempts', 500);
        }

        // For admin-created news, we need to use a valid operator_id
        // Since database requires operator_id, we'll use the first active operator
        // For operator-created news, use the operator's ID
        $operatorId = null;
        if ($user['role'] === 'operator') {
            $operatorId = $user['id'];
        } else {
            // Admin creating news - find first active operator
            $operatorModel = new Operator();
            $operators = $operatorModel->getAll(true); // true = activeOnly
            if (!empty($operators)) {
                $operatorId = $operators[0]['id'];
            } else {
                // If no operators exist, allow creating news with null operator_id
                $operatorId = null;
            }
        }
        
        // Auto-approve admin-created news, keep operator-created as pending
        $status = ($user['role'] === 'admin') ? 'approved' : 'pending';

        $data = [
            'operator_id' => $operatorId,
            'title' => $input['title'],
            'sub_title' => isset($input['sub_title']) && !empty($input['sub_title']) ? $input['sub_title'] : null,
            'content' => $input['content'],
            'slug' => $slug,
            'status' => $status
        ];

        $newsId = $newsModel->create($data);

        if (!$newsId) {
            Response::error('Failed to create news', 500);
        }

        // Handle image uploads if provided
        $uploadedImages = [];
        $uploadErrors = [];
        
        // Debug: Log what we received
        error_log('=== NEWS CREATE DEBUG ===');
        error_log('FILES received: ' . print_r($_FILES, true));
        error_log('POST received: ' . print_r($_POST, true));
        error_log('Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));
        error_log('Request Method: ' . ($_SERVER['REQUEST_METHOD'] ?? 'NOT SET'));
        
        // Check for images in different possible formats
        $hasImages = false;
        if (isset($_FILES['images']) && !empty($_FILES['images'])) {
            $hasImages = true;
            error_log('Found $_FILES["images"]');
        } elseif (isset($_FILES['images[]']) && !empty($_FILES['images[]'])) {
            $hasImages = true;
            error_log('Found $_FILES["images[]"] - converting to images');
            $_FILES['images'] = $_FILES['images[]'];
        }
        
        if ($hasImages && isset($_FILES['images']) && !empty($_FILES['images'])) {
            $images = $_FILES['images'];
            
            // Handle multiple files
            if (is_array($images['name'])) {
                $fileCount = count($images['name']);
                error_log("Processing $fileCount image files");
                
                for ($i = 0; $i < $fileCount; $i++) {
                    $file = [
                        'name' => $images['name'][$i],
                        'type' => $images['type'][$i],
                        'tmp_name' => $images['tmp_name'][$i],
                        'error' => $images['error'][$i],
                        'size' => $images['size'][$i]
                    ];
                    
                    error_log("Processing file $i: " . $file['name'] . " (error: " . $file['error'] . ")");

                    $uploadResult = FileUpload::uploadImage($file, 'news', 'news_' . $newsId);
                    
                    if ($uploadResult && !isset($uploadResult['error'])) {
                        $newsImageModel = new NewsImage();
                        $imageId = $newsImageModel->create([
                            'news_id' => $newsId,
                            'image_path' => $uploadResult['path'],
                            'image_url' => $uploadResult['url'],
                            'display_order' => $i
                        ]);
                        
                        if ($imageId) {
                            $uploadedImages[] = [
                                'id' => $imageId,
                                'path' => $uploadResult['path'],
                                'url' => $uploadResult['url']
                            ];
                            error_log("Image $i uploaded successfully with ID: $imageId");
                        } else {
                            error_log("Failed to save image $i to database");
                            $uploadErrors[] = "Failed to save image " . $file['name'];
                        }
                    } else {
                        $errorMsg = $uploadResult['error'] ?? 'Unknown upload error';
                        error_log("Image upload failed for file $i: $errorMsg");
                        $uploadErrors[] = $file['name'] . ': ' . $errorMsg;
                    }
                }
            } else {
                // Single file
                error_log("Processing single image file: " . $images['name']);
                $uploadResult = FileUpload::uploadImage($images, 'news', 'news_' . $newsId);
                
                if ($uploadResult && !isset($uploadResult['error'])) {
                    $newsImageModel = new NewsImage();
                    $imageId = $newsImageModel->create([
                        'news_id' => $newsId,
                        'image_path' => $uploadResult['path'],
                        'image_url' => $uploadResult['url'],
                        'display_order' => 0
                    ]);
                    
                    if ($imageId) {
                        $uploadedImages[] = [
                            'id' => $imageId,
                            'path' => $uploadResult['path'],
                            'url' => $uploadResult['url']
                        ];
                        error_log("Single image uploaded successfully with ID: $imageId");
                    } else {
                        error_log("Failed to save single image to database");
                        $uploadErrors[] = "Failed to save image to database";
                    }
                } else {
                    $errorMsg = $uploadResult['error'] ?? 'Unknown upload error';
                    error_log("Single image upload failed: $errorMsg");
                    $uploadErrors[] = $images['name'] . ': ' . $errorMsg;
                }
            }
        } else {
            error_log("No images found in \$_FILES['images']");
        }

        // Create notification for admin only if news is pending (operator-created)
        if ($status === 'pending') {
            $notificationModel = new Notification();
            $notificationModel->create([
                'type' => 'news_pending',
                'title' => 'New News Submission',
                'message' => 'A new news article "' . $input['title'] . '" has been submitted for review',
                'related_id' => $newsId,
                'related_type' => 'news'
            ]);
        }

        $news = $newsModel->findById($newsId);
        $news['images'] = $uploadedImages;
        
        // Include upload errors in response if any
        $message = 'News created successfully';
        if (!empty($uploadErrors)) {
            $message .= '. However, some images failed to upload: ' . implode(', ', $uploadErrors);
        } elseif (isset($_FILES['images']) && empty($uploadedImages)) {
            $message .= '. Warning: Images were provided but none were uploaded successfully.';
        }

        Response::success($news, $message, 201);
    }

    public function update($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        $input = json_decode(file_get_contents('php://input'), true);

        $newsModel = new News();
        $news = $newsModel->findById($id);

        if (!$news) {
            Response::notFound('News not found');
        }

        // Only operator who created it can update (if pending)
        if ($user['role'] === 'operator') {
            if ($news['operator_id'] != $user['id']) {
                Response::forbidden('You can only edit your own news');
            }
            if ($news['status'] !== 'pending') {
                Response::forbidden('You can only edit pending news');
            }
        }

        $data = [];

        if (isset($input['title'])) {
            $data['title'] = $input['title'];
            // Regenerate slug if title changes
            $data['slug'] = generateSlug($input['title']);
        }

        if (isset($input['sub_title'])) {
            $data['sub_title'] = $input['sub_title'];
        }

        if (isset($input['content'])) {
            $data['content'] = $input['content'];
        }

        if (empty($data)) {
            Response::error('No data to update', 400);
        }

        if ($newsModel->update($id, $data)) {
            $updatedNews = $newsModel->findById($id);
            Response::success($updatedNews, 'News updated successfully');
        } else {
            Response::error('Failed to update news', 500);
        }
    }

    public function approve($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        if ($user['role'] !== 'admin') {
            Response::forbidden('Only admins can approve news');
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $newsModel = new News();
        $news = $newsModel->findById($id);

        if (!$news) {
            Response::notFound('News not found');
        }

        if ($newsModel->approve($id, $user['id'])) {
            // Create notification
            $notificationModel = new Notification();
            $notificationModel->create([
                'type' => 'news_approved',
                'title' => 'News Approved',
                'message' => 'Your news article "' . $news['title'] . '" has been approved',
                'related_id' => $id,
                'related_type' => 'news'
            ]);

            $updatedNews = $newsModel->findById($id);
            Response::success($updatedNews, 'News approved successfully');
        } else {
            Response::error('Failed to approve news', 500);
        }
    }

    public function reject($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        if ($user['role'] !== 'admin') {
            Response::forbidden('Only admins can reject news');
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $newsModel = new News();
        $news = $newsModel->findById($id);

        if (!$news) {
            Response::notFound('News not found');
        }

        $reason = $input['reason'] ?? null;

        if ($newsModel->reject($id, $user['id'], $reason)) {
            // Create notification
            $notificationModel = new Notification();
            $notificationModel->create([
                'type' => 'news_rejected',
                'title' => 'News Rejected',
                'message' => 'Your news article "' . $news['title'] . '" has been rejected' . ($reason ? ': ' . $reason : ''),
                'related_id' => $id,
                'related_type' => 'news'
            ]);

            $updatedNews = $newsModel->findById($id);
            Response::success($updatedNews, 'News rejected successfully');
        } else {
            Response::error('Failed to reject news', 500);
        }
    }

    public function getAll()
    {
        // Get authenticated user
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        $newsModel = new News();
        
        $filters = [];

        if (isset($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }

        if (isset($_GET['operator_id'])) {
            $filters['operator_id'] = (int)$_GET['operator_id'];
        }

        // category_id filter removed: news no longer belongs directly to categories

        if (isset($_GET['approved_only']) && $_GET['approved_only'] == '1') {
            $filters['approved_only'] = true;
        }

        if (isset($_GET['limit'])) {
            $filters['limit'] = (int)$_GET['limit'];
        }

        if (isset($_GET['offset'])) {
            $filters['offset'] = (int)$_GET['offset'];
        }

        // If operator, automatically filter by their news only
        if ($user['role'] === 'operator') {
            $filters['operator_id'] = $user['id'];
        }

        $newsList = $newsModel->getAll($filters);

        // Get images for each news
        $newsImageModel = new NewsImage();
        foreach ($newsList as &$news) {
            $images = $newsImageModel->findByNewsId($news['id']);
            $news['images'] = $images;
        }

        Response::success($newsList);
    }

    /**
     * Public API: get approved news only (no auth required).
     * Supports: approved_only=1, limit, offset, category_id, sub_category_id via GET.
     */
    public function getPublicAll()
    {
        $newsModel = new News();
        $filters = ['approved_only' => true];

        if (isset($_GET['limit'])) {
            $filters['limit'] = (int)$_GET['limit'];
        }
        if (isset($_GET['offset'])) {
            $filters['offset'] = (int)$_GET['offset'];
        }
        if (isset($_GET['category_id']) && $_GET['category_id'] !== '') {
            $filters['category_id'] = (int)$_GET['category_id'];
        }
        if (isset($_GET['sub_category_id']) && $_GET['sub_category_id'] !== '') {
            $filters['sub_category_id'] = (int)$_GET['sub_category_id'];
        }

        $newsList = $newsModel->getAll($filters);

        $newsImageModel = new NewsImage();
        foreach ($newsList as &$news) {
            $images = $newsImageModel->findByNewsId($news['id']);
            $news['images'] = $images;
        }

        Response::success($newsList);
    }

    public function getById($id)
    {
        $newsModel = new News();
        $news = $newsModel->findById($id);

        if (!$news) {
            Response::notFound('News not found');
        }

        // Get images
        $newsImageModel = new NewsImage();
        $images = $newsImageModel->findByNewsId($id);
        $news['images'] = $images;

        Response::success($news);
    }

    public function incrementViews($id)
    {
        $newsModel = new News();
        $news = $newsModel->findById($id);

        if (!$news) {
            Response::notFound('News not found');
        }

        $newsModel->incrementViews($id);
        Response::success(['views' => $news['views'] + 1], 'Views incremented');
    }

    public function uploadImages($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        $newsModel = new News();
        $news = $newsModel->findById($id);

        if (!$news) {
            Response::notFound('News not found');
        }

        if ($user['role'] === 'operator' && $news['operator_id'] != $user['id']) {
            Response::forbidden('You can only add images to your own news');
        }

        // Debug logging
        error_log('=== UPLOAD IMAGES DEBUG ===');
        error_log('News ID: ' . $id);
        error_log('Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));
        error_log('Request Method: ' . ($_SERVER['REQUEST_METHOD'] ?? 'NOT SET'));
        error_log('FILES keys: ' . print_r(array_keys($_FILES), true));
        error_log('FILES structure: ' . print_r($_FILES, true));
        error_log('POST data: ' . print_r($_POST, true));
        
        // Check PHP upload settings
        error_log('PHP upload_max_filesize: ' . ini_get('upload_max_filesize'));
        error_log('PHP post_max_size: ' . ini_get('post_max_size'));
        error_log('PHP max_file_uploads: ' . ini_get('max_file_uploads'));

        // Check for images in different possible formats
        $hasImages = false;
        if (isset($_FILES['images']) && !empty($_FILES['images'])) {
            $hasImages = true;
            error_log('Found $_FILES["images"]');
        } elseif (isset($_FILES['images[]']) && !empty($_FILES['images[]'])) {
            $hasImages = true;
            error_log('Found $_FILES["images[]"] - converting to images');
            $_FILES['images'] = $_FILES['images[]'];
        }

        if (!$hasImages || !isset($_FILES['images']) || empty($_FILES['images'])) {
            error_log('ERROR: No images found in $_FILES');
            Response::error('No images uploaded', 400);
        }

        $uploadedImages = [];
        $uploadErrors = [];
        $images = $_FILES['images'];
        $newsImageModel = new NewsImage();

        // Get current image count for display order
        $existingImages = $newsImageModel->findByNewsId($id);
        $displayOrder = count($existingImages);
        error_log('Current display order: ' . $displayOrder);

        if (is_array($images['name'])) {
            $fileCount = count($images['name']);
            error_log("Processing $fileCount image files");
            
            for ($i = 0; $i < $fileCount; $i++) {
                $file = [
                    'name' => $images['name'][$i],
                    'type' => $images['type'][$i],
                    'tmp_name' => $images['tmp_name'][$i],
                    'error' => $images['error'][$i],
                    'size' => $images['size'][$i]
                ];
                
                error_log("Processing file $i:");
                error_log("  Name: " . ($file['name'] ?? 'NOT SET'));
                error_log("  Type: " . ($file['type'] ?? 'NOT SET'));
                error_log("  Tmp_name: " . ($file['tmp_name'] ?? 'NOT SET'));
                error_log("  Error code: " . ($file['error'] ?? 'NOT SET'));
                error_log("  Size: " . ($file['size'] ?? 'NOT SET'));
                
                // Check upload error code first
                $errorCode = $file['error'] ?? UPLOAD_ERR_OK;
                if ($errorCode !== UPLOAD_ERR_OK) {
                    $errorMessages = [
                        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive',
                        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
                        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                        UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
                    ];
                    $errorMsg = $errorMessages[$errorCode] ?? 'Unknown upload error: ' . $errorCode;
                    error_log("  ERROR: Upload error code $errorCode - $errorMsg");
                    $uploadErrors[] = $file['name'] . ': ' . $errorMsg;
                    continue;
                }
                
                if (isset($file['tmp_name']) && !empty($file['tmp_name'])) {
                    error_log("  Tmp_name exists: YES");
                    error_log("  Tmp_name is_uploaded_file: " . (is_uploaded_file($file['tmp_name']) ? 'YES' : 'NO'));
                } else {
                    error_log("  Tmp_name exists: NO");
                }

                $uploadResult = FileUpload::uploadImage($file, 'news', 'news_' . $id);
                
                if ($uploadResult && !isset($uploadResult['error'])) {
                    error_log("File $i uploaded successfully, saving to database...");
                    $imageId = $newsImageModel->create([
                        'news_id' => $id,
                        'image_path' => $uploadResult['path'],
                        'image_url' => $uploadResult['url'],
                        'display_order' => $displayOrder + $i
                    ]);
                    
                    if ($imageId) {
                        $uploadedImages[] = [
                            'id' => $imageId,
                            'path' => $uploadResult['path'],
                            'url' => $uploadResult['url']
                        ];
                        error_log("Image $i saved to database with ID: $imageId");
                    } else {
                        error_log("ERROR: Failed to save image $i to database");
                        $uploadErrors[] = "Failed to save " . $file['name'] . " to database";
                    }
                } else {
                    $errorMsg = $uploadResult['error'] ?? 'Unknown upload error';
                    error_log("ERROR: Image upload failed for file $i: $errorMsg");
                    $uploadErrors[] = $file['name'] . ': ' . $errorMsg;
                }
            }
        } else {
            error_log("Processing single image file: " . $images['name']);
            $uploadResult = FileUpload::uploadImage($images, 'news', 'news_' . $id);
            
            if ($uploadResult && !isset($uploadResult['error'])) {
                error_log("Single file uploaded successfully, saving to database...");
                $imageId = $newsImageModel->create([
                    'news_id' => $id,
                    'image_path' => $uploadResult['path'],
                    'image_url' => $uploadResult['url'],
                    'display_order' => $displayOrder
                ]);
                
                if ($imageId) {
                    $uploadedImages[] = [
                        'id' => $imageId,
                        'path' => $uploadResult['path'],
                        'url' => $uploadResult['url']
                    ];
                    error_log("Single image saved to database with ID: $imageId");
                } else {
                    error_log("ERROR: Failed to save single image to database");
                    $uploadErrors[] = "Failed to save image to database";
                }
            } else {
                $errorMsg = $uploadResult['error'] ?? 'Unknown upload error';
                error_log("ERROR: Single image upload failed: $errorMsg");
                $uploadErrors[] = $images['name'] . ': ' . $errorMsg;
            }
        }

        // Return response with error information if any
        $message = 'Images uploaded successfully';
        if (!empty($uploadErrors)) {
            $message .= '. However, some images failed: ' . implode(', ', $uploadErrors);
        } elseif (empty($uploadedImages)) {
            $message = 'No images were uploaded successfully. Please check file size and format.';
        }

        error_log("Upload complete. Uploaded: " . count($uploadedImages) . ", Errors: " . count($uploadErrors));
        Response::success($uploadedImages, $message, 201);
    }

    public function deleteImage($newsId, $imageId)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        $newsModel = new News();
        $news = $newsModel->findById($newsId);

        if (!$news) {
            Response::notFound('News not found');
        }

        if ($user['role'] === 'operator' && $news['operator_id'] != $user['id']) {
            Response::forbidden('You can only delete images from your own news');
        }

        $newsImageModel = new NewsImage();
        
        if ($newsImageModel->delete($imageId)) {
            Response::success(null, 'Image deleted successfully');
        } else {
            Response::error('Failed to delete image', 500);
        }
    }

    public function delete($id)
    {
        $auth = new AuthMiddleware();
        $auth->handle();
        $user = AuthMiddleware::getUser();

        // Only admin can delete news
        if ($user['role'] !== 'admin') {
            Response::forbidden('Only admins can delete news');
        }

        $newsModel = new News();
        $news = $newsModel->findById($id);

        if (!$news) {
            Response::notFound('News not found');
        }

        if ($newsModel->delete($id)) {
            Response::success(null, 'News deleted successfully');
        } else {
            Response::error('Failed to delete news', 500);
        }
    }
}

