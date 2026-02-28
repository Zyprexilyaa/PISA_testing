import React, { useRef, useState } from 'react';
import { RecordingState } from '../types';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  disabled = false,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    audioBlob: null,
    audioUrl: null,
    recordingTime: 0,
    error: null,
  });

  const startRecording = async () => {
    try {
      // Feature detection: MediaRecorder availability
      if (typeof MediaRecorder === 'undefined') {
        setState((prev) => ({ ...prev, error: 'Browser does not support MediaRecorder API.' }));
        return;
      }

      // Choose a supported mimeType if possible
      const candidateTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
      ];
      let chosenType: string | undefined;
      for (const t of candidateTypes) {
        try {
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
            chosenType = t;
            break;
          }
        } catch (e) {
          // ignore and continue
        }
      }
      setState((prev) => ({ ...prev, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = chosenType
        ? new MediaRecorder(stream, { mimeType: chosenType })
        : new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setState((prev) => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
        }));
        
        onRecordingComplete(audioBlob, audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        // Clear recording timer
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      
      setState((prev) => ({ ...prev, isRecording: true, recordingTime: 0 }));
      
      // Update recording time
      intervalRef.current = window.setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingTime: prev.isRecording ? prev.recordingTime + 1 : prev.recordingTime,
        }));
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({
        ...prev,
        error: `Failed to start recording: ${errorMessage}`,
      }));
    }
  };

  // Cleanup on unmount: stop tracks, clear timers, revoke object URLs
  React.useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Revoke any created object URLs
      if (state.audioUrl) {
        try {
          URL.revokeObjectURL(state.audioUrl);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [state.audioUrl]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      // Clear interval in case onstop hasn't run yet
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setState({
      isRecording: false,
      audioBlob: null,
      audioUrl: null,
      recordingTime: 0,
      error: null,
    });
    audioChunksRef.current = [];
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-controls">
        {!state.audioBlob ? (
          <>
            {!state.isRecording ? (
              <button
                onClick={startRecording}
                disabled={disabled}
                className="btn btn-primary"
              >
                🎤 Start Recording
              </button>
            ) : (
              <>
                <button
                  onClick={stopRecording}
                  className="btn btn-danger"
                >
                  ⏹ Stop Recording
                </button>
                <span className="recording-time">{formatTime(state.recordingTime)}</span>
              </>
            )}
          </>
        ) : (
          <button
            onClick={resetRecording}
            className="btn btn-secondary"
          >
            🔄 Record Again
          </button>
        )}
      </div>

      {state.audioUrl && (
        <div className="audio-playback">
          <label>Playback:</label>
          <audio controls src={state.audioUrl} />
        </div>
      )}

      {state.error && (
        <div className="error-message">
          {state.error}
        </div>
      )}
    </div>
  );
};
