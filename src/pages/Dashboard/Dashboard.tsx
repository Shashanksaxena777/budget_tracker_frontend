/**
 * Dashboard Page
 * 
 * Main dashboard that displays:
 * - Financial summary cards
 * - Income vs Expenses chart
 * - Recent transactions
 * 
 * Features:
 * - Fetches data on mount
 * - Auto-refresh capability
 * - Error handling
 * - Loading states
 * - Responsive layout
 */

import { useState, useEffect } from 'react';
import { Typography, Row, Col, Space, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SummaryCards from './components/SummaryCards';
import FinancialChart from './components/FinancialCharts';
import RecentTransactions from './components/RecentTransactions';
import { 
  getFinancialSummary, 
  getRecentTransactions,
  type FinancialSummary,
  type Transaction 
} from '../../api/transactionApi';
import './Dashboard.css';

const { Title } = Typography;

/**
 * Dashboard Component
 */
const Dashboard = () => {
  /**
   * State Management
   * 
   * Why separate loading states?
   * - Can show skeleton for different sections
   * - Better UX than single spinner
   * - Can reload sections independently
   */
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * useEffect - Fetch data on component mount
   * 
   * [] dependency means: run once when component mounts
   * 
   * Why useEffect?
   * - Can't make component function async
   * - useEffect handles side effects (API calls)
   * - Runs after render
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetch Dashboard Data
   * 
   * Fetches summary and recent transactions.
   * Called on mount and when user clicks refresh.
   */
  const fetchData = async () => {
    try {
      /**
       * Fetch in parallel using Promise.all
       * 
       * Why Promise.all?
       * - Both requests run simultaneously
       * - Faster than sequential (await, await)
       * - Waits for both to complete
       * 
       * Sequential (slow):
       * const summary = await getSummary();    // Wait 500ms
       * const txns = await getTransactions();  // Wait 500ms
       * Total: 1000ms
       * 
       * Parallel (fast):
       * Promise.all([getSummary(), getTransactions()])
       * Both run together, total: 500ms
       */
      const [summaryData, transactionsData] = await Promise.all([
        getFinancialSummary(),
        getRecentTransactions(5),  // Get 5 most recent
      ]);

      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (error) {
      /**
       * Error Handling
       * 
       * Axios interceptor already handled common errors (401, 500).
       * Here we just show user-friendly message.
       */
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data. Please try again.');
    } finally {
      /**
       * finally block always runs
       * 
       * Perfect for cleanup tasks:
       * - Set loading to false
       * - Hide spinners
       * - Re-enable buttons
       */
      setSummaryLoading(false);
      setTransactionsLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle Refresh
   * 
   * Reloads dashboard data.
   * Triggered by refresh button.
   */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <DashboardLayout>
      {/**
       * Page Header
       * 
       * Title and refresh button
       */}
      <div className="dashboard-header-section">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div className="header-row">
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Dashboard
              </Title>
              <Typography.Text type="secondary">
                Overview of your financial status
              </Typography.Text>
            </div>
            
            {/**
             * Refresh Button
             * 
             * loading: Shows spinner
             * icon: Rotates when loading
             */}
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
              className="refresh-button"
            >
              Refresh
            </Button>
          </div>
        </Space>
      </div>

      {/**
       * Dashboard Content
       * 
       * Space provides consistent vertical spacing
       */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/**
         * Summary Cards Section
         * 
         * Shows total income, expenses, balance
         */}
        <SummaryCards 
          summary={summary} 
          loading={summaryLoading} 
        />

        {/**
         * Main Content Grid
         * 
         * Two columns on desktop:
         * - Left: Chart (2/3 width)
         * - Right: Recent transactions (1/3 width)
         * 
         * One column on mobile:
         * - Chart on top
         * - Transactions below
         */}
        <Row gutter={[16, 16]}>
          {/**
           * Chart Column
           * 
           * xs: 24/24 (full width on mobile)
           * lg: 16/24 (2/3 width on desktop)
           */}
          <Col xs={24} lg={16}>
            <FinancialChart 
              summary={summary} 
              loading={summaryLoading} 
            />
          </Col>

          {/**
           * Recent Transactions Column
           * 
           * xs: 24/24 (full width on mobile)
           * lg: 8/24 (1/3 width on desktop)
           */}
          <Col xs={24} lg={8}>
            <RecentTransactions 
              transactions={transactions} 
              loading={transactionsLoading} 
            />
          </Col>
        </Row>
      </Space>
    </DashboardLayout>
  );
};

export default Dashboard;

/**
 * Understanding Component Composition:
 * 
 * Dashboard (Parent)
 * ├── DashboardLayout (Layout wrapper)
 * │   ├── Header (Navigation)
 * │   ├── Sidebar (Menu)
 * │   └── Content (Children)
 * │       ├── Page Header (Title + Refresh)
 * │       ├── SummaryCards (Financial summary)
 * │       ├── FinancialChart (D3.js chart)
 * │       └── RecentTransactions (List)
 * 
 * Data Flow:
 * 
 * 1. Dashboard mounts
 *    ↓
 * 2. useEffect runs → fetchData()
 *    ↓
 * 3. API calls (parallel)
 *    - getFinancialSummary()
 *    - getRecentTransactions()
 *    ↓
 * 4. Update state
 *    - setSummary()
 *    - setTransactions()
 *    ↓
 * 5. Child components re-render with data
 *    - SummaryCards displays summary
 *    - FinancialChart draws chart
 *    - RecentTransactions shows list
 * 
 * Why This Structure?
 * 
 * 1. Separation of Concerns:
 *    - Dashboard: Data fetching, state management
 *    - Child components: Presentation only
 * 
 * 2. Reusability:
 *    - SummaryCards can be used elsewhere
 *    - FinancialChart is self-contained
 *    - RecentTransactions is portable
 * 
 * 3. Testability:
 *    - Easy to test components in isolation
 *    - Mock data for child components
 *    - Test API calls separately
 * 
 * 4. Maintainability:
 *    - Each component has single responsibility
 *    - Easy to find and fix bugs
 *    - Clear code organization
 * 
 * Promise.all Explained:
 * 
 * Without Promise.all (Sequential - 1000ms):
 * const summary = await getSummary();      // 500ms
 * const txns = await getTransactions();    // 500ms
 * 
 * With Promise.all (Parallel - 500ms):
 * const [summary, txns] = await Promise.all([
 *   getSummary(),       // Starts immediately
 *   getTransactions()   // Starts immediately
 * ]);
 * Both complete together in 500ms!
 * 
 * When to use Promise.all?
 * - Independent requests (one doesn't need other's result)
 * - Can run simultaneously
 * - Want to optimize performance
 * 
 * When NOT to use?
 * - Requests depend on each other
 * - Need result from first to make second request
 * - Example: Get user, then get user's transactions
 * 
 * Error Handling Strategy:
 * 
 * Three layers:
 * 1. Axios Interceptor (axios.ts)
 *    - Handles 401, 403, 500 automatically
 *    - Redirects to login if needed
 *    - Global error handling
 * 
 * 2. API Functions (transactionApi.ts)
 *    - Returns typed data
 *    - Throws errors up
 * 
 * 3. Component (Dashboard.tsx)
 *    - Catches errors
 *    - Shows user message
 *    - Sets loading to false
 * 
 * Benefits:
 * - Don't repeat error handling code
 * - Consistent error messages
 * - Better UX
 */