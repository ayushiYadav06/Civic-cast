<?php
/**
 * Dashboard Controller (Admin Only)
 */

namespace App\Controllers;

use App\Models\News;
use App\Models\Advertisement;
use App\Models\Notification;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Operator;
use App\Utils\Response;

class DashboardController
{
    public function getStats()
    {
        try {
            $newsModel = new News();
            $adModel = new Advertisement();
            $categoryModel = new Category();
            $subCategoryModel = new SubCategory();
            $operatorModel = new Operator();

            $newsStats = $newsModel->getStats();
            $activeAds = $adModel->getActiveCount();
            
            // Get total counts
            $categories = $categoryModel->getAll();
            $subCategories = $subCategoryModel->getAll();
            $operators = $operatorModel->getAll();
            $allAds = $adModel->getAll();

            Response::success([
                'news' => [
                    'total' => $newsStats['total_news'],
                    'total_views' => $newsStats['total_views'],
                    'this_month' => $newsStats['news_this_month'],
                    'pending' => $newsStats['pending_news']
                ],
                'categories' => [
                    'total' => count($categories)
                ],
                'sub_categories' => [
                    'total' => count($subCategories)
                ],
                'operators' => [
                    'total' => count($operators)
                ],
                'advertisements' => [
                    'total' => count($allAds),
                    'active' => $activeAds
                ]
            ]);
        } catch (\Exception $e) {
            error_log('DashboardController::getStats error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            Response::error('Failed to load dashboard stats: ' . $e->getMessage(), 500);
        }
    }

    public function getNotifications()
    {
        $notificationModel = new Notification();
        
        $filters = [];
        if (isset($_GET['is_read'])) {
            $filters['is_read'] = (int)$_GET['is_read'];
        }
        if (isset($_GET['limit'])) {
            $filters['limit'] = (int)$_GET['limit'];
        } else {
            $filters['limit'] = 50;
        }

        $notifications = $notificationModel->getAll($filters);

        Response::success($notifications);
    }

    public function markNotificationAsRead()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;

        if (!$id) {
            Response::error('Notification ID is required', 400);
        }

        $notificationModel = new Notification();
        if ($notificationModel->markAsRead($id)) {
            Response::success(null, 'Notification marked as read');
        } else {
            Response::error('Failed to update notification', 500);
        }
    }

    public function markAllNotificationsAsRead()
    {
        $notificationModel = new Notification();
        $count = $notificationModel->markAllAsRead();
        
        Response::success(['count' => $count], 'All notifications marked as read');
    }
}

