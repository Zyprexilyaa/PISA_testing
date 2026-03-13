# Firestore Database Schema

This document describes the Firestore database structure for the PISA Insight Analyzer.

## Collections

### `questions`
Stores PISA-style questions and reference answers.

```
questions/
├── documentId: string (auto-generated)
├── questionText: string
├── questionImage?: string (URL)
├── context?: string
├── difficulty: 'easy' | 'medium' | 'hard'
├── subject: string (e.g., 'Environmental Science', 'Mathematics')
├── referenceAnswer: string
├── scoringGuideline: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

**Example:**
```json
{
  "questionText": "How does water pollution affect aquatic ecosystems?",
  "difficulty": "hard",
  "subject": "Environmental Science",
  "referenceAnswer": "Water pollution harms organisms by introducing toxins...",
  "scoringGuideline": "Award points for: (1) identifying specific harms...",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

### `studentAnswers`
Stores student's recorded answers.

```
studentAnswers/
├── documentId: string (auto-generated)
├── studentId: string
├── questionId: string
├── audioUrl: string (Firebase Storage URL)
├── transcription: string
├── recordedAt: timestamp
├── submittedAt: timestamp
```

**Example:**
```json
{
  "studentId": "student-abc123",
  "questionId": "q1",
  "audioUrl": "https://firebasestorage.googleapis.com/...",
  "transcription": "Water pollution affects ecosystems by...",
  "submittedAt": "2024-01-15T10:30:00Z"
}
```

---

### `transcripts`
Stores transcriptions with metadata.

```
transcripts/
├── documentId: string (from studentAnswer ID)
├── transcription: string
├── audioUrl: string
├── confidence: number (0-1)
├── language: string (e.g., 'th-TH')
├── createdAt: timestamp
```

---

### `analyses`
Stores AI analysis results.

```
analyses/
├── documentId: string (auto-generated)
├── studentAnswerId: string
├── studentId: string
├── questionId: string
├── transcription: string
├── thinkingLevel: number (1-4)
├── score: number (0-100)
├── feedback: string
├── suggestedAnswer: string
├── strengths: array<string>
├── improvements: array<string>
├── audioUrl: string
├── analysisTimestamp: timestamp
└── createdAt: timestamp
```

**Example:**
```json
{
  "studentId": "student-abc123",
  "questionId": "q1",
  "thinkingLevel": 3,
  "score": 78,
  "feedback": "Your answer shows analytical thinking but needs more depth...",
  "suggestedAnswer": "Water pollution introduces toxins that accumulate in organisms...",
  "strengths": [
    "Identified the main concept correctly",
    "Clear explanation of mechanisms"
  ],
  "improvements": [
    "Add more specific examples",
    "Explain long-term ecosystem effects"
  ],
  "analysisTimestamp": "2024-01-15T10:35:00Z"
}
```

---

### `studentProgress`
Aggregated progress for each student.

```
studentProgress/
├── studentId: string (document ID)
├── totalQuestionsAnswered: number
├── averageScore: number
├── averageThinkingLevel: number
├── improvementTrend: number (percentage)
├── lastAnalyzedDate: timestamp
└── levelDistribution: object
    ├── level1Count: number
    ├── level2Count: number
    ├── level3Count: number
    └── level4Count: number
```

---

### `users`
Stores user information.

```
users/
├── uid: string (auth UID)
├── email: string
├── displayName: string
├── role: 'student' | 'teacher' | 'admin'
├── school?: string
├── grade?: string
├── createdAt: timestamp
└── lastLoginAt: timestamp
```

---

## Firebase Storage Structure

```
storage/
└── audio/
    └── {studentId}/
        ├── {studentId}_{questionId}_{timestamp}.webm
        ├── {studentId}_{questionId}_{timestamp}.webm
        └── ...
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read-only access to questions
    match /questions/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.isTeacher == true;
    }
    
    // Students can only read their own answers and progress
    match /studentAnswers/{document=**} {
      allow read: if request.auth.uid == resource.data.studentId;
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.studentId;
    }
    
    match /analyses/{document=**} {
      allow read: if request.auth.uid == resource.data.studentId;
    }
    
    match /studentProgress/{studentId} {
      allow read: if request.auth.uid == studentId;
    }
    
    // Teachers can view all student data
    match /{document=**} {
      allow read, write: if request.auth.token.isTeacher == true;
    }
  }
}
```

---

### `classrooms`
Stores classroom metadata created by teachers.

```
classrooms/
├── documentId: string (auto-generated)
├── teacherId: string (uid of teacher)
├── className: string
├── classKey: string (6-character join code)
├── students: array<string> (student user IDs)
├── createdAt: timestamp
```

**Example:**
```json
{
  "teacherId": "teacher-abc123",
  "className": "Math Class 2024",
  "classKey": "ABC123",
  "students": ["student-xyz789"],
  "createdAt": "2024-03-01T10:00:00Z"
}
```

---

### `classroomSubmissions`
Stores quiz/answer submissions that are associated with a classroom.

```
classroomSubmissions/
├── documentId: string (auto-generated)
├── classroomId: string (reference to classrooms document)
├── studentId: string
├── questionText: string
├── userAnswer: string
├── analysisResult: string (raw AI analysis or summary)
├── score: number (0-100)
├── submittedAt: timestamp
└── classroomName?: string (optional denormalized classroom name)
```

**Example:**
```json
{
  "classroomId": "classroom-abc123",
  "studentId": "student-xyz789",
  "questionText": "How does water pollution affect aquatic ecosystems?",
  "userAnswer": "Water pollution harms fish and plants by...",
  "analysisResult": "The answer demonstrates level 3 analytical thinking...",
  "score": 82,
  "submittedAt": "2024-03-01T10:30:00Z",
  "classroomName": "Math Class 2024"
}
```

---

### `classroomMembers`
Optional collection for tracking membership and roles in classrooms.

> Note: Current implementation primarily uses the `students` array on each `classrooms` document. This collection can be added if you need more detailed membership tracking (e.g., per-student metadata, multiple roles).

```
classroomMembers/
├── documentId: string (auto-generated)
├── classroomId: string
├── studentId: string
├── role: 'student' | 'assistant'
├── joinedAt: timestamp
└── lastActivityAt?: timestamp
```

**Example:**
```json
{
  "classroomId": "classroom-abc123",
  "studentId": "student-xyz789",
  "role": "student",
  "joinedAt": "2024-03-01T09:55:00Z"
}
```

---

## Firebase Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Audio files can only be accessed by the student who uploaded them
    match /audio/{studentId}/{fileName} {
      allow read: if request.auth.uid == studentId;
      allow write: if request.auth.uid == studentId;
      allow delete: if request.auth.uid == studentId;
    }
  }
}
```

---

## Data Models (TypeScript)

See `frontend/src/types/index.ts` and `backend/functions/src/types.ts` for TypeScript definitions.
