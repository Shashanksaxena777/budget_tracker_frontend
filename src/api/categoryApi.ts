/**
 * Category API Service
 * 
 * Functions to interact with category endpoints.
 */

import api from './axios';

/**
 * Category Type Definitions
 */

// Category object from backend
export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  created_at: string;
}

// Request body for creating category
export interface CategoryRequest {
  name: string;
  type: 'income' | 'expense';
}

/**
 * Get All Categories
 * 
 * Fetches all categories for the current user.
 * 
 * @returns Promise<Category[]>
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/api/categories/');
  return response.data;
};

/**
 * Get Categories by Type
 * 
 * Filters categories by income or expense.
 * 
 * @param type - 'income' or 'expense'
 * @returns Promise<Category[]>
 */
export const getCategoriesByType = async (
  type: 'income' | 'expense'
): Promise<Category[]> => {
  const response = await api.get<Category[]>('/api/categories/', {
    params: { type },
  });
  return response.data;
};

/**
 * Create Category
 * 
 * Creates a new category.
 * 
 * @param data - Category data
 * @returns Promise<Category>
 */
export const createCategory = async (
  data: CategoryRequest
): Promise<Category> => {
  const response = await api.post<Category>('/api/categories/', data);
  return response.data;
};

/**
 * Update Category
 * 
 * Updates an existing category.
 * 
 * @param id - Category ID
 * @param data - Updated category data
 * @returns Promise<Category>
 */
export const updateCategory = async (
  id: number,
  data: CategoryRequest
): Promise<Category> => {
  const response = await api.put<Category>(`/api/categories/${id}/`, data);
  return response.data;
};

/**
 * Delete Category
 * 
 * Deletes a category.
 * 
 * @param id - Category ID
 * @returns Promise<void>
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/api/categories/${id}/`);
};