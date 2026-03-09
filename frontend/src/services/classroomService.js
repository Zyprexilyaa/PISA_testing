import { getFirestore, collection, doc, getDoc, getDocs, addDoc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import app from '../services/firebase';
/**
 * Generate a unique classroom key (6-character alphanumeric)
 */
export function generateClassroomKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
/**
 * Create a new classroom
 */
export async function createClassroom(teacherId, className) {
    try {
        const db = getFirestore(app);
        const classKey = generateClassroomKey();
        const classroomData = {
            teacherId,
            className,
            classKey,
            createdAt: new Date(),
            students: [],
        };
        const docRef = await addDoc(collection(db, 'classrooms'), classroomData);
        const classroom = {
            id: docRef.id,
            ...classroomData,
        };
        console.log('✅ Classroom created:', classroom);
        return classroom;
    }
    catch (error) {
        console.error('Error creating classroom:', error);
        throw error;
    }
}
/**
 * Get all classrooms for a teacher
 */
export async function getTeacherClassrooms(teacherId) {
    try {
        const db = getFirestore(app);
        const q = query(collection(db, 'classrooms'), where('teacherId', '==', teacherId));
        const querySnapshot = await getDocs(q);
        const classrooms = [];
        querySnapshot.forEach((doc) => {
            classrooms.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
            });
        });
        return classrooms;
    }
    catch (error) {
        console.error('Error getting teacher classrooms:', error);
        return [];
    }
}
/**
 * Join a classroom using class key
 */
export async function joinClassroom(studentId, classKey) {
    try {
        const db = getFirestore(app);
        const q = query(collection(db, 'classrooms'), where('classKey', '==', classKey));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error('Classroom not found. Please check the class key.');
        }
        const classroomDoc = querySnapshot.docs[0];
        const classroomData = classroomDoc.data();
        // Check if student is already in the classroom
        if (classroomData.students.includes(studentId)) {
            throw new Error('You are already a member of this classroom.');
        }
        // Add student to classroom
        await updateDoc(doc(db, 'classrooms', classroomDoc.id), {
            students: arrayUnion(studentId),
        });
        const classroom = {
            id: classroomDoc.id,
            ...classroomData,
            createdAt: classroomData.createdAt.toDate(),
        };
        console.log('✅ Joined classroom:', classroom);
        return classroom;
    }
    catch (error) {
        console.error('Error joining classroom:', error);
        throw error;
    }
}
/**
 * Get student's classrooms
 */
export async function getStudentClassrooms(studentId) {
    try {
        const db = getFirestore(app);
        const q = query(collection(db, 'classrooms'), where('students', 'array-contains', studentId));
        const querySnapshot = await getDocs(q);
        const classrooms = [];
        querySnapshot.forEach((doc) => {
            classrooms.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
            });
        });
        return classrooms;
    }
    catch (error) {
        console.error('Error getting student classrooms:', error);
        return [];
    }
}
/**
 * Save a classroom submission (when student answers a question)
 */
export async function saveClassroomSubmission(submission) {
    try {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, 'classroomSubmissions'), {
            ...submission,
            submittedAt: new Date(),
        });
        console.log('✅ Classroom submission saved:', docRef.id);
        return docRef.id;
    }
    catch (error) {
        console.error('Error saving classroom submission:', error);
        throw error;
    }
}
/**
 * Get all submissions for a classroom
 */
export async function getClassroomSubmissions(classroomId) {
    try {
        const db = getFirestore(app);
        const q = query(collection(db, 'classroomSubmissions'), where('classroomId', '==', classroomId));
        const querySnapshot = await getDocs(q);
        const submissions = [];
        querySnapshot.forEach((doc) => {
            submissions.push({
                id: doc.id,
                ...doc.data(),
                submittedAt: doc.data().submittedAt.toDate(),
            });
        });
        return submissions;
    }
    catch (error) {
        console.error('Error getting classroom submissions:', error);
        return [];
    }
}
/**
 * Get user display name from Firebase Auth
 */
export async function getUserDisplayName(userId) {
    try {
        const db = getFirestore(app);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().email || 'Unknown User';
        }
        return 'Unknown User';
    }
    catch (error) {
        console.error('Error getting user display name:', error);
        return 'Unknown User';
    }
}
