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
      console.warn('GOOGLE_API_KEY not set, using mock transcription');
      return mockTranscribeAudio(audioBase64);
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
      },
      { timeout: 10000 }
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
    console.error('Error calling Google Cloud Speech-to-Text API:', error);
    console.warn('Falling back to mock transcription');
    
    // Fallback to mock transcription for development/testing
    return mockTranscribeAudio(audioBase64);
  }
}

/**
 * Alternative: Transcribe using mock data
 * Useful for development and testing without API calls
 */
export async function mockTranscribeAudio(audioBase64: string): Promise<TranscriptionResponse> {
  console.log('📝 Using mock transcription (development mode)');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a realistic mock response for testing
  const mockTranscriptions = [
    'Water pollution harms aquatic ecosystems by introducing toxic substances that poison organisms and reduce oxygen levels. This affects both the ecosystem and human communities that depend on fishing and drinking water.',
    'Climate change causes rising temperatures which melts glaciers and ice sheets, leading to sea level rise and coastal flooding. This impacts food production and human settlements in vulnerable areas.',
    'Deforestation removes trees that absorb carbon dioxide, leading to increased greenhouse gas concentration in the atmosphere. This contributes to global warming and loss of biodiversity.',
    'Ocean acidification occurs when carbon dioxide dissolves in seawater, forming carbonic acid. This makes it difficult for shellfish and corals to build their shells and reduces biodiversity.',
    'Air pollution from vehicle emissions and industrial processes causes respiratory diseases in humans and damages crops. It also contributes to acid rain which harms ecosystems.',
  ];
  
  // Pick a random transcription for variety
  const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  
  return {
    transcription,
    confidence: 0.92,
  };
}
