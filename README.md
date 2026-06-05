# 💰 Expense Tracker

## Project Brief

A modern, interactive expense tracker web application that helps users log daily spending across different categories and visualize where their money is going. This is a full-stack application built with React (frontend) and Express.js (backend) that demonstrates data handling, aggregation, and a feature-rich user interface.

**Use Case**: Track daily spending across categories (Food, Transport, Bills, Entertainment, Other), view detailed reports, filter by date range and category, export data as CSV, and see visual summaries with pie charts.

---

## Live Demo Links

- **Frontend (Deployed)**:expense-tracker-5ljrmqnzc-ruchi-sainis-projects.vercel.app
- **Backend (Deployed)**: https://expense-tracker-zx0t.onrender.com


---

## Tech Stack

### Frontend
- **React 18.2**: Modern UI library with functional components and hooks
  - *Why*: Fast rendering, rich ecosystem, powerful developer tools
- **Recharts 2.5**: Chart library for data visualization
  - *Why*: Lightweight, composable charts, great for expense pie charts and analytics
- **Axios 1.4**: HTTP client for API calls
  - *Why*: Promise-based, interceptor support, better error handling than fetch
- **CSS3**: Plain CSS with CSS Modules approach
  - *Why*: No build overhead, maintainable styling, responsive design

### Backend
- **Node.js & Express 4.18**: Lightweight server framework
  - *Why*: JavaScript runtime for full-stack development, minimal dependencies
- **CORS 2.8**: Cross-Origin Resource Sharing middleware
  - *Why*: Enables frontend-backend communication across different origins
- **Dotenv 16**: Environment variable management
  - *Why*: Secure configuration, different settings for dev/production

### Storage
- **JSON File**: Persistent storage in `server/data/expenses.json`
  - *Why*: No database setup required, sufficient for single-user tracking, easy to backup

### Development Tools
- **React Scripts 5.0**: Create React App build tooling
- **Nodemon 2.0**: Development server auto-reload
- **Concurrently 8.0**: Run multiple npm scripts simultaneously

---

## How to Run Locally

### Prerequisites
- Node.js (v14 or higher) installed on your system
- npm (comes with Node.js)

### Installation & Setup

1. **Clone the repository** (or extract the project folder)
   ```bash
   cd Expense_Tracker
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install-all
   ```
   This command will:
   - Install root dependencies
   - Navigate to `/server` and install backend dependencies
   - Navigate to `/client` and install frontend dependencies

3. **Set up environment variables**

   **For Backend** - Create `.env` file in `/server` folder:
   ```bash
   cd server
   cp .env.example .env
   cd ..
   ```
   
   **For Frontend** - Create `.env.local` file in `/client` folder:
   ```bash
   cd client
   cp .env.example .env.local
   cd ..
   ```

4. **Start the development servers**

   **Option A: Run both simultaneously** (from root directory)
   ```bash
   npm run dev
   ```
   This starts:
   - Backend server on http://localhost:5000
   - Frontend on http://localhost:3000

   **Option B: Run separately**
   
   Terminal 1 - Start Backend:
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 - Start Frontend:
   ```bash
   cd client
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to: **http://localhost:3000**
   - The frontend will automatically connect to the backend at `http://localhost:5000`

### Verify Everything Works

- ✅ Backend health check: http://localhost:5000/api/health
- ✅ Get all expenses: http://localhost:5000/api/expenses
- ✅ Frontend app: http://localhost:3000
- ✅ Add an expense in the UI to verify the full flow

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
No authentication required. Single-user assumption.

### Endpoints

#### 1. **Get All Expenses**
- **Method**: `GET`
- **Path**: `/expenses`
- **Request Body**: None
- **Response** (200):
  ```json
  [
    {
      "id": "1717416000000",
      "amount": 500,
      "category": "Food",
      "date": "2024-06-02",
      "note": "Lunch at restaurant",
      "createdAt": "2024-06-02T12:00:00.000Z"
    }
  ]
  ```

#### 2. **Get Single Expense by ID**
- **Method**: `GET`
- **Path**: `/expenses/:id`
- **Path Parameters**: `id` (string) - Expense ID
- **Response** (200):
  ```json
  {
    "id": "1717416000000",
    "amount": 500,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Lunch at restaurant",
    "createdAt": "2024-06-02T12:00:00.000Z"
  }
  ```
- **Response** (404):
  ```json
  { "error": "Expense not found" }
  ```

#### 3. **Create New Expense**
- **Method**: `POST`
- **Path**: `/expenses`
- **Request Body**:
  ```json
  {
    "amount": 500,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Lunch at restaurant" // optional
  }
  ```
- **Validation**:
  - `amount`: Must be positive number
  - `category`: Required, one of: Food, Transport, Bills, Entertainment, Other
  - `date`: Valid date, cannot be in future
  - `note`: Optional string
- **Response** (201):
  ```json
  {
    "id": "1717416000000",
    "amount": 500,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Lunch at restaurant",
    "createdAt": "2024-06-02T12:00:00.000Z"
  }
  ```
- **Response** (400):
  ```json
  { "error": "Invalid amount. Must be a positive number." }
  ```

#### 4. **Update Expense**
- **Method**: `PUT`
- **Path**: `/expenses/:id`
- **Path Parameters**: `id` (string) - Expense ID
- **Request Body** (all fields optional):
  ```json
  {
    "amount": 600,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Updated note"
  }
  ```
- **Response** (200):
  ```json
  {
    "id": "1717416000000",
    "amount": 600,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Updated note",
    "createdAt": "2024-06-02T12:00:00.000Z",
    "updatedAt": "2024-06-02T13:00:00.000Z"
  }
  ```
- **Response** (404):
  ```json
  { "error": "Expense not found" }
  ```

#### 5. **Delete Expense**
- **Method**: `DELETE`
- **Path**: `/expenses/:id`
- **Path Parameters**: `id` (string) - Expense ID
- **Response** (200):
  ```json
  {
    "message": "Expense deleted",
    "expense": {
      "id": "1717416000000",
      "amount": 500,
      "category": "Food",
      "date": "2024-06-02",
      "note": "Lunch at restaurant",
      "createdAt": "2024-06-02T12:00:00.000Z"
    }
  }
  ```
- **Response** (404):
  ```json
  { "error": "Expense not found" }
  ```



### Error Handling

All errors follow this format:
```json
{
  "error": "Description of what went wrong"
}
```

Common HTTP Status Codes:
- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid input validation
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Server-side issue

---

## Project Structure

```
Expense_Tracker/
├── package.json                 # Root package.json for monorepo
├── README.md                    # This file
│
├── server/                      # Backend - Node.js/Express
│   ├── server.js               # Main Express application
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Environment variables template
│   ├── .gitignore              # Git ignore rules
│   └── data/                   # (Created at runtime)
│       └── expenses.json       # Persistent JSON storage
│
└── client/                      # Frontend - React
    ├── public/
    │   └── index.html          # HTML entry point
    ├── src/
    │   ├── index.js            # React entry point
    │   ├── index.css           # Global styles
    │   ├── App.js              # Main React component
    │   ├── App.css             # App styles
    │   ├── api.js              # Axios API client
    │   ├── filterUtils.js      # Filter logic utility
    │   ├── exportUtils.js      # CSV export utility
    │   ├── ExpenseForm.js      # Form component for adding/editing
    │   ├── ExpenseForm.css     # Form styles
    │   ├── ExpenseTable.js     # Table component for listing
    │   ├── ExpenseTable.css    # Table styles
    │   ├── FilterPanel.js      # Filter component
    │   ├── FilterPanel.css     # Filter styles
    │   ├── SummaryPanel.js     # Summary & charts component
    │   ├── SummaryPanel.css    # Summary styles
    │   └── ...
    ├── package.json            # Frontend dependencies
    ├── .env.example            # Environment variables template
    └── .gitignore              # Git ignore rules
```


---

## Features Implemented

### Must Have ✅
- ✅ Add expenses with amount, category, date, optional note
- ✅ View all expenses in a table sorted by date (newest first)
- ✅ Edit and delete existing expenses
- ✅ Filter expenses by category and date range
- ✅ Summary panel with total this month, total per category, highest expense
- ✅ Pie chart visualization of expenses by category (Recharts)
- ✅ Currency formatting with Indian Rupee (₹) locale
- ✅ Form validation - no negative amounts, no future dates, required field validation
- ✅ Export visible expenses as CSV download
- ✅ Persistence to JSON file in `/server/data/expenses.json`


---

## Next Steps & Future Enhancements

### What Was NOT Implemented
1. **Authentication & Multi-User Support** - Currently assumes single-user
   - *Future*: Add JWT authentication, user accounts, private expense tracking
   - Difficulty: Medium
   - Impact: Enable multi-user collaboration and separate personal tracking

2. **Database (SQL/NoSQL)** - Using JSON file instead
   - *Future*: Migrate to PostgreSQL/MongoDB for better scalability
   - Difficulty: Medium
   - Impact: Handle larger datasets, better query performance

3. **Budget Alerts** - Visual indicator when spending exceeds category budget
   - *Future*: Allow setting budget limits per category with notifications
   - Difficulty: Low
   - Impact: Help users stay within their budgets




