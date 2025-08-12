import {Button, Modal, Form, Input, Select, DatePicker} from 'antd'
import {accounts} from '../../constants'
import dayjs from 'dayjs'

const AddIncome = ({isIncomeModalVisible, handleIncomeCancel, onFinish}) => {
  const [form] = Form.useForm()

  return (
    <div>
      <Modal
        title='Додати дохід'
        open={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => {
            onFinish(values, 'income')
            form.resetFields()
          }}
        >
          <Form.Item
            style={{fontWeight: 600, maxWidth: '50%'}}
            label='Сума'
            name='amount'
            rules={[
              {required: true, message: 'Please enter the income amount'},
            ]}
          >
            <Input type='number' inputMode='decimal' addonBefore='₴' />
          </Form.Item>

          <Form.Item
            style={{fontWeight: 600}}
            label='Рахунок'
            name='account'
            rules={[
              {
                required: true,
                message: 'Please enter the account for the transaction',
              },
            ]}
          >
            <Select options={accounts} />
          </Form.Item>

          <Form.Item
            style={{fontWeight: 600}}
            label='Назва'
            name='name'
            rules={[
              {
                required: true,
                message: 'Please enter the name of the transaction',
              },
            ]}
          >
            <Input type='text' />
          </Form.Item>

          <Form.Item
            style={{fontWeight: 600}}
            label='Дата'
            name='date'
            rules={[
              {required: true, message: 'Please select the income date!'},
            ]}
            initialValue={dayjs(new Date())}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            style={{fontWeight: 600}}
            label='Коментар'
            name='comments'
            rules={[
              {
                required: false,
                message: 'Please enter the comments for the transaction',
              },
            ]}
          >
            <Input type='text' />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' className='btn reset-balance-btn'>
              Додати дохід
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddIncome
