import React, { useState } from 'react';
import './ExpenseForm.css';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const ExpenseForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState(
    initialData || {
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      note: '',
    }
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          className={errors.amount ? 'error' : ''}
        />
        {errors.amount && <span className="error-text">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? 'error' : ''}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-text">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={errors.date ? 'error' : ''}
        />
        {errors.date && <span className="error-text">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="note">Note (Optional)</label>
        <input
          type="text"
          id="note"
          name="note"
          placeholder="Add a note..."
          value={formData.note}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn-primary">
        {isEditing ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
