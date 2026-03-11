import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const projectId = process.env.GCP_PROJECT_ID || 'demo-pisa-thinking-skills';

console.log('🔧 Initializing Firebase Admin...');
console.log(`📦 Project ID: ${projectId}`);

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(`📡 Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
}

// Initialize Firebase Admin SDK with flexible credential handling.
// In production (e.g., Render) set the service account JSON in the
// `FIREBASE_SERVICE_ACCOUNT` environment variable (stringified JSON).
// Locally you can set `GOOGLE_APPLICATION_CREDENTIALS` to the key file path.
if (admin.apps.length === 0) {
  console.log('⚙️  Creating new Firebase app instance...');

  try {
    if (process.env.FIREBASE_EMULATOR_HOST) {
      // When using the emulator, no credentials are required
      admin.initializeApp({ projectId });
      console.log('✅ Firebase initialized for emulator');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Service account provided as environment variable (recommended for Render)
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          projectId,
        });
        console.log('✅ Firebase initialized with service account from env');
      } catch (err) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err);
        throw err;
      }
    } else {
      // Fall back to Application Default Credentials if available
      try {
        admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId });
        console.log('✅ Firebase initialized with application default credentials');
      } catch (err) {
        console.error('❌ Firebase initialization failed - no credentials available:', err);
        console.error('Please set FIREBASE_SERVICE_ACCOUNT (stringified JSON) or GOOGLE_APPLICATION_CREDENTIALS.');
        throw err;
      }
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    // Do not exit the process on render - let the server return errors, but log clearly
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
 * Save student answer with complete metadata
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

/**
 * Save complete answer record with proposition criteria
 * This stores: answer + analysis + proposition criteria + scoring
 */
export async function saveAnswerWithCriteria(
  userId: string,
  propositionData: any,
  userAnswer: string,
  analysisResult: string,
  score?: number
): Promise<string> {
  try {
    const docRef = await db.collection('answers').doc(userId).collection('submissions').add({
      // User & Question Info
      userId,
      questionId: propositionData.id || propositionData.questionId,
      questionText: propositionData.questionText,
      userAnswer,
      language: propositionData.language || 'th',
      
      // Analysis
      analysisResult,
      score: score || 0,
      
      // Proposition Criteria
      difficulty: propositionData.difficulty,
      category: propositionData.category,
      expectedAnswer: propositionData.expectedAnswer,
      scoringRubric: propositionData.scoringRubric || {},
      
      // Timestamps
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`✅ Answer saved with criteria: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error saving answer with criteria:', error);
    throw error;
  }
}

/**
 * Save proposition (question) with criteria to Firestore
 */
export async function saveProposition(propositionData: any): Promise<string> {
  try {
    const docRef = await db.collection('propositions').add({
      questionText: propositionData.questionText,
      difficulty: propositionData.difficulty,
      category: propositionData.category,
      expectedAnswer: propositionData.expectedAnswer,
      scoringRubric: propositionData.scoringRubric,
      language: propositionData.language || 'th',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`✅ Proposition saved: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error saving proposition:', error);
    throw error;
  }
}

/**
 * Get all propositions for a language
 */
export async function getPropositions(language: string = 'th'): Promise<any[]> {
  try {
    const snapshot = await db.collection('propositions')
      .where('language', '==', language)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting propositions:', error);
    throw error;
  }
}

/**
 * Join a classroom by classKey (server-side)
 */
export async function joinClassroomByKey(studentId: string, classKey: string): Promise<any> {
  try {
    const q = await db.collection('classrooms').where('classKey', '==', classKey).get();
    if (q.empty) {
      throw new Error('Classroom not found');
    }

    const classroomDoc = q.docs[0];
    const classroomData = classroomDoc.data();

    // If student already present
    const students: string[] = classroomData.students || [];
    if (students.includes(studentId)) {
      return { id: classroomDoc.id, ...classroomData };
    }

    // Add student to students array
    await classroomDoc.ref.update({ students: admin.firestore.FieldValue.arrayUnion(studentId) });

    // Optionally create /members subdoc
    await classroomDoc.ref.collection('members').doc(studentId).set({ joinedAt: admin.firestore.FieldValue.serverTimestamp(), studentId }, { merge: true });

    const updated = await classroomDoc.ref.get();
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    console.error('Error in joinClassroomByKey:', error);
    throw error;
  }
}

/**
 * Get user's answer history
 */
export async function getUserAnswerHistory(userId: string, limit: number = 10): Promise<any[]> {
  try {
    const snapshot = await db.collection('answers')
      .doc(userId)
      .collection('submissions')
      .orderBy('submittedAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user answer history:', error);
    throw error;
  }
}
