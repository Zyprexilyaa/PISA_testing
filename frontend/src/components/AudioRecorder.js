import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef, useState } from 'react';
export const AudioRecorder = ({ onRecordingComplete, disabled = false, }) => {
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const intervalRef = useRef(null);
    const streamRef = useRef(null);
    const [state, setState] = useState({
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
            let chosenType;
            for (const t of candidateTypes) {
                try {
                    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
                        chosenType = t;
                        break;
                    }
                }
                catch (e) {
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
        }
        catch (error) {
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
                }
                catch (e) {
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
                }
                catch (e) {
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
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    return (_jsxs("div", { className: "audio-recorder", children: [_jsx("div", { className: "recorder-controls", children: !state.audioBlob ? (_jsx(_Fragment, { children: !state.isRecording ? (_jsx("button", { onClick: startRecording, disabled: disabled, className: "btn btn-primary", children: "\uD83C\uDFA4 Start Recording" })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: stopRecording, className: "btn btn-danger", children: "\u23F9 Stop Recording" }), _jsx("span", { className: "recording-time", children: formatTime(state.recordingTime) })] })) })) : (_jsx("button", { onClick: resetRecording, className: "btn btn-secondary", children: "\uD83D\uDD04 Record Again" })) }), state.audioUrl && (_jsxs("div", { className: "audio-playback", children: [_jsx("label", { children: "Playback:" }), _jsx("audio", { controls: true, src: state.audioUrl })] })), state.error && (_jsx("div", { className: "error-message", children: state.error }))] }));
};
