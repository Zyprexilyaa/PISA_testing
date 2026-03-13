// Types for the PISA Insight Application

export interface Question {
  id: string;
  questionText: string;
  questionImage?: string;
  context?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  referenceAnswer: string;
  scoringGuideline: string;
  createdAt: Date;
}

export interface StudentAnswer {
  id: string;
  studentId: string;
  questionId: string;
  audioUrl: string;
  audioFile?: File;
  transcription: string;
  recordedAt: Date;
  submittedAt: Date;
}

export interface AnalysisResult {
  id: string;
  studentAnswerId: string;
  studentId: string;
  questionId: string;
  transcription: string;
  thinkingLevel: number; // 1-4 based on PISA levels
  score: number; // 0-100
  feedback: string;
  suggestedAnswer: string;
  strengths: string[];
  improvements: string[];
  analysisTimestamp: Date;
}

export interface ThinkingLevel {
  level: 1 | 2 | 3 | 4;
  name: string;
  description: string;
}

export interface StudentProgress {
  studentId: string;
  totalQuestionsAnswered: number;
  averageScore: number;
  averageThinkingLevel: number;
  improvementTrend: number; // percentage change over time
  lastAnalyzedDate: Date;
}

export interface RecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  recordingTime: number;
  error: string | null;
}

export type ThinkingLevelType = 'basic' | 'reasoning' | 'analytical' | 'complex';
