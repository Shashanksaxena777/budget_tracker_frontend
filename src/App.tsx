import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Progress } from "antd";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Transactions from "./pages/Transactions/Transactions";
import  Budget from "./pages/Budget/Budget";

const App = () => {
  const { loading, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(100);

  // Animate loader progress bar
  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? prev : prev + Math.random() * 10 + 5));
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9f9f9",
        }}
      >
        <Progress
          type="circle"
          percent={progress}
          size={100}
          status={progress < 100 ? "active" : "success"}
        />
        <p style={{ marginTop: 15, fontSize: 16, color: "#555" }}>
          Authenticating...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={ <PrivateRoute> <Dashboard /> </PrivateRoute> }
        />
        

        <Route
          path="/profile"
          element={ <PrivateRoute> <Dashboard /> </PrivateRoute> }
        />

          <Route
            path="/transactions"
            element={ <PrivateRoute> <Transactions /> </PrivateRoute> }
          />

          <Route
            path="/budget"
            element={ <PrivateRoute> <Budget /> </PrivateRoute> }
          />

        {/* Root Route */}
        <Route
          path="/"
          element={ <PrivateRoute> <Dashboard  /> </PrivateRoute> }
        />

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


















// /**
//  * Main App Component
//  * 
//  * Sets up routing for the application.
//  * Defines which components render for which URLs.
//  */

// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Progress, Spin } from 'antd';
// import { useAuth } from './context/AuthContext';
// import Login from './pages/Login/Login';
// import Dashboard from './pages/Dashboard/Dashboard';
// import { useEffect, useState } from 'react';

// /**
//  * App Component
//  * 
//  * Root component that:
//  * 1. Sets up routing with BrowserRouter
//  * 2. Defines routes for different pages
//  * 3. Handles loading state
//  * 4. Protects routes that require authentication
//  */
// const App = () => {
//   /**
//    * Get auth state
//    * 
//    * loading: true while checking if user is logged in
//    * isAuthenticated: true if user is logged in
//    */
//   const { loading, isAuthenticated } = useAuth();

//   /**
//    * Show loading spinner while checking authentication
//    * 
//    * Why?
//    * - On app load, we check localStorage for saved token
//    * - This takes a moment
//    * - Show spinner instead of flashing login page
//    */

// /***************************************************************************************/
//   // if (loading) {
//   //   return (
//   //     <div style={{ 
//   //       height: '100vh', 
//   //       display: 'flex', 
//   //       justifyContent: 'center', 
//   //       alignItems: 'center' 
//   //     }}>
//   //       <Progress type="circle" percent={100} size={80} />
//   //       <Spin size="large" tip="Loading..." />
//   //     </div>
//   //   );
//   // }
// /***************************************************************************************/

// const [progress, setProgress] = useState<number>(100);

// useEffect(() => {
//   if (loading) {
//     setProgress(0);
//     const interval = setInterval(() => {
//       setProgress((prev:number) => {
//         // Slowly increase progress until it reaches 95%
//         if (prev >= 95) return prev;
//         return prev + Math.floor(Math.random() * 10) + 5; // +5–15%
//       });
//     }, 300);

//     return () => clearInterval(interval);
//   } else {
//     // When loading becomes false, complete the circle
//     setProgress(100);
//   }
// }, [loading]);

// if (loading) {
//   return (
//     <div
//       style={{
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         background: '#f9f9f9'
//       }}
//     >
//       <Progress
//         type="circle"
//         percent={progress}
//         size={100}
//         status={progress < 100 ? 'active' : 'success'}
//       />
//       <p style={{ marginTop: 15, fontSize: 16, color: '#555' }}>
//         Authenticating...
//       </p>
//     </div>
//   );
// }
// /***************************************************************************************/


//   return (
//     /**
//      * BrowserRouter
//      * 
//      * Enables routing in the app.
//      * Uses HTML5 history API for clean URLs.
//      * 
//      * URLs look like:
//      * - /login (not /#/login)
//      * - /dashboard (not /#/dashboard)
//      */
//     <BrowserRouter>
//       {/**
//        * Routes
//        * 
//        * Container for all route definitions.
//        * Only one route matches at a time.
//        */}
//       <Routes>
//         {/**
//          * Login Route
//          * 
//          * Path: /login
//          * Component: Login page
//          * 
//          * If already authenticated, redirect to dashboard.
//          */}
//         <Route 
//           path="/login" 
//           element={
//             isAuthenticated ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Login />
//             )
//           } 
//         />

//         {/**
//          * Dashboard Route (Protected)
//          * 
//          * Path: /dashboard
//          * Component: Dashboard (we'll create this next)
//          * 
//          * If not authenticated, redirect to login.
//          */}
//         <Route 
//           path="/dashboard" 
//           element={
//             isAuthenticated ? (
//               <Dashboard/>
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           } 
//         />

//         {/**
//          * Root Route
//          * 
//          * Path: /
//          * Redirects to appropriate page based on auth status
//          */}
//         <Route 
//           path="/" 
//           element={
//             <Navigate 
//               to={isAuthenticated ? "/dashboard" : "/login"} 
//               replace 
//             />
//           } 
//         />

//         {/**
//          * Catch-all Route (404)
//          * 
//          * Path: * (matches anything not matched above)
//          * Redirects to root
//          */}
//         <Route 
//           path="*" 
//           element={<Navigate to="/" replace />} 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

// /**
//  * Understanding React Router:
//  * 
//  * 1. BrowserRouter
//  *    - Wraps entire app
//  *    - Provides routing context
//  *    - Manages history
//  * 
//  * 2. Routes
//  *    - Container for Route components
//  *    - Only renders first matching route
//  * 
//  * 3. Route
//  *    - Defines URL pattern and component
//  *    - path: URL to match
//  *    - element: Component to render
//  * 
//  * 4. Navigate
//  *    - Programmatic redirection
//  *    - replace: Don't add to history
//  * 
//  * Route Protection Pattern:
//  * 
//  * Protected Route (requires login):
//  * <Route 
//  *   path="/dashboard" 
//  *   element={
//  *     isAuthenticated 
//  *       ? <Dashboard />           // Show if logged in
//  *       : <Navigate to="/login"/> // Redirect if not
//  *   }
//  * />
//  * 
//  * Public Route (login page):
//  * <Route 
//  *   path="/login" 
//  *   element={
//  *     isAuthenticated 
//  *       ? <Navigate to="/dashboard"/> // Redirect if already logged in
//  *       : <Login />                   // Show login if not
//  *   }
//  * />
//  * 
//  * Navigation Flow:
//  * 
//  * User not logged in:
//  * 1. Visit / → Redirect to /login
//  * 2. Enter credentials
//  * 3. Login successful → Redirect to /dashboard
//  * 4. Try to visit /login → Redirect to /dashboard (already logged in)
//  * 
//  * User logged in:
//  * 1. Visit / → Redirect to /dashboard
//  * 2. Try to visit /login → Redirect to /dashboard
//  * 3. Click logout → Token cleared → Redirect to /login
//  * 4. Try to visit /dashboard → Redirect to /login (not logged in)
//  * 
//  * Benefits:
//  * - Clean URLs (no # symbol)
//  * - Browser back/forward works
//  * - Bookmarkable pages
//  * - Protected routes prevent unauthorized access
//  * - Automatic redirects based on auth state
//  */