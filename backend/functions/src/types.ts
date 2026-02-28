// Shared TypeScript types for backend

export interface AnalyzeAnswerRequest {
  transcription: string;
  questionId: string;
  referenceAnswer: string;
  scoringGuideline: string;
  studentId: string;
  audioBase64?: string; // Optional base64 encoded audio (free solution without storage)
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
