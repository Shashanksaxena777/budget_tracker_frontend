/**
 * Dashboard Layout Component
 * 
 * Provides consistent layout for all dashboard pages.
 * Features:
 * - Header with user info and logout
 * - Sidebar with navigation
 * - Content area for page content
 * - Responsive design (collapsible sidebar)
 */

import { useEffect, useRef, useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Button } from 'antd';
import {
  DashboardOutlined,
  TransactionOutlined,
  WalletOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { MenuProps } from 'antd';
import './DashboardLayout.css';
import ProfileModal from '../Profile/ProfileModal';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

/**
 * Props Interface
 * 
 * children: React components to render in content area
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout Component
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  /**
   * State & Hooks
   */
  const [collapsed, setCollapsed] = useState(true);  // Sidebar collapsed state
  const [isMobile, setIsMobile] = useState(false); 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
   // Mobile detection
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const siderRef = useRef<HTMLDivElement | null>(null);

  // Detect clicks or touches outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        isMobile &&
        !collapsed &&
        siderRef.current &&
        !siderRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, collapsed]);
  

  /**
   * Detect mobile screen size
   */
  useEffect(() => {
    const checkMobile = () => {
    setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth <= 992) {
        setCollapsed(true);
      }
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Handle Logout
   * 
   * Logs out user and redirects to login
   */
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  /**
   * Sidebar Menu Items
   * 
   * MenuProps['items'] provides TypeScript types for menu items
   */
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: 'Transactions',
      onClick: () => navigate('/transactions'),
    },
    {
      key: '/budget',
      icon: <WalletOutlined />,
      label: 'Budget',
      onClick: () => navigate('/budget'),
    },
  ];

  /**
   * User Dropdown Menu
   * 
   * Shows when clicking on avatar/username
   */
  const userMenuItems: MenuProps['items'] = [
    {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
        onClick: () => setIsProfileModalOpen(true),
      },      
    {
      type: 'divider',  // Separator line
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,  // Red color for logout
    },
  ];

  /**
   * Get active menu key based on current route
   * 
   * Why?
   * - Highlights current page in sidebar
   * - Helps user know where they are
   */
  const selectedKey = location.pathname;

  return (
    <>
    <Layout className="dashboard-layout">
      {/**
       * Sidebar (Sider)
       * 
       * trigger={null} - We'll use custom trigger button
       * collapsible - Can be collapsed
       * collapsed - Current collapsed state
       */}
       {isMobile && !collapsed && (
        <div className="overlay" onClick={() => setCollapsed(true)} />
        )}

      <Sider
        ref={siderRef}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        className="dashboard-sider"
        >

        {/**
         * Logo Section
         * 
         * Shows app name/logo at top of sidebar
         */}
        <div className="logo-section">
          <WalletOutlined className="logo-icon" />
          {!collapsed && (
            <Text strong className="logo-text">
              Budget Tracker
            </Text>
          )}
        </div>

        {/**
         * Navigation Menu
         * 
         * theme="dark" - Dark sidebar (modern look)
         * mode="inline" - Vertical menu
         * selectedKeys - Currently selected item
         * items - Menu items array
         */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className="dashboard-menu"
        />
      </Sider>

      <Layout>
        {/**
         * Header
         * 
         * Contains:
         * - Toggle button (collapse/expand sidebar)
         * - User info
         * - Logout button
         */}
        <Header className="dashboard-header">
          {/**
           * Collapse/Expand Button
           * 
           * Shows different icon based on collapsed state
           */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="trigger-button"
          />

          {/**
           * User Section (Right side)
           * 
           * Dropdown shows user menu on click
           */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="user-section" style={{ cursor: 'pointer' }}>
              {/**
               * Avatar
               * 
               * Shows user's first letter or user icon
               */}
              <Avatar 
                size="default" 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1677ff' }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              
              {/**
               * Username
               * 
               * Only show on larger screens (hidden on mobile)
               */}
              <Text strong className="username desktop-only">
                {user?.username}
              </Text>
            </Space>
          </Dropdown>
        </Header>

        {/**
         * Content Area
         * 
         * Main content goes here (dashboard, transactions, etc.)
         * Children prop renders page-specific content
         */}
        <Content className="dashboard-content">
          {children}
        </Content>
      </Layout>
    </Layout>
    <ProfileModal
    open={isProfileModalOpen}
    onClose={() => setIsProfileModalOpen(false)}
    user={{
        first_name: user?.first_name,
        last_name: user?.last_name,
      username: user?.username,
      email: user?.email,
      id: user?.id?.toString() || '001',
    }}
  />
  </>
  
  );
};

export default DashboardLayout;

/**
 * Understanding Ant Design Layout:
 * 
 * Structure:
 * <Layout>                 ← Root container
 *   <Sider>                ← Sidebar (left)
 *     <Menu />             ← Navigation menu
 *   </Sider>
 *   <Layout>               ← Right side container
 *     <Header />           ← Top bar
 *     <Content />          ← Main content area
 *   </Layout>
 * </Layout>
 * 
 * Visual:
 * ┌─────────────────────────────────┐
 * │ Sider │  Header               │
 * │       │─────────────────────────│
 * │ Menu  │                         │
 * │       │  Content (children)     │
 * │       │                         │
 * │       │                         │
 * └─────────────────────────────────┘
 * 
 * Responsive Behavior:
 * - Desktop: Full sidebar visible
 * - Tablet: Collapsible sidebar
 * - Mobile: Auto-collapsed, can expand
 * 
 * Menu Item Structure:
 * {
 *   key: '/dashboard',        // Unique identifier
 *   icon: <DashboardOutlined />,  // Icon
 *   label: 'Dashboard',       // Display text
 *   onClick: () => navigate('/dashboard')  // Click handler
 * }
 * 
 * Dropdown Menu:
 * - Triggered by clicking avatar/username
 * - Shows user options (profile, logout)
 * - placement="bottomRight" - Opens below, aligned right
 * 
 * Usage in App:
 * 
 * <DashboardLayout>
 *   <h1>Dashboard Page</h1>
 *   <p>Content here</p>
 * </DashboardLayout>
 * 
 * Benefits:
 * - Consistent layout across all pages
 * - Reusable navigation
 * - Responsive design built-in
 * - Professional look
 * - Easy to maintain
 */