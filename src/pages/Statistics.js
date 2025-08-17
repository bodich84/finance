import {useMemo} from 'react'
import {DatePicker, Space} from 'antd'
import {useTransactions} from '../context/TransactionsContext'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'

const {RangePicker} = DatePicker

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A28EFF',
  '#FF6699',
]

const Statistics = () => {
  const {transactions, dateRange, setDateRange} =
    useTransactions()

  // Доходи по рахунках
  const incomeByAccount = useMemo(() => {
    const grouped = {}
    transactions.forEach((t) => {
      if (t.type === 'income') {
        grouped[t.account] = (grouped[t.account] || 0) + parseFloat(t.amount)
      }
    })
    return Object.entries(grouped).map(([name, value]) => ({name, value}))
  }, [transactions])

  // Витрати по назвах
  const expenseByName = useMemo(() => {
    const grouped = {}
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        grouped[t.name] = (grouped[t.name] || 0) + parseFloat(t.amount)
      }
    })
    return Object.entries(grouped).map(([name, value]) => ({name, value}))
  }, [transactions])

  // Групування по датах (або місяцях)
  const incomeExpenseByDate = useMemo(() => {
    const grouped = {}
    transactions.forEach((t) => {
      if (t.type === 'income' || t.type === 'expense') {
        const dateKey = dayjs(
          t.date.seconds ? t.date.seconds * 1000 : t.date
        ).format('YYYY-MM-DD')
        if (!grouped[dateKey]) {
          grouped[dateKey] = {date: dateKey, income: 0, expense: 0}
        }
        if (t.type === 'income') {
          grouped[dateKey].income += parseFloat(t.amount)
        } else {
          grouped[dateKey].expense += parseFloat(t.amount)
        }
      }
    })
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )
  }, [transactions])

  return (
    <>
      <div className='container'>
        <Space direction='vertical' size={12} style={{marginTop: 12}}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [])}
            allowClear
            format='DD.MM.YYYY'
            placeholder={['Початок періоду', 'Кінець періоду']}
          />
        </Space>
      </div>

      <div
        className='container'
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 className=''>
            <center>Доходи по рахунках</center>
          </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={incomeByAccount}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
              label
            >
              {incomeByAccount.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div>
          <h3>
            <center>Витрати по назвах</center>
          </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={expenseByName}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={100}
              fill='#82ca9d'
              dataKey='value'
              label
            >
              {expenseByName.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div style={{marginTop: 40}}>
        <h3>Дохід та витрати по датах</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={incomeExpenseByDate}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='income' fill='#00C49F' name='Дохід' />
            <Bar dataKey='expense' fill='#FF8042' name='Витрати' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default Statistics
