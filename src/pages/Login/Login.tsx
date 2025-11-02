/**
 * Login Page Component
 * 
 * Modern, clean login page using Ant Design.
 * Features:
 * - Beautiful card-based layout
 * - Form validation
 * - Loading states
 * - Error handling
 * - Responsive design
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const { Title, Text } = Typography;

/**
 * Login Form Values Interface
 * 
 * Defines the shape of form data.
 * Matches the form fields we'll create.
 */
interface LoginFormValues {
  username: string;
  password: string;
}

/**
 * Login Component
 */
const Login = () => {
  /**
   * Hooks
   * 
   * useState: Manages component state
   * useNavigate: React Router hook for navigation
   * useAuth: Our custom hook for authentication
   */
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  
  /**
   * Ant Design Form instance
   * 
   * useForm() creates a form instance that:
   * - Manages form state
   * - Handles validation
   * - Provides methods like setFieldsValue, resetFields
   */
  const [form] = Form.useForm<LoginFormValues>();

  /**
   * Handle form submission
   * 
   * Called when user clicks "Login" button.
   * 
   * @param values - Form values (username, password)
   */
  const handleSubmit = async (values: LoginFormValues) => {
    /**
     * What is message from antd?
     * - Shows notification toasts
     * - message.success() - Green success notification
     * - message.error() - Red error notification
     * - message.loading() - Loading notification
     */
    
    try {
      // Set loading state (disables button, shows spinner)
      setLoading(true);
      
      // Call login function from AuthContext
      const result = await login(values.username, values.password);
      
      if (result.success) {
        // Login successful!
        message.success('Login successful! Welcome back.');
        
        // Navigate to dashboard
        // replace: true prevents going back to login with browser back button
        navigate('/dashboard', { replace: true });
      } else {
        // Login failed - show error message
        message.error(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Unexpected error
      console.error('Login error:', error);
      message.error('An unexpected error occurred. Please try again.');
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  /**
   * Handle form validation failure
   * 
   * Called when user tries to submit with invalid/empty fields.
   */
  const handleSubmitFailed = () => {
    message.warning('Please fill in all required fields.');
  };

  return (
    <div className="login-container">
      {/* 
        Background gradient
        Creates modern, eye-catching background
      */}
      <div className="login-background">
        <div className="gradient-circle circle-1"></div>
        <div className="gradient-circle circle-2"></div>
        <div className="gradient-circle circle-3"></div>
      </div>

      {/* 
        Login Card
        Card component from antd provides elevation and padding
      */}
      <Card className="login-card" bordered={false}>
        {/* 
          Header Section
          Space component provides consistent spacing between elements
        */}
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {/* Logo/Icon */}
          <div className="login-header">
            <div className="logo-circle">
              <LoginOutlined style={{ fontSize: '32px', color: '#ffffff' }} />
            </div>
            <Title level={2} style={{ margin: '16px 0 0 0' }}>
              Budget Tracker
            </Title>
            <Text type="secondary">
              Track your finances with ease
            </Text>
          </div>

          {/* 
            Login Form
            
            Form.useForm() creates form instance
            layout="vertical" - Labels above inputs
            onFinish - Called on successful validation
            onFinishFailed - Called on validation failure
          */}
          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={handleSubmitFailed}
            autoComplete="off"
            size="large"
          >
            {/* 
              Username Field
              
              name: Field identifier (matches LoginFormValues)
              rules: Validation rules
              required: Field is mandatory
              message: Error message to show
            */}
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { 
                  required: true, 
                  message: 'Please enter your username' 
                },
                {
                  min: 3,
                  message: 'Username must be at least 3 characters'
                }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter your username"
                autoFocus
              />
            </Form.Item>

            {/* 
              Password Field
              
              Input.Password - Special input that:
              - Hides password characters
              - Provides show/hide toggle
              - Secure input
            */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { 
                  required: true, 
                  message: 'Please enter your password' 
                },
                {
                  min: 6,
                  message: 'Password must be at least 6 characters'
                }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter your password"
              />
            </Form.Item>

            {/* 
              Submit Button
              
              type="primary" - Blue button (primary action)
              htmlType="submit" - Triggers form submission
              loading - Shows spinner, disables button
              block - Full width button
            */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                icon={<LoginOutlined />}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>

          {/* 
            Test Credentials
            Helpful for testing/demo
          */}
          <div className="test-credentials">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <strong>Test Credentials:</strong>
              <br />
              Username: testuser
              <br />
              Password: testpass123
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;

/**
 * Component Breakdown:
 * 
 * 1. State Management:
 *    - loading: Controls button loading state
 *    - form: Ant Design form instance
 * 
 * 2. Authentication:
 *    - useAuth(): Gets login function
 *    - Calls login with form values
 *    - Navigates on success
 * 
 * 3. Form Validation:
 *    - rules array defines validation
 *    - Ant Design handles validation automatically
 *    - Shows error messages under fields
 * 
 * 4. User Feedback:
 *    - message.success/error for notifications
 *    - Loading spinner on button
 *    - Disabled state during login
 * 
 * 5. Visual Design:
 *    - Card with shadow for depth
 *    - Gradient background for modern look
 *    - Icons for better UX
 *    - Responsive layout
 * 
 * Ant Design Components Used:
 * - Card: Container with elevation
 * - Form: Form management
 * - Input: Text input
 * - Input.Password: Password input
 * - Button: Action button
 * - Typography: Text components
 * - Space: Spacing between elements
 * - Icons: Visual indicators
 * - message: Toast notifications
 */