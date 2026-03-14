import axios from 'axios';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, query, where, updateDoc } from 'firebase/firestore';
import app from '../services/firebase';
import { FUNCTIONS_URL } from './api';
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
export async function createClassroom(teacherId, className, teacherName) {
    try {
        const db = getFirestore(app);
        const classKey = generateClassroomKey();
        const classroomData = {
            teacherId,
            className,
            classKey,
            createdAt: new Date(),
            students: [],
            ...(teacherName ? { teacherName } : {}),
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
        // Use server endpoint to join classroom to avoid Firestore rule query issues
        const resp = await axios.post(`${FUNCTIONS_URL}/joinClassroom`, { studentId, classKey });
        const classroom = resp.data.classroom;
        return {
            id: classroom.id,
            ...classroom,
            createdAt: classroom.createdAt ? new Date(classroom.createdAt._seconds * 1000) : new Date(),
        };
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
 * Get classroom details by ID
 */
export async function getClassroomById(classroomId) {
    try {
        const db = getFirestore(app);
        const docRef = doc(db, 'classrooms', classroomId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt.toDate(),
            };
        }
        return null;
    }
    catch (error) {
        console.error('Error getting classroom:', error);
        return null;
    }
}
/**
 * Update the list of assigned propositions for a classroom
 */
export async function updateClassroomAssignments(classroomId, assignedPropositionIds) {
    try {
        const db = getFirestore(app);
        const ref = doc(db, 'classrooms', classroomId);
        await updateDoc(ref, { assignedPropositionIds });
        console.log('✅ Updated assigned propositions for classroom', classroomId, assignedPropositionIds);
    }
    catch (error) {
        console.error('Error updating classroom assignments:', error);
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
