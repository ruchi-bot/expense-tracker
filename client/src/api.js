import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseAPI = {
  // Get all expenses
  getExpenses: async () => {
    try {
      const response = await apiClient.get('/api/expenses');
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Get single expense
  getExpense: async (id) => {
    try {
      const response = await apiClient.get(`/api/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  // Create new expense
  createExpense: async (expense) => {
    try {
      const response = await apiClient.post('/api/expenses', expense);
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Update expense
  updateExpense: async (id, expense) => {
    try {
      const response = await apiClient.put(`/api/expenses/${id}`, expense);
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Delete expense
  deleteExpense: async (id) => {
    try {
      const response = await apiClient.delete(`/api/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  // Get summary
  getSummary: async () => {
    try {
      const response = await apiClient.get('/api/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching summary:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Error health check:', error);
      throw error;
    }
  },
};

export default apiClient;
