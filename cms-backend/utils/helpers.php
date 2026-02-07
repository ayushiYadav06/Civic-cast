<?php
/**
 * Helper Functions
 */

function generateSlug($string)
{
    $string = strtolower(trim($string));
    $string = preg_replace('/[^a-z0-9-]/', '-', $string);
    $string = preg_replace('/-+/', '-', $string);
    $string = trim($string, '-');
    return $string;
}

function generateLoginId($name, $area)
{
    $nameParts = explode(' ', strtolower(trim($name)));
    $firstName = $nameParts[0] ?? '';
    $lastName = isset($nameParts[1]) ? substr($nameParts[1], 0, 3) : '';
    $areaCode = substr(strtolower(trim($area)), 0, 3);
    $random = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
    
    return $firstName . $lastName . $areaCode . $random;
}

function generatePassword($length = 8)
{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $password;
}

function hashPassword($password)
{
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash)
{
    return password_verify($password, $hash);
}

