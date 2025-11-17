/**
 * Transaction Filters Component
 * 
 * Provides filtering options for transactions:
 * - Search by description
 * - Filter by type (income/expense)
 * - Filter by category
 * - Filter by date range
 * - Filter by amount range
 * 
 * Features:
 * - Collapsible filters (hidden by default on mobile)
 * - Clear all filters
 * - Real-time filtering
 */
import debounce from 'lodash.debounce';
import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
} from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { getCategories, type Category } from '../../../api/categoryApi';
import type { TransactionFilters as FilterType } from '../../../api/transactionApi';

const { RangePicker } = DatePicker;

/**
 * Props Interface
 */
interface TransactionFiltersProps {
  onFilterChange: (filters: FilterType) => void;  // Called when filters change
  loading?: boolean;                               // Disable filters during loading
}

/**
 * Form Values Interface
 */
interface FilterFormValues {
  search?: string;
  type?: 'income' | 'expense';
  category?: number;
  dateRange?: [Dayjs, Dayjs];
  minAmount?: number;
  maxAmount?: number;
}

/**
 * TransactionFilters Component
 */
const TransactionFilters = ({ onFilterChange, loading }: TransactionFiltersProps) => {
  const [form] = Form.useForm<FilterFormValues>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState(false);

  /**
   * Fetch categories on mount
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch Categories
   */
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  /**
   * Handle Filter Change
   * 
   * Called when any filter value changes
   */
  const handleValuesChange = (_: any, allValues: FilterFormValues) => {
    /**
     * Convert form values to API filter format
     */
    const filters: FilterType = {};

    // Search
    if (allValues.search) {
      filters.search = allValues.search;
    }

    // Type
    if (allValues.type) {
      filters.type = allValues.type;
    }

    // Category
    if (allValues.category) {
      filters.category = allValues.category;
    }

    // Date Range
    if (allValues.dateRange && allValues.dateRange.length === 2) {
      filters.date_from = allValues.dateRange[0].format('YYYY-MM-DD');
      filters.date_to = allValues.dateRange[1].format('YYYY-MM-DD');
    }

    // Amount Range
    if (allValues.minAmount !== undefined && allValues.minAmount !== null) {
      filters.min_amount = allValues.minAmount;
    }
    if (allValues.maxAmount !== undefined && allValues.maxAmount !== null) {
      filters.max_amount = allValues.maxAmount;
    }

    // Default sorting (newest first)
    filters.ordering = '-date';

    // Call parent component with filters
    debouncedFilterChange(filters);
  };

  const debouncedFilterChange = useMemo(
    () => debounce((filters:any) => onFilterChange(filters), 500),
    []
  );

  /**
   * Clear All Filters
   */
  const handleClear = () => {
    form.resetFields();
    onFilterChange({ ordering: '-date' });
  };

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          Filters
        </Space>
      }
      extra={
        <Button
          type="link"
          icon={<ClearOutlined />}
          onClick={handleClear}
          disabled={loading}
        >
          Clear All
        </Button>
      }
      bordered={false}
      style={{ marginBottom: 16 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        {/**
         * Search Input
         * 
         * Always visible
         */}
        <Form.Item name="search" style={{ marginBottom: 16 }}>
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search by description..."
            allowClear
            disabled={loading}
          />
        </Form.Item>

        {/**
         * Additional Filters
         * 
         * Collapsible on mobile
         */}
        <div className={!expanded ? 'mobile-hidden' : ''}>
          <Row gutter={16}>
            {/**
             * Type Filter
             */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="type" label="Type">
                <Select
                  placeholder="All Types"
                  allowClear
                  disabled={loading}
                  options={[
                    { label: 'Income', value: 'income' },
                    { label: 'Expense', value: 'expense' },
                  ]}
                />
              </Form.Item>
            </Col>

            {/**
             * Category Filter
             */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="category" label="Category">
                <Select
                  placeholder="All Categories"
                  allowClear
                  disabled={loading}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={categories?.map((cat) => ({
                    label: `${cat.name} (${cat.type})`,
                    value: cat.id,
                  })) || []}
                  notFoundContent={categories.length === 0 ? "No categories found" : null}
                />
              </Form.Item>
            </Col>

            {/**
             * Date Range Filter
             */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="dateRange" label="Date Range">
                <RangePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabled={loading}
                  disabledDate={(current) => {
                    // Disable future dates
                    return current && current > dayjs().endOf('day');
                  }}
                />
              </Form.Item>
            </Col>

            {/**
             * Amount Range
             */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Amount Range">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="minAmount" noStyle>
                    <InputNumber
                      placeholder="Min"
                      prefix="₹"
                      style={{ width: '50%' }}
                      min={0}
                      disabled={loading}
                    />
                  </Form.Item>
                  <Form.Item name="maxAmount" noStyle>
                    <InputNumber
                      placeholder="Max"
                      prefix="₹"
                      style={{ width: '50%' }}
                      min={0}
                      disabled={loading}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/**
         * Toggle Filters Button (Mobile Only)
         */}
        <Button
          type="link"
          onClick={() => setExpanded(!expanded)}
          className="mobile-only"
          style={{ padding: 0 }}
        >
          {expanded ? 'Hide Filters' : 'Show More Filters'}
        </Button>
      </Form>
    </Card>
  );
};

export default TransactionFilters;

/**
 * Understanding Key Concepts:
 * 
 * 1. Form.useWatch vs onValuesChange:
 * 
 *    useWatch: For reading single field value
 *    const type = Form.useWatch('type', form);
 * 
 *    onValuesChange: For reacting to any field change
 *    onValuesChange={(changed, all) => {
 *      // called whenever any field changes
 *    }}
 * 
 * 2. RangePicker:
 *    - Special DatePicker for date ranges
 *    - Returns [startDate, endDate]
 *    - Useful for filtering by period
 * 
 *    <RangePicker
 *      format="DD/MM/YYYY"
 *      onChange={([start, end]) => {
 *        // start and end are dayjs objects
 *      }}
 *    />
 * 
 * 3. Space.Compact:
 *    - Groups inputs together
 *    - Removes spacing between elements
 *    - Creates visually connected inputs
 * 
 *    <Space.Compact>
 *      <Input placeholder="Min" />
 *      <Input placeholder="Max" />
 *    </Space.Compact>
 * 
 *    Visual:
 *    ┌─────┬─────┐
 *    │ Min │ Max │  (no gap between)
 *    └─────┴─────┘
 * 
 * 4. Select showSearch:
 *    - Adds search functionality to dropdown
 *    - filterOption: Custom search logic
 * 
 *    <Select
 *      showSearch
 *      filterOption={(input, option) =>
 *        option.label.toLowerCase().includes(input.toLowerCase())
 *      }
 *    />
 * 
 * 5. Responsive Collapsible Filters:
 * 
 *    Desktop: All filters visible
 *    Mobile: Basic filters + "Show More" button
 * 
 *    Benefits:
 *    - Cleaner mobile UI
 *    - Still accessible when needed
 *    - Better UX on small screens
 * 
 * 6. Real-time Filtering:
 * 
 *    Flow:
 *    User types in search
 *      ↓
 *    onValuesChange fires
 *      ↓
 *    handleValuesChange converts to API format
 *      ↓
 *    Calls onFilterChange (parent component)
 *      ↓
 *    Parent fetches filtered data
 *      ↓
 *    Table updates
 * 
 * Filter Conversion Example:
 * 
 * Form Values:
 * {
 *   search: "grocery",
 *   type: "expense",
 *   dateRange: [dayjs('2024-01-01'), dayjs('2024-01-31')]
 * }
 * 
 * Converts to API Filters:
 * {
 *   search: "grocery",
 *   type: "expense",
 *   date_from: "2024-01-01",
 *   date_to: "2024-01-31",
 *   ordering: "-date"
 * }
 * 
 * These become query parameters:
 * /api/transactions/?search=grocery&type=expense&date_from=2024-01-01&date_to=2024-01-31&ordering=-date
 * 
 * Why This Design?
 * 
 * Benefits:
 * - Immediate feedback (real-time)
 * - Clear all at once
 * - Responsive design
 * - Intuitive UI
 * - Good performance (debouncing happens in parent)
 */