import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { th, en } from '../i18n';
const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('th');
    const t = (key) => {
        const translations = language === 'th' ? th : en;
        return translations[key] || key;
    };
    return (_jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children: children }));
};
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
