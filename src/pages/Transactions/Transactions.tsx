/**
 * Transactions Page
 * 
 * Complete transaction management interface.
 * 
 * Features:
 * - View all transactions in table
 * - Add new transaction
 * - Edit existing transaction
 * - Delete transaction with confirmation
 * - Filter by multiple criteria
 * - Search functionality
 * - Pagination
 * - Sorting
 * - Responsive design
 */

import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Popconfirm,
  message,
  Card,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TransactionFormModal from './components/TransactionFormModal';
import TransactionFilters from './components/TransactionFilters';
import {
  filterTransactions,
  deleteTransaction,
  type Transaction,
  type TransactionFilters as FilterType,
  type PaginatedResponse,
} from '../../api/transactionApi';
import './Transactions.css';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

/**
 * Transactions Component
 */
const Transactions = () => {
  /**
   * State Management
   */
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterType>({ ordering: '-date' });
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  /**
   * Fetch transactions on mount and when dependencies change
   */
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, pageSize, filters]);

  /**
   * Fetch Transactions
   * 
   * Fetches paginated and filtered transactions
   */
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      const response: PaginatedResponse<Transaction> = await filterTransactions({
        ...filters,
        page: currentPage,
        page_size: pageSize,
      });

      setTransactions(response.results);
      setTotal(response.count);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      message.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Filter Change
   * 
   * Called when user applies filters
   */
  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  /**
   * Handle Page Change
   * 
   * Called when user navigates pages
   */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  /**
   * Open Add Modal
   */
  const handleAdd = () => {
    setModalMode('create');
    setSelectedTransaction(null);
    setModalVisible(true);
  };

  /**
   * Open Edit Modal
   */
  const handleEdit = (transaction: Transaction) => {
    setModalMode('edit');
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  /**
   * Handle Delete
   * 
   * Deletes transaction after confirmation
   */
  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      message.success('Transaction deleted successfully');
      
      // Refresh list
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      message.error('Failed to delete transaction');
    }
  };

  /**
   * Handle Modal Success
   * 
   * Called after successful create/update
   */
  const handleModalSuccess = () => {
    fetchTransactions();
  };

  /**
   * Format Currency
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
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  /**
   * Table Columns Definition
   * 
   * Defines how each column should be displayed
   */
  const columns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => (
        <Text strong>{formatDate(date)}</Text>
      ),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'income' | 'expense') => (
        <Tag
          color={type === 'income' ? 'success' : 'error'}
          icon={type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        >
          {type === 'income' ? 'Income' : 'Expense'}
        </Tag>
      ),
      filters: [
        { text: 'Income', value: 'income' },
        { text: 'Expense', value: 'expense' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
      width: 150,
      render: (categoryName: string) => (
        <Tag color="blue">{categoryName || 'Uncategorized'}</Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          <Text>{description || 'No description'}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (amount: string, record: Transaction) => (
        <Text
          strong
          style={{
            color: record.type === 'income' ? '#52c41a' : '#ff4d4f',
            fontSize: '15px',
          }}
        >
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record: Transaction) => (
        <Space size="small">
          {/**
           * Edit Button
           */}
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>

          {/**
           * Delete Button with Confirmation
           * 
           * Popconfirm shows confirmation dialog
           * before executing delete
           */}
          <Popconfirm
            title="Delete Transaction"
            description="Are you sure you want to delete this transaction?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      {/**
       * Page Header
       */}
      <div className="transactions-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Transactions
          </Title>
          <Text type="secondary">
            Manage your income and expenses
          </Text>
        </div>
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
        >
          Add Transaction
        </Button>
      </div>

      {/**
       * Filters
       */}
      <TransactionFilters
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/**
       * Transactions Table
       * 
       * Ant Design Table with:
       * - Data source
       * - Columns configuration
       * - Pagination
       * - Loading state
       * - Row key
       * - Responsive scroll
       */}
      <Card bordered={false}>
        <Table<Transaction>
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          className="transactions-table"
        />
      </Card>

      {/**
       * Transaction Form Modal
       * 
       * Handles both create and edit
       */}
      <TransactionFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleModalSuccess}
        transaction={selectedTransaction}
        mode={modalMode}
      />
    </DashboardLayout>
  );
};

export default Transactions;

/**
 * Understanding Ant Design Table:
 * 
 * 1. Columns Definition:
 * 
 *    ColumnsType<Transaction> - TypeScript type for columns
 *    
 *    Each column has:
 *    - title: Header text
 *    - dataIndex: Field name in data
 *    - key: Unique identifier
 *    - render: Custom render function
 *    - width: Column width
 *    - sorter: Enable sorting
 *    - filters: Enable filtering
 * 
 *    Example:
 *    {
 *      title: 'Amount',
 *      dataIndex: 'amount',
 *      render: (amount) => formatCurrency(amount)
 *    }
 * 
 * 2. Pagination:
 * 
 *    Built-in pagination with:
 *    - current: Current page
 *    - pageSize: Items per page
 *    - total: Total items
 *    - showSizeChanger: Allow changing page size
 *    - pageSizeOptions: Available page sizes
 * 
 * 3. Loading State:
 * 
 *    loading={true} shows skeleton loader
 *    Better UX than blank table or spinner
 * 
 * 4. Responsive Scroll:
 * 
 *    scroll={{ x: 'max-content' }}
 *    - Adds horizontal scroll on small screens
 *    - Prevents table from breaking layout
 * 
 * 5. Row Key:
 * 
 *    rowKey="id"
 *    - Unique identifier for each row
 *    - Required for proper React rendering
 *    - Enables selection, drag-drop, etc.
 * 
 * 6. Table Actions:
 * 
 *    Fixed column on right with actions:
 *    - Edit: Opens modal with transaction data
 *    - Delete: Shows confirmation, then deletes
 * 
 *    fixed: 'right' keeps column visible when scrolling
 * 
 * Understanding Popconfirm:
 * 
 * Confirmation dialog before dangerous actions.
 * 
 * <Popconfirm
 *   title="Delete Transaction"
 *   description="Are you sure?"
 *   onConfirm={handleDelete}
 *   okText="Yes, Delete"
 *   cancelText="Cancel"
 *   okButtonProps={{ danger: true }}
 * >
 *   <Button>Delete</Button>
 * </Popconfirm>
 * 
 * Flow:
 * 1. User clicks Delete button
 * 2. Popconfirm shows above button
 * 3. User confirms or cancels
 * 4. If confirmed, onConfirm executes
 * 
 * Benefits:
 * - Prevents accidental deletion
 * - No need for separate modal
 * - Better UX than alert()
 * 
 * Data Flow:
 * 
 * 1. Component mounts
 *    ↓
 * 2. useEffect → fetchTransactions()
 *    ↓
 * 3. API call with filters + pagination
 *    ↓
 * 4. Update state (transactions, total)
 *    ↓
 * 5. Table renders with data
 *    ↓
 * 6. User interacts (filter, page, edit, delete)
 *    ↓
 * 7. State updates → useEffect → refetch
 * 
 * Pagination Logic:
 * 
 * Backend returns:
 * {
 *   count: 45,          // Total transactions
 *   next: "...",        // Next page URL
 *   previous: "...",    // Previous page URL
 *   results: [...]      // Current page data
 * }
 * 
 * Frontend uses:
 * - count → total (for pagination)
 * - results → transactions (for table)
 * 
 * When user changes page:
 * 1. currentPage updates
 *    ↓
 * 2. useEffect detects change
 *    ↓
 * 3. Fetches new page
 *    ↓
 * 4. Table updates
 * 
 * Filter + Pagination Interaction:
 * 
 * When filters change:
 * 1. Update filters state
 * 2. Reset to page 1 (important!)
 * 3. Fetch filtered data
 * 
 * Why reset to page 1?
 * - Filtered results might have fewer pages
 * - Page 5 might not exist after filtering
 * - Better UX to start from beginning
 * 
 * Responsive Design:
 * 
 * Desktop:
 * ┌────────────────────────────────────┐
 * │ Date │ Type │ Category │ ... │ Actions │
 * └────────────────────────────────────┘
 * 
 * Mobile:
 * ┌──────────────┐
 * │ Date │ Type  │ → (scroll)
 * └──────────────┘
 * 
 * scroll={{ x: 'max-content' }} enables horizontal scroll
 * 
 * Performance Considerations:
 * 
 * 1. Backend Pagination:
 *    - Don't fetch all transactions at once
 *    - Fetch 10-50 per page
 *    - Fast even with thousands of records
 * 
 * 2. Backend Filtering:
 *    - Filter on database, not in browser
 *    - More efficient
 *    - Reduces data transfer
 * 
 * 3. Backend Sorting:
 *    - Sort in database query
 *    - ordering=-date (newest first)
 *    - Fast with database indexes
 */