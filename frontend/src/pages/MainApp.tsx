import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { HomePage } from './HomePage';
import { QuestionPage } from './QuestionPage';
import { Question } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getRandomExamQuestion, ExamQuestionData } from '../services/examQuestionService';

// Sample question for demo (Thai version)
const sampleQuestion: Question = {
  id: 'q1',
  questionText: 'มลพิษของน้ำส่งผลต่อระบบนิเวศทางน้ำและประชาคมที่พึ่งพิงน้ำอย่างไร?',
  difficulty: 'hard',
  subject: 'วิทยาศาสตร์สิ่งแวดล้อม',
  referenceAnswer: 'มลพิษของน้ำทำให้ระบบนิเวศทางน้ำเสียหาย โดยสารพิษจะพิษสัตว์น้ำ ลดระดับออกซิเจน (eutrophication) และหยุดชุมโซ่อาหาร ซึ่งส่งผลต่อสุขภาพของระบบนิเวศและประชาชนที่พึ่งพิงการตกปลา น้ำดื่ม และสันทนาการ',
  scoringGuideline: 'ให้คะแนนสำหรับ: (1) การระบุประเภทความเสียหายเฉพาะต่อสิ่งมีชีวิต (2) การอธิบายกลไกเช่นการสูญเสียออกซิเจน (3) การป้องกันระบบนิเวศ (4) การเชื่อมต่อกับผลกระทบต่อมนุษย์',
  createdAt: new Date(),
};

type PageType = 'home' | 'question' | 'dashboard';

export const MainApp: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const { '*': subpath } = useParams();
  
  const [studentId] = useState('student-' + Math.random().toString(36).substr(2, 9));
  const [examQuestion, setExamQuestion] = useState<ExamQuestionData | null>(null);
  const [isLoadingProposition, setIsLoadingProposition] = useState(false);

  // Determine current page based on the active route
  const currentPage = subpath?.includes('practice') ? 'question' : 'home';

  // Load a real exam question when the practice route is active
  useEffect(() => {
    const loadExamQuestion = async () => {
      if (currentPage !== 'question') {
        return;
      }

      setIsLoadingProposition(true);
      try {
        const nextQuestion = await getRandomExamQuestion(language);
        setExamQuestion(nextQuestion);
      } catch (error) {
        console.error('❌ Error loading exam question:', error);
        setExamQuestion(null);
      } finally {
        setIsLoadingProposition(false);
      }
    };

    loadExamQuestion();
  }, [currentPage, language]);

  // Map the loaded exam question into a Question so the UI shows the real problem
  const activeQuestion: Question = examQuestion
    ? {
        id: examQuestion.id || 'exam-q-' + Math.random().toString(36).slice(2, 10),
        questionText: examQuestion.questionText,
        difficulty: examQuestion.difficulty,
        subject: examQuestion.subject || examQuestion.category,
        referenceAnswer: examQuestion.expectedAnswer,
        scoringGuideline: sampleQuestion.scoringGuideline,
        createdAt: new Date(),
        questionImage: examQuestion.questionImage,
        context: examQuestion.sourceType === 'pdf' && examQuestion.pdfFileName
          ? `PDF source: ${examQuestion.pdfFileName}`
          : undefined,
      }
    : sampleQuestion;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="app theme-blue">
      <header className="app-header">
        <div className="header-content">
          <div className="app-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <img src="/assets/pisa-logo.png" alt="PISA Insight Logo" className="header-logo-img" />
            <span className="app-title">PISA Insight</span>
          </div>
          <nav className="navigation">
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navigate('/home')}
            >
              {language === 'th' ? 'หน้าแรก' : 'Home'}
            </button>
            {/* Role-based navigation */}
            {userRole === 'teacher' ? (
              <>
                <button
                  className="nav-link"
                  onClick={() => navigate('/create-classroom')}
                >
                  {language === 'th' ? 'ห้องเรียนของฉัน' : 'My Classrooms'}
                </button>
                <button
                  className="nav-link"
                  onClick={() => navigate('/teacher/propositions')}
                >
                  {language === 'th' ? 'ข้อเสนอปัญหา' : 'Propositions'}
                </button>
              </>
            ) : (
              <>
                <button
                  className={`nav-link ${currentPage === 'question' ? 'active' : ''}`}
                  onClick={() => navigate('/home/practice')}
                >
                  {language === 'th' ? 'ฝึกฝน' : 'Practice'}
                </button>
                {userRole === 'student' && (
                  <button
                    className="nav-link"
                    onClick={() => navigate('/join-classroom')}
                  >
                    {language === 'th' ? 'เข้าร่วมห้องเรียน' : 'Join Classroom'}
                  </button>
                )}
              </>
            )}
            <button
              className="nav-link language-toggle"
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            >
              {language === 'th' ? '🇬🇧 EN' : '🇹🇭 ไทย'}
            </button>
            <div className="user-menu">
              <span className="user-email">
                {user?.displayName ? (
                  <>
                    <span style={{fontWeight: 'bold'}}>{user.displayName}</span>
                    <br/>
                    <small style={{opacity: 0.8}}>{user.email}</small>
                  </>
                ) : (
                  user?.email
                )}
              </span>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                {language === 'th' ? '🚪 ออกจากระบบ' : '🚪 Logout'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/practice" element={
            isLoadingProposition ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{language === 'th' ? 'กำลังโหลดคำถาม...' : 'Loading question...'}</p>
              </div>
            ) : examQuestion ? (
              <QuestionPage 
                question={activeQuestion}
                studentId={studentId}
                proposition={examQuestion}
              />
            ) : (
              <div className="error-container">
                <h2>{language === 'th' ? 'ไม่สามารถโหลดคำถามได้' : 'Cannot load question'}</h2>
                <p>{language === 'th' ? 'กรุณาลองอีกครั้งหรือติดต่อผู้ดูแลระบบ' : 'Please try again or contact administrator'}</p>
                <button onClick={() => navigate('/home')} className="btn btn-primary">
                  {language === 'th' ? 'กลับสู่หน้าหลัก' : 'Back to Home'}
                </button>
              </div>
            )
          } />
          <Route path="/home/practice" element={
            isLoadingProposition ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{language === 'th' ? 'กำลังโหลดคำถาม...' : 'Loading question...'}</p>
              </div>
            ) : examQuestion ? (
              <QuestionPage 
                question={activeQuestion}
                studentId={studentId}
                proposition={examQuestion}
              />
            ) : (
              <div className="error-container">
                <h2>{language === 'th' ? 'ไม่สามารถโหลดคำถามได้' : 'Cannot load question'}</h2>
                <p>{language === 'th' ? 'กรุณาลองอีกครั้งหรือติดต่อผู้ดูแลระบบ' : 'Please try again or contact administrator'}</p>
                <button onClick={() => navigate('/home')} className="btn btn-primary">
                  {language === 'th' ? 'กลับสู่หน้าหลัก' : 'Back to Home'}
                </button>
              </div>
            )
          } />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>© 2026 PISA Insight Analyzer | AI-Powered Learning</p>
      </footer>
    </div>
  );
};
