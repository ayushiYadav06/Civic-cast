<?php
/**
 * Validation Utility Class
 */

namespace App\Utils;

class Validator
{
    public static function email($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function required($value)
    {
        if (is_null($value)) {
            return false;
        }
        if (is_string($value)) {
            return !empty(trim($value));
        }
        if (is_numeric($value)) {
            return true; // 0 is valid
        }
        return !empty($value);
    }

    public static function minLength($value, $min)
    {
        return strlen($value) >= $min;
    }

    public static function maxLength($value, $max)
    {
        return strlen($value) <= $max;
    }

    public static function slug($slug)
    {
        if (empty($slug)) {
            return false;
        }
        // Allow Unicode letters and numbers, hyphens and underscores
        // Uses Unicode property escapes to accept letters from other scripts
        $pattern = '/^[\p{L}\p{N}]+(?:[-_][\p{L}\p{N}]+)*$/u';
        return preg_match($pattern, $slug) === 1;
    }

    public static function validate($data, $rules)
    {
        $errors = [];

        foreach ($rules as $field => $ruleSet) {
            $rulesArray = explode('|', $ruleSet);
            
            foreach ($rulesArray as $rule) {
                $ruleParts = explode(':', $rule);
                $ruleName = $ruleParts[0];
                $ruleValue = $ruleParts[1] ?? null;

                $value = $data[$field] ?? null;

                switch ($ruleName) {
                    case 'required':
                        if (!self::required($value)) {
                            if (!isset($errors[$field])) {
                                $errors[$field] = [];
                            }
                            $errors[$field][] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
                        }
                        break;
                    case 'email':
                        if ($value && !self::email($value)) {
                            $errors[$field][] = ucfirst($field) . ' must be a valid email';
                        }
                        break;
                    case 'min':
                        if ($value && !self::minLength($value, (int)$ruleValue)) {
                            $errors[$field][] = ucfirst($field) . ' must be at least ' . $ruleValue . ' characters';
                        }
                        break;
                    case 'max':
                        if ($value && !self::maxLength($value, (int)$ruleValue)) {
                            $errors[$field][] = ucfirst($field) . ' must not exceed ' . $ruleValue . ' characters';
                        }
                        break;
                    case 'slug':
                        if ($value && !self::slug($value)) {
                            $errors[$field][] = ucfirst($field) . ' must be a valid slug';
                        }
                        break;
                }
            }
        }

        return $errors;
    }
}

