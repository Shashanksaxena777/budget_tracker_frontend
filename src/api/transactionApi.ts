/**
 * Transaction API Service
 * 
 * Functions to interact with transaction endpoints.
 * All API calls for transactions go through here.
 */

import api from './axios';

/**
 * Transaction Type Definitions
 * 
 * Matches the Django Transaction model
 */

// Transaction object from backend
export interface Transaction {
  id: number;
  user: number;                    // User ID
  category: number;                // Category ID
  category_name?: string;          // Category name (populated by backend)
  type: 'income' | 'expense';      // Transaction type
  amount: string;                  // Decimal as string (e.g., "100.00")
  description: string;
  date: string;                    // ISO date string (e.g., "2024-01-15")
  created_at: string;
  updated_at: string;
}

// Request body for creating/updating transaction
export interface TransactionRequest {
  category: number;
  type: 'income' | 'expense';
  amount: number | string;
  description: string;
  date: string;
}

// Financial summary from backend
export interface FinancialSummary {
  total_income: string;           // Decimal as string
  total_expenses: string;
  balance: string;
  income_count: number;           // Number of income transactions
  expense_count: number;          // Number of expense transactions
}

// Paginated response
export interface PaginatedResponse<T> {
  count: number;                  // Total number of items
  next: string | null;            // URL to next page
  previous: string | null;        // URL to previous page
  results: T[];                   // Array of items
}

/**
 * Get Financial Summary
 * 
 * Fetches total income, expenses, and balance.
 * 
 * Endpoint: GET /api/transactions/summary/
 * 
 * @returns Promise<FinancialSummary>
 */
export const getFinancialSummary = async (): Promise<FinancialSummary> => {
  /**
   * What happens here:
   * 
   * 1. api.get<FinancialSummary> - Tells TypeScript response type
   * 2. Axios interceptor adds Authorization header automatically
   * 3. Django validates token and returns data
   * 4. response.data contains the FinancialSummary object
   */
  const response = await api.get<FinancialSummary>('/api/transactions/summary/');
  return response.data;
};

/**
 * Get All Transactions
 * 
 * Fetches paginated list of transactions.
 * 
 * Endpoint: GET /api/transactions/
 * 
 * @param page - Page number (default: 1)
 * @param pageSize - Items per page (default: 10)
 * @returns Promise<PaginatedResponse<Transaction>>
 */
export const getTransactions = async (
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Transaction>> => {
  /**
   * Query parameters
   * 
   * params object becomes: ?page=1&page_size=10
   * Django REST Framework handles pagination automatically
   */
  const response = await api.get<PaginatedResponse<Transaction>>('/api/transactions/', {
    params: {
      page,
      page_size: pageSize,
    },
  });
  return response.data;
};

/**
 * Get Recent Transactions
 * 
 * Fetches the most recent transactions (for dashboard).
 * 
 * @param limit - Number of transactions to fetch (default: 5)
 * @returns Promise<Transaction[]>
 */
export const getRecentTransactions = async (limit: number = 5): Promise<Transaction[]> => {
  /**
   * ordering=-date means:
   * - Sort by date field
   * - Descending order (newest first)
   * - The minus sign (-) indicates descending
   */
  const response = await api.get<PaginatedResponse<Transaction>>('/api/transactions/', {
    params: {
      page: 1,
      page_size: limit,
      ordering: '-date',  // Newest first
    },
  });
  return response.data.results;
};

/**
 * Get Single Transaction
 * 
 * Fetches details of a specific transaction.
 * 
 * @param id - Transaction ID
 * @returns Promise<Transaction>
 */
export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.get<Transaction>(`/api/transactions/${id}/`);
  return response.data;
};

/**
 * Create Transaction
 * 
 * Creates a new transaction.
 * 
 * Endpoint: POST /api/transactions/
 * 
 * @param data - Transaction data
 * @returns Promise<Transaction>
 */
export const createTransaction = async (
  data: TransactionRequest
): Promise<Transaction> => {
  /**
   * POST request with data in body
   * 
   * Django receives:
   * {
   *   "category": 1,
   *   "type": "income",
   *   "amount": "1000.00",
   *   "description": "Salary",
   *   "date": "2024-01-15"
   * }
   */
  const response = await api.post<Transaction>('/api/transactions/', data);
  return response.data;
};

/**
 * Update Transaction
 * 
 * Updates an existing transaction.
 * 
 * Endpoint: PUT /api/transactions/{id}/
 * 
 * @param id - Transaction ID
 * @param data - Updated transaction data
 * @returns Promise<Transaction>
 */
export const updateTransaction = async (
  id: number,
  data: TransactionRequest
): Promise<Transaction> => {
  /**
   * PUT replaces entire object
   * PATCH would update only provided fields
   * 
   * We use PUT for full updates
   */
  const response = await api.put<Transaction>(`/api/transactions/${id}/`, data);
  return response.data;
};

/**
 * Delete Transaction
 * 
 * Deletes a transaction.
 * 
 * Endpoint: DELETE /api/transactions/{id}/
 * 
 * @param id - Transaction ID
 * @returns Promise<void>
 */
export const deleteTransaction = async (id: number): Promise<void> => {
  /**
   * DELETE returns no content (204 status)
   * So we don't return response.data
   */
  await api.delete(`/api/transactions/${id}/`);
};

/**
 * Filter Transactions
 * 
 * Fetches transactions with filters.
 * 
 * @param filters - Filter options
 * @returns Promise<PaginatedResponse<Transaction>>
 */
export interface TransactionFilters {
  type?: 'income' | 'expense';    // Filter by type
  category?: number;              // Filter by category ID
  date_from?: string;             // Start date (ISO format)
  date_to?: string;               // End date (ISO format)
  min_amount?: number;            // Minimum amount
  max_amount?: number;            // Maximum amount
  search?: string;                // Search in description
  ordering?: string;              // Sort field (e.g., "-date", "amount")
  page?: number;
  page_size?: number;
}

export const filterTransactions = async (
  filters: TransactionFilters
): Promise<PaginatedResponse<Transaction>> => {
  /**
   * All filters become query parameters
   * 
   * Example URL:
   * /api/transactions/?type=income&date_from=2024-01-01&ordering=-date
   * 
   * Django-filter handles this automatically
   */
  const response = await api.get<PaginatedResponse<Transaction>>('/api/transactions/', {
    params: filters,
  });
  return response.data;
};

/**
 * Usage Examples:
 * 
 * // Get summary
 * const summary = await getFinancialSummary();
 * console.log(summary.balance); // "5000.00"
 * 
 * // Get recent transactions
 * const recent = await getRecentTransactions(5);
 * recent.forEach(t => console.log(t.description));
 * 
 * // Create transaction
 * const newTransaction = await createTransaction({
 *   category: 1,
 *   type: 'income',
 *   amount: 1000,
 *   description: 'Salary',
 *   date: '2024-01-15'
 * });
 * 
 * // Filter transactions
 * const filtered = await filterTransactions({
 *   type: 'expense',
 *   date_from: '2024-01-01',
 *   date_to: '2024-01-31',
 *   ordering: '-amount'
 * });
 * 
 * Error Handling:
 * 
 * try {
 *   const summary = await getFinancialSummary();
 * } catch (error) {
 *   // Axios interceptor already handled common errors
 *   // Just show user-friendly message
 *   message.error('Failed to load summary');
 * }
 */

/**
 * Why separate API service?
 * 
 * Benefits:
 * 1. Centralized API calls - Easy to maintain
 * 2. Type safety - All types in one place
 * 3. Reusability - Use in any component
 * 4. Testing - Easy to mock API calls
 * 5. Changes - Update endpoint once, affects all
 * 
 * Without API service:
 * // In every component:
 * const response = await api.get('/api/transactions/');
 * // Repeat types, endpoints everywhere
 * 
 * With API service:
 * // In component:
 * const transactions = await getTransactions();
 * // Clean, typed, reusable!
 */