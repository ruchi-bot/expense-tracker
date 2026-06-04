# Expense Tracker - Configuration Guide

## Environment Variables Setup

### Server Configuration (.env)

Create a `.env` file in the `/server` directory:

```env
# Server Port (default: 5000)
PORT=5000

# Environment (development or production)
NODE_ENV=development

# Frontend URL for CORS (adjust to your frontend URL)
FRONTEND_URL=http://localhost:3000
```

**For Production Deployment:**
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-deployed-frontend.com
```

### Client Configuration (.env.local)

Create a `.env.local` file in the `/client` directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

**For Production Deployment:**
```env
REACT_APP_API_URL=https://your-deployed-backend.com
```

## Deployment Architecture

### Recommended Deployment Strategy

```
┌─────────────────────────────────────────────────────┐
│              Your Application                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐        ┌──────────────────┐  │
│  │    Frontend      │        │    Backend       │  │
│  │  (Vercel/       │◄──────►│  (Render/Railway)│  │
│  │   Netlify)       │  HTTP │                  │  │
│  │                  │        │  • PORT: 5000    │  │
│  │  • React App    │        │  • Express.js    │  │
│  │  • Port: 3000   │        │  • JSON Storage  │  │
│  │  (local dev)    │        │                  │  │
│  └──────────────────┘        └──────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Running Locally

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Setup Environment Files
```bash
# Server
cd server
cp .env.example .env
cd ..

# Client
cd client
cp .env.example .env.local
cd ..
```

### Step 3: Run Development Servers
```bash
# From root directory
npm run dev
```

Backend starts on: http://localhost:5000
Frontend starts on: http://localhost:3000

## Testing the Setup

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Get all expenses
curl http://localhost:5000/api/expenses

# Create an expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "category": "Food",
    "date": "2024-06-02",
    "note": "Lunch"
  }'
```

### Test Frontend Connection
1. Navigate to http://localhost:3000
2. You should see the Expense Tracker home page
3. Try to:
   - Add a new expense
   - View expenses
   - Filter by category
   - Export as CSV

## Build for Production

### Build Frontend
```bash
cd client
npm run build
```
Output will be in `/client/build/`

### Production Deployment Commands

**For Render Backend:**
- Build Command: `npm install`
- Start Command: `node server.js`
- Specify working directory: Keep default or set to root

**For Vercel Frontend:**
- Framework: React
- Build Command: `npm run build`
- Output Directory: `build`
- Root Directory: `./client`

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000` (development)
- `process.env.FRONTEND_URL` (production)

To add more origins, edit `/server/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-domain.com',
  process.env.FRONTEND_URL,
].filter(Boolean);
```

## Data Persistence

### Local Development
- Data is stored in: `/server/data/expenses.json`
- This file is created automatically on first expense

### Production Considerations
- File-based storage is good for single user
- For multiple users, migrate to PostgreSQL/MongoDB
- Backup `expenses.json` regularly if hosting on services with ephemeral storage

## Troubleshooting

### Frontend Can't Connect to Backend
1. Verify backend is running on port 5000
2. Check `REACT_APP_API_URL` in frontend `.env.local`
3. Check CORS configuration in backend `server.js`
4. Check browser console for network errors

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Data Not Persisting
1. Check `/server/data/` directory exists
2. Verify filesystem write permissions
3. Check `/server/data/expenses.json` is being updated

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
npm run install-all
```

## Performance Tips for Production

1. **Enable gzip compression on backend**:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Use production build React**:
   - Automatic with `npm run build` in client

3. **Add API rate limiting** (future enhancement):
   ```bash
   npm install express-rate-limit
   ```

4. **Optimize JSON file** (if large):
   - Consider database migration
   - Implement pagination in GET /expenses

## Security Considerations

For production deployment, consider adding:

1. **HTTPS/SSL** - Both Render and Vercel provide free SSL
2. **Input Validation** - Backend already validates, add frontend too
3. **Rate Limiting** - Prevent API abuse
4. **CORS Restrictions** - Only allow your frontend domain
5. **Environment Variables** - Never commit `.env` files (already in .gitignore)

---

For detailed API documentation, see [README.md](./README.md#api-documentation)
