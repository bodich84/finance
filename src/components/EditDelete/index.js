import React, { useState } from "react";
import "./styles.css";

const EditTransactionModal = ({ transaction, onSave, onCancel, onDelete }) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedTransaction);
  };

  const handleDelete = () => {
    onDelete(editedTransaction);
  };

  return (
    <div className="modal container">
      <div className="modal-content">
        <h3>Edit or Delete Transaction</h3>
        <div>
          <label>Name </label>
          <input
            type="text"
            name="name"
            value={editedTransaction.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Amount </label>
          <input
            type="number"
            name="amount"
            value={editedTransaction.amount}
            onChange={handleChange}
          />
        </div>
        {/* <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={editedTransaction.date}
            onChange={handleChange}
          />
        </div> */}
        <div className="modal-buttons">
          <button className="btn btn-blue" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-blue" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-red" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
