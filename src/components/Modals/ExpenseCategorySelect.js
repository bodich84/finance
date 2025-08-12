import React, {useState} from 'react'
import {Select, Input, Button, message} from 'antd'
import {useExpenseCategories} from '../../context/ExpenseCategoriesContext'

const {Option} = Select

const ExpenseCategorySelect = ({value, onChange}) => {
  const {expenseCategories, addExpenseCategory} = useExpenseCategories()
  const [newCategory, setNewCategory] = useState('')
  const [adding, setAdding] = useState(false)

  const onAddCategory = async () => {
    const trimmed = newCategory.trim()
    if (!trimmed) {
      message.error('Введіть назву категорії')
      return
    }
    setAdding(true)
    try {
      await addExpenseCategory({name: trimmed})
      onChange(trimmed) // Автоматично обираємо нову категорію
      setNewCategory('')
      message.success('Категорію додано')
    } catch {
      message.error('Помилка додавання категорії')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Select
      showSearch
      placeholder='Оберіть або додайте категорію'
      value={value}
      onChange={onChange}
      dropdownRender={(menu) => (
        <>
          {menu}
          <div style={{display: 'flex', padding: 8}}>
            <Input
              style={{flex: 'auto'}}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onPressEnter={onAddCategory}
              placeholder='Нова категорія'
            />
            <Button type='link' loading={adding} onClick={onAddCategory}>
              Додати
            </Button>
          </div>
        </>
      )}
      filterOption={(input, option) =>
        option?.children?.toString().toLowerCase().includes(input.toLowerCase())
      }
    >
      {expenseCategories.map((cat) => (
        <Option key={cat.id} value={cat.name}>
          {cat.name}
        </Option>
      ))}
    </Select>
  )
}

export default ExpenseCategorySelect
