import { useState, useMemo, useEffect } from 'react'
import { DatePicker, Space, Select } from 'antd'
import TransactionsTable from '../components/TransactionsTable'
import AddIncome from '../components/forms/AddIncome'
import AddExpense from '../components/forms/AddExpense'
import AddTransfer from '../components/forms/AddTransfer'
import AddDividend from '../components/forms/AddDividend'
import AddInvestment from '../components/forms/AddInvestment'
import { useTransactions } from '../context/TransactionsContext'
import { useDateRange } from '../context/DateRangeContext'
import { normalizeToDate } from '../utils/date'

const { RangePicker } = DatePicker

const TYPE_OPTIONS = [
  { label: 'Доходи', value: 'income' },
  { label: 'Витрати', value: 'expense' },
  { label: 'Перекази', value: 'transfer' },
  { label: 'Дивіденди', value: 'dividend' },
  { label: 'Інвестиції', value: 'investment' },
]

const Dashboard = () => {
  const {
    tableRows,
    transactions,
    deleteTransaction,
    updateTransaction,
    updateTransfer,
  } = useTransactions()
  const { range, setRange, hasRange, startDate, endDate } = useDateRange()

  const ALL_TYPES = ['income', 'expense', 'transfer', 'dividend', 'investment']
  const [types, setTypes] = useState(() => {
    try {
      const raw = localStorage.getItem('transactionTypes')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length) {
          return parsed
        }
      }
    } catch (e) {
      // ignore
    }
    return ALL_TYPES
  })

  useEffect(() => {
    localStorage.setItem('transactionTypes', JSON.stringify(types))
  }, [types])
  const [editing, setEditing] = useState(null)

  const startEdit = (t) => setEditing(t)
  const cancelEdit = () => setEditing(null)

  const handleEditFinish = async (values, type) => {
    const date = normalizeToDate(values.date)
    if (!date) return
    const amount = Number(values.amount)
    if (!Number.isFinite(amount)) return

    await updateTransaction(editing.id, {
      type,
      date,
      amount,
      name: values.name,
      comments: values.comments || '',
      account: values.account,
      finmodel: values.finmodel,
    })
    setEditing(null)
  }

  const handleTransferEdit = async ({ from, to, amount, date }) => {
    await updateTransfer({
      pairDocIds: editing._pairDocIds,
      from,
      to,
      amount,
      date,
    })
    setEditing(null)
  }

  const data = useMemo(() => {
    const base = (tableRows?.length ? tableRows : transactions) || []
    const byType = base.filter((t) => {
      const key = t.isTransfer ? 'transfer' : t.type
      return types.includes(key)
    })
    if (!hasRange) return byType

    const startTs = startDate.getTime()
    const endTs = endDate.getTime()

    return byType.filter((r) => {
      const d = normalizeToDate(r.date)
      if (!d) return false
      const ts = d.getTime()
      return ts >= startTs && ts <= endTs
    })
  }, [tableRows, transactions, types, hasRange, startDate, endDate])

  return (
    <div>
      <div className='container' style={{ marginBottom: 16 }}>
        <Space direction='vertical' size={12} style={{ marginTop: 12 }}>
          <RangePicker
            value={range}
            onChange={(dates) => setRange(dates || [])}
            allowClear
            format='DD.MM.YYYY'
            placeholder={['Початок періоду', 'Кінець періоду']}
          />
        </Space>

        <Select
          mode='multiple'
          allowClear
          placeholder='Типи транзакцій'
          options={TYPE_OPTIONS}
          value={types}
          onChange={(vals) => setTypes(vals)}
          style={{ minWidth: 200, marginLeft: '1rem' }}
        />
      </div>

      <TransactionsTable
        transactions={data}
        deleteTransaction={deleteTransaction}
        editTransaction={startEdit}
      />
      {editing?.type === 'income' && !editing?.isTransfer && (
        <AddIncome
          isIncomeModalVisible
          handleIncomeCancel={cancelEdit}
          onFinish={handleEditFinish}
          initialValues={editing}
        />
      )}
      {editing?.type === 'expense' && !editing?.isTransfer && (
        <AddExpense
          isExpenseModalVisible
          handleExpenseCancel={cancelEdit}
          onFinish={handleEditFinish}
          initialValues={editing}
        />
      )}
      {editing?.type === 'dividend' && (
        <AddDividend
          isDividendModalVisible
          handleDividendCancel={cancelEdit}
          onFinish={handleEditFinish}
          initialValues={editing}
        />
      )}
      {editing?.type === 'investment' && (
        <AddInvestment
          isInvestmentModalVisible
          handleInvestmentCancel={cancelEdit}
          onFinish={handleEditFinish}
          initialValues={editing}
        />
      )}
      {editing?.isTransfer && (
        <AddTransfer
          isTransferModalVisible
          handleTransferCancel={cancelEdit}
          onTransfer={handleTransferEdit}
          initialValues={editing}
        />
      )}
    </div>
  )
}

export default Dashboard
