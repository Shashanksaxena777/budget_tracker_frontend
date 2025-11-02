/**
 * Category Spending Component
 * 
 * Shows spending breakdown by category.
 * Helps identify where money is being spent.
 * 
 * Features:
 * - List of categories with amounts
 * - Progress bars showing percentage
 * - Color-coded based on spending level
 * - Sorted by amount (highest first)
 */

import { Card, List, Progress, Typography, Empty, Skeleton } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import type { CategoryExpense } from '../../../api/budgetApi';
import './CategorySpending.css';

const { Text } = Typography;

/**
 * Props Interface
 */
interface CategorySpendingProps {
  categories: CategoryExpense[];
  loading: boolean;
}

/**
 * CategorySpending Component
 */
const CategorySpending = ({ categories, loading }: CategorySpendingProps) => {
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
   * Get Progress Bar Color
   * 
   * Based on percentage of total spending
   */
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 30) return '#ff4d4f';  // Red - High spending
    if (percentage >= 20) return '#faad14';  // Orange - Medium-high
    if (percentage >= 10) return '#1677ff';  // Blue - Medium
    return '#52c41a';  // Green - Low spending
  };

  /**
   * Render Loading State
   */
  if (loading) {
    return (
      <Card 
        title="Spending by Category" 
        bordered={false}
        className="category-spending-card"
      >
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  /**
   * Render Empty State
   */
  if (!categories || categories.length === 0) {
    return (
      <Card 
        title="Spending by Category" 
        bordered={false}
        className="category-spending-card"
      >
        <Empty 
          description="No expenses recorded for this month"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  /**
   * Calculate Total
   */
  const totalAmount = categories.reduce(
    (sum, cat) => sum + parseFloat(cat.amount), 
    0
  );

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TagOutlined />
          <span>Spending by Category</span>
        </div>
      }
      bordered={false}
      className="category-spending-card"
      extra={
        <Text type="secondary" style={{ fontSize: 13 }}>
          Total: {formatCurrency(totalAmount.toString())}
        </Text>
      }
    >
      <List
        dataSource={categories}
        renderItem={(category) => (
          <List.Item className="category-item">
            <div className="category-info">
              {/**
               * Category Name and Amount
               */}
              <div className="category-header">
                <Text strong>{category.category_name}</Text>
                <Text strong style={{ color: '#1677ff' }}>
                  {formatCurrency(category.amount)}
                </Text>
              </div>

              {/**
               * Progress Bar
               * 
               * Shows percentage of total spending
               */}
              <div className="category-progress">
                <Progress
                  percent={category.percentage}
                  strokeColor={getProgressColor(category.percentage)}
                  showInfo={true}
                  format={(percent) => `${percent?.toFixed(1)}%`}
                  size="small"
                />
              </div>

              {/**
               * Percentage Text
               */}
              <Text 
                type="secondary" 
                style={{ fontSize: 12 }}
              >
                {category.percentage.toFixed(1)}% of total expenses
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CategorySpending;

/**
 * Understanding Category Breakdown:
 * 
 * Purpose:
 * - Shows WHERE money is being spent
 * - Identifies highest spending categories
 * - Helps make budget adjustments
 * 
 * Example Display:
 * 
 * Spending by Category          Total: ₹28,000
 * ┌─────────────────────────────────────────┐
 * │ Rent                          ₹20,000   │
 * │ ████████████████████████░░░░ 71.4%      │
 * │ 71.4% of total expenses                 │
 * ├─────────────────────────────────────────┤
 * │ Groceries                     ₹5,000    │
 * │ ███████░░░░░░░░░░░░░░░░░░░░░ 17.9%      │
 * │ 17.9% of total expenses                 │
 * ├─────────────────────────────────────────┤
 * │ Transport                     ₹3,000    │
 * │ ████░░░░░░░░░░░░░░░░░░░░░░░░ 10.7%      │
 * │ 10.7% of total expenses                 │
 * └─────────────────────────────────────────┘
 * 
 * Color Logic:
 * 
 * - Red (≥30%): Major expense category
 *   → Needs attention
 *   → Consider reducing
 * 
 * - Orange (20-30%): Significant category
 *   → Monitor closely
 *   → May need optimization
 * 
 * - Blue (10-20%): Moderate category
 *   → Acceptable level
 *   → Keep track
 * 
 * - Green (<10%): Minor category
 *   → Low concern
 *   → Well controlled
 * 
 * Why Progress Bars?
 * 
 * Benefits:
 * 1. Visual comparison at a glance
 * 2. Easy to identify outliers
 * 3. Better than just numbers
 * 4. Intuitive understanding
 * 
 * User Insights:
 * 
 * "I'm spending 70% on rent!"
 * → Maybe need cheaper housing
 * → Or increase income
 * 
 * "Transport is only 5%"
 * → Good! Public transport working
 * → Or work from home benefit
 * 
 * "Food is 25%"
 * → Check if too high
 * → Consider meal planning
 * → Look for discounts
 * 
 * Sorting:
 * 
 * Categories sorted by amount (highest first)
 * 
 * Why?
 * - Most important categories at top
 * - Focus on biggest expenses first
 * - Better decision making
 * 
 * Calculation:
 * 
 * For each category:
 * percentage = (category_amount / total_expenses) * 100
 * 
 * Example:
 * Rent: ₹20,000
 * Total: ₹28,000
 * Percentage: (20000 / 28000) * 100 = 71.4%
 * 
 * This helps answer:
 * - "What's my biggest expense?"
 * - "Where can I cut costs?"
 * - "Am I overspending in any category?"
 * - "Is my spending balanced?"
 */