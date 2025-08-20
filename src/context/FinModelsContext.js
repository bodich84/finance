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

const FinModelsContext = createContext(null);
export const useFinModels = () => useContext(FinModelsContext);

export const FinModelsProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [finmodels, setFinmodels] = useState([]);
  const unsubRef = useRef(null);

  const finmodelsRef = collection(db, 'workspaces', 'mainWorkspace', 'finmodels');

  const addFinModel = async ({ name }) => {
    if (!user) return;
    if (!name?.trim()) return toast.error('Вкажіть назву фінмоделі');
    try {
      await addDoc(finmodelsRef, {
        name: name.trim(),
        order: finmodels.length,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success('Фінмодель додано');
    } catch (e) {
      console.error(e);
      toast.error('Не вдалося додати фінмодель');
    }
  };

  const updateFinModel = async (id, updates) => {
    if (!user) return;
    try {
      const ref = doc(db, 'workspaces', 'mainWorkspace', 'finmodels', id);
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
      toast.success('Фінмодель оновлено');
    } catch (e) {
      console.error(e);
      toast.error('Не вдалося оновити фінмодель');
    }
  };

  const deleteFinModel = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'workspaces', 'mainWorkspace', 'finmodels', id));
      toast.success('Фінмодель видалено');
    } catch (e) {
      console.error(e);
      toast.error('Не вдалося видалити фінмодель');
    }
  };

  useEffect(() => {
    if (!user) {
      setFinmodels([]);
      return;
    }
    const q = query(finmodelsRef, orderBy('order', 'asc'));
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        setFinmodels(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.error('finmodels onSnapshot:', err);
      }
    );
    return () => unsubRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <FinModelsContext.Provider value={{ finmodels, addFinModel, updateFinModel, deleteFinModel }}>
      {children}
    </FinModelsContext.Provider>
  );
};

