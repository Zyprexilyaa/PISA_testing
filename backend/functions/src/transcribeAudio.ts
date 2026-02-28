import axios from 'axios';
import { TranscriptionResponse } from './types';

/**
 * Transcribe audio using Google Cloud Speech-to-Text API
 * Supports Thai language transcription
 * 
 * @param audioBase64 - Audio file as base64 string
 * @returns Transcribed text
 */
export async function transcribeAudioFile(audioBase64: string): Promise<TranscriptionResponse> {
  try {
    // Call Google Cloud Speech-to-Text API with base64 encoded audio
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable not set');
    }
    
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 16000,
          languageCode: 'th-TH', // Thai language
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: audioBase64,
        },
      }
    );
    
    const transcript = response.data.results
      ?.map((result: any) => result.alternatives[0].transcript)
      .join(' ') || '';
    
    const confidence = response.data.results?.[0]?.alternatives?.[0]?.confidence || 0;
    
    return {
      transcription: transcript,
      confidence,
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(
      `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Alternative: Transcribe using local speech-to-text service
 * Useful for development and testing without API calls
 */
export async function mockTranscribeAudio(audioBase64: string): Promise<TranscriptionResponse> {
  console.log('Using mock transcription (API key not configured)');
  
  // Return a mock response for testing
  return {
    transcription: 'This is a mock transcription. Configure GOOGLE_API_KEY to use real Speech-to-Text.',
    confidence: 0.95,
  };
}
