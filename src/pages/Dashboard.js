import {useState, useEffect} from 'react'
import {DatePicker, Space, Checkbox} from 'antd'
// import {toast} from 'react-toastify'
import Cards from '../components/Cards'
// import AddExpense from '../components/Modals/AddExpense'
// import AddIncome from '../components/Modals/AddIncome'
// import AddTransfer from '../components/Modals/AddTransfer'
import TransactionsTable from '../components/TransactionsTable'
import {useTransactions} from '../context/TransactionsContext'

const {RangePicker} = DatePicker

const Dashboard = () => {
  const {transactions, deleteTransaction, dateRange, setDateRange, editTransaction} =
    useTransactions()

  const [showTransfers, setShowTransfers] = useState(true)

  const filteredTransactions = showTransfers
    ? transactions
    : transactions.filter((t) => t.type !== 'transfer')

  return (
    <div>
      <div className='container' style={{marginBottom: 16}}>
        <Space direction='vertical' size={12} style={{marginTop: 12}}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [])}
            allowClear
            format='DD.MM.YYYY'
            placeholder={['Початок періоду', 'Кінець періоду']}
          />
        </Space>

        <Checkbox
          checked={showTransfers}
          onChange={(e) => setShowTransfers(e.target.checked)}
          style={{marginLeft: '1rem'}}
        >
          Показувати перекази
        </Checkbox>
      </div>

      <TransactionsTable
        transactions={filteredTransactions}
        deleteTransaction={deleteTransaction}
      />
    </div>
  )
}

export default Dashboard
