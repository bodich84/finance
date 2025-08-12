import { useState } from 'react';
import { Modal, Form, InputNumber, Select, Button, DatePicker } from 'antd';
import { accounts } from '../../constants';

const AddTransfer = ({
  isTransferModalVisible,
  handleTransferCancel,
  onTransfer,
}) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onTransfer(values);
    form.resetFields();
    handleTransferCancel();
  };

  return (
    <Modal
      title="Переказ між рахунками"
      open={isTransferModalVisible}
      onCancel={handleTransferCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="З рахунку"
          name="from"
          rules={[{ required: true, message: 'Оберіть рахунок списання' }]}
        >
          <Select
            options={accounts}
            onChange={(value) => {
              // скидаємо "На рахунок" якщо збіг
              if (form.getFieldValue('to') === value) {
                form.setFieldsValue({ to: undefined });
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="На рахунок"
          name="to"
          rules={[{ required: true, message: 'Оберіть рахунок зарахування' }]}
        >
          <Select
            options={accounts}
            onChange={(value) => {
              // скидаємо "З рахунку" якщо збіг
              if (form.getFieldValue('from') === value) {
                form.setFieldsValue({ from: undefined });
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Сума"
          name="amount"
          rules={[{ required: true, message: 'Вкажіть суму переказу' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Дата"
          name="date"
          rules={[{ required: true, message: 'Оберіть дату' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Здійснити переказ
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTransfer;
