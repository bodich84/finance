import { useState } from 'react';
import { Dropdown, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTransactions } from '../context/TransactionsContext';
import { toast } from 'react-toastify';
import AddIncome from './forms/AddIncome';
import AddExpense from './forms/AddExpense';
import AddTransfer from './forms/AddTransfer';
import AddDividend from './forms/AddDividend';
import AddInvestment from './forms/AddInvestment';

const normalizeToDate = (v) => {
  if (!v) return null;
  if (typeof v?.toDate === 'function') return v.toDate(); // dayjs/antd
  if (v instanceof Date) return v;
  return new Date(v);
};

const HeaderWithAddButton = () => {
  const { addTransaction, addTransfer } = useTransactions();

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isDividendModalVisible, setIsDividendModalVisible] = useState(false);
  const [isInvestmentModalVisible, setIsInvestmentModalVisible] = useState(false);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const showTransferModal = () => setIsTransferModalVisible(true);
  const showDividendModal = () => setIsDividendModalVisible(true);
  const showInvestmentModal = () => setIsInvestmentModalVisible(true);

  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);
  const handleTransferCancel = () => setIsTransferModalVisible(false);
  const handleDividendCancel = () => setIsDividendModalVisible(false);
  const handleInvestmentCancel = () => setIsInvestmentModalVisible(false);

  const onFinish = (values, type) => {
    const date = normalizeToDate(values.date);
    if (!date) return toast.error('Дата не вибрана');

    const amount = Number(values.amount);
    if (!Number.isFinite(amount)) return toast.error('Некоректна сума');

    addTransaction({
      type,
      date,
      amount,
      name: values.name,
      comments: values.comments || '',
      account: values.account,
      finmodel: values.finmodel,
    });

    handleExpenseCancel();
    handleIncomeCancel();
    handleTransferCancel();
    handleDividendCancel();
    handleInvestmentCancel();
  };

  const handleTransfer = async ({ from, to, amount, date }) => {
    const d = normalizeToDate(date);
    if (!d) return toast.error('Дата не вибрана');

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return toast.error('Некоректна сума');

    await addTransfer({ from, to, amount: amt, date: d }); // створює 2 проводки з одним transferId
    handleTransferCancel();
  };

  const menuItems = [
    { key: 'income', label: 'Дохід', onClick: showIncomeModal },
    { key: 'expense', label: 'Витрати', onClick: showExpenseModal },
    { key: 'transfer', label: 'Переказ', onClick: showTransferModal },
    { key: 'dividend', label: 'Дивіденд', onClick: showDividendModal },
    { key: 'investment', label: 'Інвестиція', onClick: showInvestmentModal },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems.map(({ key, label, onClick }) => ({ key, label, onClick })) }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button type="primary" shape="circle" icon={<PlusOutlined />} />
      </Dropdown>

      <AddExpense
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncome
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <AddTransfer
        isTransferModalVisible={isTransferModalVisible}
        handleTransferCancel={handleTransferCancel}
        onTransfer={handleTransfer}
      />
      <AddDividend
        isDividendModalVisible={isDividendModalVisible}
        handleDividendCancel={handleDividendCancel}
        onFinish={onFinish}
      />
      <AddInvestment
        isInvestmentModalVisible={isInvestmentModalVisible}
        handleInvestmentCancel={handleInvestmentCancel}
        onFinish={onFinish}
      />
    </>
  );
};

export default HeaderWithAddButton;
