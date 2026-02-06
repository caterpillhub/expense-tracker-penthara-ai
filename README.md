# Expense Tracker App 💸

A simple full-stack **Expense Tracker** application that helps users record, categorize, and visualize their daily expenses.  
The app supports adding, editing, deleting expenses and provides **category-wise summaries** using charts.

This project is designed for **local development and learning purposes**, using an in-memory backend.

---

## ✨ Features

- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, etc.)
- View total expenses
- Category-wise expense summary (Bar & Pie charts)
- Clean dark-themed UI
- Responsive design
- REST API backend

---

## 🛠 Tech Stack

### Frontend
- **React.js**
- **Recharts** (Charts)
- **Tailwind CSS** (Styling)
- **Axios / Fetch API** (API communication)

### Backend
- **Node.js**
- **Express.js**
- **UUID** (Unique IDs)
- **In-memory storage** (no database)

---

## 📂 Project Structure

### Frontend

```bash
frontend/
┣ 📂public
┃ ┗ 📜index.html
┣ 📂src
┃ ┣ 📂assets
┃ ┃ ┗ 📜index.css
┃ ┣ 📂components
┃ ┃ ┣ 📜CategoryFilter.js
┃ ┃ ┣ 📜ExpenseForm.js
┃ ┃ ┣ 📜ExpenseList.js
┃ ┃ ┗ 📜ExpenseSummary.js
┃ ┣ 📂pages
┃ ┣ 📂services
┃ ┃ ┗ 📜ExpenseService.js
┃ ┣ 📂utils
┃ ┃ ┗ 📜helpers.js
┃ ┣ 📜App.js
┃ ┗ 📜index.js
┣ 📜package.json
┣ 📜tailwind.config.js
┗ 📜README.md
```

### Backend

```bash
backend/
┣ 📜server.js
┣ 📜package.json
┗ 📜README.md
```

---

## 🚀 Running the App Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/caterpillhub/expense-tracker-penthara-ai
cd expense-tracker
```

### 2️⃣ Start the Backend Server

```bash
cd backend
npm install
node server.js
```

Backend will run at:
http://localhost:5000

Health check:
http://localhost:5000/api/health

### 3️⃣ Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will run at:
http://localhost:3000