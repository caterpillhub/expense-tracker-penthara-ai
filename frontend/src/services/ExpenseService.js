/**
 * ExpenseService - Service for handling all expense-related API calls
 * 
 * This service handles communication with the backend API for:
 * - Fetching expenses
 * - Creating new expenses
 * - Updating existing expenses
 * - Deleting expenses
 * - Fetching expense summaries
 * - Fetching available categories
 */

import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all expenses, optionally filtered by category
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of expenses
 */
export const fetchExpenses = async (category = null) => {
  try {
    const url = category && category !== 'All'
      ? `${API_BASE_URL}/expenses?category=${category}`
      : `${API_BASE_URL}/expenses`;

    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

/**
 * Create a new expense
 * @param {Object} expenseData - The expense data object
 * @param {number} expenseData.amount - The expense amount
 * @param {string} expenseData.category - The expense category
 * @param {string} expenseData.date - The expense date (YYYY-MM-DD format)
 * @param {string} expenseData.description - Optional description
 * @returns {Promise<Object>} The created expense object
 */
export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/expenses`, expenseData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

/**
 * Update an existing expense
 * @param {string} id - The expense ID
 * @param {Object} expenseData - The updated expense data
 * @returns {Promise<Object>} The updated expense object
 */
export const updateExpense = async (id, expenseData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/expenses/${id}`, expenseData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

/**
 * Delete an expense
 * @param {string} id - The expense ID
 * @returns {Promise<Object>} The deleted expense object
 */
export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

/**
 * Fetch expense summary grouped by category
 * @returns {Promise<Object>} Object containing summary array and grand total
 */
export const fetchExpenseSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expense summary:', error);
    throw error;
  }
};

/**
 * Fetch all available categories
 * @returns {Promise<Array>} Array of category names
 */
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Create a new category
 * @param {string} name - The category name
 * @returns {Promise<string>} The created category name
 */
export const createCategory = async (name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, { name });
    return response.data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};
