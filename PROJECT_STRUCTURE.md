# 📁 Project Structure Guide

Complete walkthrough of the Expense Tracker monorepo structure.

## High-Level Overview

```
Expense_Tracker/                 ← Root directory (monorepo)
├── .gitignore                   ← Git ignore rules
├── .dist/                       ← Build outputs folder
├── package.json                 ← Root npm config (monorepo commands)
├── README.md                    ← Main documentation
├── QUICKSTART.md                ← Quick start guide
├── CONFIGURATION.md             ← Environment setup guide
├── DEPLOYMENT.md                ← Deployment instructions
│
├── server/                      ← Backend (Node.js/Express)
│   ├── server.js                ← Main Express app
│   ├── package.json             ← Backend dependencies
│   ├── .env.example             ← Environment template
│   ├── .gitignore               ← Git ignore for backend
│   └── data/                    ← Data folder (created at runtime)
│       └── expenses.json        ← Persistent data storage
│
└── client/                      ← Frontend (React)
    ├── public/
    │   └── index.html           ← HTML template
    ├── src/
    │   ├── index.js             ← React entry point
    │   ├── index.css            ← Global styles
    │   ├── App.js               ← Main React component
    │   ├── App.css              ← App specific styles
    │   ├── api.js               ← Axios API client
    │   ├── filterUtils.js       ← Filter logic
    │   ├── exportUtils.js       ← CSV export function
    │   ├── ExpenseForm.js       ← Add/Edit form component
    │   ├── ExpenseForm.css      ← Form styles
    │   ├── ExpenseTable.js      ← Expenses list component
    │   ├── ExpenseTable.css     ← Table styles
    │   ├── FilterPanel.js       ← Filter UI component
    │   ├── FilterPanel.css      ← Filter styles
    │   ├── SummaryPanel.js      ← Summary & charts component
    │   └── SummaryPanel.css     ← Summary styles
    ├── package.json             ← Frontend dependencies
    ├── .env.example             ← Environment template
    └── .gitignore               ← Git ignore for frontend
```

---

## Detailed File Explanations

### 📦 Root Level Files

| File | Purpose |
|------|---------|
| `.gitignore` | Specifies files/folders to exclude from Git |
| `package.json` | Monorepo configuration with helper scripts |
| `README.md` | **Main documentation - start here!** |
| `QUICKSTART.md` | Get running in 5 minutes |
| `CONFIGURATION.md` | Environment variables and configuration |
| `DEPLOYMENT.md` | **Step-by-step deployment guide** |

### Root `package.json` Scripts

```json
{
  "scripts": {
    "install-all": "Install deps for all packages",
    "dev": "Run both frontend & backend",
    "server": "Run backend only",
    "client": "Run frontend only",
    "build": "Build frontend for production",
    "build-server": "Prepare backend for production"
  }
}
```

---

## Backend Structure (`/server`)

### Files

```
server/
├── server.js              ← Main Express application
├── package.json           ← Dependencies: express, cors, dotenv
├── .env.example           ← Template for environment variables
├── .gitignore             ← Excludes node_modules, .env, data/
└── data/                  ← Created at runtime
    └── expenses.json      ← JSON data storage
```

### What `server.js` Contains

- **Express setup** - Initialize app, middleware
- **CORS configuration** - Allow frontend to connect
- **Routes** - HTTP endpoints for all operations:
  - `GET /api/expenses` - Get all expenses
  - `GET /api/expenses/:id` - Get single expense
  - `POST /api/expenses` - Create expense
  - `PUT /api/expenses/:id` - Update expense
  - `DELETE /api/expenses/:id` - Delete expense
  - `GET /api/summary` - Get statistics
  - `GET /api/health` - Health check
- **Data operations** - Load/save JSON file
- **Validation** - Input validation for expenses
- **Error handling** - Returns proper HTTP status codes

### Backend Dependencies

```json
{
  "express": "Web framework",
  "cors": "Enable cross-origin requests",
  "dotenv": "Load environment variables"
}
```

### Example `.env` File

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## Frontend Structure (`/client`)

### Files

```
client/
├── public/
│   └── index.html         ← HTML template
├── src/
│   ├── index.js           ← React entry point
│   ├── index.css          ← Global CSS
│   ├── App.js             ← Root component
│   ├── App.css            ← Root styles
│   ├── api.js             ← API client (axios)
│   ├── filterUtils.js     ← Filtering logic
│   ├── exportUtils.js     ← CSV export
│   ├── ExpenseForm.js     ← Form component
│   ├── ExpenseForm.css    ← Form styles
│   ├── ExpenseTable.js    ← Table component
│   ├── ExpenseTable.css   ← Table styles
│   ├── FilterPanel.js     ← Filter widget
│   ├── FilterPanel.css    ← Filter styles
│   ├── SummaryPanel.js    ← Summary widget
│   └── SummaryPanel.css   ← Summary styles
├── package.json           ← Dependencies
├── .env.example           ← Environment template
└── .gitignore             ← Excludes node_modules, build/
```

### Component Architecture

```
App.js (Main)
├── ExpenseForm
│   └── Form validation & submission
├── FilterPanel
│   ├── Filter state management
│   └── filterUtils.js (Apply filters)
├── SummaryPanel
│   ├── Summary statistics
│   └── Pie chart (Recharts)
└── ExpenseTable
    ├── List of expenses
    ├── Edit/Delete buttons
    └── exportUtils.js (CSV download)
```

### Frontend Dependencies

```json
{
  "react": "UI library",
  "react-dom": "React DOM renderer",
  "react-scripts": "Build tooling",
  "recharts": "Chart library",
  "axios": "HTTP client"
}
```

### Example `.env.local` File

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## Data Flow

### Adding an Expense

```
User Input in Form
    ↓
Validation (ExpenseForm.js)
    ↓
POST /api/expenses (api.js)
    ↓
Backend Validation (server.js)
    ↓
Save to expenses.json (server.js)
    ↓
Return created expense
    ↓
Update frontend state (App.js)
    ↓
Display in table & summaryRefresh summary
```

### Viewing & Filtering

```
Load page (App.js useEffect)
    ↓
GET /api/expenses (api.js)
    ↓
Server reads expenses.json
    ↓
Return array of expenses
    ↓
Store in state (App.js)
    ↓
Apply filters (filterUtils.js)
    ↓
Display filtered results in table
```

### Editing an Expense

```
Click Edit button
    ↓
Load expense in form (ExpenseForm.js)
    ↓
User modifies & submits
    ↓
PUT /api/expenses/:id (api.js)
    ↓
Validate & update JSON file
    ↓
Refresh frontend state
    ↓
Update table & summary
```

---

## CSS Architecture

### Global Styles (`index.css`)
- Font settings
- Color scheme
- App layout (flexbox grid)
- Header & footer styling
- Responsive breakpoints

### Component Styles (Separate CSS files)
Each component has its own `.css` file:
- `ExpenseForm.css` - Form styling
- `ExpenseTable.css` - Table & badges
- `FilterPanel.css` - Filter widgets
- `SummaryPanel.css` - Stats cards & charts

### Color Scheme

| Purpose | Color |
|---------|-------|
| Primary | #007bff (Blue) |
| Success | #28a745 (Green) |
| Danger | #dc3545 (Red) |
| Warning | #ffc107 (Yellow) |
| Info | #17a2b8 (Cyan) |
| Background | #f5f7fa (Light Gray) |

### Responsive Design

- Desktop: Grid layout with sidebar filters
- Tablet: Single column, stacked layout
- Mobile: Full width, simplified UI

---

## API Endpoint Tree

```
/api
├── /expenses
│   ├── GET           ← List all
│   ├── POST          ← Create new
│   ├── /:id
│   │   ├── GET       ← Get one
│   │   ├── PUT       ← Update
│   │   └── DELETE    ← Delete
├── /summary          ← Get statistics
├── /health          ← Health check
```

---

## State Management Flow (React)

### App.js State

```javascript
const [expenses, setExpenses]          // All expenses from backend
const [filteredExpenses, setFiltered]  // Filtered display
const [summary, setSummary]             // Statistics
const [loading, setLoading]             // Loading state
const [isEditing, setIsEditing]         // Edit mode
const [editingExpense, setEditing]      // Current edit item
const [filters, setFilters]             // Current filters
```

### How State Updates

```
API Call → Success → Update State → Re-render Components
           ↓
           Error → Show Alert
```

---

## Build Outputs

### Production Build

When you run `npm run build` in `/client`:

```
client/
└── build/             ← Contains optimized React build
    ├── index.html     ← Main HTML file
    ├── static/
    │   ├── js/        ← Minified JavaScript bundles
    │   ├── css/       ← Minified CSS bundles
    │   └── media/     ← Images, fonts, etc.
    └── manifest.json  ← PWA manifest
```

This `build/` folder is what gets deployed to production hosting.

---

## Git Structure (for Version Control)

### What Gets Committed
```
✓ All source code (.js, .css, .html)
✓ package.json & package-lock.json
✓ README.md, docs
✓ .gitignore files
```

### What's Ignored
```
✗ node_modules/         → Too large, installed from package.json
✗ .env                  → Contains secrets
✗ build/                → Generated files
✗ /server/data/         → User data
✗ .DS_Store, IDE files
```

### Commit Strategy

```
Initial Setup
    ↓
npm run install-all
git add .
git commit -m "Initial commit"
git push

Feature Development
    ↓
Make changes
git add .
git commit -m "feature: description"
git push
    ↓
Auto-deploys to production
```

---



---

## Summary

- **Monorepo**: Both frontend & backend in single repository
- **Separation**: Independent `/client` and `/server` folders
- **Scalability**: Can deploy each to different services
- **Git-friendly**: Clean .gitignore, minimal committed files
- **Development**: Single `npm run dev` starts both servers
- **Production**: Separate deployment processes for flexibility


