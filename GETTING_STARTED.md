# Getting Started Guide

## Step-by-Step Setup Instructions

### Prerequisites Checklist
- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed
- [ ] Firebase account ([firebase.google.com](https://firebase.google.com))
- [ ] Google Cloud account ([cloud.google.com](https://cloud.google.com))

---

## Phase 1: Firebase & Google Cloud Setup

### Step 1.1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Enter project name: `pisa-thinking-skills`
4. Select region (closest to Thailand: Singapore)
5. Enable Google Analytics (optional)
6. Click "Create Project"

### Step 1.2: Get Firebase Credentials

1. In Firebase Console, click "Project Settings" (⚙️ icon)
2. Go to "Your Apps" section
3. Click "Create App" > "Web"
4. Enter app name: `pisa-app`
5. Copy the config object - you'll need this for frontend

Your config should look like:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "pisa-thinking-skills.firebaseapp.com",
  projectId: "pisa-thinking-skills",
  storageBucket: "pisa-thinking-skills.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
}
```

### Step 1.3: Enable Firebase Services

In Firebase Console:

1. **Enable Firestore Database**
   - Left menu: "Build" > "Firestore Database"
   - Click "Create Database"
   - Select region: Singapore (asia-southeast1)
   - Start in test mode (for development)
   - Click "Create"

2. **Enable Authentication** (optional for future)
   - Left menu: "Build" > "Authentication"
   - Click "Get Started"
   - Choose providers as needed

⭐ **Note**: Storage is NOT required! Audio processing uses a free method (no cloud storage billing)

### Step 1.4: Create Google Gemini API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable API:
   - "Generative AI API" ONLY (for analysis)
4. Go to "Credentials"
5. Click "Create Credentials" > "API Key"
6. Copy your API Key
7. (Optional) Restrict key to "Generative AI API" for security

⚠️ **Important**: Do NOT enable Cloud Speech-to-Text (requires billing). We use browser Web Speech API instead (free).

---

## Phase 2: Local Development Setup

### Step 2.1: Frontend Setup

```bash
# Navigate to frontend directory
cd "d:\Project CEDT\frontend"

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local

# Edit .env.local with your Firebase credentials
# Use Notepad or your IDE:
```

Edit `frontend/.env.local`:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=pisa-thinking-skills.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pisa-thinking-skills
VITE_FIREBASE_STORAGE_BUCKET=pisa-thinking-skills.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FUNCTIONS_URL=http://localhost:5000
```

### Step 2.2: Backend Functions Setup

```bash
# Navigate to functions directory
cd "../backend/functions"

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local

# Edit .env.local with your Google API key
```

Edit `backend/functions/.env.local`:
```env
GOOGLE_API_KEY=your_actual_google_api_key
GCP_PROJECT_ID=pisa-thinking-skills
GEMINI_MODEL=gemini-pro
```

### Step 2.3: Firebase CLI Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase (for deployment only, not needed for local development)
firebase login
```

✅ **Note**: For local development with the emulator, no project setup needed. The emulator runs independently.

---

## ⭐ Free Audio Processing (No Billing Required!)

This application uses **completely free methods** that require NO billing account:

✅ **What you get:**
- Audio recorded locally in browser
- Transcribed using browser Web Speech API (completely free, no API key needed)
- Analyzed by Gemini AI (Google free tier eligible)
- Zero storage costs, zero transcription costs

**Audio Processing Flow:**
1. Record audio locally → Uses your browser's microphone
2. Transcribe with Web Speech API → Built into browser, no external API
3. Analyze with Gemini → Uses your Gemini API key (free tier: 60 requests/min)

**Cost breakdown:**
- **Storage**: $0 (processed in-memory, never stored)
- **Transcription**: $0 (browser Web Speech API, completely free)
- **Analysis**: $0 (Gemini AI free tier eligible)

**Why Web Speech API?**
- ✅ No API key required
- ✅ No billing account needed
- ✅ Works offline in most cases
- ✅ Works in Chrome, Edge, Safari, Firefox
- ✅ Supports 100+ languages including Thai

---

## Phase 3: Run Development Servers

Open **3 Terminal Windows**:

**Terminal 1: Firebase Emulator**
```bash
cd "d:\Project CEDT"
firebase emulators:start
```
This starts:
- Firestore Emulator on port 8080
- Storage Emulator on port 9199
- Functions Emulator on port 5001

**Terminal 2: Backend Functions**
```bash
cd "d:\Project CEDT\backend\functions"
npm run dev
```
Runs on `http://localhost:5000`

**Terminal 3: Frontend**
```bash
cd "d:\Project CEDT\frontend"
npm run dev
```
Opens browser at `http://localhost:5173`

---

## Phase 4: Test the Application

1. **Open Frontend**: http://localhost:5173
2. **Click "Practice"** to see a sample question
3. **Click "Start Recording"** to test microphone
4. **Speak a test answer**, then click "Stop Recording"
5. **Click "Submit Answer"**
   - Audio is processed locally (no upload, no storage costs)
   - Converts to base64 and sends to backend
   - Transcribes speech to text
   - Analyzes with Gemini AI
   - Shows results

---

## Phase 5: Deploy to Production

### Step 5.1: Build Frontend

```bash
cd "d:\Project CEDT\frontend"

# Build for production
npm run build

# This creates 'dist' folder with optimized files
```

### Step 5.2: Deploy to Firebase

```bash
# From project root
firebase deploy

# Or deploy specific services:
firebase deploy --only functions      # Deploy functions only
firebase deploy --only hosting        # Deploy frontend only
```

Your app will be available at:
- **Frontend**: https://pisa-thinking-skills.web.app
- **Backend**: https://your-region-pisa-thinking-skills.cloudfunctions.net

### Step 5.3: Update Production Config

Update `firebase.json`:
```json
{
  "projects": {
    "default": "pisa-thinking-skills"
  }
}
```

---

## Troubleshooting

### Issue: Microphone Permission Denied
**Solution**: 
- Use HTTPS (Firefox/Chrome require HTTPS for microphone)
- Clear browser cache
- Check browser permissions

### Issue: "Cannot find module" errors
**Solution**:
```bash
# In the affected directory:
rm -r node_modules
npm install
```

### Issue: Firebase Authentication fails
**Solution**:
- Verify API key in `.env.local`
- Check Firebase project ID matches
- Restart frontend dev server

### Issue: Gemini API returns empty
**Solution**:
- Verify `GOOGLE_API_KEY` is correct
- Check API quotas in Google Cloud Console
- Ensure Generative AI API is enabled

### Issue: Audio Transcription fails
**Solution**:
- Check internet connection
- Verify `GOOGLE_API_KEY` is set correctly in `.env.local`
- Ensure Cloud Speech-to-Text API is enabled in Google Cloud Console
- Check browser console for detailed error

---

## Useful Commands

```bash
# Frontend
npm run dev                # Start dev server
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Check code style

# Backend Functions
npm run dev              # Run functions locally
npm run build            # Compile TypeScript
firebase deploy --only functions  # Deploy functions

# Firebase
firebase emulators:start  # Start all emulators
firebase emulators:start --only firestore  # Just Firestore
firebase deploy          # Deploy everything
firebase functions:log   # View function logs
firebase logout          # Logout from Firebase
```

---

## File Structure Summary

```
Project CEDT/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── AudioRecorder.tsx
│   │   │   └── AnalysisDisplay.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   └── QuestionPage.tsx
│   │   ├── services/            # APIs
│   │   │   ├── firebase.ts
│   │   │   ├── storage.ts
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx              # Main component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Styles
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   └── functions/
│       ├── src/
│       │   ├── index.ts              # Main functions
│       │   ├── analyzeAnswer.ts      # Gemini analysis
│       │   ├── transcribeAudio.ts    # Speech-to-text
│       │   ├── database.ts
│       │   └── types.ts
│       ├── .env.example
│       └── package.json
│
├── config/
│   ├── FIRESTORE_SCHEMA.md      # Database structure
│   └── ENVIRONMENT.md           # Setup guide
│
├── docs/
│   └── API.md                   # API documentation
│
├── README.md                    # Main documentation
├── GETTING_STARTED.md          # This file
├── firebase.json
├── .firebaserc
└── .gitignore
```

---

## Next Steps

1. ✅ Complete Phase 1-5 setup above
2. 📝 Create sample questions in Firestore
3. 👥 Set up user authentication
4. 📊 Build teacher dashboard
5. 🚀 Deploy to production
6. 📈 Monitor logs and analytics

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Generative AI Documentation](https://ai.google.dev/)
- [Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)

---

## Support

For issues:
1. Check the Troubleshooting section above
2. Review Firebase logs: `firebase functions:log`
3. Check browser console (F12)
4. Check terminal output for error messages

---

**Last Updated**: February 28, 2026
**Version**: 1.0.0
