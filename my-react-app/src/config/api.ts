// API Configuration
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://civiccast.in/cms-backend';
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  
  // Dashboard
  DASHBOARD: '/api/admin/dashboard',
  NOTIFICATIONS: '/api/admin/notifications',
  MARK_NOTIFICATION_READ: '/api/admin/notifications/mark-read',
  MARK_ALL_NOTIFICATIONS_READ: '/api/admin/notifications/mark-all-read',
  
  // Categories
  CATEGORIES: '/api/admin/categories',
  CATEGORY_BY_ID: (id: number) => `/api/admin/categories/${id}`,
  // Public (no auth - for frontend home/header)
  PUBLIC_CATEGORIES: '/api/categories',
  PUBLIC_CATEGORY_BY_ID: (id: number) => `/api/categories/${id}`,

  // Sub-Categories
  SUB_CATEGORIES: '/api/admin/sub-categories',
  SUB_CATEGORIES_BY_CATEGORY: (id: number) => `/api/admin/categories/${id}/sub-categories`,
  SUB_CATEGORY_BY_ID: (id: number) => `/api/admin/sub-categories/${id}`,
  // Public (no auth)
  PUBLIC_SUB_CATEGORIES: '/api/sub-categories',
  PUBLIC_SUB_CATEGORY_BY_ID: (id: number) => `/api/sub-categories/${id}`,
  
  // Operators
  OPERATORS: '/api/admin/operators',
  OPERATOR_BY_ID: (id: number) => `/api/admin/operators/${id}`,
  TOGGLE_OPERATOR_ACTIVE: (id: number) => `/api/admin/operators/${id}/toggle-active`,
  
  // News
  NEWS: '/api/news',
  PUBLIC_NEWS: '/api/news', // approved only, no auth
  ADMIN_NEWS: '/api/admin/news',
  OPERATOR_NEWS: '/api/operator/news',
  NEWS_BY_ID: (id: number) => `/api/news/${id}`,
  ADMIN_NEWS_BY_ID: (id: number) => `/api/admin/news/${id}`,
  DELETE_NEWS: (id: number) => `/api/admin/news/${id}`,
  APPROVE_NEWS: (id: number) => `/api/admin/news/${id}/approve`,
  REJECT_NEWS: (id: number) => `/api/admin/news/${id}/reject`,
  NEWS_IMAGES: (id: number) => `/api/news/${id}/images`,
  DELETE_NEWS_IMAGE: (newsId: number, imageId: number) => `/api/news/${newsId}/images/${imageId}`,
  INCREMENT_VIEWS: (id: number) => `/api/news/${id}/views`,
  
  // Advertisements
  ADVERTISEMENTS: '/api/admin/advertisements',
  ADVERTISEMENT_BY_ID: (id: number) => `/api/admin/advertisements/${id}`,
  CROP_ADVERTISEMENT: (id: number) => `/api/admin/advertisements/${id}/crop`,
  TOGGLE_ADVERTISEMENT_ACTIVE: (id: number) => `/api/admin/advertisements/${id}/toggle-active`,
  OPERATOR_ADVERTISEMENTS: '/api/operator/advertisements',
  OPERATOR_ADVERTISEMENT_BY_ID: (id: number) => `/api/operator/advertisements/${id}`,
  PUBLIC_ADVERTISEMENTS: '/api/advertisements',
};
