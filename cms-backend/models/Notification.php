<?php
/**
 * Notification Model
 */

namespace App\Models;

use App\Utils\Database;

class Notification
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO notifications (type, title, message, related_id, related_type, is_read)
             VALUES (:type, :title, :message, :related_id, :related_type, :is_read)"
        );
        
        $result = $stmt->execute([
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'related_id' => $data['related_id'] ?? null,
            'related_type' => $data['related_type'] ?? null,
            'is_read' => $data['is_read'] ?? 0
        ]);

        return $result ? $this->db->lastInsertId() : false;
    }

    public function getAll($filters = [])
    {
        $sql = "SELECT * FROM notifications WHERE 1=1";
        $params = [];

        if (isset($filters['is_read'])) {
            $sql .= " AND is_read = :is_read";
            $params['is_read'] = $filters['is_read'];
        }

        if (isset($filters['type'])) {
            $sql .= " AND type = :type";
            $params['type'] = $filters['type'];
        }

        $sql .= " ORDER BY created_at DESC";

        if (isset($filters['limit'])) {
            $sql .= " LIMIT :limit";
            $params['limit'] = (int)$filters['limit'];
        }

        $stmt = $this->db->prepare($sql);
        
        foreach ($params as $key => $value) {
            if ($key === 'limit') {
                $stmt->bindValue(':' . $key, $value, \PDO::PARAM_INT);
            } else {
                $stmt->bindValue(':' . $key, $value);
            }
        }
        
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function markAsRead($id)
    {
        $stmt = $this->db->prepare("UPDATE notifications SET is_read = 1 WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function markAllAsRead()
    {
        $stmt = $this->db->query("UPDATE notifications SET is_read = 1 WHERE is_read = 0");
        return $stmt->rowCount();
    }

    public function getUnreadCount()
    {
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM notifications WHERE is_read = 0");
        return (int)$stmt->fetch()['total'];
    }
}

