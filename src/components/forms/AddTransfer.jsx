import {Modal, Form, InputNumber, Button, DatePicker} from 'antd'
import dayjs from 'dayjs'
import AccountSelect from './AccountSelect'

const AddTransfer = ({
  isTransferModalVisible,
  handleTransferCancel,
  onTransfer,
}) => {
  const [form] = Form.useForm()

  const normalizeDate = (val) => {
    if (!val) return new Date()
    // dayjs → Date
    if (typeof val.toDate === 'function') return val.toDate()
    // fallback
    return new Date(val)
  }

  const onFinish = (values) => {
    const payload = {
      from: values.from,
      to: values.to,
      amount: Number(values.amount),
      date: normalizeDate(values.date),
    }
    onTransfer?.(payload) // далі у контексті робиш дві проводки з одним transferId
    form.resetFields()
    handleTransferCancel()
  }

  return (
    <Modal
      title='Переказ між рахунками'
      open={isTransferModalVisible}
      onCancel={handleTransferCancel}
      footer={null}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{date: dayjs()}}
      >
        <Form.Item
          label='Сума'
          name='amount'
          rules={[
            {required: true, message: 'Вкажіть суму переказу'},
            () => ({
              validator(_, value) {
                if (value === undefined || value === null)
                  return Promise.reject()
                const n = Number(value)
                if (Number.isNaN(n) || n <= 0) {
                  return Promise.reject(new Error('Сума має бути > 0'))
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <InputNumber
            style={{width: '100%'}}
            min={0.01}
            step={0.01}
            stringMode
            addonBefore='₴'
            placeholder='0.00'
          />
        </Form.Item>

        <Form.Item
          label='З рахунку'
          name='from'
          rules={[{required: true, message: 'Оберіть рахунок списання'}]}
        >
          <AccountSelect />
        </Form.Item>

        <Form.Item
          label='На рахунок'
          name='to'
          rules={[
            {required: true, message: 'Оберіть рахунок зарахування'},
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value) return Promise.resolve()
                if (value === getFieldValue('from')) {
                  return Promise.reject(
                    new Error('Рахунки не можуть співпадати')
                  )
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <AccountSelect />
        </Form.Item>

        <Form.Item
          label='Дата'
          name='date'
          rules={[{required: true, message: 'Оберіть дату'}]}
        >
          <DatePicker style={{width: '100%'}} />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            Здійснити переказ
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddTransfer
