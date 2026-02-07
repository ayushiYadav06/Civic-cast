<?php
/**
 * News Image Model
 */

namespace App\Models;

use App\Utils\Database;

class NewsImage
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO news_images (news_id, image_path, image_url, display_order)
             VALUES (:news_id, :image_path, :image_url, :display_order)"
        );
        
        $result = $stmt->execute([
            'news_id' => $data['news_id'],
            'image_path' => $data['image_path'],
            'image_url' => $data['image_url'],
            'display_order' => $data['display_order'] ?? 0
        ]);

        return $result ? $this->db->lastInsertId() : false;
    }

    public function findByNewsId($newsId)
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM news_images WHERE news_id = :news_id ORDER BY display_order ASC, id ASC"
        );
        $stmt->execute(['news_id' => $newsId]);
        return $stmt->fetchAll();
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM news_images WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $image = $stmt->fetch();

        if ($image) {
            // Delete physical file
            $filePath = __DIR__ . '/../uploads/' . $image['image_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $stmt = $this->db->prepare("DELETE FROM news_images WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function deleteByNewsId($newsId)
    {
        // Get all images first to delete physical files
        $images = $this->findByNewsId($newsId);
        foreach ($images as $image) {
            $filePath = __DIR__ . '/../uploads/' . $image['image_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $stmt = $this->db->prepare("DELETE FROM news_images WHERE news_id = :news_id");
        return $stmt->execute(['news_id' => $newsId]);
    }
}

