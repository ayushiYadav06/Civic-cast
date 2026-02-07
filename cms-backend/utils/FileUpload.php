<?php
/**
 * File Upload Utility Class
 */

namespace App\Utils;

use App\Utils\Response;

class FileUpload
{
    private static function getConfig()
    {
        return require __DIR__ . '/../config/app.php';
    }

    public static function uploadImage($file, $directory, $prefix = '')
    {
        $config = self::getConfig();

        // Debug logging
        error_log('FileUpload::uploadImage called');
        error_log('File array: ' . print_r($file, true));
        
        // Validate file structure
        if (!isset($file['tmp_name'])) {
            error_log('ERROR: tmp_name not set in file array');
            return ['error' => 'No file uploaded - tmp_name not set'];
        }
        
        if (empty($file['tmp_name'])) {
            error_log('ERROR: tmp_name is empty');
            error_log('File error code: ' . ($file['error'] ?? 'NOT SET'));
            return ['error' => 'No file uploaded - tmp_name is empty. Upload error: ' . ($file['error'] ?? 'unknown')];
        }
        
        // Check if file was actually uploaded
        if (!is_uploaded_file($file['tmp_name'])) {
            error_log('ERROR: is_uploaded_file() returned false');
            error_log('tmp_name: ' . $file['tmp_name']);
            error_log('File exists: ' . (file_exists($file['tmp_name']) ? 'YES' : 'NO'));
            error_log('File error code: ' . ($file['error'] ?? 'NOT SET'));
            
            // Check for specific upload error codes
            $errorCode = $file['error'] ?? UPLOAD_ERR_OK;
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
                UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
            ];
            
            $errorMsg = $errorMessages[$errorCode] ?? 'Unknown upload error: ' . $errorCode;
            return ['error' => 'No file uploaded - ' . $errorMsg];
        }

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['error' => 'File upload error: ' . $file['error']];
        }

        // Check file size
        if ($file['size'] > $config['max_upload_size']) {
            return ['error' => 'File size exceeds maximum allowed size'];
        }

        // Validate MIME type
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
        } else {
            // Fallback to file extension
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $extensionMap = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp'
            ];
            $mimeType = $extensionMap[$extension] ?? $file['type'];
        }

        if (!in_array($mimeType, $config['allowed_image_types'])) {
            return ['error' => 'Invalid file type. Only images are allowed'];
        }

        // Create directory if it doesn't exist
        $uploadPath = $config['upload_path'] . '/' . $directory;
        if (!is_dir($uploadPath)) {
            if (!mkdir($uploadPath, 0755, true)) {
                return ['error' => 'Failed to create upload directory: ' . $uploadPath];
            }
        }
        
        // Check if directory is writable
        if (!is_writable($uploadPath)) {
            return ['error' => 'Upload directory is not writable: ' . $uploadPath];
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $prefix . '_' . uniqid() . '_' . time() . '.' . $extension;
        $filePath = $uploadPath . '/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            return ['error' => 'Failed to save uploaded file'];
        }

        // Return relative path and URL
        $relativePath = 'uploads/' . $directory . '/' . $filename;
        $baseUrl = rtrim($config['base_url'], '/');
        $url = $baseUrl . '/' . $relativePath;

        return [
            'path' => $relativePath,
            'url' => $url,
            'filename' => $filename,
            'size' => $file['size'],
            'mime_type' => $mimeType
        ];
    }

    public static function cropImage($imagePath, $x, $y, $width, $height, $outputPath = null)
    {
        $config = self::getConfig();
        $fullImagePath = $config['upload_path'] . '/' . $imagePath;

        if (!file_exists($fullImagePath)) {
            return ['error' => 'Source image not found'];
        }

        // Get image info
        if (!function_exists('finfo_open')) {
            return ['error' => 'FileInfo extension is not available'];
        }
        
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $fullImagePath);
        finfo_close($finfo);

        // Create image resource based on type
        switch ($mimeType) {
            case 'image/jpeg':
                $source = imagecreatefromjpeg($fullImagePath);
                break;
            case 'image/png':
                $source = imagecreatefrompng($fullImagePath);
                break;
            case 'image/gif':
                $source = imagecreatefromgif($fullImagePath);
                break;
            case 'image/webp':
                $source = imagecreatefromwebp($fullImagePath);
                break;
            default:
                return ['error' => 'Unsupported image type for cropping'];
        }

        if (!$source) {
            return ['error' => 'Failed to load source image'];
        }

        // Create cropped image
        $cropped = imagecrop($source, [
            'x' => (int)$x,
            'y' => (int)$y,
            'width' => (int)$width,
            'height' => (int)$height
        ]);

        if (!$cropped) {
            imagedestroy($source);
            return ['error' => 'Failed to crop image'];
        }

        // Generate output path if not provided
        if ($outputPath === null) {
            $pathInfo = pathinfo($imagePath);
            $outputPath = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '_cropped.' . $pathInfo['extension'];
        }

        $fullOutputPath = $config['upload_path'] . '/' . $outputPath;

        // Ensure output directory exists
        $outputDir = dirname($fullOutputPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        // Save cropped image
        $saved = false;
        switch ($mimeType) {
            case 'image/jpeg':
                $saved = imagejpeg($cropped, $fullOutputPath, 90);
                break;
            case 'image/png':
                $saved = imagepng($cropped, $fullOutputPath, 9);
                break;
            case 'image/gif':
                $saved = imagegif($cropped, $fullOutputPath);
                break;
            case 'image/webp':
                $saved = imagewebp($cropped, $fullOutputPath, 90);
                break;
        }

        imagedestroy($source);
        imagedestroy($cropped);

        if (!$saved) {
            imagedestroy($source);
            imagedestroy($cropped);
            return ['error' => 'Failed to save cropped image'];
        }

        $baseUrl = rtrim($config['base_url'], '/');
        return [
            'path' => $outputPath,
            'url' => $baseUrl . '/' . $outputPath
        ];
    }

    public static function deleteFile($filePath)
    {
        $config = self::getConfig();
        $fullPath = $config['upload_path'] . '/' . $filePath;

        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }
}

