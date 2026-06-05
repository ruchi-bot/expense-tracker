
## Prerequisites
- Node.js (v14+) installed
- npm (comes with Node.js)

## 1️⃣ Install Dependencies 

From the root directory (`Expense_Tracker/`):

```bash
npm run install-all
```

This will install all packages for:
- Root project
- `/server` backend
- `/client` frontend

## 2️⃣ Setup Environment Files 

```bash
# Create backend .env
cd server && cp .env.example .env && cd ..

# Create frontend .env.local
cd client && cp .env.example .env.local && cd ..
```

## 3️⃣ Start Development 

**Run both servers at once:**
```bash
npm run dev
```

Or **run separately:**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## 4️⃣ Access the App 

Open my browser to: **http://localhost:3000**

✅  see the Expense Tracker home page!

## What's Next?

### Add My First Expense
1. Fill in the form on the left
2. Click "Add Expense"
3. See it appear in the table below

### Explore Features
- 📊 View summary panel with charts (right side)
- 🔍 Filter by category or date range
- ✏️ Edit existing expenses
- 🗑️ Delete expenses
- 📥 Export expenses as CSV
- 📈 See total by category in the pie chart

### Test API Directly

```bash
# Health check
curl http://localhost:5000/api/health

# View all expenses
curl http://localhost:5000/api/expenses

# Add an expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d {\"amount\":500,\"category\":\"Food\",\"date\":\"2024-06-02\"}
```

## Stop the App

- **Frontend**: Press `Ctrl+C` in the frontend terminal
- **Backend**: Press `Ctrl+C` in the backend terminal

## Common Issues

### Port Already in Use

```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F



### Dependencies Not Installing

```bash
npm cache clean --force
npm run install-all
```

### Frontend Can't Connect to Backend

- Ensure backend is running (`npm run dev` in server)
- Check `.env.local` has: `REACT_APP_API_URL=http://localhost:5000`
- Check browser console for network errors



**That's it! now running the Expense Tracker! 🎉**
