<?php
/**
 * Category Model
 */

namespace App\Models;

use App\Utils\Database;

class Category
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO categories (name, slug, description, is_active)
             VALUES (:name, :slug, :description, :is_active)"
        );
        
        $result = $stmt->execute([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? 1
        ]);

        return $result ? $this->db->lastInsertId() : false;
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = ['id' => $id];

        $allowedFields = ['name', 'slug', 'description', 'is_active'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE categories SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function findBySlug($slug)
    {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE slug = :slug LIMIT 1");
        $stmt->execute(['slug' => $slug]);
        return $stmt->fetch();
    }

    public function getAll($activeOnly = false)
    {
        $sql = "SELECT * FROM categories";
        
        if ($activeOnly) {
            $sql .= " WHERE is_active = 1";
        }
        
        $sql .= " ORDER BY name ASC";
        
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    public function countNewsByCategory($id)
    {
        // News no longer references categories directly
        return 0;
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM categories WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}

