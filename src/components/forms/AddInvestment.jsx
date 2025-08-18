import {Button, Modal, Form, Input, DatePicker} from 'antd'
import AccountSelect from './AccountSelect'
import dayjs from 'dayjs'
import {useEffect} from 'react'

const toDayjs = (value) => {
  if (!value) return dayjs()
  return typeof value?.toDate === 'function' ? dayjs(value.toDate()) : dayjs(value)
}

const AddInvestment = ({
  isInvestmentModalVisible,
  handleInvestmentCancel,
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
        date: toDayjs(initialValues.date),
        comments: initialValues.comments,
      })
    } else if (isInvestmentModalVisible) {
      form.resetFields()
      form.setFieldsValue({date: dayjs()})
    }
  }, [initialValues, isInvestmentModalVisible, form])

  const isEdit = !!initialValues

  return (
    <Modal
      title={isEdit ? 'Редагувати інвестицію' : 'Додати інвестицію'}
      open={isInvestmentModalVisible}
      onCancel={handleInvestmentCancel}
      footer={null}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={async (values) => {
          await onFinish(values, 'investment')
          form.resetFields()
          form.setFieldsValue({date: dayjs()})
        }}
      >
        <Form.Item
          style={{fontWeight: 600, maxWidth: '50%'}}
          label='Сума'
          name='amount'
          rules={[{required: true, message: 'Вкажіть суму інвестиції'}]}
        >
          <Input type='number' inputMode='decimal' addonBefore='₴' />
        </Form.Item>

        <Form.Item
          style={{fontWeight: 600}}
          label='Рахунок'
          name='account'
          rules={[
            {required: true, message: "Вкажіть рахунок для транзакції"},
          ]}
        >
          <AccountSelect />
        </Form.Item>

        <Form.Item
          style={{fontWeight: 600}}
          label='Назва'
          name='name'
          rules={[{required: true, message: 'Вкажіть назву транзакції'}]}
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item
          style={{fontWeight: 600}}
          label='Дата'
          name='date'
          rules={[{required: true, message: 'Виберіть дату'}]}
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
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item>
          <Button htmlType='submit' className='btn reset-balance-btn'>
            {isEdit ? 'Зберегти' : 'Додати інвестицію'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddInvestment
