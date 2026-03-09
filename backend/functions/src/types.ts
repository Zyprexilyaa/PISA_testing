// Shared TypeScript types for backend

export interface ScoringRubric {
  excellent?: { points: number; description: string };
  good?: { points: number; description: string };
  fair?: { points: number; description: string };
  poor?: { points: number; description: string };
}

export interface PropositionData {
  id?: string;
  questionId?: string;
  questionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'critical-thinking' | 'problem-solving' | 'analysis' | 'comprehension';
  expectedAnswer: string;
  scoringRubric: ScoringRubric;
  language?: 'th' | 'en';
}

export interface AnalyzeAnswerRequest {
  transcription: string;
  questionId: string;
  referenceAnswer: string;
  scoringGuideline: string;
  studentId: string;
  audioBase64?: string; // Optional base64 encoded audio (free solution without storage)
  proposition?: PropositionData; // NEW: Optional proposition with all criteria
  language?: 'th' | 'en'; // NEW: User's language
}

export interface AnalyzeAnswerResponse {
  id: string;
  studentAnswerId: string;
  studentId: string;
  questionId: string;
  transcription: string;
  thinkingLevel: number;
  score: number;
  feedback: string;
  suggestedAnswer: string;
  strengths: string[];
  improvements: string[];
  analysisTimestamp: string;
}

export interface GeminiAnalysisResult {
  thinkingLevel: 1 | 2 | 3 | 4;
  score: number;
  feedback: string;
  suggestedAnswer: string;
  strengths: string[];
  improvements: string[];
}

export interface TranscriptionRequest {
  audioData: string; // Base64 encoded audio
}

export interface TranscriptionResponse {
  transcription: string;
  confidence: number;
}
