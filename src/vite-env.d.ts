/**
 * Vite Environment Variable Types
 * 
 * What is a .d.ts file?
 * - Declaration file
 * - Contains only type information, no implementation
 * - Used to add types to JavaScript code or environment
 * 
 * Why do we need this?
 * - TypeScript doesn't know about our custom VITE_ variables
 * - This file tells TypeScript what variables exist
 * - Provides autocomplete and type checking
 */

/// <reference types="vite/client" />
// This imports default Vite type definitions

/**
 * Extend ImportMetaEnv interface
 * 
 * ImportMetaEnv is Vite's interface for environment variables.
 * We're adding our custom variables to it.
 */
interface ImportMetaEnv {
    /**
     * API Base URL
     * 
     * The backend Django server URL.
     * Example: http://127.0.0.1:8000
     */
    readonly VITE_API_BASE_URL: string;
    
    // Add more environment variables here as needed
    // readonly VITE_ANOTHER_VAR: string;
  }
  
  /**
   * Extend ImportMeta interface
   * 
   * This makes import.meta.env typed.
   */
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  /**
   * Usage in code:
   * 
   * // Without this file:
   * const url = import.meta.env.VITE_API_BASE_URL;
   * // TypeScript error: Property doesn't exist
   * 
   * // With this file:
   * const url = import.meta.env.VITE_API_BASE_URL;
   * // ✅ TypeScript knows this is a string
   * // ✅ Autocomplete works
   * // ✅ Typos are caught: VITE_API_BASE_ULR → Error!
   */