/**
 * Authentication Context (TypeScript Version)
 * 
 * Provides authentication state and functions to the entire app.
 * Now with full TypeScript type safety!
 */

import { createContext, useState, useEffect, useContext } from 'react';
import type {ReactNode} from 'react'
import api from '../api/axios';
import type { User, AuthContextType, LoginResponse, LoginResult } from '../types';

/**
 * Create Context with Type
 * 
 * createContext<Type | undefined>
 * - Type: What the context provides
 * - undefined: Initial value (before provider wraps app)
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Props Interface
 * 
 * Defines what props AuthProvider accepts.
 * 
 * ReactNode: Type for React children
 * - Can be JSX elements, strings, numbers, etc.
 * - Represents anything React can render
 */
interface AuthProviderProps {
  children: ReactNode;  // Components wrapped by AuthProvider
}

/**
 * AuthProvider Component (TypeScript)
 * 
 * Key TypeScript additions:
 * 1. Props are typed: AuthProviderProps
 * 2. State has explicit types
 * 3. Functions have typed parameters and return types
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  /**
   * State with TypeScript
   * 
   * useState<Type>(initialValue)
   * - Explicitly specify state type
   * - TypeScript infers if you don't specify
   */
  
  // User state: User object or null
  const [user, setUser] = useState<User | null>(null);
  
  // Token state: string or null
  const [token, setToken] = useState<string | null>(null);
  
  // Loading state: boolean (TypeScript infers this)
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * useEffect with TypeScript
   * 
   * Works the same as JavaScript
   * TypeScript checks that cleanup function (if any) returns void
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check Authentication Status
   * 
   * Returns: void (explicitly typed)
   * - void means function doesn't return anything
   */
  const checkAuth = (): void => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        
        // Parse JSON with type assertion
        // JSON.parse returns 'any' by default
        // We tell TypeScript: "Trust me, this is a User"
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login Function (TypeScript)
   * 
   * Parameters: typed as string
   * Return type: Promise<LoginResult>
   * - async functions always return Promise
   * - LoginResult is our interface
   */
  const login = async (
    username: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      /**
       * API call with generic type
       * 
       * api.post<ResponseType>
       * - Tells TypeScript what response.data contains
       * - Enables autocomplete for response.data
       */
      const response = await api.post<LoginResponse>('/api/auth/login/', {
        username,
        password,
      });

      // TypeScript knows response.data has token and user
      const { token: newToken, user: newUser } = response.data;

      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update state
      setToken(newToken);
      setUser(newUser);

      // Return typed success result
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      /**
       * Type narrowing with 'as'
       * 
       * error could be any type
       * We narrow it down: error as AxiosError<ApiError>
       * Then safely access error.response?.data?.error
       */
      const axiosError = error as any;  // Simplified for now
      
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  };

  /**
   * Logout Function (TypeScript)
   * 
   * Returns: Promise<void>
   * - async function that doesn't return a value
   */
  const logout = async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and storage
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  /**
   * Computed value: isAuthenticated
   * 
   * Type is inferred as boolean
   * !! converts truthy/falsy to true/false
   */
  const isAuthenticated = !!token && !!user;

  /**
   * Context Value (TypeScript)
   * 
   * This object must match AuthContextType interface
   * TypeScript will error if we're missing properties or types don't match
   */
  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  /**
   * Provider Component
   * 
   * Provides typed context value to children
   */
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook for Auth Context (TypeScript)
 * 
 * Return type: AuthContextType (not undefined)
 * - We throw error if context is undefined
 * - So return type is always AuthContextType
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    // context is undefined - used outside provider
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  // TypeScript knows context is AuthContextType here
  return context;
};

/**
 * TypeScript Benefits in This File:
 * 
 * 1. Type Safety:
 *    const { user, login } = useAuth();
 *    user.username  // ✅ TypeScript knows User has username
 *    user.invalid   // ❌ Error: Property doesn't exist
 * 
 * 2. Function Signatures:
 *    login('john', 'pass')           // ✅ Correct
 *    login('john')                   // ❌ Error: Missing password
 *    login('john', 123)              // ❌ Error: password must be string
 *    const result = await login(...) // TypeScript knows result is LoginResult
 * 
 * 3. Autocomplete:
 *    const { [cursor here] } = useAuth();
 *    // IDE suggests: user, token, loading, isAuthenticated, login, logout
 * 
 * 4. Refactoring:
 *    // Change AuthContextType → TypeScript shows all affected code
 *    // No need to manually search!
 * 
 * Usage Example in Components:
 * 
 * import { useAuth } from '../context/AuthContext';
 * 
 * function LoginPage() {
 *   const { login, isAuthenticated } = useAuth();
 *   
 *   const handleSubmit = async (e: FormEvent) => {
 *     e.preventDefault();
 *     const result = await login(username, password);
 *     // TypeScript knows result has 'success' and optional 'error'
 *     if (result.success) {
 *       // Redirect to dashboard
 *     } else {
 *       // Show error: result.error
 *     }
 *   };
 * }
 * 
 * function Header() {
 *   const { user, logout } = useAuth();
 *   
 *   // TypeScript knows user can be null
 *   // Optional chaining prevents errors
 *   return (
 *     <div>
 *       Welcome {user?.username}
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 */