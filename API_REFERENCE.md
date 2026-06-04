# 🔌 API Reference & Testing Guide

Complete API documentation with curl examples for testing.

---

## Base URL

```
Development: http://localhost:5000
Production: https://your-deployed-backend.com
```

---

## Headers

All requests should include:
```
Content-Type: application/json
```

For cross-origin requests, CORS is enabled for:
- `http://localhost:3000` (development frontend)
- Your configured `FRONTEND_URL` (production)

---

## Endpoints Overview

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/expenses` | List all expenses |
| GET | `/api/expenses/:id` | Get single expense |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/summary` | Get statistics |
| GET | `/api/health` | Health check |

---

## 1. Get All Expenses

### Request
```bash
curl http://localhost:5000/api/expenses
```

### Response (200 OK)
```json
[
  {
    "id": "1717416000000",
    "amount": 500,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Lunch at restaurant",
    "createdAt": "2024-06-02T12:00:00.000Z"
  },
  {
    "id": "1717416005000",
    "amount": 50,
    "category": "Transport",
    "date": "2024-06-02",
    "note": "Taxi ride",
    "createdAt": "2024-06-02T12:05:00.000Z"
  }
]
```

### Notes
- Returns empty array `[]` if no expenses exist
- Sorted in no particular order (sort on frontend)
- No pagination implemented

---

## 2. Get Single Expense

### Request
```bash
curl http://localhost:5000/api/expenses/1717416000000
```

### Response (200 OK)
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

### Response (404 Not Found)
```json
{
  "error": "Expense not found"
}
```

### Parameters
- `id` (string, required) - Expense ID

---

## 3. Create Expense

### Request
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Lunch at restaurant"
  }'
```

### Response (201 Created)
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

### Validation Errors

**Invalid Amount (400)**
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": -100, "category": "Food", "date": "2024-06-02"}'
```
Response:
```json
{
  "error": "Invalid amount. Must be a positive number."
}
```

**Missing Category (400)**
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "date": "2024-06-02"}'
```
Response:
```json
{
  "error": "Category is required."
}
```

**Future Date (400)**
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "category": "Food", "date": "2025-06-02"}'
```
Response:
```json
{
  "error": "Date cannot be in the future."
}
```

**Invalid Date (400)**
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "category": "Food", "date": "not-a-date"}'
```
Response:
```json
{
  "error": "Valid date is required."
}
```

### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| amount | number | Yes | Must be > 0 |
| category | string | Yes | Must be one of: Food, Transport, Bills, Entertainment, Other |
| date | string (ISO) | Yes | Valid date, not in future |
| note | string | No | Optional |

### Expected Categories

- `Food`
- `Transport`
- `Bills`
- `Entertainment`
- `Other`

---

## 4. Update Expense

### Request (Update Amount)
```bash
curl -X PUT http://localhost:5000/api/expenses/1717416000000 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 600
  }'
```

### Request (Update Everything)
```bash
curl -X PUT http://localhost:5000/api/expenses/1717416000000 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 450,
    "category": "Entertainment",
    "date": "2024-06-03",
    "note": "Movie tickets"
  }'
```

### Response (200 OK)
```json
{
  "id": "1717416000000",
  "amount": 450,
  "category": "Entertainment",
  "date": "2024-06-03",
  "note": "Movie tickets",
  "createdAt": "2024-06-02T12:00:00.000Z",
  "updatedAt": "2024-06-02T12:30:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "error": "Expense not found"
}
```

### Notes
- All fields are optional (send only what you want to update)
- Same validation as POST applies to provided fields
- `updatedAt` timestamp is added
- Original `createdAt` is preserved

---

## 5. Delete Expense

### Request
```bash
curl -X DELETE http://localhost:5000/api/expenses/1717416000000
```

### Response (200 OK)
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

### Response (404 Not Found)
```json
{
  "error": "Expense not found"
}
```

---

## 6. Get Summary

### Request
```bash
curl http://localhost:5000/api/summary
```

### Response (200 OK)
```json
{
  "totalThisMonth": 5000,
  "byCategory": {
    "Food": 1500,
    "Transport": 800,
    "Bills": 2000,
    "Entertainment": 700
  },
  "highestExpense": 2000,
  "totalExpenses": 15
}
```

### Response (When No Expenses)
```json
{
  "totalThisMonth": 0,
  "byCategory": {},
  "highestExpense": 0,
  "totalExpenses": 0
}
```

### Notes
- `totalThisMonth`: Sum of expenses in current calendar month
- `byCategory`: Total per category (all-time, not just this month)
- `highestExpense`: Highest single amount across all expenses
- `totalExpenses`: Count of all expenses

---

## 7. Health Check

### Request
```bash
curl http://localhost:5000/api/health
```

### Response (200 OK)
```json
{
  "status": "ok",
  "timestamp": "2024-06-02T12:00:00.000Z"
}
```

### Purpose
- Quick way to verify backend is running
- No body parameters needed
- Perfect for deployment health checks

---

## Testing Workflow

### Step 1: Check Backend is Running
```bash
curl http://localhost:5000/api/health
```

### Step 2: Create a Test Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Test expense"
  }'
```

Store the returned `id`.

### Step 3: Get All Expenses
```bash
curl http://localhost:5000/api/expenses
```

### Step 4: Get Single Expense
```bash
curl http://localhost:5000/api/expenses/YOUR_EXPENSE_ID
```

### Step 5: Update Expense
```bash
curl -X PUT http://localhost:5000/api/expenses/YOUR_EXPENSE_ID \
  -H "Content-Type: application/json" \
  -d '{"amount": 150}'
```

### Step 6: Get Summary
```bash
curl http://localhost:5000/api/summary
```

### Step 7: Delete Expense
```bash
curl -X DELETE http://localhost:5000/api/expenses/YOUR_EXPENSE_ID
```

### Step 8: Verify Deleted
```bash
curl http://localhost:5000/api/expenses
```

---

## Error Handling

### Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET, PUT, DELETE successful |
| 201 | Created | POST successful |
| 400 | Bad Request | Invalid input (amount, date, etc.) |
| 404 | Not Found | Expense ID doesn't exist |
| 500 | Server Error | Unexpected server issue |

### Error Response Format

All errors follow this format:
```json
{
  "error": "Description of what went wrong"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid amount. Must be a positive number. | Negative or zero amount | Use amount > 0 |
| Category is required. | Missing category | Provide category |
| Valid date is required. | Invalid or missing date | Use valid date format |
| Date cannot be in the future. | Date is after today | Use today or earlier |
| Expense not found | ID doesn't exist | Check expense ID |

---

## Testing with Postman

### Import Collection

1. Open Postman
2. Create new Collection: "Expense API"
3. Add requests:

**GET - Get All Expenses**
- Method: GET
- URL: `{{url}}/api/expenses`
- Params: None

**POST - Create Expense**
- Method: POST
- URL: `{{url}}/api/expenses`
- Body (JSON):
```json
{
  "amount": 500,
  "category": "Food",
  "date": "2024-06-02",
  "note": "Lunch"
}
```

**PUT - Update Expense**
- Method: PUT
- URL: `{{url}}/api/expenses/{{expenseId}}`
- Body (JSON):
```json
{
  "amount": 600
}
```

**DELETE - Delete Expense**
- Method: DELETE
- URL: `{{url}}/api/expenses/{{expenseId}}`

**GET - Summary**
- Method: GET
- URL: `{{url}}/api/summary`

Then set: `{{url}}` = `http://localhost:5000`

---

## Rate Limiting

**Current**: No rate limiting implemented

**For production**, consider adding:
```bash
npm install express-rate-limit
```

Example:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

---

## CORS Configuration

### Allowed Origins
```javascript
const allowedOrigins = [
  'http://localhost:3000',          // Local development
  process.env.FRONTEND_URL,          // Production frontend
];
```

### To Add More Origins

Edit `/server/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://my-frontend.com',
  'https://another-frontend.com',
  process.env.FRONTEND_URL,
].filter(Boolean);
```

---

## Data Persistence

### File Location
```
/server/data/expenses.json
```

### File Format
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

### Backup Data
```bash
# Manual backup
cp server/data/expenses.json server/data/expenses.backup.json

# Restore from backup
cp server/data/expenses.backup.json server/data/expenses.json
```

---

## Performance Tips

### Large Datasets

If you have many expenses:

1. **Frontend**: Implement pagination
```javascript
const itemsPerPage = 50;
const page = 1;
const start = (page - 1) * itemsPerPage;
const paginated = filtered.slice(start, start + itemsPerPage);
```

2. **Backend**: Add limit parameter
```bash
GET /api/expenses?limit=50&skip=0
```

3. **Better**: Migrate to database
```
npm install pg sequelize
```

---

## Batch Operations

### Create Multiple Expenses
```bash
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/expenses \
    -H "Content-Type: application/json" \
    -d "{\"amount\": $((RANDOM % 1000)), \"category\": \"Food\", \"date\": \"2024-06-02\"}"
done
```

### Delete All Expenses (Script)
```bash
#!/bin/bash
expenses=$(curl http://localhost:5000/api/expenses)
echo $expenses | jq '.[] | .id' | while read id; do
  curl -X DELETE http://localhost:5000/api/expenses/$id
done
```

---

## Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Client (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000
```

### Override at Runtime
```bash
PORT=3000 node server.js
```

---

## Debugging

### View Server Logs
```bash
cd server
npm run dev
# Logs appear in terminal
```

### Check Network (Browser)
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action
4. Click request to see details

### Test API Directly
```bash
curl -v http://localhost:5000/api/expenses
# Shows headers and full response
```

---

## Next Steps

1. Run: `npm run dev`
2. Test with curl or Postman
3. Monitor frontend Network tab
4. Check `/server/data/expenses.json` for persistence
5. Ready for production deployment!

---

For more info, see:
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
