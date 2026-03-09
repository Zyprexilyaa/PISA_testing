# Database Schema Documentation

This document describes the Firestore database structure for the PISA Thinking Skills application.

## Collections

### 1. **propositions** - Question Bank with Criteria

Stores all practice questions with their evaluation criteria.

**Collection Path:** `propositions/`

**Document Structure:**
```typescript
{
  questionText: string;           // The question prompt
  difficulty: 'easy' | 'medium' | 'hard';  // Difficulty level
  category: 'critical-thinking' | 'problem-solving' | 'analysis' | 'comprehension'; // Question type
  expectedAnswer: string;         // Reference answer for evaluation
  scoringRubric: {                 // Grading criteria
    excellent?: {
      points: number;             // Points awarded
      description: string;        // Criteria description
    },
    good?: { points: number; description: string },
    fair?: { points: number; description: string },
    poor?: { points: number; description: string }
  },
  language: 'th' | 'en';           // Question language
  createdAt: Timestamp;            // When proposition was created
}
```

**Example:**
```json
{
  "questionText": "ในสถานการณ์ที่อากาศปนเปื้อน หมู่บ้านหนึ่งต้องการลดปริมาณควัน จะมีวิธีใดบ้าง?",
  "difficulty": "medium",
  "category": "critical-thinking",
  "expectedAnswer": "วิธีแก้ปัญหาควรครอบคลุมสาเหตุ เช่น การใช้พลังงานสะอาด...",
  "scoringRubric": {
    "excellent": {
      "points": 3,
      "description": "ระบุหลายวิธี วิเคราะห์ข้อดีข้อเสีย"
    },
    "good": {
      "points": 2,
      "description": "ระบุ 2-3 วิธี มีการวิเคราะห์พื้นฐาน"
    }
  },
  "language": "th"
}
```

### 2. **answers** (Subcollection Path: answers/{userId}/submissions)

Stores student answers with complete metadata and analysis results.

**Collection Path:** `answers/{userId}/submissions/`

**Document Structure:**
```typescript
{
  // User & Question Info
  userId: string;                 // Firebase user ID
  questionId: string;             // Reference to proposition
  questionText: string;           // The question asked
  userAnswer: string;             // Student's answer/transcription
  language: 'th' | 'en';           // Language of submission

  // Analysis Results
  analysisResult: string;         // JSON string of Gemini analysis
  score: number;                  // Score out of 100

  // Proposition Criteria (copied from proposition for reference)
  difficulty: string;             // Question difficulty
  category: string;               // Question category
  expectedAnswer: string;         // Reference answer at time of submission
  scoringRubric: object;          // Rubric at time of submission

  // Timestamps
  submittedAt: Timestamp;         // When answer was submitted
  analyzedAt: Timestamp;          // When analysis was completed
}
```

**Example:**
```json
{
  "userId": "user123",
  "questionId": "prop456",
  "questionText": "ในสถานการณ์ที่อากาศปนเปื้อน...",
  "userAnswer": "เราสามารถใช้พลังงานสะอาด จำหน่ายรถยนต์สมัยใหม่...",
  "language": "th",
  "analysisResult": "{\"thinkingLevel\":3,\"score\":75,...}",
  "score": 75,
  "difficulty": "medium",
  "category": "critical-thinking",
  "submittedAt": "2024-03-09T12:30:00Z",
  "analyzedAt": "2024-03-09T12:30:15Z"
}
```

### 3. **analyses** - Legacy Analysis Records (Optional)

Historic record of all analyses (for audit trail).

**Collection Path:** `analyses/`

## API Endpoints

### Proposition Management

#### Save Proposition
```bash
POST /saveProposition
Content-Type: application/json

{
  "questionText": "...",
  "difficulty": "medium",
  "category": "critical-thinking",
  "expectedAnswer": "...",
  "scoringRubric": { ... },
  "language": "th"
}

Response: { "id": "proposition-doc-id", ... }
```

#### Get Propositions
```bash
GET /propositions?language=th

Response: {
  "language": "th",
  "count": 5,
  "propositions": [ ... ]
}
```

### Answer Analysis

#### Analyze Answer (with Optional Proposition Data)
```bash
POST /analyzeAnswer
Content-Type: application/json

{
  "transcription": "Student's answer text...",
  "questionId": "q1",
  "referenceAnswer": "Expected answer...",
  "scoringGuideline": "Grading criteria...",
  "studentId": "student-123",
  "proposition": {  // NEW: Optional full proposition data
    "id": "prop-456",
    "questionText": "...",
    "difficulty": "medium",
    "category": "critical-thinking",
    "expectedAnswer": "...",
    "scoringRubric": { ... }
  },
  "language": "th"
}

Response: {
  "id": "analysis-id",
  "thinkingLevel": 3,
  "score": 75,
  "feedback": "...",
  "strengths": [...],
  "improvements": [...]
}
```

#### Get User Answer History
```bash
GET /userAnswerHistory?userId=student-123&limit=10

Response: {
  "userId": "student-123",
  "count": 5,
  "limit": 10,
  "answers": [
    {
      "id": "answer-doc-id",
      "questionText": "...",
      "userAnswer": "...",
      "score": 75,
      "submittedAt": "..."
    },
    ...
  ]
}
```

## Data Flow

### Student Answer Submission Flow
```
1. Student submits answer (voice or text)
2. Frontend loads current proposition from /propositions
3. Frontend sends POST /analyzeAnswer with:
   - transcription
   - proposition object (full)
   - language
4. Backend:
   - Analyzes with Gemini AI
   - Saves to answers/{{userId}}/submissions
   - Returns analysis immediately
5. Frontend displays results to student
6. Proposition and analysis stored in Firestore for history
```

### Proposition Initialization
```
1. First time user visits /question page
2. Frontend calls initializeSamplePropositions()
3. Backend creates sample propositions in database
4. Frontend fetches random proposition via GET /propositions
5. Subsequent visits just get random proposition
```

## Security Considerations

- **Public Read Access:** Propositions can be read publicly (no auth required for GET /propositions)
- **Protected Write:** Proposition creation restricted to admin (future: add RBAC)
- **User Data Protection:** Answers stored under user ID, only retrievable by authenticated user
- **No Personal Data in Answers:** Store only: question ID, transcription, analysis, score (no email, phone, etc.)

## Firestore Pricing Impact

With small usage (< 100 students/day):
- **Read Operations:** ~1-2 per submission (proposition load, answer submission)
- **Write Operations:** ~1 per submission (save answer with criteria)
- **Free Tier Covers:** 50,000 reads/writes per day

**Estimated Costs:** Free tier sufficient for pilot phase

## Future Enhancements

1. **Proposition Versioning:** Track changes to propositions over time
2. **Question Masters:** Create question sets/collections
3. **Progress Tracking:** Aggregate scores by category per user
4. **Analytics Dashboard:** Questions most/least answered correctly
5. **Answer Deduplication:** Detect/flag similar answers
6. **Rubric Scoring Automation:** Automatically calculate score from rubric
