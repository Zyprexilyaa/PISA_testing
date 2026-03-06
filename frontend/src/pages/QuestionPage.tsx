import React, { useState, useEffect } from 'react';
import { Question, AnalysisResult } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { AnalysisDisplay } from '../components/AnalysisDisplay';
import { cleanupAudioUrl } from '../services/storage';
import { analyzeStudentAnswer, transcribeAudio } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface QuestionPageProps {
  question: Question;
  studentId: string;
}

type InputMethod = 'voice' | 'text';

export const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  studentId,
}) => {
  const { t } = useLanguage();
  const [inputMethod, setInputMethod] = useState<InputMethod>('voice');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecordingComplete = (blob: Blob, url: string) => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Transcription error');
        setIsSubmitting(false);
        return;
      }
    } else {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('unknownError');
      
      // Provide better error messages for common issues
      if (errorMessage.includes('503') || errorMessage.includes('high demand')) {
        setError('🔄 API Busy: The AI service is experiencing high demand. The system will automatically retry (up to 3 times). Please wait...');
      } else if (errorMessage.includes('429')) {
        setError('⏳ Too many requests. Please wait a moment and try again.');
      } else {
        setError(errorMessage);
      }

    } finally {
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

  return (
    <div className="question-page">
      <div className="question-container">
        {/* Question Display */}
        <div className="question-section">
          <h1>{t('question')}</h1>
          <div className="question-content">
            {question.questionImage && (
              <img
                src={question.questionImage}
                alt="Question"
                className="question-image"
              />
            )}
            <p className="question-text">{question.questionText}</p>
            {question.context && (
              <div className="question-context">
                <strong>Context:</strong>
                <p>{question.context}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recording Section */}
        {!analysisResult && (
          <div className="recording-section">
            <h2>{t('recordAnswer')}</h2>
            <p className="instructions">{t('instructions')}</p>

            {/* Input Method Selection */}
            <div className="input-method-selector">
              <label>{t('selectInputMethod')}:</label>
              <div className="method-buttons">
                <button
                  className={`method-btn ${inputMethod === 'voice' ? 'active' : ''}`}
                  onClick={() => setInputMethod('voice')}
                >
                  🎤 {t('voiceRecording')}
                </button>
                <button
                  className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
                  onClick={() => setInputMethod('text')}
                >
                  ⌨️ {t('typingAnswer')}
                </button>
              </div>
            </div>

            {/* Voice Recording */}
            {inputMethod === 'voice' && (
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                disabled={isSubmitting || isAnalyzing}
              />
            )}

            {/* Text Input */}
            {inputMethod === 'text' && (
              <textarea
                className="text-input"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder={t('typeYourAnswer')}
                disabled={isSubmitting || isAnalyzing}
                rows={6}
              />
            )}

            {error && <div className="error-alert">{error}</div>}

            <button
              onClick={handleSubmitAnswer}
              disabled={
                (inputMethod === 'voice' && !audioBlob) ||
                (inputMethod === 'text' && !textAnswer.trim()) ||
                isSubmitting ||
                isAnalyzing
              }
              className="btn btn-success btn-large"
            >
              {isSubmitting || isAnalyzing ? t('processing') : t('submitAnswer')}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {(isAnalyzing || analysisResult) && (
          <div className="analysis-section">
            <AnalysisDisplay
              result={analysisResult}
              isLoading={isAnalyzing}
            />

            {analysisResult && (
              <button
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setTextAnswer('');
                  setTranscription('');
                  setAnalysisResult(null);
                }}
                className="btn btn-primary"
              >
                {t('tryAnotherQuestion')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
