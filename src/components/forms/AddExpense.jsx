import {Button, Modal, Form, Input, DatePicker} from 'antd'
import {useState, useEffect} from 'react'
import AccountSelect from './AccountSelect'
import ExpenseCategorySelect from './ExpenseCategorySelect'
import dayjs from 'dayjs'

const toDayjs = (value) => {
  if (!value) return dayjs()
  return typeof value?.toDate === 'function' ? dayjs(value.toDate()) : dayjs(value)
}

const AddExpense = ({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
  initialValues,
}) => {
  const [form] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    if (initialValues) {
      setSelectedCategory(initialValues.name)
      form.setFieldsValue({
        amount: initialValues.amount,
        account: initialValues.account,
        date: toDayjs(initialValues.date),
        comments: initialValues.comments,
      })
    } else if (isExpenseModalVisible) {
      form.resetFields()
      form.setFieldsValue({date: dayjs()})
      setSelectedCategory(null)
    }
  }, [initialValues, isExpenseModalVisible, form])

  const isEdit = !!initialValues

  return (
    <Modal
      style={{fontWeight: 600}}
      title={isEdit ? 'Редагувати витрату' : 'Додати витрати'}
      open={isExpenseModalVisible}
      onCancel={() => {
        handleExpenseCancel()
        form.resetFields()
        setSelectedCategory(null)
      }}
      footer={null}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={async (values) => {
          if (!selectedCategory) {
            form.setFields([
              {name: 'category', errors: ['Виберіть або додайте категорію']},
            ])
            return
          }
          await onFinish({...values, name: selectedCategory}, 'expense')
          form.resetFields()
          form.setFieldsValue({date: dayjs()})
          setSelectedCategory(null)
        }}
      >
        <Form.Item
          style={{fontWeight: 600, maxWidth: '50%'}}
          label='Сума'
          name='amount'
          rules={[{required: true, message: 'Please enter the expense amount'}]}
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
          <AccountSelect />
        </Form.Item>

        <Form.Item
          label='Категорія витрат'
          required
          name='name'
          validateStatus={selectedCategory ? '' : 'error'}
          help={selectedCategory ? '' : 'Виберіть або додайте категорію'}
        >
          <ExpenseCategorySelect
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </Form.Item>

        <Form.Item
          style={{fontWeight: 600}}
          label='Дата'
          name='date'
          rules={[{required: true, message: 'Please select the expense date'}]}
        >
          <DatePicker
            showTime
            format='DD.MM.YYYY HH:mm'
            style={{width: '100%'}}
          />
        </Form.Item>

        <Form.Item style={{fontWeight: 600}} label='Коментар' name='comments'>
          <Input type='text' />
        </Form.Item>

        <Form.Item>
          <Button htmlType='submit' className='btn reset-balance-btn'>
            {isEdit ? 'Зберегти' : 'Додати витрату'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddExpense
