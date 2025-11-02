/**
 * Budget Page
 * 
 * Complete budget management interface.
 * 
 * Features:
 * - View current month budget
 * - Set/update budget
 * - Budget vs actual comparison chart
 * - Category-wise spending breakdown
 * - Budget status indicators
 * - Responsive layout
 */

import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Space,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  message,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  WalletOutlined,
  AlertOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BudgetFormModal from './components/BudgetFormModal';
import BudgetComparisonChart from './components/BudgetComparisonChart';
import CategorySpending from './components/CategorySpending';
import {
  getCurrentBudget,
  getBudgetComparison,
  type Budget,
  type BudgetComparison,
} from '../../api/budgetApi';
import './Budget.css';

const { Title, Text } = Typography;

/**
 * Budget Component
 */
const BudgetPage = () => {
  /**
   * State Management
   */
  const [budget, setBudget] = useState<Budget | null>(null);
  const [comparison, setComparison] = useState<BudgetComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  /**
   * Fetch data on mount
   */
  useEffect(() => {
    fetchBudgetData();
  }, []);

  /**
   * Fetch Budget Data
   * 
   * Fetches current month budget and comparison data
   */
  const fetchBudgetData = async () => {
    try {
      setLoading(true);

      // Try to get current budget
      try {
        const budgetData = await getCurrentBudget();
        setBudget(budgetData);

        // If budget exists, get comparison
        const comparisonData = await getBudgetComparison();
        setComparison(comparisonData);
      } catch (error: any) {
        // No budget set for current month
        if (error.response?.status === 404) {
          setBudget(null);
          setComparison(null);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      message.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Set Budget
   */
  const handleSetBudget = () => {
    setModalMode('create');
    setModalVisible(true);
  };

  /**
   * Handle Edit Budget
   */
  const handleEditBudget = () => {
    setModalMode('edit');
    setModalVisible(true);
  };

  /**
   * Handle Modal Success
   */
  const handleModalSuccess = () => {
    fetchBudgetData();
  };

  /**
   * Format Currency
   */
  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  /**
   * Get Current Month Name
   */
  const getCurrentMonthName = (): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  };

  /**
   * Get Budget Status
   * 
   * Returns status info based on spending
   */
  const getBudgetStatus = () => {
    if (!comparison) return null;

    const percentage = comparison.percentage_used;

    if (percentage > 100) {
      return {
        type: 'error' as const,
        icon: <AlertOutlined />,
        title: 'Over Budget',
        message: `You've exceeded your budget by ${formatCurrency(
          (parseFloat(comparison.actual_expenses) - parseFloat(comparison.budget_amount)).toString()
        )}`,
      };
    } else if (percentage > 80) {
      return {
        type: 'warning' as const,
        icon: <AlertOutlined />,
        title: 'Nearing Budget Limit',
        message: `You've used ${percentage.toFixed(1)}% of your budget. Be cautious with remaining expenses.`,
      };
    } else {
      return {
        type: 'success' as const,
        icon: <CheckCircleOutlined />,
        title: 'On Track',
        message: `You're doing well! ${formatCurrency(comparison.remaining)} remaining.`,
      };
    }
  };

  /**
   * Render No Budget State
   */
  const renderNoBudgetState = () => (
    <div className="no-budget-state">
      <Card bordered={false} className="no-budget-card">
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <WalletOutlined style={{ fontSize: 80, color: '#1677ff', opacity: 0.3 }} />
          </div>
          <div>
            <Title level={3}>No Budget Set for {getCurrentMonthName()}</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Set a monthly budget to track your expenses and manage your finances better.
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleSetBudget}
          >
            Set Monthly Budget
          </Button>
        </Space>
      </Card>
    </div>
  );

  /**
   * Render Budget Content
   */
  const renderBudgetContent = () => {
    if (!budget || !comparison) return null;

    const status = getBudgetStatus();
    const percentageUsed = comparison.percentage_used;

    return (
      <>
        {/**
         * Budget Status Alert
         */}
        {status && (
          <Alert
            type={status.type}
            message={status.title}
            description={status.message}
            icon={status.icon}
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        {/**
         * Budget Summary Cards
         */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/**
           * Budget Amount Card
           */}
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="budget-summary-card">
              <Statistic
                title="Monthly Budget"
                value={formatCurrency(budget.budget_amount)}
                prefix={<WalletOutlined />}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>

          {/**
           * Actual Expenses Card
           */}
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="budget-summary-card">
              <Statistic
                title="Actual Expenses"
                value={formatCurrency(comparison.actual_expenses)}
                valueStyle={{ 
                  color: percentageUsed > 100 ? '#ff4d4f' : '#faad14' 
                }}
              />
            </Card>
          </Col>

          {/**
           * Remaining Card
           */}
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="budget-summary-card">
              <Statistic
                title="Remaining"
                value={formatCurrency(comparison.remaining)}
                valueStyle={{ 
                  color: parseFloat(comparison.remaining) >= 0 ? '#52c41a' : '#ff4d4f' 
                }}
              />
            </Card>
          </Col>

          {/**
           * Progress Card
           */}
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="budget-summary-card">
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Budget Used
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    type="circle"
                    percent={Math.min(percentageUsed, 100)}
                    size={80}
                    strokeColor={
                      percentageUsed > 100
                        ? '#ff4d4f'
                        : percentageUsed > 80
                        ? '#faad14'
                        : '#52c41a'
                    }
                    format={() => `${percentageUsed.toFixed(0)}%`}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/**
         * Charts and Breakdown
         */}
        <Row gutter={[16, 16]}>
          {/**
           * Budget Comparison Chart
           */}
          <Col xs={24} lg={14}>
            <BudgetComparisonChart 
              comparison={comparison} 
              loading={loading} 
            />
          </Col>

          {/**
           * Category Spending
           */}
          <Col xs={24} lg={10}>
            <CategorySpending
              categories={comparison.by_category}
              loading={loading}
            />
          </Col>
        </Row>
      </>
    );
  };

  return (
    <DashboardLayout>
      {/**
       * Page Header
       */}
      <div className="budget-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Budget Management
          </Title>
          <Text type="secondary">
            {getCurrentMonthName()}
          </Text>
        </div>

        {budget && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditBudget}
            size="large"
          >
            Edit Budget
          </Button>
        )}
      </div>

      {/**
       * Content
       */}
      {loading ? (
        <Card loading={loading}>
          <div style={{ height: 400 }}></div>
        </Card>
      ) : budget ? (
        renderBudgetContent()
      ) : (
        renderNoBudgetState()
      )}

      {/**
       * Budget Form Modal
       */}
      <BudgetFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleModalSuccess}
        budget={budget}
        mode={modalMode}
      />
    </DashboardLayout>
  );
};

export default BudgetPage;

/**
 * Understanding Budget Page Flow:
 * 
 * 1. Component Mounts
 *    ↓
 * 2. fetchBudgetData()
 *    - Try to get current budget
 *    - If exists, get comparison data
 *    - If not, show "Set Budget" state
 *    ↓
 * 3. Display Based on State
 *    - No budget → Show empty state with "Set Budget" button
 *    - Has budget → Show summary cards + charts
 *    ↓
 * 4. User Interactions
 *    - Click "Set Budget" → Open modal (create mode)
 *    - Click "Edit Budget" → Open modal (edit mode)
 *    - Save budget → Refresh data
 * 
 * Budget Status Logic:
 * 
 * Over Budget (>100%):
 * - Red alert
 * - Shows amount over budget
 * - Urgent attention needed
 * 
 * Warning (80-100%):
 * - Orange alert
 * - Shows percentage used
 * - Be careful with spending
 * 
 * On Track (<80%):
 * - Green alert
 * - Shows remaining amount
 * - Doing well!
 * 
 * Visual Hierarchy:
 * 
 * 1. Status Alert (top) - Immediate attention
 * 2. Summary Cards - Key numbers at a glance
 * 3. Comparison Chart - Visual overview
 * 4. Category Breakdown - Detailed analysis
 * 
 * Summary Cards Explained:
 * 
 * Card 1: Monthly Budget
 * - Blue color (neutral)
 * - Shows planned amount
 * - Wallet icon
 * 
 * Card 2: Actual Expenses
 * - Orange/Red based on status
 * - Shows spent amount
 * - Warning if high
 * 
 * Card 3: Remaining
 * - Green if positive
 * - Red if negative (over budget)
 * - Shows what's left
 * 
 * Card 4: Progress Circle
 * - Visual percentage
 * - Color changes with status
 * - Easy to understand at a glance
 * 
 * Empty State Design:
 * 
 * Purpose:
 * - Not just "no data"
 * - Guides user to action
 * - Explains benefit
 * - Makes setting budget easy
 * 
 * Elements:
 * - Large icon (visual interest)
 * - Clear title
 * - Explanatory text
 * - Prominent CTA button
 * 
 * Responsive Layout:
 * 
 * Desktop:
 * ┌──────────────────────────────┐
 * │ Alert (if needed)            │
 * ├───────┬───────┬───────┬──────┤
 * │ Card1 │ Card2 │ Card3 │ Card4│
 * ├───────────────┬──────────────┤
 * │ Chart (60%)   │ Categories   │
 * │               │ (40%)        │
 * └───────────────┴──────────────┘
 * 
 * Mobile:
 * ┌────────────┐
 * │ Alert      │
 * ├────────────┤
 * │ Card 1     │
 * ├────────────┤
 * │ Card 2     │
 * ├────────────┤
 * │ Card 3     │
 * ├────────────┤
 * │ Card 4     │
 * ├────────────┤
 * │ Chart      │
 * ├────────────┤
 * │ Categories │
 * └────────────┘
 * 
 * Error Handling:
 * 
 * Scenario 1: No budget exists
 * - API returns 404
 * - Show empty state
 * - Encourage setting budget
 * 
 * Scenario 2: Network error
 * - Show error message
 * - Provide retry option
 * - Don't break UI
 * 
 * Scenario 3: Budget exists
 * - Load all data
 * - Show visualizations
 * - Enable editing
 * 
 * User Benefits:
 * 
 * 1. Quick Overview
 *    - See status at a glance
 *    - No need to calculate
 *    - Visual feedback
 * 
 * 2. Actionable Insights
 *    - Where money goes
 *    - Which categories are high
 *    - What to reduce
 * 
 * 3. Progress Tracking
 *    - Percentage used
 *    - Amount remaining
 *    - Days left in month
 * 
 * 4. Easy Management
 *    - Set budget in seconds
 *    - Edit anytime
 *    - Month selector
 */