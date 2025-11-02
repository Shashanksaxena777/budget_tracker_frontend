/**
 * Ant Design Theme Configuration
 * 
 * Customizes the default antd theme to match our app's design.
 * This creates a consistent, modern look across all components.
 */

import type { ThemeConfig } from 'antd';

/**
 * Theme Configuration Object
 * 
 * What is ThemeConfig?
 * - TypeScript interface from antd
 * - Defines all possible theme customizations
 * - Provides autocomplete for theme options
 */
export const theme: ThemeConfig = {
  /**
   * Token: Design tokens (colors, spacing, etc.)
   * 
   * Design tokens are the building blocks of the design system.
   * Think of them as CSS variables on steroids.
   */
  token: {
    // Primary color - Used for primary buttons, links, etc.
    // A vibrant blue that's modern and professional
    colorPrimary: '#1677ff',
    
    // Border radius - Rounded corners
    // 8px gives a modern, soft look
    borderRadius: 8,
    
    // Font family - Clean, modern font stack
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    
    // Font sizes
    fontSize: 14,           // Base font size
    fontSizeHeading1: 38,   // h1 size
    fontSizeHeading2: 30,   // h2 size
    fontSizeHeading3: 24,   // h3 size
    
    // Line height - Better readability
    lineHeight: 1.5,
    
    // Colors for success, warning, error, info
    colorSuccess: '#52c41a',  // Green
    colorWarning: '#faad14',  // Orange
    colorError: '#ff4d4f',    // Red
    colorInfo: '#1677ff',     // Blue
    
    // Background colors
    colorBgContainer: '#ffffff',  // White background for cards, modals
    colorBgLayout: '#f0f2f5',     // Light gray for page background
    
    // Text colors
    colorText: 'rgba(0, 0, 0, 0.88)',           // Primary text
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',  // Secondary text
    colorTextDisabled: 'rgba(0, 0, 0, 0.25)',   // Disabled text
    
    // Box shadow - Subtle depth
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
  },
  
  /**
   * Component-specific customizations
   * 
   * Override default styles for specific components
   */
  components: {
    // Button customization
    Button: {
      // Large buttons by default
      controlHeight: 40,
      // Bold text in buttons
      fontWeight: 500,
      // Primary button styles
      primaryColor: '#ffffff',
    },
    
    // Input customization
    Input: {
      // Taller inputs for better touch targets
      controlHeight: 40,
      // Add some padding
      paddingBlock: 10,
      paddingInline: 12,
    },
    
    // Card customization
    Card: {
      // More padding in cards
      paddingLG: 24,
      // Subtle border
      borderRadiusLG: 12,
    },
    
    // Form customization
    Form: {
      // Space between form items
      itemMarginBottom: 24,
      // Label font weight
      labelFontSize: 14,
    },
    
    // Table customization (for transaction list)
    Table: {
      // Row height
      cellPaddingBlock: 16,
      // Header background
      headerBg: '#fafafa',
      // Border color
      borderColor: '#f0f0f0',
    },
  },
  
  /**
   * Algorithm: Light or dark mode
   * 
   * We're using light mode for now.
   * Can easily switch to dark mode later.
   */
  // algorithm: theme.darkAlgorithm,  // Uncomment for dark mode
};

/**
 * How This Works:
 * 
 * 1. Import this theme in main.tsx
 * 2. Wrap app with ConfigProvider
 * 3. All antd components use these styles automatically!
 * 
 * Example:
 * import { ConfigProvider } from 'antd';
 * import { theme } from './styles/theme';
 * 
 * <ConfigProvider theme={theme}>
 *   <App />
 * </ConfigProvider>
 * 
 * Benefits:
 * - Consistent design across all components
 * - Easy to change theme (just modify this file)
 * - No need to style individual components
 * - Professional, polished look
 */

export default theme;