/**
 * Application Entry Point
 * 
 * This is where React app starts.
 * - Sets up providers (ConfigProvider, AuthProvider)
 * - Imports global styles
 * - Renders the app
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import theme from './styles/theme';
import './index.css';

/**
 * Understanding the Setup:
 * 
 * 1. ConfigProvider (from antd)
 *    - Configures Ant Design components globally
 *    - Applies our custom theme
 *    - Sets locale (for internationalization)
 * 
 * 2. AuthProvider (our custom provider)
 *    - Provides authentication state to entire app
 *    - Any component can access user/login/logout
 * 
 * 3. Nesting Order Matters!
 *    ConfigProvider → AuthProvider → App
 *    Outer providers wrap inner components
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 
      ConfigProvider: Ant Design configuration 
      - theme: Our custom theme from styles/theme.ts
    */}
    <ConfigProvider theme={theme}>
      {/* 
        AuthProvider: Authentication context 
        - Provides user state and auth functions
      */}
      <AuthProvider>
        {/* 
          App: Main application component 
          - Contains routing and page components
        */}
        <App />
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);

/**
 * What is React.StrictMode?
 * 
 * - Development tool (disabled in production)
 * - Highlights potential problems
 * - Runs effects twice to catch bugs
 * - Warns about deprecated APIs
 * 
 * Benefits:
 * - Catches bugs early
 * - Improves code quality
 * - No performance impact in production
 */

/**
 * What is document.getElementById('root')!
 * 
 * - Finds <div id="root"> in index.html
 * - ! is TypeScript non-null assertion
 * - Says "I'm sure this element exists"
 * - Without !, TypeScript thinks it might be null
 */

/**
 * Provider Hierarchy Visual:
 * 
 * <ConfigProvider>          ← Ant Design theme
 *   <AuthProvider>          ← Authentication state
 *     <App>                 ← Main app
 *       <Router>            ← Routing (we'll add this)
 *         <Login />         ← Login page (can use antd + useAuth)
 *         <Dashboard />     ← Dashboard (can use antd + useAuth)
 *       </Router>
 *     </App>
 *   </AuthProvider>
 * </ConfigProvider>
 * 
 * Any component inside can access:
 * - Ant Design components (styled with our theme)
 * - Auth context (useAuth hook)
 */