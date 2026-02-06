import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory } from '../services/ExpenseService';
import { isValidAmount, isValidDate } from '../utils/helpers';

/**
 * ExpenseForm Component
 * Handles adding and editing expenses
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Object} props.initialData - Initial expense data for editing (optional)
 * @param {boolean} props.isLoading - Loading state indicator
 */
const ExpenseForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [categories, setCategories] = useState(['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping']);
  const [errors, setErrors] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        if (data.length > 0) {
          // Filter out "Other" to keep only relevant categories
          const filteredCategories = data.filter(cat => cat !== 'Other');
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  /**
   * Handle adding a new category
   */
  const handleAddCategory = async () => {
    const trimmedInput = newCategoryInput.trim();
    if (!trimmedInput) {
      alert('Please enter a category name');
      return;
    }

    setAddingCategory(true);
    try {
      const newCategory = await createCategory(trimmedInput);
      setCategories([...categories, newCategory]);
      setFormData(prev => ({
        ...prev,
        category: newCategory
      }));
      setNewCategoryInput('');
      setShowAddCategory(false);
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to add category. Please try again.');
      }
    } finally {
      setAddingCategory(false);
    }
  };

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  /**
   * Validate form data
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || !isValidAmount(formData.amount)) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date || !isValidDate(formData.date)) {
      newErrors.date = 'Please select a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-fuchsia-pink-500">
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-fuchsia-pink-400 font-semibold mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-pink-500 bg-slate-800 text-white ${
              errors.amount ? 'border-red-500' : 'border-slate-700'
            }`}
            disabled={isLoading}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-fuchsia-pink-400 font-semibold mb-2">
            Category
          </label>
          <div className="flex gap-2">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-pink-500 bg-slate-800 ${
                formData.category === '' ? 'text-slate-500' : 'text-white'
              } ${
                errors.category ? 'border-red-500' : 'border-slate-700'
              }`}
              disabled={isLoading || categoriesLoading}
            >
              <option value="" disabled>
                Choose category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-3 py-2 bg-fuchsia-pink-600 hover:bg-fuchsia-pink-700 text-white rounded-lg font-semibold transition"
              disabled={isLoading}
              title="Add new category"
            >
              +
            </button>
          </div>
          
          {showAddCategory && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-pink-500 bg-slate-800 text-fuchsia-pink-300 border-slate-700 placeholder-slate-500"
                disabled={addingCategory}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={addingCategory || !newCategoryInput.trim()}
                className="px-3 py-2 bg-fuchsia-pink-600 hover:bg-fuchsia-pink-700 text-white rounded-lg font-semibold transition disabled:bg-gray-600"
              >
                {addingCategory ? '...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryInput('');
                }}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-fuchsia-pink-300 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          )}
          
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-fuchsia-pink-400 font-semibold mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-pink-500 bg-slate-800 text-white ${
              errors.date ? 'border-red-500' : 'border-slate-700'
            }`}
            disabled={isLoading}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-fuchsia-pink-400 font-semibold mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-pink-500 bg-slate-800 text-white border-slate-700"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full bg-fuchsia-pink-600 hover:bg-fuchsia-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
