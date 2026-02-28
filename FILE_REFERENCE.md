# Project File Reference Guide

## Quick Navigation

This guide helps you quickly find and understand what each file does.

---

## 📁 Root Directory

| File | Purpose |
|------|---------|
| `README.md` | **START HERE** - Main project documentation |
| `GETTING_STARTED.md` | Step-by-step setup instructions (5 phases) |
| `PROJECT_SETUP_SUMMARY.md` | Overview of what has been created |
| `FEATURE_ROADMAP.md` | Planned features and development timeline |
| `FILE_REFERENCE.md` | This file - guide to all files |
| `.env.example` | Template for root environment variables |
| `.gitignore` | Files to exclude from Git |
| `.firebaserc` | Firebase project configuration |
| `firebase.json` | Firebase service configuration |

---

## 📂 frontend/ - React User Interface

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `tsconfig.node.json` | TypeScript config for build tools |
| `vite.config.ts` | Vite build configuration |
| `.env.example` | Template for environment variables |

### Source Code: src/

#### Main Entry
| File | Purpose |
|------|---------|
| `main.tsx` | React app entry point - renders App to DOM |
| `App.tsx` | Main application component - handles routing and state |
| `index.css` | **600+ lines** - Global styles and responsive design |

#### Components (src/components/)
| File | Purpose | Size |
|------|---------|------|
| `AudioRecorder.tsx` | Voice recording component with playback | ~180 lines |
| `AnalysisDisplay.tsx` | Displays AI analysis results, expandable sections | ~150 lines |

#### Pages (src/pages/)
| File | Purpose | Size |
|------|---------|------|
| `HomePage.tsx` | Landing page, features overview, thinking levels | ~120 lines |
| `QuestionPage.tsx` | Main question interface, answer submission | ~130 lines |

#### Services (src/services/)
**These handle communication with backend and Firebase**

| File | Purpose | Size |
|------|---------|------|
| `firebase.ts` | Firebase initialization and configuration | ~20 lines |
| `storage.ts` | Audio file upload to Firebase Storage | ~60 lines |
| `api.ts` | API calls to backend functions | ~60 lines |

#### Types (src/types/)
| File | Purpose |
|------|---------|
| `index.ts` | TypeScript interfaces for all data models |

#### Static Files (public/)
| File | Purpose |
|------|---------|
| `index.html` | HTML template for the app |

---

## 📂 backend/functions/ - Firebase Functions Backend

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Node dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `.env.example` | Template for environment variables |
| `README.md` | Backend documentation |

### Source Code: src/

| File | Purpose | Size |
|------|---------|------|
| `index.ts` | **Express.js API server** - 3 endpoints, CORS | ~130 lines |
| `analyzeAnswer.ts` | **Gemini AI analysis** - thinking level, feedback, suggestions | ~100 lines |
| `transcribeAudio.ts` | **Speech-to-text** - Google Cloud integration, Thai support | ~80 lines |
| `database.ts` | **Firestore operations** - save and retrieve data | ~80 lines |
| `types.ts` | **TypeScript interfaces** - request/response types | ~60 lines |

---

## 📂 config/ - Configuration & Schemas

| File | Purpose | Size |
|------|---------|------|
| `FIRESTORE_SCHEMA.md` | **Database structure documentation** - All collections with examples | ~250 lines |
| `ENVIRONMENT.md` | **Environment setup guide** - API keys, credentials, setup | ~150 lines |

---

## 📂 docs/ - Documentation

| File | Purpose | Size |
|------|---------|------|
| `API.md` | **Complete API documentation** - Endpoints, requests, responses, examples | ~350 lines |

---

## 🗺️ Application Flow

### User Flow
```
User Opens App
    ↓
HomePage (see features)
    ↓
Click "Practice" → QuestionPage
    ↓
Read Question
    ↓
Click Microphone → AudioRecorder
    ↓
Record Answer → Stop
    ↓
Click "Submit Answer"
    ↓
storage.ts: Upload audio to Firebase Storage
    ↓
api.ts: Call backend /transcribeAudio
    ↓
backend/transcribeAudio.ts: Google Speech-to-Text
    ↓
api.ts: Call backend /analyzeAnswer
    ↓
backend/analyzeAnswer.ts: Gemini AI analysis
    ↓
AnalysisDisplay: Show results
    ↓
database.ts: Save to Firestore
```

---

## 🔑 Key File Relationships

### Frontend Data Flow

```
App.tsx (state management)
    ├─ HomePage.tsx
    │   └─ Display features
    │
    └─ QuestionPage.tsx
        ├─ AudioRecorder.tsx → services/storage.ts
        ├─ services/api.ts → backend functions
        └─ AnalysisDisplay.tsx ← analysis results
```

### Backend Processing Flow

```
frontend/services/api.ts
    ↓
backend/functions/src/index.ts (Express)
    ├─ /analyzeAnswer endpoint
    │   ├─ analyzeAnswer.ts (Gemini AI)
    │   └─ database.ts (save results)
    │
    └─ /transcribeAudio endpoint
        └─ transcribeAudio.ts (Google Cloud)
```

### Data Persistence Flow

```
Frontend (React state)
    ↓
Backend (processes request)
    ↓
database.ts (Firestore operations)
    ↓
Firestore (stores data)
    ↓
Firebase Storage (stores audio)
```

---

## 📊 File Statistics

### By Directory

| Directory | Files | Lines | Purpose |
|-----------|-------|-------|---------|
| `frontend/src` | 7 | 1000+ | React UI |
| `backend/functions/src` | 5 | 500+ | API & AI logic |
| `config/` | 2 | 400+ | Documentation |
| `docs/` | 1 | 350+ | API docs |
| Root | 9 | 200+ | Configuration |
| **Total** | **24** | **2500+** | Complete app |

### By Type

| Type | Count | Purpose |
|------|-------|---------|
| React Components | 4 | UI |
| Services | 3 | APIs & Firebase |
| Functions | 5 | Backend logic |
| Types/Interfaces | 2 | Type definitions |
| CSS | 1 | Styling (600+ lines) |
| Documentation | 5 | Guides & reference |
| Config | 6 | Setup files |

---

## 🔍 Finding What You Need

### "How do I..."

**...record audio?**
→ `frontend/src/components/AudioRecorder.tsx`

**...upload audio?**
→ `frontend/src/services/storage.ts`

**...call the backend API?**
→ `frontend/src/services/api.ts`

**...analyze answers with AI?**
→ `backend/functions/src/analyzeAnswer.ts`

**...convert speech to text?**
→ `backend/functions/src/transcribeAudio.ts`

**...save data to Firestore?**
→ `backend/functions/src/database.ts`

**...understand the database structure?**
→ `config/FIRESTORE_SCHEMA.md`

**...set up environment variables?**
→ `config/ENVIRONMENT.md`

**...call the API endpoints?**
→ `docs/API.md`

**...set up the project?**
→ `GETTING_STARTED.md`

**...see what features are planned?**
→ `FEATURE_ROADMAP.md`

---

## 🚀 Common Development Tasks

### Add a New Component

1. Create file: `frontend/src/components/MyComponent.tsx`
2. Add types in: `frontend/src/types/index.ts` (if needed)
3. Import and use in: `frontend/src/pages/` or `frontend/src/App.tsx`

### Add a New API Endpoint

1. Create handler in: `backend/functions/src/myFunction.ts`
2. Import in: `backend/functions/src/index.ts`
3. Create wrapper client in: `frontend/src/services/api.ts`

### Add Database Collection

1. Define in: `config/FIRESTORE_SCHEMA.md`
2. Create save function in: `backend/functions/src/database.ts`
3. Update security rules in: `config/FIRESTORE_SCHEMA.md`

### Update Styles

1. Edit: `frontend/src/index.css`
2. Follow existing CSS variable system
3. Test responsiveness

### Deploy Changes

1. Frontend: `cd frontend && npm run build`
2. Backend: `firebase deploy --only functions`
3. Both: `firebase deploy`

---

## 📚 Documentation Files by Topic

### Setup & Installation
- `README.md` - Overview
- `GETTING_STARTED.md` - Step-by-step setup
- `config/ENVIRONMENT.md` - Environment variables

### Database & Storage
- `config/FIRESTORE_SCHEMA.md` - Database design
- `backend/functions/README.md` - Backend setup

### API & Integration
- `docs/API.md` - Complete API reference
- `frontend/src/services/api.ts` - API client implementation

### Code Organization
- This file (`FILE_REFERENCE.md`)
- `FEATURE_ROADMAP.md` - Future development plans
- `PROJECT_SETUP_SUMMARY.md` - What was created

---

## 🎯 Entry Points for Different Roles

### **Frontend Developer**
Start with:
1. `GETTING_STARTED.md` (setup)
2. `frontend/src/App.tsx` (understand structure)
3. `frontend/src/components/` (modify UI)
4. `frontend/src/services/` (API integration)

### **Backend Developer**
Start with:
1. `GETTING_STARTED.md` (setup)
2. `backend/functions/src/index.ts` (understand API)
3. `docs/API.md` (understand endpoints)
4. `backend/functions/src/analyzeAnswer.ts` (AI logic)
5. `config/FIRESTORE_SCHEMA.md` (database)

### **DevOps/Infrastructure**
Start with:
1. `firebase.json` (Firebase config)
2. `.firebaserc` (project mapping)
3. `GETTING_STARTED.md` Phase 1-5 (deployment)
4. `config/ENVIRONMENT.md` (credentials)

### **Project Manager**
Start with:
1. `README.md` (overview)
2. `PROJECT_SETUP_SUMMARY.md` (what was built)
3. `FEATURE_ROADMAP.md` (future features)
4. `docs/API.md` (technical capabilities)

---

## 🔗 File Dependencies

```
App.tsx
├─ imports: HomePage, QuestionPage
│
├─ HomePage.tsx
│   └─ imports: CSS from index.css
│
├─ QuestionPage.tsx
│   ├─ imports: AudioRecorder, AnalysisDisplay
│   ├─ imports: storage.ts, api.ts
│   └─ imports: types/index.ts
│
├─ AudioRecorder.tsx
│   └─ imports: types/index.ts
│
├─ AnalysisDisplay.tsx
│   └─ imports: types/index.ts
│
├─ services/firebase.ts
│   └─ uses: Firebase SDK
│
├─ services/storage.ts
│   └─ imports: firebase.ts
│
└─ services/api.ts
    └─ uses: axios, backend API
```

---

## 📝 Version Control

See `.gitignore` for files excluded from Git:
- node_modules/
- .env.local
- dist/
- build/
- .DS_Store

---

## ✅ Checklist for New Team Members

- [ ] Clone repository
- [ ] Read `README.md`
- [ ] Follow `GETTING_STARTED.md`
- [ ] Review `PROJECT_SETUP_SUMMARY.md`
- [ ] Understand architecture from this guide
- [ ] Review relevant file sections above
- [ ] Ask questions in team chat

---

## 🆘 Troubleshooting

**"I can't find where X is done"**
→ Use Ctrl+F to search this file

**"I need to modify X"**
→ Look in "Common Development Tasks" section

**"What files do I need to touch?"**
→ Check "File Dependencies" section

**"Where is the API defined?"**
→ `backend/functions/src/index.ts` and `docs/API.md`

**"How do I deploy?"**
→ `GETTING_STARTED.md` Phase 5

---

**Last Updated**: February 28, 2026
**Version**: 1.0.0
