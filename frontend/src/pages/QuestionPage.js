import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AudioRecorder } from '../components/AudioRecorder';
import { AnalysisDisplay } from '../components/AnalysisDisplay';
import { cleanupAudioUrl } from '../services/storage';
import { analyzeStudentAnswer, transcribeAudio } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
export const QuestionPage = ({ question, studentId, }) => {
    const { t } = useLanguage();
    const [inputMethod, setInputMethod] = useState('voice');
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [textAnswer, setTextAnswer] = useState('');
    const [transcription, setTranscription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleRecordingComplete = (blob, url) => {
        setAudioBlob(blob);
        setAudioUrl(url);
        setError(null);
    };
    const handleSubmitAnswer = async () => {
        // Get transcription based on input method
        let finalTranscription = '';
        if (inputMethod === 'voice') {
            if (!audioBlob || !audioUrl) {
                setError(t('pleaseRecordAnswer'));
                return;
            }
            try {
                setIsSubmitting(true);
                setError(null);
                finalTranscription = await transcribeAudio(audioBlob);
                setTranscription(finalTranscription);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Transcription error');
                setIsSubmitting(false);
                return;
            }
        }
        else {
            if (!textAnswer.trim()) {
                setError(t('pleaseRecordAnswer'));
                return;
            }
            finalTranscription = textAnswer;
        }
        try {
            setIsAnalyzing(true);
            const result = await analyzeStudentAnswer({
                transcription: finalTranscription,
                questionId: question.id,
                referenceAnswer: question.referenceAnswer,
                scoringGuideline: question.scoringGuideline,
                studentId,
                audioBase64: '',
            }, audioBlob || undefined);
            setAnalysisResult(result);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('unknownError');
            // Provide better error messages for common issues
            if (errorMessage.includes('503') || errorMessage.includes('high demand')) {
                setError('🔄 API Busy: The AI service is experiencing high demand. The system will automatically retry (up to 3 times). Please wait...');
            }
            else if (errorMessage.includes('429')) {
                setError('⏳ Too many requests. Please wait a moment and try again.');
            }
            else {
                setError(errorMessage);
            }
        }
        finally {
            setIsSubmitting(false);
            setIsAnalyzing(false);
        }
    };
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioUrl) {
                cleanupAudioUrl(audioUrl);
            }
        };
    }, [audioUrl]);
    return (_jsx("div", { className: "question-page", children: _jsxs("div", { className: "question-container", children: [_jsxs("div", { className: "question-section", children: [_jsx("h1", { children: t('question') }), _jsxs("div", { className: "question-content", children: [question.questionImage && (_jsx("img", { src: question.questionImage, alt: "Question", className: "question-image" })), _jsx("p", { className: "question-text", children: question.questionText }), question.context && (_jsxs("div", { className: "question-context", children: [_jsx("strong", { children: "Context:" }), _jsx("p", { children: question.context })] }))] })] }), !analysisResult && (_jsxs("div", { className: "recording-section", children: [_jsx("h2", { children: t('recordAnswer') }), _jsx("p", { className: "instructions", children: t('instructions') }), _jsxs("div", { className: "input-method-selector", children: [_jsxs("label", { children: [t('selectInputMethod'), ":"] }), _jsxs("div", { className: "method-buttons", children: [_jsxs("button", { className: `method-btn ${inputMethod === 'voice' ? 'active' : ''}`, onClick: () => setInputMethod('voice'), children: ["\uD83C\uDFA4 ", t('voiceRecording')] }), _jsxs("button", { className: `method-btn ${inputMethod === 'text' ? 'active' : ''}`, onClick: () => setInputMethod('text'), children: ["\u2328\uFE0F ", t('typingAnswer')] })] })] }), inputMethod === 'voice' && (_jsx(AudioRecorder, { onRecordingComplete: handleRecordingComplete, disabled: isSubmitting || isAnalyzing })), inputMethod === 'text' && (_jsx("textarea", { className: "text-input", value: textAnswer, onChange: (e) => setTextAnswer(e.target.value), placeholder: t('typeYourAnswer'), disabled: isSubmitting || isAnalyzing, rows: 6 })), error && _jsx("div", { className: "error-alert", children: error }), _jsx("button", { onClick: handleSubmitAnswer, disabled: (inputMethod === 'voice' && !audioBlob) ||
                                (inputMethod === 'text' && !textAnswer.trim()) ||
                                isSubmitting ||
                                isAnalyzing, className: "btn btn-success btn-large", children: isSubmitting || isAnalyzing ? t('processing') : t('submitAnswer') })] })), (isAnalyzing || analysisResult) && (_jsxs("div", { className: "analysis-section", children: [_jsx(AnalysisDisplay, { result: analysisResult, isLoading: isAnalyzing }), analysisResult && (_jsx("button", { onClick: () => {
                                setAudioBlob(null);
                                setAudioUrl(null);
                                setTextAnswer('');
                                setTranscription('');
                                setAnalysisResult(null);
                            }, className: "btn btn-primary", children: t('tryAnotherQuestion') }))] }))] }) }));
};
