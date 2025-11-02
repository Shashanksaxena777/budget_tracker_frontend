/**
 * Budget API Service
 * 
 * Functions to interact with budget endpoints.
 */

import api from './axios';

/**
 * Budget Type Definitions
 */

// Budget object from backend
export interface Budget {
  id: number;
  month: string;                    // ISO date string (YYYY-MM-DD)
  budget_amount: string;            // Decimal as string
  actual_expenses: string;          // Computed by backend
  remaining: string;                // Computed by backend
  percentage_used: number;          // Computed by backend
  created_at: string;
  updated_at: string;
}

// Request body for creating/updating budget
export interface BudgetRequest {
  month: string;                    // YYYY-MM-DD (first day of month)
  budget_amount: number | string;
}

// Budget comparison data
export interface BudgetComparison {
  budget_amount: string;
  actual_expenses: string;
  remaining: string;
  percentage_used: number;
  by_category: CategoryExpense[];
}

// Category expense in comparison
export interface CategoryExpense {
  category_id: number;
  category_name: string;
  amount: string;
  percentage: number;
}

/**
 * Get All Budgets
 * 
 * Fetches all budgets for the current user.
 * 
 * @returns Promise<Budget[]>
 */
export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get<Budget[]>('/api/budgets/');
  return response.data;
};

/**
 * Get Current Month Budget
 * 
 * Fetches budget for the current month.
 * 
 * Endpoint: GET /api/budgets/current/
 * 
 * @returns Promise<Budget>
 */
export const getCurrentBudget = async (): Promise<Budget> => {
  const response = await api.get<Budget>('/api/budgets/current/');
  return response.data;
};

/**
 * Get Budget Comparison
 * 
 * Fetches budget vs actual comparison for current month.
 * Includes breakdown by category.
 * 
 * Endpoint: GET /api/budgets/comparison/
 * 
 * @returns Promise<BudgetComparison>
 */
export const getBudgetComparison = async (): Promise<BudgetComparison> => {
  const response = await api.get<BudgetComparison>('/api/budgets/comparison/');
  return response.data;
};

/**
 * Create Budget
 * 
 * Creates a new budget for a specific month.
 * 
 * @param data - Budget data
 * @returns Promise<Budget>
 */
export const createBudget = async (data: BudgetRequest): Promise<Budget> => {
  const response = await api.post<Budget>('/api/budgets/', data);
  return response.data;
};

/**
 * Update Budget
 * 
 * Updates an existing budget.
 * 
 * @param id - Budget ID
 * @param data - Updated budget data
 * @returns Promise<Budget>
 */
export const updateBudget = async (
  id: number,
  data: BudgetRequest
): Promise<Budget> => {
  const response = await api.put<Budget>(`/api/budgets/${id}/`, data);
  return response.data;
};

/**
 * Delete Budget
 * 
 * Deletes a budget.
 * 
 * @param id - Budget ID
 * @returns Promise<void>
 */
export const deleteBudget = async (id: number): Promise<void> => {
  await api.delete(`/api/budgets/${id}/`);
};

/**
 * Usage Examples:
 * 
 * // Get current month budget
 * try {
 *   const budget = await getCurrentBudget();
 *   console.log(`Budget: ₹${budget.budget_amount}`);
 *   console.log(`Spent: ₹${budget.actual_expenses}`);
 *   console.log(`Remaining: ₹${budget.remaining}`);
 * } catch (error) {
 *   // No budget set for current month
 *   console.log('No budget set');
 * }
 * 
 * // Get comparison with category breakdown
 * const comparison = await getBudgetComparison();
 * comparison.by_category.forEach(cat => {
 *   console.log(`${cat.category_name}: ₹${cat.amount} (${cat.percentage}%)`);
 * });
 * 
 * // Create budget for current month
 * const newBudget = await createBudget({
 *   month: '2024-11-01',
 *   budget_amount: 50000
 * });
 */