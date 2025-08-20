import { useState } from 'react';
import { Table, Button, Form, Input, Modal, Popconfirm } from 'antd';
import { useAccounts } from '../context/AccountsContext';
import { useFinModels } from '../context/FinModelsContext';

const Settings = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { finmodels, addFinModel, updateFinModel, deleteFinModel } = useFinModels();

  const [accForm] = Form.useForm();
  const [fmForm] = Form.useForm();
  const [accEditForm] = Form.useForm();
  const [fmEditForm] = Form.useForm();
  const [editingAcc, setEditingAcc] = useState(null);
  const [editingFm, setEditingFm] = useState(null);

  const accColumns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type='link' onClick={() => { setEditingAcc(record); accEditForm.setFieldsValue({ name: record.name }); }}>Редагувати</Button>
          <Popconfirm title='Видалити?' okText='Так' cancelText='Ні' onConfirm={() => deleteAccount(record.id)}>
            <Button type='link' danger>Видалити</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const fmColumns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type='link' onClick={() => { setEditingFm(record); fmEditForm.setFieldsValue({ name: record.name }); }}>Редагувати</Button>
          <Popconfirm title='Видалити?' okText='Так' cancelText='Ні' onConfirm={() => deleteFinModel(record.id)}>
            <Button type='link' danger>Видалити</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className='container' style={{ padding: 20 }}>
      <h2>Рахунки</h2>
      <Form form={accForm} layout='inline' onFinish={async ({ name }) => { await addAccount({ name }); accForm.resetFields(); }}>
        <Form.Item name='name' rules={[{ required: true, message: 'Введіть назву рахунку' }]}>
          <Input placeholder='Новий рахунок' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>Додати</Button>
        </Form.Item>
      </Form>
      <Table dataSource={accounts} columns={accColumns} rowKey='id' pagination={false} style={{ marginTop: 16 }} />

      <h2 style={{ marginTop: 32 }}>Finmodel</h2>
      <Form form={fmForm} layout='inline' onFinish={async ({ name }) => { await addFinModel({ name }); fmForm.resetFields(); }}>
        <Form.Item name='name' rules={[{ required: true, message: 'Введіть назву фінмоделі' }]}>
          <Input placeholder='Нова фінмодель' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>Додати</Button>
        </Form.Item>
      </Form>
      <Table dataSource={finmodels} columns={fmColumns} rowKey='id' pagination={false} style={{ marginTop: 16 }} />

      <Modal
        title='Редагувати рахунок'
        open={!!editingAcc}
        onCancel={() => setEditingAcc(null)}
        onOk={() => accEditForm.submit()}
      >
        <Form form={accEditForm} onFinish={async ({ name }) => { await updateAccount(editingAcc.id, { name }); setEditingAcc(null); }}>
          <Form.Item name='name' rules={[{ required: true, message: 'Введіть назву рахунку' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Редагувати фінмодель'
        open={!!editingFm}
        onCancel={() => setEditingFm(null)}
        onOk={() => fmEditForm.submit()}
      >
        <Form form={fmEditForm} onFinish={async ({ name }) => { await updateFinModel(editingFm.id, { name }); setEditingFm(null); }}>
          <Form.Item name='name' rules={[{ required: true, message: 'Введіть назву фінмоделі' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;

