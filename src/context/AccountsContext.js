import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

const AccountsContext = createContext(null);
export const useAccounts = () => useContext(AccountsContext);

export const AccountsProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [accounts, setAccounts] = useState([]);
  const unsubRef = useRef(null);

  const accountsRef = collection(db, 'workspaces', 'mainWorkspace', 'accounts');

  const addAccount = async ({ name, type = 'card', currency = 'UAH' }) => {
    if (!user) return;
    if (!name?.trim()) return toast.error('Вкажіть назву рахунку');
    try {
      await addDoc(accountsRef, {
        name: name.trim(),
        type,
        currency,
        order: accounts.length,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success('Рахунок додано');
    } catch (e) {
      console.error(e);
      toast.error('Не вдалося додати рахунок');
    }
  };

  const updateAccount = async (id, updates) => {
    if (!user) return;
    try {
      const ref = doc(db, 'workspaces', 'mainWorkspace', 'accounts', id);
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
      toast.success('Рахунок оновлено');
    } catch (e) {
      console.error(e);
      toast.error('Не вдалося оновити рахунок');
    }
  };

  const deleteAccount = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'workspaces', 'mainWorkspace', 'accounts', id));
      toast.success('Рахунок видалено');
    } catch (e) {
      console.error(e);
      toast.error('Не вдалося видалити рахунок');
    }
  };

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      return;
    }
    const q = query(accountsRef, orderBy('order', 'asc'));
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.error('accounts onSnapshot:', err);
      }
    );
    return () => unsubRef.current?.();
    // eslint-disable-next-line
  }, [user?.uid]);

  return (
    <AccountsContext.Provider value={{ accounts, addAccount, updateAccount, deleteAccount }}>
      {children}
    </AccountsContext.Provider>
  );
};

