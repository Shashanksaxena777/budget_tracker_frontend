/**
 * Recent Transactions Component
 * 
 * Shows a list of recent transactions on the dashboard.
 * 
 * Features:
 * - Displays 5 most recent transactions
 * - Color-coded by type (income/expense)
 * - Formatted dates and amounts
 * - Link to view all transactions
 * - Empty state for no data
 */

import { Card, List, Tag, Typography, Button, Empty, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Transaction } from '../../../api/transactionApi';
import './RecentTransactions.css';

const { Text } = Typography;

/**
 * Props Interface
 */
interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

/**
 * RecentTransactions Component
 */
const RecentTransactions = ({ transactions, loading }: RecentTransactionsProps) => {
  const navigate = useNavigate();

  /**
   * Format Currency
   * 
   * Converts "1000.00" to "₹1,000.00"
   */
  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  /**
   * Format Date
   * 
   * Converts "2024-01-15" to "Jan 15, 2024"
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  /**
   * Get Relative Date
   * 
   * Shows "Today", "Yesterday", or date
   */
  const getRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to midnight for comparison
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return formatDate(dateString);
    }
  };

  /**
   * Render Loading State
   */
  if (loading) {
    return (
      <Card 
        title="Recent Transactions" 
        bordered={false}
        className="recent-transactions-card"
      >
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  /**
   * Render Empty State
   */
  if (!transactions || transactions.length === 0) {
    return (
      <Card 
        title="Recent Transactions" 
        bordered={false}
        className="recent-transactions-card"
      >
        <Empty 
          description="No transactions yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button 
            type="primary" 
            onClick={() => navigate('/transactions')}
          >
            Add Transaction
          </Button>
        </Empty>
      </Card>
    );
  }

  /**
   * Render Transactions List
   */
  return (
    <Card
      title="Recent Transactions"
      bordered={false}
      className="recent-transactions-card"
      extra={
        /**
         * "View All" button in card header
         */
        <Button
          type="link"
          icon={<RightOutlined />}
          onClick={() => navigate('/transactions')}
        >
          View All
        </Button>
      }
    >
      {/**
       * Ant Design List Component
       * 
       * Displays items in a structured list.
       * 
       * dataSource: Array of items to display
       * renderItem: Function to render each item
       * split: Show dividers between items
       */}
      <List
        dataSource={transactions}
        split={true}
        renderItem={(transaction) => (
          <List.Item
            className="transaction-list-item"
            /**
             * Actions (right side of list item)
             * 
             * Shows amount with color
             */
            actions={[
              <div
                key="amount"
                className={`transaction-amount ${transaction.type}`}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpOutlined className="amount-icon" />
                ) : (
                  <ArrowDownOutlined className="amount-icon" />
                )}
                <Text strong className="amount-text">
                  {formatCurrency(transaction.amount)}
                </Text>
              </div>,
            ]}
          >
            {/**
             * List Item Meta
             * 
             * Contains avatar, title, description
             */}
            <List.Item.Meta
              /**
               * Avatar: Type tag (income/expense)
               */
              avatar={
                <Tag
                  color={transaction.type === 'income' ? 'success' : 'error'}
                  className="type-tag"
                >
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </Tag>
              }
              /**
               * Title: Transaction description
               */
              title={
                <Text strong className="transaction-description">
                  {transaction.description || 'No description'}
                </Text>
              }
              /**
               * Description: Category and date
               */
              description={
                <div className="transaction-meta">
                  {transaction.category_name && (
                    <Text type="secondary" className="category-name">
                      {transaction.category_name}
                    </Text>
                  )}
                  <Text type="secondary" className="transaction-date">
                    {getRelativeDate(transaction.date)}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentTransactions;

/**
 * Understanding Ant Design List:
 * 
 * Structure:
 * <List>
 *   <List.Item>             ← Individual item
 *     <List.Item.Meta       ← Item content structure
 *       avatar={...}        ← Left side (icon/image)
 *       title={...}         ← Main text
 *       description={...}   ← Secondary text
 *     />
 *     actions={[...]}       ← Right side actions
 *   </List.Item>
 * </List>
 * 
 * Visual Layout:
 * ┌─────────────────────────────────────┐
 * │ [Tag]  Description           +₹1000 │
 * │        Category • Date               │
 * ├─────────────────────────────────────┤
 * │ [Tag]  Description           -₹500  │
 * │        Category • Date               │
 * └─────────────────────────────────────┘
 * 
 * Intl.DateTimeFormat:
 * 
 * JavaScript API for formatting dates.
 * 
 * Example:
 * new Intl.DateTimeFormat('en-US', {
 *   month: 'short',    // "Jan"
 *   day: 'numeric',    // "15"
 *   year: 'numeric'    // "2024"
 * }).format(date);     // "Jan 15, 2024"
 * 
 * Options:
 * - month: 'short', 'long', 'numeric', '2-digit'
 * - day: 'numeric', '2-digit'
 * - year: 'numeric', '2-digit'
 * - weekday: 'short', 'long', 'narrow'
 * 
 * Benefits:
 * - Locale-aware formatting
 * - Consistent output
 * - No external library needed
 * 
 * Relative Dates:
 * 
 * Makes dates more human-friendly:
 * - "Today" instead of "Oct 31, 2024"
 * - "Yesterday" instead of "Oct 30, 2024"
 * - Full date for older transactions
 * 
 * How it works:
 * 1. Parse transaction date
 * 2. Get today's date
 * 3. Calculate yesterday's date
 * 4. Compare dates (ignoring time)
 * 5. Return appropriate string
 * 
 * Empty State:
 * 
 * Shows when no data available.
 * 
 * Benefits:
 * - Prevents confusion (is it loading? error?)
 * - Provides action (add transaction button)
 * - Better UX than blank space
 * 
 * Components:
 * - Empty: Ant Design empty state component
 * - PRESENTED_IMAGE_SIMPLE: Built-in simple icon
 * - Button: Call-to-action
 * 
 * Color Coding:
 * 
 * Income: Green (#52c41a)
 * - Up arrow icon
 * - Positive connotation
 * 
 * Expense: Red (#ff4d4f)
 * - Down arrow icon
 * - Warning/attention
 * 
 * Helps users:
 * - Quickly identify transaction type
 * - No need to read text
 * - Visual pattern recognition
 */