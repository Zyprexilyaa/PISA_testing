import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';

export interface ExamQuestionData {
  id?: string;
  title?: string;
  questionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'critical-thinking' | 'problem-solving' | 'analysis' | 'comprehension';
  expectedAnswer: string;
  scoringRubric: Record<string, any>;
  language?: 'th' | 'en';
  sourceType?: 'text' | 'pdf';
  pdfUrl?: string;
  pdfFileName?: string;
  createdBy?: string;
}

export const PDF_EXAM_QUESTION_TEMPLATES: ExamQuestionData[] = [
  {
    title: 'PISA Old Test 1',
    questionText: 'Open the attached PISA PDF and answer the exam question inside.',
    difficulty: 'hard',
    category: 'comprehension',
    expectedAnswer: 'Answer the question described in the attached PDF.',
    language: 'th',
    scoringRubric: {
      excellent: { points: 3, description: 'Clear and complete answer to the PISA PDF question.' },
      good: { points: 2, description: 'Mostly correct answer with some reasoning.' },
      fair: { points: 1, description: 'Partial answer or limited reasoning.' },
    },
    sourceType: 'pdf',
    pdfUrl: '/pdfs/pisa-old-test-1.pdf',
    pdfFileName: 'pisa-old-test-1.pdf',
  },
  {
    title: 'PISA Old Test 2',
    questionText: 'Open the attached PISA PDF and answer the exam question inside.',
    difficulty: 'hard',
    category: 'comprehension',
    expectedAnswer: 'Answer the question described in the attached PDF.',
    language: 'th',
    scoringRubric: {
      excellent: { points: 3, description: 'Clear and complete answer to the PISA PDF question.' },
      good: { points: 2, description: 'Mostly correct answer with some reasoning.' },
      fair: { points: 1, description: 'Partial answer or limited reasoning.' },
    },
    sourceType: 'pdf',
    pdfUrl: '/pdfs/pisa-old-test-2.pdf',
    pdfFileName: 'pisa-old-test-2.pdf',
  },
  {
    title: 'PISA Old Test 3',
    questionText: 'Open the attached PISA PDF and answer the exam question inside.',
    difficulty: 'hard',
    category: 'comprehension',
    expectedAnswer: 'Answer the question described in the attached PDF.',
    language: 'th',
    scoringRubric: {
      excellent: { points: 3, description: 'Clear and complete answer to the PISA PDF question.' },
      good: { points: 2, description: 'Mostly correct answer with some reasoning.' },
      fair: { points: 1, description: 'Partial answer or limited reasoning.' },
    },
    sourceType: 'pdf',
    pdfUrl: '/pdfs/pisa-old-test-3.pdf',
    pdfFileName: 'pisa-old-test-3.pdf',
  },
];

export async function saveExamQuestion(question: ExamQuestionData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'examQuestions'), {
      ...question,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving exam question:', error);
    throw error;
  }
}

export async function getExamQuestions(language: string = 'th'): Promise<ExamQuestionData[]> {
  try {
    const q = query(
      collection(db, 'examQuestions'),
      where('language', '==', language),
      where('sourceType', '==', 'pdf')
    );
    const snapshot = await getDocs(q);

    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ExamQuestionData[];

    if (questions.length === 0) {
      return PDF_EXAM_QUESTION_TEMPLATES.filter(item => item.language === language);
    }

    return questions;
  } catch (error) {
    console.error('Error getting exam questions:', error);
    return PDF_EXAM_QUESTION_TEMPLATES.filter(item => item.language === language);
  }
}

export async function getRandomExamQuestion(language: string = 'th'): Promise<ExamQuestionData | null> {
  try {
    const questions = await getExamQuestions(language);
    if (questions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  } catch (error) {
    console.error('Error getting random exam question:', error);
    return null;
  }
}

export async function deleteAllExamQuestions(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, 'examQuestions'));
    await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
  } catch (error) {
    console.error('Error clearing exam questions:', error);
    throw error;
  }
}

export async function importPdfExamQuestions(language: 'th' | 'en' = 'th'): Promise<string[]> {
  try {
    const existing = await getDocs(
      query(
        collection(db, 'examQuestions'),
        where('language', '==', language),
        where('sourceType', '==', 'pdf')
      )
    );

    if (!existing.empty) {
      return existing.docs.map(doc => doc.id);
    }

    const templates = PDF_EXAM_QUESTION_TEMPLATES.filter(item => item.language === language);
    const ids = await Promise.all(
      templates.map(async (template) => {
        const docRef = await addDoc(collection(db, 'examQuestions'), {
          ...template,
          createdAt: serverTimestamp(),
        });
        return docRef.id;
      })
    );

    return ids;
  } catch (error) {
    console.error('Error importing PDF exam questions:', error);
    throw error;
  }
}
