<?php
/**
 * News Model
 */

namespace App\Models;

use App\Utils\Database;

class News
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO news (operator_id, title, sub_title, content, slug, status)
             VALUES (:operator_id, :title, :sub_title, :content, :slug, :status)"
        );
        
        $result = $stmt->execute([
            'operator_id' => isset($data['operator_id']) ? $data['operator_id'] : null,
            'title' => $data['title'],
            'sub_title' => $data['sub_title'] ?? null,
            'content' => $data['content'],
            'slug' => $data['slug'],
            'status' => $data['status'] ?? 'pending'
        ]);

        return $result ? $this->db->lastInsertId() : false;
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = ['id' => $id];

        $allowedFields = ['title', 'sub_title', 'content', 'slug', 'status'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE news SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }

    public function delete($id)
    {
        // First delete all associated images
        $newsImageModel = new \App\Models\NewsImage();
        $newsImageModel->deleteByNewsId($id);
        
        // Then delete the news record
        $stmt = $this->db->prepare("DELETE FROM news WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function approve($id, $adminId)
    {
        $stmt = $this->db->prepare(
            "UPDATE news SET status = 'approved', approved_by = :admin_id, approved_at = NOW()
             WHERE id = :id"
        );
        return $stmt->execute(['id' => $id, 'admin_id' => $adminId]);
    }

    public function reject($id, $adminId, $reason = null)
    {
        $stmt = $this->db->prepare(
            "UPDATE news SET status = 'rejected', approved_by = :admin_id, rejected_reason = :reason
             WHERE id = :id"
        );
        return $stmt->execute(['id' => $id, 'admin_id' => $adminId, 'reason' => $reason]);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare(
                "SELECT n.*, 
                    sc.name as sub_category_name,
                    o.name as operator_name,
                    a.name as approved_by_name,
                    (SELECT COUNT(*) FROM news_images WHERE news_id = n.id) as image_count
                 FROM news n
                 LEFT JOIN sub_categories sc ON n.sub_category_id = sc.id
                 LEFT JOIN operators o ON n.operator_id = o.id
                 LEFT JOIN admins a ON n.approved_by = a.id
                 WHERE n.id = :id LIMIT 1"
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function getAll($filters = [])
    {
        $sql = "SELECT n.*, 
                   sc.name as sub_category_name,
                   o.name as operator_name,
                   (SELECT COUNT(*) FROM news_images WHERE news_id = n.id) as image_count
            FROM news n
            LEFT JOIN sub_categories sc ON n.sub_category_id = sc.id
            LEFT JOIN operators o ON n.operator_id = o.id
            WHERE 1=1";

        $params = [];

        if (isset($filters['status'])) {
            $sql .= " AND n.status = :status";
            $params['status'] = $filters['status'];
        }

        if (isset($filters['operator_id'])) {
            $sql .= " AND n.operator_id = :operator_id";
            $params['operator_id'] = $filters['operator_id'];
        }

        if (isset($filters['category_id'])) {
            $sql .= " AND sc.category_id = :category_id";
            $params['category_id'] = (int)$filters['category_id'];
        }

        if (isset($filters['sub_category_id'])) {
            $sql .= " AND n.sub_category_id = :sub_category_id";
            $params['sub_category_id'] = (int)$filters['sub_category_id'];
        }

        if (isset($filters['slug'])) {
            $sql .= " AND n.slug = :slug";
            $params['slug'] = $filters['slug'];
        }

        if (isset($filters['approved_only']) && $filters['approved_only']) {
            $sql .= " AND n.status = 'approved'";
        }

        $sql .= " ORDER BY n.created_at DESC";

        if (isset($filters['limit'])) {
            $sql .= " LIMIT :limit";
            $params['limit'] = (int)$filters['limit'];
            
            if (isset($filters['offset'])) {
                $sql .= " OFFSET :offset";
                $params['offset'] = (int)$filters['offset'];
            }
        }

        $stmt = $this->db->prepare($sql);
        
        foreach ($params as $key => $value) {
            if ($key === 'limit' || $key === 'offset') {
                $stmt->bindValue(':' . $key, $value, \PDO::PARAM_INT);
            } else {
                $stmt->bindValue(':' . $key, $value);
            }
        }
        
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function incrementViews($id)
    {
        $stmt = $this->db->prepare("UPDATE news SET views = views + 1 WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function getStats()
    {
        $stats = [];

        // Total news count
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM news");
        $stats['total_news'] = (int)$stmt->fetch()['total'];

        // Total views
        $stmt = $this->db->query("SELECT SUM(views) as total_views FROM news");
        $stats['total_views'] = (int)($stmt->fetch()['total_views'] ?? 0);

        // News posted this month
        $stmt = $this->db->query(
            "SELECT COUNT(*) as total FROM news 
             WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
             AND YEAR(created_at) = YEAR(CURRENT_DATE())"
        );
        $stats['news_this_month'] = (int)$stmt->fetch()['total'];

        // Pending news count
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM news WHERE status = 'pending'");
        $stats['pending_news'] = (int)$stmt->fetch()['total'];

        return $stats;
    }
}

