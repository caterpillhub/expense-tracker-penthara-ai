import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import CategoryFilter from './components/CategoryFilter';
import { fetchExpenses, createExpense, updateExpense, deleteExpense, fetchExpenseSummary } from './services/ExpenseService';
import './assets/index.css';

/**
 * Main App Component
 * Manages the state and orchestrates all expense tracking functionality
 */
function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Load expenses from API
   */
  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses(selectedCategory);
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  /**
   * Load expense summary from API
   */
  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchExpenseSummary();
      setSummary(data.data || []);
      setGrandTotal(data.grandTotal || 0);
    } catch (err) {
      console.error('Failed to load summary');
    }
  }, []);

  // Load expenses and summary on mount and when category changes
  useEffect(() => {
    loadExpenses();
    loadSummary();
  }, [loadExpenses, loadSummary]);

  /**
   * Handle adding or updating an expense
   * @param {Object} expenseData - The expense data
   */
  const handleSubmit = async (expenseData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (editingExpense) {
        // Update existing expense
        await updateExpense(editingExpense.id, expenseData);
        setSuccessMessage('Expense updated successfully!');
        setEditingExpense(null);
      } else {
        // Create new expense
        await createExpense(expenseData);
        setSuccessMessage('Expense added successfully!');
      }

      // Reload data
      await loadExpenses();
      await loadSummary();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(editingExpense ? 'Failed to update expense' : 'Failed to add expense');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle deleting an expense
   * @param {string} id - The expense ID
   */
  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteExpense(id);
      setSuccessMessage('Expense deleted successfully!');

      // Reload data
      await loadExpenses();
      await loadSummary();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete expense');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle editing an expense
   * @param {Object} expense - The expense to edit
   */
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle canceling edit mode
   */
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  /**
   * Handle category filter change
   * @param {string} category - The selected category
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="flex items-center justify-center pt-6 pb-3 bg-black">
        <h1 className="text-2xl font-bold text-fuchsia-pink-500">Expense Tracker</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 bg-black min-h-screen">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg animate-pulse">
            ✓ {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
            ✗ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:items-stretch min-h-96">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            {editingExpense && (
              <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg flex justify-between items-center">
                <span>Editing expense from {editingExpense.date}</span>
                <button
                  onClick={handleCancelEdit}
                  className="text-yellow-700 hover:text-yellow-900 font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            <ExpenseForm
              onSubmit={handleSubmit}
              initialData={editingExpense}
              isLoading={isLoading}
            />
          </div>
          {/* Right Column: List and Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <ExpenseSummary
              summary={summary}
              grandTotal={grandTotal}
              isLoading={isLoading}
              chartType="bar"
            />

            {/* Category Filter */}
            <CategoryFilter
              onFilterChange={handleCategoryChange}
              selectedCategory={selectedCategory}
              isLoading={isLoading}
            />

            {/* Expense List */}
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              emptyMessage={
                selectedCategory === 'All'
                  ? 'No expenses yet. Add one to get started!'
                  : `No expenses in ${selectedCategory} category`
              }
            />
          </div>
        </div>
      </main>
      
    </div>
  );
}

export default App;
