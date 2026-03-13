# PISA Insight Web Application - Complete Setup Guide

A web application that evaluates Thai students' analytical thinking skills using PISA-style questions with voice input and AI-powered analysis.

## Project Structure

```
Project CEDT/
├── frontend/                  # React + TypeScript UI
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # Firebase and API services
│   │   ├── types/             # TypeScript definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                   # Firebase Functions
│   └── functions/
│       ├── src/
│       │   ├── index.ts           # Function entry point
│       │   ├── analyzeAnswer.ts   # Gemini AI analysis
│       │   ├── transcribeAudio.ts # Speech-to-text
│       │   ├── database.ts        # Firestore operations
│       │   └── types.ts           # TypeScript types
│       ├── package.json
│       └── tsconfig.json
│
├── config/
│   ├── FIRESTORE_SCHEMA.md    # Database structure
│   └── ENVIRONMENT.md         # Setup instructions
│
└── docs/
    └── API.md                 # API documentation
```

## Features

### 1. **Student Features**
- 🎤 **Voice Recording**: Record answers using browser microphone
- 📝 **Auto-Transcription**: Convert speech to text (Thai language support)
- 🤖 **AI Analysis**: Get instant feedback on thinking quality
- 📊 **Thinking Levels**: See your analytical thinking level (1-4)
- 💡 **Smart Feedback**: Learn from example answers and suggestions
- 📈 **Progress Tracking**: Monitor improvement over time

### 2. **Teacher Features**
- 📋 **Question Management**: Create and manage PISA-style questions
- 👥 **Student Answers**: View and analyze all student responses
- 📊 **Analytics Dashboard**: Track class progress and thinking levels
- 📈 **Performance Reports**: Identify students needing support

## Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with responsive design
- **APIs**: Firebase SDK, Axios

### Backend
- **Runtime**: Google Cloud Functions
- **Language**: TypeScript/Node.js
- **AI**: Google Gemini API
- **Speech-to-Text**: Google Cloud Speech-to-Text API

### Database & Storage
- **Database**: Firestore (NoSQL)
- **File Storage**: Firebase Storage
- **Authentication**: Firebase Authentication

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
