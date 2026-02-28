import React, { useState, useEffect } from 'react';
import { Question, AnalysisResult } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { AnalysisDisplay } from '../components/AnalysisDisplay';
import { cleanupAudioUrl } from '../services/storage';
import { analyzeStudentAnswer, transcribeAudio } from '../services/api';

interface QuestionPageProps {
  question: Question;
  studentId: string;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  studentId,
}) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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
    if (!audioBlob || !audioUrl) {
      setError('Please record an audio answer first.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Transcribe audio from blob (without storage)
      const transcribedText = await transcribeAudio(audioBlob);
      setTranscription(transcribedText);

      // Analyze the answer
      setIsAnalyzing(true);
      const result = await analyzeStudentAnswer({
        transcription: transcribedText,
        questionId: question.id,
        referenceAnswer: question.referenceAnswer,
        scoringGuideline: question.scoringGuideline,
        studentId,
        audioBase64: '', // Optional: audio data can be sent here if needed
      }, audioBlob);

      setAnalysisResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
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
          <h1>Question</h1>
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
            <h2>Record Your Answer</h2>
            <p className="instructions">
              Please speak your answer clearly. Take your time to explain your thinking.
            </p>
            
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isSubmitting || isAnalyzing}
            />

            {error && <div className="error-alert">{error}</div>}

            <button
              onClick={handleSubmitAnswer}
              disabled={!audioBlob || isSubmitting || isAnalyzing}
              className="btn btn-success btn-large"
            >
              {isSubmitting ? 'Processing...' : 'Submit Answer'}
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
                  setTranscription('');
                  setAnalysisResult(null);
                }}
                className="btn btn-primary"
              >
                Try Another Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
