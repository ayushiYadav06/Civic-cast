import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';
import { toast } from 'sonner';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('🔵 API Request Interceptor:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      isFormData: config.data instanceof FormData,
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    
    // If FormData, don't set Content-Type - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('📦 FormData detected, Content-Type removed');
    }
    
    console.log('📤 Final request config:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: Object.keys(config.headers),
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error(data?.message || 'Access denied');
          break;
        case 404:
          toast.error(data?.message || 'Resource not found');
          break;
        case 422:
          // Validation errors
          const errors = data?.data?.errors;
          if (errors) {
            Object.keys(errors).forEach((key) => {
              const errorMsg = Array.isArray(errors[key]) 
                ? errors[key][0] 
                : errors[key];
              toast.error(`${key}: ${errorMsg}`);
            });
          } else {
            toast.error(data?.message || 'Validation error');
          }
          break;
        case 500:
          // Show detailed error in development
          const errorMsg = data?.error || data?.message || 'Server error. Please try again.';
          toast.error(errorMsg);
          // Log full error details to console for debugging
          if (data?.error || data?.file) {
            console.error('Server Error Details:', {
              message: data?.message,
              error: data?.error,
              file: data?.file,
              line: data?.line
            });
          }
          break;
        default:
          toast.error(data?.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;
