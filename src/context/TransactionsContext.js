import {createContext, useContext, useState, useEffect} from 'react'
import {auth, db, doc} from '../firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import {toast} from 'react-toastify'

const TransactionsContext = createContext()
export const useTransactions = () => useContext(TransactionsContext)

export const TransactionsProvider = ({children}) => {
  const [user] = useAuthState(auth)
  const [transactions, setTransactions] = useState([])
  const [dateRange, setDateRange] = useState([])

  const fetchTransactions = async () => {
    if (!user) return

    let dataRef = collection(db, `users/${user.uid}/transactions`)

    if (dateRange.length === 2) {
      const [start, end] = dateRange
      const startTimestamp = Timestamp.fromDate(
        new Date(start.startOf('day').toISOString())
      )
      const endTimestamp = Timestamp.fromDate(
        new Date(end.endOf('day').toISOString())
      )

      dataRef = query(
        collection(db, `users/${user.uid}/transactions`),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
      )
    } else {
      dataRef = query(
        collection(db, `users/${user.uid}/transactions`),
        orderBy('date', 'desc')
      )
    }

    const querySnapshot = await getDocs(dataRef)
    const transactionArray = []
    querySnapshot.forEach((doc) =>
      transactionArray.push({...doc.data(), id: doc.id})
    )
    setTransactions(transactionArray)
    toast.success('Transactions fetched!')
  }

  const addTransaction = async (transaction) => {
    try {
      const formattedTransaction = {
        ...transaction,
        date: Timestamp.fromDate(new Date(transaction.date)),
      }
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        formattedTransaction
      )
      toast.success('Transaction Added!')
      fetchTransactions()
    } catch (err) {
      console.error('Add transaction error:', err)
      toast.error("Couldn't add transaction")
    }
  }

  const deleteTransaction = async (id) => {
  if (!user) return;
  try {
    await deleteDoc(doc(db, `users/${user.uid}/transactions`, id));
    // оптимістично прибираємо з локального стейту
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success('Транзакцію видалено');
  } catch (e) {
    console.error('Delete error:', e);
    toast.error('Не вдалося видалити транзакцію');
  }
};

  const updateTransaction = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) throw new Error('Failed to update transaction')

      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? {...t, ...updatedData} : t))
      )
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user, dateRange])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        dateRange,
        setDateRange,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
