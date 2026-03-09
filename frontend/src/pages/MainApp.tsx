import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePage } from './HomePage';
import { QuestionPage } from './QuestionPage';
import { Question } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [studentId] = useState('student-' + Math.random().toString(36).substr(2, 9));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🧠 PISA Thinking Skills</h1>
          <nav className="navigation">
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              {language === 'th' ? 'หน้าแรก' : 'Home'}
            </button>
            <button
              className={`nav-link ${currentPage === 'question' ? 'active' : ''}`}
              onClick={() => setCurrentPage('question')}
            >
              {language === 'th' ? 'ฝึกฝน' : 'Practice'}
            </button>
            <button
              className="nav-link language-toggle"
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            >
              {language === 'th' ? '🇬🇧 EN' : '🇹🇭 ไทย'}
            </button>
            <div className="user-menu">
              <span className="user-email">{user?.email}</span>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                {language === 'th' ? '🚪 ออกจากระบบ' : '🚪 Logout'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'question' && (
          <QuestionPage question={sampleQuestion} studentId={studentId} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 PISA Thinking Skills Analyzer | AI-Powered Learning</p>
      </footer>
    </div>
  );
};
