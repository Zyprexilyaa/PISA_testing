# Firebase Functions Backend

This directory contains the Firebase Functions that power the backend of the PISA Insight Analyzer.

## File Structure

```
functions/
├── src/
│   ├── index.ts                 # Entry point for Functions
│   ├── analyzeAnswer.ts         # AI answer analysis using Gemini
│   ├── transcribeAudio.ts       # Speech-to-text conversion
│   ├── database.ts              # Firestore operations
│   └── types.ts                 # TypeScript type definitions
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── .env.local                   # Environment variables (local only)
```

## Environment Variables

Create a `.env.local` file in the functions directory:

```
GOOGLE_API_KEY=your_google_ai_api_key
GEMINI_MODEL=gemini-pro
GCP_PROJECT_ID=your_gcp_project_id
```

## Functions

### analyzeAnswer()
Analyzes a student's answer and returns:
- Thinking level (1-4)
- Score (0-100)
- Feedback
- Suggested answer
- Strengths and improvements

### transcribeAudio()
Converts audio file to text using Google Cloud Speech-to-Text.

## Deployment

```bash
firebase deploy --only functions
```
