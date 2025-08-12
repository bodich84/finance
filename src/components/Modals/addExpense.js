import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useState } from 'react';
import { accounts } from '../../constants';
import ExpenseCategorySelect from '../Modals/ExpenseCategorySelect'

const AddExpense = ({ isExpenseModalVisible, handleExpenseCancel, onFinish }) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title='Додати витрати'
      open={isExpenseModalVisible}
      onCancel={() => {
        handleExpenseCancel();
        form.resetFields();
        setSelectedCategory(null);
      }}
      footer={null}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          if (!selectedCategory) {
            form.setFields([
              { name: 'category', errors: ['Виберіть або додайте категорію'] },
            ]);
            return;
          }
          onFinish({ ...values, category: selectedCategory }, 'expense');
          form.resetFields();
          setSelectedCategory(null);
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label='Account'
          name='account'
          rules={[
            {
              required: true,
              message: 'Please enter the account for the transaction',
            },
          ]}
        >
          <Select options={accounts} />
        </Form.Item>

        <Form.Item
          label='Категорія витрат'
          required
          name="name"
          validateStatus={selectedCategory ? '' : 'error'}
          help={selectedCategory ? '' : 'Виберіть або додайте категорію'}
        >
          <ExpenseCategorySelect value={selectedCategory} onChange={setSelectedCategory} />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label='Amount'
          name='amount'
          rules={[{ required: true, message: 'Please enter the expense amount' }]}
        >
          <Input type='number' />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label='Date'
          name='date'
          rules={[{ required: true, message: 'Please select the expense date' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label='Comments'
          name='comments'
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item>
          <Button htmlType='submit' className='btn reset-balance-btn'>
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddExpense;
