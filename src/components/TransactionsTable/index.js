import './styles.css'
import { Table, Popconfirm, Dropdown, Button } from 'antd'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const normalizeToDate = (value) => {
  if (!value) return null
  if (typeof value?.toDate === 'function') return value.toDate()
  if (value instanceof Date) return value
  return new Date(value)
}

const TransactionsTable = ({ transactions, deleteTransaction, editTransaction }) => {
  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (value) => {
        const d = normalizeToDate(value)
        return d ? dayjs(d).format('DD.MM.YY') : ''
      },
      // sorter: (a, b) => {
      //   const da = normalizeToDate(a.date)?.getTime() ?? 0
      //   const db = normalizeToDate(b.date)?.getTime() ?? 0
      //   return da - db
      // },
      defaultSortOrder: 'descend',
    },
    {
      title: 'Сума',
      dataIndex: 'amount',
      key: 'amount',
      render: (v) => Number(v).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      sorter: (a, b) => Number(a.amount) - Number(b.amount),
    },
    {
      title: 'Рахунок',
      key: 'account',
      render: (_, record) =>
        record.type === 'transfer'
          ? `${record.from} → ${record.to}`
          : record.account || '—',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
    },
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    { title: 'Коментарі', dataIndex: 'comments', key: 'comments' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => {
        const docIdForDelete =
          record.type === 'transfer'
            ? (record._pairDocIds?.[0] || record.id)
            : record.id

        const items = [
          {
            key: 'edit',
            label: 'Редагувати',
            icon: <EditOutlined />,
            onClick: () => editTransaction?.(record),
          },
          {
            key: 'delete',
            label: (
              <Popconfirm
                title="Видалити?"
                okText="Так"
                cancelText="Ні"
                onConfirm={() => deleteTransaction?.(docIdForDelete)}
                onClick={(e) => e.stopPropagation()}
              >
                Видалити
              </Popconfirm>
            ),
            icon: <DeleteOutlined style={{ color: 'red' }} />,
          },
        ]

        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        )
      },
    },
  ]

  return (
    <div className='table-box container'>
      <h2>Транзакції</h2>
      <div className='table-container'>
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey="id"
          className='table'
          rowClassName={(record) => {
            if (record.type === 'income') return 'row-income'
            if (record.type === 'expense') return 'row-expense'
            if (record.type === 'transfer') return 'row-transfer'
            return ''
          }}
        />
      </div>
    </div>
  )
}

export default TransactionsTable
