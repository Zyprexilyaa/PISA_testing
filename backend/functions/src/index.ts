// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express, { Request, Response } from 'express';
import { AnalyzeAnswerRequest, AnalyzeAnswerResponse } from './types';
import { analyzeStudentAnswer, generateMockAnalysis } from './analyzeAnswer';
import { transcribeAudioFile } from './transcribeAudio';
import { TranscriptionResponse } from './types';

const app = express();

// Middleware
// Increase JSON payload limit to handle base64-encoded audio
app.use(express.json({ limit: '50mb' }));

// Enable CORS
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**
 * Endpoint: POST /analyzeAnswer
 * Analyzes a student answer and returns thinking level, score, and feedback
 */
app.post('/analyzeAnswer', async (req: Request, res: Response) => {
  try {
    const data = req.body as AnalyzeAnswerRequest;

    // Validate required fields
    if (
      !data.transcription ||
      !data.questionId ||
      !data.referenceAnswer ||
      !data.studentId
    ) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // Analyze the answer using Gemini
    const result = await analyzeStudentAnswer(data);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in analyzeAnswer endpoint:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Endpoint: POST /transcribeAudio
 * Converts audio to text using Google Cloud Speech-to-Text
 */
app.post('/transcribeAudio', async (req: Request, res: Response) => {
  try {
    const { audioData } = req.body;

    if (!audioData) {
      return res.status(400).json({
        error: 'Missing audioData field (base64 encoded audio)',
      });
    }

    // Transcribe the audio
    const result = await transcribeAudioFile(audioData);

    res.status(200).json({
      transcription: result.transcription,
      confidence: result.confidence,
    });
  } catch (error) {
    console.error('Error in transcribeAudio endpoint:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'PISA Thinking Skills Backend is running',
  });
});

// Export the Express app for functions-framework
export default app;
export { app };

// Start server if running directly
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
