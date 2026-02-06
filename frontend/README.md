# Expense Tracker Frontend

React-based frontend for the Expense Tracker application with Tailwind CSS styling.

## Features

- 📝 Add, edit, and delete expenses
- 📊 View expenses with sorting and filtering
- 🏷️ Filter expenses by category
- 📈 Visual expense summaries with charts (Bar and Pie)
- 📱 Responsive design with Tailwind CSS
- ⚡ Real-time updates

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ExpenseForm.js      # Form for adding/editing expenses
│   ├── ExpenseList.js      # Table displaying all expenses
│   ├── ExpenseSummary.js   # Summary with charts
│   └── CategoryFilter.js   # Category filter buttons
├── pages/                  # Page-level components
├── services/
│   └── ExpenseService.js   # API service calls
├── utils/
│   └── helpers.js          # Helper functions
├── assets/
│   └── index.css           # Global styles
├── App.js                  # Main app component
└── index.js                # Entry point
```

## Components

### ExpenseForm
Handles adding and editing expenses with validation.

**Props:**
- `onSubmit` (Function): Callback when form is submitted
- `initialData` (Object): Initial data for editing
- `isLoading` (Boolean): Loading state indicator

### ExpenseList
Displays expenses in a table with edit/delete actions.

**Props:**
- `expenses` (Array): Array of expense objects
- `onEdit` (Function): Edit callback
- `onDelete` (Function): Delete callback
- `isLoading` (Boolean): Loading state

### ExpenseSummary
Shows expense summary with charts and breakdown.

**Props:**
- `summary` (Array): Array of {category, total} objects
- `grandTotal` (Number): Total amount
- `isLoading` (Boolean): Loading state
- `chartType` (String): 'bar' or 'pie'

### CategoryFilter
Filter buttons for expense categories.

**Props:**
- `onFilterChange` (Function): Filter change callback
- `selectedCategory` (String): Currently selected category
- `isLoading` (Boolean): Loading state

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`.

### Available Endpoints

- `GET /expenses` - Get all expenses
- `POST /expenses` - Create expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /expenses/summary` - Get summary by category
- `GET /categories` - Get all categories
