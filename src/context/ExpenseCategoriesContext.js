import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const ExpenseCategoriesContext = createContext();
export const useExpenseCategories = () => useContext(ExpenseCategoriesContext);

export const ExpenseCategoriesProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const unsubRef = useRef(null);

  // ✅ шлях у воркспейсі (спільні категорії)
  const catsRef = collection(db, "workspaces", "mainWorkspace", "expenseCategories");

  const addExpenseCategory = async (category) => {
    if (!user) return;
    // category: { name: 'Food', color: '#...' } тощо
    await addDoc(catsRef, {
      ...category,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    });
  };

  useEffect(() => {
    // без користувача — не підписуємось
    if (!user) return;

    const q = query(catsRef, orderBy("createdAt", "asc"));
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setExpenseCategories(list);
      },
      (err) => {
        console.error("expenseCategories onSnapshot:", err.code, err.message);
      }
    );

    return () => unsubRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <ExpenseCategoriesContext.Provider value={{ expenseCategories, addExpenseCategory }}>
      {children}
    </ExpenseCategoriesContext.Provider>
  );
};
