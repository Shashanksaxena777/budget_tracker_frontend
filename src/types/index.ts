/**
 * TypeScript Type Definitions
 * 
 * What are types?
 * - Describe the shape of data
 * - Catch errors at compile time (before running code)
 * - Provide autocomplete in IDE
 * - Make code self-documenting
 * 
 * Why create types?
 * - Consistency across the app
 * - Fewer bugs
 * - Better developer experience
 */

/**
 * User Type
 * 
 * Represents a user object from the backend.
 * This matches the UserSerializer in Django.
 * 
 * Example:
 * {
 *   id: 1,
 *   username: "testuser",
 *   email: "test@example.com",
 *   first_name: "Test",
 *   last_name: "User"
 * }
 */
export interface User {
    id: number;              // User ID (always a number)
    username: string;        // Username (always a string)
    email: string;           // Email address
    first_name: string;      // First name (can be empty string)
    last_name: string;       // Last name (can be empty string)
  }
  
  /**
   * Login Request Type
   * 
   * Data we send to login API.
   * 
   * Example:
   * {
   *   username: "testuser",
   *   password: "testpass123"
   * }
   */
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  /**
   * Login Response Type
   * 
   * Data we receive from login API.
   * This matches the LoginResponseSerializer in Django.
   * 
   * Example:
   * {
   *   token: "abc123xyz...",
   *   user: {
   *     id: 1,
   *     username: "testuser",
   *     ...
   *   }
   * }
   */
  export interface LoginResponse {
    token: string;           // Authentication token
    user: User;              // User object (uses User interface above)
  }
  
  /**
   * Auth Context Type
   * 
   * Describes what AuthContext provides to components.
   * This is the shape of the context value.
   * 
   * Example usage:
   * const { user, login, logout } = useAuth();
   *        ^     ^      ^
   *        |     |      |
   *        User  Function Function
   */
  export interface AuthContextType {
    user: User | null;                    // Current user (null if not logged in)
    token: string | null;                 // Current token (null if not logged in)
    loading: boolean;                     // Is authentication check in progress?
    isAuthenticated: boolean;             // Is user logged in? (boolean)
    login: (username: string, password: string) => Promise<LoginResult>;  // Login function
    logout: () => Promise<void>;          // Logout function
  }
  
  /**
   * Login Result Type
   * 
   * Result returned by login function.
   * Contains success status and optional error message.
   * 
   * Successful login:
   * { success: true }
   * 
   * Failed login:
   * { success: false, error: "Invalid credentials" }
   */
  export interface LoginResult {
    success: boolean;        // Was login successful?
    error?: string;          // Error message (? means optional - only present if success is false)
  }
  
  /**
   * API Error Response Type
   * 
   * Standard error response from Django REST Framework.
   * 
   * Example:
   * {
   *   error: "Invalid credentials"
   * }
   * 
   * Or for field errors:
   * {
   *   username: ["This field is required."],
   *   password: ["This field is required."]
   * }
   */
  export interface ApiError {
    error?: string;                       // General error message
    [key: string]: string[] | string | undefined;  // Field-specific errors
  }
  
  /**
   * Understanding TypeScript Syntax:
   * 
   * 1. interface vs type
   *    - Both define object shapes
   *    - interface is better for objects
   *    - type is better for unions/primitives
   * 
   * 2. Optional properties (?)
   *    error?: string
   *    - Means error may or may not be present
   *    - Without ?, field is required
   * 
   * 3. Union types (|)
   *    user: User | null
   *    - Means user can be User OR null
   *    - Must check before using: if (user) { user.username }
   * 
   * 4. Function types
   *    login: (username: string, password: string) => Promise<LoginResult>
   *    - Takes two string parameters
   *    - Returns a Promise that resolves to LoginResult
   * 
   * 5. Array types
   *    errors: string[]
   *    - Array of strings
   *    - Same as: Array<string>
   * 
   * 6. Index signature
   *    [key: string]: string[]
   *    - Object can have any string keys
   *    - Values must be string arrays
   */
  
  /**
   * Why Use TypeScript Types?
   * 
   * 1. Catch errors early:
   *    // JavaScript - No error until runtime
   *    user.usrname  // Typo! Will be undefined at runtime
   *    
   *    // TypeScript - Error immediately
   *    user.usrname  // ❌ Property 'usrname' does not exist
   *    user.username // ✅ Correct
   * 
   * 2. Better autocomplete:
   *    user.  // IDE shows: id, username, email, first_name, last_name
   * 
   * 3. Self-documenting:
   *    function login(username: string, password: string): Promise<LoginResult>
   *    // You immediately know what it takes and returns!
   * 
   * 4. Refactoring safety:
   *    // Change User interface → TypeScript shows all affected code
   *    // No need to manually search!
   */
  
  // Export everything for use in other files
  // Usage: import { User, LoginResponse } from '../types';