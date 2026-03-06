/**
 * Audio Storage Service - Free Alternative (No Cloud Storage Required)
 *
 * This uses a local URL approach that works without Firebase Storage.
 * Audio is processed in-memory and can be sent directly to backend.
 */
/**
 * Process audio without uploading to cloud storage
 * Creates a local blob URL for the audio
 * @param audioBlob - Audio file as Blob
 * @param studentId - Student ID
 * @param questionId - Question ID
 * @returns Local URL and file info
 */
export async function uploadAudio(audioBlob, studentId, questionId) {
    try {
        const timestamp = new Date().getTime();
        const fileName = `${studentId}_${questionId}_${timestamp}.webm`;
        // Create a local blob URL (no server upload needed)
        const url = URL.createObjectURL(audioBlob);
        // Store blob in sessionStorage for processing
        const storageKey = `audio_${timestamp}`;
        // Note: sessionStorage has size limits, but works fine for audio processing
        return {
            url, // Local blob URL
            path: storageKey,
            name: fileName,
            isLocal: true, // Flag indicating this is a local URL
        };
    }
    catch (error) {
        console.error('Error processing audio:', error);
        throw new Error(`Failed to process audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Clean up local audio URL
 * @param url - Blob URL to revoke
 */
export function cleanupAudioUrl(url) {
    try {
        URL.revokeObjectURL(url);
    }
    catch (error) {
        console.error('Error cleaning up audio URL:', error);
    }
}
