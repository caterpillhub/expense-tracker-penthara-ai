import React, { useState, useEffect } from 'react';
import { fetchExpenses } from '../services/ExpenseService';

/**
 * CategoryFilter Component
 * Provides filtering options for expenses by category
 * Shows only categories that have expenses
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback when filter selection changes
 * @param {string} props.selectedCategory - Currently selected category
 * @param {boolean} props.isLoading - Loading state indicator
 */
const CategoryFilter = ({ onFilterChange, selectedCategory = 'All', isLoading = false }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Load categories from expenses on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchExpenses();
        // Get unique categories from expenses
        const uniqueCategories = [...new Set(data.map(expense => expense.category))].sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to load categories');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const allCategories = categories.length > 0 ? ['All', ...categories] : [];

  return (
    <div className="bg-slate-900 rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-fuchsia-pink-400 mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categoriesLoading ? (
          <p className="text-gray-400">Loading categories...</p>
        ) : allCategories.length === 0 ? (
          <p className="text-gray-400">No categories yet</p>
        ) : (
          allCategories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange(category)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                selectedCategory === category
                  ? 'bg-fuchsia-pink-600 text-white shadow-md'
                  : 'bg-slate-800 text-fuchsia-pink-300 hover:bg-slate-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {category}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
