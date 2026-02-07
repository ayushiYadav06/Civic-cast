import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Dashboard
export const dashboardService = {
  async getStats() {
    const response = await api.get(API_ENDPOINTS.DASHBOARD);
    return response.data.data;
  },
  
  async getNotifications(filters?: { is_read?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.is_read !== undefined) params.append('is_read', filters.is_read.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS}?${params}`);
    return response.data.data;
  },
  
  async markNotificationAsRead(id: number) {
    const response = await api.post(API_ENDPOINTS.MARK_NOTIFICATION_READ, { id });
    return response.data;
  },
  
  async markAllNotificationsAsRead() {
    const response = await api.post(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ);
    return response.data;
  },
};

// Categories
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export const categoryService = {
  async getAll(activeOnly?: boolean) {
    const params = activeOnly ? '?active_only=1' : '';
    const response = await api.get(`${API_ENDPOINTS.CATEGORIES}${params}`);
    return response.data.data;
  },
  
  async getById(id: number) {
    const response = await api.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data.data;
  },
  
  async create(data: { name: string; slug: string; description?: string; is_active?: number }) {
    const response = await api.post(API_ENDPOINTS.CATEGORIES, data);
    return response.data.data;
  },
  
  async update(id: number, data: Partial<Category>) {
    const response = await api.put(API_ENDPOINTS.CATEGORY_BY_ID(id), data);
    return response.data.data;
  },
  
  async delete(id: number) {
    const response = await api.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  },
};

// Sub-Categories
export interface SubCategory {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  description?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export const subCategoryService = {
  async getAll(categoryId?: number, activeOnly?: boolean) {
    let url = API_ENDPOINTS.SUB_CATEGORIES;
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId.toString());
    if (activeOnly) params.append('active_only', '1');
    if (params.toString()) url += `?${params}`;
    
    const response = await api.get(url);
    return response.data.data;
  },
  
  async getById(id: number) {
    const response = await api.get(API_ENDPOINTS.SUB_CATEGORY_BY_ID(id));
    return response.data.data;
  },
  
  async getByCategoryId(categoryId: number, activeOnly?: boolean) {
    const params = activeOnly ? '?active_only=1' : '';
    const response = await api.get(`${API_ENDPOINTS.SUB_CATEGORIES_BY_CATEGORY(categoryId)}${params}`);
    return response.data.data;
  },
  
  async create(data: { category_id: number; name: string; slug: string; description?: string; is_active?: number }) {
    const response = await api.post(API_ENDPOINTS.SUB_CATEGORIES, data);
    return response.data.data;
  },
  
  async update(id: number, data: Partial<SubCategory>) {
    const response = await api.put(API_ENDPOINTS.SUB_CATEGORY_BY_ID(id), data);
    return response.data.data;
  },
  
  async delete(id: number) {
    const response = await api.delete(API_ENDPOINTS.SUB_CATEGORY_BY_ID(id));
    return response.data;
  },
};

// Operators
export interface Operator {
  id: number;
  login_id: string;
  name: string;
  area: string;
  post: string;
  user_id?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  generated_password?: string;
}

export const operatorService = {
  async getAll(activeOnly?: boolean) {
    const params = activeOnly ? '?active_only=1' : '';
    const response = await api.get(`${API_ENDPOINTS.OPERATORS}${params}`);
    return response.data.data;
  },
  
  async getById(id: number) {
    const response = await api.get(API_ENDPOINTS.OPERATOR_BY_ID(id));
    return response.data.data;
  },
  
  async create(data: { name: string; area: string; post: string; user_id?: string }) {
    const response = await api.post(API_ENDPOINTS.OPERATORS, data);
    return response.data.data;
  },
  
  async update(id: number, data: Partial<Operator & { password?: string }>) {
    const response = await api.put(API_ENDPOINTS.OPERATOR_BY_ID(id), data);
    return response.data.data;
  },
  
  async toggleActive(id: number) {
    const response = await api.post(API_ENDPOINTS.TOGGLE_OPERATOR_ACTIVE(id));
    return response.data.data;
  },
};

// News
export interface News {
  id: number;
  operator_id: number;
  category_id: number;
  sub_category_id?: number;
  title: string;
  sub_title?: string;
  content: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  approved_by?: number;
  approved_at?: string;
  rejected_reason?: string;
  category_name?: string;
  sub_category_name?: string;
  operator_name?: string;
  approved_by_name?: string;
  image_count?: number;
  created_at: string;
  updated_at: string;
}

export interface NewsImage {
  id: number;
  news_id: number;
  image_path: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export const newsService = {
  async getAll(filters?: { status?: string; operator_id?: number; category_id?: number; limit?: number; offset?: number; endpoint?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.operator_id) params.append('operator_id', filters.operator_id.toString());
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    // Use provided endpoint or default to admin
    const endpoint = filters?.endpoint || API_ENDPOINTS.ADMIN_NEWS;
    const url = params.toString() ? `${endpoint}?${params}` : endpoint;
    const response = await api.get(url);
    return response.data.data;
  },
  
  async getById(id: number) {
    const response = await api.get(API_ENDPOINTS.ADMIN_NEWS_BY_ID(id));
    return response.data.data;
  },
  
  async create(data: { title: string; sub_title?: string; content: string; images?: File[] }) {
    console.log('📤 newsService.create called with data:', {
      title: data.title,
      has_sub_title: !!data.sub_title,
      content_length: data.content.length,
      images_count: data.images?.length || 0,
    });
    
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.sub_title) {
      formData.append('sub_title', data.sub_title);
    }
    formData.append('content', data.content);
    
    if (data.images && data.images.length > 0) {
      console.log('📷 Adding images to FormData:', data.images.length);
      data.images.forEach((image, index) => {
        // Verify it's a File object
        if (image instanceof File) {
          formData.append('images[]', image);
          console.log(`  Image ${index + 1}: ${image.name} (${image.size} bytes, type: ${image.type})`);
        } else {
          console.error(`  ❌ Image ${index + 1} is not a File object:`, image);
        }
      });
      
      // Verify FormData contains the images
      const formDataEntries = Array.from(formData.entries());
      const imageEntries = formDataEntries.filter(([key]) => key === 'images[]');
      console.log('📋 FormData image entries count:', imageEntries.length);
      if (imageEntries.length === 0) {
        console.error('❌ WARNING: No images found in FormData entries!');
      }
    } else {
      console.log('⚠️ No images to upload');
    }
    
    console.log('🌐 Making API POST request to:', API_ENDPOINTS.NEWS);
    console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => ({
      key,
      value: value instanceof File ? `${value.name} (${value.size} bytes)` : value,
    })));
    
    try {
      // Don't set Content-Type header - let browser set it with boundary for FormData
      // The interceptor will handle this automatically
      const response = await api.post(API_ENDPOINTS.NEWS, formData);
      console.log('✅ API response received:', response.status, response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ API call failed:', error);
      console.error('Error request config:', error.config);
      throw error;
    }
  },
  
  async update(id: number, data: { title?: string; sub_title?: string; content?: string }) {
    const response = await api.put(API_ENDPOINTS.NEWS_BY_ID(id), data);
    return response.data.data;
  },
  
  async approve(id: number) {
    const response = await api.post(API_ENDPOINTS.APPROVE_NEWS(id));
    return response.data.data;
  },
  
  async reject(id: number, reason?: string) {
    const response = await api.post(API_ENDPOINTS.REJECT_NEWS(id), { reason });
    return response.data.data;
  },

  async delete(id: number) {
    try {
      console.log('📤 newsService.delete calling:', API_ENDPOINTS.DELETE_NEWS(id));
      const response = await api.delete(API_ENDPOINTS.DELETE_NEWS(id));
      console.log('📥 newsService.delete response:', response.status, response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ newsService.delete error:', error);
      throw error;
    }
  },
  
  async uploadImages(newsId: number, images: File[]) {
    console.log('📤 uploadImages called with:', images.length, 'images');
    
    const formData = new FormData();
    images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append('images[]', image);
        console.log(`  Added image ${index + 1}: ${image.name} (${image.size} bytes, type: ${image.type})`);
      } else {
        console.error(`  ❌ Image ${index + 1} is not a File object:`, image);
      }
    });
    
    // Verify FormData
    const formDataEntries = Array.from(formData.entries());
    const imageEntries = formDataEntries.filter(([key]) => key === 'images[]');
    console.log('📋 FormData contains', imageEntries.length, 'image entries');
    
    try {
      // Don't set Content-Type header - let browser set it with boundary for FormData
      // The interceptor will handle this automatically
      console.log('🌐 Making API POST request to:', API_ENDPOINTS.NEWS_IMAGES(newsId));
      const response = await api.post(API_ENDPOINTS.NEWS_IMAGES(newsId), formData);
      console.log('✅ API response received:', response.status, response.data);
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log('📷 Uploaded images:', response.data.data.length);
        response.data.data.forEach((img: any, index: number) => {
          console.log(`  Image ${index + 1}: ID ${img.id}, URL: ${img.url || img.image_url}`);
        });
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Image upload failed:', error);
      console.error('Error details:', {
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },
  
  async deleteImage(newsId: number, imageId: number) {
    const response = await api.delete(API_ENDPOINTS.DELETE_NEWS_IMAGE(newsId, imageId));
    return response.data;
  },
};

// Advertisements
export interface Advertisement {
  id: number;
  title?: string;
  image_path: string;
  image_url: string;
  cropped_image_path?: string;
  cropped_image_url?: string;
  link_url?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export const advertisementService = {
  async getAll(filters?: { active_only?: boolean; endpoint?: string }) {
    const params = new URLSearchParams();
    if (filters?.active_only) params.append('active_only', '1');
    
    const endpoint = filters?.endpoint || API_ENDPOINTS.ADVERTISEMENTS;
    const url = params.toString() ? `${endpoint}?${params}` : endpoint;
    const response = await api.get(url);
    return response.data.data;
  },
  
  async getById(id: number, endpoint?: string) {
    const adEndpoint = endpoint || API_ENDPOINTS.ADVERTISEMENTS;
    // Extract base endpoint and use it to build the URL
    const baseEndpoint = adEndpoint.replace('/advertisements', '');
    const url = `${baseEndpoint}/advertisements/${id}`;
    const response = await api.get(url);
    return response.data.data;
  },
  
  async create(data: FormData) {
    const response = await api.post(API_ENDPOINTS.ADVERTISEMENTS, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  
  async update(id: number, data: FormData | Partial<Advertisement>) {
    const isFormData = data instanceof FormData;
    const response = await api.put(API_ENDPOINTS.ADVERTISEMENT_BY_ID(id), data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data.data;
  },
  
  async cropImage(id: number, cropData: { x: number; y: number; width: number; height: number }) {
    const response = await api.post(API_ENDPOINTS.CROP_ADVERTISEMENT(id), cropData);
    return response.data.data;
  },
  
  async toggleActive(id: number) {
    const response = await api.post(API_ENDPOINTS.TOGGLE_ADVERTISEMENT_ACTIVE(id));
    return response.data.data;
  },
  
  async delete(id: number) {
    const response = await api.delete(API_ENDPOINTS.ADVERTISEMENT_BY_ID(id));
    return response.data;
  },
};
