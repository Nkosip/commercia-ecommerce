import axios from 'axios';

// Base URL - Use environment variable or default to localhost:8080
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        
        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden:', data.message || 'You do not have permission to access this resource');
          break;
        
        case 404:
          // ✅ Expected case: user has no cart yet
          if (error.config?.url?.includes('/cart/my-cart')) {
            return Promise.reject(error); // let cartApi handle it
          }

          console.error(
            'Resource not found:',
            data.message || 'The requested resource was not found'
          );
          break;
        
        case 500:
          // Server error
          console.error('Server error:', data.message || 'An internal server error occurred');
          break;
        
        default:
          console.error('API Error:', data.message || 'An error occurred');
      }
      
      // Return structured error
      return Promise.reject({
        status,
        message: data.message || 'An error occurred',
        data: data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response from server');
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        data: null,
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        data: null,
      });
    }
  }
);

export default apiClient;
