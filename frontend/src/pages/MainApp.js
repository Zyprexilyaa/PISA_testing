import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
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
    const { '*': subpath } = useParams();
    const [studentId] = useState('student-' + Math.random().toString(36).substr(2, 9));
    const [proposition, setProposition] = useState(null);
    const [isLoadingProposition, setIsLoadingProposition] = useState(false);
    const [initialized, setInitialized] = useState(false);
    // Determine current page based on subpath
    const currentPage = subpath === 'practice' ? 'question' : 'home';
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
    // NEW: Load proposition when page changes to practice or language changes
    useEffect(() => {
        const loadProposition = async () => {
            if (currentPage === 'question') {
                console.log('🔄 Starting proposition load...');
                setIsLoadingProposition(true);
                try {
                    const prop = await getRandomProposition(language);
                    console.log('✅ Proposition loaded in useEffect:', prop);
                    setProposition(prop);
                }
                catch (error) {
                    console.error('❌ Error loading proposition:', error);
                    setProposition(null);
                }
                finally {
                    setIsLoadingProposition(false);
                }
            }
        };
        loadProposition();
    }, [currentPage, language]);
    // Map loaded proposition into a Question so UI shows the actual problem
    const activeQuestion = proposition
        ? {
            id: proposition.id || 'prop-' + Math.random().toString(36).slice(2, 10),
            questionText: proposition.questionText,
            difficulty: proposition.difficulty,
            subject: proposition.category,
            referenceAnswer: proposition.expectedAnswer,
            scoringGuideline: sampleQuestion.scoringGuideline,
            createdAt: new Date(),
        }
        : sampleQuestion;
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (_jsxs("div", { className: "app theme-blue", children: [_jsx("header", { className: "app-header", children: _jsxs("div", { className: "header-content", children: [_jsxs("div", { className: "app-logo", onClick: () => navigate('/home'), style: { cursor: 'pointer' }, children: [_jsx("img", { src: "/assets/pisa-logo.png", alt: "PISA Insight Logo", className: "header-logo-img" }), _jsx("span", { className: "app-title", children: "PISA Insight" })] }), _jsxs("nav", { className: "navigation", children: [_jsx("button", { className: `nav-link ${currentPage === 'home' ? 'active' : ''}`, onClick: () => navigate('/home'), children: language === 'th' ? 'หน้าแรก' : 'Home' }), userRole === 'teacher' ? (_jsx("button", { className: "nav-link", onClick: () => navigate('/create-classroom'), children: language === 'th' ? 'ห้องเรียนของฉัน' : 'My Classrooms' })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: `nav-link ${currentPage === 'question' ? 'active' : ''}`, onClick: () => navigate('/home/practice'), children: language === 'th' ? 'ฝึกฝน' : 'Practice' }), userRole === 'student' && (_jsx("button", { className: "nav-link", onClick: () => navigate('/join-classroom'), children: language === 'th' ? 'เข้าร่วมห้องเรียน' : 'Join Classroom' }))] })), _jsx("button", { className: "nav-link language-toggle", onClick: () => setLanguage(language === 'th' ? 'en' : 'th'), children: language === 'th' ? '🇬🇧 EN' : '🇹🇭 ไทย' }), _jsxs("div", { className: "user-menu", children: [_jsx("span", { className: "user-email", children: user?.displayName ? (_jsxs(_Fragment, { children: [_jsx("span", { style: { fontWeight: 'bold' }, children: user.displayName }), _jsx("br", {}), _jsx("small", { style: { opacity: 0.8 }, children: user.email })] })) : (user?.email) }), _jsx("button", { className: "nav-link logout-btn", onClick: handleLogout, children: language === 'th' ? '🚪 ออกจากระบบ' : '🚪 Logout' })] })] })] }) }), _jsx("main", { className: "app-main", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/home", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/practice", element: isLoadingProposition ? (_jsxs("div", { className: "loading-container", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: language === 'th' ? 'กำลังโหลดคำถาม...' : 'Loading question...' })] })) : proposition ? (_jsx(QuestionPage, { question: activeQuestion, studentId: studentId, proposition: proposition })) : (_jsxs("div", { className: "error-container", children: [_jsx("h2", { children: language === 'th' ? 'ไม่สามารถโหลดคำถามได้' : 'Cannot load question' }), _jsx("p", { children: language === 'th' ? 'กรุณาลองอีกครั้งหรือติดต่อผู้ดูแลระบบ' : 'Please try again or contact administrator' }), _jsx("button", { onClick: () => navigate('/home'), className: "btn btn-primary", children: language === 'th' ? 'กลับสู่หน้าหลัก' : 'Back to Home' })] })) }), _jsx(Route, { path: "/home/practice", element: isLoadingProposition ? (_jsxs("div", { className: "loading-container", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: language === 'th' ? 'กำลังโหลดคำถาม...' : 'Loading question...' })] })) : proposition ? (_jsx(QuestionPage, { question: activeQuestion, studentId: studentId, proposition: proposition })) : (_jsxs("div", { className: "error-container", children: [_jsx("h2", { children: language === 'th' ? 'ไม่สามารถโหลดคำถามได้' : 'Cannot load question' }), _jsx("p", { children: language === 'th' ? 'กรุณาลองอีกครั้งหรือติดต่อผู้ดูแลระบบ' : 'Please try again or contact administrator' }), _jsx("button", { onClick: () => navigate('/home'), className: "btn btn-primary", children: language === 'th' ? 'กลับสู่หน้าหลัก' : 'Back to Home' })] })) })] }) }), _jsx("footer", { className: "app-footer", children: _jsx("p", { children: "\u00A9 2026 PISA Insight Analyzer | AI-Powered Learning" }) })] }));
};
