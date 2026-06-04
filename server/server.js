require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'expenses.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// Load expenses from JSON file
async function loadExpenses() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading expenses:', err);
    return [];
  }
}

// Save expenses to JSON file
async function saveExpenses(expenses) {
  try {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2));
  } catch (err) {
    console.error('Error saving expenses:', err);
  }
}

// Routes

// GET all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await loadExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET single expense by ID
app.get('/api/expenses/:id', async (req, res) => {
  try {
    const expenses = await loadExpenses();
    const expense = expenses.find((e) => e.id === req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// POST - Create a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Category is required.' });
    }
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Valid date is required.' });
    }

    // Check date is not in the future
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (expenseDate > today) {
      return res.status(400).json({ error: 'Date cannot be in the future.' });
    }

    const expenses = await loadExpenses();
    const newExpense = {
      id: Date.now().toString(),
      amount,
      category,
      date,
      note: note || '',
      createdAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    await saveExpenses(expenses);

    res.status(201).json(newExpense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// PUT - Update an expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Validation
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
      }
    }
    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ error: 'Invalid category.' });
    }
    if (date !== undefined) {
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({ error: 'Invalid date.' });
      }
      const expenseDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (expenseDate > today) {
        return res.status(400).json({ error: 'Date cannot be in the future.' });
      }
    }

    const expenses = await loadExpenses();
    const index = expenses.findIndex((e) => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updatedExpense = {
      ...expenses[index],
      ...(amount !== undefined && { amount }),
      ...(category !== undefined && { category }),
      ...(date !== undefined && { date }),
      ...(note !== undefined && { note }),
      updatedAt: new Date().toISOString(),
    };

    expenses[index] = updatedExpense;
    await saveExpenses(expenses);

    res.json(updatedExpense);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE an expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const expenses = await loadExpenses();
    const index = expenses.findIndex((e) => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const deletedExpense = expenses.splice(index, 1)[0];
    await saveExpenses(expenses);

    res.json({ message: 'Expense deleted', expense: deletedExpense });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// GET summary statistics
app.get('/api/summary', async (req, res) => {
  try {
    const expenses = await loadExpenses();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter expenses from current month
    const currentMonthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Calculate totals
    const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Total per category
    const byCategory = {};
    expenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    // Highest single expense
    const highestExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;

    res.json({
      totalThisMonth,
      byCategory,
      highestExpense,
      totalExpenses: expenses.length,
    });
  } catch (err) {
    console.error('Error calculating summary:', err);
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Expense Tracker Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});
