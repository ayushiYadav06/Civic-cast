/**
 * Public API service - no auth required.
 * Used by frontend home page, header, and news sections.
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface PublicSubCategory {
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

export interface PublicNewsImage {
  id: number;
  news_id: number;
  image_path: string;
  image_url: string;
  display_order: number;
}

export interface PublicNews {
  id: number;
  operator_id: number | null;
  sub_category_id: number | null;
  title: string;
  sub_title?: string;
  content: string;
  slug: string;
  status: string;
  views: number;
  category_name?: string;
  sub_category_name?: string;
  operator_name?: string;
  image_count?: number;
  images?: PublicNewsImage[];
  created_at: string;
  updated_at: string;
}

export const publicService = {
  async getCategories(activeOnly = true): Promise<PublicCategory[]> {
    const params = activeOnly ? '?active_only=1' : '';
    const response = await api.get(`${API_ENDPOINTS.PUBLIC_CATEGORIES}${params}`);
    return response.data.data ?? [];
  },

  async getCategoryById(id: number): Promise<PublicCategory> {
    const response = await api.get(API_ENDPOINTS.PUBLIC_CATEGORY_BY_ID(id));
    return response.data.data;
  },

  async getSubCategories(categoryId?: number, activeOnly = true): Promise<PublicSubCategory[]> {
    const params = new URLSearchParams();
    if (activeOnly) params.append('active_only', '1');
    if (categoryId != null) params.append('category_id', String(categoryId));
    const url = params.toString()
      ? `${API_ENDPOINTS.PUBLIC_SUB_CATEGORIES}?${params}`
      : API_ENDPOINTS.PUBLIC_SUB_CATEGORIES;
    const response = await api.get(url);
    return response.data.data ?? [];
  },

  async getSubCategoryById(id: number): Promise<PublicSubCategory> {
    const response = await api.get(API_ENDPOINTS.PUBLIC_SUB_CATEGORY_BY_ID(id));
    return response.data.data;
  },

  async getNews(filters?: {
    limit?: number;
    offset?: number;
    category_id?: number;
    sub_category_id?: number;
  }): Promise<PublicNews[]> {
    const params = new URLSearchParams();
    if (filters?.limit != null) params.append('limit', String(filters.limit));
    if (filters?.offset != null) params.append('offset', String(filters.offset));
    if (filters?.category_id != null) params.append('category_id', String(filters.category_id));
    if (filters?.sub_category_id != null) params.append('sub_category_id', String(filters.sub_category_id));
    const url = params.toString() ? `${API_ENDPOINTS.PUBLIC_NEWS}?${params}` : API_ENDPOINTS.PUBLIC_NEWS;
    const response = await api.get(url);
    return response.data.data ?? [];
  },
};
