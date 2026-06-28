import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';
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
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    catch (error) {
        console.error('Error getting exam questions:', error);
        return [];
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
