// Frontend TypeScript types

export interface Question {
  id: string;
  questionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  referenceAnswer: string;
  scoringGuideline: string;
  createdAt: Date;
  questionImage?: string; // Optional image URL for the question
  context?: string; // Optional context information
}

export interface RecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  recordingTime: number;
  error: string | null;
}

export interface AnalysisResult {
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

export interface Strength {
  name: string;
  description: string;
}

export interface Improvement {
  name: string;
  suggestion: string;
}
