import React, { useState, useEffect } from 'react';
import { formatCurrency, getCategoryColor } from '../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/**
 * ExpenseSummary Component
 * Displays expense summary grouped by category with charts
 */
const ExpenseSummary = ({
  summary = [],
  grandTotal = 0,
  isLoading = false,
  chartType = 'bar'
}) => {
  const [displayData, setDisplayData] = useState([]);
  const [colors, setColors] = useState([]);

  // Prepare data for charts
  useEffect(() => {
    if (summary && summary.length > 0) {
      const data = summary.map((item) => ({
        category: item.category,
        total: parseFloat(item.total)
      }));

      setDisplayData(data);

      // Generate deterministic colors per category
      const categoryColors = data.map((item) =>
        getCategoryColor(item.category)
      );
      setColors(categoryColors);
    }
  }, [summary]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grand Total Card */}
      <div className="bg-gradient-to-r from-fuchsia-pink-600 to-fuchsia-pink-800 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Total Expenses</h2>
        <p className="text-4xl font-bold">{formatCurrency(grandTotal)}</p>
        <p className="text-fuchsia-pink-200 text-sm mt-2">
          {displayData.length} categories tracked
        </p>
      </div>

      {/* Category Breakdown Card */}
      <div className="bg-slate-900 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-fuchsia-pink-400">
          Expense by Category
        </h3>

        {displayData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No expense data to display</p>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="mb-6 h-80">
              {chartType === 'pie' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) =>
                        `${entry.category}: ${formatCurrency(entry.total)}`
                      }
                      outerRadius={120}
                      dataKey="total"
                    >
                      {displayData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb'
                      }}
                    />

                    <Legend
                      iconType="none"
                      formatter={(value) => (
                        <span
                          style={{
                            color: '#e084ee',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        >
                          {value}
                        </span>
                      )}
                    />

                    {/* ✅ UPDATED BAR WITH CATEGORY COLORS */}
                    <Bar
                      dataKey="total"
                      radius={[8, 8, 0, 0]}
                      isAnimationActive
                      animationDuration={600}
                    >
                      {displayData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayData.map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className="font-semibold text-gray-700">
                      {item.category}
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Percentage Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-fuchsia-pink-400 mb-3">
                Percentage Breakdown
              </h4>

              <div className="space-y-2">
                {displayData.map((item, index) => {
                  const percentage =
                    grandTotal > 0
                      ? ((item.total / grandTotal) * 100).toFixed(1)
                      : 0;

                  return (
                    <div
                      key={item.category}
                      className="flex items-center"
                    >
                      <span className="w-32 text-sm font-medium text-fuchsia-pink-400">
                        {item.category}
                      </span>

                      <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: colors[index]
                          }}
                        />
                      </div>

                      <span className="text-sm font-semibold text-fuchsia-pink-400 w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummary;
