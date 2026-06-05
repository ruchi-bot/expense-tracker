import React, { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import FilterPanel from './FilterPanel';
import SummaryPanel from './SummaryPanel';
import { expenseAPI } from './api';
import { applyFilters } from './filterUtils';
import exportToCSV from './exportUtils';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalThisMonth: 0,
    byCategory: {},
    highestExpense: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: null,
    dateRange: 'all',
    customStart: '',
    customEnd: '',
  });

  // Fetch expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Apply filters whenever expenses or filters change
  useEffect(() => {
    const filtered = applyFilters(expenses, filters);
    setFilteredExpenses(filtered);
  }, [expenses, filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseAPI.getExpenses();
      setExpenses(data);
    } catch (err) {
      setError('Failed to fetch expenses. Please check if the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await expenseAPI.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [expenses]);

  const handleAddExpense = async (expenseData) => {
    try {
      await expenseAPI.createExpense(expenseData);
      fetchExpenses();
      // Show success message
      alert('Expense added successfully!');
    } catch (err) {
      alert('Failed to add expense. Please try again.');
      console.error(err);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsEditing(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateExpense = async (expenseData) => {
    if (!editingExpense) return;

    try {
      await expenseAPI.updateExpense(editingExpense.id, expenseData);
      fetchExpenses();
      setIsEditing(false);
      setEditingExpense(null);
      alert('Expense updated successfully!');
    } catch (err) {
      alert('Failed to update expense. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseAPI.deleteExpense(id);
      fetchExpenses();
      alert('Expense deleted successfully!');
    } catch (err) {
      alert('Failed to delete expense. Please try again.');
      console.error(err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingExpense(null);
  };

  const handleExportCSV = () => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    exportToCSV(filteredExpenses, `expenses-${dateString}.csv`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Expense Tracker</h1>
          <p className="header-subtitle">Track your spending across categories</p>
        </div>
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <div className="container">
          <div className="layout">
            <div className="left-column">
              {isEditing ? (
                <div className="edit-form-container">
                  <ExpenseForm
                    onSubmit={handleUpdateExpense}
                    initialData={editingExpense}
                    isEditing={true}
                  />
                  <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                    Cancel Editing
                  </button>
                </div>
              ) : (
                <ExpenseForm onSubmit={handleAddExpense} />
              )}

              <FilterPanel onFilterChange={handleFilterChange} />
            </div>

            <div className="right-column">
              <SummaryPanel summary={summary} loading={loading} />
            </div>
          </div>

          <div className="export-section">
            <button className="btn-export" onClick={handleExportCSV}>
              📥 Export as CSV
            </button>
            <span className="export-info">
              ({filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''})
            </span>
          </div>

          <ExpenseTable
            expenses={filteredExpenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            loading={loading}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Expense Tracker. Built with React & Express.</p>
      </footer>
    </div>
  );
}

export default App;
