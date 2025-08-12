import { Table } from 'antd';
import { useTransactions } from '../context/TransactionsContext';
import { useExpenseCategories } from '../context/ExpenseCategoriesContext';

const plannedPercents = {
  Хозка: 2,
  Закупка: 35,
  Маркетинг: 2,
};

const BusinessModel = () => {
  const { transactions } = useTransactions();
  const { expenseCategories } = useExpenseCategories();

  const totalTurnover = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const getActualSum = (categoryName) =>
    transactions
      .filter(t => t.type === 'expense' && t.category === categoryName)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);

  const data = expenseCategories.map(cat => {
    const plannedPercent = plannedPercents[cat.name] || 0;
    const plannedAmount = (plannedPercent / 100) * totalTurnover;
    const actualAmount = getActualSum(cat.name);
    return {
      key: cat.id,
      name: cat.name,
      plannedPercent: `${plannedPercent}%`,
      plannedAmount: plannedAmount.toFixed(2),
      actualAmount: actualAmount.toFixed(2),
      diff: (plannedAmount - actualAmount).toFixed(2),
    };
  });

  const columns = [
    { title: 'Категорія', dataIndex: 'name', key: 'name' },
    { title: '% від обороту', dataIndex: 'plannedPercent', key: 'plannedPercent' },
    { title: 'Запланована сума', dataIndex: 'plannedAmount', key: 'plannedAmount' },
    { title: 'Фактична сума', dataIndex: 'actualAmount', key: 'actualAmount' },
    { title: 'Різниця', dataIndex: 'diff', key: 'diff' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Бізнес-модель</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default BusinessModel;
