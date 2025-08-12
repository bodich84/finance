import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const ExpenseCategoriesContext = createContext();

export const ExpenseCategoriesProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [expenseCategories, setExpenseCategories] = useState([]);

  const fetchExpenseCategories = async () => {
    if (!user) return;
    const snapshot = await getDocs(collection(db, `users/${user.uid}/expenseCategories`));
    const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setExpenseCategories(cats);
  };

  const addExpenseCategory = async (category) => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/expenseCategories`), category);
    fetchExpenseCategories();
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, [user]);

  return (
    <ExpenseCategoriesContext.Provider value={{ expenseCategories, addExpenseCategory }}>
      {children}
    </ExpenseCategoriesContext.Provider>
  );
};

export const useExpenseCategories = () => useContext(ExpenseCategoriesContext);
