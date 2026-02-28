# Quick Commands & Setup Checklist

Copy and paste these commands to quickly set up your project.

---

## ✅ Pre-Setup Checklist

Before running any commands, ensure you have:

- [ ] Node.js v16+ (`node --version`)
- [ ] npm or yarn (`npm --version`)
- [ ] Git installed
- [ ] Firebase CLI globally installed (`npm install -g firebase-tools`)
- [ ] Firebase project created at [firebase.google.com](https://firebase.google.com)
- [ ] Gemini API key from [ai.google.dev](https://ai.google.dev/)
- [ ] Google Cloud project created with Speech-to-Text API enabled

---

## 🚀 Quick Setup (Copy & Paste)

### 1️⃣ Get Firebase Credentials

Go to Firebase Console → Project Settings and copy your config:

```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### 2️⃣ Setup Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file with your Firebase config
cat > .env.local << EOF
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_HERE
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_HERE
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_HERE
VITE_FIREBASE_APP_ID=YOUR_APP_ID_HERE
VITE_FUNCTIONS_URL=http://localhost:5000
EOF
```

### 3️⃣ Setup Backend

```bash
# Navigate to backend functions
cd ../backend/functions

# Install dependencies
npm install

# Create .env.local file with Gemini API key
cat > .env.local << EOF
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY_HERE
GCP_PROJECT_ID=YOUR_PROJECT_ID_HERE
GEMINI_MODEL=gemini-pro
EOF
```

### 4️⃣ Setup Firebase

```bash
# Go back to project root
cd ../..

# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
# When prompted:
# - Select your project
# - Select: Firestore, Hosting, Functions, Storage
# - Accept defaults for most questions

# Link to your Firebase project
firebase use --add
```

### 5️⃣ Start Development Servers

**Terminal 1: Firebase Emulator**
```bash
# From project root
firebase emulators:start
```

**Terminal 2: Backend Functions**
```bash
cd backend/functions
npm run dev
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
```

Open your browser to `http://localhost:5173`

---

## 📋 Common Commands

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check code style
npm run lint
```

### Backend Commands

```bash
cd backend/functions

# Start functions locally
npm run dev

# Build TypeScript
npm run build

# Deploy to Firebase
firebase deploy --only functions
```

### Firebase Commands

```bash
# List all emulators
firebase emulators:list

# Start specific emulator
firebase emulators:start --only firestore

# View functions logs
firebase functions:log

# Deploy everything
firebase deploy

# Deploy only specific service
firebase deploy --only functions
firebase deploy --only hosting

# Set environment variable
firebase functions:config:set google.api_key="your_key"

# View environment variables
firebase functions:config:get
```

---

## 🔧 Environment Variable Setup

### Frontend (.env.local)

```env
# Required for Firebase connection
VITE_FIREBASE_API_KEY=paste_here
VITE_FIREBASE_AUTH_DOMAIN=paste_here
VITE_FIREBASE_PROJECT_ID=paste_here
VITE_FIREBASE_STORAGE_BUCKET=paste_here
VITE_FIREBASE_MESSAGING_SENDER_ID=paste_here
VITE_FIREBASE_APP_ID=paste_here

# Backend connection
VITE_FUNCTIONS_URL=http://localhost:5000

# Production: VITE_FUNCTIONS_URL=https://region-project.cloudfunctions.net
```

### Backend (.env.local)

```env
# Google Generative AI (Gemini)
GOOGLE_API_KEY=paste_here

# Google Cloud
GCP_PROJECT_ID=paste_here

# Model selection
GEMINI_MODEL=gemini-pro
```

---

## 🆘 Troubleshooting Commands

### Clear Cache & Reinstall

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -r node_modules
npm install

# In all three directories (frontend, functions, root)
```

### Check Versions

```bash
# Check Node version (should be 16+)
node --version

# Check npm version
npm --version

# Check Firebase CLI version
firebase --version

# Check TypeScript version
npx tsc --version
```

### Test Connectivity

```bash
# Test Firebase connection
firebase status

# Test Functions endpoint (when running)
curl http://localhost:5000/health

# Should return: {"status":"ok","message":"..."}
```

### View Logs

```bash
# Firebase Functions logs (local)
firebase functions:log

# Frontend console (browser DevTools)
# Open http://localhost:5173 → F12 → Console tab
```

---

## 📦 Package Management

### Add New Dependency

```bash
# Frontend
cd frontend
npm install package-name

# Backend
cd backend/functions
npm install package-name

# Save as development dependency
npm install --save-dev package-name
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

---

## 🚀 Deployment Steps

### Deploy to Firebase Hosting & Functions

```bash
# From project root

# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Deploy everything
firebase deploy

# Alternatively, deploy separately:
firebase deploy --only functions
firebase deploy --only hosting
```

### Check Deployment Status

```bash
# View deployment history
firebase deploy:list

# View functions logs (production)
firebase functions:log --limit 50

# Visit your app
# Frontend: https://your-project.web.app
# Backend: https://region-your-project.cloudfunctions.net
```

---

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Run tests (if configured)
npm test

# Run in watch mode
npm test -- --watch
```

### Backend Testing

```bash
cd backend/functions

# Run tests (if configured)
npm test

# Run specific test file
npm test -- test-file-name
```

### Manual Testing

1. **Test Microphone**: Click "Practice" → Click microphone icon
2. **Test Recording**: Speak for a few seconds, click stop
3. **Test Submission**: Click "Submit Answer"
4. **Check Logs**:
   - Browser console (F12)
   - Terminal where `npm run dev` is running
   - Firebase functions logs

---

## 📝 Setup Verification Checklist

After setup, verify everything works:

- [ ] Frontend server running at http://localhost:5173
- [ ] Backend server running at http://localhost:5000
- [ ] Firebase emulator started
- [ ] Firestore database accessible
- [ ] Firebase Storage accessible
- [ ] Microphone permission granted
- [ ] Frontend loads without errors
- [ ] Audio recording works
- [ ] API call successful (`/health` endpoint)
- [ ] Analysis returns results
- [ ] Data saved to Firestore

---

## 🆘 Getting Help

### If Something Doesn't Work

1. **Check the logs**: `firebase functions:log`
2. **Check browser console**: F12 → Console tab
3. **Check terminal output**: Look for error messages
4. **Read the documentation**:
   - `GETTING_STARTED.md`
   - `docs/API.md`
   - `config/ENVIRONMENT.md`

### Common Issues & Fixes

**"Cannot find module"**
```bash
# Solution
rm -r node_modules
npm install
npm run build
```

**"Firebase config is invalid"**
- Copy config again from Firebase Console
- Check all fields are filled
- No extra spaces or quotes

**"Microphone not working"**
- Use HTTPS (not HTTP) in production
- Check browser permissions
- Try another browser

**"API returns 500 error"**
- Check `.env.local` has GOOGLE_API_KEY
- Check Gemini API is enabled
- Check API quotas in Google Cloud Console

**"Firestore connection fails"**
- Verify Firebase project ID is correct
- Check security rules are not too restrictive
- Restart Firebase emulator

---

## 📅 Regular Maintenance Commands

### Weekly

```bash
# Check for security vulnerabilities
npm audit

# Update package list
npm update
```

### Monthly

```bash
# Clean up cache
npm cache clean --force

# Check outdated packages
npm outdated

# Read security advisories
npm audit
```

### Before Deployment

```bash
# Lint code
npm run lint

# Build for production
npm run build

# Run tests
npm test

# Check file sizes
npm run build -- --report
```

---

## 🔐 Security Commands

### Rotate API Keys

```bash
# Generate new Gemini API key
# 1. Go to https://ai.google.dev/
# 2. Generate new key
# 3. Update .env.local

# Update Firebase secrets
firebase functions:config:set google.api_key="your_new_key"
firebase deploy --only functions
```

### Check Dependencies for Vulnerabilities

```bash
# Audit all dependencies
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix dangerous vulnerabilities only
npm audit fix --force
```

---

## 📊 Useful File Locations

```
Current Location: d:\Project CEDT\

Key Files:
- src files → frontend/src/
- backend code → backend/functions/src/
- Firebase config → firebase.json
- Project config → .firebaserc
- Environment vars → .env.local (create this)
- Documentation → *.md files (main directory)
```

---

## 💡 Pro Tips

1. **Use VSCode Extensions**:
   - Firebase Explorer
   - Thunder Client (API testing)
   - ES7+ React/Redux/React-Native snippets

2. **Keyboard Shortcuts**:
   - Open dev tools: F12
   - Open terminal: Ctrl+`
   - Clear console: Ctrl+L
   - Format code: Shift+Alt+F

3. **Debugging**:
   - Add `console.log()` in React components
   - Use `debugger;` keyword
   - Check Network tab for API calls
   - Use Redux DevTools for state debugging

4. **Performance**:
   - Use `npm run build` to check bundle size
   - Compress images before uploading
   - Use browser DevTools Performance tab

---

## 🎯 Next Steps After Setup

1. ✅ Complete all setup steps above
2. 📝 Create sample questions in Firestore
3. 🧪 Test with real audio recordings
4. 👥 Add user authentication
5. 📊 Build teacher dashboard
6. 🚀 Deploy to production

---

**Last Updated**: February 28, 2026
**Version**: 1.0.0

For detailed setup instructions, see `GETTING_STARTED.md`
For file locations, see `FILE_REFERENCE.md`
For API documentation, see `docs/API.md`
