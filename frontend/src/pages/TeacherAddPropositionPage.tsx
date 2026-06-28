import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { saveExamQuestion, ExamQuestionData } from '../services/examQuestionService';
import './Auth.css';

export const TeacherAddPropositionPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium');
  const [category, setCategory] = useState<'critical-thinking'|'problem-solving'|'analysis'|'comprehension'>('critical-thinking');
  const [expectedAnswer, setExpectedAnswer] = useState('');
  const [language, setLanguage] = useState<'th'|'en'>('th');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!expectedAnswer) {
      setError('Please fill in the expected answer');
      return;
    }

    try {
      setSaving(true);

      let pdfUrl = '';
      let pdfFileName = '';
      if (pdfFile) {
        setUploadingPdf(true);
        const filePath = `exam-questions/${Date.now()}-${pdfFile.name.replace(/\s+/g, '-')}`;
        const fileRef = ref(storage, filePath);
        await uploadBytes(fileRef, pdfFile);
        pdfUrl = await getDownloadURL(fileRef);
        pdfFileName = pdfFile.name;
        setUploadingPdf(false);
      }

      const question: ExamQuestionData = {
        title: title.trim() || (pdfFileName || questionText).slice(0, 80),
        questionText: questionText.trim() || (pdfFileName || 'Question from PDF'),
        difficulty,
        category,
        expectedAnswer,
        language,
        scoringRubric: {
          excellent: { points: 3, description: 'Clear, complete, and well-supported answer' },
          good: { points: 2, description: 'Mostly correct with some support' },
          fair: { points: 1, description: 'Partially correct but limited explanation' },
        },
        sourceType: pdfFile ? 'pdf' : 'text',
        pdfUrl: pdfFile ? pdfUrl : undefined,
        pdfFileName: pdfFile ? pdfFileName : undefined,
      };

      await saveExamQuestion(question);
      setSaving(false);
      navigate('/teacher/propositions');
    } catch (err) {
      setSaving(false);
      setUploadingPdf(false);
      setError('Failed to save exam question');
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <h2 className="auth-subtitle">Add Exam Question</h2>

          <form onSubmit={handleSave} className="auth-form">
            <div className="form-group">
              <label>Question Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Optional title for the exam question" />
            </div>

            <div className="form-group">
              <label>Question Text</label>
              <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="form-input" rows={4} placeholder="Type the prompt here, or upload a PDF to make it the main question source" />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="form-input">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="form-input">
                <option value="critical-thinking">Critical Thinking</option>
                <option value="problem-solving">Problem Solving</option>
                <option value="analysis">Analysis</option>
                <option value="comprehension">Comprehension</option>
              </select>
            </div>

            <div className="form-group">
              <label>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="form-input">
                <option value="th">Thai</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="form-group">
              <label>Upload PDF Question</label>
              <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="form-input" />
              {pdfFile && <div style={{ marginTop: 8, fontSize: 14, color: '#4b5563' }}>Selected PDF: {pdfFile.name}</div>}
            </div>

            <div className="form-group">
              <label>Expected Answer</label>
              <textarea value={expectedAnswer} onChange={(e) => setExpectedAnswer(e.target.value)} className="form-input" rows={3} />
            </div>

            {error && <div className="error-alert">{error}</div>}

            <div className="teacher-actions">
              <button type="submit" disabled={saving || uploadingPdf} className="btn btn-primary">{saving || uploadingPdf ? 'Saving...' : 'Save Exam Question'}</button>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
