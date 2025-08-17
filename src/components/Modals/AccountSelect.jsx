import React, { useState } from 'react'
import { Select, Input, Button, message } from 'antd'
import { useAccounts } from '../../context/AccountsContext'

const { Option } = Select

const AccountSelect = ({ value, onChange }) => {
  const { accounts, addAccount } = useAccounts()
  const [newAccount, setNewAccount] = useState('')
  const [adding, setAdding] = useState(false)

  const onAddAccount = async () => {
    const trimmed = newAccount.trim()
    if (!trimmed) {
      message.error('Введіть назву рахунку')
      return
    }
    setAdding(true)
    try {
      await addAccount({ name: trimmed })
      onChange(trimmed) // Автоматично обираємо новий рахунок
      setNewAccount('')
      message.success('Рахунок додано')
    } catch {
      message.error('Помилка додавання рахунку')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Select
      showSearch
      placeholder='Оберіть або додайте рахунок'
      value={value}
      onChange={onChange}
      dropdownRender={(menu) => (
        <>
          {menu}
          <div style={{ display: 'flex', padding: 8 }}>
            <Input
              style={{ flex: 'auto' }}
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              onPressEnter={onAddAccount}
              placeholder='Новий рахунок'
            />
            <Button type='link' loading={adding} onClick={onAddAccount}>
              Додати
            </Button>
          </div>
        </>
      )}
      filterOption={(input, option) =>
        option?.children?.toString().toLowerCase().includes(input.toLowerCase())
      }
    >
      {accounts.map((acc) => (
        <Option key={acc.id} value={acc.name}>
          {acc.name}
        </Option>
      ))}
    </Select>
  )
}

export default AccountSelect
