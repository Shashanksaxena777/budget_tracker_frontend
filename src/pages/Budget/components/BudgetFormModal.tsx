/**
 * Budget Form Modal
 * 
 * Modal for setting or updating monthly budget.
 * 
 * Features:
 * - Create new budget
 * - Update existing budget
 * - Month selector (only first day of month)
 * - Amount input with currency
 * - Form validation
 */

import { useEffect, useState } from 'react';
import { Modal, Form, DatePicker, InputNumber, message, Space, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
  createBudget,
  updateBudget,
  type Budget,
  type BudgetRequest,
} from '../../../api/budgetApi';

/**
 * Props Interface
 */
interface BudgetFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  budget?: Budget | null;          // Existing budget (for edit)
  mode: 'create' | 'edit';
}

/**
 * Form Values Interface
 */
interface FormValues {
  month: Dayjs;
  budget_amount: number;
}

/**
 * BudgetFormModal Component
 */
const BudgetFormModal = ({
  visible,
  onCancel,
  onSuccess,
  budget,
  mode,
}: BudgetFormModalProps) => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  /**
   * Set form values when editing
   */
  useEffect(() => {
    if (visible && mode === 'edit' && budget) {
      form.setFieldsValue({
        month: dayjs(budget.month),
        budget_amount: parseFloat(budget.budget_amount),
      });
    } else if (visible && mode === 'create') {
      // Default to current month
      const currentMonth = dayjs().startOf('month');
      form.resetFields();
      form.setFieldsValue({
        month: currentMonth,
      });
    }
  }, [visible, mode, budget, form]);

  /**
   * Handle Form Submit
   */
  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      // Prepare request data (first day of selected month)
      const requestData: BudgetRequest = {
        month: values.month.startOf('month').format('YYYY-MM-DD'),
        budget_amount: values.budget_amount,
      };

      if (mode === 'create') {
        await createBudget(requestData);
        message.success('Budget created successfully');
      } else {
        await updateBudget(budget!.id, requestData);
        message.success('Budget updated successfully');
      }

      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error('Error saving budget:', error);
      
      // Handle duplicate month error
      if (error.response?.data?.month) {
        message.error('Budget already exists for this month. Please edit the existing budget.');
      } else {
        const errorMsg = error.response?.data?.error || 'Failed to save budget';
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Cancel
   */
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  /**
   * Disable dates for month picker
   * 
   * Only allow selecting months (always first day)
   */
  const disabledDate = (current: Dayjs) => {
    // Can't select future months
    const today = dayjs();
    return current && current.isAfter(today, 'month');
  };

  return (
    <Modal
      title={mode === 'create' ? 'Set Monthly Budget' : 'Update Budget'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/**
         * Month Picker
         * 
         * Select which month this budget applies to
         */}
        <Form.Item
          name="month"
          label="Budget Month"
          rules={[{ required: true, message: 'Please select month' }]}
          tooltip="Budget will apply to the entire selected month"
        >
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            picker="month"
            format="MMMM YYYY"
            disabledDate={disabledDate}
            disabled={mode === 'edit'} // Can't change month when editing
          />
        </Form.Item>

        {/**
         * Budget Amount Input
         */}
        <Form.Item
          name="budget_amount"
          label="Budget Amount"
          rules={[
            { required: true, message: 'Please enter budget amount' },
            { 
              type: 'number', 
              min: 1, 
              message: 'Budget must be greater than 0' 
            },
          ]}
          tooltip="Total amount you plan to spend this month"
        >
          <InputNumber
            size="large"
            style={{ width: '100%' }}
            prefix="₹"
            placeholder="0.00"
            precision={2}
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\₹\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        {/**
         * Helper Text
         */}
        <div style={{ 
          marginBottom: 24, 
          padding: 12, 
          background: '#f0f7ff', 
          borderRadius: 8,
          border: '1px solid #d6e4ff'
        }}>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>
            💡 <strong>Tip:</strong> Set a realistic budget based on your average monthly expenses. 
            You can track how much you've spent against this budget throughout the month.
          </p>
        </div>

        {/**
         * Form Actions
         */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Set Budget' : 'Update Budget'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BudgetFormModal;

/**
 * Understanding DatePicker with picker="month":
 * 
 * picker="month" - Only select month, not specific date
 * 
 * Behavior:
 * - Shows month/year selector
 * - Returns first day of selected month
 * - Format: "January 2024"
 * - Value stored: "2024-01-01"
 * 
 * Example:
 * User selects "November 2024"
 * → dayjs object: 2024-11-01 00:00:00
 * → .format('YYYY-MM-DD'): "2024-11-01"
 * 
 * Why first day of month?
 * - Database stores: 2024-11-01
 * - Represents entire November 2024
 * - Easy to query transactions for that month
 * 
 * InputNumber Formatter/Parser:
 * 
 * formatter: Display value
 * - Adds thousand separators
 * - "50000" → "50,000"
 * 
 * parser: Extract actual value
 * - Removes formatting
 * - "₹ 50,000" → 50000
 * 
 * Example:
 * User types: 50000
 * → Formatter shows: "50,000"
 * → Parser extracts: 50000
 * → Stored in form: 50000
 * 
 * Form Validation:
 * 
 * rules={[
 *   { required: true, message: '...' },
 *   { type: 'number', min: 1, message: '...' }
 * ]}
 * 
 * Validates:
 * - Field is not empty
 * - Value is a number
 * - Value is greater than 0
 * 
 * Error Handling:
 * 
 * Duplicate month error:
 * - Backend constraint: unique_together=['user', 'month']
 * - If user tries to create budget for existing month
 * - Backend returns error with 'month' field
 * - Frontend shows friendly message
 * 
 * Disabled Month in Edit Mode:
 * 
 * When editing:
 * - Month field is disabled
 * - Can only change amount
 * - Prevents accidental month change
 * - To change month, delete and create new
 * 
 * Why?
 * - Budget is tied to specific month
 * - Changing month could cause confusion
 * - Better to create new budget for different month
 */