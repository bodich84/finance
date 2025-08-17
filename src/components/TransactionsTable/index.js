import './styles.css'
import { Table, Popconfirm, Dropdown, Button } from 'antd'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const TransactionsTable = ({ transactions, deleteTransaction, editTransaction }) => {
  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (value) => {
        const dateObj = value?.toDate ? value.toDate() : new Date(value)
        return dayjs(dateObj).format('DD.MM.YY')
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
      render: (_, record) => {
        const items = [
          {
            key: 'edit',
            label: 'Редагувати',
            icon: <EditOutlined />,
            onClick: () => editTransaction(record),
          },
          {
            key: 'delete',
            label: (
              <Popconfirm
                title="Видалити транзакцію?"
                okText="Так"
                cancelText="Ні"
                onConfirm={() => deleteTransaction(record.id)}
                onClick={(e) => e.stopPropagation()} // щоб клік не закривав меню одразу
              >
                Видалити
              </Popconfirm>
            ),
            icon: <DeleteOutlined style={{ color: 'red' }} />,
          },
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
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
