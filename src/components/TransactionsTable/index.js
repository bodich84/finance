import React, {useState} from 'react'
import './styles.css'
import {Radio, Select, Table} from 'antd'
import {parse, unparse} from 'papaparse'
import {toast} from 'react-toastify'
import EditEditDeleteModal from '../EditDelete'
import {updateTransactionOnFirebase} from '../../hooks/updateTransaction'
import {deleteTransactionOnFirebase} from '../../hooks/deleteTransactionOnFirebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../../firebase'
import {AiOutlineSearch} from 'react-icons/ai'
import dayjs from 'dayjs'
import Checkbox from 'antd/es/checkbox/Checkbox'

const TransactionsTable = ({
  transactions,
  addTransaction,
  fetchTransactions,
}) => {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [user] = useAuthState(auth)

  //   define a columns for our table
  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (value) => {
        const dateObj = value?.toDate ? value.toDate() : new Date(value)
        return dayjs(dateObj).format('DD-MM-YYYY')
      },
    },
    {
      title: 'Сума',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Рахунок',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Коментарі',
      dataIndex: 'comments',
      key: 'comments',
    },
  ]

  let filterTransactionsArray = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLocaleLowerCase()) &&
      item.type.includes(typeFilter)
  )

  let sortedTransactions = filterTransactionsArray.sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(a.date) - new Date(b.date)
    } else if (sortKey === 'amount') {
      return a.amount - b.amount
    } else {
      return 0
    }
  })

  // this function for downloading our csv file or exporting a csv file
  const exportCSV = () => {
    // Specifying fields and data explicitly
    var csv = unparse({
      fields: ['name', 'type', 'tag', 'date', 'amount'],
      data: transactions,
    })
    var data = new Blob([csv], {type: 'text/csv:charsetutf-8;'})
    const csvURL = window.URL.createObjectURL(data)
    const tempLink = document.createElement('a')
    tempLink.href = csvURL
    tempLink.download = 'transactions.csv'
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
  }

  // function for import a csv file
  const importCSV = (event) => {
    event.preventDefault()
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Skip this transaction if the 'amount' is not a valid number
            if (isNaN(transaction.amount)) {
              continue
            }

            const newTransaction = {
              ...transaction,
              // Convert the 'amount' field to a number using parseFloat instead of parseInt
              amount: parseFloat(transaction.amount),
            }
            // Write each transaction to Firebase (addDoc), you can use the addTransaction function here
            await addTransaction(newTransaction, true)
          }
          toast.success('All transactions added')
          fetchTransactions()
          event.target.value = null // Reset the input field
        },
      })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction)
    setShowEditModal(true)
  }

  const handleEditSave = async (editedTransaction) => {
    // Call the function to update the transaction in Firebase
    await updateTransactionOnFirebase(user.uid, editedTransaction)
    setShowEditModal(false)
    fetchTransactions() // Fetch the updated data from Firebase
  }

  const handleDeleteSave = async (editedTransaction) => {
    // Call the function to update the transaction in Firebase
    await deleteTransactionOnFirebase(user.uid, editedTransaction)
    setShowEditModal(false)
    fetchTransactions() // Fetch the updated data from Firebase
  }

  const handleEditCancel = () => {
    setShowEditModal(false)
  }

  // приховати перекази
  // const filteredTransactions = transactions.filter(t => t.type !== "transfer");

  return (
    <div className='table-box container'>
      <h2>Транзакції</h2>
      

      {/* <div className='import-export-sort container'>
        <div className='ix-button'>
          <button className='btn  btn-purple' onClick={exportCSV}>
            Export CSV
          </button>

          <label htmlFor='file-csv' className='btn'>
            Import CSV
          </label>

          <input
            type='file'
            id='file-csv'
            accept='.csv'
            required
            onChange={importCSV}
            style={{display: 'none'}}
          />
        </div>
      </div> */}

      <div className='table-container'>
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          className='table'
          onRow={(record) => ({
            onClick: () => handleEdit(record), // Handle row click event
          })}
          rowClassName={(record) => {
            if (record.type === 'income') return 'row-income'
            if (record.type === 'expense') return 'row-expense'
            if (record.type === 'transfer') return 'row-transfer'
            return ''
          }}
        />
        {showEditModal && selectedTransaction && (
          <EditEditDeleteModal
            transaction={selectedTransaction}
            onSave={handleEditSave}
            onDelete={handleDeleteSave}
            onCancel={handleEditCancel}
          />
        )}
      </div>
    </div>
  )
}

export default TransactionsTable
