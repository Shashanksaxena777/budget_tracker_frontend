/**
 * Summary Cards Component
 * 
 * Displays financial summary in beautiful cards:
 * - Total Income (green)
 * - Total Expenses (red)
 * - Balance (blue)
 * 
 * Features:
 * - Color-coded cards
 * - Icons for visual clarity
 * - Responsive grid layout
 * - Animated numbers
 */

import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import type { FinancialSummary } from '../../../api/transactionApi';
import './SummaryCards.css';

/**
 * Props Interface
 */
interface SummaryCardsProps {
  summary: FinancialSummary | null;  // null when loading
  loading: boolean;
}

/**
 * SummaryCards Component
 */
const SummaryCards = ({ summary, loading }: SummaryCardsProps) => {
  /**
   * Format currency
   * 
   * Converts "1000.00" to "₹1,000.00"
   * 
   * @param amount - Amount as string
   * @returns Formatted currency string
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
   * Get balance color
   * 
   * Green for positive, red for negative
   */
  const getBalanceColor = (): string => {
    if (!summary) return '#1677ff';
    const balance = parseFloat(summary.balance);
    if (balance > 0) return '#52c41a';  // Green
    if (balance < 0) return '#ff4d4f';  // Red
    return '#1677ff';  // Blue for zero
  };

  /**
   * Show skeleton while loading
   * 
   * Skeleton provides placeholder while data loads
   * Better UX than blank space or spinner
   */
  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {[1, 2, 3].map((i) => (
          <Col xs={24} sm={24} md={8} key={i}>
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  /**
   * Show message if no data
   */
  if (!summary) {
    return (
      <Card>
        <p>No financial data available.</p>
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]} className="summary-cards">
      {/**
       * Income Card (Green)
       * 
       * Shows total income with up arrow
       */}
      <Col xs={24} sm={24} md={8}>
        <Card 
          bordered={false} 
          className="summary-card income-card"
        >
          <Statistic
            title="Total Income"
            value={formatCurrency(summary.total_income)}
            prefix={<ArrowUpOutlined />}
            valueStyle={{ color: '#52c41a' }}
            suffix={
              <span className="count-badge">
                {summary.income_count} transactions
              </span>
            }
          />
        </Card>
      </Col>

      {/**
       * Expenses Card (Red)
       * 
       * Shows total expenses with down arrow
       */}
      <Col xs={24} sm={24} md={8}>
        <Card 
          bordered={false} 
          className="summary-card expense-card"
        >
          <Statistic
            title="Total Expenses"
            value={formatCurrency(summary.total_expenses)}
            prefix={<ArrowDownOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
            suffix={
              <span className="count-badge">
                {summary.expense_count} transactions
              </span>
            }
          />
        </Card>
      </Col>

      {/**
       * Balance Card (Dynamic Color)
       * 
       * Shows current balance
       * Color changes based on positive/negative
       */}
      <Col xs={24} sm={24} md={8}>
        <Card 
          bordered={false} 
          className="summary-card balance-card"
        >
          <Statistic
            title="Current Balance"
            value={formatCurrency(summary.balance)}
            prefix={<WalletOutlined />}
            valueStyle={{ color: getBalanceColor() }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;

/**
 * Understanding Ant Design Components:
 * 
 * 1. Row & Col (Grid System):
 *    - Row: Container for columns
 *    - Col: Individual column
 *    - gutter: Space between columns [horizontal, vertical]
 *    - xs, sm, md, lg, xl: Responsive breakpoints
 * 
 *    Span system (24 columns total):
 *    - xs={24}: Full width on mobile (1 card per row)
 *    - md={8}: 1/3 width on desktop (3 cards per row)
 * 
 *    Visual:
 *    Mobile:          Desktop:
 *    ┌──────────┐    ┌────┬────┬────┐
 *    │  Card 1  │    │ C1 │ C2 │ C3 │
 *    ├──────────┤    └────┴────┴────┘
 *    │  Card 2  │
 *    ├──────────┤
 *    │  Card 3  │
 *    └──────────┘
 * 
 * 2. Card:
 *    - Container with elevation
 *    - bordered={false}: No border (modern look)
 *    - Provides padding and shadow
 * 
 * 3. Statistic:
 *    - Displays numbers prominently
 *    - title: Label above number
 *    - value: Main number to display
 *    - prefix: Icon before number
 *    - suffix: Text/element after number
 *    - valueStyle: Custom styles for number
 * 
 * 4. Skeleton:
 *    - Loading placeholder
 *    - active: Animated shimmer effect
 *    - paragraph: Number of placeholder lines
 *    - Better UX than blank space
 * 
 * Intl.NumberFormat:
 * 
 * Built-in JavaScript API for formatting numbers.
 * 
 * Example:
 * const formatter = new Intl.NumberFormat('en-IN', {
 *   style: 'currency',
 *   currency: 'INR'
 * });
 * 
 * formatter.format(1000);  // "₹1,000.00"
 * formatter.format(50.5);  // "₹50.50"
 * 
 * Options:
 * - 'en-IN': Indian locale (comma separators)
 * - 'en-US': US locale (different separators)
 * - style: 'currency', 'decimal', 'percent'
 * - currency: 'INR', 'USD', 'EUR', etc.
 * 
 * Benefits:
 * - Automatic locale formatting
 * - Currency symbols
 * - Thousand separators
 * - Decimal places
 * 
 * Color Coding Logic:
 * 
 * Income: Always green (#52c41a)
 * - Represents money coming in
 * - Positive action
 * 
 * Expenses: Always red (#ff4d4f)
 * - Represents money going out
 * - Requires attention
 * 
 * Balance: Dynamic
 * - Green if positive (good!)
 * - Red if negative (debt/overspent)
 * - Blue if zero (neutral)
 * 
 * Why This Helps Users:
 * - Instant visual feedback
 * - No need to read numbers
 * - Colors convey meaning
 * - Universal understanding
 */
