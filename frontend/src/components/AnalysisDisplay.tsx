import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
  isLoading?: boolean;
}

const THINKING_LEVELS = {
  1: { name: 'Basic Understanding', color: '#8B0000' },
  2: { name: 'Simple Reasoning', color: '#FF6B35' },
  3: { name: 'Analytical Thinking', color: '#4CAF50' },
  4: { name: 'Complex Reasoning', color: '#1E88E5' },
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  result,
  isLoading = false,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="analysis-loading">
        <div className="spinner"></div>
        <p>Analyzing your answer...</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const levelInfo = THINKING_LEVELS[result.thinkingLevel as keyof typeof THINKING_LEVELS];

  return (
    <div className="analysis-result">
      <div className="result-header">
        <h2>Analysis Results</h2>
      </div>

      {/* Thinking Level */}
      <div className="result-section level-section">
        <div className="level-badge" style={{ backgroundColor: levelInfo.color }}>
          <div className="level-number">{result.thinkingLevel}</div>
          <div className="level-name">{levelInfo.name}</div>
        </div>
      </div>

      {/* Score */}
      <div className="result-section">
        <div className="score-display">
          <div className="score-value">{result.score}</div>
          <div className="score-label">out of 100</div>
        </div>
      </div>

      {/* Transcription */}
      <div className="result-section">
        <div
          className="section-header"
          onClick={() => setExpandedSection(
            expandedSection === 'transcription' ? null : 'transcription'
          )}
        >
          <h3>Your Answer (Transcription)</h3>
          <span className="toggle-icon">
            {expandedSection === 'transcription' ? '▼' : '▶'}
          </span>
        </div>
        {expandedSection === 'transcription' && (
          <div className="section-content">
            <p>{result.transcription}</p>
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="result-section">
        <div
          className="section-header"
          onClick={() => setExpandedSection(
            expandedSection === 'feedback' ? null : 'feedback'
          )}
        >
          <h3>Feedback</h3>
          <span className="toggle-icon">
            {expandedSection === 'feedback' ? '▼' : '▶'}
          </span>
        </div>
        {expandedSection === 'feedback' && (
          <div className="section-content">
            <p>{result.feedback}</p>
          </div>
        )}
      </div>

      {/* Strengths */}
      {result.strengths && result.strengths.length > 0 && (
        <div className="result-section">
          <div
            className="section-header"
            onClick={() => setExpandedSection(
              expandedSection === 'strengths' ? null : 'strengths'
            )}
          >
            <h3>✓ What You Did Well</h3>
            <span className="toggle-icon">
              {expandedSection === 'strengths' ? '▼' : '▶'}
            </span>
          </div>
          {expandedSection === 'strengths' && (
            <div className="section-content">
              <ul>
                {result.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Improvements */}
      {result.improvements && result.improvements.length > 0 && (
        <div className="result-section">
          <div
            className="section-header"
            onClick={() => setExpandedSection(
              expandedSection === 'improvements' ? null : 'improvements'
            )}
          >
            <h3>↑ Areas to Improve</h3>
            <span className="toggle-icon">
              {expandedSection === 'improvements' ? '▼' : '▶'}
            </span>
          </div>
          {expandedSection === 'improvements' && (
            <div className="section-content">
              <ul>
                {result.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Suggested Answer */}
      <div className="result-section">
        <div
          className="section-header"
          onClick={() => setExpandedSection(
            expandedSection === 'suggested' ? null : 'suggested'
          )}
        >
          <h3>Example Answer</h3>
          <span className="toggle-icon">
            {expandedSection === 'suggested' ? '▼' : '▶'}
          </span>
        </div>
        {expandedSection === 'suggested' && (
          <div className="section-content">
            <p>{result.suggestedAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
};
