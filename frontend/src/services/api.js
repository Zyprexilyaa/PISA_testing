import axios from 'axios';
export const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL || 'http://localhost:5000';
const API_BASE = FUNCTIONS_URL;
/**
 * Convert blob to base64 string
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            resolve(base64.split(',')[1] || ''); // Remove the "data:audio/webm;base64," prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
/**
 * Send student answer to backend for AI analysis
 * @param data - Answer data including transcription and question info
 * @param audioBlob - Optional audio blob for storage (can be undefined for free version)
 * @returns Analysis result with thinking level, score, and feedback
 */
export async function analyzeStudentAnswer(data, audioBlob) {
    try {
        const requestData = { ...data };
        console.log('🚀 Sending analysis request to:', `${API_BASE}/analyzeAnswer`);
        console.log('📝 Request data:', requestData);
        // If audio blob provided, convert to base64 (free option without storage)
        if (audioBlob) {
            try {
                requestData.audioBase64 = await blobToBase64(audioBlob);
                console.log('🎵 Audio converted to base64, size:', requestData.audioBase64.length);
            }
            catch (error) {
                console.warn('Could not convert audio to base64, continuing without it', error);
            }
        }
        const response = await axios.post(`${API_BASE}/analyzeAnswer`, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('✅ Analysis response received:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('❌ Error analyzing answer:', error);
        throw new Error(`Failed to analyze answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Transcribe audio using Google Cloud Speech-to-Text
 * @param audioBlob - Audio file as blob
 * @returns Transcribed text
 */
export async function transcribeAudio(audioBlob) {
    try {
        console.log('🎤 Starting transcription...');
        // Convert blob to base64
        const audioBase64 = await blobToBase64(audioBlob);
        console.log('📤 Sending transcription request, audio size:', audioBase64.length);
        const response = await axios.post(`${API_BASE}/transcribeAudio`, {
            audioData: audioBase64,
        });
        console.log('✅ Transcription received:', response.data.transcription);
        return response.data.transcription;
    }
    catch (error) {
        console.error('❌ Error transcribing audio:', error);
        throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
