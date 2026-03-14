import { FUNCTIONS_URL } from './api';
/**
 * Save a new proposition to the database
 */
export async function saveProposition(proposition) {
    try {
        const response = await fetch(`${FUNCTIONS_URL}/saveProposition`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proposition),
        });
        if (!response.ok) {
            throw new Error(`Failed to save proposition: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('✅ Proposition saved:', data.id);
        return data.id;
    }
    catch (error) {
        console.error('Error saving proposition:', error);
        throw error;
    }
}
/**
 * Get all propositions for a language
 */
export async function getPropositions(language = 'th') {
    try {
        const response = await fetch(`${FUNCTIONS_URL}/propositions?language=${language}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Failed to get propositions: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`✅ Found ${data.count} propositions for ${language}`);
        return data.propositions || [];
    }
    catch (error) {
        console.error('Error getting propositions:', error);
        return [];
    }
}
/**
 * Get a random proposition (useful for practice)
 */
export async function getRandomProposition(language = 'th') {
    try {
        const propositions = await getPropositions(language);
        if (propositions.length === 0) {
            console.warn('No propositions available for language:', language);
            return null;
        }
        const randomIndex = Math.floor(Math.random() * propositions.length);
        return propositions[randomIndex];
    }
    catch (error) {
        console.error('Error getting random proposition:', error);
        return null;
    }
}
/**
 * Default sample propositions (used for initialization)
 */
export const SAMPLE_PROPOSITIONS_TH = [
    {
        questionText: 'ในสถานการณ์ที่อากาศปนเปื้อน หมู่บ้านหนึ่งต้องการลดปริมาณควัน จะมีวิธีใดบ้าง? อธิบายข้อดีและข้อเสีย',
        difficulty: 'medium',
        category: 'critical-thinking',
        expectedAnswer: 'วิธีแก้ปัญหาควรครอบคลุมสาเหตุ เช่น การใช้พลังงานสะอาด การควบคุมการจราจร และการปลูกต้นไม้ พร้อมวิเคราะห์ผลกระทบ',
        language: 'th',
        scoringRubric: {
            excellent: {
                points: 3,
                description: 'ระบุหลายวิธีแก้ปัญหา วิเคราะห์ข้อดีข้อเสีย และเสนอแนวคิดใหม่'
            },
            good: {
                points: 2,
                description: 'ระบุ 2-3 วิธีแก้ปัญหา มีการวิเคราะห์พื้นฐาน'
            },
            fair: {
                points: 1,
                description: 'ระบุ 1-2 วิธีแก้ปัญหา แต่วิเคราะห์น้อย'
            }
        }
    },
    {
        questionText: 'ทำไมการศึกษาจึงสำคัญในการพัฒนาของประเทศ? ให้เหตุผลอย่างน้อย 3 ข้อ',
        difficulty: 'medium',
        category: 'analysis',
        expectedAnswer: 'การศึกษาช่วยพัฒนาทักษะแรงงาน ส่งเสริมนวัตกรรม เพิ่มคุณภาพชีวิต อลักษณ์ สำคัญต่อเศรษฐกิจและสังคม',
        language: 'th',
        scoringRubric: {
            excellent: {
                points: 3,
                description: 'ให้เหตุผล 3+ ข้อ โดยอธิบายอย่างละเอียดและมีตัวอย่าง'
            },
            good: {
                points: 2,
                description: 'ให้เหตุผล 3 ข้อ ชัดเจนแต่อธิบายสั้น'
            },
            fair: {
                points: 1,
                description: 'ให้เหตุผล 2 ข้อ หรือ 3 ข้อแต่อธิบายไม่ชัดเจน'
            }
        }
    },
    {
        questionText: 'สมมติคุณเป็นนักวิทยาศาสตร์คิดทำการศึกษาวิจัยเกี่ยวกับการเปลี่ยนแปลงสภาพภูมิอากาศ จะออกแบบการศึกษาวิจัยอย่างไร?',
        difficulty: 'hard',
        category: 'problem-solving',
        expectedAnswer: 'ควรมีคำถามวิจัย สมมติฐาน วิธีการเก็บข้อมูล ตัวแปร และแผนการวิเคราะห์ผล',
        language: 'th',
        scoringRubric: {
            excellent: {
                points: 3,
                description: 'ออกแบบการศึกษาวิจัยอย่างสมบูรณ์ มีขั้นตอนชัดเจน ตัวแปรที่เหมาะสม'
            },
            good: {
                points: 2,
                description: 'มีองค์ประกอบหลักของการวิจัย แต่บางส่วนยังไม่ชัดเจน'
            },
            fair: {
                points: 1,
                description: 'ระบุบางองค์ประกอบเท่านั้น'
            }
        }
    }
];
export const SAMPLE_PROPOSITIONS_EN = [
    {
        questionText: 'What strategies can countries use to reduce carbon emissions? Explain the pros and cons of each.',
        difficulty: 'medium',
        category: 'critical-thinking',
        expectedAnswer: 'Strategies should include renewable energy, public transport, and regulation. Should analyze trade-offs between cost and benefit.',
        language: 'en',
        scoringRubric: {
            excellent: {
                points: 3,
                description: 'Lists multiple strategies with detailed pros/cons and creative solutions'
            },
            good: {
                points: 2,
                description: 'Lists 2-3 strategies with basic analysis'
            },
            fair: {
                points: 1,
                description: 'Lists 1-2 strategies with minimal analysis'
            }
        }
    },
    {
        questionText: 'Why is education important for a country\'s development? Give at least 3 reasons.',
        difficulty: 'medium',
        category: 'analysis',
        expectedAnswer: 'Education develops workforce skills, promotes innovation, and improves quality of life. Critical for economic and social progress.',
        language: 'en',
        scoringRubric: {
            excellent: {
                points: 3,
                description: 'Provides 3+ detailed reasons with examples'
            },
            good: {
                points: 2,
                description: 'Provides 3 clear but brief reasons'
            },
            fair: {
                points: 1,
                description: 'Provides 2 reasons or 3 with unclear explanation'
            }
        }
    }
];
/**
 * Initialize sample propositions in database
 */
export async function initializeSamplePropositions() {
    try {
        console.log('Initializing sample propositions...');
        // Initialize Thai propositions
        for (const prop of SAMPLE_PROPOSITIONS_TH) {
            await saveProposition(prop);
        }
        // Initialize English propositions
        for (const prop of SAMPLE_PROPOSITIONS_EN) {
            await saveProposition(prop);
        }
        console.log('✅ Sample propositions initialized successfully');
    }
    catch (error) {
        console.error('Error initializing sample propositions:', error);
    }
}
