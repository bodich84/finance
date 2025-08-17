import { useState, useMemo } from 'react'
import { DatePicker, Space, Checkbox } from 'antd'
import dayjs from 'dayjs'
import TransactionsTable from '../components/TransactionsTable'
import { useTransactions } from '../context/TransactionsContext'
import { useDateRange } from '../context/DateRangeContext'

const { RangePicker } = DatePicker

const normalizeToDate = (v) => {
  if (!v) return null
  if (typeof v?.toDate === 'function') return v.toDate()
  if (v instanceof Date) return v
  return new Date(v)
}

const Dashboard = () => {
  const { tableRows, transactions, deleteTransaction, editTransaction } = useTransactions()
  const { range, setRange, hasRange, startDate, endDate } = useDateRange()

  const [showTransfers, setShowTransfers] = useState(true)

  const data = useMemo(() => {
    const base = (tableRows?.length ? tableRows : transactions) || []
    const byType = showTransfers ? base : base.filter((t) => t.type !== 'transfer')
    if (!hasRange) return byType

    const startTs = startDate.getTime()
    const endTs = endDate.getTime()

    return byType.filter((r) => {
      const d = normalizeToDate(r.date)
      if (!d) return false
      const ts = d.getTime()
      return ts >= startTs && ts <= endTs
    })
  }, [tableRows, transactions, showTransfers, hasRange, startDate, endDate])

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

        <Checkbox
          checked={showTransfers}
          onChange={(e) => setShowTransfers(e.target.checked)}
          style={{ marginLeft: '1rem' }}
        >
          Показувати перекази
        </Checkbox>
      </div>

      <TransactionsTable
        transactions={data}
        deleteTransaction={deleteTransaction}
        editTransaction={editTransaction}
      />
    </div>
  )
}

export default Dashboard
