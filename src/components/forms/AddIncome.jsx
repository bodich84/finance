import {Button, Modal, Form, Input, DatePicker} from 'antd'
import AccountSelect from './AccountSelect'
import FinModelSelect from './FinModelSelect'
import dayjs from 'dayjs'
import {useEffect} from 'react'

const toDayjs = (value) => {
  if (!value) return dayjs()
  return typeof value?.toDate === 'function' ? dayjs(value.toDate()) : dayjs(value)
}

const AddIncome = ({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
  initialValues,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        amount: initialValues.amount,
        account: initialValues.account,
        name: initialValues.name,
        finmodel: initialValues.finmodel,
        date: toDayjs(initialValues.date),
        comments: initialValues.comments,
      })
    } else if (isIncomeModalVisible) {
      form.resetFields()
      form.setFieldsValue({date: dayjs()})
    }
  }, [initialValues, isIncomeModalVisible, form])

  const isEdit = !!initialValues

  return (
    <div>
      <Modal
        title={isEdit ? 'Редагувати дохід' : 'Додати дохід'}
        open={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={async (values) => {
            await onFinish(values, 'income')
            form.resetFields()
            form.setFieldsValue({date: dayjs()})
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
            label='Finmodel'
            name='finmodel'
            rules={[{required: true, message: 'Оберіть фінмодель'}]}
          >
            <FinModelSelect />
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
            <AccountSelect />
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
          >
            <DatePicker
              showTime
              format='DD.MM.YYYY HH:mm'
              style={{width: '100%'}}
            />
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
              {isEdit ? 'Зберегти' : 'Додати дохід'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddIncome
