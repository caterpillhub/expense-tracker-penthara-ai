const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * In-memory storage for expenses and categories
 * In a production app, this would be a database
 */
let expenses = [];

let categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping'];

/**
 * GET /api/expenses
 * Retrieves all expenses, optionally filtered by category
 * @query {string} category - Optional category filter
 */
app.get('/api/expenses', (req, res) => {
  const { category } = req.query;

  try {
    let filteredExpenses = expenses;

    if (category && category !== 'All') {
      filteredExpenses = expenses.filter(
        (expense) => expense.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: filteredExpenses,
      count: filteredExpenses.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/expenses/summary
 * Retrieves expense summary grouped by category
 */
app.get('/api/expenses/summary', (req, res) => {
  try {
    const summary = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {});

    const summaryArray = Object.entries(summary).map(([category, total]) => ({
      category,
      total
    }));

    res.json({
      success: true,
      data: summaryArray,
      grandTotal: expenses.reduce((sum, expense) => sum + expense.amount, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/expenses
 * Creates a new expense
 * @body {Object} expense - The expense object with amount, category, date, description
 */
app.post('/api/expenses', (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    // Validation
    if (!amount || !category || !date) {
      return res.status(400).json({
        success: false,
        error: 'Amount, category, and date are required'
      });
    }

    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category,
      date,
      description: description || ''
    };

    expenses.push(newExpense);

    res.status(201).json({
      success: true,
      data: newExpense,
      message: 'Expense added successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/expenses/:id
 * Updates an existing expense
 * @param {string} id - The expense ID
 * @body {Object} expense - The updated expense object
 */
app.put('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, description } = req.body;

    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    if (expenseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      amount: amount !== undefined ? parseFloat(amount) : expenses[expenseIndex].amount,
      category: category || expenses[expenseIndex].category,
      date: date || expenses[expenseIndex].date,
      description: description !== undefined ? description : expenses[expenseIndex].description
    };

    res.json({
      success: true,
      data: expenses[expenseIndex],
      message: 'Expense updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/expenses/:id
 * Deletes an expense
 * @param {string} id - The expense ID
 */
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;

    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    if (expenseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    const deletedExpense = expenses.splice(expenseIndex, 1);

    res.json({
      success: true,
      data: deletedExpense[0],
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/categories
 * Retrieves all available categories
 */
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});
/**
 * POST /api/categories
 * Creates a new category
 * @body {Object} category - The category object with name
 */
app.post('/api/categories', (req, res) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }

    const categoryName = name.trim();

    // Check if category already exists
    if (categories.some(cat => cat.toLowerCase() === categoryName.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists'
      });
    }

    // Add new category
    categories.push(categoryName);

    res.status(201).json({
      success: true,
      data: categoryName,
      message: 'Category created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
