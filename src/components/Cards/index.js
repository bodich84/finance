import './styles.css'
import {useState} from 'react'
import {useTransactions} from '../../context/TransactionsContext'
import {toast} from 'react-toastify'
import AddIncome from '../Modals/AddIncome'
import AddExpense from '../Modals/AddExpense'
import AddTransfer from '../Modals/AddTransfer'

const Cards = () => {
  const {addTransaction} = useTransactions()

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false)
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false)
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false)

  const showExpenseModal = () => setIsExpenseModalVisible(true)
  const showIncomeModal = () => setIsIncomeModalVisible(true)
  const showTransferModal = () => setIsTransferModalVisible(true)

  const handleExpenseCancel = () => setIsExpenseModalVisible(false)
  const handleIncomeCancel = () => setIsIncomeModalVisible(false)
  const handleTransferCancel = () => setIsTransferModalVisible(false)

  const onFinish = (values, type) => {
    if (!values.date) {
      toast.error('Дата не вибрана')
      return
    }
    const newTransaction = {
      type,
      date: values.date.toDate(),
      amount: parseFloat(values.amount),
      name: values.name,
      comments: values.comments || '',
      account: values.account,
    }

    addTransaction(newTransaction)
    setIsExpenseModalVisible(false)
    setIsIncomeModalVisible(false)
    setIsTransferModalVisible(false)
  }

  const handleTransfer = async (values) => {
    const {from, to, amount, date} = values

    const transferOut = {
      type: 'transfer',
      amount: -parseFloat(amount),
      account: from,
      date: date.toDate(),
      name: 'Переказ',
      comments: `Переказ на ${to}`,
    }

    const transferIn = {
      type: 'transfer',
      amount: parseFloat(amount),
      account: to,
      date: date.toDate(),
      name: 'Переказ',
      comments: `Переказ з ${from}`,
    }

    await Promise.all([addTransaction(transferOut), addTransaction(transferIn)])
    toast.success('Переказ виконано')
    setIsTransferModalVisible(false)
  }

  return (
    <div>
      <div className='container'>
        <button className='btn reset-balance-btn' onClick={showIncomeModal}>
          Дохід
        </button>

        <button className='btn reset-balance-btn' onClick={showExpenseModal}>
          Витрати
        </button>


          <button className='btn reset-balance-btn' onClick={showTransferModal}>
            Переказ
          </button>


        <AddExpense
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />

        <AddIncome
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />

        <AddTransfer
          isTransferModalVisible={isTransferModalVisible}
          handleTransferCancel={handleTransferCancel}
          onTransfer={handleTransfer}
        />
      </div>
    </div>
  )
}

export default Cards
