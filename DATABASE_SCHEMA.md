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

### 4. **users** - User Accounts and Profiles

Stores user account information including roles for RBAC.

**Collection Path:** `users/`

**Document Structure:**
```typescript
{
  // Identity
  email: string;                  // User email address
  displayName?: string;           // User's display name
  
  // Role Management
  role: 'teacher' | 'student';    // User role for access control
  
  // Account Info
  createdAt: Timestamp;           // Account creation timestamp
  lastLogin?: Timestamp;          // Last login time
  
  // Profile (optional)
  photoURL?: string;              // Profile picture URL
  institution?: string;           // School/Institution name
}
```

**Example:**
```json
{
  "email": "teacher@example.com",
  "displayName": "Mr. Smith",
  "role": "teacher",
  "createdAt": "2024-03-09T10:00:00Z",
  "institution": "Central High School"
}
```

### 5. **classrooms** - Teacher-Created Classroom Sessions

Teacher-managed classrooms where students can join using unique codes.

**Collection Path:** `classrooms/`

**Document Structure:**
```typescript
{
  // Classroom Info
  className: string;              // Name of the classroom
  classKey: string;               // 6-character unique join code (e.g., "ABC123")
  
  // Teacher Info
  teacherId: string;              // Reference to teacher user ID
  teacherName?: string;           // Teacher's display name (denormalized)
  
  // Membership
  students: string[];             // Array of student user IDs in this classroom
  maxStudents?: number;           // Maximum students allowed (optional)
  
  // Settings
  language: 'th' | 'en';           // Default language for classroom
  isActive: boolean;              // Whether classroom is accepting new students
  description?: string;           // Classroom description
  
  // Timestamps
  createdAt: Timestamp;           // When classroom was created
  updatedAt: Timestamp;           // Last update time
}
```

**Example:**
```json
{
  "className": "Advanced Physics 2024",
  "classKey": "PHY234",
  "teacherId": "teacher-uid-123",
  "teacherName": "Dr. Johnson",
  "students": ["student-uid-001", "student-uid-002", "student-uid-003"],
  "language": "th",
  "isActive": true,
  "createdAt": "2024-03-09T10:00:00Z",
  "updatedAt": "2024-03-10T14:30:00Z"
}
```

### 6. **classroomSubmissions** - Student Quiz Submissions in Classrooms

Tracks individual student submissions within the context of a classroom.

**Collection Path:** `classroomSubmissions/`

**Document Structure:**
```typescript
{
  // Contextual Info
  classroomId: string;            // Reference to classroom
  studentId: string;              // Reference to student user
  studentEmail?: string;          // Student email (denormalized)
  
  // Question & Answer
  questionText: string;           // The question being answered
  userAnswer: string;             // Student's answer/transcription
  
  // Analysis Results
  score: number;                  // Score out of 100
  thinkingLevel: number;          // PISA thinking level (1-4)
  feedback: string;               // AI feedback on response
  strengths: string[];            // Identified strengths
  improvements: string[];         // Suggested improvements
  
  // Question Metadata
  difficulty: string;             // Question difficulty
  category: string;               // Question category
  expectedAnswer: string;         // Reference answer
  
  // Timestamps
  submittedAt: Timestamp;         // When answer was submitted
  analyzedAt: Timestamp;          // When analysis was completed
}
```

**Example:**
```json
{
  "classroomId": "classroom-456",
  "studentId": "student-uid-001",
  "studentEmail": "john@student.com",
  "questionText": "Explain how water pollution affects ecosystems...",
  "userAnswer": "Water pollution creates an imbalance in aquatic ecosystems...",
  "score": 82,
  "thinkingLevel": 3,
  "feedback": "Good analytical thinking with clear explanations.",
  "strengths": ["Clear structure", "Specific examples"],
  "improvements": ["Add more evidence-based reasoning"],
  "difficulty": "hard",
  "category": "critical-thinking",
  "submittedAt": "2024-03-10T14:25:00Z",
  "analyzedAt": "2024-03-10T14:25:15Z"
}
```

### 7. **classroomMembers** - Student Membership Tracking (Optional)

Tracks student enrollment dates and status within classrooms (alternative to denormalizing in classrooms.students).

**Collection Path:** `classroomMembers/{classroomId}/members/`

**Document Structure:**
```typescript
{
  // Student Info
  studentId: string;              // Reference to student user ID
  studentEmail: string;           // Student email
  
  // Membership Status
  joinedAt: Timestamp;            // When student joined classroom
  status: 'active' | 'inactive';  // Membership status
  isRemoved: boolean;             // Whether student was removed
}
```

**Example:**
```json
{
  "studentId": "student-uid-001",
  "studentEmail": "john@student.com",
  "joinedAt": "2024-03-09T15:00:00Z",
  "status": "active",
  "isRemoved": false
}
```

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
