<?php
/**
 * Sub-Category Model
 */

namespace App\Models;

use App\Utils\Database;

class SubCategory
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO sub_categories (category_id, name, slug, description, is_active)
             VALUES (:category_id, :name, :slug, :description, :is_active)"
        );
        
        $result = $stmt->execute([
            'category_id' => $data['category_id'],
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

        $allowedFields = ['category_id', 'name', 'slug', 'description', 'is_active'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE sub_categories SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare(
            "SELECT sc.*, c.name as category_name 
             FROM sub_categories sc
             LEFT JOIN categories c ON sc.category_id = c.id
             WHERE sc.id = :id LIMIT 1"
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function findByCategoryId($categoryId, $activeOnly = false)
    {
        $sql = "SELECT sc.*, c.name as category_name 
                FROM sub_categories sc
                LEFT JOIN categories c ON sc.category_id = c.id
                WHERE sc.category_id = :category_id";
        
        if ($activeOnly) {
            $sql .= " AND sc.is_active = 1";
        }
        
        $sql .= " ORDER BY sc.name ASC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['category_id' => $categoryId]);
        return $stmt->fetchAll();
    }

    public function getAll($activeOnly = false)
    {
        $sql = "SELECT sc.*, c.name as category_name 
                FROM sub_categories sc
                LEFT JOIN categories c ON sc.category_id = c.id";
        
        if ($activeOnly) {
            $sql .= " WHERE sc.is_active = 1";
        }
        
        $sql .= " ORDER BY c.name ASC, sc.name ASC";
        
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    public function countNewsBySubCategory($id)
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM news WHERE sub_category_id = :id");
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result['count'] ?? 0;
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM sub_categories WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}

