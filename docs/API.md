# API Documentation

## Overview

This document describes the API endpoints for the PISA Insight Backend.

## Base URL

**Development**: `http://localhost:5000`
**Production**: `https://your-region-your-project.cloudfunctions.net`

## Authentication

All requests should include appropriate CORS headers. The backend is configured to accept requests from any origin in development.

## Endpoints

### 1. Analyze Student Answer

**Endpoint**: `POST /analyzeAnswer`

Analyzes a student's spoken answer and returns thinking level, score, feedback, and suggestions.

**Request Body**:
```json
{
  "transcription": "string - The student's answer text (already transcribed)",
  "questionId": "string - ID of the question",
  "referenceAnswer": "string - The reference/expected answer",
  "scoringGuideline": "string - Criteria for scoring the answer",
  "studentId": "string - ID of the student",
  "audioUrl": "string - URL of the audio file in Cloud Storage"
}
```

**Response**:
```json
{
  "id": "string - Analysis ID",
  "studentAnswerId": "string",
  "studentId": "string",
  "questionId": "string",
  "transcription": "string",
  "thinkingLevel": "number (1-4) - PISA thinking level",
  "score": "number (0-100) - Numerical score",
  "feedback": "string - Detailed feedback on the answer",
  "suggestedAnswer": "string - An improved answer example",
  "strengths": ["array of strings - What the student did well"],
  "improvements": ["array of strings - Areas to improve"],
  "analysisTimestamp": "string - ISO 8601 timestamp"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:5000/analyzeAnswer \
  -H "Content-Type: application/json" \
  -d '{
    "transcription": "Water pollution makes the water dirty and kills fish",
    "questionId": "q1",
    "referenceAnswer": "Water pollution introduces toxins that harm aquatic life...",
    "scoringGuideline": "Award points for: 1) identifying harms 2) explaining mechanisms",
    "studentId": "student-123",
    "audioUrl": "https://storage.firebase.com/audio.webm"
  }'
```

**Response Example**:
```json
{
  "id": "analysis-abc123",
  "studentAnswerId": "answer-xyz789",
  "studentId": "student-123",
  "questionId": "q1",
  "transcription": "Water pollution makes the water dirty and kills fish",
  "thinkingLevel": 2,
  "score": 45,
  "feedback": "Your answer identifies that pollution harms aquatic life, which is correct. However, it lacks depth in explaining the specific mechanisms and ecosystem impacts. Try to expand on how pollutants affect the food chain and entire ecosystems.",
  "suggestedAnswer": "Water pollution affects aquatic ecosystems by introducing toxic substances that poison organisms. This reduces oxygen levels in water (eutrophication) and disrupts food chains, causing widespread ecosystem collapse that also impacts human communities dependent on fishing and clean water.",
  "strengths": [
    "Correctly identified that pollution kills aquatic life",
    "Provided a concise answer"
  ],
  "improvements": [
    "Explain specific mechanisms like oxygen depletion",
    "Discuss ecosystem disruption and food chain effects",
    "Connect to human impact and community dependence"
  ],
  "analysisTimestamp": "2024-01-15T10:35:00Z"
}
```

---

### 2. Transcribe Audio

**Endpoint**: `POST /transcribeAudio`

Converts audio file to text using Google Cloud Speech-to-Text API with Thai language support.

**Request Body**:
```json
{
  "audioUrl": "string - URL of the audio file in Cloud Storage"
}
```

**Response**:
```json
{
  "transcription": "string - The transcribed text",
  "confidence": "number (0-1) - Confidence score of the transcription"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:5000/transcribeAudio \
  -H "Content-Type: application/json" \
  -d '{
    "audioUrl": "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/audio%2Fstudent-123%2Fq1.webm"
  }'
```

**Response Example**:
```json
{
  "transcription": "Water pollution affects ecosystems by introducing toxic substances",
  "confidence": 0.92
}
```

---

### 3. Health Check

**Endpoint**: `GET /health`

Checks if the API is running and accessible.

**Response**:
```json
{
  "status": "ok",
  "message": "PISA Insight Backend is running"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "string - Error message"
}
```

**Common Error Codes**:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `Missing required fields` | One or more required fields are missing |
| 401 | `Unauthorized` | User not authenticated |
| 403 | `Forbidden` | User lacks permission |
| 404 | `Not Found` | Resource not found |
| 500 | `Internal Server Error` | Server error occurred |

---

## Data Types

### ThinkingLevel
```typescript
type ThinkingLevel = 1 | 2 | 3 | 4;

// 1 = Basic Understanding
// 2 = Simple Reasoning
// 3 = Analytical Thinking
// 4 = Complex Reasoning
```

### Score
```typescript
type Score = number; // 0-100
```

---

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended to add:
- 100 requests per minute per IP address
- 1000 requests per hour per API key

---

## Example Workflow

1. **Student records answer** → Audio uploaded to Firebase Storage
2. **Frontend calls `/transcribeAudio`** → Returns transcribed text
3. **Frontend calls `/analyzeAnswer`** → Returns complete analysis
4. **Results displayed to student**
5. **Data saved to Firestore**

---

## Testing with cURL

### Test Analysis
```bash
curl -X POST http://localhost:5000/analyzeAnswer \
  -H "Content-Type: application/json" \
  -d '{
    "transcription": "Test answer",
    "questionId": "test",
    "referenceAnswer": "Reference",
    "scoringGuideline": "Guidelines",
    "studentId": "student1",
    "audioUrl": "https://example.com/audio.webm"
  }'
```

### Test Transcription
```bash
curl -X POST http://localhost:5000/transcribeAudio \
  -H "Content-Type: application/json" \
  -d '{
    "audioUrl": "https://example.com/audio.webm"
  }'
```

### Test Health
```bash
curl http://localhost:5000/health
```

---

## SDK Usage

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

async function analyzeAnswer(data) {
  const response = await axios.post(
    `${API_BASE}/analyzeAnswer`,
    data
  );
  return response.data;
}

async function transcribeAudio(audioUrl) {
  const response = await axios.post(
    `${API_BASE}/transcribeAudio`,
    { audioUrl }
  );
  return response.data;
}
```

---

## Security Considerations

- All API requests should be made over HTTPS in production
- Validate user authentication before processing sensitive data
- Implement rate limiting to prevent abuse
- Log all API requests for auditing
- Never expose API keys in client-side code
- Use Firebase security rules to protect database

---

## Deployment

For production deployment:

1. Update `.env` with production credentials
2. Run `firebase deploy --only functions`
3. Update frontend `VITE_FUNCTIONS_URL` to production URL
4. Monitor logs: `firebase functions:log`

---

## Support

For issues or questions, refer to:
- [Google Generative AI Documentation](https://ai.google.dev/)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text/docs)
