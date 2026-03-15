# PISA Analytical Thinking Skills Assessment Platform

A comprehensive web application designed to evaluate Thai students' analytical thinking skills using PISA-style questions with voice input and AI-powered analysis, powered by Google Cloud and Firebase.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

PISA Insight is an intelligent assessment platform that evaluates students' analytical thinking capabilities through voice-based answers to standardized questions. The application uses cutting-edge AI technology to provide real-time feedback, thinking level classification, and personalized learning suggestions.

**Key Objectives:**
- Assess students' PISA-aligned thinking skills (Levels 1-4)
- Provide immediate, constructive feedback on analytical abilities
- Support teachers with classroom management and analytics
- Enable self-paced learning with progress tracking

---

## 🚀 Technology Stack

### **Frontend Architecture**
| Technology | Version | Purpose |
|----------|---------|---------|
| **React** | 18.2.0 | UI framework for building interactive components |
| **TypeScript** | 5.2.0 | Type-safe JavaScript for better code quality |
| **Vite** | 5.0.0 | Modern build tool with HMR and optimized bundling |
| **React Router** | 6.20.0 | Client-side routing and navigation |
| **Axios** | 1.6.0 | HTTP client for API requests |
| **Firebase SDK** | 10.5.0 | Authentication, real-time data, and file storage |

**Frontend Build & Dev Tools:**
- `@vitejs/plugin-react`: Vite plugin for React JSX support
- `ESLint`: Code linting and quality enforcement
- Path aliases (`@/`) for cleaner imports

### **Backend & Cloud Services**
| Technology | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 20 | JavaScript runtime environment |
| **Express.js** | 4.18.0 | Web framework for HTTP server |
| **TypeScript** | 5.2.0 | Type-safe server-side development |
| **Firebase Functions** | 4.8.0 | Serverless backend functions |
| **Firebase Admin SDK** | 12.0.0 | Server-side Firebase operations |
| **Google Cloud Functions** | 3.5.0 | Serverless function framework |
| **Google Generative AI SDK** | 0.3.0 | Gemini API client for AI analysis |

**Environment & Configuration:**
- `dotenv`: 17.3.1 - Environment variable management

### **Database & Cloud Storage**
| Service | Purpose |
|---------|---------|
| **Firestore** | NoSQL database for real-time data synchronization |
| **Firebase Authentication** | User identity management and authentication |
| **Firebase Storage** | Cloud storage for audio files and media |
| **Firebase Hosting** | CDN-based frontend deployment |

### **AI & Machine Learning**
| Service | Purpose |
|---------|---------|
| **Google Gemini API** | AI-powered answer analysis and feedback generation |
| **Google Cloud Speech-to-Text** | Speech recognition with Thai language support |
| **Google Cloud Language API** | Natural language processing (optional) |

### **Deployment & Infrastructure**
- **Firebase**: Primary cloud platform (functions, hosting, database)
- **Render**: Alternative deployment with Node.js runtime
- **Docker**: Containerization (via Render integration)

---

## ✨ Features

### **Student Features**
- 🎤 **Voice Recording**: High-quality audio capture using Web Audio API
- 📝 **Auto-Transcription**: Real-time speech-to-text with Thai language support
- 🤖 **AI Feedback**: Instant analysis powered by Google Gemini
- 📊 **Thinking Level Classification**: Automatic scoring (Levels 1-4)
- 💡 **Smart Suggestions**: AI-generated improvement recommendations
- 📈 **Progress Dashboard**: Track improvement over time with analytics
- 🎓 **Example Answers**: View reference answers and best practices
- 🌐 **Internationalization**: Multi-language UI support

### **Teacher Features**
- 📋 **Classroom Management**: Create and manage classrooms
- ❓ **Question Creation**: Add and organize PISA-style questions
- 👥 **Student Monitoring**: View and review all student responses
- 📊 **Analytics Dashboard**: Real-time class progress metrics
- 📈 **Performance Reports**: Detailed thinking level distributions
- 🎯 **Student Insights**: Identify areas of strength and improvement
- 💾 **Data Export**: Download reports and analytics

### **System Features**
- 🔐 **Secure Authentication**: Firebase-based user management
- 🌍 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: Firestore live data synchronization
- 📱 **PWA Ready**: Progressive web app capabilities
- 🔒 **Security Rules**: Firestore rules for data protection
- ☁️ **Cloud Infrastructure**: Serverless, scalable architecture

---

## 📁 Project Structure

```
Project CEDT/
│
├── frontend/                          # React + TypeScript UI Application
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── AnalysisDisplay.tsx   # Display AI analysis results
│   │   │   ├── AudioRecorder.tsx     # Audio recording interface
│   │   │   └── ProtectedRoute.tsx    # Authentication wrapper
│   │   ├── pages/                    # Page components
│   │   │   ├── Auth.tsx              # Login/signup
│   │   │   ├── Classroom*.tsx        # Classroom management pages
│   │   │   ├── CreateClassroomPage.tsx
│   │   │   ├── HomePage.tsx          # Main dashboard
│   │   │   ├── PracticePage.tsx      # Practice interface
│   │   │   ├── QuestionPage.tsx      # Question display
│   │   │   └── LandingPage.tsx       # Public landing page
│   │   ├── services/                 # API & firebase services
│   │   │   ├── api*.ts               # Backend API calls
│   │   │   └── firebase.ts           # Firebase configuration
│   │   ├── contexts/                 # React contexts
│   │   │   ├── AuthContext.tsx       # Authentication state
│   │   │   └── LanguageContext.tsx   # i18n state management
│   │   ├── types/                    # TypeScript definitions
│   │   ├── App.tsx                   # Root component
│   │   ├── main.tsx                  # Entry point
│   │   ├── index.css                 # Global styles
│   │   └── i18n.ts                   # Internationalization config
│   ├── public/                        # Static assets
│   │   └── assets/
│   │       └── propositions/         # Question assets
│   ├── package.json                  # Frontend dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── vite.config.ts                # Vite build config
│   └── index.html                    # HTML template
│
├── backend/                           # Firebase Cloud Functions
│   └── functions/
│       ├── src/
│       │   ├── index.ts              # Express app & function exports
│       │   ├── analyzeAnswer.ts      # Gemini AI analysis logic
│       │   ├── transcribeAudio.ts    # Speech-to-text processing
│       │   ├── database.ts           # Firestore operations
│       │   └── types.ts              # TypeScript type definitions
│       ├── lib/                      # Compiled JavaScript (auto-generated)
│       ├── package.json              # Backend dependencies
│       └── tsconfig.json             # TypeScript config
│
├── config/                            # Configuration files
│   ├── FIRESTORE_SCHEMA.md           # Firestore collections & schema
│   └── ENVIRONMENT.md                # Environment variable setup
│
├── docs/                              # Documentation
│   └── API.md                        # API endpoint documentation
│
├── firebase.json                      # Firebase project config
├── firestore.rules                    # Firestore security rules
├── render.yaml                        # Render deployment config
├── package.json                       # Root-level scripts
├── start-all.bat                      # Windows startup script
├── start-all.ps1                      # PowerShell startup script
│
└── 📄 Documentation Files
    ├── README.md                      # This file
    ├── GETTING_STARTED.md             # Quick start guide
    ├── QUICK_START.md                 # Rapid setup
    ├── PROJECT_DOCUMENTATION.md       # Detailed docs
    ├── DATABASE_SCHEMA.md             # Schema reference
    ├── DATABASE_IMPLEMENTATION.md     # Implementation details
    ├── FIRESTORE_RULES_SETUP.md       # Firestore security
    ├── CLASSROOM_SYSTEM_FIXES.md      # Bug fixes & issues
    ├── CLASSROOM_TESTING_GUIDE.md     # Testing procedures
    ├── COMPLETION_REPORT.md           # Project status
    ├── FEATURE_ROADMAP.md             # Future features
    ├── QUICK_COMMANDS.md              # Common commands
    └── TODO.md                        # Task list

```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **npm**: v7 or higher (ships with Node.js)
- **Git**: v2.0 or higher ([Download](https://git-scm.com/))
- **Firebase CLI**: v11.0.0+ (`npm install -g firebase-tools`)

### Cloud Accounts Required:
1. **Firebase Project** - [Create at firebase.google.com](https://firebase.google.com/console)
2. **Google Cloud Project** - [Create at console.cloud.google.com](https://console.cloud.google.com)
3. **Google Cloud APIs Enabled:**
   - Cloud Speech-to-Text API
   - Google Generative AI API (Gemini)
   - Cloud Storage API

---

## 🎯 Getting Started

### Step 1: Clone & Navigate to Project

```bash
git clone <repository-url>
cd "d:\Project CEDT"
```

### Step 2: Install Root Dependencies

```bash
npm install
```

### Step 3: Setup Frontend

```bash
cd frontend
npm install
```

Create `.env.local` file in the `frontend/` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend Functions URL
VITE_FUNCTIONS_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### Step 4: Setup Backend Functions

```bash
cd ../backend/functions
npm install
```

Create `.env.local` file in the `backend/functions/` directory:

```env
# Google Cloud Configuration
GOOGLE_API_KEY=your_google_api_key
GCP_PROJECT_ID=your_google_cloud_project_id
FIRESTORE_PROJECT_ID=your_firebase_project_id

# Server Configuration
PORT=5000
NODE_ENV=development
```

Start the backend development server:

```bash
npm run dev
```

Backend will be available at: **http://localhost:5000**

### Step 5: Configure Firebase Emulator (Optional but Recommended)

```bash
firebase init
firebase emulators:start
```

This starts local Firestore, Authentication, and Storage emulators for local development.

### Step 6: Verify Setup

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Firebase Emulator UI: http://localhost:4000

---

## 🛠️ Development Guide

### Running All Services

```bash
# From root directory
npm run dev
```

This runs frontend and backend concurrently.

### Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Backend Development

```bash
cd backend/functions

# Start dev server
npm run dev

# Build TypeScript
npm run build

# Run in production mode
npm start
```

### TypeScript Compilation

Both frontend and backend use TypeScript 5.2 with strict mode enabled:

```bash
# Frontend
cd frontend && npx tsc --noEmit

# Backend
cd backend/functions && npx tsc --noEmit
```

### Project Scripts

From the root directory:

```bash
npm run dev              # Start frontend + backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run build            # Build both frontend and backend
npm run build:frontend   # Build frontend only
npm run deploy           # Deploy to Firebase
```

---

## 🚀 Deployment

### Deploying to Firebase

#### Prerequisites:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

#### Deployment Steps:

**Deploy Everything:**
```bash
npm run deploy
```

**Deploy Only Functions:**
```bash
firebase deploy --only functions
```

**Deploy Only Hosting (Frontend):**
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

**Deploy with Custom Message:**
```bash
firebase deploy --message "Release version 1.0.0"
```

### Deploying to Render (Alternative)

Render.yaml is pre-configured for Node.js runtime:

```bash
# Git push to deploy
git push origin master
```

The `render.yaml` configuration:
- Builds backend functions with `npm install && npm run build`
- Runs Express server on PORT 10000
- Automatically deploys on git push

### Environment Variables for Production

Set in Firebase Console or Render dashboard:
```env
GOOGLE_API_KEY=...
GCP_PROJECT_ID=...
LOCATION=us-central1
```

---

## 📡 API Documentation

### Core Endpoints

#### 1. Analyze Student Answer

**Endpoint:** `POST /analyzeAnswer`

Analyzes a student's spoken answer using Gemini AI to generate feedback and thinking level score.

**Request:**
```json
{
  "transcription": "Student's transcribed answer text",
  "questionId": "q1",
  "referenceAnswer": "Expected or example answer",
  "scoringGuideline": "Scoring rubric and criteria",
  "studentId": "student-123",
  "audioUrl": "https://storage.googleapis.com/...audio.webm"
}
```

**Response:**
```json
{
  "id": "analysis-12345",
  "studentId": "student-123",
  "questionId": "q1",
  "thinkingLevel": 3,
  "score": 78,
  "feedback": "Your answer demonstrates analytical thinking by identifying key patterns...",
  "suggestedAnswer": "An improved version with more details...",
  "strengths": [
    "Identified main concept",
    "Provided relevant examples"
  ],
  "improvements": [
    "Add more evidence",
    "Expand on implications"
  ],
  "timestamp": "2026-03-15T10:30:00Z"
}
```

#### 2. Transcribe Audio

**Endpoint:** `POST /transcribeAudio`

Converts audio files to text using Google Cloud Speech-to-Text with Thai language support.

**Request:**
```json
{
  "audioUrl": "https://storage.googleapis.com/...audio.webm"
}
```

**Response:**
```json
{
  "transcription": "ข้อความที่ถูกแปลงจากเสียง...",
  "confidence": 0.95,
  "language": "th-TH",
  "duration": 25.5
}
```

#### 3. Save Answer to Database

**Endpoint:** `POST /saveAnswer`

Saves analyzing results and audio references to Firestore.

**Request:**
```json
{
  "studentId": "student-123",
  "questionId": "q1",
  "transcription": "Student's answer",
  "audioUrl": "https://storage.googleapis.com/...audio.webm",
  "analysis": { /* analysis object from analyzeAnswer */ }
}
```

**Response:**
```json
{
  "success": true,
  "answerId": "answer-id-123",
  "savedAt": "2026-03-15T10:30:00Z"
}
```

### Error Handling

All endpoints return HTTP status codes:
- `200` - Success
- `400` - Bad request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `500` - Server error

Error response format:
```json
{
  "error": true,
  "message": "Description of what went wrong",
  "code": "ERROR_CODE"
}
```

---

## 💾 Database Schema

Firestore collections structure:

### Collections:

**users**
```
users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - role: "student" | "teacher" | "admin"
  - createdAt: timestamp
  - profilePicture: string (URL)
```

**classrooms**
```
classrooms/{classroomId}
  - name: string
  - teacherId: string
  - description: string
  - code: string (unique)
  - createdAt: timestamp
  - students: string[] (userIds)
  - questions: string[] (questionIds)
```

**questions**
```
questions/{questionId}
  - text: string
  - topic: string
  - difficulty: 1-4
  - referenceAnswer: string
  - scoringGuideline: string
  - createdBy: string (teacherId)
  - createdAt: timestamp
```

**answers**
```
answers/{answerId}
  - studentId: string
  - questionId: string
  - transcription: string
  - audioUrl: string
  - analysis: {
      thinkingLevel: 1-4,
      score: 0-100,
      feedback: string,
      suggestions: string[]
    }
  - createdAt: timestamp
```

**classroomProgress**
```
classroomProgress/{classroomId}/students/{studentId}
  - totalAnswers: number
  - averageScore: number
  - thinkingLevels: { 1: n, 2: n, 3: n, 4: n }
  - lastActivity: timestamp
```

See [FIRESTORE_SCHEMA.md](config/FIRESTORE_SCHEMA.md) for complete schema documentation.

---

## 🔧 Troubleshooting

### Microphone Access Issues

**Problem:** "Microphone permission denied"

**Solutions:**
1. Check browser permissions (Settings → Privacy → Microphone)
2. Use HTTPS in production
3. Clear browser cache and cookies
4. Try a different browser
5. Check if microphone is available on your device

### Audio Upload Failures

**Problem:** Audio files fail to upload to Firebase Storage

**Solutions:**
1. Verify Firebase Storage is enabled in Console
2. Check internet connection stability
3. Verify file size is under 100MB
4. Check Firestore security rules allow storage uploads
5. Review browser console for detailed error messages

### Transcription Not Working

**Problem:** Speech-to-text returns empty or errors

**Solutions:**
1. Enable Cloud Speech-to-Text API in Google Cloud Console
2. Verify `GOOGLE_API_KEY` is correctly set in `.env`
3. Check API quotas (Cloud Console → APIs & Services → Quotas)
4. Test with clear, Thai language speech
5. Verify billing is enabled for the Cloud project
6. Check Cloud logs: `gcloud functions logs read transcribeAudio --limit 50`

### AI Analysis (Gemini) Errors

**Problem:** Analysis returns empty or error response

**Solutions:**
1. Verify Generative AI API is enabled in Google Cloud
2. Check Gemini API key has correct permissions
3. Verify API quotas: `gcloud services usage list --enabled`
4. Review detailed error in Cloud Functions logs
5. Test Gemini API directly: [ai.google.dev/tutorials](https://ai.google.dev/tutorials)

### Firebase Authentication Issues

**Problem:** Users cannot login or signup

**Solutions:**
1. Verify Firebase Auth is enabled (Console → Authentication)
2. Check email/password provider is enabled
3. Clear browser storage: `localStorage.clear()`
4. Verify CORS settings if using custom domain
5. Check Authentication logs in Firebase Console

### Firestore Connectivity

**Problem:** Database operations timeout or fail

**Solutions:**
1. Verify Firestore database is created
2. Check internet connection
3. Review Firestore security rules: `firebase deploy --only firestore:rules`
4. Check Firestore quotas in Google Cloud Console
5. Use Firebase Emulator for local testing

### Build & Deployment Errors

**Problem:** `npm run build` fails

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run lint

# Build with verbose output
npm run build -- --verbose
```

**Firebase Deploy Fails:**
```bash
# Clear Firebase cache
firebase delete

# Re-initialize Firebase
firebase init

# Deploy with verbose logging
firebase deploy --debug
```

---

## 📚 Documentation References

- **API Details**: See [docs/API.md](docs/API.md)
- **Database Schema**: See [config/FIRESTORE_SCHEMA.md](config/FIRESTORE_SCHEMA.md)
- **Environment Setup**: See [config/ENVIRONMENT.md](config/ENVIRONMENT.md)
- **Quick Start**: See [QUICK_START.md](QUICK_START.md)
- **Getting Started**: See [GETTING_STARTED.md](GETTING_STARTED.md)

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am "Add your feature"`
3. Push to repository: `git push origin feature/your-feature`
4. Create a Pull Request with description

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types without `// @ts-ignore`
- **React**: Use functional components and hooks
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Comments**: JSDoc for public functions and APIs
- **Testing**: Include unit tests for new features

### Commits

Follow conventional commits format:
```
feat: Add new feature
fix: Fix bug
docs: Documentation changes
refactor: Code refactoring
test: Add tests
chore: Build and CI changes
```

---

## 📄 License

This project is created for educational purposes at the CEDT (Center for Educational Development and Technologies).

---

## 📞 Support & Contact

For questions, issues, or support:

1. **Check Documentation**: Review docs/ and config/ folders
2. **Check Issues**: Look at project GitHub issues
3. **Contact Administrator**: Reach out to your project manager

---

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Generative AI API](https://ai.google.dev/)
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated**: March 15, 2026  
**Project Version**: 1.0.0  
**Node.js Support**: v16+  
**Status**: Active Development

## Prerequisites

- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **Firebase Project**: Create at [firebase.google.com](https://firebase.google.com)
- **Google Cloud Project**: Create at [console.cloud.google.com](https://console.cloud.google.com)
- **Git**: For version control

## Quick Start

### 1. Clone the Project
```bash
cd "d:\Project CEDT"
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FUNCTIONS_URL=http://localhost:5000
```

Run development server:
```bash
npm run dev
```

Open http://localhost:5173

### 3. Setup Backend Functions

```bash
cd ../backend/functions
npm install
```

Create `.env.local`:
```env
GOOGLE_API_KEY=your_google_api_key
GCP_PROJECT_ID=your_project_id
```

Run locally:
```bash
npm run dev
```

### 4. Setup Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase emulators:start
```

### 5. Deploy to Production

```bash
# Deploy functions
firebase deploy --only functions

# Build and deploy frontend to Firebase Hosting (optional)
cd ../frontend
npm run build
firebase deploy --only hosting
```

## API Endpoints

### POST `/analyzeAnswer`
Analyzes a student's answer using Gemini AI.

**Request:**
```json
{
  "transcription": "Student's spoken answer...",
  "questionId": "q1",
  "referenceAnswer": "Expected answer...",
  "scoringGuideline": "Scoring criteria...",
  "studentId": "student-123",
  "audioUrl": "https://storage.url/audio.webm"
}
```

**Response:**
```json
{
  "id": "analysis-id",
  "studentId": "student-123",
  "questionId": "q1",
  "thinkingLevel": 3,
  "score": 78,
  "feedback": "Your answer shows analytical thinking...",
  "suggestedAnswer": "A better version of the answer...",
  "strengths": ["Identified main concept", "Explained mechanism"],
  "improvements": ["Add examples", "Expand on implications"]
}
```

### POST `/transcribeAudio`
Converts audio to text using Google Cloud Speech-to-Text.

**Request:**
```json
{
  "audioUrl": "https://storage.url/audio.webm"
}
```

**Response:**
```json
{
  "transcription": "Transcribed text...",
  "confidence": 0.95
}
```

## Database Schema

See [FIRESTORE_SCHEMA.md](config/FIRESTORE_SCHEMA.md) for detailed information on:
- Collections structure
- Data models
- Security rules
- Example documents

## Environment Setup

See [ENVIRONMENT.md](config/ENVIRONMENT.md) for:
- Firebase configuration
- Google API key setup
- Cloud credentials
- Local emulation guide

## Development Workflow

### 1. Local Development
```bash
# Terminal 1: Firebase Emulator
firebase emulators:start

# Terminal 2: Backend Functions
cd backend/functions
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

### 2. Testing
```bash
# Frontend
npm test

# Backend Functions
npm test
```

### 3. Build for Production
```bash
# Frontend
npm run build

# Backend (automatic during deploy)
firebase deploy
```

## PISA Thinking Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Basic Understanding | Student demonstrates basic factual knowledge |
| 2 | Simple Reasoning | Student makes basic connections and simple explanations |
| 3 | Analytical Thinking | Student analyzes complex situations and makes inferences |
| 4 | Complex Reasoning | Student evaluates evidence and builds sophisticated arguments |

## Key Features Implementation

### Audio Recording
- Uses Web Audio API for browser microphone access
- Records in WebM Opus format (16kHz, mono)
- Automatic upload to Firebase Storage

### Speech-to-Text
- Google Cloud Speech-to-Text API
- Thai language support (`th-TH`)
- Confidence score tracking

### AI Analysis
- Google Gemini Pro model
- Evaluates thinking depth and quality
- Generates feedback and example answers
- Assigns PISA thinking levels

### Security
- Firebase Authentication for users
- Firestore security rules for data access
- Storage rules for audio file protection
- HTTPS only for all API calls

## Troubleshooting

### Microphone Permission Denied
- Check browser permissions for microphone
- Use HTTPS in production
- Clear browser cache and retry

### Audio Upload Fails
- Verify Firebase Storage is configured
- Check internet connection
- Ensure audio file size < 100MB

### Transcription Errors
- Verify Google Cloud Speech-to-Text API is enabled
- Check API quotas and billing
- Test with sample audio files

### AI Analysis Returns Empty
- Verify Gemini API key is valid
- Check API quotas
- Review response format in `analyzeAnswer.ts`

## Support & Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Generative AI](https://ai.google.dev/)
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)

## License

This project is created for educational purposes.

## Contact

For questions or support, contact your project administrator.

---

**Last Updated**: February 28, 2026
**Version**: 1.0.0
