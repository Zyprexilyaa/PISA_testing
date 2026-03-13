// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express, { Request, Response } from 'express';
import { AnalyzeAnswerRequest, AnalyzeAnswerResponse } from './types';
import { analyzeStudentAnswer, generateMockAnalysis } from './analyzeAnswer';
import { transcribeAudioFile } from './transcribeAudio';
import { TranscriptionResponse } from './types';
import { saveProposition, getPropositions, getUserAnswerHistory } from './database';
import { joinClassroomByKey } from './database';

const app = express();

// Middleware
// Increase JSON payload limit to handle base64-encoded audio
app.use(express.json({ limit: '50mb' }));

// Enable CORS
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  
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
 * Endpoint: POST /saveProposition
 * Saves a new proposition (question) with criteria to the database
 */
app.post('/saveProposition', async (req: Request, res: Response) => {
  try {
    const propositionData = req.body;
    console.log('📝 saveProposition endpoint called with data:', propositionData);

    // Validate required fields
    if (
      !propositionData.questionText ||
      !propositionData.difficulty ||
      !propositionData.category ||
      !propositionData.expectedAnswer ||
      !propositionData.scoringRubric
    ) {
      return res.status(400).json({
        error: 'Missing required fields: questionText, difficulty, category, expectedAnswer, scoringRubric',
      });
    }

    // Save the proposition
    const docId = await saveProposition(propositionData);

    res.status(201).json({
      id: docId,
      message: 'Proposition saved successfully',
      ...propositionData,
    });
  } catch (error) {
    console.error('❌ Error in saveProposition endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : 'No stack';
    console.error('Error stack:', stack);
    res.status(500).json({
      error: errorMessage,
      stack: stack
    });
  }
});

/**
 * Endpoint: GET /propositions
 * Retrieves all propositions for a given language
 */
app.get('/propositions', async (req: Request, res: Response) => {
  try {
    const language = (req.query.language as string) || 'th';
    console.log('📖 getPropositions endpoint called for language:', language);

    // Get propositions
    const propositions = await getPropositions(language);
    console.log('✅ Retrieved', propositions.length, 'propositions for language:', language);

    res.status(200).json({
      language,
      count: propositions.length,
      propositions,
    });
  } catch (error) {
    console.error('❌ Error in getPropositions endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : 'No stack';
    console.error('Error stack:', stack);
    res.status(500).json({
      error: errorMessage,
      stack: stack
    });
  }
});

/**
 * Endpoint: POST /joinClassroom
 * Body: { studentId, classKey }
 * Server-side join to avoid client rule conflicts
 */
app.post('/joinClassroom', async (req: Request, res: Response) => {
  try {
    const { studentId, classKey } = req.body;
    console.log('🏫 joinClassroom endpoint called:', { studentId, classKey });
    
    if (!studentId || !classKey) {
      return res.status(400).json({ error: 'Missing studentId or classKey in request body' });
    }

    const classroom = await joinClassroomByKey(studentId, classKey.toUpperCase());
    console.log('✅ Student joined classroom:', classroom.id);
    res.status(200).json({ classroom });
  } catch (error) {
    console.error('❌ Error in joinClassroom endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : 'No stack';
    console.error('Error stack:', stack);
    res.status(500).json({ error: errorMessage, stack });
  }
});

/**
 * Endpoint: GET /userAnswerHistory
 * Retrieves a user's answer history
 */
app.get('/userAnswerHistory', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const limit = parseInt((req.query.limit as string) || '10', 10);

    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId query parameter',
      });
    }

    // Get user's answer history
    const answers = await getUserAnswerHistory(userId, limit);

    res.status(200).json({
      userId,
      count: answers.length,
      limit,
      answers,
    });
  } catch (error) {
    console.error('Error in getUserAnswerHistory endpoint:', error);
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
    message: 'PISA Insight Backend is running',
  });
});

// Export the Express app for functions-framework
export default app;
export { app };

// Start server if running directly
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
console.log('Starting server on port:', PORT);
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📍 Access at: http://0.0.0.0:${PORT}`);
});
