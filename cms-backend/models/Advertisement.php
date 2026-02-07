<?php
/**
 * Advertisement Model
 */

namespace App\Models;

use App\Utils\Database;

class Advertisement
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO advertisements (title, image_path, image_url, cropped_image_path, cropped_image_url, link_url, is_active)
             VALUES (:title, :image_path, :image_url, :cropped_image_path, :cropped_image_url, :link_url, :is_active)"
        );
        
        $result = $stmt->execute([
            'title' => $data['title'] ?? null,
            'image_path' => $data['image_path'],
            'image_url' => $data['image_url'],
            'cropped_image_path' => $data['cropped_image_path'] ?? null,
            'cropped_image_url' => $data['cropped_image_url'] ?? null,
            'link_url' => $data['link_url'] ?? null,
            'is_active' => $data['is_active'] ?? 1
        ]);

        return $result ? $this->db->lastInsertId() : false;
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = ['id' => $id];

        $allowedFields = ['title', 'image_path', 'image_url', 'cropped_image_path', 'cropped_image_url', 'link_url', 'is_active'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE advertisements SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM advertisements WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function getAll($filters = [])
    {
        $sql = "SELECT * FROM advertisements WHERE 1=1";
        $params = [];

        if (isset($filters['active_only']) && $filters['active_only']) {
            $sql .= " AND is_active = 1";
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function toggleActive($id)
    {
        $stmt = $this->db->prepare(
            "UPDATE advertisements SET is_active = NOT is_active WHERE id = :id"
        );
        return $stmt->execute(['id' => $id]);
    }

    public function delete($id)
    {
        // Get advertisement to delete physical files
        $ad = $this->findById($id);
        if ($ad) {
            if ($ad['image_path']) {
                $filePath = __DIR__ . '/../uploads/' . $ad['image_path'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            if ($ad['cropped_image_path']) {
                $croppedPath = __DIR__ . '/../uploads/' . $ad['cropped_image_path'];
                if (file_exists($croppedPath)) {
                    unlink($croppedPath);
                }
            }
        }

        $stmt = $this->db->prepare("DELETE FROM advertisements WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function getActiveCount()
    {
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM advertisements WHERE is_active = 1");
        return (int)$stmt->fetch()['total'];
    }
}

