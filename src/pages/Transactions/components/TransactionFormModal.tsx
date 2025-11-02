/**
 * Transaction Form Modal
 * 
 * Reusable modal for creating and editing transactions.
 * 
 * Features:
 * - Add new transaction
 * - Edit existing transaction
 * - Form validation
 * - Category selection (filtered by type)
 * - Date picker
 * - Amount input with currency
 */

import { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Space,
  Button,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  createTransaction,
  updateTransaction,
  type Transaction,
  type TransactionRequest,
} from '../../../api/transactionApi';
import { getCategories, createCategory, type Category } from '../../../api/categoryApi';

const { TextArea } = Input;

/**
 * Props Interface
 */
interface TransactionFormModalProps {
  visible: boolean;                     // Modal visibility
  onCancel: () => void;                 // Close modal
  onSuccess: () => void;                // Called after successful save
  transaction?: Transaction | null;     // Existing transaction (for edit)
  mode: 'create' | 'edit';             // Form mode
}

/**
 * Form Values Interface
 * 
 * Matches form fields
 */
interface FormValues {
  type: 'income' | 'expense';
  category: number;
  amount: number;
  description: string;
  date: Dayjs;                          // dayjs object for DatePicker
}

/**
 * TransactionFormModal Component
 */
const TransactionFormModal = ({
  visible,
  onCancel,
  onSuccess,
  transaction,
  mode,
}: TransactionFormModalProps) => {
  /**
   * State
   */
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  /**
   * Watch form type field
   * 
   * When type changes, filter categories
   */
  const transactionType = Form.useWatch('type', form);

  /**
   * Fetch Categories on mount
   */
  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  /**
   * Filter categories when type changes
   */
  useEffect(() => {
    if (transactionType) {
      const filtered = categories.filter((cat) => cat.type === transactionType);
      setFilteredCategories(filtered);
    }
  }, [transactionType, categories]);

  /**
   * Set form values when editing
   */
  useEffect(() => {
    if (visible && mode === 'edit' && transaction) {
      form.setFieldsValue({
        type: transaction.type,
        category: transaction.category,
        amount: parseFloat(transaction.amount),
        description: transaction.description,
        date: dayjs(transaction.date),
      });
    } else if (visible && mode === 'create') {
      // Reset form for new transaction
      form.resetFields();
      form.setFieldsValue({
        type: 'expense',
        date: dayjs(),
      });
    }
  }, [visible, mode, transaction, form]);

  /**
   * Fetch Categories
   */
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to load categories');
    }
  };

  /**
   * Handle Add New Category
   * 
   * Creates a new category and adds it to the list
   */
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      message.warning('Please enter category name');
      return;
    }

    const currentType = form.getFieldValue('type');
    if (!currentType) {
      message.warning('Please select transaction type first');
      return;
    }

    try {
      setAddingCategory(true);
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
        type: currentType,
      });

      // Add to categories list
      setCategories([...categories, newCategory]);
      
      // Select the new category
      form.setFieldsValue({ category: newCategory.id });
      
      // Clear input
      setNewCategoryName('');
      
      message.success('Category added successfully');
    } catch (error: any) {
      console.error('Error adding category:', error);
      const errorMsg = error.response?.data?.name?.[0] || 'Failed to add category';
      message.error(errorMsg);
    } finally {
      setAddingCategory(false);
    }
  };

  /**
   * Handle Form Submit
   */
  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      // Prepare request data
      const requestData: TransactionRequest = {
        type: values.type,
        category: values.category,
        amount: values.amount,
        description: values.description,
        date: values.date.format('YYYY-MM-DD'),
      };

      if (mode === 'create') {
        // Create new transaction
        await createTransaction(requestData);
        message.success('Transaction added successfully');
      } else {
        // Update existing transaction
        await updateTransaction(transaction!.id, requestData);
        message.success('Transaction updated successfully');
      }

      // Close modal and refresh list
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      const errorMsg = error.response?.data?.error || 'Failed to save transaction';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Cancel
   */
  const handleCancel = () => {
    form.resetFields();
    setNewCategoryName('');
    onCancel();
  };

  return (
    <Modal
      title={mode === 'create' ? 'Add Transaction' : 'Edit Transaction'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          type: 'expense',
          date: dayjs(),
        }}
      >
        {/**
         * Transaction Type
         * 
         * Radio buttons for income/expense
         */}
        <Form.Item
          name="type"
          label="Transaction Type"
          rules={[{ required: true, message: 'Please select transaction type' }]}
        >
          <Select
            size="large"
            options={[
              { label: '💰 Income', value: 'income' },
              { label: '💸 Expense', value: 'expense' },
            ]}
          />
        </Form.Item>

        {/**
         * Category Selection with Add New
         * 
         * Dropdown shows filtered categories
         * Input to add new category
         */}
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            size="large"
            placeholder="Select category"
            loading={!filteredCategories.length}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Space style={{ padding: '8px' }}>
                  <Input
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onPressEnter={handleAddCategory}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={handleAddCategory}
                    loading={addingCategory}
                  >
                    Add
                  </Button>
                </Space>
              </>
            )}
            options={filteredCategories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
        </Form.Item>

        {/**
         * Amount Input
         * 
         * InputNumber for numeric input with currency
         */}
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Please enter amount' },
            { type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
          ]}
        >
          <InputNumber
            size="large"
            style={{ width: '100%' }}
            prefix="₹"
            placeholder="0.00"
            precision={2}
            min={0}
          />
        </Form.Item>

        {/**
         * Description
         * 
         * TextArea for multi-line input
         */}
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea
            rows={3}
            placeholder="Enter transaction description"
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/**
         * Date Picker
         * 
         * Select transaction date
         */}
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={(current) => {
              // Disable future dates
              return current && current > dayjs().endOf('day');
            }}
          />
        </Form.Item>

        {/**
         * Form Actions
         * 
         * Cancel and Submit buttons
         */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Add Transaction' : 'Update Transaction'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionFormModal;

/**
 * Understanding Key Concepts:
 * 
 * 1. Form.useWatch:
 *    - Watches specific form field
 *    - Re-renders when field changes
 *    - Used to filter categories based on type
 * 
 *    const type = Form.useWatch('type', form);
 *    // When user changes type, this updates
 *    // We then filter categories by this type
 * 
 * 2. dayjs:
 *    - Modern date library (replacement for moment.js)
 *    - Used with Ant Design DatePicker
 *    - Lightweight and immutable
 * 
 *    dayjs() - Current date
 *    dayjs('2024-01-15') - Specific date
 *    dayjs().format('YYYY-MM-DD') - Format date
 * 
 * 3. Select dropdownRender:
 *    - Customizes dropdown content
 *    - We add input to create new category
 *    - Shows in dropdown footer
 * 
 *    <Select
 *      dropdownRender={(menu) => (
 *        <>
 *          {menu}  { Original options }
 *          {Custom content below }
 *        </>
 *      )}
 *    />
 * 
 * 4. InputNumber:
 *    - Numeric input with controls
 *    - precision: Decimal places
 *    - min/max: Range validation
 *    - prefix/suffix: Currency symbols
 * 
 * 5. Modal destroyOnClose:
 *    - Destroys modal content when closed
 *    - Resets form state
 *    - Prevents stale data
 * 
 * 6. Form Validation Rules:
 *    rules={[
 *      { required: true, message: '...' },
 *      { type: 'number', min: 0.01, message: '...' },
 *    ]}
 * 
 *    - required: Field must have value
 *    - type: Validates data type
 *    - min/max: Number range
 *    - pattern: Regex validation
 *    - Custom validator function
 * 
 * Flow for Adding Category:
 * 
 * 1. User types category name
 *    ↓
 * 2. Clicks Add or presses Enter
 *    ↓
 * 3. Validates name and type
 *    ↓
 * 4. Calls createCategory API
 *    ↓
 * 5. Adds to categories list
 *    ↓
 * 6. Auto-selects new category
 *    ↓
 * 7. Shows success message
 * 
 * Why Reusable Modal?
 * 
 * Benefits:
 * - Single component for add and edit
 * - Consistent UI and validation
 * - Less code duplication
 * - Easier to maintain
 * 
 * Usage:
 * // For adding:
 * <TransactionFormModal
 *   visible={showModal}
 *   onCancel={handleClose}
 *   onSuccess={refreshList}
 *   mode="create"
 * />
 * 
 * // For editing:
 * <TransactionFormModal
 *   visible={showModal}
 *   onCancel={handleClose}
 *   onSuccess={refreshList}
 *   transaction={selectedTransaction}
 *   mode="edit"
 * />
 */