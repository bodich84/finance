import './styles.css'
import { Table, Popconfirm, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const TransactionsTable = ({ transactions, deleteTransaction }) => {
  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (value) => {
        const dateObj = value?.toDate ? value.toDate() : new Date(value)
        return dayjs(dateObj).format('DD-MM-YYYY')
      },
    },
    {
      title: 'Сума',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Рахунок',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Коментарі',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Видалити транзакцію?"
          okText="Так"
          cancelText="Ні"
          onConfirm={() => deleteTransaction(record.id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ]

  return (
    <div className='table-box container'>
      <h2>Транзакції</h2>

      <div className='table-container'>
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey="id" // 🔹 важливо для коректного оновлення
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
