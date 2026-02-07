<?php
/**
 * JWT Utility Class
 */

namespace App\Utils;

use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;

class JWT
{
    private static function getConfig()
    {
        return require __DIR__ . '/../config/jwt.php';
    }

    public static function encode($payload)
    {
        $config = self::getConfig();
        
        $issuedAt = time();
        $expiration = $issuedAt + $config['expiration'];
        
        $token = [
            'iss' => $config['issuer'],
            'iat' => $issuedAt,
            'exp' => $expiration,
            'data' => $payload
        ];

        return FirebaseJWT::encode($token, $config['secret'], $config['algorithm']);
    }

    public static function decode($token)
    {
        $config = self::getConfig();
        
        try {
            if (empty($token)) {
                return null;
            }
            
            $decoded = FirebaseJWT::decode($token, new Key($config['secret'], $config['algorithm']));
            
            // Convert stdClass to array recursively
            return json_decode(json_encode($decoded), true);
        } catch (\Firebase\JWT\ExpiredException $e) {
            error_log('JWT expired: ' . $e->getMessage());
            return null;
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            error_log('JWT signature invalid: ' . $e->getMessage());
            return null;
        } catch (\Exception $e) {
            error_log('JWT decode error: ' . $e->getMessage());
            return null;
        }
    }

    public static function validate($token)
    {
        $decoded = self::decode($token);
        if (!$decoded) {
            return false;
        }

        // Check expiration
        if (isset($decoded['exp']) && $decoded['exp'] < time()) {
            return false;
        }

        return true;
    }
}

