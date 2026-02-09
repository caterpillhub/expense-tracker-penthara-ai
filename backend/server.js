const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   Middleware
========================= */

// Enable CORS (safe for frontend hosting)
app.use(
  cors({
    origin: '*', // You can restrict this later to your Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   In-memory Data Store
========================= */

let expenses = [];

let categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
];

/* =========================
   Routes
========================= */

/**
 * GET /api/expenses
 * Optional query: ?category=
 */
app.get('/api/expenses', (req, res) => {
  try {
    const { category } = req.query;

    let filteredExpenses = expenses;

    if (category && category !== 'All') {
      filteredExpenses = expenses.filter(
        (expense) =>
          expense.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: filteredExpenses,
      count: filteredExpenses.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/expenses/summary
 */
app.get('/api/expenses/summary', (req, res) => {
  try {
    const summary = expenses.reduce((acc, expense) => {
      acc[expense.category] =
        (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const summaryArray = Object.entries(summary).map(
      ([category, total]) => ({
        category,
        total,
      })
    );

    const grandTotal = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    res.json({
      success: true,
      data: summaryArray,
      grandTotal,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/expenses
 */
app.post('/api/expenses', (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({
        success: false,
        error: 'Amount, category, and date are required',
      });
    }

    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category,
      date,
      description: description || '',
    };

    expenses.push(newExpense);

    res.status(201).json({
      success: true,
      data: newExpense,
      message: 'Expense added successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/expenses/:id
 */
app.put('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, description } = req.body;

    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    expenses[index] = {
      ...expenses[index],
      amount:
        amount !== undefined
          ? parseFloat(amount)
          : expenses[index].amount,
      category: category || expenses[index].category,
      date: date || expenses[index].date,
      description:
        description !== undefined
          ? description
          : expenses[index].description,
    };

    res.json({
      success: true,
      data: expenses[index],
      message: 'Expense updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/expenses/:id
 */
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;

    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    const deleted = expenses.splice(index, 1)[0];

    res.json({
      success: true,
      data: deleted,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/categories
 */
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories,
  });
});

/**
 * POST /api/categories
 */
app.post('/api/categories', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required',
      });
    }

    const categoryName = name.trim();

    if (
      categories.some(
        (c) => c.toLowerCase() === categoryName.toLowerCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists',
      });
    }

    categories.push(categoryName);

    res.status(201).json({
      success: true,
      data: categoryName,
      message: 'Category created successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
  });
});

/* =========================
   Error Handling
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

/* =========================
   Server Start
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
