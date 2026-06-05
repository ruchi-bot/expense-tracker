# 🌐 Deployment Guide

Complete guide to deploy your Expense Tracker frontend and backend independently.

---

## Part 1: Prepare for Git

### 1. Initialize Git Repository

```bash
cd Expense_Tracker
git init
git add .
git commit -m "Initial commit: Expense Tracker monorepo"
```

### 2. Create .gitignore 

The `.gitignore` file is already set up to exclude:
- `node_modules/`
- `.env` files
- Build outputs
- Logs
- `.DS_Store` and IDE files

### 3. Push to GitHub

```bash
# Create a new repository on GitHub (without initializing)

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend (Node.js/Express)

### Deploy on Render 

**Step 1: Connect GitHub**
1. Go to https://render.com/
2. Sign in / Sign up
3. Click "New +" button
4. Select "Web Service"

**Step 2: Connect Repository**
1. Select your GitHub repository
2. Choose `expense-tracker` repo

**Step 3: Configure Service**
- **Name**: `expense-tracker-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Working Directory**: `server`

**Step 4: Environment Variables**
In the "Environment" section, add:
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://expense-tracker-client.vercel.app
```
*(Replace with my frontend URL)*

**Step 5: Deploy**
- Click "Create Web Service"
- Wait for build to complete
- Your backend URL: `https://expense-tracker-backend.onrender.com`




### Verify Backend Deployment

```bash
# Replace with my deployed backend URL
curl https://expense-tracker-backend.onrender.com/api/health

# Should return:
# {"status":"ok","timestamp":"2024-06-02T..."}
```

---

## Part 3: Deploy Frontend (React)

### Option A: Deploy on Vercel 

**Step 1: Connect GitHub**
1. Go to https://vercel.com/
2. Sign in / Sign up with GitHub
3. Click "Add New" → "Project"

**Step 2: Import Repository**
1. Select your `expense-tracker` repository
2. Vercel auto-detects it's a React project

**Step 3: Configure**
- **Project Name**: `expense-tracker-client`
- **Framework**: React (auto-detected)
- **Root Directory**: `./client`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `build` (auto-detected)

**Step 4: Environment Variables**
Add environment variable:
```
REACT_APP_API_URL=https://expense-tracker-backend.onrender.com
```
*(Replace with my backend URL)*

**Step 5: Deploy**
- Click "Deploy"
- Wait for build to complete
- Your frontend URL: `https://expense-tracker-client.vercel.app`

### Option B: Deploy on Netlify

**Step 1: Connect GitHub**
1. Go to https://netlify.com/
2. Click "Add new site" → "Import an existing project"
3. GitHub → Select your repo (authorize if needed)

**Step 2: Build Settings**
- **Base directory**: `client`
- **Build command**: `npm run build`
- **Publish directory**: `client/build`

**Step 3: Environment Variables**
1. Go to "Site settings" → "Build & deploy" → "Environment"
2. Add:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

**Step 4: Deploy**
- Click "Deploy site"
- Netlify builds and deploys automatically




### Verify Frontend Deployment

1. Visit your deployed frontend URL
2. Check console for any errors (DevTools → Console)
3. Try adding an expense - verify it works

---

## Part 4: Connect Frontend to Backend

### Update Frontend Environment

After deploying backend, update frontend environment variable:

**On Vercel:**
1. Go to Project Settings → Environment Variables
2. Update `REACT_APP_API_URL` to your deployed backend URL
3. Click "Save"
4. Vercel auto-redeploys

**On Netlify:**
1. Site settings → Build & deploy → Environment
2. Update `REACT_APP_API_URL`
3. Redeploy manually if needed


# Rebuild and deploy
cd client
npm run build
npm run deploy
```

### Test the Connection

1. Open your deployed frontend URL
2. Add an expense
3. Open browser console (F12) → Network tab
4. Check API calls go to your backend URL
5. Verify data persists

---

## Part 5: Continuous Deployment Setup

### Auto-Deploy on Push (Both Services)

**Vercel & Netlify:** Automatically redeploy when you push to GitHub
- Any push to `main` branch triggers deployment
- Previews available for pull requests

**Render:** Similar auto-deploy on push
- Configure in dashboard


### Workflow

```
1. Make code changes locally
2. git add .
3. git commit -m "feature: add something"
4. git push origin main
     ↓
5. GitHub receives push
6. Vercel detects changes → Builds frontend → Deploys
7. Render detects changes → Builds backend → Deploys
8. Live site updated in ~1-2 minutes
```

---

## Part 6: Monitoring & Maintenance

### Check Backend Status

- **Render**: Dashboard shows build logs and metrics
- **Railway**: Real-time logs available
- **Heroku**: `heroku logs -t`

### Monitor Frontend

- **Vercel**: Analytics dashboard
- **Netlify**: Build logs and deploy history
- **Check**: Browser DevTools for errors

### Data Persistence

⚠️ **Important for File-Based Storage:**

The backend stores data in `/server/data/expenses.json`. This works fine locally, but on services with ephemeral storage (file system resets):

**Problem**: Data may be lost if the server restarts

**Solutions**:
1. **Recommended**: Migrate to PostgreSQL/MongoDB (see README.md Next Steps)
2. **Quick Fix**: Use services with persistent storage
   - Render: Use Render Disk
   - Railway: Use Railway storage
   - Heroku: Data is ephemeral, not recommended for JSON storage

### Add Persistent Storage (Render Example)

1. In Render dashboard → Web Service → Disks
2. Click "Add Disk"
3. Add mount point: `/server/data`
4. Set size (e.g., 1GB)
5. Redeploy

---

## Part 7: Environment Variables Checklist

### Backend (.env on Render/Railway/etc.)
- ✅ `PORT=5000`
- ✅ `NODE_ENV=production`
- ✅ `FRONTEND_URL=https://your-deployed-frontend.com`

### Frontend (.env on Vercel/Netlify/etc.)
- ✅ `REACT_APP_API_URL=https://your-deployed-backend.com`

### CORS Configuration

Backend allows requests from:
- `http://localhost:3000` (local dev)
- `process.env.FRONTEND_URL` (production)

To add more URLs, edit `/server/server.js` line ~15

---

## Part 8: Troubleshooting Deployment Issues

### Frontend shows error connecting to backend

**Check:**
1. Backend deployed and running
2. `REACT_APP_API_URL` env variable is correct
3. CORS enabled on backend for your frontend URL
4. No network requests being blocked

**Fix:** Update frontend env variable and redeploy

### Backend deployment fails

**Check:**
1. `server.js` exists in `/server`
2. `package.json` correct in `/server`
3. No syntax errors in code
4. All dependencies listed in `package.json`

**Fix:** Check deployment logs, fix error, push to GitHub

### Data not persisting

**Check:**
1. Backend has persistent storage (disk) configured
2. Or database is set up

**Solution:** Add disk in Render or migrate to database

### High latency/slow responses

**Optimization:**
1. Enable compression on backend
2. Optimize frontend bundle
3. Add caching headers
4. Consider database for faster queries

---

## Part 9: Production Checklist

Before going live:

- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Frontend can communicate with backend
- [ ] All environment variables set correctly
- [ ] Data persists properly
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Error monitoring set up
- [ ] README updated with deployed URLs

---

## Part 10: Update README with Live URLs

Edit `README.md` and update:

```markdown
## Live Demo Links
expense-tracker-bektssb77-ruchi-sainis-projects.vercel.app
- **Frontend (Deployed)**: expense-tracker-bektssb77-ruchi-sainis-projects.vercel.app
- **Backend (Deployed)**: https://expense-tracker-zx0t.onrender.com

```

Push to GitHub!

---

## Summary

```
Local Development          Git Push              Deployed Production
    ↓                         ↓                            ↓
localhost:3000       push to GitHub         https://yourfrontend.com
localhost:5000   →   ↓           ↓        →   https://yourbackend.com
