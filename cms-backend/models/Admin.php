<?php
/**
 * Admin Model
 */

namespace App\Models;

use App\Utils\Database;

class Admin
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByEmailOrUsername($emailOrUsername)
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM admins WHERE email = :email OR username = :username LIMIT 1"
        );
        $stmt->execute([
            'email' => $emailOrUsername,
            'username' => $emailOrUsername
        ]);
        $result = $stmt->fetch();
        
        // Ensure we return false if no result (instead of null)
        return $result ? $result : false;
    }
    

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM admins WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function verifyPassword($password, $hash)
    {
        return password_verify($password, $hash);
    }
}

