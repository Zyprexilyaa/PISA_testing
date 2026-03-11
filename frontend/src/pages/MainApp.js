import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HomePage } from './HomePage';
import { QuestionPage } from './QuestionPage';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getRandomProposition, initializeSamplePropositions } from '../services/propositionService';
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
    const { user, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('home');
    const { classroomId } = useParams();
    const [studentId] = useState('student-' + Math.random().toString(36).substr(2, 9));
    const [proposition, setProposition] = useState(null);
    const [isLoadingProposition, setIsLoadingProposition] = useState(false);
    const [initialized, setInitialized] = useState(false);
    // NEW: Initialize propositions on first mount
    useEffect(() => {
        const initializeAndLoadProposition = async () => {
            if (initialized)
                return;
            try {
                console.log('📚 Initializing propositions...');
                await initializeSamplePropositions();
                setInitialized(true);
                // Load random proposition
                const prop = await getRandomProposition(language);
                setProposition(prop);
                console.log('✅ Proposition loaded:', prop);
            }
            catch (error) {
                console.error('Error initializing propositions:', error);
                setInitialized(true); // Mark as initialized even if there was an error
            }
        };
        initializeAndLoadProposition();
    }, []); // Run only once on mount
    // If the route includes a classroomId, switch to dashboard view
    useEffect(() => {
        if (classroomId) {
            setCurrentPage('dashboard');
        }
    }, [classroomId]);
    // NEW: Load proposition when page changes to question or language changes
    useEffect(() => {
        const loadProposition = async () => {
            if (currentPage === 'question') {
                setIsLoadingProposition(true);
                try {
                    const prop = await getRandomProposition(language);
                    setProposition(prop);
                }
                catch (error) {
                    console.error('Error loading proposition:', error);
                }
                finally {
                    setIsLoadingProposition(false);
                }
            }
        };
        loadProposition();
    }, [currentPage, language]);
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (_jsxs("div", { className: "app", children: [_jsx("header", { className: "app-header", children: _jsxs("div", { className: "header-content", children: [_jsx("h1", { className: "app-title", children: "\uD83E\uDDE0 PISA Thinking Skills" }), _jsxs("nav", { className: "navigation", children: [_jsx("button", { className: `nav-link ${currentPage === 'home' ? 'active' : ''}`, onClick: () => setCurrentPage('home'), children: language === 'th' ? 'หน้าแรก' : 'Home' }), userRole === 'teacher' ? (_jsx("button", { className: "nav-link", onClick: () => navigate('/create-classroom'), children: language === 'th' ? 'ห้องเรียนของฉัน' : 'My Classrooms' })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: `nav-link ${currentPage === 'question' ? 'active' : ''}`, onClick: () => setCurrentPage('question'), children: language === 'th' ? 'ฝึกฝน' : 'Practice' }), userRole === 'student' && (_jsx("button", { className: "nav-link", onClick: () => navigate('/join-classroom'), children: language === 'th' ? 'เข้าร่วมห้องเรียน' : 'Join Classroom' }))] })), _jsx("button", { className: "nav-link language-toggle", onClick: () => setLanguage(language === 'th' ? 'en' : 'th'), children: language === 'th' ? '🇬🇧 EN' : '🇹🇭 ไทย' }), _jsxs("div", { className: "user-menu", children: [_jsx("span", { className: "user-email", children: user?.email }), _jsx("button", { className: "nav-link logout-btn", onClick: handleLogout, children: language === 'th' ? '🚪 ออกจากระบบ' : '🚪 Logout' })] })] })] }) }), _jsxs("main", { className: "app-main", children: [currentPage === 'home' && _jsx(HomePage, {}), currentPage === 'question' && (_jsx(QuestionPage, { question: sampleQuestion, studentId: studentId, proposition: proposition || undefined }))] }), _jsx("footer", { className: "app-footer", children: _jsx("p", { children: "\u00A9 2024 PISA Thinking Skills Analyzer | AI-Powered Learning" }) })] }));
};
