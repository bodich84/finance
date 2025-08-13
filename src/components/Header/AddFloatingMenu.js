import {Dropdown, FloatButton} from 'antd'
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons'

const AddFloatingMenu = ({
  showExpenseModal,
  showIncomeModal,
  showTransferModal,
}) => {
  const items = [
    {
      key: 'expense',
      label: (
        <span>
          <MinusCircleOutlined style={{color: 'red', marginRight: 8}} />
          Додати витрати
        </span>
      ),
      onClick: showExpenseModal,
    },
    {
      key: 'income',
      label: (
        <span>
          <PlusCircleOutlined style={{color: 'green', marginRight: 8}} />
          Додати дохід
        </span>
      ),
      onClick: showIncomeModal,
    },
    {
      key: 'transfer',
      label: (
        <span>
          <SwapOutlined style={{color: '#1890ff', marginRight: 8}} />
          Додати переказ
        </span>
      ),
      onClick: showTransferModal,
    },
  ]

  return (
    <Dropdown menu={{items}} trigger={['click']} placement='bottomRight'>
      <FloatButton
        shape='circle'
        icon={<PlusCircleOutlined />}
        type='primary'
        style={{
          right: 24,
          top: 16,
        }}
      />
    </Dropdown>
  )
}

export default AddFloatingMenu
