import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import './SummaryPanel.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SummaryPanel = ({ summary, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="summary-loading">Loading summary...</div>;
  }

  // Prepare data for pie chart
  const chartData = Object.entries(summary.byCategory || {}).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="summary-panel">
      <h2>Summary</h2>

      <div className="summary-stats">
        <div className="stat-card">
          <h3>This Month</h3>
          <p className="stat-amount">{formatCurrency(summary.totalThisMonth || 0)}</p>
        </div>

        <div className="stat-card">
          <h3>Highest Single Expense</h3>
          <p className="stat-amount">{formatCurrency(summary.highestExpense || 0)}</p>
        </div>

        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-amount">{summary.totalExpenses || 0}</p>
        </div>
      </div>

      <div className="summary-by-category">
        <h3>Expenses by Category</h3>
        {chartData.length > 0 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-category-data">No expenses yet</p>
        )}

        <div className="category-breakdown">
          {Object.entries(summary.byCategory || {}).map(([category, amount]) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <span className="category-total">{formatCurrency(amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
