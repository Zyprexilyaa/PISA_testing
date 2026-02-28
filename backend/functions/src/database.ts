import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const projectId = process.env.GCP_PROJECT_ID || 'demo-pisa-thinking-skills';

console.log('🔧 Initializing Firebase Admin...');
console.log(`📦 Project ID: ${projectId}`);

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(`📡 Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
}

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  console.log('⚙️  Creating new Firebase app instance...');
  
  try {
    admin.initializeApp({
      projectId: projectId,
      ...(process.env.FIRESTORE_EMULATOR_HOST ? {} : {}), // In emulator, credentials come from environment
    });
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    process.exit(1);
  }
} else {
  console.log('♻️  Firebase already initialized');
}

// Get Firestore instance
export const db = admin.firestore();

// Log emulator status
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(`📡 Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
}

/**
 * Save analysis result to Firestore
 */
export async function saveAnalysisResult(
  data: any
): Promise<string> {
  try {
    const docRef = await db.collection('analyses').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving analysis result:', error);
    throw error;
  }
}

/**
 * Save transcript to Firestore
 */
export async function saveTranscript(
  studentAnswerId: string,
  transcription: string,
  audioUrl?: string // Optional - using free solution without storage
): Promise<void> {
  try {
    await db.collection('transcripts').doc(studentAnswerId).set({
      transcription,
      ...(audioUrl && { audioUrl }), // Only include if provided
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving transcript:', error);
    throw error;
  }
}

/**
 * Get question from Firestore
 */
export async function getQuestion(questionId: string): Promise<any> {
  try {
    const doc = await db.collection('questions').doc(questionId).get();
    return doc.data();
  } catch (error) {
    console.error('Error getting question:', error);
    throw error;
  }
}

/**
 * Save student answer metadata
 */
export async function saveStudentAnswer(
  studentId: string,
  questionId: string,
  transcription: string,
  audioUrl?: string // Optional - using free solution without storage
): Promise<string> {
  try {
    const docRef = await db.collection('studentAnswers').add({
      studentId,
      questionId,
      ...(audioUrl && { audioUrl }), // Only include if provided
      transcription,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      recordedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving student answer:', error);
    throw error;
  }
}
