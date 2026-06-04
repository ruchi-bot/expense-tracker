import React from 'react';
import './ExpenseTable.css';

const ExpenseTable = ({ expenses, onEdit, onDelete, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="no-data">No expenses found. Add your first expense!</div>;
  }

  return (
    <div className="expense-table-container">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>
              <td>
                <span className={`category-badge category-${expense.category.toLowerCase()}`}>
                  {expense.category}
                </span>
              </td>
              <td className="amount">{formatCurrency(expense.amount)}</td>
              <td className="note">{expense.note || '-'}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(expense)}
                  title="Edit expense"
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this expense?')) {
                      onDelete(expense.id);
                    }
                  }}
                  title="Delete expense"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
