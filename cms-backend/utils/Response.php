<?php
/**
 * Response Utility Class
 */

namespace App\Utils;

class Response
{
    public static function json($data, $statusCode = 200, $message = null)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');

        $response = [
            'success' => $statusCode >= 200 && $statusCode < 300,
            'message' => $message,
            'data' => $data
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success($data = null, $message = 'Success', $statusCode = 200)
    {
        self::json($data, $statusCode, $message);
    }

    public static function error($message = 'Error', $statusCode = 400, $data = null)
    {
        self::json($data, $statusCode, $message);
    }

    public static function unauthorized($message = 'Unauthorized')
    {
        self::json(null, 401, $message);
    }

    public static function forbidden($message = 'Forbidden')
    {
        self::json(null, 403, $message);
    }

    public static function notFound($message = 'Not Found')
    {
        self::json(null, 404, $message);
    }

    public static function validationError($errors, $message = 'Validation Error')
    {
        // Flatten nested error arrays
        $flattenedErrors = [];
        foreach ($errors as $field => $fieldErrors) {
            if (is_array($fieldErrors)) {
                $flattenedErrors[$field] = is_array($fieldErrors) && isset($fieldErrors[0]) 
                    ? $fieldErrors[0] 
                    : (is_string($fieldErrors) ? $fieldErrors : 'Invalid value');
            } else {
                $flattenedErrors[$field] = $fieldErrors;
            }
        }
        self::json(['errors' => $flattenedErrors], 422, $message);
    }
}

