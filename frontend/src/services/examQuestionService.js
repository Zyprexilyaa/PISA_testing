import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';
export const SAMPLE_EXAM_QUESTIONS = [
    {
        title: 'PISA Climate Response',
        questionText: 'นักเรียนในเมืองหนึ่งกำลังเผชิญกับปัญหาควันพิษอย่างรุนแรง คุณจะเสนอวิธีแก้ปัญหาอย่างไร และอธิบายข้อดีข้อเสียของแต่ละวิธี?',
        difficulty: 'medium',
        category: 'critical-thinking',
        expectedAnswer: 'ควรเสนอวิธีแก้ปัญหาหลายแบบ เช่น ลดการใช้รถยนต์ การใช้พลังงานสะอาด การปลูกต้นไม้ และควบคุมโรงงาน พร้อมวิเคราะห์ข้อดีข้อเสียของแต่ละวิธี',
        language: 'th',
        scoringRubric: {
            excellent: { points: 3, description: 'ระบุวิธีเด่นหลายวิธีและวิเคราะห์ข้อดีข้อเสียเชิงลึก' },
            good: { points: 2, description: 'ระบุวิธีหลักและวิเคราะห์ได้บางส่วน' },
        },
        sourceType: 'text',
    },
    {
        title: 'Education and Development',
        questionText: 'ทำไมการศึกษาจึงมีความสำคัญต่อการพัฒนาประเทศ? ให้เหตุผลอย่างน้อย 3 ข้อ.',
        difficulty: 'medium',
        category: 'analysis',
        expectedAnswer: 'การศึกษาช่วยพัฒนาทักษะแรงงาน ส่งเสริมความคิดสร้างสรรค์ และช่วยเพิ่มคุณภาพชีวิตของประชาชน',
        language: 'th',
        scoringRubric: {
            excellent: { points: 3, description: 'ให้เหตุผลครบถ้วนและชัดเจน' },
            good: { points: 2, description: 'ให้เหตุผลอย่างน้อย 3 ข้อ' },
        },
        sourceType: 'text',
    },
];
export async function saveExamQuestion(question) {
    try {
        const docRef = await addDoc(collection(db, 'examQuestions'), {
            ...question,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error saving exam question:', error);
        throw error;
    }
}
export async function getExamQuestions(language = 'th') {
    try {
        const q = query(collection(db, 'examQuestions'), where('language', '==', language));
        const snapshot = await getDocs(q);
        const questions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        if (questions.length === 0) {
            return SAMPLE_EXAM_QUESTIONS.filter(item => item.language === language);
        }
        return questions;
    }
    catch (error) {
        console.error('Error getting exam questions:', error);
        return SAMPLE_EXAM_QUESTIONS.filter(item => item.language === language);
    }
}
export async function getRandomExamQuestion(language = 'th') {
    try {
        const questions = await getExamQuestions(language);
        if (questions.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex];
    }
    catch (error) {
        console.error('Error getting random exam question:', error);
        return null;
    }
}
export async function deleteAllExamQuestions() {
    try {
        const snapshot = await getDocs(collection(db, 'examQuestions'));
        await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
    }
    catch (error) {
        console.error('Error clearing exam questions:', error);
        throw error;
    }
}
