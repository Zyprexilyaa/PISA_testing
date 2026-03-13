# Quick Start Guide - Run the PISA Classroom System

## 🚀 One-Command Startup (Recommended for Windows)

### Start Both Frontend and Backend Separately

Since Windows PowerShell doesn't support `&` for running commands in parallel easily, use these commands in **two separate terminals**:

**Terminal 1 - Frontend (React):**
```bash
cd "d:\Project CEDT\frontend"
npm run dev
```
This starts the frontend on `http://localhost:5173`

**Terminal 2 - Backend (Express):**
```bash
cd "d:\Project CEDT\backend\functions"
npm start
```
This starts the backend on `http://localhost:5000` (or the configured port)

## 📋 Available Scripts

### From Root Directory (`d:\Project CEDT`)

```bash
# Start frontend only
npm run start:frontend
# Result: Frontend runs on http://localhost:5173

# Start backend only
npm run start:backend
# Result: Backend runs on http://localhost:5000

# Build both projects
npm run build
# Creates optimized production builds

# Deploy to Firebase
npm run deploy
# Deploys frontend to Firebase Hosting and backend to Cloud Functions
```

### Frontend Scripts (from `frontend/` directory)

```bash
cd frontend

npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Check code quality
```

### Backend Scripts (from `backend/functions/` directory)

```bash
cd backend/functions

npm start          # Start server
npm run dev        # Build and run (development)
npm run build      # Compile TypeScript to JavaScript
npm run deploy     # Deploy to Firebase Cloud Functions
```

## 🌐 Access the Application

After starting both frontend and backend:

1. **Open your browser:**
   ```
   http://localhost:5173
   ```

2. **Expected flow:**
   - Frontend loads from React (Vite)
   - Backend API available at `http://localhost:5000`
   - Firebase Firestore syncs in real-time

## 🔍 Verify Everything is Running

### Check Frontend
```
✅ See "🧠 PISA Insight" title
✅ No console errors (F12 to open DevTools)
✅ Can navigate between pages
```

### Check Backend
```
✅ Terminal shows "Server running on port 5000"
✅ No error messages
✅ API responses in Network tab (F12)
```

### Check Database
```
✅ Users can sign up
✅ Data appears in Firebase Firestore
✅ No "Permission denied" errors
```

## 🆘 Troubleshooting

### Issue: "npm start" not found
**Fix:** Use the separate terminal commands above instead

### Issue: Frontend won't load
```bash
# Try clearing cache and reinstalling
cd frontend
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Issue: Backend won't start
```bash
# Check environment variables
cd backend/functions
cat .env.local
# Should have GEMINI_API_KEY

# Then try:
npm start
```

### Issue: "Port already in use"
Frontend uses **5173**, Backend uses **5000**. If ports are busy:

```bash
# Find what's using the port (Windows)
netstat -ano | findstr :5173
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

## 📝 Environment Setup

### Frontend (.env needed?)
- None required for development
- Firebase config is in `src/services/firebase.ts`

### Backend (.env required)
Located at `backend/functions/.env.local`:
```
GEMINI_API_KEY=your-api-key-here
PORT=5000
NODE_ENV=development
```

## 🎯 Testing the System

Once everything is running:

### Test 1: Sign Up as Teacher
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Select "Teacher" role
4. Enter email and password
5. ✅ Should redirect to home

### Test 2: Create Classroom
1. Click "My Classrooms"
2. Enter classroom name
3. ✅ Should see classroom created with code

### Test 3: Student Joins
1. Open new private/incognito window
2. Sign up as Student
3. Click "Join Classroom"
4. Enter the classroom code
5. ✅ Should join successfully

## 🚀 Production Deployment

When ready to deploy:

```bash
# Build everything
npm run build

# Deploy to Firebase
npm run deploy

# This will deploy:
# - Frontend → Firebase Hosting (https://your-project.web.app)
# - Backend → Cloud Functions (https://region-your-project.cloudfunctions.net)
```

## 📊 Project Structure

```
Project CEDT/
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # React components
│   │   ├── services/    # Firebase & API services
│   │   └── contexts/    # React contexts (Auth, Language)
│   └── package.json
│
├── backend/
│   └── functions/       # Express.js server
│       ├── src/
│       │   ├── index.ts # Main server file
│       │   ├── routes/  # API endpoints
│       │   └── services/# Business logic
│       └── package.json
│
└── firestore.rules      # Firestore security rules
```

## ✅ Checklist Before Starting

- [ ] Node.js installed (v16+)
- [ ] npm installed (v8+)
- [ ] `d:\Project CEDT\frontend\node_modules` exists
- [ ] `d:\Project CEDT\backend\functions\node_modules` exists
- [ ] `.env.local` created in `backend/functions/`
- [ ] Firebase project configured
- [ ] Firestore rules deployed (`firebase deploy --only firestore:rules`)

If any are missing, run:
```bash
cd "d:\Project CEDT\frontend"
npm install

cd "d:\Project CEDT\backend\functions"
npm install
```

## 💡 Tips

- **Keep both terminals open** while developing
- **Reload browser** after making changes to frontend
- **Check console** (F12) for errors before asking for help
- **Backend logs** show API calls and errors in terminal
- **Firestore Console** shows database changes in real-time

---

**Ready to start? Open two terminals and run the commands above!** 🎉
