import React from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';

/**
 * ExpenseList Component
 * Displays a list of expenses with edit and delete functionality
 * 
 * @param {Object} props - Component props
 * @param {Array} props.expenses - Array of expense objects
 * @param {Function} props.onEdit - Callback for editing an expense
 * @param {Function} props.onDelete - Callback for deleting an expense
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {string} props.emptyMessage - Message to show when list is empty
 */
const ExpenseList = ({
  expenses = [],
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'No expenses found'
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-fuchsia-pink-400">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-fuchsia-pink-400">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-fuchsia-pink-400">Description</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-fuchsia-pink-400">Amount</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-fuchsia-pink-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-slate-700 hover:bg-slate-800 transition duration-200"
              >
                <td className="px-6 py-4 text-sm text-gray-300">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block bg-fuchsia-pink-900 text-fuchsia-pink-200 px-3 py-1 rounded-full text-xs font-semibold border border-fuchsia-pink-600">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {expense.description || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-fuchsia-pink-400">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-fuchsia-pink-400 hover:text-fuchsia-pink-300 font-semibold mr-3 transition duration-200"
                    title="Edit expense"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this expense?')) {
                        onDelete(expense.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-400 font-semibold transition duration-200"
                    title="Delete expense"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
