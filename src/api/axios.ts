/**
 * Axios Configuration (TypeScript Version)
 * 
 * This file creates a configured axios instance that:
 * 1. Sets base URL automatically
 * 2. Adds authentication token to all requests
 * 3. Handles common errors
 * 4. Has proper TypeScript types
 */

import axios from 'axios';

// These are type-only imports — used only during compile time
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';


/**
 * Understanding Axios Types:
 * 
 * - AxiosError: Type for axios errors
 * - InternalAxiosRequestConfig: Type for request configuration
 * - AxiosResponse: Type for responses (imported automatically)
 */

// Create axios instance with default config
const axiosInstance = axios.create({
  // Base URL from environment variable
  // TypeScript knows this is a string (from vite-env.d.ts)
  baseURL: import.meta.env.VITE_API_BASE_URL,
  
  // Timeout after 10 seconds
  timeout: 10000,
  
  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor (TypeScript)
 * 
 * Key differences from JavaScript:
 * - config parameter is typed: InternalAxiosRequestConfig
 * - Return type is explicit: InternalAxiosRequestConfig
 * - Error is typed: AxiosError
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token && config.headers) {
      // TypeScript ensures headers exists before accessing
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Return modified config
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle request errors
    // Type annotation ensures proper error handling
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor (TypeScript)
 * 
 * Handles responses and errors with proper typing.
 */
axiosInstance.interceptors.response.use(
  // Success handler - return response as-is
  (response) => {
    return response;
  },
  
  // Error handler with TypeScript
  (error: AxiosError<ApiError>): Promise<AxiosError> => {
    /**
     * AxiosError<ApiError>
     * 
     * AxiosError is generic - accepts type for response.data
     * ApiError is our interface from types/index.ts
     * Now error.response.data is properly typed!
     */
    
    // Check if error has a response
    if (error.response) {
      // TypeScript knows error.response exists here
      const status = error.response.status;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Permission denied');
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        console.error('Resource not found');
      }
      
      // Handle 500 Server Error
      if (status === 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    // Always reject so calling code can handle
    return Promise.reject(error);
  }
);

// Export the configured instance
export default axiosInstance;

/**
 * TypeScript Benefits in This File:
 * 
 * 1. Type Safety:
 *    config.headers.Authorization = `Token ${token}`;
 *    // TypeScript ensures headers exists and Authorization is valid
 * 
 * 2. Autocomplete:
 *    error.response.  // IDE shows: status, data, headers, etc.
 * 
 * 3. Error Prevention:
 *    error.response.statuss  // ❌ TypeScript catches typo
 *    error.response.status   // ✅ Correct
 * 
 * 4. Generic Types:
 *    AxiosError<ApiError>
 *    // TypeScript knows error.response.data has ApiError shape
 *    // Can safely access: error.response.data.error
 * 
 * Usage Example with Types:
 * 
 * import api from './api/axios';
 * import { LoginResponse } from './types';
 * 
 * // TypeScript knows response.data is LoginResponse
 * const response = await api.post<LoginResponse>('/api/auth/login/', {
 *   username: 'testuser',
 *   password: 'testpass123'
 * });
 * 
 * // Autocomplete works!
 * const token = response.data.token;      // ✅ string
 * const user = response.data.user;        // ✅ User
 * const invalid = response.data.invalid;  // ❌ Error: Property doesn't exist
 */