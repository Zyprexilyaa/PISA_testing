import axios from 'axios';
import { AnalysisResult } from '../types';

const API_BASE = import.meta.env.VITE_FUNCTIONS_URL || 'http://localhost:5000';

interface AnalyzeAnswerRequest {
  transcription: string;
  questionId: string;
  referenceAnswer: string;
  scoringGuideline: string;
  studentId: string;
  audioBase64?: string; // Audio as base64 (optional, can be empty for free version)
}

/**
 * Convert blob to base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1] || ''); // Remove the "data:audio/webm;base64," prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Send student answer to backend for AI analysis
 * @param data - Answer data including transcription and question info
 * @param audioBlob - Optional audio blob for storage (can be undefined for free version)
 * @returns Analysis result with thinking level, score, and feedback
 */
export async function analyzeStudentAnswer(
  data: AnalyzeAnswerRequest,
  audioBlob?: Blob
): Promise<AnalysisResult> {
  try {
    const requestData: any = { ...data };
    
    // If audio blob provided, convert to base64 (free option without storage)
    if (audioBlob) {
      try {
        requestData.audioBase64 = await blobToBase64(audioBlob);
      } catch (error) {
        console.warn('Could not convert audio to base64, continuing without it', error);
      }
    }
    
    const response = await axios.post(
      `${API_BASE}/analyzeAnswer`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data as AnalysisResult;
  } catch (error) {
    console.error('Error analyzing answer:', error);
    throw new Error(
      `Failed to analyze answer: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Transcribe audio using Google Cloud Speech-to-Text
 * @param audioBlob - Audio file as blob
 * @returns Transcribed text
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert blob to base64
    const audioBase64 = await blobToBase64(audioBlob);
    
    const response = await axios.post(`${API_BASE}/transcribeAudio`, {
      audioData: audioBase64,
    });
    
    return response.data.transcription;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(
      `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
