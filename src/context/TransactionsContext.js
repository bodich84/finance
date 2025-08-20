import { createContext, useContext, useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  Timestamp, query, orderBy, onSnapshot, serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-toastify";

const TransactionsContext = createContext();
export const useTransactions = () => useContext(TransactionsContext);

// ✅ уніфікація дат
const normalizeToDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate(); // Firestore.Timestamp
  if (value instanceof Date) return value;
  return new Date(value); // string/number/dayjs -> Date
};

export const TransactionsProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const unsubRef = useRef(null);

  const transactionsRef = collection(db, "workspaces", "mainWorkspace", "transactions");

  const normalizeDateToTimestamp = (value) => {
    if (value instanceof Timestamp) return value;
    const d = normalizeToDate(value) ?? new Date();
    return Timestamp.fromDate(d);
  };

  const buildRows = (list) => {
    const rows = [];
    const seen = new Set();

    const byTid = new Map();
    for (const t of list) {
      if (t?.isTransfer && t?.transferId) {
        const arr = byTid.get(t.transferId) ?? [];
        arr.push({ ...t });
        byTid.set(t.transferId, arr);
      }
    }

    for (const [tid, pair] of byTid) {
      const out = pair.find(p => p.direction === 'out');
      const inc = pair.find(p => p.direction === 'in');
      if (out && inc) {
        rows.push({
          id: tid,
          type: 'transfer',
          from: out.account,
          to: inc.account,
          amount: out.amount,
          date: out.date,
          name: `${out.account} → ${inc.account}`,
          comments: list.comments ?? '',
          _pairDocIds: [out.id, inc.id],
        });
        seen.add(out.id); seen.add(inc.id);
      }
    }

    for (const t of list) {
      if (t.isTransfer && seen.has(t.id)) continue;
      if (!t.isTransfer) {
        rows.push({
          id: t.id,
          type: t.type,
          account: t.account,
          amount: t.amount,
          date: t.date,
          comments: t.comments ?? '',
          name: t.name ?? '',
          finmodel: t.finmodel ?? '',
        });
      }
    }

    rows.sort((a, b) => {
      const ad = normalizeToDate(a.date)?.getTime() ?? 0;
      const bd = normalizeToDate(b.date)?.getTime() ?? 0;
      return bd - ad;
    });
    return rows;
  };

  const fetchTransactions = async () => {
    try {
      const q = query(transactionsRef, orderBy("date", "desc"));
      const snap = await getDocs(q);
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTransactions(arr);
      setTableRows(buildRows(arr));
      toast.success("Transactions fetched!");
    } catch (err) {
      console.error("fetchTransactions:", err.code, err.message);
      toast.error(err.code === "permission-denied" ? "Немає доступу" : "Couldn't fetch transactions");
    }
  };

  const addTransaction = async (t) => {
    try {
      if (!user) throw new Error("Not authenticated");
      await addDoc(transactionsRef, {
        ...t,
        date: normalizeDateToTimestamp(t.date ?? new Date()),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Transaction added!");
    } catch (err) {
      console.error("addTransaction:", err.code, err.message);
      toast.error(err.code === "permission-denied" ? "Немає доступу" : "Couldn't add transaction");
    }
  };

  const addTransfer = async ({ amount, from, to, date }) => {
    try {
      if (!user) throw new Error("Not authenticated");
      const transferId = (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : doc(collection(db, "_ids")).id;

      const batch = writeBatch(db);
      const dateTs = normalizeDateToTimestamp(date ?? new Date());
      const amt = Number(amount);

      const outRef = doc(collection(db, "workspaces", "mainWorkspace", "transactions"));
      const inRef  = doc(collection(db, "workspaces", "mainWorkspace", "transactions"));

      batch.set(outRef, {
        id: outRef.id,
        type: "expense",
        isTransfer: true,
        direction: "out",
        transferId,
        pairId: inRef.id,
        account: from,
        amount: amt,
        name: "Переказ",
        comments: `→ ${to}`,
        date: dateTs,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      batch.set(inRef, {
        id: inRef.id,
        type: "income",
        isTransfer: true,
        direction: "in",
        transferId,
        pairId: outRef.id,
        account: to,
        amount: amt,
        name: "Переказ",
        comments: `← ${from}`,
        date: dateTs,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      await batch.commit();
      toast.success("Transfer added!");
    } catch (err) {
      console.error("addTransfer:", err.code, err.message);
      toast.error(err.code === "permission-denied" ? "Немає доступу" : "Couldn't add transfer");
    }
  };

  const updateTransfer = async ({ pairDocIds, from, to, amount, date }) => {
    try {
      if (!user) throw new Error("Not authenticated");
      const [outId, inId] = pairDocIds || [];
      if (!outId || !inId) throw new Error("pairDocIds required");

      const batch = writeBatch(db);
      const dateTs = normalizeDateToTimestamp(date ?? new Date());
      const amt = Number(amount);

      const outRef = doc(db, "workspaces", "mainWorkspace", "transactions", outId);
      const inRef  = doc(db, "workspaces", "mainWorkspace", "transactions", inId);

      batch.update(outRef, {
        account: from,
        amount: amt,
        date: dateTs,
        comments: `→ ${to}`,
        updatedAt: serverTimestamp(),
      });

      batch.update(inRef, {
        account: to,
        amount: amt,
        date: dateTs,
        comments: `← ${from}`,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      toast.success("Transfer updated!");
    } catch (err) {
      console.error("updateTransfer:", err.code, err.message);
      toast.error(err.code === "permission-denied" ? "Немає доступу" : "Couldn't update transfer");
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      if (!user) throw new Error("Not authenticated");
      const ref = doc(db, "workspaces", "mainWorkspace", "transactions", id);
      const payload = { ...updates };
      if (payload.date) payload.date = normalizeDateToTimestamp(payload.date);
      delete payload.createdBy; delete payload.createdAt;

      await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
      toast.success("Transaction updated!");
    } catch (err) {
      console.error("updateTransaction:", err.code, err.message);
      toast.error(err.code === "permission-denied" ? "Немає доступу" : "Couldn't update transaction");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      if (!user) throw new Error("Not authenticated");
      // простий варіант: видаляємо один документ;
      // якщо у тебе реалізоване видалення за transferId — лишай попередню реалізацію.
      await deleteDoc(doc(db, "workspaces", "mainWorkspace", "transactions", id));
      toast.success("Transaction deleted!");
    } catch (err) {
      console.error("deleteTransaction:", err.code, err.message);
      toast.error(err.code === "permission-denied" ? "Немає доступу" : "Couldn't delete transaction");
    }
  };

  useEffect(() => {
    if (!user) {
      setTransactions([]); setTableRows([]);
      return;
    }
    const q = query(transactionsRef, orderBy("date", "desc"));
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTransactions(arr);
        setTableRows(buildRows(arr));
      },
      (err) => {
        console.error("onSnapshot:", err.code, err.message);
        toast.error(err.code === "permission-denied" ? "Немає доступу" : "Snapshot error");
      }
    );
    return () => unsubRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        tableRows,
        fetchTransactions,
        addTransaction,
        addTransfer,
        updateTransfer,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
