import { useState, useEffect } from 'react';
import { DatePicker, Space, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import Cards from '../components/Cards';
import AddExpense from '../components/Modals/addExpense';
import AddIncome from '../components/Modals/addIncome';
import AddTransfer from '../components/Modals/AddTransfer';
import TransactionsTable from '../components/TransactionsTable';
import { useTransactions } from '../context/TransactionsContext';

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const { transactions, addTransaction, dateRange, setDateRange } = useTransactions();

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const [showTransfers, setShowTransfers] = useState(true);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const showTransferModal = () => setIsTransferModalVisible(true);

  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);
  const handleTransferCancel = () => setIsTransferModalVisible(false);

  const onFinish = (values, type) => {
    if (!values.date) {
      toast.error('Дата не вибрана');
      return;
    }
    const newTransaction = {
      type,
      date: values.date.toDate(),
      amount: parseFloat(values.amount),
      name: values.name,
      comments: values.comments || '',
      account: values.account,
    };

    addTransaction(newTransaction);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    setIsTransferModalVisible(false);
  };

  const handleTransfer = async (values) => {
    const { from, to, amount, date } = values;

    const transferOut = {
      type: 'transfer',
      amount: -parseFloat(amount),
      account: from,
      date: date.toDate(),
      name: 'Переказ',
      comments: `Переказ на ${to}`,
    };

    const transferIn = {
      type: 'transfer',
      amount: parseFloat(amount),
      account: to,
      date: date.toDate(),
      name: 'Переказ',
      comments: `Переказ з ${from}`,
    };

    await Promise.all([addTransaction(transferOut), addTransaction(transferIn)]);
    toast.success('Переказ виконано');
    setIsTransferModalVisible(false);
  };

  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') totalIncome += parseFloat(transaction.amount);
      else if (transaction.type === 'expense') totalExpense += parseFloat(transaction.amount);
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
    setCurrentBalance(totalIncome - totalExpense);
  }, [transactions]);

  const filteredTransactions = showTransfers
    ? transactions
    : transactions.filter((t) => t.type !== 'transfer');

  return (
    <div>
      <Cards
        currentBalance={currentBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        showTransferModal={showTransferModal}
        income={income}
        expense={expense}
      />

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

      <div className="container" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={12} style={{ marginTop: 12 }}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [])}
            allowClear
            format="DD.MM.YYYY"
            placeholder={['Початок періоду', 'Кінець періоду']}
          />
        </Space>

        <Checkbox
          checked={showTransfers}
          onChange={(e) => setShowTransfers(e.target.checked)}
          style={{ marginLeft: '1rem' }}
        >
          Показувати перекази
        </Checkbox>
      </div>

      <TransactionsTable
        transactions={filteredTransactions}
        addTransaction={addTransaction}
      />
    </div>
  );
};

export default Dashboard;
