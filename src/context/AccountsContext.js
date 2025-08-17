import {createContext, useContext, useEffect, useRef, useState} from 'react'
import {auth, db} from '../firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import {toast} from 'react-toastify'

const AccountsContext = createContext(null)
export const useAccounts = () => useContext(AccountsContext)

export const AccountsProvider = ({children}) => {
  const [user] = useAuthState(auth)
  const [accounts, setAccounts] = useState([])
  const unsubRef = useRef(null)

  const accountsRef = collection(db, 'workspaces', 'mainWorkspace', 'accounts')

  const addAccount = async ({name, type = 'card', currency = 'UAH'}) => {
    if (!user) return
    if (!name?.trim()) return toast.error('Вкажіть назву рахунку')
    try {
      await addDoc(accountsRef, {
        name: name.trim(),
        type,
        currency,
        order: accounts.length,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      })
      toast.success('Рахунок додано')
    } catch (e) {
      console.error(e)
      toast.error('Не вдалося додати рахунок')
    }
  }

  useEffect(() => {
    if (!user) {
      setAccounts([])
      return
    }
    const q = query(accountsRef, orderBy('order', 'asc'))
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        setAccounts(snap.docs.map((d) => ({id: d.id, ...d.data()})))
      },
      (err) => {
        console.error('accounts onSnapshot:', err)
      }
    )
    return () => unsubRef.current?.()
    // eslint-disable-next-line
  }, [user?.uid])

  return (
    <AccountsContext.Provider value={{accounts, addAccount}}>
      {children}
    </AccountsContext.Provider>
  )
}
