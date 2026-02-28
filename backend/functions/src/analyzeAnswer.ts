import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  AnalyzeAnswerRequest,
  AnalyzeAnswerResponse,
  GeminiAnalysisResult,
} from './types';
import { saveAnalysisResult, saveStudentAnswer } from './database';
import { transcribeAudioFile } from './transcribeAudio';

// Initialize Gemini AI
const clientApiKey = process.env.GOOGLE_API_KEY;
if (!clientApiKey) {
  throw new Error('GOOGLE_API_KEY environment variable not set');
}

const genAI = new GoogleGenerativeAI(clientApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

/**
 * Analyze student answer using Google Gemini AI
 * Evaluates thinking level, provides feedback, and suggests improvements
 */
export async function analyzeStudentAnswer(
  req: AnalyzeAnswerRequest
): Promise<AnalyzeAnswerResponse> {
  try {
    const {
      transcription,
      questionId,
      referenceAnswer,
      scoringGuideline,
      studentId,
      audioBase64,
    } = req;

    // Create the analysis prompt for Gemini
    const analysisPrompt = `You are an expert educational assessor evaluating student answers to PISA-style questions.

Student's Answer:
"${transcription}"

Reference Answer (what a good answer should include):
"${referenceAnswer}"

Scoring Guidelines:
${scoringGuideline}

PISA Thinking Levels:
- Level 1 (Basic Understanding): Student shows basic understanding of facts and information
- Level 2 (Simple Reasoning): Student makes simple connections and basic explanations
- Level 3 (Analytical Thinking): Student analyzes complex situations and makes reasonable inferences
- Level 4 (Complex Reasoning): Student evaluates evidence and builds sophisticated arguments

Please analyze the student's answer and provide:
1. A thinking level (1-4)
2. A score out of 100
3. Detailed feedback on the answer
4. A suggested improved answer that shows better reasoning
5. A list of strengths in the answer
6. A list of areas for improvement

Respond in valid JSON format (no markdown, just pure JSON):
{
  "thinkingLevel": <number 1-4>,
  "score": <number 0-100>,
  "feedback": "<detailed feedback>",
  "suggestedAnswer": "<improved answer>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"]
}`;

    // Call Gemini API
    const response = await model.generateContent(analysisPrompt);
    const analysisText = response.response.text();

    // Parse the JSON response
    const analysisResult = JSON.parse(analysisText) as GeminiAnalysisResult;

    // Validate the response
    if (
      !analysisResult.thinkingLevel ||
      analysisResult.score === undefined ||
      !analysisResult.feedback ||
      !analysisResult.suggestedAnswer
    ) {
      throw new Error('Invalid analysis result from Gemini');
    }

    // Save to Firestore
    const studentAnswerId = await saveStudentAnswer(
      studentId,
      questionId,
      transcription
      // audioBase64 is optional for free solution without storage
    );

    const resultId = await saveAnalysisResult({
      studentAnswerId,
      studentId,
      questionId,
      transcription,
      thinkingLevel: analysisResult.thinkingLevel,
      score: analysisResult.score,
      feedback: analysisResult.feedback,
      suggestedAnswer: analysisResult.suggestedAnswer,
      strengths: analysisResult.strengths || [],
      improvements: analysisResult.improvements || [],
      // audioBase64 not stored - free solution without persistent storage
    });

    return {
      id: resultId,
      studentAnswerId,
      studentId,
      questionId,
      transcription,
      thinkingLevel: analysisResult.thinkingLevel,
      score: analysisResult.score,
      feedback: analysisResult.feedback,
      suggestedAnswer: analysisResult.suggestedAnswer,
      strengths: analysisResult.strengths || [],
      improvements: analysisResult.improvements || [],
      analysisTimestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error analyzing answer:', error);
    throw new Error(
      `Failed to analyze answer: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate a sample analysis for testing
 * Use this when Gemini API is not available
 */
export async function generateMockAnalysis(
  req: AnalyzeAnswerRequest
): Promise<AnalyzeAnswerResponse> {
  const studentAnswerId = `mock-${Date.now()}`;
  const resultId = `result-${Date.now()}`;

  return {
    id: resultId,
    studentAnswerId,
    studentId: req.studentId,
    questionId: req.questionId,
    transcription: req.transcription,
    thinkingLevel: 2,
    score: 65,
    feedback:
      'Your answer shows some understanding of the topic but could be more detailed. Try to include more specific examples and explanations of how concepts relate to each other.',
    suggestedAnswer:
      req.referenceAnswer,
    strengths: [
      'You identified the main concept correctly',
      'Your explanation was clear and easy to follow',
    ],
    improvements: [
      'Add more supporting evidence and examples',
      'Explain the reasoning behind your answer more thoroughly',
      'Connect your answer to broader concepts or real-world applications',
    ],
    analysisTimestamp: new Date().toISOString(),
  };
}
