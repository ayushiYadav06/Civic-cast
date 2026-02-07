<?php
/**
 * Operator Model
 */

namespace App\Models;

use App\Utils\Database;

class Operator
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByLoginId($loginId)
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM operators WHERE login_id = :login_id LIMIT 1"
        );
        $stmt->execute(['login_id' => $loginId]);
        return $stmt->fetch();
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM operators WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO operators (login_id, password, name, area, post, user_id, is_active)
             VALUES (:login_id, :password, :name, :area, :post, :user_id, :is_active)"
        );
        
        $result = $stmt->execute([
            'login_id' => $data['login_id'],
            'password' => $data['password'],
            'name' => $data['name'],
            'area' => $data['area'],
            'post' => $data['post'],
            'user_id' => $data['user_id'] ?? null,
            'is_active' => $data['is_active'] ?? 1
        ]);

        return $result ? $this->db->lastInsertId() : false;
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = ['id' => $id];

        $allowedFields = ['name', 'area', 'post', 'user_id', 'password', 'is_active'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE operators SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }

    public function getAll($activeOnly = false)
    {
        $sql = "SELECT id, login_id, name, area, post, user_id, is_active, created_at, updated_at 
                FROM operators";
        
        if ($activeOnly) {
            $sql .= " WHERE is_active = 1";
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    public function toggleActive($id)
    {
        $stmt = $this->db->prepare(
            "UPDATE operators SET is_active = NOT is_active WHERE id = :id"
        );
        return $stmt->execute(['id' => $id]);
    }

    public function verifyPassword($password, $hash)
    {
        return password_verify($password, $hash);
    }
}

