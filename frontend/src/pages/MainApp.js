import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePage } from './HomePage';
import { QuestionPage } from './QuestionPage';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
// Sample question for demo (Thai version)
const sampleQuestion = {
    id: 'q1',
    questionText: 'มลพิษของน้ำส่งผลต่อระบบนิเวศทางน้ำและประชาคมที่พึ่งพิงน้ำอย่างไร?',
    difficulty: 'hard',
    subject: 'วิทยาศาสตร์สิ่งแวดล้อม',
    referenceAnswer: 'มลพิษของน้ำทำให้ระบบนิเวศทางน้ำเสียหาย โดยสารพิษจะพิษสัตว์น้ำ ลดระดับออกซิเจน (eutrophication) และหยุดชุมโซ่อาหาร ซึ่งส่งผลต่อสุขภาพของระบบนิเวศและประชาชนที่พึ่งพิงการตกปลา น้ำดื่ม และสันทนาการ',
    scoringGuideline: 'ให้คะแนนสำหรับ: (1) การระบุประเภทความเสียหายเฉพาะต่อสิ่งมีชีวิต (2) การอธิบายกลไกเช่นการสูญเสียออกซิเจน (3) การป้องกันระบบนิเวศ (4) การเชื่อมต่อกับผลกระทบต่อมนุษย์',
    createdAt: new Date(),
};
export const MainApp = () => {
    const { language, setLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('home');
    const [studentId] = useState('student-' + Math.random().toString(36).substr(2, 9));
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (_jsxs("div", { className: "app", children: [_jsx("header", { className: "app-header", children: _jsxs("div", { className: "header-content", children: [_jsx("h1", { className: "app-title", children: "\uD83E\uDDE0 PISA Thinking Skills" }), _jsxs("nav", { className: "navigation", children: [_jsx("button", { className: `nav-link ${currentPage === 'home' ? 'active' : ''}`, onClick: () => setCurrentPage('home'), children: language === 'th' ? 'หน้าแรก' : 'Home' }), _jsx("button", { className: `nav-link ${currentPage === 'question' ? 'active' : ''}`, onClick: () => setCurrentPage('question'), children: language === 'th' ? 'ฝึกฝน' : 'Practice' }), _jsx("button", { className: "nav-link language-toggle", onClick: () => setLanguage(language === 'th' ? 'en' : 'th'), children: language === 'th' ? '🇬🇧 EN' : '🇹🇭 ไทย' }), _jsxs("div", { className: "user-menu", children: [_jsx("span", { className: "user-email", children: user?.email }), _jsx("button", { className: "nav-link logout-btn", onClick: handleLogout, children: language === 'th' ? '🚪 ออกจากระบบ' : '🚪 Logout' })] })] })] }) }), _jsxs("main", { className: "app-main", children: [currentPage === 'home' && _jsx(HomePage, {}), currentPage === 'question' && (_jsx(QuestionPage, { question: sampleQuestion, studentId: studentId }))] }), _jsx("footer", { className: "app-footer", children: _jsx("p", { children: "\u00A9 2024 PISA Thinking Skills Analyzer | AI-Powered Learning" }) })] }));
};
