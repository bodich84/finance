import { Table } from 'antd';
import { useTransactions } from '../context/TransactionsContext';

// Планові відсотки згідно фінансової моделі
const planItems = [
  { group: 'Змінні витрати', name: 'Food cost', category: 'Закупка', planned: '25-30' },
  { group: 'Фіксовані витрати', name: 'Зарплати персоналу', category: 'Зарплати персоналу', planned: '20-25' },
  { group: 'Фіксовані витрати', name: 'Оренда', category: 'Оренда', planned: '8-10' },
  { group: 'Фіксовані витрати', name: 'Комунальні', category: 'Комунальні', planned: '5-7' },
  { group: 'Фіксовані витрати', name: 'Податки', category: 'Податки', planned: '3-5' },
  { group: 'Фіксовані витрати', name: 'Маркетинг', category: 'Маркетинг', planned: '3-5' },
  { group: 'Фіксовані витрати', name: 'Операційні витрати', category: 'Операційні витрати', planned: '2-3' },
  { group: 'Фіксовані витрати', name: 'Господарка (хозка)', category: 'Хозка', planned: '2-3' },
  { group: 'Фіксовані витрати', name: 'Інші витрати', category: 'Інші витрати', planned: '2-3' },
];

const BusinessModel = () => {
  const { transactions } = useTransactions();

  const totalTurnover = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const getActualSum = (categoryName) =>
    transactions
      .filter(t => t.type === 'expense' && t.category === categoryName)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);

  const data = planItems.map((item, idx) => {
    const actualAmount = getActualSum(item.category);
    const actualPercent = totalTurnover ? (actualAmount / totalTurnover) * 100 : 0;
    return {
      key: idx,
      group: item.group,
      name: item.name,
      plannedPercent: item.planned,
      actualPercent: actualPercent.toFixed(2),
      actualAmount: actualAmount.toFixed(2),
    };
  });

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);
  const expensePercent = totalTurnover ? (totalExpenses / totalTurnover) * 100 : 0;
  const profitAmount = totalTurnover - totalExpenses;
  const profitPercent = 100 - expensePercent;

  const columns = [
    { title: 'Категорія', dataIndex: 'name', key: 'name' },
    {
      title: 'План %',
      dataIndex: 'plannedPercent',
      key: 'plannedPercent',
      render: text => `${text}%`,
    },
    { title: 'Факт %', dataIndex: 'actualPercent', key: 'actualPercent', render: text => `${text}%` },
    { title: 'Факт сума', dataIndex: 'actualAmount', key: 'actualAmount' },
  ];

  const renderList = (group) => (
    data
      .filter(d => d.group === group)
      .map(d => (
        <li key={d.name}>
          {d.name}: план {d.plannedPercent}% , факт {d.actualPercent}% ({d.actualAmount})
        </li>
      ))
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Бізнес-модель</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
      <h3 style={{ marginTop: 20 }}>Спрощена фінансова модель (P&L у %)</h3>
      <ul>
        <li>Виручка = 100% ({totalTurnover.toFixed(2)})</li>
        <li>
          Змінні витрати:
          <ul>
            {renderList('Змінні витрати')}
          </ul>
        </li>
        <li>
          Фіксовані витрати:
          <ul>
            {renderList('Фіксовані витрати')}
          </ul>
        </li>
        <li>
          Разом витрати: план 75-85%, факт {expensePercent.toFixed(2)}% ({totalExpenses.toFixed(2)})
        </li>
        <li>
          Чистий прибуток: план 10-20%, факт {profitPercent.toFixed(2)}% ({profitAmount.toFixed(2)})
        </li>
      </ul>
    </div>
  );
};

export default BusinessModel;
