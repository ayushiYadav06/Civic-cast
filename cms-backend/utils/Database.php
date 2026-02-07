<?php
/**
 * Database Connection Class
 */

namespace App\Utils;

use PDO;
use PDOException;

class Database
{
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        $config = require __DIR__ . '/../config/database.php';
        
        $dsn = sprintf(
            "mysql:host=%s;port=%d;dbname=%s;charset=%s",
            $config['host'],
            $config['port'],
            $config['dbname'],
            $config['charset']
        );

        try {
            $this->connection = new PDO(
                $dsn,
                $config['username'],
                $config['password'],
                $config['options']
            );
        } catch (PDOException $e) {
            $errorMsg = "Database connection failed: " . $e->getMessage();
            error_log($errorMsg);
            
            // In debug mode, include more details
            $debug = $_ENV['APP_DEBUG'] ?? false;
            if ($debug) {
                throw new \Exception($errorMsg . " (Host: {$config['host']}, DB: {$config['dbname']}, User: {$config['username']})");
            }
            throw new \Exception("Database connection failed. Check your .env file and ensure MySQL is running.");
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->connection;
    }

    // Prevent cloning
    private function __clone() {}

    // Prevent unserialization
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }
}

