import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
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
  questionNumber?: string;
  questionImage?: string;
  subject?: string;
  createdBy?: string;
}

interface RawExtractedQuestion {
  sourceFile: string;
  questionNumber: string;
  lineIndex: number;
  prompt: string;
}

const PDF_TEXT_INDEX_URL = '/pdf_text2/extracted_questions.json';

const DEFAULT_PDF_SCORING_RUBRIC = {
  excellent: { points: 3, description: 'Clear and complete answer to the PDF question with correct reasoning.' },
  good: { points: 2, description: 'Mostly correct answer with some reasoning.' },
  fair: { points: 1, description: 'Partial answer or limited reasoning.' },
};

function getPdfFileName(sourceFile: string): string {
  return sourceFile.replace(/\.txt$/i, '.pdf');
}

function normalizePrompt(prompt: string): string {
  return prompt
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapExtractedQuestion(raw: RawExtractedQuestion): ExamQuestionData {
  const pdfFileName = getPdfFileName(raw.sourceFile);
  const sourceBase = pdfFileName.replace(/\.pdf$/i, '');
  const id = `${sourceBase}-${raw.questionNumber}`;

  return {
    id,
    title: `${sourceBase} Q${raw.questionNumber}`,
    questionText: normalizePrompt(raw.prompt),
    difficulty: 'hard',
    category: 'problem-solving',
    expectedAnswer: 'Answer the PISA question using the PDF prompt and supporting rubric.',
    scoringRubric: DEFAULT_PDF_SCORING_RUBRIC,
    language: 'th',
    sourceType: 'pdf',
    pdfUrl: `/pdfs/${pdfFileName}`,
    pdfFileName,
    questionNumber: raw.questionNumber,
  };
}

async function loadExtractedPdfQuestionTemplates(language: string = 'th'): Promise<ExamQuestionData[]> {
  if (language !== 'th') {
    return PDF_EXAM_QUESTION_TEMPLATES.filter(item => item.language === language);
  }

  try {
    const response = await fetch(PDF_TEXT_INDEX_URL);
    if (!response.ok) {
      throw new Error(`Unable to load extracted PDF questions (${response.status})`);
    }

    const rawData = await response.json() as Record<string, RawExtractedQuestion[]>;
    const questions: ExamQuestionData[] = [];

    for (const sourceFile of Object.keys(rawData)) {
      const items = rawData[sourceFile] || [];
      for (const item of items) {
        questions.push(mapExtractedQuestion(item));
      }
    }

    if (questions.length > 0) {
      return questions;
    }
  } catch (error) {
    console.warn('Could not load extracted PDF questions:', error);
  }

  return PDF_EXAM_QUESTION_TEMPLATES.filter(item => item.language === language);
}

export const PDF_EXAM_QUESTION_TEMPLATES: ExamQuestionData[] = [ 
  {
    id: 'pisa-old-test-1',
    title: 'PISA Old Test 1',
    questionText: 'Open the attached PISA PDF and answer the exam question inside. PDF1 is currently scanned and requires OCR from the source file.',
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
    id: 'pisa-old-test-2',
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
    id: 'pisa-old-test-3',
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
      return await loadExtractedPdfQuestionTemplates(language);
    }

    return questions;
  } catch (error) {
    console.error('Error getting exam questions:', error);
    return await loadExtractedPdfQuestionTemplates(language);
  }
}

export async function getExamQuestionById(id: string, language: string = 'th'): Promise<ExamQuestionData | null> {
  try {
    const docRef = doc(db, 'examQuestions', id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as ExamQuestionData;
    }
  } catch (error) {
    console.error('Error getting exam question by ID:', error);
  }

  const templates = await loadExtractedPdfQuestionTemplates(language);
  return templates.find(item => item.id === id) ?? null;
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

    const templates = await loadExtractedPdfQuestionTemplates(language);
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
