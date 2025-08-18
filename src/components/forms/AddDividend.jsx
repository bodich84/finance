import {Button, Modal, Form, Input, DatePicker} from 'antd'
import AccountSelect from './AccountSelect'
import dayjs from 'dayjs'
import {useEffect} from 'react'

const AddDividend = ({
  isDividendModalVisible,
  handleDividendCancel,
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
        date: initialValues.date ? dayjs(initialValues.date) : dayjs(),
        comments: initialValues.comments,
      })
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const isEdit = !!initialValues

  return (
    <Modal
      title={isEdit ? 'Редагувати дивіденд' : 'Додати дивіденд'}
      open={isDividendModalVisible}
      onCancel={handleDividendCancel}
      footer={null}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={async (values) => {
          await onFinish(values, 'dividend')
          form.resetFields()
        }}
      >
        <Form.Item
          style={{fontWeight: 600, maxWidth: '50%'}}
          label='Сума'
          name='amount'
          rules={[{required: true, message: 'Вкажіть суму дивіденду'}]}
        >
          <Input type='number' inputMode='decimal' addonBefore='₴' />
        </Form.Item>

        <Form.Item
          style={{fontWeight: 600}}
          label='Рахунок'
          name='account'
          rules={[
            {required: true, message: 'Вкажіть рахунок для транзакції'},
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
          initialValue={dayjs(new Date())}
        >
          <DatePicker />
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
            {isEdit ? 'Зберегти' : 'Додати дивіденд'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddDividend
